import LoadingSpinner from '@/components/LoadingSpinner'

import { mapGetters } from 'vuex';

import { createOverLay } from '@/utils/overlay';

export default {
    components: {
        LoadingSpinner,
    },
    computed: {
        ...mapGetters(['myInfo', 'reply_uuid', 'ingEventElement', 'publicInfo']),
    },
    data() {
        return {
            isIngEvent: '',
            defaultImageSrc: require('@/assets/images/Untitled.png'),
            imageLoadSuccess: true,
        }
    },
    methods: {
        zoomImage(image_url) {
            if (image_url === this.defaultImageSrc) return;
            this.$store.commit('SET_ZOOM_IMAGE_SRC', image_url);
        },
        profileDetail(item) {
            this.$router.push({ path: `/profile/${item.email}` });
        },
        handleImageError() {
            this.imageLoadSuccess = false;
            return '';
        },
        // messageParsing(message) {
        //     if (!message) return ' ';
        //     return message.replace(/< *\/?br *\/?>.*/i, '...').replace(/&nbsp;/g, ' ');
        // },
    },
    directives: {
        // created() {
        //     if (조건) {
        //         this.addTouchListeners();
        //     }
        // },
        // methods: {
        //     addTouchListeners() {
        //         // 터치 이벤트 리스너 등록
        //         // 이벤트 핸들러 등록 및 해제 등의 로직을 여기에 구현
        //     },
        // },
        // swiper: {
        //     mounted(element, binding) {
        //         const data = binding.instance;
        //         const speed = 0.5

        //         if (data.$route.path.split('/')[1] === 'public'
        //             && data.$route.path.split('/')[3] !== data.publicInfo.room_uuid) return;
        //         else if (data.$route.path.split('/')[1] === 'blind') return;

        //         const chatBox = document.getElementsByClassName('chat-box')[0];

        //         let startTx, startTy, /*previousDistanceX, backError, */isIng;

        //         function isOpendKeyboardBox() {
        //             if (document.documentElement.clientHeight !== window.visualViewport.height) return true;
        //             return false;
        //         }

        //         function toFit(
        //             cb,
        //             { dismissCondition = () => false, triggerCondition = () => true }
        //         ) {
        //             if (!cb) {
        //                 throw Error('Invalid required arguments')
        //             }

        //             let tick = false

        //             return function (e) {
        //                 // console.log('scroll call')

        //                 if (tick) {
        //                     return
        //                 }

        //                 tick = true
        //                 return requestAnimationFrame(() => {
        //                     if (dismissCondition()) {
        //                         tick = false
        //                         return
        //                     }

        //                     if (triggerCondition()) {
        //                         // console.log('real call')
        //                         tick = false
        //                         return cb(e)
        //                     }
        //                 })
        //             }
        //         }

        //         function isStopEvent() {
        //             if (data.isIngEvent === 'more' || !isIng) {
        //                 isIng = false;
        //                 return true;
        //             } else {
        //                 return false;
        //             }
        //         }

        //         function touchstartHandler(e) {
        //             if (!e) {
        //                 return
        //             }
        //             if (data.ingEventElement) return;

        //             const touches = e.touches[0];
        //             startTx = touches.clientX;
        //             startTy = touches.clientY;
        //             isIng = true;

        //             let bottomOfTarget = element.getBoundingClientRect().bottom - 50;
        //             bottomOfTarget += chatBox.scrollTop;
        //             // previousDistanceX = 0;

        //             // const chatProfile = document.getElementById('chat-profile');
        //             // let chatProfileHeight = 0;
        //             // if (chatProfile) chatProfileHeight = chatProfile.getBoundingClientRect().height;

        //             // bottomOfTarget -= chatProfileHeight;

        //             if (isOpendKeyboardBox()) {
        //                 let documentHeight = document.documentElement.clientHeight;
        //                 let viewportHeight = window.visualViewport.height;
        //                 let keyboardHeight = documentHeight - viewportHeight + 1;
        //                 bottomOfTarget += keyboardHeight;
        //             }

        //             const replyIcon = document.getElementById('reply-icon');

        //             // const moreMsgHeight = replyIcon.getBoundingClientRect().height;
        //             replyIcon.style.top = bottomOfTarget - element.getBoundingClientRect().height / 2 - 12 + 'px';
        //         }

        //         function touchmoveHandler(e) {
        //             if (data.ingEventElement) return;
        //             if (isStopEvent()) return;

        //             const touches = e.changedTouches[0],
        //                 endTx = touches.clientX,
        //                 endTy = touches.clientY,
        //                 distanceX = startTx - endTx,
        //                 distanceY = startTy - endTy;

        //             // console.log(backError, previousDistanceX, distanceX)
        //             // if (backError || Math.abs(previousDistanceX - distanceX) > 50) {
        //             //     backError = true;
        //             //     return;
        //             // }


        //             if (distanceX * speed > 80) {
        //                 element.style.marginLeft = -80 + 'px';
        //                 return;
        //             }

        //             if (Math.abs(distanceX) < 10 || Math.abs(distanceY) > 20) return;
        //             if (chatBox.style.overflowY == 'scroll') chatBox.style.overflowY = 'hidden';
        //             // binding.instance.h = distanceX * 0.5;

        //             // previousDistanceX = distanceX;
        //             // 우측 슬라이드 할 시
        //             if (distanceX < 0) {
        //                 element.style.transition = '0s';
        //                 element.style.marginLeft = 0 + 'px';
        //             } else {
        //                 element.style.transition = '0s';
        //                 element.style.marginLeft = -(distanceX * speed) + 'px';
        //             }
        //         }

        //         function touchendHandler(e) {
        //             if (data.ingEventElement) return;
        //             const touches = e.changedTouches[0],
        //                 endTx = touches.clientX,
        //                 endTy = touches.clientY,
        //                 distanceX = startTx - endTx,
        //                 distanceY = startTy - endTy;
        //             element.style.transition = '0.3s';
        //             element.style.marginLeft = 0 + 'px';

        //             // previousDistanceX = 0;
        //             // backError = false;
        //             chatBox.style.overflowY = 'scroll';

        //             if (Math.abs(distanceX) >= Math.abs(distanceY)) {
        //                 if (distanceX * speed > 80) {
        //                     const message_id = element.getAttribute('data-uuid');
        //                     data.$store.commit('setReplyUuid', message_id);

        //                     const viewportHeight = window.visualViewport.height;
        //                     window.scrollTo({ top: viewportHeight, behavior: 'smooth' });
        //                 }
        //             }
        //         }

        //         const touchstartListener = (e) => {
        //             touchstartHandler(e);
        //         };

        //         const touchmoveListener = (e) => {
        //             touchmoveHandler(e);
        //         };

        //         // const touchendListener = (e) => {
        //         //     touchendHandler(e);
        //         // };


        //         element.addEventListener('touchstart', toFit(touchstartListener, {}), { passive: true });
        //         element.addEventListener('touchmove', toFit(touchmoveListener, {}), { passive: true });
        //         element.addEventListener('touchend', touchendHandler, { passive: true });

        //         // 컴포넌트가 파기될 때 이벤트 리스너 제거
        //         element.addEventListener('beforeDestroy', () => {
        //             element.removeEventListener('touchstart', toFit(touchstartListener, {}));
        //             element.removeEventListener('touchmove', toFit(touchmoveListener, {}));
        //             element.removeEventListener('touchend', touchendHandler);
        //         });
        //     },
        // },
        more: {
            mounted(element, binding) {
                const data = binding.instance;

                // if (data.$route.path.split('/')[1] === 'public'
                //     && data.$route.path.split('/')[3] !== data.publicInfo.room_uuid) return
                const chatBox = document.getElementsByClassName('chat-box')[0];

                let startTx, startTy, moreStop, timer;

                function isOpendKeyboardBox() {
                    const isAndroid = /Android/.test(navigator.userAgent);
                    if (isAndroid) {
                        let documentHeight = document.documentElement.clientHeight;
                        let viewportHeight = window.visualViewport.height;
                        let keyboardHeight = documentHeight - viewportHeight + 1;
                        if (keyboardHeight > 5) return true;
                    } else {
                        if (document.documentElement.clientHeight !== window.visualViewport.height) return true;
                    }

                    return false;
                }

                function touchstartHandler(e, time = 400) {
                    // console.log(e.touches)
                    const touches = e.touches ? e.touches[0] : null;
                    startTx = touches ? touches.clientX : 0;
                    startTy = touches ? touches.clientY : e.clientY;

                    // 이전의 msg가 있으면 제거
                    const msgMore = document.getElementById('msg-more');
                    if (msgMore) msgMore.style.display = 'none';

                    const ingEventElement = data.ingEventElement;
                    if (ingEventElement && ingEventElement.childNodes[1]) ingEventElement.childNodes[1].style.display = 'none'
                    data.$store.commit('TOGGLE_ING_EVENT_ELEMENT', null);


                    // 클릭할 수 있는 msg 설정
                    setTimeout(() => {
                        data.$store.commit('MSG_MORE_SETTING_CLEAR');

                        const room_type = data.$route.path.split('/')[1];
                        if (room_type === 'public') {
                            const my_room_uuid = data.publicInfo.room_uuid;
                            const room_uuid = data.$route.path.split('/').slice(-1)[0];
                            const sender_uuid = element.getAttribute('data-sender-uuid');


                            // 자신의 편지함일 때
                            if (my_room_uuid === room_uuid) {
                                // 자신의 메시지는 삭제만 가능
                                if (my_room_uuid === sender_uuid) data.$store.commit('TOGGLE_MSG_MORE_SETTING', { key: 'posibleDeleteMessage', value: true });
                                else {
                                    // 타인의 메시지는 답글, 차단, 삭제 가능
                                    data.$store.commit('TOGGLE_MSG_MORE_SETTING', { key: 'posibleReplyMessage', value: true });
                                    data.$store.commit('TOGGLE_MSG_MORE_SETTING', { key: 'posibleBlockUser', value: true });
                                    data.$store.commit('TOGGLE_MSG_MORE_SETTING', { key: 'posibleReportUser', value: true });
                                    data.$store.commit('TOGGLE_MSG_MORE_SETTING', { key: 'posibleDeleteMessage', value: true });
                                }
                            } else {
                                // 타인의 편지함일 때
                                // 자신의 메시지 삭제만 가능
                                if (sender_uuid === data.myInfo.user_uuid) data.$store.commit('TOGGLE_MSG_MORE_SETTING', { key: 'posibleDeleteMessage', value: true });
                            }
                        } else if (room_type === 'chat') {
                            const isMyMessage = element.getAttribute('data-my-message');

                            if (isMyMessage) data.$store.commit('TOGGLE_MSG_MORE_SETTING', { key: 'posibleDeleteMessage', value: true });
                            else data.$store.commit('TOGGLE_MSG_MORE_SETTING', { key: 'posibleDeleteMessage', value: false });
                        } else if (room_type === 'blind') {
                            const isMyMessage = element.getAttribute('data-my-message');
                            if (!isMyMessage) {
                                data.$store.commit('TOGGLE_MSG_MORE_SETTING', { key: 'posibleBlockUser', value: true });
                                data.$store.commit('TOGGLE_MSG_MORE_SETTING', { key: 'posibleReportUser', value: true });
                            }
                        }
                    }, 100);


                    clearTimeout(timer);
                    timer = setTimeout(() => {
                        const msgMore = document.getElementById('msg-more');
                        // chatBox.style.overflowY = 'hidden';

                        createOverLay();

                        const isMyMessage = element.getAttribute('data-my-message');

                        if (isMyMessage) {
                            const rightOfTarget = element.getBoundingClientRect().right;
                            msgMore.style.right = (window.innerWidth - rightOfTarget) + 'px';
                            msgMore.style.left = 'auto';
                        } else {
                            const leftOfTarget = element.getBoundingClientRect().left;
                            msgMore.style.left = leftOfTarget + 'px';
                            msgMore.style.right = 'auto';
                        }

                        data.isIngEvent = 'more';
                        data.$store.commit('TOGGLE_ING_EVENT_ELEMENT', element);

                        msgMore.style.display = 'block';
                        element.childNodes[1].style.display = 'block'

                        // 50 is height of app header
                        let topOfTarget = element.getBoundingClientRect().top - 50;
                        topOfTarget += chatBox.scrollTop;

                        const chatProfile = document.getElementById('chat-profile');
                        let chatProfileHeight = 0;
                        if (chatProfile) chatProfileHeight = chatProfile.getBoundingClientRect().height;

                        topOfTarget -= chatProfileHeight;

                        let documentHeight = document.documentElement.clientHeight;
                        let viewportHeight = window.visualViewport.height;
                        let keyboardHeight = documentHeight - viewportHeight + 1;

                        const isAndroid = /Android/.test(navigator.userAgent);
                        if (isOpendKeyboardBox()) {
                            if (!isAndroid) {
                                topOfTarget += keyboardHeight;
                            }
                        }

                        if (data.reply_uuid) {
                            data.$store.commit('setReplyUuid', null);
                            // topOfTarget += 49;
                        }

                        const moreMsgHeight = msgMore.getBoundingClientRect().height;
                        const bottomOfTarget = element.getBoundingClientRect().bottom;
                        const bottomOfChatBox = chatBox.getBoundingClientRect().bottom;


                        // 위에 msgMorebox를 넣을 공간이 있으면 msg 박스를 위에 위치
                        if (topOfTarget - chatBox.scrollTop + chatProfileHeight - keyboardHeight > moreMsgHeight) {
                            msgMore.style.top = topOfTarget - moreMsgHeight - 4 + 'px';
                        } else if (bottomOfChatBox - bottomOfTarget > moreMsgHeight) {
                            if (isAndroid) {
                                msgMore.style.top = bottomOfTarget - 50 + chatBox.scrollTop - chatProfileHeight + 4 + 'px';
                            } else {
                                msgMore.style.top = bottomOfTarget - 50 + chatBox.scrollTop + keyboardHeight - chatProfileHeight + 4 + 'px';
                            }
                        } else {
                            let top = startTy + keyboardHeight - moreMsgHeight - 60 + chatBox.scrollTop;

                            if (isAndroid) {
                                top = startTy - moreMsgHeight - 60 + chatBox.scrollTop;
                            } else {
                                top = startTy + keyboardHeight - moreMsgHeight - 60 + chatBox.scrollTop;
                            }

                            // 키보드가 올라간 상태에서 화면의 top 보다 (document.height - keyboard.hegith)
                            // msgMore의 top이 위에 있으면 아래로 조금 내림 (msgMore.top + msgMore.hegiht > ?)
                            if (chatBox.scrollTop + keyboardHeight - 60 > top) {
                                top += moreMsgHeight;
                            }

                            msgMore.style.top = top + 'px';
                        }
                    }, time);
                }

                function touchmoveHandler(e) {
                    if (moreStop) return;

                    const touches = e.changedTouches ? e.changedTouches[0] : null,
                        endTx = touches ? touches.clientX : 0,
                        endTy = touches ? touches.clientY : 0,
                        distanceX = startTx - endTx,
                        distanceY = startTy - endTy;

                    if (Math.abs(distanceY) > 5 || Math.abs(distanceX) > 5) {
                        clearTimeout(timer);
                        moreStop = true
                    }
                }

                function touchendHandler() {
                    // chatBox.style.overflowY = 'scroll';
                    clearTimeout(timer);
                    moreStop = false;
                    data.isIngEvent = '';
                }

                function mouseDownHandler(e) {
                    if ((e.button === 2) || (e.which === 3)) {
                        touchstartHandler(e, 100);
                    }
                }

                function preventDefault(e) {
                    e.preventDefault();
                }

                element.addEventListener('touchstart', touchstartHandler, { passive: true });
                element.addEventListener('touchmove', touchmoveHandler, { passive: true },);
                element.addEventListener('touchend', touchendHandler, { passive: true });


                element.addEventListener('mousedown', mouseDownHandler, { passive: true });
                element.addEventListener('contextmenu', preventDefault);

                element.addEventListener('beforeDestroy', () => {
                    element.removeEventListener('touchstart', touchstartHandler);
                    element.removeEventListener('touchmove', touchmoveHandler);
                    element.removeEventListener('touchend', touchendHandler);

                    element.removeEventListener('mousedown', mouseDownHandler);
                    element.removeEventListener('contextmenu', preventDefault);
                });
            },
        },
    },

}
