/// <reference types="winston" />
import * as winston from "winston";
import * as descriptors from "./common/descriptors";
import { LoggingBuilder } from "./logger";
import { ServerBuilder, Server } from "./server";
import { RootModuleBuilder } from "./components";
export declare class ConnectorBuilder {
    private _server;
    private _logger;
    private _modules;
    constructor();
    server(): ServerBuilder;
    logger(): LoggingBuilder;
    module(obj: string | descriptors.Named<Partial<descriptors.Module>>): RootModuleBuilder;
    build(): Connector;
}
export declare class Connector {
    private readonly _server;
    private readonly _logger;
    constructor(logger: winston.LoggerInstance, server: Server);
    readonly server: Server;
    readonly logger: winston.LoggerInstance;
    start(): Promise<void>;
    stop(): Promise<void>;
}
