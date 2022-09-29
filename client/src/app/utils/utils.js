const utils = {
    isEqualObject(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }, 
    either(thiis, that) {
        return thiis ? thiis : that
    }
}

export default utils;