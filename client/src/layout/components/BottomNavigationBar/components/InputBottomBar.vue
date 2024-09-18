<template>
    <div class="chat-input" ref="botnav">
        <input-reply-bar :reply_id="reply_uuid || ''" :content="replyContent" />
        <!-- <div class="qdd position-absolute" style="z-index: 1000; bottom: 55%">{{ dd }}</div> -->
        <div class="d-flex h-100 px-3 justify-content-between z100">
            <div class="d-flex align-items-end pe-2">
                <div class="d-flex align-items-center" style="height: 50px">
                    <label>
                        <base-icon :icon="'image'" :fontSize="'30px'" :color="'#000'" />
                        <input
                            type="file"
                            ref="imgUploadInput"
                            accept="image/*, video/*"
                            style="display: none"
                            @change="uploadImageFromChatRoom($event)"
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
                            rows="1"
                            wrap="hard"
                            placeholder=""
                            v-model="currentMessage"
                            @keydown.enter="sendMessageOfChatRoom"
                        />
                        <base-icon
                            :icon="'send'"
                            :fontSize="'30px'"
                            class="icon-clear"
                            color="#3366ff"
                            @click="sendMessageOfChatRoom"
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
        ...mapGetters(['messageList']),
    },
    mixins: [InputHandler],
    watch: {
        reply_uuid: function () {
            const arr = this.messageList || [-1];
            const index = arr.findIndex((item) => item.id == this.reply_uuid);
            if (index === -1) return;

            // this.replyName = this.messageList[index].user_name;
            this.replyContent = this.messageList[index].content;

            if (this.replyContent === '') {
                this.replyContent = this.messageList[index].message_type === 1 ? '사진' : '동영상';
            }
        },
    },
    methods: {
        async uploadImageFromChatRoom(e) {
            this.uploadImage(e.target.files, 'sendMessageTypeImage');
            e.target.value = '';
        },

        async sendMessageOfChatRoom() {
            // store
            // 일단 메시지 store에 저장
            // message 정보를 서버로 보냄
            // 시간이 지나도 서버에서 응답이 없으면 에러처리
            this.sendMessage('sendMessage', {
                message: this.currentMessage,
                reply_info: this.replyInfo,
                room_uuid: this.$route.path.split('/').slice(-1)[0],
            });

            // this.$nextTick(() => {
            //     const dom = document.getElementsByClassName('chat-box')[0];
            //     dom.scrollTop = dom.scrollHeight;
            //     // this.$refs.replyInfo.style.transition = '0.3s';
            // });
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
.chat-input {
    position: relative;
    border-top: 0.1px solid #c8cdd6;
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
  