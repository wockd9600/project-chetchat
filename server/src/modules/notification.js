import webpush from 'web-push';
import dotenv from 'dotenv';

import { runQuery } from '../utils/database.js';
import { formatContentForHTML } from '../utils/htmlFormatter.js';

import logger from '../modules/logger.js';

import { user as USER_QUERY } from '../sql/query.js';

dotenv.config();


const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_EMAIL = process.env.VAPID_EMAIL;

const createChatRoomUrl = (room_uuid) => {
    return `/chat/room/${room_uuid}`;
};

const createPublicRoomUrl = (room_uuid) => {
    return `/${room_uuid}`;
};

const createPayload = ({ friend_name, nickname, message, icon_img, sanitizedRoomUUID, url }) => {
    const { message_type, content } = message;
    const body = message_type === 0 ? formatContentForHTML(content).replace(/< *\/?br *\/?>.*/i, '...').replace(/&nbsp;/g, ' ') :
                    message_type === 1 ? '사진' : '동영상';
    return {
        title: friend_name ? friend_name : nickname,
        body,
        icon: icon_img ? icon_img : '/img/default_profile.png',
        tag: sanitizedRoomUUID,
        data: {
            url,
        },
    };
};

const send = async (token, payload) => {
    try {
        const options = {
            TTL: 12 * 60 * 60, //TTL 내에 메시지가 전달되지 못할 경우 그냥 큐에서 메시지가 삭제됩니다.
            vapidDetails: {
                // subject: "http://localhost:8080", // 서버 주소
                subject: VAPID_EMAIL, // 서버 주소
                publicKey: VAPID_PUBLIC_KEY,
                privateKey: VAPID_PRIVATE_KEY,
            },
        };

        await webpush.sendNotification(JSON.parse(token), JSON.stringify(payload), options)
        return true;
    } catch (error) {
        throw new Error(error);
    }
};

export default {
    sendToUserInChat: async (conn, user, other_user_id, message, sanitizedRoomUUID) => {
        try {
            // 상대 유저의 디바이스 토큰이 없거나 알림을 받지 않는다면 false를 반환한다.
            const getUserSettingResult = await runQuery(conn, USER_QUERY['getUserSetting'], [other_user_id]);
            const { device_token, notification } = getUserSettingResult[0];
            if (!device_token || !notification) return false;

            const [getOtherUserInfoResult] = await runQuery(conn, USER_QUERY['getOtherUserInfo'], [other_user_id, user.id]);
            const { friend_name, nickname, profile_img } = getOtherUserInfoResult;
            
            const payload = createPayload({
                friend_name,
                nickname,
                message,
                icon_img: profile_img,
                sanitizedRoomUUID,
                url: createChatRoomUrl(sanitizedRoomUUID),
            });

            await send(device_token, payload);
        } catch (error) {
            logger.error(`sendToUserInChat (${user.id}) (${other_user_id}) ${sanitizedRoomUUID}, ${error.message}`);
            return;
        }
    },
    sendToUserInPublicChat: async (conn, message, publicInfo) => {
        try {
            const { name, uuid, user_id } = publicInfo;

            // 사용자의 디바이스 토큰이 없거나 알림을 받지 않는다면 false를 반환한다.
            const getUserSettingResult = await runQuery(conn, USER_QUERY['getUserSetting'], [user_id]);
            const { device_token, notification } = getUserSettingResult[0];
            if (!device_token || !notification) return false;




            const payload = createPayload({
                nickname: name,
                message,
                icon_img: '/images/default_profile.png', // *수정 편지 이미지로 변경
                room_uuid: uuid,
                url: createPublicRoomUrl(uuid),
            });

            await send(device_token, payload);
        } catch (error) {
            logger.error(`sendToUserInPublicChat ${publicInfo.uuid}, ${error.message}`);
            return;
        }
    },
}