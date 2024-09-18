<template>
    <div class="app-wrapper">
        <div class="sub-container">
            <div>
                <top-navigation-bar />
            </div>
            <div class="app-main">
                <div class="w-100 px-5">
                    <div class="pt-4">
                        <div class="pb-1 fs-14 text-start">제목</div>
                        <div class="search-bar__box blur-box-color">
                            <input type="text" class="search-bar__input w-100" v-model="title" @input="handleBlur" />
                        </div>
                    </div>
                    <div class="pt-4">
                        <div class="pb-1 fs-14 text-start">내용</div>
                        <div class="search-bar__box blur-box-color" style="height: 300px">
                            <textarea
                                class="search-bar__input w-100 h-100 pt-2 pb-2 border-0"
                                v-model="content"
                                @input="handleBlur"
                            ></textarea>
                        </div>
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
// import BaseIcon from '@/components/BaseIcon';
// import SearchFriends from '@/components/SearchFriends';

export default {
    name: 'UserReport',
    components: {
        TopNavigationBar,
        BottomNavigationBar,
        // BaseIcon,
        // SearchFriends,
    },
    data() {
        return {
            title: '',
            content: '',
            isActive: false,
        };
    },
    methods: {
        handleBlur() {
            if (this.isActive && this.title.length !== 0 && this.content.length !== 0) return;

            if (this.title.length === 0 || this.content.length === 0) this.isActive = false;
            else this.isActive = 'black';

            this.$store.commit('setActionElementActive', this.isActive);
        },
    },
};
</script>
  
<style scoped>
.search-bar__box {
    padding: 0 10px;
    border-radius: 10px;
}
textarea.search-bar__input {
    box-sizing: border-box;
}
</style>
    