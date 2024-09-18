import routeInfo from '@/router/route-info';

const store = {
    state: () => ({
        myInfo: {
            // uuid: '123',
            // profile_img: 'KakaoTalk_20220325_162651609.jpg',
            // id: 'wockd11',
            // nickname: '가나다라마바사아자차카타파하사아자차ㅏ',
            // // auth_service: 'Google',
            // status_message: 'dsafdfasdf',
        },
        mySetting: {},

        header: {},
        bottom: {},
        effect: '',

        bottomActive: '/chat',
        bottomChatInputPlaceholder: '',
        bottomMatchHidden: true,

        actionElementActive: false,
        actionElementValue: '',

        addImage: null,
        destroyZoom: null,
    }),
    mutations: {
        // INIT
        SET_MY_INFO_INIT: (state, payload) => { state.myInfo = payload; },
        SET_MY_SETTING_INIT: (state, payload) => { state.mySetting = payload },

        CLEAR_MY_INFO: (state) => { state.myInfo = {}; },
        CLEAR_MY_SETTING: (state) => { state.mySetting = {}; },

        CLEARE_IMAGE_ZOOM_CLOSURE(state) { state.addImage = null; state.destroyZoom = null; },

        // TOGGOLE
        TOGGLE_MY_INFO: (state, { key, value }) => { state.myInfo[key] = value; },
        TOGGLE_MY_SETTING: (state, { key, value }) => { state.mySetting[key] = value; },

        TOGGLE_HEADER(state, header) { state.header = header; },
        TOGGLE_BOTTOM(state, bottom) { state.bottom = bottom; },
        TOGGLE_EFFECT(state, effect) { state.effect = effect; },

        setChatRoomName(state, payload) {
            if (state.header) state.header[1].title = payload
        },

        setBlindChatHeader(state, payload) {
            state.header[2] = payload;
        },

        setActionElementActive(state, payload) {
            const isActive = payload ? payload : false;
            state.actionElementActive = isActive;
        },

        setActionElementValue(state, payload) {
            const value = payload ? payload : '';
            state.actionElementValue = value;
        },

        SET_BOTTOM_MATCH_HIDDEN(state, payload) {
            state.bottomMatchHidden = payload;
        },

        setBottomActive(state, pathActive) { state.bottomActive = pathActive; },

        SET_IMAGE_ZOOM_CLOSURE(state, payload) {
            state.addImage = payload.addImage;
            state.destroyZoom = payload.destroyZoom;
        },
    },
    actions: {
        changeNavigationBar({ commit }, { header, bottom, effect }) {
            commit('TOGGLE_HEADER', header);
            commit('TOGGLE_BOTTOM', bottom);
            commit('TOGGLE_EFFECT', effect);
        },
        chanageHeader({ commit }, name) {
            const header = routeInfo[name].header;
            commit('TOGGLE_HEADER', header);
        },
        toggleBottomMatchHidden({ commit }, payload) {
            commit('SET_BOTTOM_MATCH_HIDDEN', payload);
        }
    }
}

export default store     