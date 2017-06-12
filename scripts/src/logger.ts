/**
 * Created by nitzan on 20/04/2017.
 */

import * as winston from "winston";
import { ConnectorBuilder } from "./connector";

export type Level = "debug" | "info" | "warning";
export class LoggingBuilder {
	public static readonly DEFAULT_LEVEL = "info";

	private _filePath: string;
	private _fileLevel: Level;
	private _consoleLevel: Level;
	private _parent: ConnectorBuilder;
	private _options: winston.LoggerOptions;

	constructor(parent: ConnectorBuilder) {
		this._parent = parent;
	}

	parent(): ConnectorBuilder {
		return this._parent;
	}

	consoleLevel(level: Level): this {
		this._consoleLevel = level;
		return this;
	}

	filePath(path: string): this {
		this._filePath = path;
		return this;
	}

	fileLevel(level: Level): this {
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
