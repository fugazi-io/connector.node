/// <reference types="winston" />
import * as koa from "koa";
import { LoggerInstance } from "winston";
declare module "koa" {
    interface Context {
        logger(): LoggerInstance;
    }
}
export declare const middleware: (logger: LoggerInstance) => (ctx: koa.Context, next: () => Promise<any>) => Promise<any>;
