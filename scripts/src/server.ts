/**
 * Created by nitzan on 15/02/2017.
 */

import Cors = require("kcors");
import bodyparser = require("koa-bodyparser");
const destroyable = require("server-destroy");

import * as fs from "fs";
import * as Koa from "koa";
import * as path from "path";
import * as http from "http";
import * as winston from "winston";
import * as Router from "koa-router";

import * as descriptors from "./common/descriptors";
import { ExtendedMap, extend as extendMap } from "./common/map";
import { ExtendedArray } from "./common/array";

import { middleware as statics } from "./middleware/statics";
import { middleware as logging } from "./middleware/logging";

import { ConnectorBuilder } from "./connector";

export type HttpMethod = "get" | "GET" | "put" | "PUT" | "post" | "POST" | "delete" | "DELETE";

export type RequestDataGetter = {
	(name: string): string;
	has(name: string): boolean;
}

export type RequestData = RequestDataGetter & {
	body: RequestDataGetter;
	path: RequestDataGetter;
	search: RequestDataGetter;
}
export type Request = {
	path: string;
	data: RequestData;
	headers: ExtendedMap<string, string>;
}
export enum ResponseStatus {
	Success,
	Failure
}
export type Response = {
	headers?: { [name: string]: string } | Map<string, string>;
	status?: ResponseStatus;
	data?: any;
}
function createRequestData(body: ExtendedMap<string, string>, path: ExtendedMap<string, string>, search: ExtendedMap<string, string>): RequestData {
	const data = function(name: string): string {
		if (body.has(name)) {
			return body.get(name)!;
		}

		if (path.has(name)) {
			return path.get(name)!;
		}

		return search.get(name)!;
	} as RequestData;

	data.has = function(name: string): boolean {
		return body.has(name) || path.has(name) || search.has(name);
	}

	data.body = body.get.bind(body);
	data.body.has = body.has.bind(body);

	data.path = path.get.bind(path);
	data.path.has = path.has.bind(path);

	data.search = search.get.bind(search);
	data.search.has = search.has.bind(search);

	return data;
}
function parse(ctx: Router.IRouterContext): Request {
	const body = new ExtendedMap<string, string>();
	const path = new ExtendedMap<string, string>();
	const search = new ExtendedMap<string, string>();
	const headers = new ExtendedMap<string, string>();

	Object.keys(ctx.headers).forEach(key => {
		headers.set(key, ctx.headers[key]);
	});

	if (ctx.params) {
		Object.keys(ctx.params).forEach(key => {
			path.set(key, ctx.params[key]);
		});
	}

	if (ctx.query) {
		Object.keys(ctx.query).forEach(key => {
			search.set(key, ctx.query[key]);
		});
	}

	if (ctx.request.body) {
		Object.keys(ctx.request.body).forEach(key => {
			body.set(key, ctx.request.body[key]);
		});
	}

	return {
		headers,
		path: ctx.path,
		data: createRequestData(body, path, search)
	};
}

/**
 * Handles a request and returns a response or throw if something went wrong
 */
export type CommandHandler = (request: Request) => Response | Promise<Response>;
export function isCommandHandler(obj: any): obj is CommandHandler {
	return obj instanceof Function;
}

export type CommandEndpoint = {
	path: string;
	method: HttpMethod;
	handler: CommandHandler;
}

const pathFor = path.join.bind(path, __dirname, "../../../");

type Route = {
	type: "command" | "root-module";
	path: string;
	method: HttpMethod;
	handler: Router.IMiddleware
};

export class ServerBuilder {
	public static readonly DEFAULT_HOST = "localhost";
	public static readonly DEFAULT_PORT = 3333;

	private static readonly PROXY_PATH = "/proxyframe";

	private _parent: ConnectorBuilder;
	private _logger: winston.LoggerInstance;
	private _port: number;
	private _host: string;
	private _proxy: boolean;
	private _cors: false | Cors.Options;
	private _files: ExtendedMap<string, string>;
	private _commands: ExtendedArray<CommandEndpoint>;
	private _modules: ExtendedMap<string, descriptors.NamedModule>;

	constructor(parent: ConnectorBuilder) {
		this._parent = parent;
		this._files = new ExtendedMap<string, string>(),
		this._commands = new ExtendedArray<CommandEndpoint>(),
		this._modules = new ExtendedMap<string, descriptors.NamedModule>();
	}

	logger(logger: winston.LoggerInstance): this {
		this._logger = logger;
		return this;
	}

	port(port: number): this {
		this._port = port;
		return this;
	}

	host(host: string): this {
		this._host = host;
		return this;
	}

	cors(cors: boolean | Cors.Options): this {
		if (!cors) {
			this._cors = false;
		} else {
			if (typeof cors === "boolean") {
				this._cors = {} as Cors.Options;
			} else {
				this._cors = cors;
			}
		}

		return this;
	}

	proxy(proxy: boolean): this {
		this._proxy = proxy;
		return this;
	}

	file(urlPath: string, filePath: string): this {
		this._files.set(urlPath, filePath);
		return this;
	}

	module(descriptor: descriptors.NamedModule): this {
		this._modules.set(descriptor.name, descriptor);
		return this;
	}

	command(command: CommandEndpoint): this {
		this._commands.push(command);
		return this;
	}

	parent(): ConnectorBuilder {
		return this._parent;
	}

	build(): Server {
		const routes = [] as Route[];

		this._modules.forEach((descriptor, name) => routes.push({
			type: "root-module",
			path: `/${ name }.json`,
			method: "get",
			handler: serveModule.bind(this, descriptor)
		}));
		this._commands.forEach(command => routes.push({
			type: "command",
			path: command.path,
			method: command.method,
			handler: commandHandlerWrapper.bind(null, command.handler)
		}));

		if (this._cors == null) {
			this.cors(true);
		}

		return new _Server(
			this.getHost(),
			this.getPort(),
			this._cors,
			this._logger,
			this.prepareFiles(),
			routes
		);
	}

	getOrigin(): string {
		return `http://${ this.getHost() }:${ this.getPort() }`;
	}

	getUrlFor(relativePath: string): string {
		return this.getOrigin() + (relativePath.startsWith("/") ? relativePath : "/" + relativePath);
	}

	getProxy(): string | null {
		return this._proxy ? ServerBuilder.PROXY_PATH : null;
	}

	private prepareFiles(): Map<string, string> {
		const routes = new Map<string, string>();

		if (this._proxy) {
			this._files.set(ServerBuilder.PROXY_PATH, "../../../public/proxyframe.html");
		}

		this._files.forEach((file, path) => {
			if (file[0] !== "/") {
				file = pathFor(file);
			}

			if (!fs.existsSync(file)) {
				throw new Error(`file for path "${ path } " doesn't exist in "${ file }"`);
			}

			routes.set(path, file);
		});

		return routes;
	}

	private getPort(): number {
		return this._port || ServerBuilder.DEFAULT_PORT;
	}

	private getHost(): string {
		return this._host || ServerBuilder.DEFAULT_HOST;
	}
}

export interface Server {
	start(): Promise<void>;
	stop(): Promise<void>;
}

class _Server implements Server {
	private koa: Koa;
	private port: number;
	private host: string;
	private router: Router;
	private server: http.Server | null;
	private logger: winston.LoggerInstance;

	constructor(host: string,
				port: number,
				cors: false | Cors.Options,
				logger: winston.LoggerInstance,
				files: Map<string, string>,
				routes: Route[]) {
		this.host = host;
		this.port = port;
		this.logger = logger;

		this.koa = new Koa();
		this.setupLogging();

		if (cors) {
			this.koa.use(Cors(cors));
		}

		this.koa.use(statics(files));

		this.koa.use(bodyparser());

		this.router = new Router();
		this.setupRoutes(routes);
		this.koa
			.use(this.router.routes())
			.use(this.router.allowedMethods());

		this.logRoutes(routes, files);
	}

	start(): Promise<void> {
		return new Promise<void>(resolve => {
			this.server = this.koa.listen(this.port, this.host, () => {
				this.logger.info(`server started. listening on ${ this.host }:${ this.port }`);
				resolve();
			});
		});
	}

	stop(): Promise<void> {
		return new Promise<void>(resolve => {
			destroyable(this.server).destroy(resolve);
		});
	}

	private setupLogging() {
		// add middleware
		this.koa.use(logging(this.logger));

		// log requests
		this.koa.use((ctx: Koa.Context, next: () => Promise<any>) => {
			ctx.logger().info(`${ ctx.request.href } handling started`);

			return next().then(value => {
				ctx.logger().info(`${ ctx.request.href } handling finished with ${ ctx.response.status }`);
				return value;
			});
		});
	}

	private setupRoutes(routes: Route[]) {
		//TODO: this should be done using the logger
		//console.log("serving routes:");
		routes.forEach(route => {
			//console.log(`${ route.method } : ${ route.path }`);
			switch (route.method.toLocaleLowerCase()) {
				case "get":
					this.router.get(route.path, route.handler);
					break;

				case "put":
					this.router.put(route.path, route.handler);
					break;

				case "post":
					this.router.post(route.path, route.handler);
					break;

				case "delete":
					this.router.delete(route.path, route.handler);
					break;
			}
		});
	}

	private logRoutes(routes: Route[], files: Map<string, string>): void {
		this.logger.info("===== ROUTES START =====");

		if (files.size > 0) {
			this.logger.info("# Files:");
			for (const path of files.keys()) {
				this.logger.info("    " + path);
			}
		}

		const commands = routes.filter(route => route.type === "command");
		if (commands.length > 0) {
			this.logger.info("# Commands:");
			commands.forEach(route => this.logger.info(`    ${ route.method } : ${ route.path }`));
		}

		const modules = routes.filter(route => route.type === "root-module");
		if (modules.length > 0) {
			this.logger.info("# Root modules:");
			modules.forEach(route => this.logger.info(`    ${ route.path }`));
		}

		this.logger.info("====== ROUTES END ======");
	}
}

function serveModule(module: descriptors.NamedModule, ctx: Koa.Context) {
	ctx.type = "application/json";
	ctx.body = module;
}

async function commandHandlerWrapper(handler: CommandHandler, ctx: Router.IRouterContext, next: () => Promise<any>) {
	ctx.set("Cache-Control", "no-cache, no-store, must-revalidate");

	try {
		await handleResponse(ctx, handler(parse(ctx)));
	} catch (e) {
		handleError(ctx, e);
	}
}

function handleError(ctx: Router.IRouterContext, error: any) {
	let message: string;

	if (typeof error === "string") {
		message = error;
	} else if (error instanceof Error) {
		message = error.message;
	} else {
		message = error.toString();
	}

	ctx.type = "application/json";
	ctx.status = 400;
	ctx.body = {
		status: ResponseStatus.Failure,
		error: message
	};
}

async function handleResponse(ctx: Router.IRouterContext, response: Response | Promise<Response>) {
	if (response instanceof Promise) {
		response = await response;
	}

	if (response.headers) {
		extendMap(response.headers).forEach((value, name) => {
			ctx.set(name, value);
		});
	}

	ctx.type = "application/json";
	if (response.status === ResponseStatus.Success) {
		ctx.body = getSuccessResponse(response);
	} else {
		ctx.body = getFailureResponse(response);
	}
}

function getSuccessResponse(response: Response) {
	let value: any;
	if (response.data instanceof Map) {
		value = extendMap(response.data).toObject();
	} else {
		value = response.data;
	}


	return {
		status: ResponseStatus.Success,
		value
	}
}

function getFailureResponse(response: Response) {
	return {
		status: ResponseStatus.Failure,
		error: response.data
	}
}
