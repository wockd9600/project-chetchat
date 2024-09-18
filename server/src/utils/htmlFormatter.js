export const formatContentForHTML = (text) => {
    return text.replace(/(?:\r\n|\r|\n)/g, '<br/>').replace(/ /g, "&nbsp;");
}

export const getCurrentTime = () => {
    const currentDateTime = new Date();
    return currentDateTime.toISOString();
}