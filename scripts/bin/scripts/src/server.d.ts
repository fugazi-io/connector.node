/// <reference types="winston" />
/// <reference types="kcors" />
import Cors = require("kcors");
import * as winston from "winston";
import * as descriptors from "./common/descriptors";
import { ExtendedMap } from "./common/map";
import { Session } from "./middleware/session";
import { ConnectorBuilder } from "./connector";
export declare type HttpMethod = "get" | "GET" | "put" | "PUT" | "post" | "POST" | "delete" | "DELETE";
export declare type RequestDataGetter<T> = {
    (name: string): T;
    has(name: string): boolean;
};
export declare type RequestData = RequestDataGetter<string | any> & {
    body: RequestDataGetter<any>;
    path: RequestDataGetter<string>;
    search: RequestDataGetter<string>;
};
export declare type Request = {
    session: Session;
    path: string;
    data: RequestData;
    headers: ExtendedMap<string, string>;
};
export declare enum ResponseStatus {
    Success = 0,
    Failure = 1,
}
export declare type Response = {
    headers?: {
        [name: string]: string;
    } | Map<string, string>;
    status?: ResponseStatus;
    data?: any;
};
export declare type CommandHandler = (request: Request) => Response | Promise<Response>;
export declare function isCommandHandler(obj: any): obj is CommandHandler;
export declare type CommandEndpoint = {
    path: string;
    method: HttpMethod;
    handler: CommandHandler;
};
export declare class ServerBuilder {
    static readonly DEFAULT_HOST: string;
    static readonly DEFAULT_PORT: number;
    private static readonly PROXY_PATH;
    private _parent;
    private _logger;
    private _port;
    private _host;
    private _proxy;
    private _cors;
    private _files;
    private _commands;
    private _modules;
    constructor(parent: ConnectorBuilder);
    logger(logger: winston.LoggerInstance): this;
    port(port: number): this;
    host(host: string): this;
    cors(cors: boolean | Cors.Options): this;
    proxy(proxy: boolean): this;
    file(urlPath: string, filePath: string): this;
    module(descriptor: descriptors.NamedModule): this;
    command(command: CommandEndpoint): this;
    parent(): ConnectorBuilder;
    build(): Server;
    getOrigin(): string;
    getUrlFor(relativePath: string): string;
    getProxy(): string | null;
    private prepareFiles();
    private getPort();
    private getHost();
}
export interface Server {
    start(): Promise<void>;
    stop(): Promise<void>;
}
