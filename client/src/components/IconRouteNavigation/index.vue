<template>
    <!-- <router-link :to="path"> -->
    <div class="w-100 h-100" @click="routerLink" :style="{ opacity: opacity }">
        <div class="h-100 d-flex justify-content-center align-items-center">
            <base-icon :icon="icon" :fontSize="fontSize" :color="color" />
        </div>
    </div>
    <!-- </router-link> -->
</template>
  
<script>
import BaseIcon from '@/components/BaseIcon';
import { mapGetters } from 'vuex';

export default {
    name: 'IconRouteNavigation',
    components: {
        BaseIcon,
    },
    props: {
        // username: String
        option: {
            type: Object,
            default: () => {
                return {
                    icon: 'error',
                    path: '/',
                    fontSize: '20px',
                    color: '#fff',
                    opacity: '50%',
                    query: {},
                };
            },
        },
    },
    computed: {
        ...mapGetters(['myInfo']),
        icon() {
            return this.option.icon;
        },
        path() {
            if (!this.option.path) return '';

            switch (this.option.path) {
                case '/chat/room':
                    return this.option.path + '/' + sessionStorage.getItem('current-chat-room');
                default:
                    return this.option.path;
            }
        },
        query() {
            if (!this.option.query) return '';
            return this.option.query;
        },
        fontSize() {
            return this.option.fontSize;
        },
        color() {
            return this.option.color || '#000';
        },
        opacity() {
            return this.option.opacity || '80%';
        },
        // query() {
        //     return this.option.query;
        // }
    },
    data() {
        return {
            nextPath: '',
        };
    },
    methods: {
        isOpendKeyboardBox() {
            if (document.documentElement.clientHeight !== window.visualViewport.height) return true;
            return false;
        },
        routerLink() {
            if (this.path === '') {
                this.$router.go(-1);
                return;
            }

            if (this.isOpendKeyboardBox()) {
                // window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => {
                    this.$router.push({ path: this.path, query: this.query });
                }, 200);
            } else {
                this.$router.push({ path: this.path, query: this.query });
                // this.$router.push({ path: this.path });
            }
        },
    },
};
</script>
  
  <style scoped>
/* 아이콘 스타일링 */
.icon-home::before {
    content: '\e001'; /* 홈 아이콘 코드 */
}
.icon-chat::before {
    content: '\e002'; /* 채팅 아이콘 코드 */
}
.icon-feed::before {
    content: '\e003'; /* 피드 아이콘 코드 */
}
</style>
  