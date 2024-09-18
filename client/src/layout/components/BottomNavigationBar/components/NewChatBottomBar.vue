<template>
    <div class="chat-input bottom-navigation w-100" ref="botnav">
        <div class="d-flex h-100 px-3 justify-content-between z100">
            <div class="d-flex align-items-end pe-2">
                <div class="d-flex align-items-center" style="height: 50px">
                    <label>
                        <base-icon :icon="'image'" :fontSize="'30px'" color="#000" />
                        <input type="text" style="display: none" @click="uploadImageFromNewChat($event.target.files)" />
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
                            @input="textareaResize"
                            @keydown.enter="sendMessageOfChatRoom"
                        />
                        <base-icon
                            :icon="'send'"
                            :fontSize="'30px'"
                            :color="'#3366ff'"
                            class="icon-clear"
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

import InputHandler from '@/mixin/InputHandler';

export default {
    name: 'NewChatBottomBar',
    components: {
        BaseIcon,
    },
    mixins: [InputHandler],
    methods: {
        async uploadImageFromNewChat() {
            alert('첫 채팅을 이미지로 할 수 없습니다.');
        },

        async sendMessageOfChatRoom() {
            // server
            // selected id가 친구인지 확인
            // 새로운 chat table 생성,
            // 메시지 입력
            // 상대에게 새로운 채팅방 소켓
            // move chat-room route
            this.sendMessage('sendMessageForNewChat', { message: this.currentMessage });
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
    position: fixed;
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
  