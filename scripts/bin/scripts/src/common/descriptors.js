"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_1 = require("./object");
function collectionIterator(collection) {
    const array = collection instanceof Array ? collection : Object.values(object_1.map(collection, (value, name) => Object.assign(value, { name })));
    return {
        forEach: array.forEach
    };
}
exports.collectionIterator = collectionIterator;
//# sourceMappingURL=descriptors.js.map