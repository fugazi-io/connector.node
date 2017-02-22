/**
 * Created by nitzan on 16/02/2017.
 */

import * as winston from "winston";

import { Future, FugMap } from "./types";
import * as server from "./server";
import * as descriptors from "./descriptors";

export type LogLevel = "debug" | "info" | "warning";
export class LoggingBuilder {
	public static readonly DEFAULT_LEVEL = "info";

	private _filePath: string;
	private _fileLevel: LogLevel;
	private _consoleLevel: LogLevel;
	private _options: winston.LoggerOptions;

	consoleLevel(level: LogLevel): this {
		this._consoleLevel = level;
		return this;
	}

	filePath(path: string): this {
		this._filePath = path;
		return this;
	}

	fileLevel(level: LogLevel): this {
		this._fileLevel = level;
		return this;
	}

	options(options: winston.LoggerOptions): this {
		this._options = options;
		return this;
	}

	build(): winston.LoggerInstance {
		if (!this._options) {
			const transports: winston.TransportInstance[] = [];
			transports.push(new (winston.transports.Console)({level: this._consoleLevel || LoggingBuilder.DEFAULT_LEVEL}));

			if (this._filePath) {
				transports.push(new (winston.transports.File)({
					filename: this._filePath,
					level: this._fileLevel || LoggingBuilder.DEFAULT_LEVEL,
					timestamp: true
				}));
			}

			this._options = { transports };
		}

		return new (winston.Logger)(this._options);
	}
}

const EchoModule = {
	name: "examples.remote.",
	title: "Remote example",
	remote: { origin: "", base: "examples/remote/" },
	description: "Example of a (echo) remote command using the node connector",
	commands: {
		echo: {
			title: "Echo command",
			returns: "string",
			syntax: "remote echo (str string)",
			handler: {
				endpoint: "echo"
			}
		}
	}
} as descriptors.RootModule;

export { CommandHandler, CommandHandlerContext } from "./server";
export * from "./descriptors"

export class Builder {
	public static readonly DEFAULT_ROOT_PATH = "descriptor.json";

	private readonly _server: server.Builder;
	private readonly _logging: LoggingBuilder;
	private readonly _commands: Map<string, server.CommandEndpoint>;
	private readonly _rootModules: FugMap<string, descriptors.RootModule>;
	private readonly _modules: FugMap<string, string | descriptors.NamedModule>;

	constructor() {
		this._commands = new Map();
		this._logging = new LoggingBuilder();
		this._server = new server.Builder(this.endpoints);
		this._rootModules = new FugMap<string, descriptors.RootModule>();
		this._modules = new FugMap<string, string | descriptors.NamedModule>();
	}

	server() {
		return this._server;
	}

	logging(): LoggingBuilder {
		return this._logging;
	}

	module(path: string, file: string): this;
	module(path: string, module: descriptors.RootModule, root: true): this;
	module(path: string, module: descriptors.NamedModule, root?: false): this;
	module(path: string, descriptor: string | descriptors.NamedModule | descriptors.RootModule, root: boolean = false) {
		(root ? this._rootModules : this._modules).set(path, descriptor);
		return this;
	}

	command(path: string, method: string, handler: server.CommandHandler): this {
		this._commands.set(path, { method, handler });
		return this;
	}

	build(): Connector {
		if (this._rootModules.empty()) {
			this.module("/examples/remote/descriptor.json", EchoModule, true);
			this.command("/examples/remote/echo", "get", (ctx) => {
				ctx.body = ctx.request.query.str;
			});
		}

		const logger = this._logging.build();
		this._server.logger(logger);

		const server = this._server.build();

		return new ConnectorImpl(logger, server);
	}

	private endpoints = (): server.Endpoints => {
		let endpoints: server.Endpoints = {
			raw: this._modules.filter<descriptors.NamedModule>(value => typeof value !== "string"),
			files: this._modules.filter<string>(value => typeof value === "string"),
			roots: this._rootModules,
			commands: this._commands
		};

		return endpoints;
	}
}

export interface Connector {
	readonly server: server.Server;
	readonly logger: winston.LoggerInstance;

	start(): Promise<Connector>;
}

class ConnectorImpl implements Connector {
	private readonly _server: server.Server;
	private readonly _logger: winston.LoggerInstance;

	constructor(logger: winston.LoggerInstance, server: server.Server) {
		this._logger = logger;
		this._server = server;
	}

	get server() {
		return this._server;
	}

	get logger() {
		return this._logger;
	}

	start() {
		const future = new Future<Connector>();
		this._server.start().then(() => future.resolve(this));

		process.on("SIGINT", cleanup.bind(null, this._logger));
		process.on("SIGTERM", cleanup.bind(null, this._logger));

		return future.asPromise();
	}

	stop() {
		return this._server.stop();
	}
}

function cleanup(logger: winston.LoggerInstance) {
	logger.info("Closing...");
	process.exit(1);
}

if (require.main === module) {
	const builder = new Builder();
	const connector = builder.build();
	connector.start();
}
