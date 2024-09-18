import router from '@/router'
import store from '@/store';

import axios from '@/utils/axios'
import { socketEmit } from "@/utils/socket.js";
import { unsubscribePushManager } from "@/utils/notification";

// import { alertMessage } from '@/utils/alertMessage';

const setLocalData = async (local_name, property) => {
    const currentEmail = localStorage.getItem('current-email');
    if (!currentEmail) return reLogin();

    const data = JSON.parse(localStorage.getItem(`${local_name}-${currentEmail}`));
    data[property.key] = property.value;

    localStorage.setItem(`${local_name}-${currentEmail}`, JSON.stringify(data));
}

// store or localStorage에 저장된 데이터가 있는지 확인
const checkLoginData = async () => {
    const currentEmail = localStorage.getItem('current-email');
    if (!currentEmail) return reLogin();

    const checkObject = {
        myInfo: false,
        mySetting: false,
        // friendsList: false,
        // chatRoomList: false,
        publicInfo: false,
        publicSetting: false,
    }

    const dataTypes = ['myInfo', 'mySetting', 'publicInfo', 'publicSetting'];

    dataTypes.forEach(dataType => {
        const storageKey = `${dataType}-${currentEmail}`;
        const getter = store.getters[dataType];

        // store에 저장된 데이터가 있는지 확인
        if (!getter || (Array.isArray(getter) && !getter.length) || (typeof getter === 'object' && !Object.keys(getter).length)) {
            const storageData = localStorage.getItem(storageKey)

            // localStorage에 저장된 데이터가 있는지 확인
            if (storageData) {
                const parseStorageData = JSON.parse(localStorage.getItem(storageKey));

                if (dataType === 'myInfo') store.commit('SET_MY_INFO_INIT', parseStorageData);
                else if (dataType === 'mySetting') store.commit('SET_MY_SETTING_INIT', parseStorageData);
                else if (dataType === 'publicInfo') store.dispatch('initializeMyPublicInfo', parseStorageData);
                else if (dataType === 'publicSetting') store.commit('PUBLIC_SETTING_INIT', parseStorageData);
                // else if (dataType === 'friendsList') store.dispatch('initializeFriendsList', parseStorageData);
                // else if (dataType === 'chatRoomList') store.commit('PUSH_CHAT_ROOM_LIST', parseStorageData);

                checkObject[dataType] = true;

                return 0;
            }
        }

        checkObject[dataType] = true;
    });

    return checkObject;
}

const setLoginData = (result) => {
    const currentEmail = localStorage.getItem('current-email');
    if (!currentEmail) return reLogin();

    // 사용자 정보 초기화 및 저장
    function initializeAndStoreData(dataType, data) {
        if (data) {
            if (dataType === 'myInfo') store.commit('SET_MY_INFO_INIT', data);
            else if (dataType === 'mySetting') store.commit('SET_MY_SETTING_INIT', data);
            else if (dataType === 'publicInfo') store.dispatch('initializeMyPublicInfo', data);
            else if (dataType === 'publicSetting') store.commit('PUBLIC_SETTING_INIT', data);
            else if (dataType === 'friendsList') store.dispatch('initializeFriendsList', data);
            else if (dataType === 'chatRoomList') store.commit('PUSH_CHAT_ROOM_LIST', data);

            localStorage.setItem(`${dataType}-${currentEmail}`, JSON.stringify(data));
        }
    }

    // 결과 데이터 처리
    if (result) {
        initializeAndStoreData('myInfo', result.myInfo);
        initializeAndStoreData('mySetting', result.mySetting);
        initializeAndStoreData('publicInfo', result.publicInfo);
        initializeAndStoreData('publicSetting', result.publicSetting);
        initializeAndStoreData('friendsList', result.friendsList);
        initializeAndStoreData('chatRoomList', result.chatRoomList);
    }
}

const resetLoginData = async () => {
    socketEmit('logout');
    const currentEmail = localStorage.getItem('current-email');

    localStorage.removeItem(`access-token-${currentEmail}`);
    localStorage.removeItem(`refresh-token-${currentEmail}`);
    localStorage.removeItem(`current-email`);

    const dataTypes = ['myInfo', 'mySetting', 'publicInfo', 'publicSetting', 'friendsList', 'chatRoomList'];

    dataTypes.forEach(dataType => {
        const storageKey = `${dataType}-${currentEmail}`;
        localStorage.removeItem(storageKey);
    });


    store.commit('CLEAR_MY_INFO');
    store.commit('CLEAR_MY_SETTING');

    store.commit('CLEARE_CHAT_ROOM_LIST');
    store.commit('CLEAR_FRIENDS_LIST');

    store.commit('CLEAR_PUBLIC_INFO');
    store.commit('CLEAR_PUBLIC_SETTING_INFO');
}

const refreshToken = async () => {
    const currentEmail = localStorage.getItem('current-email');

    const result = (await axios.post('/service/refresh', { refresh_token: localStorage.getItem(`refresh-token-${currentEmail}`) })).data;
    if (result.code !== 200) reLogin();

    localStorage.setItem(`access-token-${currentEmail}`, result.token);
    localStorage.setItem(`refresh-token-${currentEmail}`, result.index);

    return;
}

const reLogin = async () => {
    resetLoginData();
    // alertMessage({ message: '로그인 정보가 없습니다. 다시 로그인 해주세요.' });

    return router.push({ path: '/login' })
}

const logOut = () => {
    // 서버에서 로그아웃 처리
    try {
        axios.post('/service/logout');

        setTimeout(() => {
            resetLoginData();
            unsubscribePushManager();
            router.push({ path: '/login' });
        }, 100);

    } catch (error) {
        console.log(error);
    }
}

export {
    setLocalData,
    checkLoginData,
    setLoginData,
    reLogin,
    refreshToken,
    logOut,
};