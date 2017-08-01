"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const send = require("koa-send");
exports.middleware = (routes) => {
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        if (routes.has(ctx.path)) {
            let file = routes.get(ctx.path);
            if (file[0] === "/") {
                const root = file.substring(0, file.lastIndexOf("/"));
                file = file.substring(file.lastIndexOf("/") + 1);
                return send(ctx, file, { root });
            }
            return send(ctx, file, { root: path.join(__dirname, "../../../") });
        }
        else {
            return next();
        }
    });
};
//# sourceMappingURL=statics.js.map