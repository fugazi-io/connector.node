/// <reference types="koa-session" />
import * as session from "koa-session";
import * as Koa from "koa";
export declare function middleware(app: Koa, config: Partial<Config>): (context: Koa.Context, next: () => Promise<any>) => any;
export declare type Config = session.sessionConfig;
export declare type Session = session.sessionProps;
