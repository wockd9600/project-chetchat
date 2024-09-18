<template>
    <div class="app-wrapper">
        <div class="sub-container">
            <div>
                <top-navigation-bar />
            </div>
            <div class="filtered-friends-container px-3">
                <div class="blur-color text-start pt-1 pb-1 fs-14">목록 {{ blockList.length }}</div>
                <ul v-if="blockList.length !== 0" class="filtered-friends-box">
                    <li
                        v-for="(item, index) in blockList"
                        :key="index"
                        class="d-flex align-items-center w-100 pt-2 pb-2"
                    >
                        <profile-image :profile_img="item.profile_img" :size="'30px'" />
                        <div class="ps-2 pe-2 text">
                            <div class="text-truncate">
                                {{ item.nickname }}
                            </div>
                        </div>
                        <div>
                            <div @click="deleteBlockFriends(item.id)" class="tt fs-14 cp">해제</div>
                        </div>
                    </li>
                </ul>
            </div>
            <div>
                <bottom-navigation-bar />
            </div>
        </div>
    </div>
</template>
  
<script>
import TopNavigationBar from '@/layout/components/TopNavigationBar';
import BottomNavigationBar from '@/layout/components/BottomNavigationBar';
import ProfileImage from '@/components/ProfileImage';

import { mapGetters } from 'vuex';

export default {
    name: 'BlockList',
    components: {
        TopNavigationBar,
        BottomNavigationBar,
        ProfileImage,
    },
    computed: {
        ...mapGetters(['blockList']),
    },
    async created() {
        await this.$store.dispatch('initializeBlockList');
    },
    methods: {
        deleteBlockFriends(id) {
            this.$store.dispatch('deleteBlockedUser', id);
        },
    },
};
</script>
  
<style scoped>
.text {
    display: flex;
    flex: 1;
    min-width: 40%;
    align-items: flex-start;
}

.tt {
    padding: 2px 5px;
    border: 0.5px solid #000;
    border-radius: 10px;
    box-sizing: border-box;
}
</style>
    