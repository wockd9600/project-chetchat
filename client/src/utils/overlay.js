import store from '@/store';

function preventClick(event) {
    if (!event.target.closest('#msg-more') || !event.target.closest('.chetchat-overlay')) {
        // 특정 돔을 제외한 클릭 이벤트를 막습니다.
        event.preventDefault();
        event.stopPropagation();
    }
}

function preventContextMenu(event) {
    event.target.click();
    event.preventDefault();
}

function isOpendKeyboardBox() {
    const isAndroid = /Android/.test(navigator.userAgent);
    if (isAndroid) {
        let documentHeight = document.documentElement.clientHeight;
        let viewportHeight = window.visualViewport.height;
        let keyboardHeight = documentHeight - viewportHeight + 1;
        if (keyboardHeight > 5) return true;
    } else {
        if (document.documentElement.clientHeight !== window.visualViewport.height) return true;
    }

    return false;
}

function deleteOverLay() {
    document.removeEventListener('click', preventClick);
    
    const msgMore = document.getElementById('msg-more');
    if (msgMore) msgMore.style.display = 'none';
    

    if (isOpendKeyboardBox()) {
        const inputDom = document.getElementById('sendInput');
        if (inputDom) inputDom.focus();
    }

    const ingEventElement = store.getters.ingEventElement;
    if (ingEventElement && ingEventElement.childNodes[1]) ingEventElement.childNodes[1].style.display = 'none'

    const overlay_dom = document.getElementsByClassName('chetchat-overlay')[0];
    if (!overlay_dom) return;

    overlay_dom.removeEventListener('click', deleteOverLay, false);
    overlay_dom.removeEventListener('contextmenu', preventContextMenu, false);

    store.commit('TOGGLE_ING_EVENT_ELEMENT', null);

    overlay_dom.remove();
}

function createOverLay() {
    // created overlay dom
    const overlay_dom = document.createElement('div');
    overlay_dom.classList.add('chetchat-overlay');
    overlay_dom.classList.add('nodrag');

    if (isOpendKeyboardBox()) {
        const inputDom = document.getElementById('sendInput');
        if (inputDom) inputDom.focus();
    }

    // set event to overlay dom
    setTimeout(() => {
        overlay_dom.addEventListener('click', deleteOverLay, { passive: true });
    }, 300);
    overlay_dom.addEventListener('contextmenu', preventContextMenu, false);


    // 문서 전체에 클릭 이벤트 리스너를 추가합니다.
    document.addEventListener('click', preventClick);

    // body 요소의 자식으로 추가
    document.body.appendChild(overlay_dom);
}


export {
    createOverLay,
    deleteOverLay,
};