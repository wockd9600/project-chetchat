// import store from '@/store'

// const { body } = document
// const WIDTH = 992 // 부트스트랩의 반응형 디자인을 참고

// export default {
//     watch: {
//         // $route 객체를 감시하여 라우터 변경 감지
//         $route(route) {
//             // 모바일 화면에서 사이드바가 열려 있는 경우, 라우터가 변경되면 사이드바를 닫는다.
//             if (this.device === 'mobile' && this.sidebar.opened) {
//                 store.dispatch('app/closeSideBar', { withoutAnimation: false })
//             }
//         }
//     },
//     beforeMount() {
//         // Vue 컴포넌트가 마운트되기 전에 창 크기 변경 이벤트 리스너를 등록
//         window.addEventListener('resize', this.$_resizeHandler)
//     },
//     beforeDestroy() {
//         // Vue 컴포넌트가 소멸되기 전에 이벤트 리스너를 제거
//         window.removeEventListener('resize', this.$_resizeHandler)
//     },
//     mounted() {
//         // 컴포넌트가 마운트된 후, 현재 화면 크기를 확인하고 모바일인 경우 처리
//         const isMobile = this.$_isMobile()
//         if (isMobile) {
//             // 모바일 디바이스인 경우, Vuex store를 사용하여 애플리케이션 상태를 업데이트
//             store.dispatch('app/toggleDevice', 'mobile')
//             store.dispatch('app/closeSideBar', { withoutAnimation: true })
//         }
//     },
//     methods: {
//         // 믹스인 내의 메서드들은 $_ 접두사를 사용하여 private 메서드임을 나타냄
//         // Vue 스타일 가이드 권장 사항을 따름
//         // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
//         $_isMobile() {
//             // body 요소의 너비를 기준으로 현재 디바이스가 모바일인지 여부를 판단
//             const rect = body.getBoundingClientRect()
//             return rect.width - 1 < WIDTH
//         },
//         $_resizeHandler() {
//             if (!document.hidden) {
//                 // 창 크기 변경 이벤트 핸들러, 화면 크기가 변경되면 실행
//                 const isMobile = this.$_isMobile()
//                 // 화면 크기에 따라 Vuex store를 통해 애플리케이션 장치 모드를 변경
//                 store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

//                 if (isMobile) {
//                     // 모바일 화면인 경우, 사이드바를 자동으로 닫음
//                     store.dispatch('app/closeSideBar', { withoutAnimation: true })
//                 }
//             }
//         }
//     }
// }
