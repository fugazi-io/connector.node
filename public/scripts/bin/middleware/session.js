"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var session = require("koa-session");
var CONFIG = {
    valid: function valid() {
        var rest = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rest[_i] = arguments[_i];
        }
        console.log('valid', rest.join(','));
    },
    beforeSave: function beforeSave() {
        var rest = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rest[_i] = arguments[_i];
        }
        console.log('beforeSave', rest.join(','));
    },
    key: 'fugazi:sess',
    maxAge: 'session',
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
};
function middleware(app) {
    return session(CONFIG, app);
}
exports.middleware = middleware;
//# sourceMappingURL=session.js.map