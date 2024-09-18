<template>
    <nav class="position-relative">
        <div class="top-navigation" ref="topNavigation" :style="{ backgroundColor: bgColor }">
            <div class="d-flex px-3 align-items-center justify-content-between" style="height: 50px">
                <div
                    v-for="(item, index) in header"
                    :key="index"
                    :class="[getAlignmentStyle(getAlignment[index]), { flex1: item.index == 1 }]"
                    style="min-width: 20px"
                >
                    <component v-if="item.type" :is="item.type" :option="item" />
                    <component v-else :is="header[0].type" :option="header[0]" class="invisible" />
                </div>
            </div>
        </div>
    </nav>
</template>
  
<script>
import { mapGetters } from 'vuex';

import HeaderTitle from '@/components/HeaderTitle';
import IconRouteNavigation from '@/components/IconRouteNavigation';
import ActionElement from '@/components/ActionElement';
import ActionIcon from '@/components/ActionIcon';
import MultiHeader from '@/components/MultiHeader';

export default {
    name: 'TopNavigationBar',
    components: {
        HeaderTitle,
        IconRouteNavigation,
        ActionElement,
        ActionIcon,
        MultiHeader,
    },
    props: {
        bgColor: {
            type: String,
            default: '#fff',
        },
    },
    data() {
        return {
            checkWidth: window.innerWidth,
            getAlignment: ['start', 'center', 'end'],
        };
    },
    computed: {
        ...mapGetters(['header']),
    },
    mounted() {
        // visualViewport.addEventListener('resize', this.changeHeaderTop);
        // this.changeHeaderTop()
    },
    methods: {
        // changeHeaderTop() {
        //     if (this.checkWidth !== window.innerWidth) return;

        //     const header = this.$refs.topNavigation;
        //     if (!header) return;

        //     if (!['chat/room', 'public'].includes(this.$route.path.split('/')[1])) {
        //         header.style.transition = '0s';
        //         header.style.top = 0 + 'px';
        //         return;
        //     }

        //     // console.log(header)
        //     header.style.display = 'none';

        //     let documentHeight = document.documentElement.clientHeight;
        //     let viewportHeight = window.visualViewport.height;
        //     let keyboardHeight = documentHeight - viewportHeight + 1;

        //     // this.d = keyboardHeight + ',' + documentHeight + ',' + viewportHeight + ',' + document.body.offsetHeight;

        //     if (keyboardHeight < 10) {
        //         header.style.transition = '0s';
        //         header.style.top = 0 + 'px';
        //         setTimeout(() => {
        //             header.style.display = 'block';
        //         }, 50);
        //     } else {
        //         header.style.display = 'block';
        //         setTimeout(() => {
        //             header.style.top = keyboardHeight + 'px';
        //             header.style.transition = '0.5s';
        //         }, 100);
        //     }
        // },
        getAlignmentStyle(align) {
            return `d-flex justify-content-${align}`;
        },
    },
    beforeUnmount() {
        // visualViewport.removeEventListener('resize', this.changeHeaderTop);
        // setTimeout(() => {
        //     this.changeHeaderTop();
        // }, 10)
    },
};
</script>
  
<style scoped>
.top-navigation {
    position: fixed;
    /* transition: top 0.4s ease; */
    top: 0;
    width: 100%;
    /* touch-action: none !important; */
    z-index: 10;
    /* overflow: hidden; */
    overscroll-behavior-y: contain;
}
</style>
  