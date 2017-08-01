/// <reference types="koa-session" />
import * as session from "koa-session";
import * as Koa from "koa";
export declare function middleware(app: Koa): (context: Koa.Context, next: () => Promise<any>) => any;
export declare type Session = session.sessionProps;
