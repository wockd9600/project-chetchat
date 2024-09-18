<template>
    <div>
        <top-navigation-bar />

        <div class="app-main">
            <profile-info v-if="Object.keys(profileInfo).length !== 0" :option="profileInfo" :isFocus="true" :enlargement="true" />
        </div>

        <bottom-navigation-bar />
    </div>
</template>

<script>
import ProfileInfo from '@/components/ProfileInfo';

import { mapGetters } from 'vuex';

export default {
    name: 'userProfile',
    components: {
        ProfileInfo,
    },
    computed: {
        ...mapGetters(['myInfo', 'publicInfo', 'profileInfo', 'friends', 'chatRoomList']),
    },
    async created() {
        const email = this.$route.path.split('/').slice(-1)[0];

        if (this.myInfo.email === email) {
            this.$store.dispatch('chanageHeader', 'MyProfile');
            return await this.$store.commit('PROFILE_INFO_INIT', {
                ...this.myInfo,
                public_room_uuid: this.publicInfo.room_uuid,
                relation: 3,
            });
        }

        const index = this.friends.findIndex((item) => item.email === email);
        
        if (index !== -1) {
            const room_uuid =
                Object.keys(this.chatRoomList).find((key) => this.chatRoomList[key].email === email) || null;

            if (this.friends[index].bookmarked) this.$store.dispatch('chanageHeader', 'BookMarkedUserProfile');
            else this.$store.dispatch('chanageHeader', 'UserProfile');

            return await this.$store.commit('PROFILE_INFO_INIT', {
                ...this.friends[index],
                room_uuid,
                relation: 2,
            });
        }

        // 모르는 유저는 버퍼링
        await this.$store.dispatch('initializeProfileInfo', email);
    },
};
</script>

<style scoped></style>
  