<template>
    <div class="app-wrapper">
        <div class="sub-container">
            <div>
                <top-navigation-bar />
            </div>
            <div class="app-main">
                <div class="dd">
                    <div class="search-bar px-3">
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
                                    ref="searchUserInput"
                                    class="search-bar__input"
                                    placeholder="아이디를 입력해 주세요."
                                    autocomplete="off"
                                    autocapitalize="none"
                                    @keydown.enter="searchUser"
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
                        </div>
                    </div>
                    <div v-if="Object.keys(profileInfo).length !== 0" class="profile-form">
                        <loading-spinner v-if="profileInfo.loading" positionX="center" positionY="center" />

                        <profile-info v-else :option="profileInfo" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import TopNavigationBar from '@/layout/components/TopNavigationBar';
import BaseIcon from '@/components/BaseIcon';
import ProfileInfo from '@/components/ProfileInfo';
import LoadingSpinner from '@/components/LoadingSpinner'

import { mapGetters } from 'vuex';

export default {
    name: 'SearchUser',
    components: {
        TopNavigationBar,
        BaseIcon,
        ProfileInfo,
        LoadingSpinner,
    },
    computed: {
        ...mapGetters(['profileInfo']),
    },
    mounted() {
        this.searchClear();
        this.$refs.searchUserInput.focus();
    },
    methods: {
        async searchUser() {
            this.$refs.searchUserInput.blur();

            this.searchClear();
            const email = this.$refs.searchUserInput.value;
            if (email === '') return;

            await this.$store.dispatch('searchUser', email);
            this.$refs.searchUserInput.focus();
        },
        searchClear() {
            this.$store.commit('CLEAR_PROFILE_INFO');
        },
    },
    beforeUnmount() {
        this.$store.commit('CLEAR_PROFILE_INFO');
    },
};
</script>
  
<style scoped>
.dd {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.profile-form {
    margin-top: 100px;
    margin-bottom: 50px;
}
</style>
    