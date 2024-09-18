<template>
    <div class="app-wrapper">
        <div class="sub-container">
            <div>
                <top-navigation-bar />
            </div>
            <div class="app-main">
                <div class="w-100 px-4">
                    <div class="pt-4">
                        <text-input :value="statusMessage"/>
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
    name: 'ProfileEditStatusMessage',
    components: {
        TopNavigationBar,
        BottomNavigationBar,
        TextInput,
        // SearchFriends,
    },
    computed: {
        ...mapGetters(['myInfo']),

        statusMessage() {
            return this.myInfo.status_message;
        },
    },
};
</script>
  
<style scoped></style>
    