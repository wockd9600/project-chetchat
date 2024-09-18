<template>
    <div class="chat-item position-relative w-100">
        <div class="position-relative bg-white w-100">
            <div class="position-relative d-flex justify-content-end bg-white">
                <div class="mw-80 position-relative" style="z-index: 1">
                    <div
                        class="d-flex justify-content-end mb-1"
                        :class="{ 'mt-2': item.showPN }"
                        style="background-color: white"
                    >
                        <div
                            v-if="item.message_type === 1"
                            class="position-relative cp"
                            v-more
                            :data-uuid="item.id"
                            :data-my-message="true"
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
                        <div v-else-if="item.message_type === 0">
                            <!-- :class="{ 'my-last-context': item.showDate }" -->
                            <div
                                v-if="publicInfo.room_uuid === publicRoomUuid"
                                v-more
                                class="context position-relative bg-main-color text-start text-white"
                                :data-uuid="item.id"
                                :data-my-message="true"
                                :data-sender-uuid="item.sender_uuid"
                            >
                                <div v-html="item.content"></div>
                                <div class="active-evnet"></div>

                                <!-- {{ h }} -->
                            </div>
                            <!-- 'my-last-context': item.showDate, -->
                            <div
                                v-else
                                v-more
                                class="context position-relative bg-main-color-3 text-start text-white"
                                :class="{
                                    'bg-main-color': item.sender_uuid === myInfo.user_uuid,
                                }"
                                :data-uuid="item.id"
                                :data-my-message="true"
                                :data-sender-uuid="item.sender_uuid"
                            >
                                <div v-html="item.content"></div>
                                <div class="active-evnet"></div>
                            </div>
                        </div>
                    </div>
                    <div class="position-absolute start-0 bottom-0 mb-2" style="margin-left: -55px">
                        <div class="fs-14 text-end blur-color">
                            <!-- {{ item.date }} -->
                            {{ item.isWait ? '전송중... ' : '' }}
                        </div>
                    </div>
                </div>
                <div
                    v-if="item.error"
                    class="d-flex justify-content-end align-items-end ms-1"
                    style="margin-bottom: 21px"
                >
                    <base-icon :icon="'error-send'" :color="'#F17676'" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BaseIcon from '@/components/BaseIcon';
import { mapGetters } from 'vuex';

import ChatItemHandler from '@/mixin/ChatItemHandler';

export default {
    name: 'PublicChatItem',
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
    computed: {
        ...mapGetters(['publicInfo']),

        publicRoomUuid() {
            return this.$route.path.split('/').slice(-1)[0] || 0;
        },
    },
    mixins: [ChatItemHandler],
};
</script>

<style scoped>
</style>