const clone = (object) => {
    return JSON.parse(JSON.stringify(object));
};

const compareEquality = (obj, object, includeMessage) => {
    if (obj.invalidValue === undefined
        && object.invalidValue === undefined
        && obj.property === undefined
        && object.property === undefined)
        return false;
    if (includeMessage) {
        if (obj.message !== undefined
            && object.message !== undefined
            && obj.message === object.message && obj.invalidValue === object.invalidValue && obj.property === object.property)
            return true;
        return false;
    }
    if (obj.invalidValue === object.invalidValue && obj.property === object.property)
        return true;
    return false;
}
module.exports = {
    clone,
    compareEquality
};