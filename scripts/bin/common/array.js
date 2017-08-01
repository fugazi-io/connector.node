"use strict";
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
    for (let i = 0; i < first.length; i++) {
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
    const cloned = clone(arr);
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
class ExtendedArray extends Array {
    static from(arr) {
        return new ExtendedArray(...arr);
    }
    equals(other) {
        return equals(this, other);
    }
    clone() {
        return new ExtendedArray(...this);
    }
    cloneAndPush(item) {
        return new ExtendedArray(...cloneAndPush(this, item));
    }
    concat(...items) {
        return ExtendedArray.from(super.concat(...items));
    }
    empty() {
        return empty(this);
    }
    first() {
        return first(this);
    }
    last() {
        return last(this);
    }
    filter(callback, thisArg) {
        return new ExtendedArray(...super.filter(callback, thisArg));
    }
}
exports.ExtendedArray = ExtendedArray;
//# sourceMappingURL=array.js.map