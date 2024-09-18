import { precacheAndRoute } from 'workbox-precaching';
precacheAndRoute(self.__WB_MANIFEST);


const CACHE_NAME = 'version-beta4';

// cache 목록 (자신이 캐싱할 목록을 설정합니다.)
const urlsToCache = [
    // 'index.html',
    // 'favicon.ico',
    // 'js/chunk-vendors.js',
    // 'manifest.json',
    '/login',
    '/friends',
    '/chat',
    '/blind',
    '/:uuid',
    '/chat/room/:uuid',
];

// cache 목록 등록 및 install 시 cache 목록이 다운
self.addEventListener('install', function (event) {
    console.log('install')
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                // console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', async (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then(async (cachedResponse) => {
                const networkFetch = await fetch(event.request)
                    .then(response => {
                        // update the cache with a clone of the network response
                        const responseClone = response.clone()

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseClone)
                            })
                        // }
                        return response
                    })
                    .catch(function (reason) {
                        console.log(reason)
                        return null;
                        // return new Response('알 수 없는 문제입니다. 고객센터에 문의해주세요.\n');
                    });

                if (networkFetch) {
                    return networkFetch
                } else {
                    // return cachedResponse || new Response('An error occurred, check the console for details.');
                    return cachedResponse || new Response('An error occurred, check the console for details.');
                }

            })
            .catch(function (error) {
                console.error('Error in respondWith:', error);
                return new Response('An error occurred, check the console for details.');
            })
    )
});

self.addEventListener('activate', function (event) {
    // return self.clients.claim();
    const cacheWhitelist = []; // add cache names which you do not want to delete
    cacheWhitelist.push(CACHE_NAME);
    cacheWhitelist.push('workbox-precache-v2-https://chetchat.me/');

    event.waitUntil(
        caches.keys()
            .then(function (cacheNames) {
                return Promise.all(
                    cacheNames.map(function (cacheName) {
                        if (!cacheWhitelist.includes(cacheName)) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
    );
});



self.addEventListener("push", (event) => {
    // event는 서버에서 payload로 보내준 데이터이다.
    let { title, body, icon, tag, data } = JSON.parse(event.data && event.data.text());
    // 이외에도 여러 옵션이 있다.
    // 참고: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
    try {
        event.waitUntil(
            self.registration.showNotification(title || "", {
                body, tag, icon, data
            })
        );
    } catch (error) {
        console.log(error)
    }
});



// 알림 클릭시
self.addEventListener("notificationclick", function (event) {
    event.notification.close();

    // const { encryptedToken } = event.notification.data;
    const urlToOpen = event.notification.data.url || "https://chetchat.me";

    event.waitUntil(
        self.clients.matchAll({
            type: "window",
            includeUncontrolled: true,
            // 현재 서비스워커 클라이언트와 동일한 origin의 클라이언트를 포함시킬지 여부.
            // 이걸 활성화해두지 않으면, 현재 열린 탭이 있더라도 서비스워커를 활성화시킨 탭이 아니면 client에 포함되지 않음
        })
            .then(function (clientList) {
                if (clientList.length > 0) {
                    // 이미 열려있는 탭이 있는 경우
                    return clientList[0]
                        .focus()
                        .then((client) => client.navigate(urlToOpen));
                }
                return self.clients.openWindow(urlToOpen);
            })
    );
});