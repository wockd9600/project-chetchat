<template>
    <div class="app-wrapper">
        <!-- <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
        <div class="main-container">
            <div>
                <top-navigation-bar />
            </div>

            <app-main />

            <div>
                <bottom-navigation-bar />
            </div>
        </div>
    </div>
</template>
  
<script>
import { AppMain, TopNavigationBar, BottomNavigationBar } from './components';

export default {
    name: 'BaseLayout',
    components: {
        AppMain,
        TopNavigationBar,
        BottomNavigationBar,
    },
    props: {
        type: {
            type: String,
            default: 'main',
        },
    },
    computed: {
        // ...mapState({
        //     sidebar: state => state.app.sidebar,
        //     device: state => state.app.device,
        //     fixedHeader: state => state.settings.fixedHeader
        // }),
    },
    methods: {
        // handleClickOutside() {
        //     this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
        // }
    },
};
</script>
  
<style scoped>
/* @import "~@/styles/mixin.scss";
    @import "~@/styles/variables.scss";
   */
.app-wrapper {
    /* @include clearfix; */
    position: relative;
    width: 100%;
    overflow: hidden;
    /* background: #000; */
}
.main-container {
    position: relative;
    width: 100%;
    overflow: hidden;
    /* background: #000; */
}

.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    /* width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s; */
}

.hideSidebar .fixed-header {
    width: calc(100% - 54px);
}

.mobile .fixed-header {
    width: 100%;
}
</style>
  