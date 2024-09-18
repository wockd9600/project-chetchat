import { mapGetters } from 'vuex';
import axios from '@/utils/axios';

export default {
    computed: {
        ...mapGetters(['device', 'reply_uuid', 'currentScollPosition']),
        replyInfo() {
            return {
                reply_name: this.replyName,
                reply_content: this.replyContent,
            }
        }
    },
    data() {
        return {
            touchmoveHandler: null,

            currentMessage: '',
            replyName: '',
            replyContent: '',

            viewportHeight: 0,
            keyboardHeight: 0,

            openKeyboardScrollHeight: 0,
            isDelaycurrentScrollPosition: false,

            safeAreaValue: 0,
            // dd: 'sad',
        };
    },
    watch: {
        currentMessage: 'textareaResize',
    },
    mounted() {
        this.viewportHeight = window.innerHeight;
        visualViewport.addEventListener('resize', this.changecurrentAppMainHeight);
    },
    methods: {
        toFit(cb, { dismissCondition = () => false, triggerCondition = () => true }) {
            if (!cb) return;

            let tick = false;

            return function (e) {
                // console.log('scroll call')

                if (tick) {
                    return;
                }

                tick = true;
                return requestAnimationFrame(() => {
                    if (dismissCondition()) {
                        tick = false;
                        return;
                    }

                    if (triggerCondition()) {
                        // console.log('real call')
                        tick = false;
                        return cb(e);
                    }
                });
            };
        },
        async changecurrentAppMainHeight() {
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                const bottomDom = document.getElementsByClassName('bottom-navigation')[0];
                const appMain = document.getElementsByClassName('app-main')[0];
                if (!bottomDom || !appMain) return;

                if (this.isOpendKeyboardBox()) {
                    bottomDom.style.marginBottom = 0 + 'px';
                    appMain.style.paddingBottom = 0 + 'px';
                } else {
                    const safeAreaInsetBottom = getComputedStyle(document.documentElement).getPropertyValue("--sab");
                    bottomDom.style.marginBottom = safeAreaInsetBottom;
                    appMain.style.paddingBottom = safeAreaInsetBottom;
                }
            }
            // const isAndroid = /Android/.test(navigator.userAgent);
            // if (!isAndroid) return;

            // window.scrollTo(0, 0);
            // await new Promise(resolve => setTimeout(resolve, 0)); // 비동기 처리

            // let documentHeight = document.documentElement.clientHeight;
            // let viewportHeight = window.visualViewport.height;
            // let keyboardHeight = documentHeight - viewportHeight + 1;

            // const dom = document.getElementsByClassName('bottom-navigation')[0];
            // dom.style.bottom = keyboardHeight + 'px';

            // const dom = document.getElementsByClassName('chat-box')[0]
            // const newViewportHeight = window.innerHeight;
            // const keyboardHeight = Math.abs(this.viewportHeight - newViewportHeight);

            // if (keyboardHeight > 0) this.keyboardHeight = keyboardHeight;

            // // open keyboard
            // const isKeyboardOpen = this.viewportHeight > newViewportHeight;
            // if (isKeyboardOpen) {
            //     this.$store.commit('SET_CURRENT_SCROLL_POSITION', dom.scrollTop + keyboardHeight);
            //     this.openKeyboardScrollHeight = dom.scrollHeight - (this.viewportHeight - keyboardHeight - 100);

            //     dom.scrollTo(0, dom.scrollTop + keyboardHeight);
            // } else {
            //     // closed keyboard
            //     const scrollDistance = this.openKeyboardScrollHeight - this.currentScollPosition
            //     dom.scrollTo({ top: dom.scrollTop - (this.currentScollPosition > dom.scrollTop ? scrollDistance : this.keyboardHeight), behavior: 'instant' });
            // }
        },
        isMessageReadyToSend(event) {
            if (this.device == 'mobile' && event.key === 'Enter') return false;
            if (this.device == 'desktop' && event.key === 'Enter' && event.shiftKey) return false;
            if (event.isComposing || event.keyCode === 229) return false;
            if (this.currentMessage.replace(/ /g, '').replace(/(?:\r\n|\r|\n)/g, '') === '') {
                this.focusSendInputIfNecessary();
                return false
            }

            return true
        },
        focusSendInputIfNecessary() {
            if (this.device !== 'mobile' || this.isOpendKeyboardBox()) {
                if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                    const hiddenInp = document.createElement('input');
                    hiddenInp.setAttribute('type', 'text');

                    document.body.prepend(hiddenInp);
                    hiddenInp.focus();
                    hiddenInp.remove();
                }

                this.$refs.sendInput.focus();
            }
        },

        async sendMessage(disaptchName, data) {
            if (!this.isMessageReadyToSend(event)) return;
            event.preventDefault();
            // this.$refs.replyInfo.style.transition = '0s';

            // console.log(disaptchName, data)
            this.$store.dispatch(disaptchName, data);

            this.focusSendInputIfNecessary();
            this.currentMessage = '';
            this.textareaResize();

            const dom = document.getElementsByClassName('chat-box')[0];
            this.$store.commit('SET_CURRENT_SCROLL_POSITION', dom.scrollTop);
        },

        async uploadImage(files, name) {
            if (files.length < 1) return;

            let file = files[0];
            const maxSizeKB = 100;
            const type = file.type.split('/')[0]

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

                const { url, message_type } = response.data;

                await this.$store.dispatch(name, {
                    file_url: url,
                    message_type,
                    room_uuid: this.$route.path.split('/').slice(-1)[0],
                });
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

        textareaResize() {
            const element = this.$refs.sendInput;
            // if (element.style.height == element.scrollHeight + 'px') return;

            this.$nextTick(() => {
                element.style.height = 'auto';
                element.style.height = element.scrollHeight + 'px';
                // 높이 보고 채팅창 높이도 올리기


                const appMain = document.getElementsByClassName('app-main')[0];
                const paddingBottom = parseInt(appMain.style.paddingBottom.replace('px', '')) || 0;
                const changeHeight = this.$refs.botnav.clientHeight - 50;

                if (paddingBottom === changeHeight) return;

                appMain.style.paddingBottom = changeHeight + 'px'

                const moveScroll = paddingBottom > changeHeight ? changeHeight : -changeHeight;
                const dom = document.getElementsByClassName('chat-box')[0];
                setTimeout(() => { dom.scrollTo({ top: dom.scrollTop - moveScroll, behavior: 'instant' }) }, 0);
            });
        },
        isOpendKeyboardBox() {
            const isAndroid = /Android/.test(navigator.userAgent);
            if (isAndroid) {
                let documentHeight = document.documentElement.clientHeight;
                let viewportHeight = window.visualViewport.height;
                let keyboardHeight = documentHeight - viewportHeight + 1;
                if (keyboardHeight > 5) return true;
            } else {
                if (document.documentElement.clientHeight !== window.visualViewport.height) return true;
            }

            return false;
        },
    },
    beforeUnmount() {
        visualViewport.removeEventListener('resize', this.changecurrentAppMainHeight);
        this.$store.commit('setReplyUuid', null);
    },
}
