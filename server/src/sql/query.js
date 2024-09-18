// WHERE user_id = ?
//     AND friendship_id > (
//         SELECT friendship_id
//                                 FROM friendships
//                                 WHERE user_id = 1
//                                 ORDER BY friend_name ASC
//                                 LIMIT 30
//                                 OFFSET 0
//                             )
//                             AND friendship_id <= (
//     SELECT friendship_id
//                                 FROM friendships
//                                 WHERE user_id = 1
//                                 ORDER BY friend_name ASC
//                                 LIMIT 30
// OFFSET(0 + 1) * 30
//                             )
// index를 활용해서 페이징 하는 방법
// export default {
export const log = {
    login: `INSERT INTO log_login SET ?`,
    token: `INSERT INTO token_error_logs SET ?`,
    system: `INSERT INTO system_error_logs SET ?`,
    room: `INSERT INTO log_room SET ?`,
    game: `INSERT INTO log_game SET ?`,
};


export const login = {
    // login
    getUser: `select * from user`,

    getMyInfo: `select u.id
                    , u.email
                    , up.nickname
                    , up.image_url AS profile_img
                    , up.status_message
                    , ua.user_uuid
                FROM user AS u
                INNER JOIN user_profile AS up
                ON u.id = up.user_id
                INNER JOIN user_anonymous AS ua
                ON u.id = ua.user_id
                WHERE u.id = ?
            `,
    getMySetting: `SELECT friend_request, direct_message, notification FROM user_setting WHERE user_id = ?`,


    getPublicInfo: `SELECT pr.uuid AS room_uuid
                            , pr.name
                            , pr.is_read
                            , pr.notification
                            , pr.visit
                            , CASE WHEN ISNULL(pm.is_delete)
                                    THEN IFNULL(pm.content, '사진')
                                    ELSE '삭제된 메시지입니다.'
                                    END AS last_content
                            , pm.created_at AS last_content_time
                        FROM public_room AS pr
                        LEFT JOIN public_message AS pm
                        ON pr.last_message_id = pm.id
                        WHERE pr.user_id = ?;
                        `,

    getLoginAttemptCount: `SELECT attempt
                                FROM log_login
                                WHERE user_id = ?
                                ORDER BY created_at
                                DESC LIMIT 1;`,
    getLastLoginAttemptTime: `SELECT TIMESTAMPDIFF(MINUTE, created_at, NOW()) AS time_difference_in_minutes
                                    FROM log_login
                                    WHERE user_id = ?
                                    ORDER BY created_at DESC
                                    LIMIT 1;`,



    addUser: `INSERT INTO user SET ?`,
    addUserProfile: `INSERT INTO user_profile SET ?`,
    addUserSetting: `INSERT INTO user_setting SET ?`,
    addUserAnonymous: `INSERT INTO user_anonymous SET ?`,
    addPublicRoom: `INSERT INTO public_room SET ?`,
    addPublicSetting: `INSERT INTO public_setting SET ?`,

    setRefreshToken: `UPDATE user SET ? WHERE id = ?`,
};

export const user = {
    /* GET */
    getUserAnonymous: `SELECT user_uuid FROM user_anonymous WHERE user_id = ?`,
    getUserIDForUUID: `SELECT user_id FROM user_anonymous WHERE user_uuid = ?`,
    getUserIDForEmail: `SELECT id FROM user WHERE email = ?`,
    getUserStatus: `SELECT status FROM user WHERE id = ?`,

    getUserInfoWithProfile: `SELECT u.id
                                , u.email
                                , up.nickname
                                , up.image_url AS profile_img
                                , up.status_message
                            FROM user AS u
                            INNER JOIN user_profile AS up
                            ON u.id = up.user_id
                            WHERE u.id = ?
                        `,

    getFriendsList: `SELECT f.friend_name
                        , up.nickname
                        , f.bookmarked
                        , up.image_url AS profile_img
                        , up.status_message
                        , u.email
                        , pr.uuid AS public_room_uuid
                    FROM (
                        SELECT f.*
                        FROM (SELECT * FROM friendships WHERE user_id = ?) AS f
                        INNER JOIN user AS u
                        ON f.friend_id = u.id
                        WHERE u.status != 1
                    ) as f
                    INNER JOIN user_profile AS up
                    ON f.friend_id = up.user_id
                    INNER JOIN user AS u
                    ON f.friend_id = u.id
                    INNER JOIN public_room AS pr
                    ON f.friend_id = pr.user_id
                    ORDER BY COALESCE(NULLIF(f.friend_name, ''), up.nickname) ASC
                `,


    getOtherUserInfo: `SELECT u.email
                                , u.status
                                , f.friend_name
                                , up.nickname
                                , up.image_url AS profile_img
                                , up.status_message
                                , f.bookmarked
                            FROM user AS u
                            INNER JOIN user_profile AS up
                            ON u.id = up.user_id
                            LEFT JOIN friendships AS f
                            ON f.user_id = ? AND f.friend_id = u.id
                            WHERE u.id = ?
                        `,


    getRelationship: `SELECT CASE
                                    WHEN EXISTS (
                                                    SELECT *
                                                    FROM user
                                                    WHERE id = ?
                                                        AND id = ?
                                    ) THEN 3
                                    WHEN EXISTS (
                                                    SELECT *
                                                    FROM friendships
                                                    WHERE user_id = ? AND friend_id = ?
                                                ) THEN 2
                                    ELSE 1
                                END AS result;
                        `,

    getUserSetting: `SELECT user_id
                                , friend_request
                                , direct_message
                                , notification
                                , device_token
                            FROM user_setting
                            WHERE user_id = ?
                        `,

    getBlockList: `SELECT COALESCE(NULLIF(b.blocked_id, ''), b.blocked_uuid) AS id
                            , COALESCE(NULLIF(up.nickname, ''), '익명') AS nickname
                            , up.image_url AS profile_img
                        FROM block AS b
                        LEFT JOIN user_profile AS up
                        ON b.blocked_id = up.user_id
                        WHERE blocker_id = ?
                    `,

    // SELECT cr.*
    //                 FROM chat_room AS cr
    //                 INNER JOIN user_chat_room AS ucr
    //                 ON cr.id = ucr.room_id
    //                 WHERE ucr.user_id != ? AND cr.uuid = ?

    /* ADD */
    addFriendship: `INSERT INTO friendships SET ?`,
    addBlockUser: `INSERT INTO block SET ?`,
    reportUser: `INSERT INTO report SET ?`,


    /* SET */
    setUserSetting: `UPDATE user_setting SET ? WHERE user_id = ?`,
    setUserProfile: `UPDATE user_profile SET ? WHERE user_id = ?`,
    setFriendships: `UPDATE friendships SET ? WHERE user_id = ? AND friend_id = ?`,


    /* DELETE */
    deleteFriendship: `DELETE FROM friendships WHERE user_id = ? AND friend_id = ?`,
    deleteBlockedUserForID: `DELETE FROM block WHERE blocker_id = ? AND blocked_id = ?`,
    deleteBlockedUserForUUID: `DELETE FROM block WHERE blocker_id = ? AND blocked_uuid = ?`,
};

export const chat = {
    /* GET */
    getChatRoomList: `SELECT d.*
                                , m.content AS last_content
                                , CASE
                                    WHEN m.message_type = 1 THEN '사진'
                                    WHEN m.message_type = 2 THEN '동영상'
                                    ELSE m.content
                                    END AS last_content
                                , m.created_at AS last_content_time
                            FROM (
                                SELECT ucr.is_read
                                    , ucr.notification
                                    , cr.last_message_id
                                    , cr.uuid AS room_uuid
                                    , nickname
                                    , friend_name
                                    , up.image_url AS profile_img
                                    , u.email
                                FROM (
                                        SELECT my_chat_room.*
                                            , ucr.user_id AS friend_id
                                        FROM (
                                                SELECT *
                                                FROM user_chat_room
                                                WHERE user_id = ?
                                                    AND ISNULL(is_leave)
                                            ) AS my_chat_room
                                        LEFT JOIN user_chat_room AS ucr
                                        ON my_chat_room.user_id != ucr.user_id
                                            AND my_chat_room.room_id = ucr.room_id
                                    ) AS ucr
                                INNER JOIN chat_room AS cr
                                ON ucr.room_id = cr.id
                                INNER JOIN user_profile AS up
                                ON ucr.friend_id = up.user_id
                                INNER JOIN user AS u
                                ON ucr.friend_id = u.id
                                LEFT JOIN friendships AS f
                                ON ucr.user_id = f.user_id AND ucr.friend_id = f.friend_id
                                ) as d
                            LEFT JOIN message AS m
                            ON d.last_message_id = m.id
                            ORDER BY last_content_time DESC
                        LIMIT ? OFFSET ?
                        `,

    getChatInfo: `SELECT cr.id
                            , cr.uuid
                            , IFNULL(ucr.readable_message_id, 0) AS readable_message_id
                            , cr.last_message_id
                        FROM chat_room AS cr
                        INNER JOIN user_chat_room AS ucr
                        ON cr.id = ucr.room_id
                        WHERE ucr.user_id = ?
                            AND cr.uuid = ?
                            AND ISNULL(ucr.is_leave)
                    `,
    getChatProfileInfo: `SELECT cr.id
                                , cr.uuid
                                , f.friend_name
                                , up.nickname
                                , up.image_url AS profile_img
                                , up.status_message
                                , u.email
                                , IFNULL(ucr.readable_message_id, 0) AS readable_message_id
                            FROM chat_room AS cr
                            INNER JOIN user_chat_room AS ucr
                            ON cr.id = ucr.room_id
                            INNER JOIN user_profile AS up
                            ON ucr.user_id = up.user_id
                            LEFT JOIN friendships AS f
                            ON ucr.user_id = f.friend_id
                            LEFT JOIN user AS u
                            ON cr.id = u.id
                            WHERE ucr.user_id != ?
                                AND cr.id = ?
                                `,
    getIsChattingAwithB: `SELECT cr.*
                                    , is_leave
                                FROM user_chat_room AS ucr
                                INNER JOIN (
                                            SELECT cr.*
                                            FROM user_chat_room AS ucr
                                            INNER JOIN chat_room AS cr
                                            ON ucr.room_id = cr.id
                                            WHERE ucr.user_id = ? AND ISNULL(cr.type)
                                        ) AS cr
                                ON ucr.room_id = cr.id
                                WHERE ucr.user_id = ?
                                `,
    getChatMessage: `SELECT m.id
                                , m.sender_id
                                , CASE WHEN ISNULL(rm.is_delete)
                                    THEN rm.id
                                    ELSE 0
                                    END AS reply_id
                                , CASE WHEN ISNULL(rm.is_delete)
                                    THEN IFNULL(rm.content, '사진')
                                    ELSE '삭제된 메시지입니다.'
                                    END AS reply_content
                                , m.message_type
                                , IFNULL(m.content, '사진') AS content
                                , m.image_url
                                , CASE WHEN m.sender_id = ?
                                    THEN 1
                                    ELSE 0
                                    END AS is_my_message    
                                , m.created_at
                            FROM message AS m
                            LEFT JOIN message AS rm
                            ON m.reply_id = rm.id
                            WHERE m.room_id = ? AND m.id > ? AND ISNULL(m.is_delete)
                            ORDER BY m.id DESC
                            LIMIT ? OFFSET ?
                            `,
    getChatRoomUsers: `SELECT ucr.user_id
                                    FROM chat_room AS cr
                                    INNER JOIN user_chat_room AS ucr
                                    ON cr.id = ucr.room_id
                                    WHERE ucr.user_id != ? AND cr.uuid = ?
                            `,
    getLastMessage: `SELECT id
                            , content
                            , message_type
                            , created_at
                        FROM message
                        WHERE room_id = ? AND ISNULL(is_delete)
                        ORDER BY created_at DESC
                        LIMIT 2
                    `,

    getBlockList: `SELECT * FROM block WHERE blocker_id = ? ORDER BY id DESC`,


    checkUserInChatRoom: `SELECT cr.*
                                    , ucr.is_leave
                                FROM chat_room AS cr
                                INNER JOIN user_chat_room AS ucr
                                ON cr.id = ucr.room_id
                                WHERE ucr.user_id = ? AND cr.uuid = ?
                            `,
    checkOtherUserInChatRoom: `SELECT cr.*
                                        , ucr.is_leave
                                    FROM chat_room AS cr
                                    INNER JOIN user_chat_room AS ucr
                                    ON cr.id = ucr.room_id
                                    WHERE ucr.user_id != ? AND cr.uuid = ?
                                `,
    checkMessageInChatRoom: `SELECT *
                                FROM message
                                WHERE id = ?
                                    AND room_id = ?
                            `,
    checkLastMessageInChatRoom: `SELECT id
                                    FROM message
                                    WHERE room_id = ? AND ISNULL(is_delete)
                                    LIMIT 2
                                `,
    countChatRoomUser: `SELECT count(user_id) AS count
                            FROM user_chat_room
                            WHERE room_id = ?
                                AND ISNULL(is_leave)
                        `,




    /* ADD */
    addChatRoom: `INSERT INTO chat_room SET ?`,
    addChatMessage: `INSERT INTO message SET ?`,
    addUserChatRoom: `INSERT INTO user_chat_room SET ?`,



    /* SET */
    setChatRoomLastMessage: `UPDATE chat_room
                                    SET ?
                                    WHERE id = ?
                                    `,
    setUserChatRoomData: `UPDATE user_chat_room
                                    SET ?
                                    WHERE user_id = ?
                                        AND room_id = ?
                                    `,



    /* DELETE */
    deleteChatMessage: `UPDATE message SET ? WHERE id = ?`,

    deleteChatRoom: `DELETE FROM chat_room WHERE id = ?`,
    deleteUserChatRoom: `DELETE FROM user_chat_room WHERE room_id = ?`,
};

export const public_room = {
    /* GET */
    getPublicIDFoRUUID: `SELECT id, user_id, last_message_id FROM public_room WHERE uuid = ?`,
    getPublicIDFoRUserID: `SELECT id, uuid FROM public_room WHERE user_id = ?`,

    getPublicInfo: `SELECT pr.uuid AS room_uuid
                            , pr.name
                            , ps.question_range
                            , ps.open_profile
                        FROM public_room AS pr
                        INNER JOIN public_setting AS ps
                        ON pr.id = ps.room_id
                        WHERE pr.id = ?;
                        `,
    getPublicInfoWithUserID: `SELECT pr.id
                                    , pr.uuid
                                    , pr.user_id
                                    , pr.name
                                    , ps.question_range
                                    , ps.open_profile
                                FROM public_room AS pr
                                INNER JOIN public_setting AS ps
                                ON pr.id = ps.room_id
                                WHERE pr.id = ?;
                                `,
    getPublicMessage: `SELECT id
                                , room_id
                                , sender_uuid
                                , COALESCE(reply_id, id) AS reply_id
                                , message_type
                                , IFNULL(content, '사진') AS content
                                , image_url
                            FROM public_message
                            WHERE room_id = ? AND ISNULL(is_delete)
                            ORDER BY COALESCE(reply_id, id) DESC, id DESC
                            LIMIT ? OFFSET ?
                            `,
    getMyPublicRoomForSetting: `SELECT pr.id
                                        , pr.uuid
                                        , pr.name
                                        , ps.question_range
                                        , ps.open_profile
                                    FROM public_room AS pr
                                    INNER JOIN public_setting AS ps
                                    ON pr.id = ps.room_id
                                    WHERE pr.user_id = ?;
                                    `,

    getMyPublicRoomForBlockWords: `SELECT *
                                        FROM block_word
                                        WHERE room_id = ?
                                        `,

    getLastMessage: `SELECT id
                            , content
                            , message_type
                            , created_at
                        FROM public_message
                        WHERE room_id = ? AND ISNULL(is_delete)
                        ORDER BY created_at DESC
                        LIMIT 1
                    `,

    getBlockList: `SELECT * FROM block WHERE blocker_id = (SELECT user_id FROM public_room WHERE uuid =?)`,

    getTotalQuestion: `SELECT COUNT(*) AS total_question
                        FROM public_message
                        WHERE room_id = ?
                            AND sender_uuid != ?
                            AND ISNULL(is_delete)`,

    checkMessageInPublicRoom: `SELECT * FROM public_message WHERE room_id = ? AND id = ?`,


    /* ADD */
    addPublicMessage: `INSERT INTO public_message SET ?`,
    addPublicRoomBlockWord: `INSERT INTO block_word SET ?`,


    /* SET */
    setPublicRoom: `UPDATE public_room
                        SET ?
                        WHERE id = ?
                        `,
    setPublicRoomLastMessage: `UPDATE public_room
                                    SET ?
                                    WHERE id = ?
                                    `,
    setPublicRoomSetting: `UPDATE public_setting
                                SET ?
                                WHERE room_id = ?
                            `,
    addPublicRoomVisitNumber: `UPDATE public_room SET visit = visit + 1 WHERE uuid = ? `,

    /* DELETE */
    deletePublicMessage: `UPDATE public_message SET ? WHERE id = ?`,
    deletePublicMessageAll: `UPDATE public_message SET ? WHERE room_id = ?`,
    deletePublicRoomBlockWord: `DELETE FROM block_word
                                        WHERE room_id = ?
                                        AND id = ?
                                `,


    /* BOOLEAN */
    // ['모두', '로그인한 사람', '친구 추가한 사람', '허용 안함']
    getRelationshipPublicRoomWithMe: ` SELECT CASE
                                                        WHEN EXISTS (
                                                                        SELECT *
                                                                        FROM public_room
                                                                        WHERE user_id = ?
                                                                            AND id = ?
                                                                    ) THEN 3
                                                        WHEN EXISTS (
                                                                        SELECT *
                                                                        FROM friendships AS f
                                                                        INNER JOIN public_room AS pr ON f.friend_id = pr.user_id
                                                                        WHERE f.user_id = ? AND pr.id = ?
                                                                    ) THEN 2
                                                        ELSE 1
                                                    END AS result;
                                        `,
};

export const blind = {
    /* GET */
    getBlindInfo: `SELECT *
                    FROM blind_room
                    WHERE ISNULL(status)
                        AND (waiting_user_uuid = ? OR entered_user_uuid = ?)
                    `,
    getBlindInfoForReport: `SELECT id
                            FROM blind_room
                            WHERE (waiting_user_uuid = ? OR entered_user_uuid = ?)
                            ORDER BY created_at DESC
                            LIMIT 1;
                            `,
    getBlindMessage: `SELECT *
                            , 0 AS message_type
                            FROM blind_message
                            WHERE room_id = ?
                            ORDER BY id DESC
                            LIMIT 30
                        `,
    getWaitingUser: `SELECT * FROM match_waiting LIMIT 1`,
    getReplyMessageInfo: `SELECT *
                                FROM blind_message
                                WHERE id = ?
                                    AND room_id = ?
                            `,
    checkIsMatching: `SELECT * FROM match_waiting WHERE user_uuid = ? `,
    checkIsFriends: `SELECT * FROM friendships WHERE user_id = ? AND friend_id = ?`,



    /* ADD */
    addMatchWaiting: `INSERT INTO match_waiting SET ?`,
    addBlindRoom: `INSERT INTO blind_room SET ?`,
    addBlindMessage: `INSERT INTO blind_message SET ?`,



    /* SET */
    leaveBlindRoom: `UPDATE blind_room SET ? WHERE ISNULL(status) AND (waiting_user_uuid = ? OR entered_user_uuid = ?)`,



    /* DELETE */
    deleteMatchWaiting: `DELETE FROM match_waiting WHERE user_uuid = ?`,
};
// }