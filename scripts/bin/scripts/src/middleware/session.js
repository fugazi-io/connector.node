"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const session = require("koa-session");
const CONFIG = {
    valid: function valid(...rest) {
        console.log('valid', rest.join(','));
    },
    beforeSave: function beforeSave(...rest) {
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