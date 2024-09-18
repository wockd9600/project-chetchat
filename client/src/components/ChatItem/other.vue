<template>
    <div class="chat-item position-relative w-100">
        <div class="position-relative bg-white w-100" style="z-index: 1; background-color: white" :data-uuid="item.id">
            <div class="d-flex justify-content-start mw-80">
                <div class="text-start mb-1" :class="{ 'mt-2': item.showPN }">
                    
                    <div v-if="!isPublic && item.reply_id" class="d-flex mt-1 justify-content-start">
                        <div class="context reply-box-color mw-90" style="min-width: 60px">
                            <div class="fs-12 grey2 text-start text-truncate">
                                {{ messageParsing(item.reply_content) }}
                            </div>
                        </div>
                    </div>

                    <!-- :class="{ 'other-last-context': item.showDate }" -->
                    <div
                        v-if="item.message_type === 0"
                        v-more
                        class="context position-relative message-box-color"
                        style="width: fit-content"
                        :data-uuid="item.id"
                        :data-sender-uuid="item.sender_uuid"
                    >
                        <div v-html="item.content"></div>
                        <div class="active-evnet"></div>
                    </div>

                    <div
                        v-else-if="item.message_type === 1"
                        v-more
                        class="position-relative cp"
                        :data-uuid="item.id"
                        :data-sender-uuid="item.sender_uuid"
                        @click="zoomImage(imageLoadSuccess ? item.image_url : defaultImageSrc)"
                    >
                        <img
                            :src="imageLoadSuccess ? item.image_url : defaultImageSrc"
                            class="chat-img"
                            alt="Image Preview"
                            @error="handleImageError"
                        />
                        <div class="active-evnet"></div>
                    </div>
                    <div
                        v-else-if="item.message_type === 2"
                        v-more
                        class="chat-img position-relative mb-1"
                        :data-uuid="item.id"
                        :data-sender-uuid="item.sender_uuid"
                    >
                        <video class="w-100" controls>
                            <source :src="item.image_url" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <div class="active-evnet"></div>
                    </div>

                    <!-- <div v-if="item.showDate" class="mb-3 fs-14 blur-color">{{ item.date }}</div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ChatItemHandler from '@/mixin/ChatItemHandler';

export default {
    name: 'ChatItem',
    props: {
        item: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    computed: {
        isPublic() {
            return this.$route.path.split('/')[1] === 'public';
        },
    },
    methods: {
        messageParsing(message) {
            if (!message) return ' ';
            return message.replace(/< *\/?br *\/?>.*/i, '...').replace(/&nbsp;/g, ' ');
        },
    },
    mixins: [ChatItemHandler],
    // data() {
    //     return { h: '' };
    // },
};
</script>

<style scoped></style>