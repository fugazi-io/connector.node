"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
class LoggingBuilder {
    constructor(parent) {
        this._parent = parent;
    }
    parent() {
        return this._parent;
    }
    consoleLevel(level) {
        this._consoleLevel = level;
        return this;
    }
    filePath(path) {
        this._filePath = path;
        return this;
    }
    fileLevel(level) {
        this._fileLevel = level;
        return this;
    }
    options(options) {
        this._options = options;
        return this;
    }
    build() {
        if (!this._options) {
            const transports = [];
            transports.push(new (winston.transports.Console)({ level: this._consoleLevel || LoggingBuilder.DEFAULT_LEVEL }));
            if (this._filePath) {
                transports.push(new (winston.transports.File)({
                    filename: this._filePath,
                    level: this._fileLevel || LoggingBuilder.DEFAULT_LEVEL,
                    timestamp: true
                }));
            }
            this._options = { transports };
        }
        return new (winston.Logger)(this._options);
    }
}
LoggingBuilder.DEFAULT_LEVEL = "info";
exports.LoggingBuilder = LoggingBuilder;
//# sourceMappingURL=logger.js.map