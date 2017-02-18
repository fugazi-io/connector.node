/**
 * Created by nitzan on 18/02/2017.
 */

import * as koa from "koa";
import * as send from "koa-send";

export const middleware = (routes: Map<string, string>) => {
	return async (ctx: koa.Context, next: () => Promise<any>) => {
		if (routes.has(ctx.path)) {
			return send(ctx, routes.get(ctx.path)!, { root: __dirname + "/../../../" });
		} else {
			return next();
		}
	};
};
