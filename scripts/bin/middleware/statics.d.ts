import * as koa from "koa";
export declare const middleware: (routes: Map<string, string>) => (ctx: koa.Context, next: () => Promise<any>) => Promise<any>;
