const EXCEPTION_ERROR_MESSAGE = '알 수 없는 에러입니다. 문의해 주세요.';
const INVALID_ACCESS_ERROR = '잘못된 접근입니다.';
const INVALID_ACCESS_URL = '잘못된 주소입니다.';
const INVALID_PARAMS = '잘못된 입력입니다.';
const DONT_HAVE_PERMISSION = '권한이 없습니다.';

export const LOGIN_ERROR = {
    KAKAO_USER_INFO: { code: 11, message: 'can\'t kakao user info from auth code' },
    EXCEPTION: { code: 19, message: 'exception error' },
};

export const TOKEN_ERROR = {
    NOT_EXIST: { code: 21, message: 'not exist token' },
    INVALID: { code: 22, message: 'Invalid token' },
    EXPIRE: { code: 23, message: 'token is expired' },
    EXCEPTION: { code: 29, message: 'exception error' },
};

export const REFRESH_ERROR = {
    NOT_EXIST: { code: 31, message: 'not exist token' },
    INVALID_ACCESS_TOKEN: { code: 32, message: 'Invalid access token' },
    INVALID_REFRESH_TOKEN: { code: 33, message: 'Invalid refresh token' },
    EXCEPTION: { code: 39, message: 'exception error' },
};

export const SOCKET_ERROR = {
    DISCONNECT: { EXCEPTION: { code: 101, message: EXCEPTION_ERROR_MESSAGE } },

    /*
     *
     *
     * 
     *   USER
     * 
     * 
     * 
     */

    /* INIT */
    INIT: { EXCEPTION: { code: 102, message: EXCEPTION_ERROR_MESSAGE } },
    FRIENDS_LIST_INIT: { EXCEPTION: { code: 103, message: EXCEPTION_ERROR_MESSAGE }, },
    MY_SETTING_INIT: { EXCEPTION: { code: 104, message: EXCEPTION_ERROR_MESSAGE }, },
    BLOCK_LIST_INIT: { EXCEPTION: { code: 105, message: EXCEPTION_ERROR_MESSAGE }, },
    SEARCH_INIT: { EXCEPTION: { code: 106, message: EXCEPTION_ERROR_MESSAGE }, },

    PROFILE_INIT: {
        NOT_EXIST_PARAMS: { code: 111, message: INVALID_ACCESS_URL },
        BLOCKED_ME: { code: 112, message: '차단 당했습니다.' },
        EXCEPTION: { code: 119, message: EXCEPTION_ERROR_MESSAGE },
    },

    SEARCH_RESULT: {
        NOT_EXIST_PARAMS: { code: 121, message: '아이디를 입력해 주세요	.' },
        CANT_SEARCH_FRIEND: { code: 122, message: '친구는 검색할 수 없습니다.' },
        CANT_SEARCH_USER: { code: 123, message: '검색을 허용하지 않은 유저입니다.' },
        BLOCKED_ME: { code: 124, message: '차단 당했습니다.' },
        EXCEPTION: { code: 129, message: EXCEPTION_ERROR_MESSAGE },
    },



    /* INSERT */
    ADD_FRIENDS: {
        NOT_EXIST_PARAMS: { code: 131, message: INVALID_ACCESS_URL },
        CANT_RE_ADD_FRIENDS: { code: 132, message: INVALID_ACCESS_ERROR },
        CANT_ADD_FRIENDS: { code: 133, message: '친구 추가할 수 없는 유저입니다.' },
        BLOCKED_ME: { code: 134, message: '차단 당했습니다.' },
        EXCEPTION: { code: 139, message: EXCEPTION_ERROR_MESSAGE },
    },

    ADD_BLOCK: {
        NOT_EXIST_PARAMS: { code: 141, message: INVALID_ACCESS_ERROR },
        ALREADY_BLOCKED_USER: { code: 142, message: '이미 차단된 유저입니다.' },
        CANT_BLOCK_MYSELF: { code: 143, message: '자신을 차단할 수 없습니다.' },
        EXCEPTION: { code: 149, message: EXCEPTION_ERROR_MESSAGE },
    },



    /* SET */
    TOGGLE_MY_SETTING: {
        NOT_EXIST_PARAMS: { code: 151, message: INVALID_PARAMS },
        INVALID_PARAMS_KEY: { code: 152, message: INVALID_PARAMS },
        INVALID_EMAIL_LENGTH: { code: 153, message: '아이디는 20자 이하로 가능합니다.' },
        INVALID_FRIEND_REQUEST_TYPE: { code: 154, message: INVALID_PARAMS },
        INVALID_DIRECT_MESSAGE: { code: 155, message: INVALID_PARAMS },
        EXCEPTION: { code: 159, message: EXCEPTION_ERROR_MESSAGE },
    },

    TOGGLE_MY_PROFILE: {
        NOT_EXIST_PARAMS: { code: 161, message: INVALID_PARAMS },
        INVALID_NICKNAME_LENGTH: { code: 162, message: '별명은 15자 이하로 가능합니다.' },
        INVALID_STATUS_MESSAGE_LENGTH: { code: 162, message: '상태메시지는 30자 이하로 가능합니다.' },
        EXCEPTION: { code: 169, message: EXCEPTION_ERROR_MESSAGE },
    },

    TOGGLE_OPTION_OF_FRIEND: {
        NOT_EXIST_PARAMS: { code: 171, message: INVALID_ACCESS_URL },
        NOT_FRIEND: { code: 172, message: '친구가 아닙니다.' },
        INVALID_PARAMS_KEY: { code: 173, message: INVALID_PARAMS },
        EXCEPTION: { code: 179, message: EXCEPTION_ERROR_MESSAGE },
    },



    /* DELETE */
    DELETE_BLOCK: {
        NOT_EXIST_PARAMS: { code: 181, message: INVALID_PARAMS },
        EXCEPTION: { code: 189, message: EXCEPTION_ERROR_MESSAGE },
    },

    CHANGE_PROFILE_IMAGE: {
        NOT_EXIST_PARAMS: { code: 191, message: INVALID_PARAMS },
        EXCEPTION: { code: 199, message: EXCEPTION_ERROR_MESSAGE },
    },



    /*
     *
     *
     * 
     *   CHAT
     * 
     * 
     * 
     */

    /* INIT */
    CHAT_ROOM_LIST_INIT: { EXCEPTION: { code: 201, message: EXCEPTION_ERROR_MESSAGE }, },

    CHAT_ROOM_INIT: {
        NOT_EXIST_PARAMS: { code: 211, message: INVALID_ACCESS_URL },
        EXCEPTION: { code: 219, message: EXCEPTION_ERROR_MESSAGE },
    },

    SEND_MESSAGE: {
        NOT_EXIST_PARAMS: { code: 221, message: INVALID_PARAMS },
        NOT_EXIST_USER_IN_CHAT_ROOM: { code: 222, message: '유효하지 않은 채팅방입니다.' },
        BLOCKED_USER: { code: 223, message: '유효하지 않은 채팅방입니다.' },
        BLOCKED_ME: { code: 224, message: '유효하지 않은 채팅방입니다.' },
        EXCEPTION: { code: 229, message: EXCEPTION_ERROR_MESSAGE },
    },

    SEND_MESSAGE_IMG: {
        NOT_EXIST_PARAMS: { code: 231, message: INVALID_PARAMS },
        EXCEPTION: { code: 239, message: EXCEPTION_ERROR_MESSAGE },
    },

    ADD_NEW_CHAT_ROOM: {
        NOT_EXIST_PARAMS: { code: 241, message: INVALID_PARAMS },
        EXCEPTION: { code: 249, message: EXCEPTION_ERROR_MESSAGE },
    },

    LEAVE_CHAT_ROOM: {
        NOT_EXIST_PARAMS: { code: 251, message: INVALID_PARAMS },
        EXCEPTION: { code: 259, message: EXCEPTION_ERROR_MESSAGE },
    },

    DELETE_MESSAGE: {
        NOT_EXIST_PARAMS: { code: 261, message: INVALID_PARAMS },
        DONT_HAVE_PERMISSION: { code: 262, message: DONT_HAVE_PERMISSION },
        EXCEPTION: { code: 269, message: EXCEPTION_ERROR_MESSAGE },
    },

    DELETE_CHAT_ROOM: {
        NOT_EXIST_PARAMS: { code: 271, message: INVALID_PARAMS },
        NOT_EXIST_CHAT_ROOM: { code: 272, message: '이미 나간 채팅방입니다.' },
        EXCEPTION: { code: 279, message: EXCEPTION_ERROR_MESSAGE },
    },

    GET_MESSAGE_CHAT_ROOM: {
        NOT_EXIST_PARAMS: { code: 281, message: INVALID_PARAMS },
        EXCEPTION: { code: 289, message: EXCEPTION_ERROR_MESSAGE },
    },



    /*
     *
     *
     * 
     *   PUBLIC
     * 
     * 
     * 
     */

    /* INIT */
    PUBLIC_ROOM_SETTING_INIT: { EXCEPTION: { code: 301, message: EXCEPTION_ERROR_MESSAGE }, },
    PUBLIC_ROOM_BLOCK_WORD_INIT: { EXCEPTION: { code: 302, message: EXCEPTION_ERROR_MESSAGE }, },

    PUBLIC_ROOM_INIT: {
        NOT_EXIST_PARAMS: { code: 311, message: INVALID_ACCESS_URL },
        EXCEPTION: { code: 319, message: EXCEPTION_ERROR_MESSAGE },
    },



    /* INSERT */
    SEND_MESSAGE_IN_PUBLIC: {
        NOT_EXIST_PARAMS: { code: 321, message: INVALID_PARAMS },
        RESTRAIN_QUESTION: { code: 322, message: '질문이 제한된 방입니다.' },
        BLOCKED_USER: { code: 323, message: '차단된 편지함입니다.' },
        DONT_HAVE_PERMISSION: { code: 324, message: '주인만 답변이 가능합니다.' },
        EXCEPTION: { code: 329, message: EXCEPTION_ERROR_MESSAGE },
    },

    SEND_MESSAGE_IMG_IN_PUBLIC: {},

    ADD_BLOCK_WORD: {
        NOT_EXIST_PARAMS: { code: 341, message: INVALID_PARAMS },
        NOT_EXIST_PARAMS: { code: 341, message: INVALID_PARAMS },
        EXCEPTION: { code: 349, message: EXCEPTION_ERROR_MESSAGE },
    },



    /* SET */
    TOGGLE_PUBLIC_ROOM_SETTING: {
        NOT_EXIST_PARAMS: { code: 351, message: INVALID_PARAMS },
        INVALID_PARAMS_KEY: { code: 352, message: INVALID_PARAMS },
        INVALID_QUESTION_RANGE: { code: 353, message: INVALID_PARAMS },
        INVALID_OPEN_PROFILE_TYPE: { code: 354, message: INVALID_PARAMS },
        INVALID_NAME_LENGTH: { code: 355, message: '방 이름은 15자 이하로 가능합니다.' },
        EXCEPTION: { code: 339, message: EXCEPTION_ERROR_MESSAGE },
    },



    /* DELETE */
    LEAVE_PUBLIC_ROOM: {
        NOT_EXIST_PARAMS: { code: 361, message: INVALID_PARAMS },
        EXCEPTION: { code: 369, message: EXCEPTION_ERROR_MESSAGE },
    },

    DELETE_MESSAGE_IN_PUBLIC_ROOM: {
        NOT_EXIST_PARAMS: { code: 371, message: INVALID_PARAMS },
        DONT_HAVE_PERMISSION: { code: 371, message: DONT_HAVE_PERMISSION },
        EXCEPTION: { code: 379, message: EXCEPTION_ERROR_MESSAGE },
    },

    DELETE_BLOCK_WORD: {
        NOT_EXIST_PARAMS: { code: 381, message: INVALID_PARAMS },
        EXCEPTION: { code: 389, message: EXCEPTION_ERROR_MESSAGE },
    },

    GET_MESSAGE_PUBLIC_ROOM: {
        NOT_EXIST_PARAMS: { code: 391, message: INVALID_PARAMS },
        EXCEPTION: { code: 399, message: EXCEPTION_ERROR_MESSAGE },
    },



    /*
     *
     *
     * 
     *   BLIND
     * 
     * 
     * 
     */

    /* INIT */
    BLIND_ROOM_INIT: { EXCEPTION: { code: 401, message: EXCEPTION_ERROR_MESSAGE }, },

    ADD_MATCH: {
        NOT_EXIST_PARAMS: { code: 411, message: INVALID_PARAMS },
        EXCEPTION: { code: 412, message: EXCEPTION_ERROR_MESSAGE },
    },

    SEND_MESSAGE_IMG_IN_BLIND: {
        NOT_EXIST_PARAMS: { code: 421, message: INVALID_PARAMS },
        EXCEPTION: { code: 429, message: EXCEPTION_ERROR_MESSAGE },
    },

    REQUEST_FRIEND: {
        NOT_EXIST_PARAMS: { code: 431, message: INVALID_PARAMS },
        EXCEPTION: { code: 439, message: EXCEPTION_ERROR_MESSAGE },
    },

    RESPOND_FRIEND: {
        NOT_EXIST_PARAMS: { code: 441, message: INVALID_PARAMS },
        NEVER_REQUEST: { code: 442, message: INVALID_PARAMS },
        REFUSE_REQUEST: { code: 443, message: INVALID_PARAMS },
        ALREADY_FIREND: { code: 444, message: INVALID_PARAMS },
        EXCEPTION: { code: 449, message: EXCEPTION_ERROR_MESSAGE },
    },

    LEAVE_BLIND_ROOM: {
        NOT_EXIST_PARAMS: { code: 451, message: INVALID_PARAMS },
        EXCEPTION: { code: 459, message: EXCEPTION_ERROR_MESSAGE },
    },

    DELETE_MATCH: {
        NOT_EXIST_PARAMS: { code: 461, message: INVALID_PARAMS },
        EXCEPTION: { code: 469, message: EXCEPTION_ERROR_MESSAGE },
    },

    DISCONNECT_BLIND_ROOM: {
        NOT_EXIST_PARAMS: { code: 471, message: INVALID_PARAMS },
        EXCEPTION: { code: 479, message: EXCEPTION_ERROR_MESSAGE },
    },
};


export const SYSTEM_ERROR = {
    SAVE_LOG_IN_DB_ERROR: { code: 999, message: 'saveLogInDb 내에서 오류가 발생했습니다.' },
};