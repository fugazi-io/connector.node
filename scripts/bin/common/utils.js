"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Future {
    constructor(parent, promise) {
        if (parent && promise) {
            this.parent = parent;
            this.promise = promise;
        }
        else {
            this.promise = new Promise(this.promiseExecutor.bind(this));
        }
    }
    asPromise() {
        return this.promise;
    }
    then(onfulfilled, onrejected) {
        return new Future(this, this.promise.then(onfulfilled));
    }
    catch(onrejected) {
        return new Future(this, this.promise.catch(onrejected));
    }
    finally(fn) {
        return this.then(fn, function (e) { fn(e); throw e; });
    }
    resolve(value) {
        if (this.parent) {
            this.parent.resolve(value);
        }
        else {
            this.resolveFunction(value);
        }
    }
    reject(reason) {
        if (this.parent) {
            this.parent.reject(reason);
        }
        else {
            this.rejectFunction(reason);
        }
    }
    promiseExecutor(resolve, reject) {
        this.resolveFunction = resolve;
        this.rejectFunction = reject;
    }
}
exports.Future = Future;
const origpath = require("path");
var path;
(function (path) {
    function getter(...paths) {
        return origpath.join.bind(origpath, ...paths);
    }
    path.getter = getter;
})(path = exports.path || (exports.path = {}));
//# sourceMappingURL=utils.js.map