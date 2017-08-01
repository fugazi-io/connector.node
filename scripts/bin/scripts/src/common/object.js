"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function forEach(obj, callbackfn, thisArg) {
    Object.keys(obj).forEach((value, key, instance) => callbackfn.call(thisArg, value, key, instance));
}
exports.forEach = forEach;
function map(obj, mapper, thisArg) {
    const mapped = {};
    forEach(obj, (value, key) => {
        mapped[key] = mapper.call(thisArg, value, key, obj);
    });
    return mapped;
}
exports.map = map;
//# sourceMappingURL=object.js.map