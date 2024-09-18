const chatViewNavObj = {
    header: [
        { type: 'HeaderTitle', title: '대화', fontSize: '1.5rem' },
        { type: null },
        {
            type: 'MultiHeader', headers: [
                { type: 'ActionIcon', icon: 'bell', content: 'bell', fontSize: '23px', opacity: '80%' },
                { type: 'IconRouteNavigation', icon: 'new-chat', path: 'select-friends', opacity: '80%' },
            ]
        }
    ],
    bottom: 'BaseBottomBar',
};

const FriendView = {
    header: [
        { type: 'HeaderTitle', title: '홈', fontSize: '1.5rem' },
        { type: null },
        { type: null },
        {
            type: 'MultiHeader', headers: [
                // { type: 'ActionIcon', icon: 'search', content: 'search', fontSize: '20px' },
                { type: 'IconRouteNavigation', icon: 'add-user', path: '/search-user', opacity: '80%' },
                { type: 'IconRouteNavigation', icon: 'ban', path: '/block-list', fontSize: '19px', opacity: '80%' },
                { type: 'ActionIcon', icon: 'leave', content: 'logout', fontSize: '20px', opacity: '80%' },
                // { type: 'HeaderDropDown', icon: 'setting', content: 'add-user', fontSize: '20px' },
            ]
        },
    ],
    bottom: 'BaseBottomBar',
};

const chatRoomNavObj = {
    header: [
        {
            type: 'MultiHeader', headers: [
                // { type: 'ActionIcon', icon: 'search', content: 'search', fontSize: '20px' },
                { type: 'IconRouteNavigation', icon: 'back', fontSize: '22px', path: '/chat' },
                // { type: 'IconRouteNavigation', icon: 'ban', path: '/block-list', fontSize: '19px' },
            ]
        },
        { type: 'HeaderTitle', title: '', fontSize: '1.2rem' },
        {},
        // { type: 'IconRouteNavigation', icon: 'menu', fontSize: '22px', path: '/chat-room-menu' },
    ],
    bottom: 'InputBottomBar',
    effect: 'fadeInRight',
}

const publicRoomNavObj = {
    header: [
        { type: 'IconRouteNavigation', icon: 'back', fontSize: '22px', path: '/chat' },
        { type: 'HeaderTitle', title: '', fontSize: '18px' },
        { type: 'ActionIcon', icon: 'share', content: 'share', fontSize: '22px', opacity: '80%' },
    ],
    bottom: 'PublicBottomBar',
    effect: 'fadeInRight',
}

const routeInfo = {
    /*
     *
     *        auth
     * 
     */
    LoginView: {
        bottom: 'InputBottomBar',
    },
    SignUp: {
        header: [
            { type: 'IconRouteNavigation', icon: 'back', fontSize: '22px', path: '/login' },
            { type: null },
            { type: null },
        ],
    },
    PrivacyPolicy: {
        header: [
            { type: 'IconRouteNavigation', icon: 'back', fontSize: '22px', },
            { type: null },
            { type: null },
        ],
    },
    TermsPolicy: {
        header: [
            { type: 'IconRouteNavigation', icon: 'back', fontSize: '22px', },
            { type: null },
            { type: null },
        ],
    },





    /*
     *
     *        chat
     * 
     */
    ChatView: chatViewNavObj,
    ChatViewNonNotification: {
        header: [
            { type: 'HeaderTitle', title: '대화', fontSize: '1.5rem', opacity: '89%' },
            { type: null },
            {
                type: 'MultiHeader', headers: [
                    { type: 'ActionIcon', icon: 'bell-slash', content: 'bell-slash', fontSize: '25px', opacity: '80%' },
                    { type: 'IconRouteNavigation', icon: 'new-chat', path: 'select-friends', opacity: '80%' },
                ]
            }
        ],
        bottom: 'BaseBottomBar',
    },

    SelectFriends: {
        header: [
            { type: 'IconRouteNavigation', icon: 'close', fontSize: '24px', /* path: '/chat' */ },
            { type: 'HeaderTitle', title: '친구 선택', fontSize: '1.2rem' },
            { type: 'ActionElement', content: '확인', action: 'new-chat' },
        ],
        bottom: null,
        effect: 'fadeInUp'
    },

    NewChatRoom: chatRoomNavObj,

    ChatRoom: chatRoomNavObj,

    UserProfile: {
        header: [
            { type: 'IconRouteNavigation', icon: 'close', fontSize: '24px', },
            { type: null },
            {
                type: 'MultiHeader', headers: [
                    { type: 'ActionIcon', icon: 'bookmark', content: 'bookmark', fontSize: '20px', opacity: '90%' },
                    { type: 'HeaderDropDown', icon: 'more' },
                ]
            },
        ],
        bottom: null,
        effect: 'fadeInUp'
    },

    BookMarkedUserProfile: {
        header: [
            { type: 'IconRouteNavigation', icon: 'close', fontSize: '24px', },
            { type: null },
            {
                type: 'MultiHeader', headers: [
                    { type: 'ActionIcon', icon: 'bookmarked', content: 'bookmark', fontSize: '20px', color: "#3366ff", opacity: '100%' },
                    { type: 'HeaderDropDown', icon: 'more', },
                ]
            },
        ],
        bottom: null,
        effect: 'fadeInUp'
    },

    MyProfile: {
        header: [
            { type: 'IconRouteNavigation', icon: 'close', fontSize: '24px', },
            { type: null },
            { type: 'IconRouteNavigation', icon: 'setting', fontSize: '20px', path: '/my-setting', opacity: '90%' }
        ],
        bottom: null,
        effect: 'fadeInUp'
    },

    ChatRoomMenu: {
        header: [
            { type: 'IconRouteNavigation', icon: 'back', fontSize: '22px', },
            { type: 'HeaderTitle', title: '', fontSize: '1.2rem' },
            { type: null },
        ],
        bottom: null,
        effect: 'fadeInUp'
    },

    UserReport: {
        header: [
            { type: 'IconRouteNavigation', icon: 'back', fontSize: '22px', },
            { type: 'HeaderTitle', title: '신고하기', fontSize: '1.2rem' },
            { type: 'ActionElement', content: '완료', action: 'report' },
        ],
        bottom: null,
        effect: 'fadeInUp'
    },

    PublicRoom: publicRoomNavObj,
    MyPublicRoom: {
        header: [
            { type: 'IconRouteNavigation', icon: 'back', fontSize: '22px', path: '/chat' },
            { type: 'HeaderTitle', title: '', fontSize: '18px' },
            {
                type: 'MultiHeader', headers: [
                    { type: 'IconRouteNavigation', icon: 'setting', fontSize: '20px', path: '/public-setting', opacity: '90%' },
                ]
            },
        ],
    },

    PublicRoomSetting: {
        header: [
            { type: 'IconRouteNavigation', icon: 'close', fontSize: '24px', /* path: `/public/${myid}` */ },
            { type: null },
            { type: null },
        ],
        bottom: null,
        effect: 'fadeInUp'
    },

    PublicRoomSettingName: {
        header: [
            { type: 'IconRouteNavigation', icon: 'back', fontSize: '22px', /* path: '/public-setting' */ },
            { type: 'HeaderTitle', title: '우편함 이름', fontSize: '1.2rem' },
            { type: 'ActionElement', content: '확인', action: 'set-public-room-name' },
        ],
        bottom: null,
        effect: 'fadeInUp'
    },

    PublicRoomBlockWord: {
        header: [
            { type: 'IconRouteNavigation', icon: 'back', fontSize: '22px', /* path: '/public-setting' */ },
            { type: 'HeaderTitle', title: '금지 단어', fontSize: '1.2rem' },
            { type: null },
        ],
        bottom: null,
        effect: 'fadeInUp'
    },






    /*
     *
     *   friends
     *
     */
    FriendView: FriendView,
    SearchUser: {
        header: [
            { type: 'IconRouteNavigation', icon: 'close', fontSize: '24px', /* path: '/friends' */ },
            { type: 'HeaderTitle', title: '유저 검색', fontSize: '1.2rem' },
            { type: null },
        ],
        bottom: null,
    },
    BlockList: {
        header: [
            { type: 'IconRouteNavigation', icon: 'close', fontSize: '24px', /* path: '/friends' */ },
            { type: 'HeaderTitle', title: '차단 목록', fontSize: '1.2rem' },
            { type: null },
        ],
        bottom: null,
    },
    MySetting: {
        header: [
            { type: 'IconRouteNavigation', icon: 'close', fontSize: '24px', /* path: 'my-profile' */ },
            { type: 'HeaderTitle', title: '내 계정', fontSize: '1.2rem' },
            { type: null },
        ],
        bottom: null,
    },
    MySettingEmail: {
        header: [
            { type: 'IconRouteNavigation', icon: 'back', fontSize: '22px', /* path: '/public-setting' */ },
            { type: 'HeaderTitle', title: '내 아이디', fontSize: '1.2rem' },
            { type: 'ActionElement', content: '확인', action: 'set-my-setting-id' },
        ],
        bottom: null,
        effect: 'fadeInUp'
    },
    ProfileEdit: {
        header: [
            { type: 'IconRouteNavigation', icon: 'close', fontSize: '24px', /* path: '/friends' */ },
            { type: 'HeaderTitle', title: '프로필 편집', fontSize: '1.2rem' },
            { type: null },
        ],
        bottom: null,
    },
    OtherNickNameEdit: {
        header: [
            { type: 'IconRouteNavigation', icon: 'close', fontSize: '24px', /* path: '/friends' */ },
            { type: 'HeaderTitle', title: '친구 이름 변경', fontSize: '1.2rem' },
            { type: 'ActionElement', content: '확인', action: 'set-friend-edit-nickname' },
        ],
        bottom: null,
    },
    ProfileEditNickname: {
        header: [
            { type: 'IconRouteNavigation', icon: 'back', fontSize: '22px', /* path: '/public-setting' */ },
            { type: 'HeaderTitle', title: '내 별명', fontSize: '1.2rem' },
            { type: 'ActionElement', content: '확인', action: 'set-profile-edit-nickname' },
        ],
        bottom: null,
        effect: 'fadeInUp'
    },
    ProfileEditStatusMessage: {
        header: [
            { type: 'IconRouteNavigation', icon: 'back', fontSize: '22px', /* path: '/public-setting' */ },
            { type: 'HeaderTitle', title: '상태 메시지', fontSize: '1.2rem' },
            { type: 'ActionElement', content: '확인', action: 'set-profile-edit-status-message' },
        ],
        bottom: null,
        effect: 'fadeInUp'
    },






    /*
     *
     *   blind
     *
     */
    BlindChat: {
        header: [
            { type: 'IconRouteNavigation', icon: 'back', fontSize: '22px', path: '/chat' },
            { type: 'HeaderTitle', title: '블라인드 채팅', fontSize: '1.2rem' },
            { type: null },
        ],
        bottom: 'MatchBottomBar',
    },
}

export default routeInfo;