"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const map = require("./map");
exports.map = map;
const array = require("./array");
exports.array = array;
const utils = require("./utils");
exports.utils = utils;
const descriptors = require("./descriptors");
exports.descriptors = descriptors;
function equals(obj1, obj2) {
    if (Number.isNaN(obj1) && Number.isNaN(obj2)) {
        return true;
    }
    if (typeof obj1.equals === "function") {
        return obj1.equals(obj2);
    }
    if (obj1.constructor !== obj2.constructor) {
        return false;
    }
    if (isObject(obj1) && isObject(obj2)) {
        return Object.keys(obj1).length === Object.keys(obj2).length
            && Object.keys(obj1).every((key) => equals(obj1[key], obj2[key]));
    }
    return obj1 == obj2;
}
exports.equals = equals;
function isObject(obj) {
    return obj && obj.constructor === Object || false;
}
exports.isObject = isObject;
//# sourceMappingURL=index.js.map