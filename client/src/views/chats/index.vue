<template>
    <div class="app-wrapper">
        <top-navigation-bar />

        <section class="app-main">
            <div class="chats">
                <div class="px-3 mt-2 mb-2">
                    <!-- <advertisement-banner /> -->
                </div>
                <chat-room-list />
            </div>
            <div v-if="isChangeNotification" class="position-absolute w-100 h-100" style="top: 0; z-index: 1005;">
                <loading-spinner positionX="center" positionY="center" />
            </div>
        </section>

        <bottom-navigation-bar />
    </div>
</template>
  
<script>
import ChatRoomList from '@/components/ChatRoomList';
// import AdvertisementBanner from '@/components/AdvertisementBanner';
import LoadingSpinner from '@/components/LoadingSpinner';

import { mapGetters } from 'vuex';

export default {
    name: 'ChatView',
    components: {
        ChatRoomList,
        // AdvertisementBanner,
        LoadingSpinner,
    },
    computed: {
        ...mapGetters(['mySetting', 'isChangeNotification']),
    },
    created() {
        if (!this.mySetting.notification) this.$store.dispatch('chanageHeader', 'ChatViewNonNotification');
    },
};
</script>
  
<style scoped>
.chats {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
}
</style>
    