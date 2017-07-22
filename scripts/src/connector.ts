/**
 * Created by nitzan on 02/06/2017.
 */

import * as winston from "winston";

import { ExtendedMap } from "./common/map";
import * as descriptors from "./common/descriptors";

import { LoggingBuilder } from "./logger";
import { ServerBuilder, Server } from "./server";
import { RootModuleBuilder } from "./components";

export class ConnectorBuilder {
	private _server: ServerBuilder;
	private _logger: LoggingBuilder;
	private _modules: ExtendedMap<string, RootModuleBuilder>;

	constructor() {
		this._server = new ServerBuilder(this);
		this._logger = new LoggingBuilder(this);
		this._modules = new ExtendedMap<string, RootModuleBuilder>();
	}

	server() {
		return this._server;
	}

	logger() {
		return this._logger;
	}

	module(obj: string | descriptors.Named<Partial<descriptors.Module>>): RootModuleBuilder {
		const builder = new RootModuleBuilder(this, this._server);

		if (typeof obj === "string") {
			this._modules.set(obj, builder);
			builder.name(obj);
		} else {
			this._modules.set(obj.name, builder);
			builder.descriptor(obj);
		}

		return builder;
	}

	build(): Connector {
		const logger = this._logger.build();
		const modules = this._modules.map(module => {
			return module.build();
		});

		this._server.logger(logger);
		const server = this._server.build();

		return new Connector(logger, server);
	}
}

export class Connector {
	private readonly _server: Server;
	private readonly _logger: winston.LoggerInstance;

	constructor(logger: winston.LoggerInstance, server: Server) {
		this._server = server;
		this._logger = logger;
	}

	get server() {
		return this._server;
	}

	get logger() {
		return this._logger;
	}

	start(): Promise<void> {
		return this._server.start();
	}

	stop(): Promise<void> {
		return this._server.stop();
	}
}
