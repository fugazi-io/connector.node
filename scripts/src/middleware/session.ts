import * as session from "koa-session";
import * as Koa from "koa";
import Keygrip = require("keygrip");

// see documentation in https://github.com/koajs/session/blob/master/Readme.md
const DEFAULT_CONFIG = {
	key: 'fugazi:sess',
	maxAge: 'session',
	overwrite: true,
	httpOnly: false,
	signed: true,
	rolling: true,
} as Config;

export function middleware(app: Koa, config: Partial<Config>) {
	return session(Object.assign({}, config, DEFAULT_CONFIG), app);
}

export type Config = session.sessionConfig & { keygrip: Keygrip | string[] };
export type Session = session.sessionProps;
