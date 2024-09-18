<template>
    <div>
        <div>
            <div>
                <div class="d-flex">
                    <div
                        v-if="publicInfo && Object.keys(publicInfo).length !== 0"
                        class="d-flex pt-2 pb-2 px-3 align-items-center w-100 click-effect"
                        style="min-width: 100%"
                        @click="enterPublicRoom"
                    >
                        <profile-image
                            :profile_img="'letter'"
                            size="50px"
                            :backGroundColor="'#3366ff'"
                            :fontSize="'25px'"
                        />

                        <div class="message-info ps-2 ms-1 pe-3">
                            <div class="fs-16 fw-bold" style="line-height: 1.2rem">
                                {{ publicInfo.name || '우편함' }}
                            </div>
                            <div class="d-flex w-100">
                                <div
                                    class="text-truncate"
                                    ref="textContainer"
                                    :class="{
                                        'text-body': !publicInfo.is_read,
                                        'blur-color': publicInfo.is_read,
                                        'fw-bold': !publicInfo.is_read,
                                    }"
                                >
                                    {{ messageParsing(publicInfo.last_content) }}
                                </div>
                            </div>
                        </div>
                        <div style="min-width: 50px">
                            <div class="blur-color fs-14 text-end">{{ dateParsing(publicInfo.last_content_time) }}</div>
                            <div class="read-light-wrapper" :class="{ invisible: publicInfo.is_read }">
                                <div class="read-light"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="chatRoomList && Object.keys(chatRoomList).length !== 0">
            <div v-for="(item, index) in parseArrayChatRoomList" :key="index" style="border: 0px solid #fff !important">
                <div class="position-relative d-flex leave-chat" :class="{ 'fade-out': item.is_delete }">
                    <div
                        v-swiper
                        class="d-flex pt-2 pb-2 px-3 align-items-center w-100 click-effect"
                        style="min-width: 100%; background-color: #fff; z-index: 1"
                    >
                        <div @click="enterProfile(item)">
                            <profile-image :profile_img="item.profile_img" :link="true" size="50px" />
                        </div>

                        <div
                            class="message-info ps-2 ms-1 pe-3"
                            @mousedown="handleMouseDown"
                            @mouseup="handleMouseUp"
                            @click="enterChatRoom(item)"
                        >
                            <div class="d-flex w-100 fs-16" style="line-height: 1.2rem">
                                <div class="text-truncate" :class="{ 'fw-bold': !item.is_read }">
                                    {{ item.friend_name ? item.friend_name : item.nickname }}
                                </div>
                            </div>
                            <div class="d-flex w-100">
                                <div
                                    class="text-truncate"
                                    :class="{
                                        'text-body': !item.is_read,
                                        'blur-color': item.is_read,
                                        'fw-bold': !item.is_read,
                                    }"
                                    ref="textContainer"
                                >
                                    {{ messageParsing(item.last_content) }}
                                </div>
                            </div>
                        </div>
                        <div style="min-width: 50px">
                            <div class="blur-color fs-14 text-end" ref="last_content_time">
                                {{ dateParsing(item.last_content_time) }}
                            </div>
                            <div class="read-light-wrapper">
                                <div :class="{ invisible: item.is_read }" class="read-light"></div>
                            </div>
                        </div>
                    </div>
                    <div class="button-wrapper d-flex" :class="{ active: isButtonActive }">
                        <!-- <button class="block-button">차단</button> -->
                        <button class="exit-button" @click="deleteChatRoom(item.room_uuid)">나가기</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div v-if="!hiddenSpinner" class="spinner-grow" role="status">
            <span class="visually-hidden">Loading...</span>
        </div> -->
    </div>
</template>

<script>
import ProfileImage from '@/components/ProfileImage';
import { mapGetters } from 'vuex';

export default {
    name: 'ChatRoomList',
    components: {
        ProfileImage,
    },
    data() {
        return {
            isButtonActive: false,
            ingEvent: false,
            slideChatRoomDom: null,
            scrollHandlerWithToFit: null,
            hiddenSpinner: true,
            gettingChatRoomListData: false,
        };
    },
    computed: {
        ...mapGetters(['publicInfo', 'chatRoomList', 'currentChatRoomPage', 'previousChatRoomPage']),
        parseArrayChatRoomList() {
            if (this.chatRoomList.length === 0) return [];
            return Object.keys(this.chatRoomList)
                .map((el) => this.chatRoomList[el])
                .sort((a, b) => {
                    if (a.last_content_time < b.last_content_time) return 1;
                    if (a.last_content_time > b.last_content_time) return -1;
                    return 0;
                });
        },
    },
    mounted() {
        window.addEventListener('resize', this.ellipsisText);
        document.body.addEventListener('touchend', this.closeChatItemSlideEvent);

        // 스크롤 페이징
        const dom = document.getElementsByClassName('chats')[0];
        this.scrollHandlerWithToFit = this.toFit(this.handleScroll, {});
        dom.addEventListener('scroll', this.scrollHandlerWithToFit, { passive: true });

        // const previousScroll = sessionStorage.getItem('chat-room-page');
        // if (previousScroll) {
        //     dom.scrollTo(0, previousScroll - dom.offsetHeight);
        // }
    },
    methods: {
        toFit(cb, { dismissCondition = () => false, triggerCondition = () => true }) {
            if (!cb) {
                throw Error('Invalid required arguments');
            }

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

        resetChatItemSlideEventData() {
            this.slideChatRoomDom = null;
            this.ingEvent = false;
        },

        closeChatItemSlideEvent() {
            if (this.ingEvent || !this.slideChatRoomDom) return;

            this.slideChatRoomDom.style.marginLeft = 0 + 'px';
            const previousDom = this.slideChatRoomDom;
            if (previousDom) previousDom.style.marginLeft = 0 + 'px';

            setTimeout(() => {
                this.resetChatItemSlideEventData();
            }, 100);
        },
        handleScroll() {
            if (this.gettingChatRoomListData) return;

            const dom = document.getElementsByClassName('chats')[0];

            if (dom.scrollHeight < dom.scrollTop + dom.offsetHeight + 1) {
                if (this.currentChatRoomPage === this.previousChatRoomPage) {
                    const dom = document.getElementsByClassName('chats')[0];
                    dom.removeEventListener('scroll', this.scrollHandlerWithToFit);
                } else {
                    this.gettingChatRoomListData = true;
                    this.hiddenSpinner = false;
                    this.$store.dispatch('getChatRoomList');

                    setTimeout(() => {
                        this.gettingChatRoomListData = false;
                        this.hiddenSpinner = true;
                    }, 500);
                }
            }
        },
        moveRouter(path) {
            if (this.slideChatRoomDom) return;
            this.$router.push({ path });
        },
        enterChatRoom(item) {
            if (this.slideChatRoomDom) return;
            this.moveRouter(`/chat/room/${item.room_uuid}`);
        },
        enterPublicRoom() {
            this.moveRouter(`/letter/${this.publicInfo.room_uuid}`);
        },
        enterProfile(item) {
            this.moveRouter(`/profile/${item.email}`);
        },
        deleteChatRoom(room_uuid) {
            this.slideChatRoomDom.style.marginLeft = 0 + 'px';
            this.resetChatItemSlideEventData();
            this.$store.dispatch('deleteChatRoom', room_uuid);
        },

        handleMouseDown() {
            this.isButtonActive = true;
        },
        handleMouseUp() {
            // this.isButtonActive = false;
        },
        messageParsing(message) {
            if (!message) return ' ';
            return message.replace(/< *\/?br *\/?>.*/i, '...').replace(/&nbsp;/g, ' ');
        },
        dateParsing(date) {
            if (!date) return '';

            const currentDateTime = new Date();

            // 문자열 형식의 메시지 시간을 파싱
            const messageTime = new Date(date);

            // 메시지 시간과 현재 시간 간의 차이 계산 (밀리초 단위)
            const timeDifference = currentDateTime - messageTime;

            // 밀리초를 분 단위로 변환
            const minutesDifference = Math.floor(timeDifference / (1000 * 60));
            if (isNaN(minutesDifference)) return '';

            if (minutesDifference <= 0) {
                return '방금';
            } else if (minutesDifference < 60) {
                return `${minutesDifference}분 전`;
            } else if (minutesDifference < 60 * 24) {
                const hoursDifference = Math.floor(minutesDifference / 60);
                return `${hoursDifference}시간 전`;
            } else if (minutesDifference < 60 * 24 * 2) {
                return '어제';
            } else if (minutesDifference < 60 * 24 * 7) {
                const daysDifference = Math.floor(minutesDifference / (60 * 24));
                return `${daysDifference}일 전`;
            } else if (messageTime.getFullYear() === currentDateTime.getFullYear()) {
                return `${messageTime.getMonth() + 1}월 ${messageTime.getDate()}일`;
            } else {
                const year = messageTime.getFullYear();
                const month = messageTime.getMonth() + 1;
                const day = messageTime.getDate();
                return `${year}-${month}-${day}`;
            }
        },
        // 최근 메시지 두 줄이 넘어가면 ...처리
        // ellipsisText() {
        //     const textContainers = this.$refs.textContainer;
        //     if (!textContainers) return;

        //     textContainers.forEach((container) => {
        //         const maxLines = 2; // 최대 라인 수 (두 줄까지)
        //         const lineHeight = parseInt(window.getComputedStyle(container).lineHeight, 10);
        //         const maxHeight = maxLines * lineHeight;

        //         let containerHeight = container.scrollHeight;
        //         if (containerHeight > maxHeight) {
        //             while (containerHeight > maxHeight) {
        //                 container.textContent = container.textContent.replace(/.{4}$/, '...');
        //                 containerHeight = container.clientHeight;
        //             }
        //         }
        //     });
        // },
    },

    beforeUnmount() {
        window.removeEventListener('resize', this.ellipsisText);
        document.body.removeEventListener('touchend', this.closeChatItemSlideEvent);

        const dom = document.getElementsByClassName('chats')[0];

        // sessionStorage.setItem('chat-room-page', dom.scrollTop + dom.offsetHeight);
        dom.removeEventListener('scroll', this.scrollHandlerWithToFit);

        // sessionStorage.removeItem('chat-room-page');
    },
    directives: {
        swiper: {
            mounted(element, binding) {
                let startTx; /*startTy;*/
                let isTouchEndHandled = false;

                function toFit(cb, { dismissCondition = () => false, triggerCondition = () => true }) {
                    if (!cb) return console.log('Invalid required arguments');

                    let tick = false;

                    return function (e) {
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
                                tick = false;
                                return cb(e);
                            }
                        });
                    };
                }

                function touchstartHandler(e) {
                    const previousDom = binding.instance.slideChatRoomDom;

                    if (previousDom) {
                        if (previousDom.isSameNode(element)) {
                            previousDom.style.marginLeft = 0 + 'px';
                        } else {
                            previousDom.style.marginLeft = 0 + 'px';
                            setTimeout(() => {
                                console.log('del')
                                binding.instance.resetChatItemSlideEventData();
                            }, 50);
                        }
                    }

                    const touches = e.touches[0];
                    startTx = touches.clientX;
                    // startTy = touches.clientY;

                    isTouchEndHandled = false;
                }

                function touchmoveHandler(e) {
                    if (isTouchEndHandled) return;
                    const touches = e.changedTouches[0],
                        endTx = touches.clientX,
                        // endTy = touches.clientY,
                        distanceX = startTx - endTx;
                    // distanceY = startTy - endTy;

                    // 좌우 슬라이드 보다 사하 슬라이드가 크면 스크롤
                    // if (Math.abs(distanceX) < Math.abs(distanceY)) {
                    //     return;
                    // }

                    binding.instance.ingEvent = true;
                    binding.instance.slideChatRoomDom = element;

                    if (element.style.marginLeft === '-82px') return;
                    // 우측 슬라이드 할 시
                    if (distanceX < 0) {
                        element.style.transition = '0s';
                        element.style.marginLeft = -(distanceX / 2) + 'px';

                        if (distanceX < 0) element.style.marginLeft = 0 + 'px';
                    } else {
                        if (distanceX > 164) {
                            element.style.marginLeft = -82 - (distanceX - 164) / 10 + 'px';
                            return;
                        }

                        element.style.transition = '0s';
                        element.style.marginLeft = -(distanceX / 2) + 'px';
                    }

                    // if (previousDistanceX > distanceX) {
                    //     element.style.transition = '0s';
                    //     element.style.marginLeft = marginLeft - distanceX / 100 + 'px';

                    //     const newMarginLeft = parseInt(element.style.marginLeft.replace('px', ''));
                    //     if (newMarginLeft > 0) element.style.marginLeft = 0 + 'px';
                    // } else {
                    //     if (marginLeft < -100) return;

                    //     element.style.transition = '0s';
                    //     const speed = Math.round(Math.abs(previousDistanceX - distanceX) / 3 * 100 ) / 100
                    //     console.log(speed)
                    //     element.style.marginLeft = marginLeft + speed + 'px';
                    //     console.log(element.style.marginLeft)
                    // }
                }

                function touchendHandler(e) {
                    e.stopPropagation();

                    const touches = e.changedTouches[0],
                        endTx = touches.clientX,
                        // endTy = touches.clientY,
                        distanceX = startTx - endTx;
                    // distanceY = startTy - endTy;

                    element.style.transition = '0.5s';
                    setTimeout(() => {
                        binding.instance.ingEvent = false;
                    }, 100);
                    if (Math.abs(distanceX) < 10) {
                        element.style.marginLeft = 0 + 'px';
                        setTimeout(() => {
                            binding.instance.resetChatItemSlideEventData();
                        }, 200);
                        isTouchEndHandled = true;
                        return;
                    }

                    // if (Math.abs(distanceX) >= Math.abs(distanceY)) {
                    if (distanceX < 50) {
                        element.style.marginLeft = 0 + 'px';
                        setTimeout(() => {
                            binding.instance.resetChatItemSlideEventData();
                        }, 200);
                    } else {
                        element.style.marginLeft = '-82px';
                        binding.instance.slideChatRoomDom = element;
                    }
                    // } else {
                    //     element.style.marginLeft = 0 + 'px';
                    // }

                    isTouchEndHandled = true;
                }

                function mouseDownHandler() {
                    const previousDom = binding.instance.slideChatRoomDom;
                    if (previousDom) {
                        if (previousDom.isSameNode(element)) {
                            element.style.marginLeft = 0 + 'px';
                            setTimeout(() => {
                                binding.instance.resetChatItemSlideEventData();
                            }, 200);
                            return;
                        } else {
                            previousDom.style.marginLeft = 0 + 'px';
                        }
                    }

                    isTouchEndHandled = false;

                    binding.instance.ingEvent = true;
                    binding.instance.slideChatRoomDom = element;

                    element.style.transition = '0.5s';
                    element.style.marginLeft = -82 + 'px';

                    isTouchEndHandled = true;
                }

                const touchstartListener = (e) => {
                    touchstartHandler(e);
                };

                const touchmoveListener = (e) => {
                    touchmoveHandler(e);
                };

                function mouseDownListener(e) {
                    if (e.button === 2 || e.which === 3) {
                        mouseDownHandler();
                    }
                }

                function preventDefault(e) {
                    e.preventDefault();
                }

                element.addEventListener('touchstart', toFit(touchstartListener, {}), { passive: true });
                element.addEventListener('touchmove', toFit(touchmoveListener, {}), { passive: true });
                element.addEventListener('touchend', touchendHandler, { passive: true });

                element.addEventListener('mousedown', mouseDownListener, { passive: true });
                element.addEventListener('contextmenu', preventDefault);

                // 컴포넌트가 파기될 때 이벤트 리스너 제거
                element.addEventListener('beforeDestroy', () => {
                    element.removeEventListener('touchstart', toFit(touchstartListener, {}));
                    element.removeEventListener('touchmove', toFit(touchmoveListener, {}));
                    element.removeEventListener('touchend', touchendHandler);

                    element.removeEventListener('mousedown', mouseDownHandler);
                    element.removeEventListener('contextmenu', preventDefault);
                });
            },
        },
    },
};
</script>

<style scoped>
.leave-chat {
    transition: all 0.5s ease;
}

.fade-out {
    opacity: 0;
    /* height: 0px !important; */
}

.message-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: flex-start;
    max-width: calc(100% - 109px);
}

.ellipsis-text {
    line-height: 19px;
    font-size: 14px;
    text-align: left;
}

.read-light-wrapper {
    display: flex;
    justify-content: flex-end;
}

.read-light {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: #6690ff;
}

/* 버튼을 초기에 숨김 */
.button-wrapper {
    position: absolute;
    height: 100%;
    /* position: relative; */
    /* transform: translateX(100%); */
    right: 0;
    top: 0;
    transition: transform 0.3s ease-in-out;
    background-color: #adc8ff;
    border: 1px solid #fff !important;
    box-sizing: border-box;
}

.message-list {
    left: 0;
    background-color: #fff !important;
}

/* 활성화될 때 버튼을 표시 */
.button-wrapper.active {
    transform: translateX(0);
}

.exit-button {
    padding: 0 20px;
    padding-left: 100px;
    background-color: #adc8ff;
    color: #fff;
    border: 0 solid #fff;
    cursor: pointer;
    box-sizing: border-box;
}

.block-button:hover {
    background-color: #000000;
}
/* .exit-button:hover {
    background-color: #cc0000;
} */
</style>