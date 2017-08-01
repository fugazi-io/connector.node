/// <reference types="koa-session" />
/// <reference types="keygrip" />
import * as session from "koa-session";
import * as Koa from "koa";
import Keygrip = require("keygrip");
export declare function middleware(app: Koa, config: Partial<Config>): (context: Koa.Context, next: () => Promise<any>) => any;
export declare type Config = session.sessionConfig & {
    keygrip: Keygrip | string[];
};
export declare type Session = session.sessionProps;
