import router from '@/router';
import { v4 as uuidv4 } from 'uuid';

import axios from "@/utils/axios.js";
import { socketEmit } from '@/utils/socket.js';
import {
    scrollToBottomOfChatBox,
    scrollToBottomOfChatBoxImportant,
    scrollBottomOfImageMessage,
    getFilteredMessageForUI,
    // isDisplayDate
} from '@/utils/chat';

import routeInfo from '@/router/route-info';


const store = {
    state: () => ({
        selectedFrinedsForNewChat: {},

        chatRoomList: {
            // last_content
        },
        messageList: [],

        currentChatRoomPage: 1,
        previousChatRoomPage: 0,

        zoomImageSrc: '',

        currentScollPosition: 0,
        reply_uuid: false,
        ingEventElement: null,
    }),
    mutations: {
        SELECT_FRIEND_INIT(state, data) {
            state.selectedFrinedsForNewChat = data
        },

        MESSAGE_LIST_INIT(state, data) {
            state.messageList = data;
        },

        TOGGLE_ING_EVENT_ELEMENT(state, payload) {
            state.ingEventElement = payload;
        },


        // *
        PUSH_CHAT_ROOM_LIST(state, payload) {
            if (!payload) return;

            payload.forEach(element => {
                state.chatRoomList[element.room_uuid] = element;
            });
        },
        PUSH_MESSAGE_LIST(state, payload) {
            const { message } = payload;

            const list = Array.isArray(message) ? message : [message];
            list.forEach(element => {
                state.messageList.push(element);
            });
        },

        addChatRoomPage(state) {
            state.currentChatRoomPage++
        },

        // *
        SET_CHAT_ROOM_LIST_IS_READ(state, payload) {
            const { room_uuid, value } = payload;
            if (!state.chatRoomList[room_uuid]) return;

            state.chatRoomList[room_uuid].is_read = value;
        },
        SET_CHAT_ROOM_LIST_LAST_MESSAGE_TIME(state, payload) {
            const { room_uuid, value } = payload;
            state.chatRoomList[room_uuid].last_content_time = value;
        },
        SET_CHAT_ROOM_LIST_LAST_MESSAGE(state, payload) {
            const { room_uuid, value } = payload;
            state.chatRoomList[room_uuid].last_content = value;
        },
        SET_CURRENT_SCROLL_POSITION(state, scrollTop) {
            state.currentScollPosition = scrollTop;
        },

        SET_ZOOM_IMAGE_SRC(state, image_url) {
            state.zoomImageSrc = image_url;
        },

        setSelectedFrinedsForNewChat(state, data) {
            state.selectedFrinedsForNewChat = {};

            if (Object.keys(data).length !== 0) state.selectedFrinedsForNewChat[data.email] = data;
        },

        setReplyUuid(state, payload) {
            state.reply_uuid = payload;
            if (!state.reply_uuid) return;

            setTimeout(() => {
                const dom = document.getElementsByClassName('chat-box')[0];
                if (dom.scrollHeight - 100 < dom.scrollTop + dom.offsetHeight) {
                    dom.scrollTo({ top: dom.scrollHeight, behavior: 'smooth' });
                }


            }, 0);
            document.getElementById('sendInput').focus();
        },

        SPLICE_CHAT_ROOM_LIST(state, room_uuid) {
            // const index = state.chatRoomList.findIndex(item => item.room_uuid === room_uuid);
            // if (index === -1) return;
            // state.chatRoomList.splice(index, 1)
            delete state.chatRoomList[room_uuid]
        },
        SPLICE_MESSAGE_LIST: (state, payload) => {
            const { message } = payload;

            const index = state.messageList.findIndex(item => new Date(item.created_at) > new Date(message.created_at));

            // index가 -1이면 message가 가장 늦은 날짜이므로 맨 뒤에 추가
            if (index === -1) state.messageList.push(message);
            // 그렇지 않으면 index 위치에 message를 삽입
            else state.messageList.splice(index, 0, message);
        },

        ADD_MESSAGE_LIST(state, payload) {
            const { message } = payload;
            const list = Array.isArray(message) ? message : [message];
            // list.forEach(element => {
            //     state.messageList.splice(0, 0, element);
            // });
            state.messageList = [...list, ...state.messageList];
        },


        DELETE_MESSAGE(state, target_id) {
            const index = state.messageList.findIndex(item => item.id == target_id);
            if (index === -1) return;
            state.messageList.splice(index, 1)
        },

        CLEAR_MESSAGE_LIST(state) { state.messageList = [] },
        CLEARE_SELECT_FRIEND(state) {
            state.selectedFrinedsForNewChat = {};
            sessionStorage.removeItem('selectedFriends');
        },
        CLEARE_CHAT_ROOM_LIST(state) {
            state.chatRoomList = {};
        },
    },
    actions: {
        /* GET */
        async initializeChatRoom({ commit }, room_uuid) {
            try {
                const { success, message, chatMessageList } = (await axios.get(`/chat/room/${room_uuid}`)).data;

                if (success) {
                    socketEmit('initialize chat room', { room_uuid });

                    const filteredArr = await getFilteredMessageForUI(chatMessageList);
                    commit('MESSAGE_LIST_INIT', filteredArr);

                    // if (filteredArr.length !== 30) {
                    // const filterObj = { ...profileInfo, margin: false, relation: 0 };
                    // commit('PROFILE_INFO_INIT', filterObj);
                    // }

                    scrollToBottomOfChatBoxImportant()
                } else {
                    console.error(message)
                }
            } catch (error) {
                console.log(error);
            }
        },

        async getMessageInChatRoom({ commit }, data) {
            const { room_uuid, page } = data;

            try {
                const { success, chatMessageList } = (await axios.get(`/chat/room/${room_uuid}/page`, { params: { page } })).data;

                if (success) {
                    const filteredArr = await getFilteredMessageForUI(chatMessageList);

                    commit('ADD_MESSAGE_LIST', { message: filteredArr });

                    // if (filteredArr.length !== 30) {
                    //     const filterObj = { ...profileInfo, margin: false, relation: 0 };
                    //     commit('PROFILE_INFO_INIT', filterObj);
                    // }
                }
            } catch (error) {
                console.log(error);
            }
        },

        async getChatRoomList({ state, commit }) {
            try {
                const { success, chatRoomList, publicInfo } = (await axios.get('/chat', { params: { page: state.currentChatRoomPage } })).data;

                if (success) {
                    commit('PUSH_CHAT_ROOM_LIST', chatRoomList);

                    state.previousChatRoomPage++;
                    if (chatRoomList.length === 10) {
                        commit('addChatRoomPage');
                    }

                    const { last_content, last_content_time, is_read } = publicInfo;

                    commit('TOGGLE_PUBLIC', { key: 'last_content', value: last_content });
                    commit('TOGGLE_PUBLIC', { key: 'last_content_time', value: last_content_time });
                    commit('TOGGLE_PUBLIC', { key: 'is_read', value: is_read });
                }
            } catch (error) {
                console.log(error);
            }
        },


        /* INSERT */
        async sendMessage({ state, commit }, payload) {
            const { message, reply_info, room_uuid } = payload

            const messageList = state.messageList;
            const reply_uuid = state.reply_uuid;

            const messageObj = {
                temp_message_id: uuidv4(),
                reply_id: reply_uuid ? reply_uuid : null,
                content: message.replace(/(?:\r\n|\r|\n)/g, '<br/>').replace(/ /g, "&nbsp;"),
                // isWait: 1,
                setIsWait: () => {
                    setTimeout(() => {
                        messageObj.isWait = 1;
                    }, 200)
                },
                message_type: 0,
                // showDate: true,
                is_my_message: true,
                showPN: messageList[messageList.length - 1].is_my_message ? false : true,
            };

            if (Object.keys(reply_info).length !== 0) {
                messageObj.reply_id = reply_uuid;
                messageObj.reply_name = reply_info.reply_name;
                messageObj.reply_content = reply_info.reply_content;
            }

            // 메시지 store에 저장
            commit('PUSH_MESSAGE_LIST', { message: messageObj });
            commit('setReplyUuid', null);

            scrollToBottomOfChatBox();

            // if (isDisplayDate(messageList, index)) {
            //     messageList[index - 1].showDate = false;
            // }

            try {
                const { success, id, last_content_time } = (await axios.post(`/chat/room/message`, {
                    message: messageObj,
                    room_uuid,
                })).data;

                if (success) {
                    const index = messageList.findIndex(item => item.temp_message_id === messageObj.temp_message_id);
                    if (index === -1) return;

                    const message = messageList[index];

                    message.id = id
                    message.created_at = last_content_time;

                    // delete message.isWait;
                    clearInterval(message.setIsWait);
                    delete message.temp_message_id;

                    // commit('DELETE_MESSAGE', id);
                    // setTimeout(() => {
                    //     commit('SPLICE_MESSAGE_LIST', { message });
                    // }, 10);

                    if (Object.keys(state.chatRoomList).length === 0 && !state.chatRoomList[room_uuid]) return;

                    commit('SET_CHAT_ROOM_LIST_IS_READ', { room_uuid, value: messageObj.content })
                    commit('SET_CHAT_ROOM_LIST_LAST_MESSAGE', { room_uuid, value: messageObj.content })
                    commit('SET_CHAT_ROOM_LIST_LAST_MESSAGE_TIME', { room_uuid, value: last_content_time })

                    scrollToBottomOfChatBox();
                } else {
                    const index = messageList.findIndex(item => item.temp_message_id === messageObj.temp_message_id);
                    if (index === -1) return;

                    // 시간이 지나도 서버에서 응답이 없으면 에러처리
                    messageList[index].isWait = true;
                    scrollToBottomOfChatBox();
                }
            } catch (error) {
                const index = messageList.findIndex(item => item.temp_message_id === messageObj.temp_message_id);
                if (index === -1) return;

                // 시간이 지나도 서버에서 응답이 없으면 에러처리
                console.log(error);
                messageList[index].isWait = true;
            }
        },

        async sendMessageTypeImage({ state, commit }, payload) {
            const { file_url, message_type, room_uuid } = payload;
            if (!file_url) return;


            const messageList = state.messageList;

            const messageObj = {
                temp_message_id: uuidv4(),
                image_url: file_url,
                message_type,
                is_my_message: true,
                loading: true,
                // showDate: true,
                showPN: messageList[messageList.length - 1].is_my_message ? false : true,
            };

            commit('PUSH_MESSAGE_LIST', { message: { ...messageObj, content: message_type === 1 ? '사진' : '동영상', } });
            commit('setReplyUuid', null);

            scrollBottomOfImageMessage('chat-img');

            try {
                const { success, id, last_content_time } = (await axios.post(`/chat/room/imageMessage`, {
                    message: messageObj,
                    room_uuid,
                })).data;

                if (success) {
                    const index = messageList.findIndex(item => item.temp_message_id === messageObj.temp_message_id);
                    if (index === -1) return;

                    messageList[index].id = id;
                    const message = { ...messageList[index] };

                    message.id = id;
                    message.created_at = last_content_time;

                    delete message.isWait;
                    delete message.loading;
                    delete message.temp_message_id;

                    commit('DELETE_MESSAGE', id);
                    setTimeout(() => {
                        commit('SPLICE_MESSAGE_LIST', { message });
                    }, 0);

                    if (Object.keys(state.chatRoomList).length === 0 && !state.chatRoomList[room_uuid]) return;

                    commit('SET_CHAT_ROOM_LIST_LAST_MESSAGE', { room_uuid, value: message_type === 1 ? '사진' : '동영상', })
                    commit('SET_CHAT_ROOM_LIST_LAST_MESSAGE_TIME', { room_uuid, value: last_content_time })

                    // getters.addImage();

                    // scrollToBottomOfChatBoxImportant(300);
                } else {
                    // 시간이 지나도 서버에서 응답이 없으면 에러처리
                }
            } catch (error) {
                // 시간이 지나도 서버에서 응답이 없으면 에러처리
                console.log(error);
            }
        },

        async sendMessageForNewChat({ state, getters, commit, dispatch }, payload) {
            const { message } = payload

            const messageObj = {
                sender_id: getters.myInfo.id,
                content: message.replace(/(?:\r\n|\r|\n)/g, '<br/>').replace(/ /g, "&nbsp;"),
                // isWait: 1,
            };
            commit('PUSH_MESSAGE_LIST', { message: messageObj });

            try {
                const { success, data, } = (await axios.post(`/chat/room/new`, {
                    message: messageObj,
                    friends: Object.keys(state.selectedFrinedsForNewChat)
                })).data;

                if (success) {
                    await dispatch('receivedNewChatRoom', data);
                    router.replace({ path: `/chat/room/${data.room_uuid}` });
                } else {
                    router.replace({ path: `/chat/room/${data.room_uuid}` });
                }
            } catch (error) {
                // 시간이 지나도 서버에서 응답이 없으면 에러처리
                console.log(error);
            }
        },


        /* DELETE */
        async deleteMessage(_, data) {
            const { room_uuid, id } = data;

            try {
                const { success } = (await axios.delete(`/chat/room/message`, { data: { room_uuid, id } })).data;

                if (success) {
                    const replyIcon = document.getElementById('reply-icon');
                    if (replyIcon) replyIcon.style.top = 0 + 'px'
                } else {
                    return alert('메시지가 너무 적습니다.');
                }
            } catch (error) {
                console.log(error);
            }
        },

        async deleteChatRoom({ state, commit }, room_uuid) {
            try {
                const { success } = (await axios.delete(`/chat/room/${room_uuid}`)).data;

                if (success) {
                    state.chatRoomList[room_uuid].is_delete = 1;

                    setTimeout(() => {
                        commit('SPLICE_CHAT_ROOM_LIST', room_uuid)
                    }, 600);
                }
            } catch (error) {
                console.log(error);
            }
        },





        readMessage({ commit }, room_uuid) {
            commit('SET_CHAT_ROOM_LIST_IS_READ', { room_uuid, value: true });
        },


        createChat({ state, commit }) {
            // 선택한 유저가 없으면 1:1 채팅
            if (state.selectedFrinedsForNewChat.length === 0) return;

            const dd123dd = Object.keys(state.selectedFrinedsForNewChat);
            const email = dd123dd[0];


            commit('TOGGLE_PROFILE_INFO', { key: 'margin', value: false });
            commit('TOGGLE_PROFILE_INFO', { key: 'relation', value: 0 });

            sessionStorage.setItem('selectedFriends', JSON.stringify(state.selectedFrinedsForNewChat));

            const room_uuid = Object.keys(state.chatRoomList).find(key => state.chatRoomList[key].email === email) || null;

            if (room_uuid) router.push({ path: `/chat/room/${room_uuid}` })
            else router.push({ path: `/chat-room-new/${uuidv4()}` });
        },




        receivedMessageInChatRoom({ state, commit }, payload) {
            const { message, room_uuid, last_content, last_content_time } = payload;

            message.created_at = last_content_time;
            commit('SPLICE_MESSAGE_LIST', { message });

            if (message.message_type === 0) {
                const messageList = state.messageList;

                const index = messageList.findIndex(item => item.id === message.id);
                if (index === -1) return;

                // if (isDisplayDate(messageList, index)) {
                //     messageList[index - 1].showDate = false;
                //     messageList[index].showDate = true;
                // }

                scrollToBottomOfChatBox(10);
            } else {
                scrollBottomOfImageMessage('chat-img');
            }



            if (Object.keys(state.chatRoomList).length === 0) return;

            commit('SET_CHAT_ROOM_LIST_LAST_MESSAGE', { room_uuid, value: last_content })
            commit('SET_CHAT_ROOM_LIST_LAST_MESSAGE_TIME', { room_uuid, value: last_content_time })


        },

        async receivedNewMessage({ state, commit }, data) {
            const { room_uuid, last_content, last_content_time, is_read } = data;
            if (!state.chatRoomList[room_uuid]) state.chatRoomList[room_uuid] = {};

            commit('SET_CHAT_ROOM_LIST_IS_READ', { room_uuid, value: is_read });
            commit('SET_CHAT_ROOM_LIST_LAST_MESSAGE', { room_uuid, value: last_content });
            commit('SET_CHAT_ROOM_LIST_LAST_MESSAGE_TIME', { room_uuid, value: last_content_time });
        },

        async receivedNewChatRoom({ state, commit }, data) {
            if (state.chatRoomList[data.room_uuid]) {
                const { room_uuid, last_content, last_content_time, is_read } = data;

                commit('SET_CHAT_ROOM_LIST_LAST_MESSAGE', { room_uuid, value: last_content })
                commit('SET_CHAT_ROOM_LIST_LAST_MESSAGE_TIME', { room_uuid, value: last_content_time })
                commit('SET_CHAT_ROOM_LIST_IS_READ', { room_uuid, value: is_read });
            } else {
                commit('PUSH_CHAT_ROOM_LIST', [data])
            }
        },







        // CLEAR
        clearChatRoom({ commit }) {
            commit('CLEAR_MESSAGE_LIST');
            routeInfo.ChatRoom.header[1].title = '';
        },



        errorSendMessage({ state }, data) {
            const { target_id } = data;

            const index = state.messageList.findIndex(item => item.temp_message_id === target_id);
            if (index === -1) return;

            state.messageList[index].error = true;
        }
    }
}

export default store