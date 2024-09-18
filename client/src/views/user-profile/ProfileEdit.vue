<template>
    <div class="app-wrapper">
        <div class="sub-container">
            <div>
                <top-navigation-bar />
            </div>
            <div class="app-main">
                <div>
                    <div class="w-100">
                        <div
                            class="position-relative d-flex mt-5 mb-5 justify-content-center"
                            @click="clickImageUploadInput"
                        >
                            <profile-image class="cp" :size="'100px'" :profile_img="myInfo.profile_img" />
                            <div class="camera-posiiton">
                                <base-icon :icon="'camera'" :fontSize="'20px'" :color="'#000'" />
                                <input
                                    type="file"
                                    ref="profileImageUploadInput"
                                    accept="image/*"
                                    style="display: none"
                                    @change="uploadImage($event.target.files)"
                                />
                            </div>
                        </div>

                        <ul class="fs-18">
                            <li
                                class="d-flex p-3 justify-content-between click-effect"
                                @click="moveRoute(0)"
                            >
                                <div>별명</div>
                                <div class="grey2">{{ myInfo.nickname }}</div>
                            </li>
                            <li
                                class="d-flex p-3 justify-content-between click-effect"
                                @click="moveRoute(1)"
                            >
                                <div>상태메시지</div>
                                <div class="grey2">{{ myInfo.status_message }}</div>
                            </li>
                            <!-- <li class="d-flex pt-2 pb-2 justify-content-between">
                                <div>웹사이트</div>
                                <div class="grey2">웹사이트를 추가하세요.</div>
                            </li> -->
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
import BaseIcon from '@/components/BaseIcon';
import ProfileImage from '@/components/ProfileImage';

import { mapGetters } from 'vuex';

import axios from '@/utils/axios';

export default {
    name: 'ProfileEdit',
    components: {
        TopNavigationBar,
        BottomNavigationBar,
        BaseIcon,
        ProfileImage,
        // SearchFriends,
    },
    computed: {
        ...mapGetters(['myInfo']),
    },
    data() {
        return {
            allowOneToOneChat: true,
        };
    },
    methods: {
        clickImageUploadInput() {
            this.$refs.profileImageUploadInput.click();
        },
        changeAllowOneToOneChat() {
            this.allowOneToOneChat = !this.allowOneToOneChat;
        },
        async uploadImage(files) {
            if (files.length < 1) return;

            let file = files[0];
            const maxSizeKB = 100;
            const type = file.type.split('/')[0];

            if (type === 'image' && file.size > maxSizeKB * 1024) {
                file = await this.compressImage(file);
            }

            if (file.size > maxSizeKB / 10 * 1024 * 1024) {
                alert('파일의 용량이 너무 큽니다.');
            }


            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post('/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.data.error) return;

                const { url } = response.data;

                this.$store.dispatch('toggleMyProfile', { key: 'image_url', value: url });
            } catch (error) {
                // 이미지 삭제 요청
                console.error('Error uploading file:', error);
            }
        },

        compressImage(file) {
            return new Promise((resolve) => {
                const reader = new FileReader();

                reader.onload = function (event) {
                    const img = new Image();
                    img.src = event.target.result;

                    img.onload = function () {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const maxSize = 1280; // 원하는 최대 너비

                        let newWidth = img.width;
                        let newHeight = img.height;

                        if (newWidth > newHeight) {
                            if (newWidth > maxSize) {
                                newWidth = maxSize;
                                newHeight = (img.height * maxSize) / img.width;
                            }
                        } else {
                            if (newHeight > maxSize) {
                                newHeight = maxSize;
                                newWidth = (img.width * maxSize) / img.height;
                              }
                        }

                        canvas.width = newWidth;
                        canvas.height = newHeight;

                        ctx.drawImage(img, 0, 0, newWidth, newHeight);

                        canvas.toBlob((blob) => {
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg', // 원하는 파일 형식으로 설정
                                lastModified: Date.now(),
                            });

                            resolve(compressedFile);
                        }, 'image/jpeg'); // 원하는 파일 형식으로 설정
                    };
                };

                reader.readAsDataURL(file);
            });
        },
        
        moveRoute(index) {
            const paths = ['/profile-edit/nickname', '/profile-edit/status-message'];
            this.$router.push({ path: paths[index] });
        },
    },
};
</script>
  
<style scoped>
.profile-img {
    width: 100px;
    height: 100px;
    background-color: #adc8ff;
    border-radius: 50%;
}
.camera-posiiton {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 50%;
    width: 30px;
    height: 30px;
    transform: translateX(-50%);
    margin-left: 35px;
    bottom: 0;
    border-radius: 50%;
    background-color: #fff;
    border: 1px solid #fff;
}
.bg-setting {
    width: 25px;
    height: 25px;
    border: 1px solid #afafaf;
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
    