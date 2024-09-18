<template>
    <div class="app-wrapper">
        <div class="sub-container">
            <div>
                <top-navigation-bar />
            </div>
            <div class="app-main">
                <div class="w-100 px-4">
                    <div class="pt-4">
                        <text-input :value="friendname ? friendname : nickname" :placeholder="nickname"/>
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

export default {
    name: 'OtherNickNameEdit',
    components: {
        TopNavigationBar,
        BottomNavigationBar,
        TextInput,
        // SearchFriends,
    },
    computed: {
        nickname() {
            return this.$route.query.nickname;
        },
        friendname() {
            return this.$route.query.friend_name;
        }
    },
};
</script>
  
<style scoped></style>
    