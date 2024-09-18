<template>
    <div class="app-wrapper">
        <top-navigation-bar :bgColor="'#fff'" />

        <div class="login-container">
            <form class="el-form login-form el-form--label-left" autocomplete="on">
                <div class="title-container">
                    <h3 class="title">계정 생성</h3>
                </div>
                <div data-v-37dfd6fc="" class="el-form-item is-success is-required el-form-item--medium">
                    <div class="el-form-item__content">
                        <!-- <span data-v-37dfd6fc="" class="svg-container">
                        <svg data-v-c8a70580="" data-v-37dfd6fc="" aria-hidden="true" class="svg-icon">
                            <use data-v-c8a70580="" xlink:href="#icon-user"></use>
                        </svg>
                    </span> -->
                        <div class="el-input message-box-color d-flex">
                            <input
                                ref="userNameInput"
                                tabindex="1"
                                type="text"
                                autocomplete="on"
                                autocapitalize="none"
                                placeholder="Username"
                                name="username"
                                @input="checkPossibleLogin('userNameInput')"
                            />
                            <div v-if="id_length != 0 && id_length < 6" class="d-flex align-items-center">
                                <span class="badge text-bg-danger m-0 me-2">{{ id_length }} / 6</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="mt-2 el-form-item el-tooltip is-success is-required el-form-item--medium"
                    aria-describedby="el-tooltip-8372"
                    tabindex="0"
                >
                    <div class="el-form-item__content">
                        <div class="el-input message-box-color d-flex">
                            <input
                                ref="passWordeInput"
                                tabindex="2"
                                type="password"
                                autocomplete="on"
                                autocapitalize="none"
                                placeholder="Password"
                                name="password"
                                @input="checkPossibleLogin('passWordeInput')"
                            />
                            <div v-if="pw_length != 0 && pw_length < 8" class="d-flex align-items-center">
                                <span class="badge text-bg-danger m-0 me-2">{{ pw_length }} / 8</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <button
                        type="button"
                        class="btn-base w-100 fill"
                        :class="{ 'bg-main-color': possibleLogin }"
                        style="border-radius: 10px; min-width: auto !important"
                        @click="signUp"
                    >
                        회원가입
                    </button>
                </div>
            </form>
        </div>

        <bottom-navigation-bar />
    </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
    name: 'SignUp',
    data() {
        return {
            possibleLogin: false,
            id_length: 0,
            pw_length: 0,
            ingSignUp: false,
        };
    },
    methods: {
        checkPossibleLogin(ref) {
            this.id_length = this.$refs.userNameInput.value.length;
            this.pw_length = this.$refs.passWordeInput.value.length;

            if (this.id_length > 5 && this.pw_length > 7) {
                this.possibleLogin = true;
            } else {
                this.possibleLogin = false;
            }

            let text = this.$refs[ref].value;
            const notPhoneticSymbolExp = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

            if (notPhoneticSymbolExp.test(text)) {
                // 한글이 빠른 시간에 여러개 들어오는 경우도 있으니,한글이 없을 때까지 삭제하고, 검사
                text = text.slice(0, -1);
                let condition = notPhoneticSymbolExp.test(text);
                while (condition) {
                    text = text.slice(0, -1);
                    condition = notPhoneticSymbolExp.test(text);
                }

                this.$refs[ref].value = text;
            }
        },

        async signUp() {
            if (!this.possibleLogin) return;
            if (this.ingSignUp) return;

            const email = this.$refs.userNameInput.value;
            const pwd = this.$refs.passWordeInput.value;

            try {
                this.ingSignUp = true;
                const result = (await axios.post(`/service/signUp`, { email, pwd })).data;

                this.$store.commit('setToastMessage', result.message);
                this.$store.commit('showToast');

                if (result.code === 200) {
                    this.$router.push({ path: '/login' });
                }
            } catch (error) {
                this.$store.commit('setToastMessage', error);
                this.$store.commit('showToast');
            } finally {
                this.ingSignUp = false;
            }
        },
    },
};
</script>

<style scoped >
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