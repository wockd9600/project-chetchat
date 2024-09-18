<template>
    <div class="app-wrapper">
        <top-navigation-bar />

        <section class="app-main">
            <div class="frinds">
                <div>
                    <div>
                        <div
                            v-if="myInfo"
                            class="d-flex px-3 align-items-center w-100 pt-3 pb-2 click-effect"
                            @click="profileDetail(myInfo)"
                        >
                            <profile-image :profile_img="myInfo.profile_img" :size="'55px'" fontSize="36px" />

                            <div class="ps-2 pe-2 text">
                                <div class="fs-18 fw-bold text-truncate">
                                    {{ myInfo.nickname }}
                                </div>
                            </div>
                            <div v-if="myInfo.status_message" class="status-message-box">
                                <div class="status-message text-truncate">
                                    {{ myInfo.status_message }}
                                </div>
                            </div>
                        </div>

                        <div v-if="bookmarked_friends.length !== 0" class="filtered-friends-container">
                            <div class="mt-3 mx-3 mb-2"></div>
                            <div class="blur-color text-start pt-1 ps-3 pb-1 fs-14">즐겨찾기</div>
                            <ul class="filtered-friends-box">
                                <li
                                    v-for="(item, index) in bookmarked_friends"
                                    :key="index"
                                    class="d-flex px-3 align-items-center w-100 pt-2 pb-2 click-effect"
                                    @click="profileDetail(item)"
                                >
                                    <profile-image :profile_img="item.profile_img" size="40px" fontSize="24px" />
                                    <div class="ps-2 pe-2 text">
                                        <div class="text-truncate">
                                            {{ item.friend_name ? item.friend_name : item.nickname }}
                                        </div>
                                    </div>
                                    <div v-if="item.status_message" class="status-message-box">
                                        <div class="status-message text-truncate">
                                            {{ item.status_message }}
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div class="mt-3 mx-3 mb-2"></div>

                        <div class="filtered-friends-container">
                            <div class="blur-color text-start pt-1 ps-3 pb-1 fs-14">친구</div>
                            <ul class="filtered-friends-box">
                                <li
                                    v-for="(item, index) in just_friends"
                                    :key="index"
                                    class="d-flex px-3 align-items-center w-100 pt-2 pb-2 click-effect"
                                    @click="profileDetail(item)"
                                >
                                    <profile-image :profile_img="item.profile_img" size="40px" fontSize="24px" />
                                    <div class="ps-3 pe-2 text">
                                        <div class="text-truncate">
                                            {{ item.friend_name ? item.friend_name : item.nickname }}
                                        </div>
                                    </div>
                                    <div v-if="item.status_message" class="status-message-box">
                                        <div class="status-message text-truncate">
                                            {{ item.status_message }}
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <!-- <advertisement-banner /> -->
                    </div>
                </div>
            </div>
        </section>

        <bottom-navigation-bar />
    </div>
</template>
  
<script>
import ProfileImage from '@/components/ProfileImage';

import { mapGetters } from 'vuex';

export default {
    name: 'FriendView',
    components: {
        ProfileImage,
        // AdvertisementBanner,
    },
    computed: {
        ...mapGetters(['myInfo', 'friends']),
        bookmarked_friends() {
            if (!this.friends) return [];
            else return this.friends.filter((item) => item.bookmarked);
        },
        just_friends() {
            if (!this.friends) return [];
            else return this.friends.filter((item) => !item.bookmarked);
        },
    },
    methods: {
        profileDetail(item) {
            // setTimeout(() => {
            this.$router.push({ path: `/profile/${item.email}` });
            // }, 10)
        },
    },
};
</script>
  
<style scoped>
.frinds {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
}

.text {
    display: flex;
    flex: 1;
    min-width: 40%;
    align-items: flex-start;
}

.status-message-box {
    display: flex;
    width: fit-content;
    max-width: 40%;
    justify-content: flex-end;
    /* max-width: 150px; */
}
.status-message {
    padding: 3px 8px;
    /* border: 0.5px solid #000000; */
    border-radius: 10px;
    width: fit-content;
    font-size: 14px;
    color: #8e8e8e;
}
</style>
    