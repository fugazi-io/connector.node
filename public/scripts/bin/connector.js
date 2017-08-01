"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var map_1 = require("./common/map");
var logger_1 = require("./logger");
var server_1 = require("./server");
var components_1 = require("./components");
var ConnectorBuilder = (function () {
    function ConnectorBuilder() {
        this._server = new server_1.ServerBuilder(this);
        this._logger = new logger_1.LoggingBuilder(this);
        this._modules = new map_1.ExtendedMap();
    }
    ConnectorBuilder.prototype.server = function () {
        return this._server;
    };
    ConnectorBuilder.prototype.logger = function () {
        return this._logger;
    };
    ConnectorBuilder.prototype.module = function (obj) {
        var builder = new components_1.RootModuleBuilder(this, this._server);
        if (typeof obj === "string") {
            this._modules.set(obj, builder);
            builder.name(obj);
        }
        else {
            this._modules.set(obj.name, builder);
            builder.descriptor(obj);
        }
        return builder;
    };
    ConnectorBuilder.prototype.build = function () {
        var logger = this._logger.build();
        var modules = this._modules.map(function (module) {
            return module.build();
        });
        this._server.logger(logger);
        var server = this._server.build();
        return new Connector(logger, server);
    };
    return ConnectorBuilder;
}());
exports.ConnectorBuilder = ConnectorBuilder;
var Connector = (function () {
    function Connector(logger, server) {
        this._server = server;
        this._logger = logger;
    }
    Object.defineProperty(Connector.prototype, "server", {
        get: function () {
            return this._server;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Connector.prototype, "logger", {
        get: function () {
            return this._logger;
        },
        enumerable: true,
        configurable: true
    });
    Connector.prototype.start = function () {
        return this._server.start();
    };
    Connector.prototype.stop = function () {
        return this._server.stop();
    };
    return Connector;
}());
exports.Connector = Connector;
//# sourceMappingURL=connector.js.map