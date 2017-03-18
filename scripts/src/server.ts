/**
 * Created by nitzan on 15/02/2017.
 */

import * as fs from "fs";
import * as Koa from "koa";
import * as path from "path";
import * as http from "http";
import * as winston from "winston";

const destroyable = require("server-destroy");
import bodyparser = require("koa-bodyparser");
import * as Router from "koa-router";
import cors = require("kcors");

import { middleware as logging } from "./middleware/logging";
import { middleware as statics } from "./middleware/statics";
import * as descriptors from "./descriptors";
import { Future } from "./types";

const pathFor = path.join.bind(path, __dirname, "../../");

// needed so that the Request object will have the body property
export { bodyparser as bodyparser };

export type CommandHandlerContext = Router.IRouterContext & {};
export type CommandHandler = (ctx: CommandHandlerContext, next: () => Promise<any>) => any;

export type CommandEndpoint = {
	method: string;
	handler: CommandHandler;
}

export type Endpoints = {
	readonly files: Map<string, string>;
	readonly commands: Map<string, CommandEndpoint>;
	readonly raw: Map<string, descriptors.NamedModule>;
	readonly roots: Map<string, descriptors.RootModule>;
}
export type EndpointsProvider = () => Endpoints;

export class Builder {
	public static readonly DEFAULT_HOST = "localhost";
	public static readonly DEFAULT_PORT = 3333;

	private _port: number;
	private _host: string;
	private _cors: boolean;
	private _corsOptions: cors.Options;
	private _logger: winston.LoggerInstance;
	private _staticFiles: Map<string, string>;
	private _endpointsProvider: EndpointsProvider;

	constructor(provider: EndpointsProvider) {
		this._staticFiles = new Map();
		this._endpointsProvider = provider;
	}

	port(port: number): this {
		this._port = port;
		return this;
	}

	host(host: string): this {
		this._host = host;
		return this;
	}

	cors(cors: boolean | cors.Options): this {
		if (!cors) {
			this._cors = false;
		} else {
			this._cors = true;

			if (typeof cors !== "boolean") {
				this._corsOptions = cors;
			}
		}

		return this;
	}

	serve(urlPath: string, filePath: string): this {
		this._staticFiles.set(urlPath, filePath);
		return this;
	}

	logger(logger: winston.LoggerInstance): this {
		this._logger = logger;
		return this;
	}

	build(): Server {
		this._host = this._host || Builder.DEFAULT_HOST;
		this._port = this._port || Builder.DEFAULT_PORT;

		let corsOptions = null;
		if (this._cors === undefined) {
			this._cors = true;
		}

		if (this._cors) {
			if (typeof this._cors === "boolean") {
				corsOptions = {} as cors.Options;
			} else {
				corsOptions = this._corsOptions;
			}
		}

		const endpoints = this.endpoints();

		return new ServerImpl(this._logger, this._host, this._port, endpoints, corsOptions);
	}

	private endpoints(): ServerEndpoints {
		const endpoints = Object.assign({}, this._endpointsProvider()) as ServerEndpoints;
		const remote: descriptors.RemoteDescriptor = {
			origin: `http://localhost:${ this._port }`
		};

		if (!this._cors) {
			remote.proxy = "/proxyframe.html"
			endpoints.proxy = {
				path: "/proxyframe.html",
				file: "./public/proxyframe.html"
			};
		}

		endpoints.roots.forEach(value => {
			Object.assign(value, { remote: Object.assign({}, remote, { base: value.remote ? value.remote.base : "/" } ) });
		});

		this._staticFiles.forEach((file, url) => {
			endpoints.files.set(url, file);
		});

		return endpoints;
	}
}

export interface Server {
	start(): Promise<Server>;
	stop(): Promise<Server>;
}

type ServerEndpoints = Endpoints & { proxy?: { path: string, file: string  } };
class ServerImpl implements Server {
	private koa: Koa;
	private port: number;
	private host: string;
	private router: Router;
	private endpoints: ServerEndpoints;
	private server: http.Server | null;
	private logger: winston.LoggerInstance;
	private corsOptions: cors.Options | null;

	constructor(logger: winston.LoggerInstance, host: string, port: number, endpoints: ServerEndpoints, corsOptions: cors.Options | null) {
		this.host = host;
		this.port = port;
		this.logger = logger;
		this.endpoints = endpoints;
		this.corsOptions = corsOptions;
	}

	start() {
		const future = new Future<Server>();

		this.koa = new Koa();
		this.setupLogging();
		this.setupStatics();
		this.setupCors();

		this.koa.use(bodyparser());

		this.setupRoutes();

		this.server = this.koa.listen(this.port, this.host, () => {
			this.logger.info(`server started. listening on ${ this.host }:${ this.port }`);
			this.logger.info("you can load the following urls from any fugazi terminal:");
			for (let path of this.endpoints.roots.keys()) {
				this.logger.info(`http://localhost:${ this.port }${ path }`);
			}
			future.resolve(this);
		});
		destroyable(this.server);

		return future.asPromise();
	}

	stop() {
		const future = new Future<Server>();
		(this.server as http.Server & { destroy: (cb: () => void) => void }).destroy(future.resolve.bind(future));

		return future.asPromise();
	}

	private setupLogging() {
		// add middleware
		this.koa.use(logging(this.logger));

		// log requests
		this.koa.use((ctx: Koa.Context, next: () => Promise<any>) => {
			ctx.logger().info(`${ ctx.request.href } handling started`);

			return next().then(value => {
				ctx.logger().info(`${ ctx.request.href } handling finished`);
				return value;
			});
		});
	}

	private setupStatics() {
		const routes = new Map<string, string>();
		const appender = ({ path, file }: { path: string; file: string }) => {
			if (file[0] !== "/") {
				file = pathFor(file);
			}

			if (!fs.existsSync(file)) {
				throw new Error(`file for path "${ path } " doesn't exist in "${ file }"`);
			}

			routes.set(path, file);
		}

		if (this.endpoints.proxy) {
			appender(this.endpoints.proxy);
		}

		if (this.endpoints.files) {
			this.endpoints.files.forEach((file, path) => {
				appender({ path, file });
			});
		}

		this.koa.use(statics(routes));
	}

	private setupCors() {
		if (this.corsOptions) {
			this.koa.use(cors(this.corsOptions));
		}
	}

	private setupRoutes() {
		this.router = new Router();

		this.endpoints.raw.forEach((module, path) => {
			this.router.get(path, this.serveModule.bind(this, module));
		});

		this.endpoints.roots.forEach((module, path) => {
			this.router.get(path, this.serveModule.bind(this, module));
		});

		this.endpoints.commands.forEach((command, path) => {
			this.router.register(path, [command.method], commandHandlerWrapper.bind(null, command.handler));
		});

		this.koa
			.use(this.router.routes())
			.use(this.router.allowedMethods());
	}

	private serveModule(module: descriptors.NamedModule, ctx: Koa.Context) {
		ctx.type = "application/json";
		ctx.body = module;
	}
}

function commandHandlerWrapper(handler: CommandHandler, ctx: CommandHandlerContext, next: () => Promise<any>) {
	ctx.set("Cache-Control", "no-cache, no-store, must-revalidate");
	return handler(ctx, next);
}
