"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var objects = require("./object");
function from(obj) {
    var entries = [];
    objects.forEach(obj, function (value, key) { return entries.push([key, value]); });
    return new Map(entries);
}
exports.from = from;
function empty(map) {
    return map.size === 0;
}
exports.empty = empty;
function keysArray(map) {
    var keys = [];
    for (var _i = 0, _a = map.keys(); _i < _a.length; _i++) {
        var key = _a[_i];
        keys.push(key);
    }
    return keys;
}
exports.keysArray = keysArray;
function valuesArray(map) {
    var values = [];
    for (var _i = 0, _a = map.values(); _i < _a.length; _i++) {
        var value = _a[_i];
        values.push(value);
    }
    return values;
}
exports.valuesArray = valuesArray;
function toArray(map, mapper, thisArg) {
    var arr = [];
    for (var _i = 0, _a = map.entries(); _i < _a.length; _i++) {
        var entry = _a[_i];
        arr.push(mapper.call(thisArg, entry[1], entry[0], map));
    }
    return arr;
}
exports.toArray = toArray;
function toObject(map) {
    var obj = Object.create(null);
    for (var _i = 0, map_1 = map; _i < map_1.length; _i++) {
        var _a = map_1[_i], k = _a[0], v = _a[1];
        obj[k] = v;
    }
    return obj;
}
exports.toObject = toObject;
function _map(original, mapped, mapper, thisArg) {
    for (var _i = 0, _a = original.entries(); _i < _a.length; _i++) {
        var entry = _a[_i];
        var newEntry = mapper.call(thisArg, entry[1], entry[0], original);
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
    var newMap = new Map();
    return _map(map, newMap, mapper, thisArg);
}
exports.map = map;
function _filter(original, filtered, callback, thisArg) {
    for (var _i = 0, _a = original.entries(); _i < _a.length; _i++) {
        var entry = _a[_i];
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
var ExtendedMap = (function (_super) {
    __extends(ExtendedMap, _super);
    function ExtendedMap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExtendedMap.from = function (obj) {
        var entries = [];
        objects.forEach(obj, function (value, key) { return entries.push([key, value]); });
        return new ExtendedMap(entries);
    };
    ExtendedMap.prototype.empty = function () {
        return empty(this);
    };
    ExtendedMap.prototype.keysArray = function () {
        return keysArray(this);
    };
    ExtendedMap.prototype.valuesArray = function () {
        return valuesArray(this);
    };
    ExtendedMap.prototype.toArray = function (mapper, thisArg) {
        return toArray(this, mapper, thisArg);
    };
    ExtendedMap.prototype.toObject = function () {
        return toObject(this);
    };
    ExtendedMap.prototype.map = function (mapper, thisArg) {
        return _map(this, new ExtendedMap(), mapper, thisArg);
    };
    ExtendedMap.prototype.filter = function (callback, thisArg) {
        return _filter(this, new ExtendedMap(), callback, thisArg);
    };
    return ExtendedMap;
}(Map));
exports.ExtendedMap = ExtendedMap;
//# sourceMappingURL=map.js.map