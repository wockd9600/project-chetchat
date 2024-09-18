
export const isValidParam = (data) => {
    return !!((data && (typeof data === "string" || typeof data === "number")) || (typeof data === "boolean" || data === 0));
}

export const isValidParamTypeNumber = (data) => {
    return !!(data && typeof data === "number");
}

export const isValidMessage = (content) => {
    return !!(content && typeof content === 'string' && content.replace(/ /g, '').replace(/(?:\r\n|\r|\n)/g, '') !== '');
}

export const isValidObject = (obj) => {
    return !!(obj && Object.keys(obj).length !== 0);
}

export const isValidArray = (arr) => {
    return !!(arr && Array.isArray(arr) && arr.length !== 0);
}