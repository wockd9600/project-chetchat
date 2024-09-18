<template>
    <div class="app-wrapper">
        <div class="sub-container">
            <div>
                <top-navigation-bar />
            </div>
            <div class="app-main">
                <div class="d-flex w-100 h-100 justify-content-center align-items-center">
                    <div>
                        <ul>
                            <li class="d-flex p-3">
                                <div class="pe-2">
                                    <base-icon :icon="'bell'" :fontSize="'26px'" />
                                </div>
                                <div class="w-100 fs-18 fw-bold">알림 끄기</div>
                            </li>
                            <li class="d-flex p-3" @click="moveReportPage">
                                <div class="pe-2">
                                    <base-icon :icon="'flag'" :fontSize="'26px'" />
                                </div>
                                <div class="w-100 fs-18 fw-bold">신고하기</div>
                            </li>
                            <li class="d-flex p-3">
                                <div class="pe-2">
                                    <base-icon :icon="'ban'" :fontSize="'23px'" />
                                </div>
                                <div class="w-100 fs-18 fw-bold">차단하기</div>
                            </li>
                            <li class="d-flex p-3">
                                <div class="pe-1">
                                    <base-icon :icon="'leave'" :fontSize="'25px'" />
                                </div>
                                <div class="w-100 fs-18 fw-bold">나가기</div>
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
import BaseIcon from '@/components/BaseIcon';
// import SearchFriends from '@/components/SearchFriends';

export default {
    name: 'ChatRoomMenu',
    components: {
        TopNavigationBar,
        BottomNavigationBar,
        BaseIcon,
        // SearchFriends,
    },
    mounted() {
        // if (this.chatRoomList[this.currentRoomUUID]) {
        //     this.$store.commit('setChatRoomName', this.chatRoomList[this.currentRoomUUID].user_name);
        //     this.$store.dispatch('readMessage');
        // } else {
        //     this.$store.commit('setChatRoomName', Object.values(this.selectedFrinedsForNewChat)[0].nickname);
        // }
    },
    methods: {
        moveReportPage() {
            const dom = document.querySelector('.sub-page.third');
            dom.classList.add('close');

            setTimeout(() => {
                this.$router.push({ path: '/report' });
            }, 500);
        },
    },
};
</script>
  
<style scoped>
.close {
    transition: transform 0.3s;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
}
</style>
    