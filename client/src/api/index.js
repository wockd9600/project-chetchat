import axios from '@/utils/axios'

const authKakaoLogin = (code) => {
    return axios.post(`/service/kakaoLogin`, { code });
}

const setUserName = (name) => {
    return axios.post(`/service/setUserName`, { name });
}

export {
    authKakaoLogin,
    setUserName,
};