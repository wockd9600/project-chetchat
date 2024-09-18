<template>
    <div class="app-wrapper">
        <div class="sub-container">
            <div>
                <top-navigation-bar />
            </div>
            <filter-friends style="height: calc(100vh - 50px)"/>
            <div>
                <bottom-navigation-bar />
            </div>
        </div>
    </div>
</template>
  
<script>
import TopNavigationBar from '@/layout/components/TopNavigationBar';
import BottomNavigationBar from '@/layout/components/BottomNavigationBar';
import FilterFriends from '@/components/FilterFriends';

export default {
    name: 'SelectFriends',
    components: {
        TopNavigationBar,
        BottomNavigationBar,
        FilterFriends,
    },
};
</script>
  
<style scoped></style>
    