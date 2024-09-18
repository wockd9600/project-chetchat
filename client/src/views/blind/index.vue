<template>
    <div class="app-wrapper">
        <top-navigation-bar />

        <section class="app-main">
            <div v-if="componentsBlindStatus < 2" style="height: calc(100vh - 50px)">
                <div class="loadding">
                    <div
                        class="d-flex justify-content-center"
                        :class="{ 'rotating-element': componentsBlindStatus === 1 }"
                    >
                        <base-icon :icon="'re'" :fontSize="'80px'" :color="'#000'" />
                    </div>
                    <div class="d-flex pt-3 justify-content-center fw-bold fs-18">
                        <div>
                            {{ matchingText }}
                            <span class="position-absolute" style="left: 100%">{{ timeDot }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="chat-box" :class="{ invisible: componentsBlindStatus < 2 }" ref="chatBox">
                <div class="px-3">
                    <div class="position-relative">
                        <span class="msg-more cp" id="msg-more">
                            <ul>
                                <li @click.passive="copyMessageFromBlindRoom">복사</li>
                                <li v-if="msgMoreSetting.posibleBlockUser" @click.passive="blockUserFromBlindRoom">
                                    차단
                                </li>
                                <li v-if="msgMoreSetting.posibleReportUser" @click.passive="reportUserFromBlindRoom">
                                    신고
                                </li>
                            </ul>
                        </span>
                    </div>

                    <div class="mt-2" style="color: #767676">
                        나이, 성별등 개인정보를 묻는 것은 제재 대상이 될 수 있습니다.
                    </div>
                    <div class="mt-2 mb-3" style="color: #767676">
                        추천 대화 주제는 <span class="fw-bold">'{{ suggestTopicList[topicIndex] }}'</span> 입니다.
                    </div>

                    <div v-for="(item, index) in blindMessageList" :key="index">
                        <div v-if="item.isAlert" class="mt-2 mb-2" style="color: #767676">
                            {{ item.content }}
                        </div>
                        <div v-else>
                            <chat-item v-if="item.sender_uuid === myInfo.user_uuid" :item="item" />
                            <other-chat-item v-else :item="item" />
                        </div>
                    </div>

                    <div class="reply-info" :class="{ 'reply-info-up': reply_uuid }"></div>
                    <div v-if="leaveMessage" class="mt-2" style="color: #767676">{{ leaveMessage }}</div>
                </div>
            </div>
        </section>

        <bottom-navigation-bar />
    </div>
</template>
  
<script>
import BaseIcon from '@/components/BaseIcon';
import ChatItem from '@/components/ChatItem';
import OtherChatItem from '@/components/ChatItem/other';

import ChatHandler from '@/mixin/ChatHandler';
import { mapGetters } from 'vuex';

export default {
    name: 'BlindChat',
    components: {
        BaseIcon,
        ChatItem,
        OtherChatItem,
    },
    computed: {
        ...mapGetters(['blindStatus', 'blindMessageList', 'topicIndex', 'msgMoreSetting']),
        timeDot() {
            return '.'.repeat(this.timeDotLength);
        },
        // 0 대기, 1 매칭 중, 2 대화 중, 3 대화 끝
        componentsBlindStatus() {
            if (this.blindStatus === 0) {
                this.stopMatching();
            } else if (this.blindStatus === 1) {
                this.startMatching();
            } else if (this.blindStatus === 2) {
                this.completeMatching();
            } else if (this.blindStatus === 3) {
                this.leaveBlindChat('나갔습니다.');
            } else if (this.blindStatus === 4) {
                this.leaveBlindChat('상대방이 나갔습니다.');
            }
            return this.blindStatus;
        },
    },
    mixins: [ChatHandler],

    data() {
        return {
            timeDotInterval: null,
            timeDotLength: 1,
            matchingText: '매칭 전입니다',
            leaveMessage: '',
            suggestTopicList: [
                '기술 발전은 인류의 행복인가?',
                '강아지 vs 고양이',
                '제일 좋아하는 음식은 무엇인가요',
                '제일 좋아하는 노래는 무엇인가요',
                '취미를 나눠보세요',
                '제일 좋아하는 단어를 알려주세요',
            ],
        };
    },
    created() {
        sessionStorage.setItem('current-chat-room', 'blind');
        this.$store.dispatch('initializeBlindRoom');
    },
    methods: {
        copyMessageFromBlindRoom() {
            const id = parseInt(this.ingEventElement.getAttribute('data-uuid'));
            const index = this.blindMessageList.findIndex((item) => item.id === id);
            if (index === -1) return;
            if (this.blindMessageList[index].img) return;
            
            this.copyMessage(this.blindMessageList[index].content);
        },
        blockUserFromBlindRoom() {
            const sender_uuid = this.ingEventElement.getAttribute('data-sender-uuid');
            this.blockUser({ uuid: sender_uuid });
        },
        reportUserFromBlindRoom() {
            const isReport = confirm('신고하시겠습니까?');
            if (!isReport) return this.clearMsgMore();

            this.reportUser({ room: 1, message_id: this.ingEventElement.getAttribute('data-uuid') });
            this.clearMsgMore();
        },
        startTimeDotInterval() {
            this.timeDotInterval = setInterval(() => {
                this.timeDotLength = (this.timeDotLength + 1) % 4;
            }, 800);
        },
        setAlertMessage(matchingText = '', leaveMessage = '') {
            this.matchingText = matchingText;
            this.leaveMessage = leaveMessage;
        },
        setBlindHeader(icon = null, content = '') {
            const room_type = this.$route.path.split('/')[1];
            if (room_type !== 'blind') return;

            if (!icon) this.$store.commit('setBlindChatHeader', { type: null });
            else this.$store.commit('setBlindChatHeader', { type: 'ActionIcon', icon, content, fontSize: '20px' });
        },

        startMatching() {
            this.startTimeDotInterval();
            this.timeDotLength = 3;
            this.setAlertMessage('매칭 중입니다');
        },
        stopMatching() {
            clearInterval(this.timeDotInterval);
            this.timeDotLength = 0;
            this.setAlertMessage('취소되었습니다.');

            this.$store.dispatch('toggleBottomMatchHidden', true);
        },
        leaveBlindChat(message) {
            this.setAlertMessage('', message);

            // socket
            this.$nextTick(() => {
                const dom = document.getElementsByClassName('chat-box')[0];
                dom.scrollTop = dom.scrollHeight;
            });
        },
        completeMatching() {
            clearInterval(this.timeDotInterval);
            this.setBlindHeader('leave', 'leave-blid-chat');
            this.setAlertMessage('', '');

            this.$store.dispatch('toggleBlindStatus', 2);
            this.$store.dispatch('toggleBottomMatchHidden', false);
        },
    },
    beforeUnmount() {
        this.$store.dispatch('leaveBlindChat');
    },
};
</script>
  
<style scoped>
.loadding {
    position: absolute;
    top: 15%;
    left: 50%;
    transform: translateX(-50%);
}

.rotating-element {
    animation-name: rotate;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
}

/* 애니메이션 키프레임 설정 */
@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
    