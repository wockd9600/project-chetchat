import { v4 as uuidv4 } from 'uuid';
import router from '@/router';

import { socketEmit } from '@/utils/socket.js';
import { scrollToBottomOfChatBox } from '@/utils/chat';
import axios from "@/utils/axios.js";


const store = {
    state: () => ({
        blindStatus: 0,
        blindMessageList: [],
        topicIndex: 0,
        requestFriend: false,
    }),
    getters: {
        // myInfo(state, getters, rootState) {
        //     return rootState.settings.myInfo;
        // },
    },
    mutations: {
        BLIND_MESSAGE_INIT(state, payload) {
            state.blindMessageList = payload;
        },
        SET_BLIND_STATUS(state, payload) {
            state.blindStatus = payload;
        },
        PUSH_BLIND_MESSAGE(state, payload) {
            state.blindMessageList.push(payload);
        },
    },
    actions: {
        /* GET */
        async initializeBlindRoom({ state, commit, dispatch }) {
            try {
                const { success, status, topicIndex, messageList } = (await axios.get(`/blind`)).data;

                if (success) {
                    socketEmit('initialize blind room');
                    state.topicIndex = isNaN(topicIndex) ? 0 : topicIndex;

                    dispatch('toggleBlindStatus', status);

                    if (messageList) commit('BLIND_MESSAGE_INIT', messageList);
                    const path = router.currentRoute.value.path.split('/')[1]
                    if (path !== 'blind' && status === 2) router.push({ path: '/blind' })
                }
            } catch (error) {
                console.log(error);
            } finally {
                scrollToBottomOfChatBox(10);
            }
        },


        /* INSERT */
        async startMatching({ commit, dispatch }) {
            try {
                const { success, status } = (await axios.post(`/blind/match`)).data;
                if (success) {
                    commit('setBlindChatHeader', { type: null });
                    dispatch('toggleBlindStatus', status);
                }
            } catch (error) {
                console.log(error);
            }
        },

        async requestToBeFriends({ state }) {
            try {
                state.requestFriend = true;

                const { success } = (await axios.post(`/blind/reqeust-be-friend`)).data;
                console.log(success);
            } catch (error) {
                console.log(error);
            }
        },

        async respondToBeFriends(_, data) {
            try {
                const { success } = (await axios.post(`/blind/respond-be-friend`, { ...data })).data;
                console.log(success);
            } catch (error) {
                console.log(error);
            }
        },

        async sendMessageOfBlindRoom({ state, getters }, payload) {
            const { message, reply_info } = payload

            const reply_uuid = state.reply_uuid;

            const messageObj = {
                temp_message_id: uuidv4(),
                sender_uuid: getters.myInfo.user_uuid,
                reply_id: reply_uuid ? reply_uuid : null,
                content: message.replace(/(?:\r\n|\r|\n)/g, '<br/>').replace(/ /g, "&nbsp;"),
                // showDate: true,
                is_my_message: true,
            };

            if (Object.keys(reply_info).length !== 0) {
                messageObj.reply_id = reply_uuid;
                messageObj.reply_name = reply_info.reply_name;
                messageObj.reply_content = reply_info.reply_content;
            }

            try {
                (await axios.post(`/blind/message`, { message: messageObj })).data;
            } catch (error) {
                console.log(error);
            } finally {
                scrollToBottomOfChatBox(10);
            }

        },


        /* DELETE */
        async stopMatching({ dispatch }) {
            try {
                const { success } = (await axios.delete(`/blind/match`)).data;
                if (success) {
                    dispatch('toggleBlindStatus', 0);
                }
            } catch (error) {
                console.log(error);
            }
        },

        toggleBlindStatus({ commit }, payload) {
            commit('SET_BLIND_STATUS', payload);
        },
        leaveBlindChat() {
            socketEmit('leave blind room');
        },

        successLeaveBlindChat({ getters, commit, dispatch }, data) {
            commit('setBlindChatHeader', { type: null });
            const status = getters.myInfo.user_uuid === data ? 3 : 4
            dispatch('toggleBlindStatus', status);
            dispatch('toggleBottomMatchHidden', true);
        },
        receiveRespondTobeFriendsRequest({ state, getters, commit }, data) {
            const { status, new_friends } = data
            const alertMessage = ['친구 신청을 거절했습니다.', '서로 이미 친구입니다.', '이제 친구입니다!'];
            const message = { isAlert: true, content: alertMessage[status] };

            state.requestFriend = false;
            commit('PUSH_BLIND_MESSAGE', message);

            // 친구에 추가
            if (new_friends && new_friends.length !== 0) {
                new_friends.forEach(element => {
                    if (getters.myInfo.email !== element.email) {
                        commit('SPLICE_FRIENDS', { ...element, relation: 2 });
                    }
                });
            }
        }
    }
}

export default store