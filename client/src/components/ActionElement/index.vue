<template>
    <div class="fs-18 blur-color" :class="{ 'text-black': isActive, 'cp': isActive }" @click="headerAciton">
        <span>
            {{ content }}
        </span>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'ActionElement',
    props: {
        // username: String
        option: {
            type: Object,
            default: () => {
                return {
                    content: '',
                    action: '',
                };
            },
        },
    },
    computed: {
        ...mapGetters(['actionElementActive', 'actionElementValue']),
        content() {
            return this.option.content;
        },
        action() {
            return this.option.action;
        },
        isActive() {
            return this.actionElementActive === 'black' ? true : false;
        }
    },
    methods: {
        async headerAciton() {
            if (!this.actionElementActive) return;

            if (this.action === 'new-chat') {
                this.$store.dispatch('createChat');
            } else if (this.action === 'set-public-room-name') {
                this.$store.dispatch('togglePublicSetting', { key: 'name', value: this.actionElementValue });
            }
            // else if (this.action === 'set-my-setting-id') {
            //     this.$store.dispatch('toggleMySetting', { key: 'email', value: this.actionElementValue });
            // }
            else if (this.action === 'set-profile-edit-nickname') {
                await this.$store.dispatch('toggleMyProfile', { key: 'nickname', value: this.actionElementValue });
            } else if (this.action === 'set-profile-edit-status-message') {
                await this.$store.dispatch('toggleMyProfile', { key: 'status_message', value: this.actionElementValue });
            } else if (this.action === 'set-friend-edit-nickname') {
                this.$store.dispatch('toggleFriendsOption', { key: 'friend_name', value: this.actionElementValue });
            } else {
                console.log('report');
            }
        },
        clearActionElement() {
            this.$store.commit('setActionElementActive');
            this.$store.commit('setActionElementValue');
        },
    },
};
</script>

<style>
</style>