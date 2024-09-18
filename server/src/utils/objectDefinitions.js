import sanitizeHtml from 'sanitize-html';
import { formatContentForHTML, getCurrentTime } from '../utils/htmlFormatter.js';

export const getChatObj = {
    // send message
    sanitizedMessageObj: (room_id, sender_id, reply_id, message) => {
        return {
            room_id,
            sender_id,
            reply_id,
            content: sanitizeHtml(formatContentForHTML(message.content)),
        }
    },
    sanitizedMessageTypeFileObj: (room_id, sender_id, message) => {
        return {
            room_id,
            sender_id,
            image_url: sanitizeHtml(message.image_url),
            message_type: message.message_type
        }
    },
    chatRoomLastInfo: (room_uuid, sanitizedMessageObj, currentTime = getCurrentTime()) => {
        return {
            room_uuid,
            last_content: sanitizedMessageObj.content,
            last_content_time: currentTime,
        }
    },
    chatRoomUserInfo: (user_id, user) => {
        return {
            email: user.email,
            friend_name: user.friend_name,
            user_id: user_id,
            nickname: user.nickname,
            profile_img: user.profile_img,
        }
    },
    newChatRoomLastInfo: (room_uuid, sanitizedMessageObj, getMyInfoResult) => {
        return {
            room_uuid,
            email: getMyInfoResult.email,
            nickname: getMyInfoResult.nickname,
            profile_img: getMyInfoResult.profile_img,
            last_content: sanitizedMessageObj.content,
            last_content_time: getCurrentTime(),
            is_read: false,
        }
    },
    receivedMessageInChatRoom: (message_id, room_uuid, arg_reply_info, sanitizedMessageObj) => {
        const { room_id, reply_id, ...filteredObj } = sanitizedMessageObj;
        const reply_info = arg_reply_info ? arg_reply_info[0] : null;

        return {
            message: {
                ...filteredObj,
                reply_id: sanitizedMessageObj.reply_id ? sanitizedMessageObj.reply_id : null,
                reply_content: reply_info ? reply_info.content : '',
                id: message_id,
                message_type: 0,
                is_my_message: false,
            },
            room_uuid,
            last_content: sanitizedMessageObj.content,
            last_content_time: getCurrentTime(),
        }
    },
    receivedMessageTypeFileInChatRoom: (message_id, room_uuid, sanitizedMessageObj) => {
        const { room_id, ...filteredObj } = sanitizedMessageObj;

        return {
            message: {
                ...filteredObj,
                id: message_id,
                is_my_message: false,
                content: filteredObj.message_type === 1 ? '사진' : '동영상',
            },
            room_uuid,
            last_content: sanitizedMessageObj.content,
            last_content_time: getCurrentTime(),
        }
    },
}


export const getPublicObj = {
    publicInitData: (arg_publicInfo, publicMessage, relation, isBlocked) => {
        const publicInfo = {
            ...arg_publicInfo,
            relation,
            isBlocked,
        }

        return {
            publicInfo,
            publicMessageList: publicMessage.reverse(),
        }
    },
    sanitizedMessageObj: (room_id, sender_uuid, reply_id, message) => {
        return {
            room_id,
            sender_uuid,
            reply_id,
            content: sanitizeHtml(formatContentForHTML(message.content)),
        }
    },
    sanitizedMessageTypeFileObj: (room_id, sender_uuid, message) => {
        return {
            room_id,
            sender_uuid,
            image_url: sanitizeHtml(message.image_url),
            message_type: 1,
        }
    },
    receivedMessageOfPublic: (sanitizedMessageObj) => {
        return {
            last_content: sanitizedMessageObj.content ?
                            sanitizedMessageObj.content :
                            sanitizedMessageObj.message_type === 1 ? '사진' : '동영상',
            last_content_time: getCurrentTime(),
        }
    },
    receivedMessageInPublicRoom: (public_message_id, sanitizedMessageObj,) => {
        const { reply_id, ...filteredObj } = sanitizedMessageObj
        return {
            ...filteredObj,
            reply_id: reply_id ? reply_id : public_message_id,
            id: public_message_id,
        }
    },
    receivedMessageTypeFileInPublicRoom: (message_id, sanitizedMessageObj) => {
        const { room_id, ...filteredObj } = sanitizedMessageObj;

        return {
            ...filteredObj,
            id: message_id,
            is_my_message: false,
            message_type: 1,
            content: '사진',
        }
    },
}

export const getBlindObj = {
    // send message
    sanitizedMessageObj: (room_id, sender_uuid, reply_id, message) => {
        return {
            room_id,
            sender_uuid,
            reply_id,
            content: sanitizeHtml(formatContentForHTML(message.content)),
        }
    },
}