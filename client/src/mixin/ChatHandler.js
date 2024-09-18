import ProfileInfo from '@/components/ProfileInfo';
import ProfileImage from '@/components/ProfileImage';
import LoadingSpinner from '@/components/LoadingSpinner'

import { mapGetters } from 'vuex';

import { scrollToTopOfChatBoxImportant, scrollToBottomOfChatBoxImportant } from '@/utils/chat';
// import imageZoomClosure from '@/utils/mediumZoom';
import { deleteOverLay } from '@/utils/overlay';

export default {
    components: {
        ProfileInfo,
        ProfileImage,
        LoadingSpinner,
    },
    computed: {
        ...mapGetters([
            'myInfo',
            'reply_uuid',
            'ingEventElement',
            'addImage',
            'destroyZoom',
            'currentScollPosition',
        ]),
    },
    data() {
        return {
            handleScrollHandler: null,
            touchmoveHandler: null,
            chatBoxHeight: 0,
            page: 0,
            displayProfileInfo: false,

            isLoading: true,
            isGetMessageLoading: false,
        };
    },
    async mounted() {
        const chatBox = this.$refs.chatBox;
        this.handleScrollHandler = this.toFit(this.handleScrollFromChatRoom, {});
        this.touchmoveHandler = this.toFit(this.d, {});

        chatBox.addEventListener('scroll', this.handleScrollHandler, { passive: true });
        chatBox.addEventListener('touchmove', this.touchmoveHandler, { passive: true });
    },
    methods: {
        toFit(cb, { dismissCondition = () => false, triggerCondition = () => true }) {
            if (!cb) return;

            let tick = false;

            return function (e) {
                // console.log('scroll call')

                if (tick) {
                    return;
                }

                tick = true;
                return requestAnimationFrame(() => {
                    if (dismissCondition()) {
                        tick = false;
                        return;
                    }

                    if (triggerCondition()) {
                        // console.log('real call')
                        tick = false;
                        return cb(e);
                    }
                });
            };
        },
        d() {
            if (this.isDelaycurrentScrollPosition) return;

            this.isDelaycurrentScrollPosition = true;

            setTimeout(() => {
                this.isDelaycurrentScrollPosition = false;
            }, 300);

            const dom = this.$refs.chatBox;
            this.$store.commit('SET_CURRENT_SCROLL_POSITION', dom.scrollTop);
        },
        // imageZoom() {
        //     if (!this.destroyZoom) {
        //         const closure = imageZoomClosure('.chat-img', '20px');
        //         this.$store.commit('SET_IMAGE_ZOOM_CLOSURE', closure);
        //     }
        // },
        isOpendKeyboardBox() {
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
        },
        copyToClipboard(msg) {
            // const textArea = document.createElement('textarea');
            // document.body.appendChild(textArea);


            // textArea.value = msg;
            // textArea.select();
            // document.execCommand('copy');
            // document.body.removeChild(textArea);
            navigator.clipboard.writeText(msg);
            if (this.isOpendKeyboardBox()) {
                document.getElementById('sendInput').focus();
            }
        },

        replyMessage() {
            this.$store.commit('setReplyUuid', this.ingEventElement.getAttribute('data-uuid'));
            this.clearMsgMore();
        },
        copyMessage(msg) {
            const message = msg.replace(/< *\/?br *\/?>/gi, '\n');
            this.copyToClipboard(message);
            this.clearMsgMore();
        },

        scrollToBottom() {
            const chatBox = this.$refs.chatBox;
            chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'instant' });
        },

        scrollBottomWhenNewMessageList(newValue, oldValue) {
            const images = document.getElementsByClassName('chat-img'); // 이미지 엘리먼트 선택
            let loadedCount = 0;

            const loadImageHandler = (event) => {
                if (this.addImage) this.addImage(event.target);

                loadedCount++;
                if (loadedCount === images.length) {
                    this.onImageLoaded(newValue, oldValue);
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
                this.onImageLoaded(newValue, oldValue);
            }
        },

        onImageLoaded(newValue, oldValue) {
            // this.imageZoom();
            this.messageListWatch(newValue, oldValue);
        },

        handleScroll(dom, name, data) {
            if (!this.isLoading && !this.isGetMessageLoading && dom.scrollTop === 0) {
                this.isGetMessageLoading = true;
                scrollToTopOfChatBoxImportant(0);

                this.$store.dispatch(name, data);
            }
        },

        messageListWatch(newValue, oldValue) {
            const addedChatBoxHeight = this.$refs.chatBox.scrollHeight;

            if (oldValue.length < 2) {
                const dom = this.$refs.chatBox;

                dom.scrollTo({ top: dom.scrollHeight, behavior: 'instant' });
                scrollToBottomOfChatBoxImportant(0);
                this.isLoading = false;
                setTimeout(() => {
                    this.chatBoxHeight = this.$refs.chatBox.scrollHeight + 64;
                }, 100);
                return;
            }

            this.isGetMessageLoading = false;

            if (newValue.length !== oldValue.length) {
                // setTimeout(() => {
                this.$refs.chatBox.scrollTo({ top: addedChatBoxHeight - this.chatBoxHeight, behavior: 'instant' });
                // }, 0);
            }

            if (newValue.length - oldValue.length === 30) {
                this.page++;
            } else {
                const dom = this.$refs.chatBox;
                dom.removeEventListener('scroll', this.handleScrollHandler);
            }

            this.chatBoxHeight = addedChatBoxHeight;
        },

        blockUser(data) {
            const result = confirm('상대방의 메시지를 받을 수 없게 됩니다.');
            if (!result) return;

            this.clearMsgMore();
            this.$store.dispatch('addBlockUser', { ...data })
        },
        reportUser(data) {
            this.$store.dispatch('reportkUser', data);
        },
        deleteMessage(name, param) {
            const dom = document.getElementsByClassName('reply-wrapper')[0];
            if (dom) dom.style.top = '0px'

            this.$store.dispatch(name, param);
        },
        clearMsgMore() {
            if (!this.ingEventElement) return;

            setTimeout(() => {
                const msgMore = document.getElementById('msg-more');
                if (msgMore) {
                    msgMore.style.display = 'none';
                    if (this.ingEventElement && this.ingEventElement.childNodes[1]) this.ingEventElement.childNodes[1].style.display = 'none'
                }

                deleteOverLay();
            }, 10);
        },
    },
    beforeUnmount() {
        const dom = this.$refs.chatBox;
        dom.removeEventListener('scroll', this.handleScrollHandler);
        dom.removeEventListener('touchmove', this.touchmoveHandler);

        if (this.destroyZoom) {
            this.destroyZoom();
            this.$store.commit('CLEARE_IMAGE_ZOOM_CLOSURE');
        }
    },
    directives: {
        // scroll: {
        //     mounted(element, binding) {
        //         let isDragging = false;
        //         let startTy = 0;
        //         let velocityY = 0;

        //         function touchstartHandler(e) {
        //             isDragging = true;
        //             const touches = e.changedTouches[0];
        //             startTy = touches.clientY;
        //         }

        //         function touchmoveHandler(e) {
        //             if (!isDragging) {
        //                 return;
        //             }

        //             const touches = e.changedTouches[0];
        //             const endTy = touches.clientY;

        //             // 스크롤 이동량을 계산
        //             const deltaY = endTy - startTy;
        //             binding.instance.h = deltaY
        //             element.scrollBy({ left: 0, top: -deltaY });

        //             // 현재 속도 계산 (증가값이 아닌 전체 속도)
        //             velocityY = deltaY;

        //             startTy = endTy;
        //         }

        //         function touchendHandler() {
        //             isDragging = false;
        //             // 스크롤을 놓았을 때 추가 스크롤 적용을 시작
        //             requestAnimationFrame(releaseScroll);
        //         }

        //         function releaseScroll() {
        //             if (!isDragging) {
        //                 // 스크롤을 놓았을 때 추가 스크롤 적용
        //                 if (Math.abs(velocityY) > 1) {
        //                     // 스크롤이 멈추기까지 시간에 따라 감속
        //                     velocityY *= 0.9;
        //                     element.scrollBy({ left: 0, top: -velocityY });
        //                     requestAnimationFrame(releaseScroll);
        //                 }
        //             }
        //         }

        //         element.addEventListener('touchstart', touchstartHandler);
        //         element.addEventListener('touchmove', touchmoveHandler, { passive: false });
        //         element.addEventListener('touchend', touchendHandler);


        //         element.addEventListener('beforeDestroy', () => {
        //             element.removeEventListener('touchstart', touchstartHandler);
        //             element.removeEventListener('touchmove', touchmoveHandler);
        //             element.removeEventListener('touchend', touchendHandler);

        //         });
        //     }
        // },
    },
}
