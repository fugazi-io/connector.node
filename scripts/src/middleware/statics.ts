/**
 * Created by nitzan on 18/02/2017.
 */

import * as koa from "koa";
import * as path from "path";
import * as send from "koa-send";

export const middleware = (routes: Map<string, string>) => {
	return async (ctx: koa.Context, next: () => Promise<any>) => {
		if (routes.has(ctx.path)) {
			let file = routes.get(ctx.path)!;

			if (file[0] === "/") {
				const root = file.substring(0, file.lastIndexOf("/"));
				file = file.substring(file.lastIndexOf("/") + 1);
				return send(ctx, file, { root });
			}

			return send(ctx, file, { root: path.join(__dirname, "../../../") });
		} else {
			return next();
		}
	};
};
