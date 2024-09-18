<template>
    <div
        class="position-relative d-flex justify-content-center align-items-center"
        v-bind:style="{
            width: size,
            height: size,
            borderRadius: borderRadius,
            borderColor: borderColor,
            backgroundColor: backGroundColor,
            // border: `2px solid ${borderColor}`,
        }"
        style="box-sizing: border-box"
    >
        <!-- {{ imageLoadSuccess }} -->
        <base-icon
            v-if="profile_img === 'letter'"
            :class="{ 'pt-1': icon === 'user' }"
            :icon="'letter'"
            :fontSize="fontSize"
            :color="iconColor"
        />
        <div v-else class="w-100 h-100">
            <img
                v-if="imageSrc !== ''"
                :src="imageSrc"
                v-bind:style="{
                    borderRadius: borderRadius,
                }"
                class="profile-image"
                alt="프로필 사진"
                @click="zoomImage"
                @error="handleImageError"
            />
            <div v-else class="none-profile-image position-relative w-100 h-100 d-flex align-items-center">
                <div class="head rounded-5"></div>
                <div class="body position-absolute rounded-5"></div>
            </div>
        </div>

        <image-zoom v-if="enlargement" />
    </div>
</template>

<script>
import BaseIcon from '@/components/BaseIcon';
import ImageZoom from '@/components/ImageZoom';

// import mediumZoom from 'medium-zoom';

export default {
    name: 'ProfileImage',
    components: {
        BaseIcon,
        ImageZoom,
    },
    props: {
        profile_img: {
            type: String,
            default: '',
        },
        size: {
            type: String,
            default: '50px',
        },
        borderRadius: {
            type: String,
            default: '50%',
        },
        borderColor: {
            type: String,
            default: '#fff',
        },
        backGroundColor: {
            type: String,
            default: '#dbdbdb',
        },
        icon: {
            type: String,
            default: null,
        },
        iconColor: {
            type: String,
            default: '#fff',
        },
        fontSize: {
            type: String,
            default: '30px',
        },
        enlargement: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        imageSrc() {
            const urlString = this.profile_img;
            const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
            if (
                typeof urlString === 'string' &&
                urlRegex.test(urlString.trim()) &&
                urlString.trim().startsWith(this.prefix)
            ) {
                return this.profile_img;
            } else {
                return '';
            }
        },
        handleImageError() {
            // this.failImageLoad();
            return '';
        },
    },
    data() {
        return {
            // imageLoadSuccess: true,
            // defaultImageSrc: 'URL_OF_GRAY_IMAGE',
            prefix: process.env.VUE_APP_CLOUDFRONT_DOMAIN + '/',
            zoom: null,
        };
    },
    mounted() {
        // if (this.enlargement) {
            // this.zoom = mediumZoom('.profile-image', {
            //     background: '#000000',
            //     scrollOffset: 0,
            // });
            // this.zoom.on('open', (event) => this.zoomOpen(event));
            // this.zoom.on('close', (event) => this.zoomClose(event));
        // }
    },
    methods: {
        zoomImage() {
            if (!this.enlargement || this.imageSrc === '') return;
            this.$store.commit('SET_ZOOM_IMAGE_SRC', this.imageSrc);
        },
        // zoomOpen(event) {
        //     event.target.style.borderRadius = '0';
        // },
        // zoomClose(event) {
        //     event.target.style.borderRadius = this.borderRadius;
        //     const dom = document.querySelector('.medium-zoom-image--opened');
        //     if (dom) dom.style.borderRadius = this.borderRadius;
        // },
        // successImageLoad() {
        //     this.imageLoadSuccess = true;
        // },
        // failImageLoad() {
        //     this.imageLoadSuccess = false;
        // },
    },
    beforeUnmount() {
        // if (this.zoom) {
        //     this.zoom.close();
        //     this.zoom.off('open', (event) => this.zoomOpen(event));
        //     this.zoom.off('close', () => this.zoomClose);
        //     this.zoom.detach();
        // }
    },
};
</script>

<style scoped>
.profile-image {
    object-fit: cover;
    width: 100%;
    height: 100%;
}

.none-profile-image {
    flex-direction: column;
    overflow: hidden;
    clip-path: circle(50% at 50% 50%);
}

.none-profile-image .head {
    margin-top: 20%;
    width: 35%;
    height: 35%;
    background-color: rgb(170, 170, 170);
}

.none-profile-image .body {
    margin-top: 59%;
    width: 80%;
    height: 80%;
    background-color: rgb(170, 170, 170);
}
</style>