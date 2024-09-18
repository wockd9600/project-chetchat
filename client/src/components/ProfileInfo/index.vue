<template>
    <div v-if="option.email !== 0" class="d-flex h-100 align-items-end justify-content-center">
        <div class="w-100 px-5">
            <div class="profile-info">
                <div class="d-flex justify-content-center">
                    <profile-image
                        :profile_img="option.profile_img"
                        :enlargement="enlargement"
                        :class="{ cp: isFocus }"
                        :size="'100px'"
                        @click="profileDetail()"
                    />
                </div>
                <div class="d-flex justify-content-center">
                    <div class="user-name mt-2 fw-bold fs-20">
                        {{ option.friend_name ? option.friend_name : option.nickname }}
                        <span v-if="relation === 2" class="position-absolute pt-1 ps-1">
                            <icon-route-navigation
                                :option="{
                                    icon: 'pencil',
                                    fontSize: '16px',
                                    path: friendsNameEditPath(),
                                    query: { nickname: option.nickname, friend_name: option.friend_name },
                                    color: '#8E8E8E',
                                }"
                            />
                        </span>
                    </div>
                </div>
                <div class="status-message mt-1 grey2">{{ option.status_message }}</div>
                <!-- <div class="url main-color">{{ option.url }}</div> -->
                <div
                    class="position-relative d-flex justify-content-center"
                    :style="{ marginTop: margin ? '80px' : '20px' }"
                >
                    <div>
                        <div v-if="relation === 1">
                            <button type="button" class="btn-base fill bg-main-color" @click="addFriend">친구 추가</button>
                        </div>
                        <div v-if="relation === 2">
                            <button type="button" class="btn-base fill bg-main-color" @click="oneToOneChat">1:1 대화하기</button>
                        </div>
                        <div v-if="relation === 3">
                            <button type="button" class="btn-base fill bg-main-color" @click="moveProfileEditPage">
                                프로필 편집
                            </button>
                        </div>
                    </div>
                    <div
                        v-if="(relation !== 3 && public_room_uuid && margin) || relation == 3"
                        class="position-absolute start-50 top-50"
                        style="transform: translateY(-50%); margin-left: 90px"
                        @click="movePublicRoom()"
                    >
                        <div
                            class="position-relative d-flex justify-content-center align-items-center"
                            v-bind:style="{
                                backgroundColor: '#fff',
                                border: `2px solid #6690ff`,
                            }"
                            style="box-sizing: border-box; width: 34px; height: 34px; border-radius: 50%;"
                        >
                        <base-icon
                            :icon="'letter'"
                            :fontSize="'22px'"
                            :color="'#6690ff'"
                        />
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import IconRouteNavigation from '@/components/IconRouteNavigation';
import ProfileImage from '@/components/ProfileImage';
import BaseIcon from '@/components/BaseIcon';

export default {
    name: 'ProfileInfo',
    components: {
        IconRouteNavigation,
        ProfileImage,
        BaseIcon,
    },
    props: {
        // username: String
        option: {
            type: Object,
            default: () => {
                return {
                    email: 0,
                    profile_img: '',
                    frined_name: null,
                    nickname: '',
                    status_message: '',
                    margin: true,
                    relation: 0,
                    public_room_uuid: '',
                };
            },
        },
        link: { type: Boolean, default: false },
        enlargement: { type: Boolean, default: false },
        isFocus: { type: Boolean, default: false },
    },
    computed: {
        margin() {
            if (this.option.margin === undefined || this.option.margin === null) return true;
            return this.option.margin;
        },
        relation() {
            // 1, 2, 3 남, 친구, 나
            return this.option.relation || 0;
        },
        public_room_uuid() {
            return this.option.public_room_uuid || '';
        },
    },
    methods: {
        moveProfileEditPage() {
            this.$router.push({ path: '/profile-edit' });
        },
        movePublicRoom() {
            this.$router.push({ path: `/letter/${this.public_room_uuid}` });
        },
        addFriend() {
            this.$store.dispatch('addFriends', this.option.email);
        },
        profileDetail() {
            if (this.link) {
                setTimeout(() => {
                    this.$router.push({ path: `/profile/${this.option.email}` });
                }, 200);

                return;
            }
        },
        oneToOneChat() {
            this.$store.commit('setSelectedFrinedsForNewChat', this.option);
            this.$store.dispatch('createChat');
        },
        friendsNameEditPath() {
            return this.$route.path + '/edit-name';
        },
    },
};
</script>

<style></style>