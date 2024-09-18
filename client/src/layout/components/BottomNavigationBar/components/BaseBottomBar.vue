<template>
    <nav class="bottom-navigation">
        <div class="d-flex h-100 align-items-center justify-content-between">
            <div v-for="(item, index) in items" :key="index" :class="[alignmentCenterStyle]">
                <icon-route-navigation :option="{ ...item, color: bottomActive == item.path ? '#254EDB' : '#000' }" />
            </div>
        </div>
    </nav>
</template>
  
<script>
import IconRouteNavigation from '@/components/IconRouteNavigation';
import { mapGetters } from 'vuex';

export default {
    name: 'BaseBottomBar',
    components: {
        IconRouteNavigation,
    },
    data() {
        return {
            items: [
                { icon: 'home', path: '/friends', fontSize: '25px', color: '#000', opacity: '100%' },
                { icon: 'chat', path: '/chat', fontSize: '23px', color: '#000', opacity: '100%' },
                { icon: 'blind', path: '/blind', fontSize: '23px', color: '#000', opacity: '100%' },
            ],
        };
    },
    computed: {
        ...mapGetters(['bottomActive']),
        alignmentCenterStyle() {
            return `w-100 h-100 d-flex justify-content-center align-items-center`;
        },
    },
};
</script>
  
<style scoped>
nav {
    height: 50px;
    border-top: 0.1px solid #c8cdd6;
}
.router-link-active {
    color: #3366ff !important;
}
</style>
  