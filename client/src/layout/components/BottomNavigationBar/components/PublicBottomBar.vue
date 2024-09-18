<template>
    <div class="chat-input" ref="botnav">
        <input-reply-bar :reply_id="reply_uuid || ''" :name="replyName" :content="replyContent" />

        <div class="d-flex h-100 px-3 justify-content-between z100">
            <div class="d-flex align-items-end pe-2">
                <div class="d-flex align-items-center" style="height: 50px">
                    <label>
                        <base-icon :icon="'image'" :fontSize="'30px'" color="'#000'" />
                        <input
                            type="file"
                            ref="imgUploadInput"
                            accept="image/*"
                            style="display: none"
                            @change="uploadImageFromPublicRoom($event)"
                        />
                    </label>
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
                            :class="{ 'message-color': !isPossible }"
                            rows="1"
                            wrap="hard"
                            v-model="currentMessage"
                            @input="textareaResize"
                            @keydown.enter="sendMessageOfPublicRoom"
                        />
                        <base-icon
                            :icon="'send'"
                            :fontSize="'30px'"
                            class="icon-clear"
                            :color="'#3366ff'"
                            @click="sendMessageOfPublicRoom"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import BaseIcon from '@/components/BaseIcon';
import InputReplyBar from './InputReplyBar';

import { mapGetters } from 'vuex';

import InputHandler from '@/mixin/InputHandler';

export default {
    name: 'InputBottomBar',
    components: {
        BaseIcon,
        InputReplyBar,
    },
    computed: {
        ...mapGetters(['publicMessageList', 'currentPublicInfo']),
    },
    data() {
        return {
            inputPlaceholder: '',
            isPossible: true,
        };
    },
    mixins: [InputHandler],
    watch: {
        currentPublicInfo: function () {
            // 0, 1, 2, 3 로그인 안함, 남, 친구, 나
            // ['모두', '로그인한 사람', '친구 추가한 사람', '허용 안함']
            if (
                this.currentPublicInfo.relation < this.currentPublicInfo.question_range ||
                this.currentPublicInfo.isBlocked
            ) {
                this.currentMessage = '집주인이 질문을 제한했습니다.';
                this.isPossible = false;
            }
        },
        reply_uuid: function () {
            const arr = this.publicMessageList || [-1];
            const index = arr.findIndex((item) => item.id == this.reply_uuid);
            if (index === -1) return;

            this.replyName = this.publicMessageList[index].user_name;
            this.replyContent = this.publicMessageList[index].content;

            if (this.replyContent === '') {
                this.replyContent = this.messageList[index].message_type === 1 ? '사진' : '동영상';
            }
        },
        currentMessage: function () {
            if (!this.isPossible) {
                this.currentMessage = '집주인이 질문을 제한했습니다.';
                return;
            }
        },
    },
    methods: {
        // async availbleReply() {
        //     const path = this.$route.path.split('/')[1];
        //     const owner = this.$route.path.split('/')[2];

        //     if (path !== 'public' || owner !== this.myInfo.uuid || this.reply_uuid) return true;

        //     // 슬라이드한 질문이 자신의 글인지도 확인해야함.
        //     this.$store.commit('setToastMessage', '슬라이드로 질문을 선택해주세요.');
        //     this.$store.commit('showToast');

        //     return false;
        // },

        async uploadImageFromPublicRoom(e) {
            // *수정
            // if not login confirm 로그인 후 이용 가능합니다. 로그인 하시겠습니까?

            this.uploadImage(e.target.files, 'sendMessageTypeImageOfPublicRoom');
            e.target.value = '';
        },
        async sendMessageOfPublicRoom() {
            if (!this.isPossible) return;
            const current_room_uuid = this.$route.path.split('/').slice(-1)[0];
            this.sendMessage('sendMessageOfPublicRoom', { message: this.currentMessage, current_room_uuid });
        },
    },
};
</script>
  
<style scoped>
textarea {
    touch-action: pan-y !important;
}

.z100 {
    position: relative;
    z-index: 100;
    background-color: #fff;
}

.chat-input .search-bar {
    padding: 5px 0 !important;
}

.chat-input {
    border-top: 0.1px solid #c8cdd6;
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
  