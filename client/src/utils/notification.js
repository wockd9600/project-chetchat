
// import axios from '@/utils/axios'

const getServiceWokerRegistration = async () => {
    if (!('serviceWorker' in navigator)) throw new Error('Service Worker not supported');

    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) throw new Error('Service Worker not registered');

    return registration;
}



const subscribePushManager = async () => {
    try {
        // 알림 권한 받기
        const status = await Notification.requestPermission();
        // alert("Notification 상태" + status)

        // if (status === "denied") {
        //     alert("설정에서 알림을 켜주세요.");
        //     return false;
        // }

        if (status !== "granted") return false;


        // service woker 가져오기
        const registration = await getServiceWokerRegistration();


        // push manager 등록
        const VAPID_PUBLIC_KEY = process.env.VUE_APP_VAPID_PUBLIC_KEY;
        const subscribeOptions = {
            applicationServerKey: VAPID_PUBLIC_KEY,
            userVisibleOnly: true,
        };

        // 이미 구독중인지 확인
        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) subscription = await registration.pushManager.subscribe(subscribeOptions);

        return subscription;
        // 서버로 보냄
    } catch (error) {
        console.log("error" + error);
        return false;
    }
}

const unsubscribePushManager = async () => {
    try {
        if (!('serviceWorker' in navigator)) return;

        const registration = await getServiceWokerRegistration();

        const subscription = await registration.pushManager.getSubscription();
        if (!subscription) return;

        // await postUnSubscription(subscription)

        // 사용자 구독 정보로 구독 취소 요청
        await subscription.unsubscribe();
    } catch (error) {
        console.log(error)
    }
};





export {
    subscribePushManager,
    unsubscribePushManager,
};