<template>
    <font-awesome-icon
        class="d-block cp"
        :icon="icons[icon]"
        :flip="flip[icon]"
        :style="{ width: fontSize, height: fontSize, color: color }"
    />
    <!-- <font-awesome-icon :icon="['far','heart']" size="lg" :style="{ color: 'red' }" /> -->

    <!-- <div class="d-block cp" :style="{ width: fontSize, height: fontSize, color: color }">
        <img :src=svgSrc class="w-100 h-100" />
    </div> -->
    <!-- 부모 컴포넌트에서 전달된 모든 이벤트 리스너를 현재 요소에 추가합니다. 이는 상위 컴포넌트에서 정의한 이벤트 리스너를 그대로 전달하기 위해 사용됩니다. -->
    <!-- <svg aria-hidden="true">
        <use :xlink:href="iconHref" />
    </svg> -->
</template>

<script>
import icons from './icons';

export default {
    name: 'BaseIcon',
    props: {
        icon: {
            type: String,
            default: 'error',
        },
        fontSize: {
            type: String,
            default: '22px',
        },
        color: {
            type: String,
            default: '#000',
        },
    },
    computed: {
        // svgSrc() {
        //     try {
        //         const iconFile = require(`@/icons/svg/${this.icon}.svg`);
        //         return iconFile;
        //     } catch (error) {
        //         const iconFile = require(`@/icons/svg/send.svg`);
        //         return iconFile;
        //     }
        // },
        // svgClass() {
        //     if (this.className) {
        //         return 'svg-icon ' + this.className;
        //     } else {
        //         return 'svg-icon';
        //     }
        // },
    },
    data() {
        return {
            icons: icons,
            flip: {
                reply: 'vertical',
            },
        };
    },
};
</script>

<style scoped>
</style>
