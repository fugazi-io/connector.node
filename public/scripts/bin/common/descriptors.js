"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var object_1 = require("./object");
function collectionIterator(collection) {
    var array = collection instanceof Array ? collection : Object.values(object_1.map(collection, function (value, name) { return Object.assign(value, { name: name }); }));
    return {
        forEach: array.forEach
    };
}
exports.collectionIterator = collectionIterator;
//# sourceMappingURL=descriptors.js.map