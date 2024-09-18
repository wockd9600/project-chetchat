import router from '@/router';
import { v4 as uuidv4 } from 'uuid';
import { socketEmit } from '@/utils/socket.js';
import axios from "@/utils/axios.js";

import { scrollToBottomOfChatBox, scrollToBottomOfChatBoxImportant } from '@/utils/chat';
import { setLocalData } from '@/utils/login';


const store = {
    state: () => ({
        publicInfo: {},
        currentPublicInfo: {},
        publicMessageList: [],
        publicSettingInfo: {},
        msgMoreSetting: {
            posibleReplyMessage: false,
            posibleBlockUser: false,
            posibleDeleteMessage: false,
        },
        // name: '정정의 편지함',
        // allowOneToOneChat: true,
        // allowQuestion: 0,
        blockWords: [],
        isWorking: false,
    }),
    getters: {
        // replyUUID(state, getters, rootState) {
        //     return rootState.chat.reply_uuid;
        // },
    },
    mutations: {
        PUBLIC_INIT: (state, data) => { state.publicInfo = data },
        PUBLIC_SETTING_INIT: (state, data) => { state.publicSettingInfo = data },
        CURRENT_PUBLIC_INIT: (state, data) => { state.currentPublicInfo = data },
        PUBLIC_MESSAGE_INIT: (state, data) => { state.publicMessageList = data },
        BLOCK_WRODS_INIT: (state, data) => { state.blockWords = data },

        PUBLIC_CLEAR: (state) => { state.publicInfo = {} },
        CURRENT_PUBLIC_CLEAR: (state) => { state.currentPublicInfo = {} },
        PUBLIC_MESSAGE_CLEAR: (state) => { state.publicMessageList = [] },
        MSG_MORE_SETTING_CLEAR: (state) => { state.msgMoreSetting = { posibleReplyMessage: false, posibleBlockUser: false, posibleDeleteMessage: false, } },


        CLEAR_PUBLIC_INFO: (state) => { state.publicInfo = {} },
        CLEAR_PUBLIC_SETTING_INFO: (state) => { state.publicSettingInfo = {} },

        TOGGLE_PUBLIC: (state, property) => {
            const { key, value } = property
            state.publicInfo[key] = value;
        },
        TOGGLE_PUBLIC_SETTING: (state, property) => {
            const { key, value } = property
            state.publicSettingInfo[key] = value;
        },
        TOGGLE_MSG_MORE_SETTING: (state, property) => {
            const { key, value } = property
            state.msgMoreSetting[key] = value;
        },

        PUSH_BLOCKWORDS: (state, data) => {
            state.blockWords.push(data)
        },

        SPLICE_PUBLIC_MESSAGE_LIST: (state, target_id) => {
            const index = state.publicMessageList.findIndex(item => item.id == target_id);
            if (index === -1) return;
            state.publicMessageList.splice(index, 1);
        },
        SPLICE_BLOCKWORDS: (state, target_id) => {
            const index = state.blockWords.findIndex(item => item.id == target_id);
            if (index === -1) return;
            state.blockWords.splice(index, 1)
        },

        ADD_MESSAGE_LIST(state, payload) {
            const { message } = payload;
            const list = Array.isArray(message) ? message : [message];
            state.publicMessageList = [...list, ...state.publicMessageList];
        },

        REPLY_PUSH_MESSAGE_LIST_IN_PUBLIC(state, payload) {
            const { reply_id } = payload;
            const message = payload;

            // reply_uuid 값이 같은 요소 중 마지막에 추가
            const lastIndex = state.publicMessageList.reduce((acc, curr, index) => {
                if (curr.reply_id == reply_id) return index; // 현재 인덱스를 반환
                return acc; // 이전 인덱스를 반환
            }, -1);

            if (lastIndex !== -1) {
                message.showPN = state.publicMessageList[lastIndex].sender_uuid !== message.sender_uuid ? true : false
                state.publicMessageList.splice(lastIndex + 1, 0, message);
            }
            // 만약 일치하는 항목을 찾지 못했을 경우, 객체를 그대로 배열에 추가
            else {
                message.showPN = state.publicMessageList[state.publicMessageList.length - 1].sender_uuid !== message.sender_uuid ? true : false
                state.publicMessageList.push(message);
            }
        },
    },
    actions: {
        initializeMyPublicInfo({ commit }, data) {
            commit('PUBLIC_INIT', data);
        },
        initializePublicRoomSetting({ commit }, data) {
            commit('PUBLIC_SETTING_INIT', data);
        },


        /* GET */
        async initializePublicRoom({ state, commit }, room_uuid) {
            try {
                const { success, data, message } = (await axios.get(`/public/room/${room_uuid}`)).data;

                if (success) {
                    socketEmit('initialize public room', { room_uuid: data.publicInfo.room_uuid });

                    // 내 편지함일 경우 읽을 처리
                    if (state.publicInfo.room_uuid === data.publicInfo.room_uuid) commit('TOGGLE_PUBLIC', { key: 'is_read', value: 1 })

                    // 프로필 공개 여부에 따라 프로필 정보 초기화
                    if (data.profileInfo && data.publicInfo.open_profile) {
                        commit('PROFILE_INFO_INIT', data.profileInfo);
                    }

                    commit('setChatRoomName', data.publicInfo.name);
                    commit('CURRENT_PUBLIC_INIT', data.publicInfo);
                    commit('PUBLIC_MESSAGE_INIT', data.publicMessageList);
                } else {
                    commit('setToastMessage', message);
                    commit('showToast');
                }
            } catch (error) {
                console.error(error);
                commit('setToastMessage', error);
                commit('showToast');
            }

        },

        async getBlockWords({ commit }) {
            try {
                const { success, data } = (await axios.get(`/public/room/setting/block-words`)).data;

                if (success) {
                    commit('BLOCK_WRODS_INIT', data);
                }
            } catch (error) {
                console.log(error);
            }
        },

        async getMessageInPublicRoom({ commit }, data) {
            const { room_uuid, page } = data;

            try {
                const { success, data } = (await axios.get(`/public/room/${room_uuid}/page`, { params: { page } })).data;

                if (success) {
                    commit('ADD_MESSAGE_LIST', { message: data });
                }
            } catch (error) {
                console.log(error);
            }
        },



        /* INSERT */
        async addBlockWords({ commit }, data) {
            try {
                const { success, id } = (await axios.post(`/public/room/setting/block-words`, { blockWord: data })).data;

                if (success) {
                    commit('PUSH_BLOCKWORDS', { id, name: data });
                }
            } catch (error) {
                console.log(error);
            }
        },

        async sendMessageOfPublicRoom({ state, getters, commit }, payload) {
            const { message, current_room_uuid } = payload

            const sender_uuid = current_room_uuid === getters.publicInfo.room_uuid
                ? state.publicInfo.room_uuid
                : getters.myInfo.user_uuid;

            const reply_uuid = getters.reply_uuid;
            const messageObj = {
                temp_message_id: uuidv4(),
                sender_uuid,
                reply_id: reply_uuid ? reply_uuid : null,
                content: message.replace(/(?:\r\n|\r|\n)/g, '<br/>').replace(/ /g, "&nbsp;"),
                message_type: 0,
                // isWait: 1,
                // showDate: true,
            };

            try {
                const { success, message } = (await axios.post(`/public/room/message`, {
                    message: messageObj,
                    room_uuid: current_room_uuid,
                })).data;


                if (!success) {
                    return alert(message)
                }

                // if (success) {
                // const publicMessageList = state.publicMessageList

                // const index = publicMessageList.findIndex(item => item.temp_message_id === messageObj.temp_message_id);
                // if (index === -1) return;

                // publicMessageList[index].id = id
                // if (!publicMessageList[index].reply_id) publicMessageList[index].reply_id = id

                // delete publicMessageList[index].isWait;
                // delete publicMessageList[index].temp_message_id;

                // if (!isDisplayDate(state.publicMessageList, index - 1))
                //     delete state.publicMessageList[index - 1].showDate;
                // } else {
                // 시간이 지나도 서버에서 응답이 없으면 에러처리
                // if (error) {
                // const index = state.publicMessageList.findIndex(item => item.temp_message_id == messageObj.temp_message_id);
                // if (index === -1) return;
                // state.publicMessageList.splice(index, 1);

                // return alert(error.message)
                // }
                // }
            } catch (error) {
                // 시간이 지나도 서버에서 응답이 없으면 에러처리
                console.log(error);
            } finally {
                commit('setReplyUuid', null);
                scrollToBottomOfChatBox();
            }
        },


        async sendMessageTypeImageOfPublicRoom({ state, getters, commit }, payload) {
            const { file_url, message_type, room_uuid } = payload;

            if (!file_url) return;

            const sender_uuid = room_uuid === getters.publicInfo.room_uuid
                ? state.publicInfo.room_uuid
                : getters.myInfo.user_uuid;

            const messageObj = {
                temp_message_id: uuidv4(),
                sender_uuid,
                message_type,
                image_url: file_url,
                // showDate: true,
            };

            // commit('REPLY_PUSH_MESSAGE_LIST_IN_PUBLIC', { ...messageObj, content: '사진' });

            try {
                const { error } = (await axios.post(`/public/room/imageMessage`, {
                    message: messageObj,
                    room_uuid,
                })).data;


                if (error) {
                    return alert(error.message)
                }
            } catch (error) {
                // 시간이 지나도 서버에서 응답이 없으면 에러처리
                console.log(error);
            } finally {
                commit('setReplyUuid', null);
                scrollToBottomOfChatBoxImportant(300);
            }
        },



        /* UPDATE */
        async togglePublicSetting({ commit }, property) {
            try {
                const { success, seperate } = (await axios.put(`/public/room/setting`, { property })).data;

                if (success) {
                    if (seperate) {
                        commit('TOGGLE_PUBLIC', property);
                        setLocalData('publicInfo', property);
                    }
                    else {
                        commit('TOGGLE_PUBLIC_SETTING', property);
                        setLocalData('publicSetting', property);
                    }

                    if (property.key === 'name') {
                        router.go(-1);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },



        /* DELETE */
        async deleteMessageInPublicRoom(_, data) {
            const { room_uuid, id } = data;

            try {
                const { success } = (await axios.delete(`/public/room/message`, { data: { room_uuid, id } })).data;

                if (success) {
                    const replyIcon = document.getElementById('reply-icon');
                    if (replyIcon) replyIcon.style.top = 0 + 'px';
                }
            } catch (error) {
                console.log(error);
            }
        },

        async deleteMessageAllInPublicRoom() {
            if (!confirm('정말로 모든 메시지를 삭제하시겠습니까?')) return;

            if (this.isWorking) return;
            this.isWorking = true;

            try {
                const { success } = (await axios.delete(`/public/room/message/all`)).data;

                // snipet on
                if (success) {
                    // snippets off
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.isWorking = false;
            }
        },

        async deleteBlockWords({ commit }, index) {
            try {
                const { success } = (await axios.delete(`/public/room/setting/block-words`, { data: { index } })).data;

                if (success) {
                    commit('SPLICE_BLOCKWORDS', index);
                }
            } catch (error) {
                console.log(error);
            }
        },


        receivedNewMessageOfPublic({ commit }, data) {
            const { last_content, last_content_time, is_read } = data;

            commit('TOGGLE_PUBLIC', { key: 'last_content', value: last_content });
            commit('TOGGLE_PUBLIC', { key: 'last_content_time', value: last_content_time });
            commit('TOGGLE_PUBLIC', { key: 'is_read', value: is_read });

            setLocalData('publicInfo', { key: 'last_content', value: last_content });
            setLocalData('publicInfo', { key: 'last_content_time', value: last_content_time });
            setLocalData('publicInfo', { key: 'is_read', value: is_read });
        },


        clearPublicRoom({ commit }) {
            commit('PUBLIC_MESSAGE_CLEAR');
            commit('CURRENT_PUBLIC_CLEAR');
        },
    }
}

export default store