"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function forEach(obj, callbackfn, thisArg) {
    Object.keys(obj).forEach(function (value, key, instance) { return callbackfn.call(thisArg, value, key, instance); });
}
exports.forEach = forEach;
function map(obj, mapper, thisArg) {
    var mapped = {};
    forEach(obj, function (value, key) {
        mapped[key] = mapper.call(thisArg, value, key, obj);
    });
    return mapped;
}
exports.map = map;
//# sourceMappingURL=object.js.map