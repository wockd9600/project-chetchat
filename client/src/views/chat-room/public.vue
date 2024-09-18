<template>
    <div class="app-wrapper">
        <top-navigation-bar />

        <div v-if="profileInfo && Object.keys(profileInfo).length !== 0" class="dd">
            <div class="header-profile-info position-absolute d-flex align-items-center" @click="profileDetail()">
                <profile-image :profile_img="profileInfo.profile_img" class="cp" :size="'30px'" />
            </div>
        </div>
        <section class="app-main">
            <!-- <div class="position-absolute" style="z-index: 1000; bottom: 100px; left: 10px;">{{ sccd }}</div> -->

            <div class="chat-box" ref="chatBox">
                <div class="px-3 pt-2" :class="{ invisible: isLoading }">
                    <div class="position-relative">
                        <span class="msg-more cp" id="msg-more">
                            <ul>
                                <li v-if="msgMoreSetting.posibleReplyMessage" @click.passive="replyMessage">
                                    답글 달기
                                </li>
                                <li @click.passive="copyMessageFromPublicRoom">복사</li>
                                <li v-if="msgMoreSetting.posibleBlockUser" @click.passive="blockUserFromPublicRoom">
                                    차단
                                </li>
                                <li v-if="msgMoreSetting.posibleReportUser" @click.passive="reportUserFromPublicRoom">
                                    신고
                                </li>
                                <li
                                    v-if="msgMoreSetting.posibleDeleteMessage"
                                    @click.passive="deleteMessageInPublicRoom"
                                >
                                    삭제
                                </li>
                            </ul>
                        </span>
                    </div>

                    <loading-spinner v-if="isGetMessageLoading" />

                    <!-- 내 편지함 -->
                    <div v-if="publicInfo.room_uuid === room_uuid">
                        <div v-for="item in publicMessageList" :key="item.id">
                            <public-chat-item v-if="item.sender_uuid === room_uuid" :item="item" />
                            <other-chat-item v-else :item="item" />
                        </div>
                    </div>
                    <!-- 다른 사람 편지함 -->
                    <div v-else>
                        <div v-for="item in publicMessageList" :key="item.id">
                            <public-chat-item v-if="item.sender_uuid !== room_uuid" :item="item" />
                            <other-chat-item v-else :item="item" />
                        </div>
                    </div>
                    <!-- <div
                            class="reply-wrapper d-flex align-items-center"
                            id="reply-icon"
                        >
                            <base-icon :icon="'reply'" class="reply-icon" />
                        </div> -->

                    <!-- <div class="spinner-grow" :class="{ invisible: hiddenSpinner }" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div> -->
                </div>
                <loading-spinner v-if="isLoading" positionY="bottom" />
                <button id="scrollToBottomBtn" ref="scrollToBottomBtn" @click="scrollToBottom"></button>

                <div class="reply-info" :class="{ 'reply-info-up': reply_uuid }"></div>

                <image-zoom />
            </div>
        </section>

        <bottom-navigation-bar />
    </div>
</template>
  
<script>
import OtherChatItem from '@/components/ChatItem/other';
import PublicChatItem from '@/components/ChatItem/public';
import ImageZoom from '@/components/ImageZoom';
// import BaseIcon from '@/components/BaseIcon';

import ChatHandler from '@/mixin/ChatHandler';
import { mapGetters } from 'vuex';
import { socketEmit } from '@/utils/socket.js';

export default {
    name: 'PublicRoom',
    components: {
        OtherChatItem,
        PublicChatItem,
        ImageZoom,
        // BaseIcon,
    },
    computed: {
        ...mapGetters(['publicInfo', 'currentPublicInfo', 'profileInfo', 'publicMessageList', 'msgMoreSetting']),
    },
    data() {
        return {
            room_uuid: this.$route.path.split('/').slice(-1)[0],
            // sccd: 123,
        };
    },
    mixins: [ChatHandler],
    watch: {
        publicMessageList(newValue, oldValue) {
            this.$nextTick(() => {
                this.scrollBottomWhenNewMessageList(newValue, oldValue);
            });
        },
    },
    created() {
        if (this.publicInfo.room_uuid === this.room_uuid) {
            this.$store.dispatch('chanageHeader', 'MyPublicRoom');
        }
        this.$store.commit('CLEAR_PROFILE_INFO');
        this.$store.dispatch('initializePublicRoom', this.room_uuid);
    },
    mounted() {
        const dom = this.$refs.chatBox;
        const handleScroll = () => this.handleScrollFromPublicRoom(dom);
        this.handleScrollHandler = handleScroll;

        dom.addEventListener('scroll', handleScroll, { passive: true });
    },
    methods: {
        handleScrollFromPublicRoom(dom) {
            const chatBox = this.$refs.chatBox;
            const scrollToBottomBtn = this.$refs.scrollToBottomBtn;

            if (chatBox.scrollHeight > chatBox.scrollTop + chatBox.getBoundingClientRect().height + 200) {
                scrollToBottomBtn.style.display = "block";
            } else {
                scrollToBottomBtn.style.display = "none";
            }

            if (this.publicMessageList.length < 30) return;

            this.handleScroll(dom, 'getMessageInPublicRoom', { room_uuid: this.room_uuid, page: this.page + 1 });
        },

        copyMessageFromPublicRoom() {
            const id = parseInt(this.ingEventElement.getAttribute('data-uuid'));
            const index = this.publicMessageList.findIndex((item) => item.id === id);
            if (index === -1) return;
            if (this.publicMessageList[index].img) return;

            this.copyMessage(this.publicMessageList[index].content);
        },
        blockUserFromPublicRoom() {
            const sender_uuid = this.ingEventElement.getAttribute('data-sender-uuid');
            this.blockUser({ uuid: sender_uuid });
        },
        reportUserFromPublicRoom() {
            const isReport = confirm('신고하시겠습니까?');
            if (!isReport) return this.clearMsgMore();

            this.reportUser({ room: 0, message_id: this.ingEventElement.getAttribute('data-uuid') });
            this.clearMsgMore();
        },
        deleteMessageInPublicRoom() {
            const isDelete = confirm('상대방이 더 이상 메시지를 볼 수 없게 됩니다.');
            if (!isDelete) return this.clearMsgMore();

            if (this.publicMessageList.length < 2) {
                return alert('메시지가 너무 적습니다.');
            }

            const data = { room_uuid: this.room_uuid, id: this.ingEventElement.getAttribute('data-uuid') };
            this.deleteMessage('deleteMessageInPublicRoom', data);
            this.clearMsgMore();
        },
        profileDetail() {
            setTimeout(() => {
                this.$router.push({ path: `/profile/${this.profileInfo.email}` });
            }, 100);
        },
    },
    beforeUnmount() {
        this.$store.dispatch('clearPublicRoom');
        socketEmit('leave public room', { room_uuid: this.room_uuid });
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
    