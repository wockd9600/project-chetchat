<template>
    <div v-if="!bottomMatchHidden" class="chat-input bottom-navigation" ref="botnav">
        <div
            ref="replyInfo"
            class="reply-info d-flex pt-2 pb-1 px-3 justify-content-between"
            :class="{ 'reply-info-up': reply_uuid }"
        >
            <div class="d-flex align-items-center">
                <div class="pe-2 me-1">
                    <profile-image :size="'30px'" />
                </div>
                <div>
                    <div class="fw-bold fs-12 text-start">로지동 갈매기</div>
                    <div class="fs-12 grey3 text-start">뭐하다 이제 봐요</div>
                </div>
            </div>
            <div @click="clearReplyUuid">
                <base-icon :icon="'close'" class="blur-color" />
            </div>
        </div>
        <div class="d-flex h-100 px-3 justify-content-between z100">
            <div class="d-flex align-items-end pe-2">
                <div class="d-flex align-items-center" style="height: 50px" @click="requestToBeFriends">
                    <base-icon :icon="'hand-shake'" :fontSize="'30px'" :color="'#000'" />
                </div>
            </div>
            <div class="search-bar px-3 flex1" id="search_bar">
                <div class="search-bar__form">
                    <div class="search-bar__box blur-box-color">
                        <textarea
                            id="sendInput"
                            type="search"
                            ref="sendInput"
                            class="search-bar__input"
                            rows="1"
                            wrap="hard"
                            placeholder=""
                            v-model="currentMessage"
                            @input="textareaResize"
                            @keydown.enter="sendMessageOfBlindRoom"
                        />
                        <base-icon
                            :icon="'send'"
                            :fontSize="'30px'"
                            :color="'#3366ff'"
                            class="icon-clear"
                            @click="sendMessageOfBlindRoom"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="px-3" style="margin-bottom: 10px; z-index: 15">
        <button v-if="blindStatus === 1" type="button" class="btn-base fill w-100" @click="stopMatching">멈추기</button>
        <button
            v-if="blindStatus === 0 || blindStatus > 2"
            type="button"
            class="btn-base fill bg-main-color w-100"
            @click="startMatching"
        >
            시작하기
        </button>
    </div>
</template>
  
<script>
import BaseIcon from '@/components/BaseIcon';
import ProfileImage from '@/components/ProfileImage';

import { mapGetters } from 'vuex';

import InputHandler from '@/mixin/InputHandler';

export default {
    name: 'MatchBottomBar',
    components: {
        BaseIcon,
        ProfileImage,
    },
    computed: {
        ...mapGetters(['bottomMatchHidden', 'blindStatus', 'blindMessageList']),
    },
    mixins: [InputHandler],
    methods: {
        async sendMessageOfBlindRoom() {
            this.sendMessage('sendMessageOfBlindRoom', {
                message: this.currentMessage,
                reply_info: this.replyInfo,
            });

            // this.$nextTick(() => {
            //     const dom = document.getElementsByClassName('chat-box')[0];
            //     dom.scrollTop = dom.scrollHeight;
            // });
        },

        startMatching() {
            this.$store.dispatch('startMatching');
        },
        stopMatching() {
            this.$store.dispatch('stopMatching');
        },
        requestToBeFriends() {
            const result = confirm('상대방에게 친구 신청을 하겠습니까?');
            if (!result) return;

            this.$store.dispatch('requestToBeFriends');
        },
    },
};
</script>
  
<style scoped>
.bottom-navigation {
    border: none !important;
    min-height: 50px !important;
}
textarea {
    touch-action: pan-y !important;
}
.reply-info-up {
    top: -48px !important;
}
.chat-input .reply-info {
    position: absolute;
    width: 100%;
    height: fit-content !important;
    top: 0;
    /* margin-bottom: -48px; */
    /* bottom: 0; */
    transition: top 0.3s;
    background-color: #fff;
}

.z100 {
    position: relative;
    z-index: 100;
    background-color: #fff;
}
.chat-input {
    position: fixed;
}

.chat-input .search-bar {
    padding: 5px 0 !important;
}

.chat-input .search-bar__box .icon-clear {
    margin: 0;
    margin-left: 10px;
    padding: 0;
    padding-right: 10px;
    padding-bottom: 10px;
    color: #6690ff;
    /* background-color: #fff; */

    top: calc(100% - 30px - 5px);
    transform: none;
}

.search-bar__input::-webkit-scrollbar {
    display: none;
}
.search-bar__box .search-bar__input {
    max-height: 84px !important;
    box-sizing: border-box;
    /* overflow: hidden;s */
}

.chat-input .search-bar__box {
    display: flex;
    align-items: center;
    padding-left: 16px;
    padding-right: 42px;
    min-height: 40px;
    border-radius: 25px !important;
}

.chat-input .search-bar__form:after {
    border: 0;
}
</style>
  