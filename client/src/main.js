import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import mixin from '@/mixin'

import { FontAwesomeIcon } from './libraries'; // 라이브러리 모듈 가져오기
// import './registerServiceWorker'

import TopNavigationBar from '@/layout/components/TopNavigationBar';
import BottomNavigationBar from '@/layout/components/BottomNavigationBar';

// In your Vue application (main.js or wherever your main app is initialized)
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.addEventListener('message', event => {
//         if (event.data.type === 'fetch-error') {
//             // Commit the Vuex mutation with the error information
//             store.commit('setToastMessage', event.data.error);
//             store.commit('showToast');
//         }
//     });
// }


createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .component('TopNavigationBar', TopNavigationBar)
    .component('BottomNavigationBar', BottomNavigationBar)
    .use(router)
    .mixin(mixin)
    .use(store)
    .mount('#app')

// window.Kakao.init("0cfbf0d886ba5383f9d0b4462f8ac4ab");