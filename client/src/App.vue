<template>
    <!-- oncopy="return false"
    oncut="return false"
    ondragstart="return false"
    onselectstart="return false"
    onpaste="return false" -->
    <div class="app nodrag h-100" oncontextmenu="return false">
        <div class="outter">
            <router-view v-slot="{ Component }">
                <component :is="Component" />
            </router-view>
        </div>

        <!-- <keep-alive>

        <router-view v-slot="{ Component }" name="secondPage" class="sub-page">
            <component :is="Component" />

            <transition
                v-if="secondPage && Object.keys(secondPage).length !== 0"
                name="custom-classes-transition"
                :enter-active-class="enterAnimate"
                :leave-active-class="leaveAnimate"
            >
            </transition>
        </router-view>
    </keep-alive> -->

        <div class="toast-container position-fixed">
            <div
                ref="toast"
                class="toast"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                data-bs-autohide="true"
                data-bs-delay="2000"
            >
                <div v-if="toastMessage" class="toast-body">
                    <div class="toast-message">{{ toastMessage }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import BaseLayout from '@/layout';

import { mapGetters } from 'vuex';
import { Toast } from 'bootstrap';
import { checkMobile } from '@/utils/validate';

export default {
    name: 'App',
    components: {
        // BaseLayout,
    },
    computed: {
        ...mapGetters(['effect', 'friends', 'toastMessage']),
    },
    data() {
        return {
            enterAnimate: '',
            leaveAnimate: '',
            transitionMode: 'in-out',
            lastTouchEnd: 0,
        };
    },
    async mounted() {
        const toast = new Toast(this.$refs.toast);
        this.$store.commit('setToast', toast);

        window.addEventListener('resize', this.resizeHeight);
        window.addEventListener('orientationchange', this.resizeHeight);

        this.resizeHeight();

        // no size up
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            window.document.addEventListener(
                'touchmove',
                (e) => {
                    if (e.scale !== 1) e.preventDefault();
                },
                { passive: false },
            );
        }

        document.documentElement.addEventListener(
            'touchstart',
            function (event) {
                if (event.touches.length > 1) {
                    event.preventDefault();
                }
            },
            false,
        );

        document.documentElement.addEventListener(
            'touchend',
            function (event) {
                const now = new Date().getTime();
                if (now - this.lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                this.lastTouchEnd = now;
            },
            false,
        );
    },
    methods: {
        resizeHeight() {
            // const vh = window.innerHeight * 0.01;
            // const vh = window.visualViewport.height * 0.01;
            const vh = document.documentElement.clientHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            checkMobile();
        },
        // getEnterTransitionAnimate(from, to) {
        //     const [fromName, toName] = [from.name, to.name];
        //     if (toName === 'FriendView' && fromName === 'UserProfile') {
        //         return 'animated fadeInUp';
        //     } else if (toName === 'ChatView' && fromName === 'ChatRoom') {
        //         return 'animated fadeInRight';
        //     } else if (toName === 'UserProfile' && fromName === 'FriendView') {
        //         return 'animated stay';
        //     }
        // },
        // getLeaveTransitionAnimate(from, to) {
        //     const [fromName, toName] = [from.name, to.name];
        //     if (toName === 'UserProfile' && fromName === 'FriendView') {
        //         return 'animated fadeOutDown';
        //     } else if (toName === 'ChatRoom' && fromName === 'ChatView') {
        //         return 'animated fadeOutRight';
        //     } else if (toName === 'FriendView' && fromName === 'UserProfile') {
        //         return 'animated stay';
        //     }
        // },
    },

    // watch: {
    //     $route(from, to) {
    //         this.enterAnimate = this.getEnterTransitionAnimate(from, to);
    //         this.leaveAnimate = this.getLeaveTransitionAnimate(from, to);
    //         console.log(this.enterAnimate);
    //         console.log(this.leaveAnimate);

    //         const toDepth = to.path.split('/').length;
    //         const fromDepth = from.path.split('/').length;
    //         to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left';

    //         if (to.path === '/') this.enterAnimate = '';
    //     },
    // },
    beforeUnmount() {
        window.removeEventListener('resize', this.resizeHeight);
        window.removeEventListener('orientationchange', this.resizeHeight);

        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            window.document.removeEventListener(
                'touchmove',
                (e) => {
                    if (e.scale !== 1) e.preventDefault();
                },
                { passive: false },
            );
        }

        document.documentElement.removeEventListener(
            'touchstart',
            function (event) {
                if (event.touches.length > 1) {
                    event.preventDefault();
                }
            },
            false,
        );

        document.documentElement.removeEventListener(
            'touchend',
            function (event) {
                const now = new Date().getTime();
                if (now - this.lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                this.lastTouchEnd = now;
            },
            false,
        );
    },
};
</script>

<style>
/* iOS only */
/* @supports (-webkit-touch-callout: none) {
    height: -webkit-fill-available;
} */

html {
    -webkit-text-size-adjust: none;
    text-size-adjust: none;
}

html,
body {
    width: 100%;
    height: 100%;
    /* padding: 0; */
    /* overflow: hidden; */
    /* background: #000; */
}

body * {
    touch-action: pan-y;
}

#app {
    position: relative;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    /* color: #2c3e50; */
    color: #000;
    overflow: hidden;
    width: 100%;
    height: 100%;
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
    font-size: 15px;
    scrollbar-width: none;
    -ms-overflow-style: none;
}
#app::-webkit-scrollbar {
    display: none;
}

a {
    color: black !important;
}

.outter {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    transition: 1s;

    overflow: hidden;
    background: #fff;
}
.outter.hideLeft {
    transform: translate3d(-40%, 0, 0);
    transition: 1s;
    overflow: hidden;
}

@import 'assets/css/base.css';
@import 'assets/css/chat.css';
@import '@/assets/css/search.css';
@import '@/assets/css/setting.css';

@import 'assets/css/change-bootstrap.css';

/* @import '@/assets/css/animate.css'; */
</style>
