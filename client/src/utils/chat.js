// function getIndexForUUID(arr, reply_uuid) {
//     const index = arr.findIndex((item) => item.message_id == reply_uuid);
//     if (index === -1) return 0;
//     return index;
// }
// function getReplyName(arr, item) {
//     const reply_index = getIndexForUUID(arr, item.reply_uuid);
//     return arr[reply_index].nickname;
// }
// function getReplyContent(arr, item) {
//     const reply_index = getIndexForUUID(arr, item.reply_uuid);

//     if (arr[reply_index].img) return '사진';
//     return arr[reply_index].content;
// }


const isDisplayProfileAndUserName = (arr, index) => {
    const [currentItem, previousItem] = [arr[index], arr[index - 1]];
    // 처음 메시지거나, 이전 메시지 시간이 다르거나, 이전 메시지가 다른 사람이면
    // if (!previousItem || currentItem.date !== previousItem.date || currentItem.user_uuid !== previousItem.user_uuid
    if (!previousItem || currentItem.is_my_message !== previousItem.is_my_message
    ) {
        return true;
    } else {
        return false;
    }
};

const isDisplayDate = (arr, index) => {
    const [currentItem, nextItem] = [arr[index], arr[index + 1]];

    // if (index === -1 || !nextItem || currentItem.date !== nextItem.date || currentItem.user_uuid !== nextItem.user_uuid) {
    if (index === -1 || !nextItem || (currentItem.sender_id !== nextItem.sender_id)) {
        return true;
    } else {
        return false;
    }
};

const scrollToTopOfChatBoxImportant = (time = 10) => {
    const dom = document.getElementsByClassName('chat-box')[0];
    if (!dom) return;

    setTimeout(() => dom.scrollTo({ top: 0, behavior: 'instant' }), time);
}

const scrollToBottomOfChatBox = (time = 10) => {
    const dom = document.getElementsByClassName('chat-box')[0];
    if (!dom) return;

    if (dom.scrollHeight - 100 < dom.scrollTop + dom.offsetHeight) {
        setTimeout(() => { dom.scrollTo({ top: dom.scrollHeight, behavior: 'instant' }) }, time);
    }
}

const scrollToBottomOfChatBoxImportant = (time = 10) => {
    const dom = document.getElementsByClassName('chat-box')[0];
    if (!dom) return;
    
    setTimeout(() => dom.scrollTo({ top: dom.scrollHeight, behavior: 'instant' }), time);
}

const scrollBottomOfImageMessage = (dom_class_name) => {
    setTimeout(() => {
        const images = document.getElementsByClassName(dom_class_name); // 이미지 엘리먼트 선택
        let loadedCount = 0;

        const loadImageHandler = (event) => {
            // const addImage = getters.addImage;
            // const target = event.target;
            // setTimeout(() => {
            //     if (addImage) addImage(target);
            // }, 100);

            loadedCount++;
            if (loadedCount === images.length) {
                scrollToBottomOfChatBoxImportant();
            }
            // 이벤트 리스너 제거
            event.target.removeEventListener('load', loadImageHandler);
        };

        Array.from(images).forEach((image) => {
            if (image.complete) {
                loadedCount++;
            } else {
                image.addEventListener('load', loadImageHandler);
            }
        });

        if (loadedCount === images.length) {
            scrollToBottomOfChatBoxImportant();
        }
    }, 10);
}

const getFilteredMessageForUI = async (arr) => {
    if (!arr) return [];

    return arr.map((item, index) => {
        let showPN = false;
        // let showDate = false;
        // let reply_name = '';
        // let reply_content = '';

        if (isDisplayProfileAndUserName(arr, index)) {
            showPN = true;
        }

        // if (isDisplayDate(arr, index)) showDate = true;

        // if (item.message_id != item.reply_uuid) {
        //     reply_name = getReplyName(arr, item);
        //     reply_content = getReplyContent(arr, item);
        // }

        item.content = item.content.replace(/(?:\r\n|\r|\n)/g, '<br/>');

        return {
            ...item,
            showPN,
            // showDate,
            // reply_name,
            // reply_content,
        };
    });
};



export {
    isDisplayProfileAndUserName,
    isDisplayDate,
    scrollToTopOfChatBoxImportant,
    scrollToBottomOfChatBox,
    scrollToBottomOfChatBoxImportant,
    scrollBottomOfImageMessage,
    getFilteredMessageForUI,
};