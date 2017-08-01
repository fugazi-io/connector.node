"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const map_1 = require("./common/map");
const logger_1 = require("./logger");
const server_1 = require("./server");
const components_1 = require("./components");
class ConnectorBuilder {
    constructor() {
        this._server = new server_1.ServerBuilder(this);
        this._logger = new logger_1.LoggingBuilder(this);
        this._modules = new map_1.ExtendedMap();
    }
    server() {
        return this._server;
    }
    logger() {
        return this._logger;
    }
    module(obj) {
        const builder = new components_1.RootModuleBuilder(this, this._server);
        if (typeof obj === "string") {
            this._modules.set(obj, builder);
            builder.name(obj);
        }
        else {
            this._modules.set(obj.name, builder);
            builder.descriptor(obj);
        }
        return builder;
    }
    build() {
        const logger = this._logger.build();
        const modules = this._modules.map(module => {
            return module.build();
        });
        this._server.logger(logger);
        const server = this._server.build();
        return new Connector(logger, server);
    }
}
exports.ConnectorBuilder = ConnectorBuilder;
class Connector {
    constructor(logger, server) {
        this._server = server;
        this._logger = logger;
    }
    get server() {
        return this._server;
    }
    get logger() {
        return this._logger;
    }
    start() {
        return this._server.start();
    }
    stop() {
        return this._server.stop();
    }
}
exports.Connector = Connector;
//# sourceMappingURL=connector.js.map