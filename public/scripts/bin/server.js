"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Cors = require("kcors");
var bodyparser = require("koa-bodyparser");
var destroyable = require("server-destroy");
var fs = require("fs");
var Koa = require("koa");
var path = require("path");
var Router = require("koa-router");
var map_1 = require("./common/map");
var array_1 = require("./common/array");
var statics_1 = require("./middleware/statics");
var logging_1 = require("./middleware/logging");
var session_1 = require("./middleware/session");
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus[ResponseStatus["Success"] = 0] = "Success";
    ResponseStatus[ResponseStatus["Failure"] = 1] = "Failure";
})(ResponseStatus = exports.ResponseStatus || (exports.ResponseStatus = {}));
function createRequestData(body, path, search) {
    var data = function (name) {
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
    var body = new map_1.ExtendedMap();
    var path = new map_1.ExtendedMap();
    var search = new map_1.ExtendedMap();
    var headers = new map_1.ExtendedMap();
    Object.keys(ctx.headers).forEach(function (key) {
        headers.set(key, ctx.headers[key]);
    });
    if (ctx.params) {
        Object.keys(ctx.params).forEach(function (key) {
            path.set(key, ctx.params[key]);
        });
    }
    if (ctx.query) {
        Object.keys(ctx.query).forEach(function (key) {
            search.set(key, ctx.query[key]);
        });
    }
    if (ctx.request.body) {
        Object.keys(ctx.request.body).forEach(function (key) {
            body.set(key, ctx.request.body[key]);
        });
    }
    return {
        session: ctx.session,
        headers: headers,
        path: ctx.path,
        data: createRequestData(body, path, search)
    };
}
function isCommandHandler(obj) {
    return obj instanceof Function;
}
exports.isCommandHandler = isCommandHandler;
var pathFor = path.join.bind(path, __dirname, "../../");
var ServerBuilder = (function () {
    function ServerBuilder(parent) {
        this._parent = parent;
        this._files = new map_1.ExtendedMap(),
            this._commands = new array_1.ExtendedArray(),
            this._modules = new map_1.ExtendedMap();
    }
    ServerBuilder.prototype.logger = function (logger) {
        this._logger = logger;
        return this;
    };
    ServerBuilder.prototype.port = function (port) {
        this._port = port;
        return this;
    };
    ServerBuilder.prototype.host = function (host) {
        this._host = host;
        return this;
    };
    ServerBuilder.prototype.cors = function (cors) {
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
    };
    ServerBuilder.prototype.proxy = function (proxy) {
        this._proxy = proxy;
        return this;
    };
    ServerBuilder.prototype.file = function (urlPath, filePath) {
        this._files.set(urlPath, filePath);
        return this;
    };
    ServerBuilder.prototype.module = function (descriptor) {
        this._modules.set(descriptor.name, descriptor);
        return this;
    };
    ServerBuilder.prototype.command = function (command) {
        this._commands.push(command);
        return this;
    };
    ServerBuilder.prototype.parent = function () {
        return this._parent;
    };
    ServerBuilder.prototype.build = function () {
        var _this = this;
        var routes = [];
        this._modules.forEach(function (descriptor, name) {
            var route;
            if (_this._proxy) {
                route = {
                    type: "root-module",
                    path: "/" + name + ".js",
                    method: "get",
                    handler: serveJsModule.bind(_this, descriptor)
                };
            }
            else {
                route = {
                    type: "root-module",
                    path: "/" + name + ".json",
                    method: "get",
                    handler: serveJSONModule.bind(_this, descriptor)
                };
            }
            routes.push(route);
        });
        this._commands.forEach(function (command) { return routes.push({
            type: "command",
            path: command.path,
            method: command.method,
            handler: commandHandlerWrapper.bind(null, command.handler)
        }); });
        if (this._cors == null) {
            this.cors(true);
        }
        return new _Server(this.getHost(), this.getPort(), this._cors, this._logger, this.prepareFiles(), routes);
    };
    ServerBuilder.prototype.getOrigin = function () {
        return "http://" + this.getHost() + ":" + this.getPort();
    };
    ServerBuilder.prototype.getUrlFor = function (relativePath) {
        return this.getOrigin() + (relativePath.startsWith("/") ? relativePath : "/" + relativePath);
    };
    ServerBuilder.prototype.getProxy = function () {
        return this._proxy ? ServerBuilder.PROXY_PATH : null;
    };
    ServerBuilder.prototype.prepareFiles = function () {
        var routes = new Map();
        if (this._proxy) {
            this._files.set(ServerBuilder.PROXY_PATH, "public/proxyframe.html");
        }
        this._files.forEach(function (file, path) {
            if (file[0] !== "/") {
                file = pathFor(file);
            }
            if (!fs.existsSync(file)) {
                throw new Error("file for path \"" + path + " \" doesn't exist in \"" + file + "\"");
            }
            routes.set(path, file);
        });
        return routes;
    };
    ServerBuilder.prototype.getPort = function () {
        return this._port || ServerBuilder.DEFAULT_PORT;
    };
    ServerBuilder.prototype.getHost = function () {
        return this._host || ServerBuilder.DEFAULT_HOST;
    };
    ServerBuilder.DEFAULT_HOST = "localhost";
    ServerBuilder.DEFAULT_PORT = 3333;
    ServerBuilder.PROXY_PATH = "/proxyframe";
    return ServerBuilder;
}());
exports.ServerBuilder = ServerBuilder;
var _Server = (function () {
    function _Server(host, port, cors, logger, files, routes) {
        this.host = host;
        this.port = port;
        this.logger = logger;
        this.koa = new Koa();
        this.setupLogging();
        if (cors) {
            this.koa.use(Cors(cors));
        }
        this.koa.use(session_1.middleware(this.koa));
        this.koa.use(statics_1.middleware(files));
        this.koa.use(bodyparser());
        this.router = new Router();
        this.setupRoutes(routes);
        this.koa
            .use(this.router.routes())
            .use(this.router.allowedMethods());
        this.logRoutes(routes, files);
    }
    _Server.prototype.start = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.server = _this.koa.listen(_this.port, _this.host, function () {
                _this.logger.info("server started. listening on " + _this.host + ":" + _this.port);
                resolve();
            });
        });
    };
    _Server.prototype.stop = function () {
        var _this = this;
        return new Promise(function (resolve) {
            destroyable(_this.server).destroy(resolve);
        });
    };
    _Server.prototype.setupLogging = function () {
        this.koa.use(logging_1.middleware(this.logger));
        this.koa.use(function (ctx, next) {
            ctx.logger().info(ctx.request.href + " handling started");
            return next().then(function (value) {
                ctx.logger().info(ctx.request.href + " handling finished with " + ctx.response.status);
                return value;
            });
        });
    };
    _Server.prototype.setupRoutes = function (routes) {
        var _this = this;
        routes.forEach(function (route) {
            switch (route.method.toLocaleLowerCase()) {
                case "get":
                    _this.router.get(route.path, route.handler);
                    break;
                case "put":
                    _this.router.put(route.path, route.handler);
                    break;
                case "post":
                    _this.router.post(route.path, route.handler);
                    break;
                case "delete":
                    _this.router.delete(route.path, route.handler);
                    break;
            }
        });
    };
    _Server.prototype.logRoutes = function (routes, files) {
        var _this = this;
        this.logger.info("===== ROUTES START =====");
        if (files.size > 0) {
            this.logger.info("# Files:");
            for (var _i = 0, _a = files.keys(); _i < _a.length; _i++) {
                var path_1 = _a[_i];
                this.logger.info("    " + path_1);
            }
        }
        var commands = routes.filter(function (route) { return route.type === "command"; });
        if (commands.length > 0) {
            this.logger.info("# Commands:");
            commands.forEach(function (route) { return _this.logger.info("    " + route.method + " : " + route.path); });
        }
        var modules = routes.filter(function (route) { return route.type === "root-module"; });
        if (modules.length > 0) {
            this.logger.info("# Root modules:");
            modules.forEach(function (route) { return _this.logger.info("    " + route.path); });
        }
        this.logger.info("====== ROUTES END ======");
    };
    return _Server;
}());
function serveJSONModule(module, ctx) {
    ctx.type = "application/json";
    ctx.body = module;
}
function serveJsModule(module, ctx) {
    ctx.type = "application/javascript";
    ctx.body = "(function() { fugazi.components.modules.descriptor.loaded(" + JSON.stringify(module) + "); })()";
}
function commandHandlerWrapper(handler, ctx, next) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ctx.set("Cache-Control", "no-cache, no-store, must-revalidate");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, handleResponse(ctx, handler(parse(ctx)))];
                case 2:
                    _a.sent();
                    return [3, 4];
                case 3:
                    e_1 = _a.sent();
                    handleError(ctx, e_1);
                    return [3, 4];
                case 4: return [2];
            }
        });
    });
}
function handleError(ctx, error) {
    var message;
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
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(response instanceof Promise)) return [3, 2];
                    return [4, response];
                case 1:
                    response = _a.sent();
                    _a.label = 2;
                case 2:
                    if (response.headers) {
                        map_1.extend(response.headers).forEach(function (value, name) {
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
                    return [2];
            }
        });
    });
}
function getSuccessResponse(response) {
    var value;
    if (response.data instanceof Map) {
        value = map_1.extend(response.data).toObject();
    }
    else {
        value = response.data;
    }
    return {
        status: ResponseStatus.Success,
        value: value
    };
}
function getFailureResponse(response) {
    return {
        status: ResponseStatus.Failure,
        error: response.data
    };
}
//# sourceMappingURL=server.js.map