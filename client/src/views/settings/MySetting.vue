<template>
    <div class="app-wrapper">
        <div class="sub-container">
            <top-navigation-bar />
            <div class="app-main">
                <div>
                    <div class="w-100">
                        <ul class="fs-18">
                            <li class="d-flex p-3 justify-content-between click-effect">
                                <div>아이디</div>
                                <div class="grey2">{{ myInfo.email }}</div>
                            </li>
                            <!-- <li class="d-flex pt-2 pb-2 justify-content-between">
                                <div>연동된 서비스</div>
                                <div class="grey2">{{ myInfo.auth_service }}</div>
                            </li> -->
                        </ul>
                    </div>
                    <div class="line mt-2 mx-3 mb-2"></div>
                    <div class="w-100">
                        <ul class="fs-18">
                            <li
                                class="d-flex p-3 justify-content-between align-items-center click-effect"
                                @click="changeAllowAddFriends"
                            >
                                <div>친구추가 허용</div>
                                <div class="el-switch drawer-switch" :class="{ 'is-checked': allowAddFriends }">
                                    <input type="checkbox" v-model="allowAddFriends" class="el-switch__input" />
                                    <div class="el-switch__core" style="width: 50px"></div>
                                </div>
                            </li>
                            <!-- <li
                                class="d-flex pt-2 pb-2 px-3 justify-content-between click-effect"
                                @click="setAllowOneToOneChat"
                            >
                                <div>쪽지 허용</div>
                                <div class="grey2">{{ allowOneToOneChat }}</div>
                            </li> -->
                        </ul>
                    </div>
                    <div class="line mt-2 mx-3 mb-2"></div>
                    <div class="w-100">
                        <ul class="fs-18">
                            <li
                                class="d-flex p-3 justify-content-between align-items-center click-effect"
                                @click="moveRoute(1)"
                            >
                                <div>개인정보 처리방침</div>
                            </li>
                            <li
                                class="d-flex p-3 justify-content-between align-items-center click-effect"
                                @click="moveRoute(2)"
                            >
                                <div>서비스 이용약관</div>
                            </li>
                        </ul>
                    </div>
                    <div class="line mt-2 mx-3 mb-2"></div>
                    <div class="w-100">
                        <ul class="fs-18">
                            <li
                                class="d-flex p-3 justify-content-between align-items-center click-effect"
                                @click="deleteAccount"
                            >
                                <div>회원 탈퇴</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <bottom-navigation-bar />
        </div>
    </div>
</template>
  
<script>
import axios from '@/utils/axios';
import { mapGetters } from 'vuex';

export default {
    name: 'MySetting',
    computed: {
        ...mapGetters(['myInfo', 'mySetting']),

        allowAddFriends() {
            return this.mySetting.friend_request;
        },
        // allowOneToOneChatIndex() {
        //     return this.mySetting.direct_message;
        // },
        // allowOneToOneChat() {
        //     return this.allowQuestionOptions[this.allowOneToOneChatIndex];
        // },
    },
    data() {
        return {
            done: true,
            allowQuestionOptions: ['모두', '친구만'],
        };
    },
    methods: {
        ingSetting() {
            if (!this.done) return true;
            this.done = false;

            setTimeout(() => {
                this.done = true;
            }, 200);

            return false;
        },
        // setAllowOneToOneChat() {
        //     const value = (this.allowOneToOneChatIndex + 1) % this.allowQuestionOptions.length;
        //     this.$store.dispatch('toggleMySetting', { key: 'direct_message', value });
        // },
        changeAllowAddFriends() {
            if (this.ingSetting()) return;

            this.$store.dispatch('toggleMySetting', { key: 'friend_request', value: !this.allowAddFriends });
        },
        moveRoute(index) {
            const paths = ['/my-setting/name', '/privacy', '/terms'];
            this.$router.push({ path: paths[index] });
        },
        async deleteAccount() {
            const result = confirm(
                '회원 탈퇴 시 더 이상 해당 아이디를 사용할 수 없게 됩니다.\n그래도 탈퇴하시겠습니까?',
            );
            if (!result) return;

            try {
                const { success } = (await axios.delete(`/users/account`)).data;
                if (success) {
                    alert('탈퇴되었습니다.');
                    this.$router.push({ path: '/login' });
                } else {
                    alert('탈퇴가 보류되었습니다. 나중에 다시 시도해 주세요.');
                }
            } catch (error) {
                alert('탈퇴가 보류되었습니다. 나중에 다시 시도해 주세요.', error);
            }
        },
    },
};
</script>
  
<style scoped>
.bg-setting {
    width: 25px;
    height: 25px;
    border: 1px solid #afafaf;
    box-sizing: border-box;
}
.el-switch {
    display: flex;
    vertical-align: middle;
}
.el-switch.is-checked .el-switch__core {
    border-color: #254edb;
    background-color: #254edb;
}
.el-switch__core {
    margin: 0;
    display: inline-block;
    position: relative;
    width: 50px;
    height: 24px;
    border: 1px solid #dcdfe6;
    outline: none;
    border-radius: 25px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background: #dcdfe6;
    cursor: pointer;
    -webkit-transition: border-color 0.3s, background-color 0.3s;
    transition: border-color 0.3s, background-color 0.3s;
    vertical-align: middle;
}
.el-switch__input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    margin: 0;
}
.el-switch.is-checked .el-switch__core::after {
    left: 88%;
    margin-left: -17px;
}
.el-switch__core:after {
    content: '';
    position: absolute;
    top: 0px;
    left: 1px;
    border-radius: 100%;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    width: 22px;
    height: 22px;
    background-color: #ffffff;
}
.close {
    transition: transform 0.3s;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
}
</style>
    