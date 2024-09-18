import { createRouter, createWebHistory } from 'vue-router';

// import VueCookies from 'vue-cookies'
import store from '@/store'
import { socketConnect } from "@/utils/socket.js";
import axios from "@/utils/axios.js";

// import { refreshToken } from '@/services/login'


/* Layout */
// import BaseLayout from '@/layout'
import LoginView from '@/views/login';
import SignUp from '@/views/login/sign-up';
import PrivacyPolicy from '@/views/legal-docs/privacy-policy';
import TermsPolicy from '@/views/legal-docs/terms-of-service';

import Chats from '@/views/chats';
import ChatRoom from '@/views/chat-room';
import Frineds from '@/views/friends';
import Blind from '@/views/blind';


import SelectFriends from '@/views/select-friends';
import NewChatRoom from '@/views/chat-room/new';
import UserProfile from '@/views/user-profile';
import OtherNickNameEdit from '@/views/user-profile/OtherNickNameEdit';
import ChatRoomMenu from '@/views/menus/ChatRoomMenu';



import SearchUser from '@/views/search-user';
import BlockList from '@/views/block/BlockList';
import MySetting from '@/views/settings/MySetting';
import ProfileEdit from '@/views/user-profile/ProfileEdit';
import ProfileEditNickname from '@/views/user-profile/ProfileEditNickname';
import ProfileEditStatusMessage from '@/views/user-profile/ProfileEditStatusMessage';

// import UserProfile from '@/views/';
// import UserProfile from '@/views/';


/* Config */
import routeInfo from './route-info';
import { setLoginData, checkLoginData, reLogin } from '@/utils/login';

// dynamic navbar를 만드는데 여러가지를 고려함.
// 1. vuex를 이용해서 임의의 view에 닿을 때마다 각 view에서 자신과 대응하는 navbar 모양을 commit.
// 2. 모든 route에 meta data를 삽입한다.
// 3. navabar component에 각 path에 대응하는 navbar 모양을 저장하고 route가 변경될 때마다 해당 path와 대응하는 navbar를 찾아서 변경한다.

// 1. vuex를 이용하면 기본적으로 모든 view에 commit이 강제되고 유지보수가 어려워짐.
// 3. router를 변경할 때마다 if문으로 대응하는 navbar를 찾아줘야함.
// 2. 모든 route에 meta data를 추가해야 하긴 하지만 한 눈에 볼 수 있어서 유지보수가 용이하다고 판단해 채택

// => meta data는 view가 바뀌어도 navbar가 인식을 못함. 그냥 beforeEach에서 to로 다음에 갈 path를 가져오고
// commit하면 모든 view에서 commit 할 필요가 없음.

const routes = [
    /*
     *
     *  login
     * 
     */
    {
        path: '/login',
        component: LoginView,
        name: 'LoginView',
    },
    {
        path: '/sign-up',
        component: SignUp,
        name: 'SignUp',
    },
    {
        path: '/privacy',
        component: PrivacyPolicy,
        name: 'PrivacyPolicy',
    },
    {
        path: '/terms',
        component: TermsPolicy,
        name: 'TermsPolicy',
    },


    /*
     *
     *  chats
     * 
     */
    {
        path: '/',
        redirect: '/chat'
    },
    {
        path: '/chat',
        component: Chats,
        name: 'ChatView'
    },
    {
        path: '/select-friends',
        name: 'SelectFriends',
        component: SelectFriends,
        meta: { reuse: true },
    },
    {
        path: '/chat-room-new/:uuid',
        name: 'NewChatRoom',
        component: NewChatRoom,
    },
    {
        path: '/chat/room/:uuid',
        name: 'ChatRoom',
        component: ChatRoom,
        meta: { reuse: true },
    },
    {
        path: '/profile/:id',
        name: 'UserProfile',
        component: UserProfile,
    },
    {
        path: '/profile/:id/edit-name',
        name: 'OtherNickNameEdit',
        component: OtherNickNameEdit,
    },
    {
        path: '/chat-room-menu/:uuid',
        name: 'ChatRoomMenu',
        component: ChatRoomMenu,
    },
    {
        path: '/report',
        name: 'UserReport',
        component: () => import('@/views/report'),
    },
    {
        path: '/public',
        redirect: '/chat'
    },
    {
        path: '/public/room/:uuid',
        name: 'PublicRoom',
        component: () => import('@/views/chat-room/public'),
        meta: { reuse: true },
    },
    {
        path: '/public-setting',
        name: 'PublicRoomSetting',
        component: () => import('@/views/settings/public/PublicRoomSetting'),
        meta: { reuse: true },
    },
    {
        path: '/public-setting/name',
        name: 'PublicRoomSettingName',
        component: () => import('@/views/settings/public/PublicRoomSettingName'),
        meta: { reuse: true },
    },
    {
        path: '/public-setting/block-word',
        name: 'PublicRoomBlockWord',
        component: () => import('@/views/settings/public/PublicRoomBlockWord'),
        meta: { reuse: true },
    },




    /*
     *
     *  friends
     *
     *
     */
    {
        path: '/friends',
        component: Frineds,
        name: 'FriendView'
    },
    {
        path: '/search-user',
        name: 'SearchUser',
        component: SearchUser,
        meta: { reuse: true },
    },
    {
        path: '/block-list',
        name: 'BlockList',
        component: BlockList,
        meta: { reuse: true },
    },
    {
        path: '/my-setting',
        name: 'MySetting',
        component: MySetting,
        meta: { reuse: true },
    },
    // {
    //     path: '/my-setting/name',
    //     name: 'MySettingEmail',
    //     component: () => import('@/views/settings/MySettingEmail'),
    //     meta: { reuse: true },
    // },
    {
        path: '/profile-edit',
        name: 'ProfileEdit',
        component: ProfileEdit,
        meta: { reuse: true },
    },
    {
        path: '/profile-edit/nickname',
        name: 'ProfileEditNickname',
        component: ProfileEditNickname,
        meta: { reuse: true },
    },
    {
        path: '/profile-edit/status-message',
        name: 'ProfileEditStatusMessage',
        component: ProfileEditStatusMessage,
        meta: { reuse: true },
    },




    /*
     *
     *  blind
     *
     *
     */
    {
        path: '/blind',
        name: 'BlindChat',
        component: Blind,
        meta: { reuse: true },
    },
    {
        path: '/letter/:uuid',
        redirect: to => {
            return `/public/room/${to.params.uuid}`;
        }
    },

    {
        path: '/:path(.*)',
        redirect: '/login'
    }
]


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

router.beforeEach(async (to, from, next) => {
    const currentRouteInfo = routeInfo[to.name];

    if (currentRouteInfo) store.dispatch('changeNavigationBar', currentRouteInfo);
    // bottom icon acitve
    if (to.fullPath == '/friends' || to.fullPath == '/chat') store.commit('setBottomActive', to.fullPath)

    // if (to.fullPath.split('/')[1] === 'public') {
    //     await socketConnect('/idle');
    //     return next();
    // }

    if (to.fullPath == '/login' || to.fullPath == '/sign-up' || to.fullPath == '/privacy' || to.fullPath == '/terms') return next();


    const currentEmail = localStorage.getItem('current-email');
    const accessToken = localStorage.getItem(`access-token-${currentEmail}`);
    const refreshToken = localStorage.getItem(`refresh-token-${currentEmail}`);


    // 편지함은 로그인 하지 않아도 가능
    if (!(currentEmail && accessToken && refreshToken)) {
        if (to.fullPath.split('/')[1] === 'public') {
            await socketConnect('/idle');

            return next();
        }
        else {
            reLogin();
            return next();
        }
    }

    // 스토어에 초기 데이터가 있으면 라우터로 이동
    if (store.getters.myInfo && Object.keys(store.getters.myInfo).length !== 0) return next();

    // 로컬에 초기 데이터 있으면 가져오기
    const checkedLoginData = await checkLoginData();

    // 로컬 데이터가 없으면 서버에서 데이터를 가져옴
    const hasLoginData = Object.values(checkedLoginData).includes(false);

    // 초기 데이터가 없으면 전부 서버에서 가져옴
    if (hasLoginData) {
        try {
            const result = (await axios.get('/init')).data;

            setLoginData(result);
        } catch (error) {
            console.error(error);
            reLogin();
        } finally {
            await socketConnect('/idle');
        }
    } else {
        // 초기 데이터가 있으면 친구 목록과 마지막 채팅방 메시지만 새로고침함
        try {
            const result = (await axios.get('/init-part')).data;
            store.dispatch('initializeMyPublicInfo', result.publicInfo);
            store.dispatch('initializeFriendsList', result.friendsList);
            store.commit('PUSH_CHAT_ROOM_LIST', result.chatRoomList);

            localStorage.setItem(`publicInfo-${currentEmail}`, JSON.stringify(result.publicInfo));
            localStorage.setItem(`friendsList-${currentEmail}`, JSON.stringify(result.friendsList));
            localStorage.setItem(`chatRoomList-${currentEmail}`, JSON.stringify(result.chatRoomList));
        } catch (error) {
            console.error(error);
            const ck1 = localStorage.getItem(`publicInfo-${currentEmail}`);
            const ck2 = localStorage.getItem(`friendsList-${currentEmail}`);
            const ck3 = localStorage.getItem(`chatRoomList-${currentEmail}`);
            if (ck1 && ck2 && ck3) {
                const pi = JSON.parse(localStorage.getItem(`publicInfo-${currentEmail}`));
                const fl = JSON.parse(localStorage.getItem(`friendsList-${currentEmail}`));
                const cr = JSON.parse(localStorage.getItem(`chatRoomList-${currentEmail}`));

                store.dispatch('initializeMyPublicInfo', pi);
                store.dispatch('initializeFriendsList', fl);
                store.commit('PUSH_CHAT_ROOM_LIST', cr);
            } else {
                reLogin();
            }
        } finally {
            await socketConnect('/idle');
        }
    }
    return next();
});

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
//     } else {
//       // determine whether the user has obtained his permission roles through getInfo
//       const hasRoles = store.getters.roles && store.getters.roles.length > 0
//       if (hasRoles) {
//         next()
//       } else {
//         try {
//           // get user info
//           // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
//           const { roles } = await store.dispatch('user/getInfo')

//           // generate accessible routes map based on roles
//           const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

//           // dynamically add accessible routes
//           router.addRoutes(accessRoutes)

//           // hack method to ensure that addRoutes is complete
//           // set the replace: true, so the navigation will not leave a history record
//           next({ ...to, replace: true })
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })


export default router
