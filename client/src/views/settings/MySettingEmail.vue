<template>
    <div class="app-wrapper">
        <div class="sub-container">
            <div>
                <top-navigation-bar />
            </div>
            <div class="app-main">
                <div class="w-100 px-4">
                    <div class="pt-4">
                        <text-input :value="myEmail" :information="'아이디 변경은 한 달에 한 번만 가능합니다.'"/>
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
import TextInput from '@/components/TextInput';

import { mapGetters } from 'vuex';

export default {
    name: 'MySettingEmail',
    components: {
        TopNavigationBar,
        BottomNavigationBar,
        TextInput,
        // SearchFriends,
    },
    computed: {
        ...mapGetters(['myInfo']),

        myEmail() {
            return this.myInfo.email;
        },
    },
};
</script>
  
<style scoped></style>
    