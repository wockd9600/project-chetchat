<template>
    <div v-if="icon !== 'error'">
        <div class="dropdown">
            <a href="javascript:void(0)" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="opacity: 80%;">
                <base-icon :icon="icon" :fontSize="fontSize" />
            </a>
            <ul class="dropdown-menu">
                <li @click="blockUser"><a class="dropdown-item" href="javascript:void(0)">차단하기</a></li>
            </ul>
        </div>
    </div>
</template>

<script>
import BaseIcon from '@/components/BaseIcon';
// import { socketEmit } from '@/utils/socket.js';

export default {
    name: 'HeaderDropDown',
    components: {
        BaseIcon,
    },
    props: {
        option: {
            type: Object,
            default: () => {
                return {
                    icon: 'error',
                    content: '',
                    fontSize: '25px',
                    // query: {},
                };
            },
        },
    },
    computed: {
        icon() {
            return this.option.icon;
        },
        fontSize() {
            return this.option.fontSize;
        },
    },
    methods: {
        async blockUser() {
            const result = confirm('상대방의 메시지를 받을 수 없게 됩니다.');
            if (!result) return;

            const email = this.$route.path.split('/').slice(-1)[0];
            this.$store.dispatch('addBlockUser', { email });
        },
    },
};
</script>

<style scoped="css">
.dropdown-menu {
    min-width: 0 !important;
}
</style>