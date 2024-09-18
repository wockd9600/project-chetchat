<template>
    <div>
        <div class="search-bar px-3" id="search_bar">
            <div class="search-bar__form">
                <div class="search-bar__box blur-box-color">
                    <base-icon
                        :icon="'search'"
                        :fontSize="'14px'"
                        :color="'#000'"
                        class="icon-search"
                        style="padding-top: 0.12rem"
                    />
                    <input
                        type="search"
                        :value="searchQuery"
                        class="search-bar__input"
                        id="search_input"
                        placeholder="별명으로 검색"
                        @input="searchFriends"
                    />
                    <base-icon
                        :icon="'clear-circle'"
                        :fontSize="'14px'"
                        :color="'#000'"
                        class="icon-clear pt-1"
                        @click="searchClear"
                    />
                    <a class="icon-clear" @click="searchClear"></a>
                </div>
                <!-- <label for="search_input" class="search-bar__label" id="search_text">
                    <base-icon :icon="'search'" />
                    <span>搜索</span>
                </label> -->
            </div>
        </div>
        <div class="filtered-friends-container pt-3">
            <div class="blur-color text-start ps-3 pt-1 pb-1 fs-14">친구</div>
            <ul class="filtered-friends-box px-3">
                <li
                    v-for="(item, index) in filtered_friends"
                    :key="index"
                    class="d-flex align-items-center w-100 pt-1 pb-2"
                >
                    <label :for="index" class="select-container" style="width: 41px !important">
                        <profile-image :profile_img="item.profile_img" size="45px" fontSize="24px" />
                    </label>
                    <label :for="index" class="select-container text" style="height: 45px;">
                        <div class="px-3 text-truncate">{{ item.friend_name ? item.friend_name : item.nickname }}</div>
                    </label>
                    <div class="duplicate">
                        <label :for="index" class="select-container">
                            <input
                                type="checkbox"
                                :checked="selectedFrinedsForNewChat[item.email]"
                                :id="index"
                                @click="selectFriendForChat(index)"
                            />
                            <span class="checkmark"></span>
                        </label>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template> 

<script>
import BaseIcon from '@/components/BaseIcon';
import ProfileImage from '@/components/ProfileImage';

import { mapGetters } from 'vuex';
import { includeByCho } from '@/utils/search';

export default {
    name: 'FilterFriends',
    components: {
        BaseIcon,
        ProfileImage,
    },
    computed: {
        ...mapGetters(['selectedFrinedsForNewChat', 'friends']),
    },
    data() {
        return {
            searchQuery: '',
            filtered_friends: null,
        };
    },
    created() {
        this.$store.commit('setSelectedFrinedsForNewChat', {});
        sessionStorage.removeItem('selectedFriends');
    },
    mounted() {
        this.filtered_friends = this.friends;
    },
    methods: {
        selectFriendForChat(index) {
            // 일단 단체 채팅 불가
            if (this.selectedFrinedsForNewChat[this.friends[index].email]) {
                this.$store.commit('setSelectedFrinedsForNewChat', {});

                this.$store.commit('setActionElementActive', false);
            } else {
                this.$store.commit('setSelectedFrinedsForNewChat', {});
                this.$store.commit('setSelectedFrinedsForNewChat', this.friends[index]);

                this.$store.commit('setActionElementActive', 'black');
            }

            // if (this.selectedFrinedsForNewChat.length === 0) {
            // } else {
            // }
        },
        searchFriends(e) {
            if (e) this.searchQuery = e.target.value;

            if (this.searchQuery === '') {
                this.filtered_friends = this.friends;
            } else {
                const query = this.searchQuery.toLowerCase();
                // this.filtered_friends = this.friends.filter((friend) => friend.name.toLowerCase().includes(query));
                this.filtered_friends = this.friends.filter((friend) => {
                    const name = friend.friend_name ? friend.friend_name : friend.nickname;
                    return includeByCho(query, name.toLowerCase());
                });
            }
        },
        searchClear() {
            this.searchQuery = '';
            this.searchFriends();
        },
    },
};
</script>

<style scoped>
.text {
    display: flex;
    flex: 1;
    align-items: center;
}

.filtered-friends-container {
    height: calc(100% - 56px);
    overflow: scroll;
}

.select-container {
    width: 26px;
    /* height: 26px; */
}
</style>