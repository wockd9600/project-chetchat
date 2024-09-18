import { io } from "socket.io-client";
import router from '@/router';
import store from '@/store';

// import axios from '@/utils/axios';
import { refreshToken, reLogin } from '@/utils/login.js';
import { scrollToBottomOfChatBox, scrollToBottomOfChatBoxImportant } from '@/utils/chat';

let idleSocket;
let gameSocket;

const socketConnect = async (nsp) => {
    if (nsp === '/idle') idleSocket = await socketTypeConnect(nsp, idleSocket);
    else if (nsp === '/game') gameSocket = await socketTypeConnect(nsp, gameSocket);
};

const socketTypeConnect = async (nsp, preSocket) => {
    if (!preSocket) {

        const URL = process.env.VUE_APP_PROD_SERVER;
        const socket = io(URL + nsp, {
            transports: ['websocket', 'polling', 'flashsocket'],
            reconnection: true,
            // reconnectionDelay, // defaults to 1000
            // reconnectionDelayMax, // defaults to 5000
        });


        if (nsp === '/idle') await idleEvent(socket);
        else if (nsp === '/game') await gameEvent(socket);

        // JWT 토큰이 만료되면 Socket.io 연결을 끊습니다.
        socket.on('tokenExpired', async (params) => {
            const name = params.event;
            // console.log('tokenExpired', name, params)

            const currentEmail = localStorage.getItem('current-email');

            if (localStorage.getItem(`refresh-token-${currentEmail}`)) {
                await refreshToken();

                if (localStorage.getItem(`access-token-${currentEmail}`) && localStorage.getItem(`refresh-token-${currentEmail}`) && name) {
                    const { nsp, event, ...data } = params;
                    console.log(event)
                    if (nsp === 'idle') socketEmit(`${name}`, data.data);
                    else if (nsp === 'game') gameSocketEmit(`${name}`, data.data);
                }
            }
        });


        socket.on('relogin', () => reLogin());
        socket.on('moveChat', () => {
            store.commit('setToastMessage', '잘못된 접근입니다.');
            store.commit('showToast');

            router.replace({ path: '/chat' });
        });

        //  socket.on('error message', (data) => errorMessage(data));
        //  socket.on('alert message', (data) => alertMessage(data));

        return socket;
    }

    return preSocket;
}

const socketEmit = async (name, data) => {
    if (!idleSocket) return;

    const currentEmail = localStorage.getItem('current-email');

    const token = localStorage.getItem(`access-token-${currentEmail}`);
    idleSocket.emit(name, { token, data });
}

const gameSocketEmit = (name, data) => {
    const currentEmail = localStorage.getItem('current-email');

    const token = localStorage.getItem(`access-token-${currentEmail}`);
    gameSocket.emit(name, { token, data });
}

const socketClear = async () => {
    if (idleSocket) idleSocket.disconnect();
    idleSocket = null;
    return;
}

const gameSocketClear = async () => {
    if (gameSocket) gameSocket.disconnect();
    gameSocket = null;
    return;
}


const idleEvent = async (socket) => {
    socket.on("connect", async () => {
        socketEmit('init');

        const path = router.currentRoute.value.path.split('/')

        setTimeout(() => {
            if (path[1] === 'public' && path[2] === 'room') {
                socketEmit('initialize public room', { room_uuid: path[3] });
            }
        }, 500);

        const currentEmail = localStorage.getItem('current-email');
        const accessToken = localStorage.getItem(`access-token-${currentEmail}`);
        const refreshToken = localStorage.getItem(`refresh-token-${currentEmail}`);

        if (!(currentEmail && accessToken && refreshToken)) return;

        // store.dispatch('getChatRoomList');

        setTimeout(() => {
            if (path[1] === 'chat' && path[2] === 'room') {
                socketEmit('initialize chat room', { room_uuid: path[3] });
            } else if (path[1] === 'blind' && path[2] === 'room') {
                socketEmit('initialize blind room');
            }
        }, 500);


        if (!store.getters.myInfo || Object.keys(store.getters.myInfo).length !== 0) return;


        // socket이 연결되면 그 동안 밀렸던 친구 목록과 마지막 채팅방 메시지를 새로고침함
        // try {
        //     const result = (await axios.get('/init-part')).data;
        //     store.dispatch('initializeFriendsList', result.friendsList);
        //     store.commit('PUSH_CHAT_ROOM_LIST', result.chatRoomList);
        // } catch (error) {
        //     reLogin();
        //     // console.log(error);
        //     // store.commit('setToastMessage', error);
        //     // store.commit('showToast');
        // }
    });





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


    // 그냥 채팅방 상태 보고 읽은 상태면 읽은 걸로하고
    // 아니면 안 읽은 걸로 하면 되잖아;
    socket.on('received message in chat room', (data) => {
        store.dispatch('receivedMessageInChatRoom', data)
    });

    socket.on('received message in lobby', (data) => {
        store.dispatch('receivedNewMessage', data)
    });

    socket.on('received new chat', (data) => {
        store.dispatch('receivedNewChatRoom', data)
    });


    socket.on('delete message in chat room', (id) => {
        store.commit('DELETE_MESSAGE', id);
    });

    socket.on('error send message', (data) => {
        store.dispatch('errorSendMessage', data);
    });





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
    socket.on('received message at public room', (data) => {
        store.commit('REPLY_PUSH_MESSAGE_LIST_IN_PUBLIC', data);
        scrollToBottomOfChatBox(10);

        if (data.message_type != 0) {
            setTimeout(() => {
                const images = document.getElementsByClassName('chat-img'); // 이미지 엘리먼트 선택
                let loadedCount = 0;

                const loadImageHandler = (event) => {
                    loadedCount++;
                    if (loadedCount === images.length) {
                        scrollToBottomOfChatBoxImportant();
                    }
                    // 이벤트 리스너 제거
                    event.target.removeEventListener('load', loadImageHandler);
                };

                Array.from(images).forEach((image) => {
                    if (image.complete) {
                        loadedCount++;
                    } else {
                        image.addEventListener('load', loadImageHandler);
                    }
                });

                if (loadedCount === images.length) {
                    scrollToBottomOfChatBoxImportant();
                }
            }, 100);
        }
    });

    socket.on('received message of public', (data) => {
        store.dispatch('receivedNewMessageOfPublic', data);
    });

    socket.on('delete message in public room', (id) => {
        store.commit('SPLICE_PUBLIC_MESSAGE_LIST', id);
    });

    socket.on('delete message all in public room', () => {
        store.commit('PUBLIC_MESSAGE_CLEAR');
    });




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
    socket.on('leave blind room', (data) => {
        store.dispatch('successLeaveBlindChat', data);
    });

    socket.on('matched blind chat', () => {
        store.dispatch('initializeBlindRoom')
    });

    socket.on('received message in blind room', (data) => {
        store.commit('PUSH_BLIND_MESSAGE', data);
        scrollToBottomOfChatBox(10);
    });

    socket.on('request to be friends', (code) => {
        if (store.state.blind.requestFriend) return;

        const result = confirm('친구신청이 왔습니다. 친구가 되시겠습니까');
        store.dispatch('respondToBeFriends', { result, code })
    });

    socket.on('respond to be friend request', (data) => {
        store.dispatch('receiveRespondTobeFriendsRequest', data);
        scrollToBottomOfChatBox(10);
    });



    socket.on('complete logout', async () => {
        // deleteLocalStorage('access_token');
        // deleteLocalStorage('refresh_token');
        store.commit('clearMyMainInfo');

        // alertMessage({ message: '로그아웃 되었습니다.', button_set: ['complete logout'] });
    });
}

const gameEvent = async (socket) => {
    socket.on("connect", () => {
        const roomInfo = store.state.roomStore.roomInfo;
        if (router.currentRoute.value.name === 'game' && roomInfo.no) {
            gameSocketEmit('game', { id: router.currentRoute.value.query.id });
        }
    });

    socket.on('RoomError', () => {
        store.commit('setIsRoomErrorTrue');
    });
}

export {
    socketEmit,
    socketConnect,
    socketClear,
    gameSocketEmit,
    gameSocketClear,
}