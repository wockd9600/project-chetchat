<template>
    <div class="app-wrapper">
        <div class="sub-container">
            <top-navigation-bar />

            <div v-if="profileInfo" class="dd">
                <div class="header-profile-info position-absolute d-flex align-items-center" @click="profileDetail()">
                    <profile-image :profile_img="profileInfo.profile_img" class="cp" :size="'30px'" />
                </div>
            </div>

            <section class="app-main">
                <div class="chat-box">
                    <div class="px-3">
                        <div class="mt-5 mb-3">
                            <profile-info :option="profileInfo" :link="true" :isFocus="true" />
                        </div>

                        <div class="line mb-4"></div>

                        <div v-if="messageList.length !== 0">
                            <div v-for="(item, index) in messageList" :key="index">
                                <chat-item :item="item" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <new-chat-bottom-bar />
        </div>
    </div>
</template>
  
<script>
import TopNavigationBar from '@/layout/components/TopNavigationBar';
import NewChatBottomBar from '@/layout/components/BottomNavigationBar/components/NewChatBottomBar';
import ChatItem from '@/components/ChatItem';
import ProfileInfo from '@/components/ProfileInfo';
import ProfileImage from '@/components/ProfileImage';

import { mapGetters } from 'vuex';

export default {
    name: 'NewChatRoom',
    components: {
        TopNavigationBar,
        NewChatBottomBar,
        ChatItem,
        ProfileInfo,
        ProfileImage,
    },
    computed: {
        ...mapGetters(['messageList', 'selectedFrinedsForNewChat', 'profileInfo']),
    },
    created() {
        if (Object.keys(this.selectedFrinedsForNewChat).length === 0) {
            const selectedFriends = JSON.parse(sessionStorage.getItem('selectedFriends'));
            if (Object.keys(selectedFriends).length === 0) return this.$router.replace({ path: '/chat' });

            this.setProfileInfo(selectedFriends);
            this.$store.commit('SELECT_FRIEND_INIT', selectedFriends);
        } else {
            this.setProfileInfo(this.selectedFrinedsForNewChat);
        }

        const sfnc = Object.values(this.selectedFrinedsForNewChat)[0];
        const name = sfnc.friend_name ? sfnc.friend_name : sfnc.nickname;
        this.$store.commit('setChatRoomName', name);
    },
    methods: {
        setProfileInfo(selectedFriends) {
            const email = Object.keys(selectedFriends)[0];
            selectedFriends[email].relation = 0;
            selectedFriends[email].margin = false;

            return this.$store.commit('PROFILE_INFO_INIT', selectedFriends[email]);
            // this.$store.dispatch('initializeProfileInfo', );
        },
        profileDetail() {
            setTimeout(() => {
                this.$router.push({ path: `/profile/${this.profileInfo.email}` });
            }, 200);
        },
    },
    beforeUnmount() {
        this.$store.dispatch('clearProfileInfo');
    },
};
</script>
  
<style scoped>
.dd {
    position: fixed;
    top: 0;
    height: 0;
    z-index: 1000;
}
.header-profile-info {
    top: 0;
    height: 50px;
    margin-left: 45px;
}
</style>
    