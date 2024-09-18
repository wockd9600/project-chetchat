<template>
    <div class="app-wrapper">
        <div class="sub-container">
            <div>
                <top-navigation-bar />
            </div>
            <div class="app-main">
                <div style="overflow-y: scroll;">
                    <div class="w-100">
                        <ul class="fs-18">
                            <li class="d-flex p-3 pb-1 justify-content-between">
                                <div class="pe-2">방문자 수</div>
                                <div class="grey2">{{ totalVisit }}</div>
                            </li>
                            <li class="d-flex p-3 pt-1 justify-content-between">
                                <div class="pe-2">질문 수</div>
                                <div class="grey2">{{ totalQuestion }}</div>
                            </li>
                        </ul>
                    </div>
                    <div class="line mt-2 mb-2 mx-3"></div>
                    <div class="w-100">
                        <div class="pt-2 ps-3 fs-14 grey2 text-start">설정</div>
                        <ul class="fs-18">
                            <li class="d-flex p-3 justify-content-between click-effect" @click="setQuestionRange">
                                <div>질문 허용</div>
                                <div class="grey2">{{ questionRangenText }}</div>
                            </li>
                            <li class="d-flex p-3 justify-content-between align-items-center" @click="setOpenProfile">
                                <div>프로필 공개</div>
                                <div class="el-switch drawer-switch" :class="{ 'is-checked': isOpenProfile }">
                                    <input type="checkbox" v-model="isOpenProfile" class="el-switch__input" />
                                    <div class="el-switch__core" style="width: 50px"></div>
                                </div>
                            </li>
                            <li class="d-flex p-3 justify-content-between click-effect" @click="moveRoute(1)">
                                <div>금지 단어</div>
                            </li>
                        </ul>
                    </div>
                    <div class="line mt-2 mb-2 mx-3"></div>
                    <div class="w-100">
                        <div class="pt-2 ps-3 fs-14 grey2 text-start">설정</div>
                        <ul class="fs-18">
                            <li class="d-flex p-3 justify-content-between click-effect" @click="moveRoute(0)">
                                <div class="me-3">우편함 이름</div>
                                <div class="grey2 flex1 text-end text-truncate" style="max-width: 60%">
                                    {{ publicRoomName }}
                                </div>
                            </li>
                            <li class="d-flex p-3 justify-content-between click-effect" @click="sharePublicRoom">
                                <div class="me-3">우편함 공유하기</div>
                            </li>
                            <!-- <li class="d-flex pt-2 pb-2 justify-content-between align-items-center">
                                <div>편지함 배경화면</div>
                                <div class="bg-setting" @click="loadColorPicker(0)">
                                    <component :is="computedColorPickerComponenet" :color="'#6690FF'" />
                                </div>
                            </li>
                            <li class="d-flex pt-2 pb-2 justify-content-between align-items-center">
                                <div>내 말풍선</div>
                                <div class="bg-setting" @click="loadColorPicker(1)">
                                    <color-picker v-if="loadedColorPicker[1]" :color="'#6690FF'" />
                                </div>
                            </li>
                            <li class="d-flex pt-2 pb-2 justify-content-between align-items-center">
                                <div>익명 말풍선</div>
                                <div class="bg-setting" @click="loadColorPicker(2)" :style="{ backgroundColor: guestBubbleColor }">
                                    <color-picker v-if="loadedColorPicker[2]" :color="'#F5F5F5'" />
                                </div>
                            </li> -->
                        </ul>
                    </div>
                    <div class="line mt-2 mb-2 mx-3"></div>
                    <div class="w-100">
                        <div class="pt-2 ps-3 fs-14 grey2 text-start">관리</div>
                        <ul class="fs-18">
                            <li class="d-flex p-3 justify-content-between click-effect" @click="deleteMessageAll">
                                <div>대화 내용 비우기</div>
                            </li>
                        </ul>
                    </div>
                </div>
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

// import { defineAsyncComponent } from 'vue';
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
    name: 'PublicRoomSetting',
    components: {
        TopNavigationBar,
        BottomNavigationBar,
        // ColorPicker: () => import(`@/components/ColorPicker`),
    },
    computed: {
        ...mapGetters(['publicInfo', 'publicSettingInfo']),

        publicRoomName() {
            return this.publicInfo.name;
        },
        questionRange() {
            return this.publicSettingInfo.question_range;
        },
        isOpenProfile() {
            return this.publicSettingInfo.open_profile;
        },
        totalVisit() {
            return this.visit || 0;
        },
        totalQuestion() {
            return this.total_question || 0;
        },

        questionRangenText() {
            return this.questionRangeOptions[this.questionRange];
        },

        // computedColorPickerComponenet() {
        //     return this.colorPickerComponenet;
        // },
    },
    data() {
        return {
            // loadedColorPicker: [false, false, false],
            // colorPickerComponenet: null,
            done: true,

            questionRangeOptions: ['모두', '로그인한 사람', '친구 추가한 사람', '허용 안함'],
            visit: 0,
            total_question: 0,
        };
    },
    async mounted() {
        try {
            const { success, message, visit, total_question } = (await axios.get(`/public/room/stats`)).data;
            if (success) {
                this.visit = visit;
                this.total_question = total_question;
            } else {
                alert(message);
            }
        } catch (error) {
            alert(error);
        }
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
        // allow question range
        setQuestionRange() {
            if (this.ingSetting()) return;
            const value = (parseInt(this.questionRange) + 1) % this.questionRangeOptions.length;
            this.$store.dispatch('togglePublicSetting', { key: 'question_range', value });
        },

        // is open profile toggle button
        setOpenProfile() {
            if (this.ingSetting()) return;
            if (this.isOpenProfile) {
                this.$store.commit('CLEAR_PROFILE_INFO');
            }
            this.$store.dispatch('togglePublicSetting', { key: 'open_profile', value: !this.isOpenProfile });
        },

        // loadColorPicker(index) {
        //     if (this.colorPickerComponenet) return;
        //     this.colorPickerComponenet = defineAsyncComponent(() => import(`@/components/ColorPicker`));
        //     this.loadedColorPicker[index] = true;
        // },
        sharePublicRoom() {
            if (navigator && navigator.clipboard) {
                navigator.clipboard.writeText(`chetchat.me/letter/${this.publicInfo.room_uuid}`);
                alert('복사되었습니다.');
            }
        },
        moveRoute(index) {
            const paths = ['/public-setting/name', '/public-setting/block-word'];
            this.$router.push({ path: paths[index] });
        },
        deleteMessageAll() {
            if (this.ingSetting()) return;
            this.$store.dispatch('deleteMessageAllInPublicRoom');
        },
    },
};
</script>
  
<style scoped>
.bg-setting {
    width: 25px;
    height: 25px;
    border: 1px solid #afafaf;
    border-radius: 5px;
    overflow: hidden;
    box-sizing: border-box;
}
.el-switch {
    display: flex;
    vertical-align: middle;

    /* display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    position: relative;
    font-size: 14px;
    line-height: 24px;
    width: 50px;
    height: 24px;
    box-sizing: border-box; */
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
    