import axios from 'axios';
import { refreshToken } from '@/utils/login';

axios.defaults.baseURL = process.env.VUE_APP_PROD_SERVER;
// axios.defaults.headers.common['X-User-Agent'] = navigator.userAgent;


// Add a request interceptor
axios.interceptors.request.use(function (config) {
    const userAgent = navigator.userAgent;
    if (userAgent) config.headers['x-custom-user-agent'] = userAgent;


    // Do something before request is sent
    const currentEmail = localStorage.getItem('current-email');
    const token = localStorage.getItem(`access-token-${currentEmail}`);
    // if (!token) reLogin();

    config.headers.Authorization = `Bearer ${token}`;
    // config.headers['ngrok-skip-browser-warning'] = true;

    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // console.log('오류:', error);
    const errorAPI = error.config;
    // Failed to execute 'setRequestHeader' on 'XMLHttpRequest' 에러
    // error.config의 header 값을 json으로 바꿔줘서 해결.
    // https://github.com/axios/axios/issues/5143
    errorAPI.headers = errorAPI.headers.toJSON();

    if (error.response && error.response.status === 419 && errorAPI.retry === undefined) {
        errorAPI.retry = true;
        // console.log('토큰이 이상한 오류일 경우');
        await refreshToken();
        // console.log(errorAPI)
        return await axios(errorAPI);
    }

    return Promise.reject(error.response);
});

export default axios;