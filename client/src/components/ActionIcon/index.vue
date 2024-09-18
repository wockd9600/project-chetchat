<template>
    <div @click="headerIconAction" :style="{ paddingTop: marginTop, opacity: opacity }">
        <base-icon :icon="icon" :fontSize="fontSize" :color="color" />
    </div>
</template>

<script>
import BaseIcon from '@/components/BaseIcon';
import { logOut } from '@/utils/login';

export default {
    name: 'ActionIcon',
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
                    color: '#000',
                    marginTop: '0px',
                    opacity: '100%',
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
        content() {
            return this.option.content;
        },
        color() {
            return this.option.color || '#000';
        },
        marginTop() {
            return this.option.marginTop;
        },
        opacity() {
            return this.option.opacity || '100%';
        },
    },
    methods: {
        headerIconAction() {
            if (this.content === 'bookmark') {
                this.$store.dispatch('toggleFriendsOption', { key: 'bookmarked' });
            } else if (this.content === 'leave-blid-chat') {
                this.$store.dispatch('leaveBlindChat');
            } else if (this.content === 'logout') {
                const result = confirm('로그아웃 합니다.');
                if (result) logOut();
            } else if (this.content === 'bell') {
                this.$store.dispatch('toggleMySettingNotification', false);
            } else if (this.content === 'bell-slash') {
                this.$store.dispatch('toggleMySettingNotification', true);
            } else if (this.content === 'share') {
                if (navigator && navigator.clipboard) {
                    navigator.clipboard.writeText('chetchat.me/letter/' + this.$route.path.split('/').slice(-1)[0]);
                    alert('복사되었습니다.');
                }
            }
        },
    },
};
</script>

<style>
</style>