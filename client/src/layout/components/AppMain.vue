<template>
    <section class="app-main">
        <!-- <transition name="slide" mode="out-in"> -->
            <router-view :key="key" />
        <!-- </transition> -->
        <!-- <keep-alive> -->
        <!-- </keep-alive> -->
    </section>
</template>

<script>

export default {
    name: 'AppMain',
    computed: {
        // cachedViews() {
        //   return this.$store.state.tagsView.cachedViews
        // },
        key() {
            return this.$route.path;
        },
    },
};
</script>

<style scoped>
/* 페이지 슬라이드 트랜지션 효과 정의 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;
}

.slide-enter,
.slide-leave-to {
  transform: translateY(0);
}

.slide-leave-active,
.slide-leave-to {
  transform: translateY(-100%);
}


.fixed-header + .app-main {
    padding-top: 50px;
}


.fixed-header + .app-main {
    padding-top: 84px;
}
</style>

<style>
/* fix css style bug in open el-dialog */
/* .el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
} */
</style>
