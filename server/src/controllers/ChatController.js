"use strict";
class ChatController {
    /* GET */
    async initChatRoom(req, res) {}

    async getMessageInChatRoom(req, res) {}

    async getChatRoomList(req, res) {}

    /* INSERT */
    async sendMessage(req, res) {
        const user = req.user;
        const { message, room_uuid } = req.body;

        await runTransaction(async (conn) => {
            // 1. 클라이언트에게 전달 받은 데이터에 문제가 없는지 확인
            if (!isValidObject(message) || !isValidParam(room_uuid) || !isValidMessage(message.content)) throw new Error("Invalid parameter");

            const sanitizedRoomUUID = sanitizeHtml(room_uuid);
            const sanitizedReplyID = message.reply_id ? sanitizeHtml(message.reply_id) : null;

            // 2. 자신과 상대방의 채팅방 정보를 가져옴.
            const [checkUserInChatRoomResult, checkOtherUserInChatRoomResult, getChatRoomUsersResult] = await Promise.all([
                await runQuery(conn, CHAT_ROOM_QUERY["checkUserInChatRoom"], [user.id, sanitizedRoomUUID]),
                await runQuery(conn, CHAT_ROOM_QUERY["checkOtherUserInChatRoom"], [user.id, sanitizedRoomUUID]),
                await runQuery(conn, CHAT_ROOM_QUERY["getChatRoomUsers"], [user.id, sanitizedRoomUUID]),
            ]);
            const room_id = checkUserInChatRoomResult[0].id;
            const other_user_id = getChatRoomUsersResult[0].user_id;

            const [getUserStatus] = await runQuery(pool, USER_QUERY["getUserStatus"], [other_user_id]);

            if (getUserStatus.status) throw new Error("탈퇴한 계정");

            // 보낸 사람이 채팅방에 없으면 에러가 맞는데 일단 채팅방이 다시 생기는 걸로 하자
            if (checkUserInChatRoomResult[0].is_leave) {
                const setUserChatRoomDataResult = await runQuery(conn, CHAT_ROOM_QUERY["setUserChatRoomData"], [{ is_leave: null }, user.id, sanitizedRoomUUID]);
            }

            const [getMyBlockListResult] = await pool.query(CHAT_ROOM_QUERY["getBlockList"], [user.id]);
            const [getOtherBlockListResult] = await pool.query(CHAT_ROOM_QUERY["getBlockList"], [other_user_id]);

            // 차단 당하면 메시지 전송 불가능
            if (getMyBlockListResult.length !== 0) {
                const isBlocked = getMyBlockListResult.some((obj) => obj.blocked_id === other_user_id);
                if (isBlocked) return res.json({ success: false, message: "차단한 유저입니다." });
            }

            if (getOtherBlockListResult.length !== 0) {
                const isBlocked = getOtherBlockListResult.some((obj) => obj.blocked_id === user.id);
                if (isBlocked) return res.json({ success: false, message: "알수 없는 유저입니다." });
            }

            // 3. 현재 채팅방에 없는 메시지에 답글 방지
            let checkMessageInChatRoomResult;
            if (sanitizedReplyID) checkMessageInChatRoomResult = await runQuery(conn, CHAT_ROOM_QUERY["checkMessageInChatRoom"], [sanitizedReplyID, room_id]);

            // 4. DB에 메시지 저장
            const sanitizedMessageObj = getChatObj.sanitizedMessageObj(room_id, user.id, sanitizedReplyID, message);
            const addChatMessageResult = await runQuery(conn, CHAT_ROOM_QUERY["addChatMessage"], [sanitizedMessageObj]);

            const message_id = addChatMessageResult.insertId;

            // 4. 채팅방의 마지막 메시지(last_message_id), 보낸 유저의 읽음 처리(is_read)
            const [setChatRoomLastMessageResult, setUserChatRoomDataResult] = await Promise.all([
                await runQuery(conn, CHAT_ROOM_QUERY["setChatRoomLastMessage"], [{ last_message_id: message_id }, room_id]),
                await runQuery(conn, CHAT_ROOM_QUERY["setUserChatRoomData"], [{ is_read: 1 }, user.id, room_id]),
            ]);

            // 상대방이 해당 채팅방에 없으면 활성화
            if (checkOtherUserInChatRoomResult[0].is_leave) {
                const other_user_id = getChatRoomUsersResult[0].user_id;
                const setUserChatRoomDataResult = await runQuery(conn, CHAT_ROOM_QUERY["setUserChatRoomData"], [{ is_leave: null }, other_user_id, room_id]);
            }

            // 6. 채팅 중인 유저에게 메시지 보내기
            const other_user_socket_info_in_redis = await redisClient.get(`socket-${other_user_id}`);

            if (other_user_socket_info_in_redis) {
                const other_user_socket_info = JSON.parse(other_user_socket_info_in_redis);

                const io = req.app.get("io");

                if (other_user_socket_info.location === `chat-room-${sanitizedRoomUUID}`) {
                    // 유저가 채팅방에 있을 경우 읽음 처리
                    await runQuery(conn, CHAT_ROOM_QUERY["setUserChatRoomData"], [{ is_read: 1 }, other_user_id, room_id]);
                    io.to(other_user_socket_info.id).emit("received message in chat room", getChatObj.receivedMessageInChatRoom(message_id, sanitizedRoomUUID, checkMessageInChatRoomResult, sanitizedMessageObj));
                } else {
                    // 유저가 로비에 있을 경우 새로운 메시지
                    await notification.sendToUserInChat(conn, user, other_user_id, message, sanitizedRoomUUID);

                    await runQuery(conn, CHAT_ROOM_QUERY["setUserChatRoomData"], [{ is_read: 0 }, other_user_id, room_id]);

                    // 상대방이 해당 채팅방에 없으면 활성화
                    if (checkOtherUserInChatRoomResult[0].is_leave) {
                        const [getMyInfoResult] = await runQuery(conn, USER_QUERY["getUserInfoWithProfile"], [user.id]);

                        io.to(other_user_socket_info.id).emit("received new chat", { ...getChatObj.newChatRoomLastInfo(sanitizedRoomUUID, sanitizedMessageObj, getMyInfoResult) });
                    } else {
                        io.to(other_user_socket_info.id).emit("received message in lobby", getChatObj.chatRoomLastInfo(sanitizedRoomUUID, sanitizedMessageObj));
                    }
                }
            } else {
                await notification.sendToUserInChat(conn, user, other_user_id, message, sanitizedRoomUUID);
            }

            return res.json({
                success: true,
                id: message_id,
                last_content_time: getCurrentTime(),
            });
        }).catch((error) => {
            logger.error(`${req.method} ${req.url} (${user.id}) ${req.ip} ${room_uuid}, ${message} ${error}`);
            return res.json({ error: true, message: "메시지를 보낼 수 없습니다." });
        });
    }

    async sendMessageOfImageType(req, res) {
        const user = req.user;
        const { message, room_uuid } = req.body;

        await runTransaction(async (conn) => {
            // 1. 클라이언트에게 전달 받은 데이터에 문제가 없는지 확인

            // 2. 자신과 상대방의 채팅방 정보를 가져옴.

            // 보낸 사람이 채팅방에 없으면 에러가 맞는데 일단 채팅방이 다시 생기는 걸로 하자

            // 차단 당하면 메시지 전송 불가능

            // 4. DB에 메시지 저장

            // 5. 채팅방의 마지막 메시지(last_message_id), 보낸 유저의 읽음 처리(is_read)

            // 상대방이 해당 채팅방에 없으면 활성화

            // ---------- 임시 이미지 테이블에서 업데이트 완료로 변경 ---------
            // ****************
            // *              *
            // * 발생했던 문제들  *
            // *              *
            // ****************
            const [temp] = await conn.query("UPDATE temporary_image SET ? WHERE image_url = ?", [{ is_complete: 1 }, message.image_url]);

            // 6. 채팅 중인 유저에게 메시지 보내기
            // 유저가 채팅방에 있을 경우 읽음 처리
            // 유저가 로비에 있을 경우 새로운 메시지
            // 상대방이 해당 채팅방에 없으면 활성화
        }).catch((error) => {});
    }

    async createChatRoom(req, res) {}

    /* DELETE */
    async deleteMessage(req, res) {}

    async deleteChatRoom(req, res) {}
}

export default ChatController;
