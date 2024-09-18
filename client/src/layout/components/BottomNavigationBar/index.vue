<template>
    <!-- <nav class="position-relative" ref="footer"> -->
        <div class="bottom-navigation">
            <component :is="bottom"/>

        </div>
    <!-- </nav> -->
</template>
  
<script>
import { mapGetters } from 'vuex';

import BaseBottomBar from './components/BaseBottomBar';
import InputBottomBar from './components/InputBottomBar';
import MatchBottomBar from './components/MatchBottomBar';
import PublicBottomBar from './components/PublicBottomBar';

export default {
    name: 'BottomNavigationBar',
    components: {
        BaseBottomBar,
        InputBottomBar,
        MatchBottomBar,
        PublicBottomBar,
    },
    computed: {
        ...mapGetters(['bottom']),
    },
};
</script>
  
<style scoped>
.bottom-navigation {
    position: fixed;
    bottom: 0;
    z-index: 1000;
    width: 100%;
    /* border-top: 0.1px solid #c8cdd6; */
    margin-bottom: env(safe-area-inset-bottom);
    /* box-shadow: 0 -2px 5px rgba(0, 0, 0, .05); */
    /* padding: 0 0 calc(constant(safe-area-inset-bottom));
    padding: 0 0 calc(env(safe-area-inset-bottom)); */
    /* touch-action: none !important; */
    /* overflow: hidden; */
    overscroll-behavior-y: contain;
}
</style>
  