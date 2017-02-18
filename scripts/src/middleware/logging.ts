/**
 * Created by nitzan on 13/02/2017.
 */

import * as koa from "koa";
import { LoggerInstance } from "winston";

declare module "koa" {
	interface Context {
		logger(): LoggerInstance;
	}
}

export const middleware = (logger: LoggerInstance) => {
	return async (ctx: koa.Context, next: () => Promise<any>) => {
		ctx.logger = function() {
			return logger;
		}

		return next();
	}
};
