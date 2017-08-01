/// <reference types="winston" />
import * as winston from "winston";
import { ConnectorBuilder } from "./connector";
export declare type LoggingLevel = "debug" | "info" | "warning";
export declare class LoggingBuilder {
    static readonly DEFAULT_LEVEL: string;
    private _filePath;
    private _fileLevel;
    private _consoleLevel;
    private _parent;
    private _options;
    constructor(parent: ConnectorBuilder);
    parent(): ConnectorBuilder;
    consoleLevel(level: LoggingLevel): this;
    filePath(path: string): this;
    fileLevel(level: LoggingLevel): this;
    options(options: winston.LoggerOptions): this;
    build(): winston.LoggerInstance;
}
