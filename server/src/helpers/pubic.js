import { runQuery } from '../utils/database.js';
import { public_room as PUBLIC_ROOM_QUERY, user as USER_QUERY, } from '../sql/query.js';

const getRelationshipWithPublicRoom = async (conn, user, room_id) => {
    // 비로그인(0) 로그인(1) 친구(2) 나(3)
    if (!user || !user.id) return 0

    try {
        // 비로그인이 아니라면 쿼리로 관계 확인
        const getRelationshipPublicRoomWithMeResult = await runQuery(conn, PUBLIC_ROOM_QUERY['getRelationshipPublicRoomWithMe'], [user.id, room_id, user.id, room_id]);
        return getRelationshipPublicRoomWithMeResult[0].result
    } catch (error) {
        throw error;
    }
}

const getSenderUUID = async (conn, relationship, room_uuid, user) => {
    if (!relationship || relationship === 0) return null;
    else if (relationship === 3) return room_uuid;
    else {
        try {
            const getUserAnonymousResult = await runQuery(conn, USER_QUERY['getUserAnonymous'], [user.id]);
            return getUserAnonymousResult[0].user_uuid
        } catch (error) {
            throw error;
        }
    }
}

export {
    getRelationshipWithPublicRoom,
    getSenderUUID
}