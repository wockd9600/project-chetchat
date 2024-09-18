<template>
    <div class="app-wrapper">
        <top-navigation-bar />

        <div v-if="profileInfo" class="dd">
            <div class="header-profile-info position-absolute d-flex align-items-center" @click="profileDetail()">
                <profile-image :profile_img="profileInfo.profile_img" class="cp" :size="'30px'" />
            </div>
        </div>

        <section class="app-main">
            <!-- <div class="position-absolute" style="z-index: 1000; bottom: 55%">{{ sccdd }}</div> -->
            <!-- <div class="position-absolute" style="z-index: 1000; bottom: 50%">{{ sccd }}</div> -->
            <div class="chat-box" ref="chatBox">
                <div class="px-3" :class="{ invisible: isLoading }">
                    <div
                        v-if="displayProfileInfo"
                        class="position-relative pt-5 pb-3"
                        id="chat-profile"
                        style="background-color: white; z-index: 1"
                    >
                        <profile-info :option="profileInfo" :link="true" :isFocus="true" />
                        <div class="line mt-3 mb-2"></div>
                    </div>

                    <div class="position-relative">
                        <span class="msg-more cp" id="msg-more">
                            <ul>
                                <li @click.passive="replyMessage">답글 달기</li>
                                <li @click.passive="copyMessageFromChatRoom">복사</li>
                                <li
                                    v-if="msgMoreSetting.posibleDeleteMessage"
                                    @click.passive="deleteMessageFromChatRoom"
                                >
                                    삭제
                                </li>
                            </ul>
                        </span>
                    </div>

                    <loading-spinner v-if="isGetMessageLoading" />

                    <div v-for="item in messageList" :key="item.id">
                        <chat-item v-if="item.is_my_message" :item="item" />
                        <other-chat-item v-else :item="item" />
                    </div>
                </div>
                <loading-spinner v-if="isLoading" positionY="bottom" />

                <!-- <div
                        class="reply-wrapper d-flex align-items-center"
                        id="reply-icon"
                    >
                        <base-icon :icon="'reply'" class="reply-icon" />
                    </div> -->

                <button id="scrollToBottomBtn" ref="scrollToBottomBtn" @click="scrollToBottom"></button>

                <div class="reply-info" :class="{ 'reply-info-up': reply_uuid }"></div>
            </div>
        </section>

        <bottom-navigation-bar />

        <image-zoom />
    </div>
</template>
  
<script>
import ChatItem from '@/components/ChatItem';
import OtherChatItem from '@/components/ChatItem/other';
import ImageZoom from '@/components/ImageZoom';

// import BaseIcon from '@/components/BaseIcon';

import ChatHandler from '@/mixin/ChatHandler';
import { mapGetters } from 'vuex';
import { socketEmit } from '@/utils/socket.js';

export default {
    name: 'ChatRoom',
    components: {
        ChatItem,
        OtherChatItem,
        ImageZoom,
        // BaseIcon,
    },
    computed: {
        ...mapGetters(['chatRoomList', 'messageList', 'profileInfo', 'msgMoreSetting']),
    },
    data() {
        return {
            room_uuid: this.$route.path.split('/').slice(-1)[0],
            // sccd: 0,
            // sccdd: null,
        };
    },
    created() {
        const room_uuid = this.$route.path.split('/').slice(-1)[0];

        const profileInfo = this.chatRoomList[room_uuid];

        if (profileInfo) {
            const filterObj = { ...profileInfo, margin: false, relation: 0 };
            this.$store.commit('PROFILE_INFO_INIT', filterObj);

            const name = profileInfo.friend_name ? profileInfo.friend_name : profileInfo.nickname;
            this.$store.commit('setChatRoomName', name);

            this.$store.dispatch('readMessage', room_uuid);
            this.$store.dispatch('initializeChatRoom', room_uuid);
        } else {
            alert('존재하지 않는 채팅방입니다.');
            this.$router.push({ path: `/chat` });
        }
    },
    mixins: [ChatHandler],
    watch: {
        messageList(newValue, oldValue) {
            this.$nextTick(() => {
                this.scrollBottomWhenNewMessageList(newValue, oldValue);
                if (newValue.length < 30 || newValue.length - oldValue.length < 30) this.displayProfileInfo = true;
            });
        },
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

        profileDetail() {
            setTimeout(() => {
                this.$router.push({ path: `/profile/${this.profileInfo.email}` });
            }, 200);
        },

        handleScrollFromChatRoom() {
            const chatBox = this.$refs.chatBox;
            const scrollToBottomBtn = this.$refs.scrollToBottomBtn;

            if (chatBox.scrollHeight > chatBox.scrollTop + chatBox.getBoundingClientRect().height + 200) {
                scrollToBottomBtn.style.display = "block";
            } else {
                scrollToBottomBtn.style.display = "none";
            }

            if (this.messageList.length < 30) return;

            const dom = this.$refs.chatBox;
            this.handleScroll(dom, 'getMessageInChatRoom', { room_uuid: this.room_uuid, page: this.page + 1 });
        },

        copyMessageFromChatRoom() {
            const id = parseInt(this.ingEventElement.getAttribute('data-uuid'));
            const index = this.messageList.findIndex((item) => item.id === id);
            if (index === -1) return;
            if (this.messageList[index].img) return;

            this.copyMessage(this.messageList[index].content);
        },
        deleteMessageFromChatRoom() {
            const isDelete = confirm('상대방이 더 이상 메시지를 볼 수 없게 됩니다.');
            if (!isDelete) return this.clearMsgMore();

            if (this.messageList.length < 2) {
                this.clearMsgMore();
                return alert('메시지가 너무 적습니다.');
            }

            const data = { room_uuid: this.room_uuid, id: this.ingEventElement.getAttribute('data-uuid') };
            this.clearMsgMore();
            this.deleteMessage('deleteMessage', data);
        },
    },
    beforeUnmount() {
        // can't access computed but can access data
        this.$store.dispatch('clearChatRoom');
        socketEmit('leave chat room', { room_uuid: this.room_uuid });

        const dom = document.getElementsByClassName('chat-box')[0];
        dom.removeEventListener('scroll', this.handleScrollHandler);
    },
};
</script>
  
<style scoped>
#scrollToBottomBtn {
    display: none;
    position: fixed;
    bottom: 60px;
    right: 16px;
    z-index: 99;
    background-color: #dddddd;
    color: #000000;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    font-size: 20px;
    cursor: pointer;
    opacity: .9;
}
#scrollToBottomBtn::after {
    content: '';
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    width: 12px;
    height: 12px;
    border-left: 2px solid #000000;
    border-bottom: 2px solid #000000;
  }

.dd {
    position: fixed;
    top: 0;
    height: 0;
    z-index: 1000;
}
.header-profile-info {
    top: 0;
    height: 50px;
    margin-left: 45px;
}
</style>
    