import store from '@/store'

const WIDTH = 992

const isMobile = () => {
    const rectWidth = document.documentElement.clientWidth
    return rectWidth - 1 < WIDTH
};
const checkMobile = () => {
    if (isMobile()) store.dispatch('toggleDevice', 'mobile')
    else store.dispatch('toggleDevice', 'desktop')
}

const isEmptyString = (str) => {
    if (str.replace(/ /g, '').replace(/(?:\r\n|\r|\n)/g, '') === '') return true
    else return false
}

export {
    isMobile,
    checkMobile,
    isEmptyString,
};