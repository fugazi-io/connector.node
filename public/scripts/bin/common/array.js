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
function equals(first, second) {
    if (!first && !second) {
        return true;
    }
    if (!first || !second) {
        return false;
    }
    if (first.length !== second.length) {
        return false;
    }
    for (var i = 0; i < first.length; i++) {
        if (first[i] != second[i]) {
            return false;
        }
    }
    return true;
}
exports.equals = equals;
function clone(arr) {
    return arr.slice(0);
}
exports.clone = clone;
function cloneAndPush(arr, item) {
    var cloned = clone(arr);
    cloned.push(item);
    return cloned;
}
exports.cloneAndPush = cloneAndPush;
function empty(arr) {
    return arr.length === 0;
}
exports.empty = empty;
function first(arr) {
    return arr[0];
}
exports.first = first;
function last(arr) {
    return arr[arr.length - 1];
}
exports.last = last;
function extend(instance) {
    instance = instance || [];
    Object.defineProperties(instance, {
        "equals": {
            value: equals.bind(instance, instance)
        },
        "clone": {
            value: clone.bind(instance, instance)
        },
        "cloneAndPush": {
            value: cloneAndPush.bind(instance, instance)
        },
        "empty": {
            value: empty.bind(instance, instance)
        },
        "first": {
            value: first.bind(instance, instance)
        },
        "last": {
            value: last.bind(instance, instance)
        }
    });
    return instance;
}
exports.extend = extend;
var ExtendedArray = (function (_super) {
    __extends(ExtendedArray, _super);
    function ExtendedArray() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExtendedArray.from = function (arr) {
        return new (ExtendedArray.bind.apply(ExtendedArray, [void 0].concat(arr)))();
    };
    ExtendedArray.prototype.equals = function (other) {
        return equals(this, other);
    };
    ExtendedArray.prototype.clone = function () {
        return new (ExtendedArray.bind.apply(ExtendedArray, [void 0].concat(this)))();
    };
    ExtendedArray.prototype.cloneAndPush = function (item) {
        return new (ExtendedArray.bind.apply(ExtendedArray, [void 0].concat(cloneAndPush(this, item))))();
    };
    ExtendedArray.prototype.concat = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return ExtendedArray.from(_super.prototype.concat.apply(this, items));
    };
    ExtendedArray.prototype.empty = function () {
        return empty(this);
    };
    ExtendedArray.prototype.first = function () {
        return first(this);
    };
    ExtendedArray.prototype.last = function () {
        return last(this);
    };
    ExtendedArray.prototype.filter = function (callback, thisArg) {
        return new (ExtendedArray.bind.apply(ExtendedArray, [void 0].concat(_super.prototype.filter.call(this, callback, thisArg))))();
    };
    return ExtendedArray;
}(Array));
exports.ExtendedArray = ExtendedArray;
//# sourceMappingURL=array.js.map