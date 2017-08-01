"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston = require("winston");
var LoggingBuilder = (function () {
    function LoggingBuilder(parent) {
        this._parent = parent;
    }
    LoggingBuilder.prototype.parent = function () {
        return this._parent;
    };
    LoggingBuilder.prototype.consoleLevel = function (level) {
        this._consoleLevel = level;
        return this;
    };
    LoggingBuilder.prototype.filePath = function (path) {
        this._filePath = path;
        return this;
    };
    LoggingBuilder.prototype.fileLevel = function (level) {
        this._fileLevel = level;
        return this;
    };
    LoggingBuilder.prototype.options = function (options) {
        this._options = options;
        return this;
    };
    LoggingBuilder.prototype.build = function () {
        if (!this._options) {
            var transports = [];
            transports.push(new (winston.transports.Console)({ level: this._consoleLevel || LoggingBuilder.DEFAULT_LEVEL }));
            if (this._filePath) {
                transports.push(new (winston.transports.File)({
                    filename: this._filePath,
                    level: this._fileLevel || LoggingBuilder.DEFAULT_LEVEL,
                    timestamp: true
                }));
            }
            this._options = { transports: transports };
        }
        return new (winston.Logger)(this._options);
    };
    LoggingBuilder.DEFAULT_LEVEL = "info";
    return LoggingBuilder;
}());
exports.LoggingBuilder = LoggingBuilder;
//# sourceMappingURL=logger.js.map