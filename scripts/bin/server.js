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
const Cors = require("kcors");
const bodyparser = require("koa-bodyparser");
const destroyable = require("server-destroy");
const fs = require("fs");
const Koa = require("koa");
const path = require("path");
const Router = require("koa-router");
const map_1 = require("./common/map");
const array_1 = require("./common/array");
const statics_1 = require("./middleware/statics");
const logging_1 = require("./middleware/logging");
const session_1 = require("./middleware/session");
const serve = require("koa-static");
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus[ResponseStatus["Success"] = 0] = "Success";
    ResponseStatus[ResponseStatus["Failure"] = 1] = "Failure";
})(ResponseStatus = exports.ResponseStatus || (exports.ResponseStatus = {}));
function createRequestData(body, path, search) {
    const data = function (name) {
        if (body.has(name)) {
            return body.get(name);
        }
        if (path.has(name)) {
            return path.get(name);
        }
        return search.get(name);
    };
    data.has = function (name) {
        return body.has(name) || path.has(name) || search.has(name);
    };
    data.body = body.get.bind(body);
    data.body.has = body.has.bind(body);
    data.path = path.get.bind(path);
    data.path.has = path.has.bind(path);
    data.search = search.get.bind(search);
    data.search.has = search.has.bind(search);
    return data;
}
function parse(ctx) {
    const body = new map_1.ExtendedMap();
    const path = new map_1.ExtendedMap();
    const search = new map_1.ExtendedMap();
    const headers = new map_1.ExtendedMap();
    Object.keys(ctx.headers).forEach(key => {
        headers.set(key, ctx.headers[key]);
    });
    if (ctx.params) {
        Object.keys(ctx.params).forEach(key => {
            path.set(key, ctx.params[key]);
        });
    }
    if (ctx.query) {
        Object.keys(ctx.query).forEach(key => {
            search.set(key, ctx.query[key]);
        });
    }
    if (ctx.request.body) {
        Object.keys(ctx.request.body).forEach(key => {
            body.set(key, ctx.request.body[key]);
        });
    }
    return {
        session: ctx.session,
        headers,
        path: ctx.path,
        data: createRequestData(body, path, search)
    };
}
function isCommandHandler(obj) {
    return obj instanceof Function;
}
exports.isCommandHandler = isCommandHandler;
const pathFor = path.join.bind(path, __dirname, "../../");
class ServerBuilder {
    constructor(parent) {
        this._parent = parent;
        this._files = new map_1.ExtendedMap();
        this._folders = [];
        this._commands = new array_1.ExtendedArray();
        this._modules = new map_1.ExtendedMap();
    }
    logger(logger) {
        this._logger = logger;
        return this;
    }
    port(port) {
        this._port = port;
        return this;
    }
    host(host) {
        this._host = host;
        return this;
    }
    session(config = {}) {
        this._session = config;
    }
    cors(cors) {
        if (!cors) {
            this._cors = false;
        }
        else {
            if (typeof cors === "boolean") {
                this._cors = {};
            }
            else {
                this._cors = cors;
            }
        }
        return this;
    }
    proxy(proxy) {
        this._proxy = proxy;
        return this;
    }
    folder(folderPath) {
        this._folders.push(folderPath);
        return this;
    }
    file(urlPath, filePath) {
        this._files.set(urlPath, filePath);
        return this;
    }
    module(descriptor) {
        this._modules.set(descriptor.name, descriptor);
        return this;
    }
    command(command) {
        this._commands.push(command);
        return this;
    }
    parent() {
        return this._parent;
    }
    build() {
        const routes = [];
        this._modules.forEach((descriptor, name) => {
            let route;
            if (this._proxy) {
                route = {
                    type: "root-module",
                    path: `/${name}.js`,
                    method: "get",
                    handler: serveJsModule.bind(this, descriptor)
                };
            }
            else {
                route = {
                    type: "root-module",
                    path: `/${name}.json`,
                    method: "get",
                    handler: serveJSONModule.bind(this, descriptor)
                };
            }
            routes.push(route);
        });
        this._commands.forEach(command => routes.push({
            type: "command",
            path: command.path,
            method: command.method,
            handler: commandHandlerWrapper.bind(null, command.handler)
        }));
        if (this._cors == null) {
            this.cors(true);
        }
        return new _Server(this.getHost(), this.getPort(), this._cors, this._logger, this.prepareFiles(), this._folders, this._session, routes);
    }
    getOrigin() {
        return `http://${this.getHost()}:${this.getPort()}`;
    }
    getUrlFor(relativePath) {
        return this.getOrigin() + (relativePath.startsWith("/") ? relativePath : "/" + relativePath);
    }
    getProxy() {
        return this._proxy ? ServerBuilder.PROXY_PATH : null;
    }
    prepareFiles() {
        const routes = new Map();
        if (this._proxy) {
            this._files.set(ServerBuilder.PROXY_PATH, "public/proxyframe.html");
        }
        this._files.forEach((file, path) => {
            if (file[0] !== "/") {
                file = pathFor(file);
            }
            if (!fs.existsSync(file)) {
                throw new Error(`file for path "${path} " doesn't exist in "${file}"`);
            }
            routes.set(path, file);
        });
        return routes;
    }
    getPort() {
        return this._port || ServerBuilder.DEFAULT_PORT;
    }
    getHost() {
        return this._host || ServerBuilder.DEFAULT_HOST;
    }
}
ServerBuilder.DEFAULT_HOST = "localhost";
ServerBuilder.DEFAULT_PORT = 3333;
ServerBuilder.PROXY_PATH = "/proxyframe";
exports.ServerBuilder = ServerBuilder;
class _Server {
    constructor(host, port, cors, logger, files, folders, sessionConfig, routes) {
        this.host = host;
        this.port = port;
        this.logger = logger;
        this.koa = new Koa();
        if (folders.length) {
            folders.forEach((folder) => {
                this.koa.use(serve(folder));
            });
        }
        this.setupLogging();
        if (cors) {
            this.koa.use(Cors(cors));
        }
        if (sessionConfig !== undefined) {
            if (sessionConfig.keygrip) {
                this.koa.keys = sessionConfig.keygrip;
            }
            this.koa.use(session_1.middleware(this.koa, sessionConfig));
        }
        this.koa.use(statics_1.middleware(files));
        this.koa.use(bodyparser());
        this.router = new Router();
        this.setupRoutes(routes);
        this.koa
            .use(this.router.routes())
            .use(this.router.allowedMethods());
        this.logRoutes(routes, files);
    }
    start() {
        return new Promise(resolve => {
            this.server = this.koa.listen(this.port, this.host, () => {
                this.logger.info(`server started. listening on ${this.host}:${this.port}`);
                resolve();
            });
        });
    }
    stop() {
        return new Promise(resolve => {
            destroyable(this.server).destroy(resolve);
        });
    }
    setupLogging() {
        this.koa.use(logging_1.middleware(this.logger));
        this.koa.use((ctx, next) => {
            ctx.logger().info(`${ctx.request.href} handling started`);
            return next().then(value => {
                ctx.logger().info(`${ctx.request.href} handling finished with ${ctx.response.status}`);
                return value;
            });
        });
    }
    setupRoutes(routes) {
        routes.forEach(route => {
            switch (route.method.toLocaleLowerCase()) {
                case "get":
                    this.router.get(route.path, route.handler);
                    break;
                case "put":
                    this.router.put(route.path, route.handler);
                    break;
                case "post":
                    this.router.post(route.path, route.handler);
                    break;
                case "delete":
                    this.router.delete(route.path, route.handler);
                    break;
            }
        });
    }
    logRoutes(routes, files) {
        this.logger.info("===== ROUTES START =====");
        if (files.size > 0) {
            this.logger.info("# Files:");
            for (const path of files.keys()) {
                this.logger.info("    " + path);
            }
        }
        const commands = routes.filter(route => route.type === "command");
        if (commands.length > 0) {
            this.logger.info("# Commands:");
            commands.forEach(route => this.logger.info(`    ${route.method} : ${route.path}`));
        }
        const modules = routes.filter(route => route.type === "root-module");
        if (modules.length > 0) {
            this.logger.info("# Root modules:");
            modules.forEach(route => this.logger.info(`    ${route.path}`));
        }
        this.logger.info("====== ROUTES END ======");
    }
}
function serveJSONModule(module, ctx) {
    ctx.type = "application/json";
    ctx.body = module;
}
function serveJsModule(module, ctx) {
    ctx.type = "application/javascript";
    ctx.body = "(function() { fugazi.components.modules.descriptor.loaded(" + JSON.stringify(module) + "); })()";
}
function commandHandlerWrapper(handler, ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        ctx.set("Cache-Control", "no-cache, no-store, must-revalidate");
        try {
            yield handleResponse(ctx, handler(parse(ctx)));
        }
        catch (e) {
            handleError(ctx, e);
        }
    });
}
function handleError(ctx, error) {
    let message;
    if (typeof error === "string") {
        message = error;
    }
    else if (error instanceof Error) {
        message = error.message;
    }
    else {
        message = error.toString();
    }
    ctx.type = "application/json";
    ctx.status = 400;
    ctx.body = {
        status: ResponseStatus.Failure,
        error: message
    };
}
function handleResponse(ctx, response) {
    return __awaiter(this, void 0, void 0, function* () {
        if (response instanceof Promise) {
            response = yield response;
        }
        if (response.headers) {
            map_1.extend(response.headers).forEach((value, name) => {
                ctx.set(name, value);
            });
        }
        ctx.type = "application/json";
        if (response.status === ResponseStatus.Failure) {
            ctx.body = getFailureResponse(response);
        }
        else {
            ctx.body = getSuccessResponse(response);
        }
    });
}
function getSuccessResponse(response) {
    let value;
    if (response.data instanceof Map) {
        value = map_1.extend(response.data).toObject();
    }
    else {
        value = response.data;
    }
    return {
        status: ResponseStatus.Success,
        value
    };
}
function getFailureResponse(response) {
    return {
        status: ResponseStatus.Failure,
        error: response.data
    };
}
//# sourceMappingURL=server.js.map