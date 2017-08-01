"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Future = (function () {
    function Future(parent, promise) {
        if (parent && promise) {
            this.parent = parent;
            this.promise = promise;
        }
        else {
            this.promise = new Promise(this.promiseExecutor.bind(this));
        }
    }
    Future.prototype.asPromise = function () {
        return this.promise;
    };
    Future.prototype.then = function (onfulfilled, onrejected) {
        return new Future(this, this.promise.then(onfulfilled));
    };
    Future.prototype.catch = function (onrejected) {
        return new Future(this, this.promise.catch(onrejected));
    };
    Future.prototype.finally = function (fn) {
        return this.then(fn, function (e) { fn(e); throw e; });
    };
    Future.prototype.resolve = function (value) {
        if (this.parent) {
            this.parent.resolve(value);
        }
        else {
            this.resolveFunction(value);
        }
    };
    Future.prototype.reject = function (reason) {
        if (this.parent) {
            this.parent.reject(reason);
        }
        else {
            this.rejectFunction(reason);
        }
    };
    Future.prototype.promiseExecutor = function (resolve, reject) {
        this.resolveFunction = resolve;
        this.rejectFunction = reject;
    };
    return Future;
}());
exports.Future = Future;
var origpath = require("path");
var path;
(function (path) {
    function getter() {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        return (_a = origpath.join).bind.apply(_a, [origpath].concat(paths));
        var _a;
    }
    path.getter = getter;
})(path = exports.path || (exports.path = {}));
//# sourceMappingURL=utils.js.map