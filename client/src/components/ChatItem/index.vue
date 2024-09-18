<template>
    <div class="chat-item position-relative w-100">
        <div class="position-relative bg-white w-100" :data-uuid="item.id">
            <div class="position-relative d-flex justify-content-end bg-white">
                
                <div class="mw-80" :class="{ 'pt-2': item.showPN }" style="z-index: 1; background-color: white;">
                    <div v-if="item.reply_id" class="d-flex mt-1 justify-content-end">
                        <div class="context reply-box-color mw-90" style="min-width: 60px">
                            <div class="fs-12 grey2 text-center text-truncate">
                                {{ messageParsing(item.reply_content) }}
                            </div>
                        </div>
                    </div>

                    <div class="position-relative d-flex mb-1 justify-content-end">
                        <!-- :class=" { 'my-last-context': item.showDate}" -->
                        <div
                            v-if="item.message_type === 0"
                            v-more="true"
                            class="context position-relative bg-main-color text-start text-white"
                            :data-uuid="item.id"
                            :data-my-message="true"
                        >
                            <div v-html="item.content"></div>
                            <div class="active-evnet"></div>
                        </div>
                        <div
                            v-else-if="item.message_type === 1"
                            v-more="true"
                            class="position-relative cp"
                            :data-uuid="item.id"
                            :data-my-message="true"
                            @click="zoomImage(imageLoadSuccess ? item.image_url : defaultImageSrc)"
                        >
                            <img
                                :src="imageLoadSuccess ? item.image_url : defaultImageSrc"
                                class="chat-img"
                                alt="Image Preview"
                                @error="handleImageError"
                            />
                            <div class="active-evnet"></div>
                            
                            <div v-if="item.loading" class="chat-img-loading">
                                <loading-spinner positionY="center" />
                            </div>
                        </div>
                        <div
                            v-else-if="item.message_type === 2"
                            v-more="true"
                            class="chat-img position-relative mb-1"
                            :data-uuid="item.id"
                            :data-my-message="true"
                        >
                            <video class="w-100" controls>
                                <source :src="item.image_url" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div class="active-evnet"></div>
                        </div>
                    </div>
                    <div v-if="item.showDate || item.isWait">
                        <div class="fs-14 text-end blur-color">
                            <!-- {{ item.date }} -->
                            {{ item.isWait ? '전송중... ' : '' }}
                        </div>
                    </div>
                </div>
                <div v-if="item.error" class="d-flex justify-content-center align-items-center ms-1 pb-1">
                    <!-- style="margin-bottom: 21px" -->
                    <base-icon :icon="'error-send'" :color="'#F17676'" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BaseIcon from '@/components/BaseIcon';

import ChatItemHandler from '@/mixin/ChatItemHandler';

export default {
    name: 'OtherChatItem',
    props: {
        item: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    components: {
        BaseIcon,
    },
    mixins: [ChatItemHandler],
    methods: {
        messageParsing(message) {
            if (!message) return ' ';
            return message.replace(/< *\/?br *\/?>.*/i, '...').replace(/&nbsp;/g, ' ');
        },
    },
};
</script>

<style scoped></style>