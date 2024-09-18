<template>
    <div class="app-wrapper">
        <!-- <top-navigation-bar /> -->
        <div style="height: 50px"></div>

        <div class="login-container" style="overflow: scroll !important">
            <form class="el-form login-form el-form--label-left" autocomplete="on">
                <div class="title-container">
                    <h3 class="title">Chet Chat</h3>
                </div>
                <div class="el-form-item is-success is-required el-form-item--medium">
                    <div class="el-form-item__content">
                        <!-- <span data-v-37dfd6fc="" class="svg-container">
                        <svg data-v-c8a70580="" data-v-37dfd6fc="" aria-hidden="true" class="svg-icon">
                            <use data-v-c8a70580="" xlink:href="#icon-user"></use>
                        </svg>
                    </span> -->
                        <div class="el-input message-box-color">
                            <input
                                ref="userNameInput"
                                tabindex="1"
                                type="text"
                                autocomplete="on"
                                autocapitalize="none"
                                placeholder="Username"
                                name="username"
                                @input="checkPossibleLogin"
                                @keyup.enter="$refs.passWordeInput.focus()"
                            />
                        </div>
                    </div>
                </div>
                <div
                    class="mt-2 el-form-item el-tooltip is-success is-required el-form-item--medium"
                    aria-describedby="el-tooltip-8372"
                >
                    <div class="el-form-item__content">
                        <div class="el-input message-box-color">
                            <input
                                ref="passWordeInput"
                                tabindex="2"
                                type="password"
                                autocomplete="on"
                                autocapitalize="none"
                                placeholder="Password"
                                name="password"
                                @input="checkPossibleLogin"
                                @keyup.enter="login"
                            />
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <button
                        ref="loginButton"
                        type="button"
                        class="btn-base w-100 fill"
                        :class="{ 'bg-main-color': possibleLogin }"
                        style="border-radius: 10px; min-width: auto !important"
                        @click="login"
                    >
                        로그인
                    </button>
                </div>
                <div class="position-relative mt-3">
                    <div class="tips">
                        <span>계정이 없다면</span><span class="main-color-5" @click="moveSignUpPage">회원가입</span>
                    </div>
                </div>

            </form>

            <div class="tips position-absolute w-100 mb-4 d-flex justify-content-center" style="bottom: 0;">
                <div class="me-3 fw-bold"><router-link :to="'/privacy'" style="text-decoration-line: none;">개인정보 처리방침</router-link></div>
                <div><router-link :to="'/terms'" style="text-decoration-line: none;">서비스 이용약관</router-link></div>
            </div>
        </div>

        <div style="height: 200px"></div>
        <!-- <bottom-navigation-bar /> -->
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { socketConnect } from '@/utils/socket.js';
import axios from '@/utils/axios';
import { setLoginData } from '@/utils/login';

export default {
    name: 'LoginView',
    computed: {
        ...mapGetters(['device']),
    },
    data() {
        return {
            possibleLogin: false,
            loginMessage: '아이디와 패스워드를 입력해주세요.',
        };
    },
    methods: {
        checkPossibleLogin() {
            const id_length = this.$refs.userNameInput.value.length;
            const pwd_length = this.$refs.passWordeInput.value.length;
            this.possibleLogin = false;

            if (id_length === 0 || id_length < 6) {
                this.loginMessage = '아이디를 입력해주세요.';
            } else if (pwd_length === 0 || pwd_length < 8) {
                this.loginMessage = '패스워드를 입력해주세요.';
            } else {
                this.possibleLogin = true;
                this.loginMessage = '';
            }
        },
        async login() {
            if (!this.possibleLogin || this.loginMessage.length !== 0) {
                this.$store.commit('setToastMessage', this.loginMessage);
                this.$store.commit('showToast');
                return;
            }

            this.loginMessage = '로그인 중입니다.';

            const email = this.$refs.userNameInput.value;
            const pwd = this.$refs.passWordeInput.value;

            try {
                const result = (await axios.post(`/service/login`, { email, pwd, device: this.device })).data;

                if (result.code === 200) {
                    localStorage.setItem(`access-token-${email}`, result.token);
                    localStorage.setItem(`refresh-token-${email}`, result.index);
                    localStorage.setItem('current-email', email);

                    await setLoginData(result);
                    await socketConnect('/idle');

                    await this.$router.replace({ path: '/friends' });

                    const mySetting = result.mySetting;
                    if (mySetting && mySetting.notification) {
                        setTimeout(() => {
                            this.requestNotificationPermission();
                        }, 1000);
                    }
                } else {
                    this.$store.commit('setToastMessage', result.message);
                    this.$store.commit('showToast');
                }
            } catch (error) {
                console.log(error);
                this.$store.commit('setToastMessage', error || '네트워크에 연결해주세요.');
                this.$store.commit('showToast');
            } finally {
                this.loginMessage = '';
            }
        },
        moveSignUpPage() {
            this.$router.push({ path: '/sign-up' });
        },
        requestNotificationPermission() {
            // 먼저 브라우저가 Notification API를 지원하는지 확인
            if ('Notification' in window) {
                // 이미 알림 권한이 허용되었는지 확인
                if (Notification.permission === 'granted') {
                    this.$store.dispatch('toggleMySettingNotification', true);
                } else {
                    // 알림 권한이 거부되었거나 이전에 요청이 없는 경우, 권한을 요청
                    const store = this.$store;
                    Notification.requestPermission().then(function (permission) {
                        if (permission === 'granted') {
                            store.dispatch('toggleMySettingNotification', true);
                        } else if (permission === 'denied') {
                            store.commit('TOGGLE_MY_SETTING', { key: 'notification', value: false });
                            // alert('알람 설정을 허용으로 변경해주세요.');
                        }
                    });
                }
            } else {
                console.log('이 브라우저는 Notification API를 지원하지 않습니다.');
            }
        },
    },
};
</script>

<style scoped>
.main-color-5 {
    color: #3366ff;
}
.login-container .el-input input {
    background: transparent;
    border: 0px;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    color: #000;
    width: 100%;
    height: 47px;
}
.login-container .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    color: #454545;
}

.el-form-item__content {
    line-height: 40px;
    position: relative;
    font-size: 14px;
}
.login-container[data-v-37dfd6fc] {
    min-height: 100%;
    width: 100%;
    /* background-color: #2d3a4b; */
    overflow: hidden;
}
.login-container .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 0 35px 0;
    margin: 0 auto;
    overflow: hidden;
}
.login-container .tips {
    font-size: 14px;
    color: #000;
    margin-bottom: 10px;
}
.login-container .tips span:first-of-type {
    margin-right: 16px;
}
.login-container .title-container {
    position: relative;
}
.login-container .title-container .title {
    font-size: 26px;
    color: #000;
    /* color: #eee; */
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
}
.login-container .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.login-container .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
}
@media only screen and (max-width: 470px) {
    .login-container .thirdparty-button {
        display: none;
    }
}
</style>
