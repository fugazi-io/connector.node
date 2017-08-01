"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objects = require("./object");
function from(obj) {
    const entries = [];
    objects.forEach(obj, (value, key) => entries.push([key, value]));
    return new Map(entries);
}
exports.from = from;
function empty(map) {
    return map.size === 0;
}
exports.empty = empty;
function keysArray(map) {
    const keys = [];
    for (let key of map.keys()) {
        keys.push(key);
    }
    return keys;
}
exports.keysArray = keysArray;
function valuesArray(map) {
    const values = [];
    for (let value of map.values()) {
        values.push(value);
    }
    return values;
}
exports.valuesArray = valuesArray;
function toArray(map, mapper, thisArg) {
    const arr = [];
    for (let entry of map.entries()) {
        arr.push(mapper.call(thisArg, entry[1], entry[0], map));
    }
    return arr;
}
exports.toArray = toArray;
function toObject(map) {
    const obj = Object.create(null);
    for (let [k, v] of map) {
        obj[k] = v;
    }
    return obj;
}
exports.toObject = toObject;
function _map(original, mapped, mapper, thisArg) {
    for (let entry of original.entries()) {
        const newEntry = mapper.call(thisArg, entry[1], entry[0], original);
        if (newEntry instanceof Array) {
            mapped.set(newEntry[0], newEntry[1]);
        }
        else {
            mapped.set(entry[0], newEntry);
        }
    }
    return mapped;
}
function map(map, mapper, thisArg) {
    const newMap = new Map();
    return _map(map, newMap, mapper, thisArg);
}
exports.map = map;
function _filter(original, filtered, callback, thisArg) {
    for (let entry of original.entries()) {
        if (callback.call(thisArg || map, entry[1], entry[0], map)) {
            filtered.set(entry[0], entry[1]);
        }
    }
    return filtered;
}
function filter(map, callback, thisArg) {
    return _filter(map, new Map(), callback, thisArg);
}
exports.filter = filter;
function extend(instance) {
    instance = instance || new Map();
    if (instance)
        if (instance.hasOwnProperty("__extended__") || instance instanceof ExtendedMap) {
            return instance;
        }
    Object.defineProperties(instance, {
        "__extended__": {
            value: true
        },
        "empty": {
            value: empty.bind(instance, instance)
        },
        "keysArray": {
            value: keysArray.bind(instance, instance)
        },
        "valuesArray": {
            value: valuesArray.bind(instance, instance)
        },
        "toArray": {
            value: toArray.bind(instance, instance)
        },
        "toObject": {
            value: toObject.bind(instance, instance)
        },
        "map": {
            value: map.bind(instance, instance)
        },
        "filter": {
            value: filter.bind(instance, instance)
        }
    });
    return instance;
}
exports.extend = extend;
class ExtendedMap extends Map {
    static from(obj) {
        const entries = [];
        objects.forEach(obj, (value, key) => entries.push([key, value]));
        return new ExtendedMap(entries);
    }
    empty() {
        return empty(this);
    }
    keysArray() {
        return keysArray(this);
    }
    valuesArray() {
        return valuesArray(this);
    }
    toArray(mapper, thisArg) {
        return toArray(this, mapper, thisArg);
    }
    toObject() {
        return toObject(this);
    }
    map(mapper, thisArg) {
        return _map(this, new ExtendedMap(), mapper, thisArg);
    }
    filter(callback, thisArg) {
        return _filter(this, new ExtendedMap(), callback, thisArg);
    }
}
exports.ExtendedMap = ExtendedMap;
//# sourceMappingURL=map.js.map