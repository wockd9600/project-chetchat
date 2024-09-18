import router from '@/router';
import axios from "@/utils/axios.js";
import { subscribePushManager, unsubscribePushManager } from '@/utils/notification.js';
import { setLocalData } from '@/utils/login';


const store = {
    state: () => ({
        friends: [],
        profileInfo: {},
        blockList: [],
        isChangeNotification: false,
        isWorking: false,
    }),
    mutations: {
        // INIT
        FRIENDS_INIT(state, payload) {
            state.friends = payload;
        },
        PROFILE_INFO_INIT(state, payload) {
            state.profileInfo = payload;
        },
        BLOCK_LIST_INIT(state, payload) {
            state.blockList = payload;
        },

        // CLEAR
        CLEAR_PROFILE_INFO(state) { state.profileInfo = {}; },
        CLEAR_FRIENDS_LIST(state) { state.friends = []; },


        // SET
        setFriendsBookmark(state, index) {
            state.friends[index].bookmarked = !state.friends[index].bookmarked
            sessionStorage.setItem(`friends-list-${sessionStorage.getItem('current-email')}`, JSON.stringify(state.friends));
        },
        SET_FRIENDS_NAME(state, payload) {
            const { email, value } = payload
            const index = state.friends.findIndex(item => item.email === email);
            if (index === -1) return
            state.friends[index].friend_name = value;
        },
        TOGGLE_PROFILE_INFO(state, payload) {
            const { key, value } = payload;
            state.profileInfo[key] = value;
        },

        // ADD
        PUSH_FRIENDS(state, payload) {
            state.friends.push(payload);
        },
        SPLICE_FRIENDS(state, payload) {
            state.friends.splice(0, 0, payload)
        },

        // DELETE
        DELETE_FRIENDS(state, email) {
            const index = state.friends.findIndex(item => item.email == email);
            if (index === -1) return;
            state.friends.splice(index, 1)
        },

    },
    actions: {
        /* GET */
        initializeFriendsList({ commit }, friendsList) {
            commit('FRIENDS_INIT', friendsList);
        },
        async initializeProfileInfo({ commit, dispatch }, email) {
            let DISCONNECTED_NETWOKR = false;

            try {
                let { profileInfo } = (await axios.get(`/users/profile/${email}`)).data;
                
                if (profileInfo.resign) {
                    commit('setToastMessage', '탈퇴한 유저입니다.');
                    commit('showToast');

                    profileInfo.nickname = '...';
                    profileInfo.relation = 1;
                }

                

                // 이제 profileInfo 변수를 사용할 수 있습니다.

                if (profileInfo && profileInfo.relation) {
                    if (profileInfo.relation === 3) dispatch('chanageHeader', 'MyProfile');
                    else if (profileInfo.relation === 2) {
                        if (profileInfo.bookmarked) dispatch('chanageHeader', 'BookMarkedUserProfile');
                    }
                    commit('PROFILE_INFO_INIT', profileInfo);
                } else DISCONNECTED_NETWOKR = true;

            } catch (error) {
                console.log(error);
                DISCONNECTED_NETWOKR = true;
                // commit('CLEAR_PROFILE_INFO');
            } finally {
                commit('CLEARE_SELECT_FRIEND');

                if (DISCONNECTED_NETWOKR) alert('네트워크를 확인해주세요')
            }
        },
        async initializeBlockList({ state, commit }) {
            try {
                const { success, blockList } = (await axios.get('/users/blockList')).data;

                if (success) {
                    if (state.blockList.length !== 0 && state.blockList[0].id === blockList[0].id) return
                    commit('BLOCK_LIST_INIT', blockList);
                }
            } catch (error) {
                console.log(error);
            }
        },


        async searchUser({ commit }, email) {
            try {
                commit('PROFILE_INFO_INIT', { loading: true });

                const { success, userInfo } = (await axios.get('/users/search', { params: { email } })).data;

                if (success) {
                    const profile = { ...userInfo, margin: false, relation: 1 }
                    commit('PROFILE_INFO_INIT', profile);
                } else {
                    commit('CLEAR_PROFILE_INFO');
                }
            } catch (error) {
                console.log(error);
            }
        },

        clearProfileInfo({ commit }) {
            commit('CLEAR_PROFILE_INFO');
        },



        /* INSERT */
        async addFriends({ commit }, email) {
            try {
                const { success, userInfo, message } = (await axios.post('/users/friends', { email })).data;

                if (success) {
                    commit('SPLICE_FRIENDS', { ...userInfo, relation: 2 });

                    alert('친구추가 완료');

                    const url = router.currentRoute.value.path.split('/')[1];

                    if (url === 'search-user') commit('CLEAR_PROFILE_INFO');
                    else commit('PROFILE_INFO_INIT', { ...userInfo, relation: 2 });

                    // profile에서는 relation 변경
                    // search에서는 확인 아이콘
                } else {
                    alert(message)
                }

            } catch (error) {
                console.log(error);
            }
        },

        async addBlockUser({ state, commit }, data) {
            const { email, uuid } = data;

            try {
                if (!email && !uuid) return;

                const { success, relation, message } = (await axios.post('/users/block', { email, uuid })).data;

                if (success) {
                    if (relation === 2) {
                        commit('DELETE_FRIENDS', email);
                        state.profileInfo.relation = 1;
                    }

                    alert('블랙리스트 추가 완료.');
                    // search에서는 확인 아이콘
                } else {
                    alert(message);
                }
            } catch (error) {
                alert(error);
            }
        },

        async reportkUser(_, data) {
            const { room, message_id } = data;

            try {
                if (!isNaN(room) && !message_id) return;

                const { success, message } = (await axios.post('/users/report', { room, message_id })).data;

                if (success) {
                    alert('신고 완료');
                } else {
                    alert(message);
                }
            } catch (error) {
                alert(error);
            }
        },



        /* UPDATE */
        async toggleMySetting({ commit }, property) {
            try {
                const { success } = (await axios.put('/users/settings', { property })).data;

                if (success) {
                    if (property.key === 'email') {
                        commit('TOGGLE_MY_INFO', property);
                        setLocalData('myInfo', property);
                    }
                    else {
                        commit('TOGGLE_MY_SETTING', property);
                        setLocalData('mySetting', property);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },

        async toggleMyProfile({ commit }, property) {
            if (this.isWorking) return;
            this.isWorking = true;

            try {
                const { success } = (await axios.put('/users/profile', { property })).data;

                if (success) {
                    if (property.key === 'image_url') property.key = 'profile_img';
                    commit('TOGGLE_MY_INFO', property);
                    setLocalData('myInfo', property);

                    if (property.key === 'nickname' || property.key === 'status_message') router.go(-1);
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.isWorking = false;
            }
        },

        async toggleFriendsOption({ state, getters, commit, dispatch }, property) {
            try {
                let { key, value } = property;
                const email = router.currentRoute.value.path.split('/')[2];

                if (key === 'bookmarked') value = !state.profileInfo.bookmarked
                if (key === 'friend_name' && value.length === 0) value = '!cbfus$q@'
                const result = (await axios.put('/users/friends', { email, property: { key, value } })).data;


                if (result.success) {
                    if (key === 'friend_name') {
                        const new_friend_name = value !== '!cbfus$q@' ? value : null;
                        commit('SET_FRIENDS_NAME', { email, value: new_friend_name });
                        const chatRoomList = getters.chatRoomList;

                        // 채팅 중인 유저면 채팅방 이름도 변경
                        const room_uuid = Object.keys(chatRoomList).find(key => chatRoomList[key].email === email) || null;
                        if (room_uuid) chatRoomList[room_uuid].friend_name = new_friend_name;

                        router.go(-1);
                    } else { //bookmarked
                        dispatch('clickBookmarkButton', { email, value });
                    }
                }
            } catch (error) {
                console.log(error);
            }

        },


        async toggleMySettingNotification({ state, commit, dispatch }, value) {
            try {
                if (state.isChangeNotification) return;

                state.isChangeNotification = true;

                let subscription;

                // 알림 구독 변경
                if (value) {
                    subscription = await subscribePushManager();

                    if (subscription === false) { // 알림 권한 거부
                        return; // alert('알림을 허용으로 설정해 주세요.');
                    }
                } else {
                    await unsubscribePushManager();
                }


                const { success, notification } = (await axios.put('/users/notification', { device_token: subscription })).data;

                if (success) {
                    commit('TOGGLE_MY_SETTING', { key: 'notification', value: notification });
                    setLocalData('mySetting', { key: 'notification', value: notification });

                    const url = router.currentRoute.value.path.split('/')[1];
                    if (url === 'chat') {
                        if (notification) dispatch('chanageHeader', 'ChatView');
                        else dispatch('chanageHeader', 'ChatViewNonNotification');
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                state.isChangeNotification = false;
            }
        },

        clickBookmarkButton({ state, commit, dispatch }, data) {
            const { email, value } = data

            // 헤더 북마크 변경
            state.profileInfo.bookmarked = value;

            if (state.profileInfo.bookmarked) dispatch('chanageHeader', 'BookMarkedUserProfile');
            else dispatch('chanageHeader', 'UserProfile');

            const index = state.friends.findIndex(item => item.email === email);
            if (index === -1) return;

            // 친구 북마크 값 변경
            commit('setFriendsBookmark', index);
        },



        /* DELETE */
        async deleteBlockedUser({ state, commit }, id) {
            try {
                const { success } = (await axios.delete('/users/block', { data: { id } })).data;

                if (success) {
                    if (state.blockList.length === 0) return;

                    const newBlockList = state.blockList.filter(item => item.id !== id);
                    commit('BLOCK_LIST_INIT', newBlockList);
                }
            } catch (error) {
                console.log(error);
            }
        },


    }
}

export default store