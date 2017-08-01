import * as session from "koa-session";
import * as Koa from "koa";
import Keygrip = require("keygrip");

const DEFAULT_CONFIG: Config = {
	// /**
	//  * Hook: valid session value before use it
	//  */
	// valid: function valid(...rest: any[]) {
	// 	console.log('valid', rest.join(','))
	// },
	// /**
	//  * Hook: before save session
	//  */
	// beforeSave: function beforeSave(...rest: any[]) {
	// 	console.log('beforeSave', rest.join(','))
	// },
	key: 'fugazi:sess', /** (string) cookie key (default is koa:sess) */
	/** (number || 'session') maxAge in ms (default is 1 days) */
	/** 'session' will result in a cookie that expires when session/browser is closed */
	/** Warning: If a session cookie is stolen, this cookie will never expire */
	maxAge: 'session',
	overwrite: true, /** (boolean) can overwrite or not (default true) */
	httpOnly: false, /** (boolean) httpOnly or not (default true) */
	signed: true, /** (boolean) signed or not (default true) */
	rolling: true, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
} as any;

export function middleware(app: Koa, config: Partial<Config>) {
	return session(Object.assign({}, config, DEFAULT_CONFIG), app);
}

export type Config = session.sessionConfig & {keygrip:Keygrip | string[]};
export type Session = session.sessionProps;