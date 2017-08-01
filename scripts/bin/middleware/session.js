"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const session = require("koa-session");
const DEFAULT_CONFIG = {
    key: 'fugazi:sess',
    maxAge: 'session',
    overwrite: true,
    httpOnly: false,
    signed: true,
    rolling: true,
};
function middleware(app, config) {
    return session(Object.assign({}, config, DEFAULT_CONFIG), app);
}
exports.middleware = middleware;
//# sourceMappingURL=session.js.map