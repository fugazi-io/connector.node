import * as koa from "koa";
export declare const middleware: (routes: any) => (ctx: koa.Context, next: () => Promise<any>) => Promise<any>;
