"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const session = require("koa-session");
const CONFIG = {
    key: 'fugazi:sess',
    maxAge: 'session',
    overwrite: true,
    httpOnly: false,
    signed: true,
    rolling: true,
};
function middleware(app) {
    return session(CONFIG, app);
}
exports.middleware = middleware;
//# sourceMappingURL=session.js.map