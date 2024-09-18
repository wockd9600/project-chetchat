<template>
    <div
        ref="replyInfo"
        class="reply-info d-flex pt-2 pb-1 px-3 justify-content-between"
        :class="{ 'reply-info-up': replyId }"
        style="border-top: 0.1px solid #c8cdd6"
    >
        <div v-if="replyId" class="w-100 d-flex align-items-center">
            <!-- <div class="pe-2 me-1">
                <profile-image :size="'30px'" />
            </div> -->
            <div style="width: calc(100% - 22px)">
                <div class="fw-bold fs-12 text-start">답장하기</div>
                <div class="fs-12 grey3 text-start text-truncate">{{ messageParsing(replyContent) }}</div>
            </div>
            <div @click="clearReplyUuid">
                <base-icon :icon="'close'" class="blur-color" :color="'#000'" />
            </div>
        </div>
    </div>
</template>

<script>
import BaseIcon from '@/components/BaseIcon';
import { mapGetters } from 'vuex';

export default {
    name: 'InputReplyBar',
    components: {
        BaseIcon,
    },
    props: {
        reply_id: {
            type: String,
            default: '',
        },
        content: {
            type: String,
            default: '',
        },
    },
    computed: {
        ...mapGetters(['reply_uuid']),
        replyId() {
            return this.reply_id || false;
        },
        replyContent() {
            return this.content;
        },
    },
    watch: {
        reply_uuid(newValue) {
            if (!newValue) {
                this.clearReplyUuidEffect();
            }
        },
    },
    methods: {
        clearReplyUuidEffect() {
            this.$refs.replyInfo.style.transition = '0s';

            setTimeout(() => {
                this.$refs.replyInfo.style.transition = '0.3s';
            }, 100);
        },
        clearReplyUuid() {
            this.$nextTick(() => {
                if (this.device !== 'mobile' || this.isOpendKeyboardBox()) document.getElementById('sendInput').focus();
            });
            this.$store.commit('setReplyUuid', null);
        },
        messageParsing(message) {
            return message.replace(/< *\/?br *\/?>.*/i, '...').replace(/&nbsp;/g, ' ');
        },
    },
};
</script>

<style scoped>
.reply-info-up {
    top: -48px !important;
}
.reply-info {
    position: absolute;
    width: 100%;
    height: fit-content !important;
    top: 0;
    /* margin-bottom: -48px; */
    /* bottom: 0; */
    transition: top 0.3s;
    background-color: #fff;
    z-index: 3;
}
</style>