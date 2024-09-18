<template>
    <div class="d-flex align-items-center">
        <!-- {{ option }} -->
        <div class="multi-header" v-for="(item, index) in option.headers" :key="index">
            <component v-if="item" :is="item.type" :option="item" />
        </div>
    </div>
</template>
  
<script>
import HeaderTitle from '@/components/HeaderTitle';
import IconRouteNavigation from '@/components/IconRouteNavigation';
import ActionElement from '@/components/ActionElement';
import ActionIcon from '@/components/ActionIcon';
import HeaderDropDown from '@/components/HeaderDropDown';

export default {
    name: 'TopNavigationBar',
    components: {
        HeaderTitle,
        IconRouteNavigation,
        ActionElement,
        ActionIcon,
        HeaderDropDown,
    },
    props: {
        option: {
            type: Object,
            default: () => {
                return {
                    headers: [],
                };
            },
        },
    },
    computed: {
        marginLeft() {
            return this.option.marginLeft || '15px';
        },
    },
};
</script>
  
<style scoped>
.multi-header + .multi-header {
    margin-left: 15px;
}
</style>
  