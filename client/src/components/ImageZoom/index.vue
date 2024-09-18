<template>
    <div v-swiper>
        <button
            type="button"
            ref="zoomImageButton"
            class="btn btn-primary btn-img-zoom d-none"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
        >
            Launch demo modal
        </button>

        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <button
                type="button"
                ref="modal_close"
                class="position-absolute btn-close bg-white text-white"
                data-bs-dismiss="modal"
                aria-label="Close"
                style="left: 0; width: 22px; height: 22px; z-index: 1056;"
            ></button>
            <div class="modal-dialog modal-dialog-centered w-100" style="margin: 0; max-width: none !important;">
                <div class="modal-content position-relative">
                    <div style="max-width: 100vw; max-height: 100vh">
                        <img :src="imgSrc" ref="zoomed_img" class="zoomed-img" alt="Image Preview" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'ImageZoom',
    computed: {
        ...mapGetters(['zoomImageSrc']),
    },
    data() {
        return {
            imgSrc: '',
        };
    },
    mounted() {
        this.$refs.zoomed_img.addEventListener('contextmenu', function (event) {
            // 이벤트 기본 동작 실행 (브라우저의 기본 컨텍스트 메뉴 띄우기)
            event.stopPropagation();
        });
    },
    watch: {
        zoomImageSrc(newValue) {
            if (newValue === '') return;
            this.imgSrc = newValue;
            this.$store.commit('SET_ZOOM_IMAGE_SRC', '');
            this.$refs.zoomImageButton.click();
        },
        imgSrc(newValue) {
            if (newValue === '') return;
        },
    },
    beforeUnmount() {
        const backDrop = document.getElementsByClassName('modal-backdrop')[0];
        if (backDrop) backDrop.parentNode.removeChild(backDrop);
    },
    directives: {
        swiper: {
            mounted(element, binding) {
                let startTy;

                function toFit(cb, { dismissCondition = () => false, triggerCondition = () => true }) {
                    if (!cb) return console.log('Invalid required arguments');

                    let tick = false;

                    return function (e) {
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
                                tick = false;
                                return cb(e);
                            }
                        });
                    };
                }

                function touchstartHandler(e) {
                    const touches = e.touches[0];
                    startTy = touches.clientY;
                }

                function touchendHandler(e) {
                    e.stopPropagation();

                    const touches = e.changedTouches[0],
                        endTy = touches.clientY,
                        distanceY = startTy - endTy;

                    if (Math.abs(distanceY) < 100) return;
                    if (!binding.instance.$refs.modal_close) return;

                    binding.instance.$refs.modal_close.click();
                }

                const touchstartListener = (e) => {
                    touchstartHandler(e);
                };

                element.addEventListener('touchstart', toFit(touchstartListener, {}), { passive: true });
                element.addEventListener('touchend', touchendHandler, { passive: true });

                // 컴포넌트가 파기될 때 이벤트 리스너 제거
                element.addEventListener('beforeDestroy', () => {
                    element.removeEventListener('touchstart', toFit(touchstartListener, {}));
                    element.removeEventListener('touchend', touchendHandler);
                });
            },
        },
    },
};
</script>

<style>
.modal .modal-dialog * {
    touch-action: auto !important;
}
.modal-content {
    /* width: 100vw; */
    /* height: 100vh; */
    background-color: unset !important;
    border: none !important;
}

.zoomed-img {
    max-width: 100vw;
    max-height: 100vh;
    object-fit: contain;
    pointer-events: auto !important;
    touch-action: auto !important;
}

.modal-backdrop {
    opacity: 1 !important;
}

.fade {
    /* transition: none !important; */
    /* transition: transform .3s ease-out !important;
    transform: translate(0) !important; */
}

.modal.fade .modal-dialog {
    /* transition: none !important; */
    /* transition: transform .1s ease-out !important;
    transform: translate(0) !important; */
}
</style>