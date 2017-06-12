/**
 * Created by nitzan on 01/05/2017.
 */

import { ExtendedMap } from "./common/map";
import { ExtendedArray } from "./common/array";
import * as descriptors from "./common/descriptors";

import { ConnectorBuilder } from "./connector";
import * as server from "./server";

export abstract class ComponentBuilder<P, C extends descriptors.Component> {
	protected _parent: P;
	protected _name: string | undefined;
	protected _title: string | undefined;
	protected _description: string | undefined;
	protected _server: server.ServerBuilder;

	protected constructor(parent: P, serverBuilder: server.ServerBuilder) {
		this._parent = parent;
		this._server = serverBuilder;
	}

	parent(): P {
		return this._parent;
	}

	name(name: string): this {
		this._name = name;
		return this;
	}

	title(title: string): this {
		this._title = title;
		return this;
	}

	description(description: string): this {
		this._description = description;
		return this;
	}

	descriptor(descriptor: C): this {
		if (!this._name || descriptor.name) {
			this._name = descriptor.name;
		}

		this._title = descriptor.title;
		this._description = descriptor.description;

		return this;
	}

	path(): ExtendedArray<string> {
		return (this._parent as any as ComponentBuilder<any, any>).path().concat(this._name!);
	}

	build(): descriptors.Named<C> {
		if (!this._name) {
			throw new Error("name missing");
		}

		return {
			name: this._name,
			title: this._title || this._name,
			description: this._description
		} as descriptors.Named<C>;
	}
}

export class TypeBuilder extends ComponentBuilder<ModuleBuilder, descriptors.Type> {
	private _type: string | descriptors.TypeDefinition;

	constructor(parent: ModuleBuilder, serverBuilder: server.ServerBuilder) {
		super(parent, serverBuilder);
	}

	descriptor(value: Partial<descriptors.Type>): this {
		super.descriptor(value as descriptors.Type);
		this._type = value.type!;

		return this;
	}

	type(value: string | descriptors.TypeDefinition): this {
		this._type = value;
		return this;
	}

	build(): descriptors.Named<descriptors.Type> {
		const descriptor = super.build();
		descriptor.type = this._type;

		return descriptor;
	}
}

export class RemoteCommandBuilder extends ComponentBuilder<ModuleBuilder, descriptors.RemoteCommand> {
	public static readonly DEFAULT_METHOD = "GET";
	public static readonly DEFAULT_RETURNS = "GET";

	private _endpoint: string | undefined;
	private _syntax: ExtendedArray<string>;
	private _handler: server.CommandHandler;
	private _returns: string;
	private _method: server.HttpMethod | undefined;

	constructor(parent: ModuleBuilder, serverBuilder: server.ServerBuilder) {
		super(parent, serverBuilder);
		this._syntax = new ExtendedArray<string>();
	}

	descriptor(descriptor: Partial<descriptors.RemoteCommand>): this {
		super.descriptor(descriptor as descriptors.RemoteCommand);

		if (typeof descriptor.syntax === "string") {
			this._syntax.push(descriptor.syntax);
		} else if (descriptor.syntax instanceof Array) {
			this._syntax.push(...descriptor.syntax);
		}

		if (descriptor.handler) {
			this._endpoint = descriptor.handler.endpoint;
			this._method = descriptor.handler.method as server.HttpMethod;
		}

		return this;
	}

	syntax(...rules: string[]): this {
		this._syntax.push(...rules);
		return this;
	}

	endpoint(path: string): this {
		this._endpoint = path;
		return this;
	}

	method(value: server.HttpMethod): this {
		this._method = value;
		return this;
	}

	handler(fn: server.CommandHandler): this {
		this._handler = fn;
		return this;
	}

	returns(type: string): this {
		this._returns = type;
		return this;
	}

	build(): descriptors.NamedRemoteCommand {
		const method = this._method || RemoteCommandBuilder.DEFAULT_METHOD;
		let endpoint: string;
		if (this._endpoint) {
			endpoint = this._endpoint.startsWith("/") ? this._endpoint : "/" + this._endpoint;
		} else {
			endpoint = "/" + this.path().join("/");
		}

		const descriptor = super.build();

		descriptor.returns = this._returns || "any";
		descriptor.syntax = this._syntax;
		descriptor.handler = {
			method,
			endpoint
		};

		this._server.command({
			method,
			path: endpoint,
			handler: this._handler
		});

		return descriptor;
	}
}

type ComponentType = "type" | "module" | "command" | "converter" | "constraint";
type FileHandler = {
	path: string;
	file: string;
	type: ComponentType;
};

export abstract class ModuleBuilder<P = any, C extends descriptors.Module = descriptors.Module> extends ComponentBuilder<P, C>{
	private _files: ExtendedArray<FileHandler>;
	private _types: ExtendedMap<string, TypeBuilder>;
	private _commands: ExtendedMap<string, RemoteCommandBuilder>;

	constructor(parent: P, serverBuilder: server.ServerBuilder) {
		super(parent, serverBuilder);

		this._files = new ExtendedArray<FileHandler>();
		this._types = new ExtendedMap<string, TypeBuilder>();
		this._commands = new ExtendedMap<string, RemoteCommandBuilder>();
	}

	descriptor(descriptor: Partial<descriptors.Module>): this {
		super.descriptor(descriptor as C);

		if (descriptor.types) {
			descriptors.collectionIterator(descriptor.types).forEach((type) => {
				if (typeof type === "string") {
					this.types(type);
				} else {
					this.type(type);
				}
			});
		}

		if (descriptor.commands) {
			descriptors.collectionIterator(descriptor.commands).forEach((command) => {
				if (typeof command === "string") {
					this.commands(command);
				} else {
					this.command(command as descriptors.NamedRemoteCommand);
				}
			});
		}

		return this;
	}

	type(name: string): TypeBuilder;
	type(descriptor: descriptors.NamedType): this;
	type(name: string, descriptor: descriptors.Type): this;
	type(first: string | descriptors.NamedType, second?: descriptors.Type): this | TypeBuilder {
		let name: string,
			descriptor: descriptors.NamedType | undefined,
			builder: TypeBuilder;

		if (second) {
			name = first as string;
			descriptor = Object.assign({}, second) as descriptors.NamedType;
			descriptor.name = name;
		} else if (typeof first === "string") {
			name = first;
		} else {
			name = first.name;
			descriptor = Object.assign({}, first);
		}

		if (this._types.has(name)) {
			builder = this._types.get(name)!;
		} else {
			builder = new TypeBuilder(this, this._server);
			this._types.set(name, builder);
		}

		if (descriptor) {
			builder.descriptor(descriptor);
			return this;
		}

		return builder;
	}

	types(file: string): this;
	types(endpoint: string, file: string): this;
	types(first: string, second?: string): this {
		return this.file("type", first, second!);
	}

	command(descriptor: descriptors.NamedRemoteCommand, handler?: server.CommandHandler): this;
	command(name: string, descriptor?: Partial<descriptors.RemoteCommand>, handler?: server.CommandHandler): RemoteCommandBuilder;
	command(first: string | descriptors.NamedRemoteCommand, second?: descriptors.RemoteCommand | server.CommandHandler, third?: server.CommandHandler): this | RemoteCommandBuilder {
		let name: string;
		let handler: server.CommandHandler | undefined;
		let descriptor: Partial<descriptors.RemoteCommand> | undefined;

		if (typeof first === "string") {
			name = first;
			handler = third;
			descriptor = second || {};
			descriptor.name = name;
		} else {
			name = first.name;
			handler = second as server.CommandHandler | undefined;
			descriptor = first;
		}


		let builder = new RemoteCommandBuilder(this, this._server);
		if (descriptor) {
			builder.descriptor(descriptor);
		}

		this._commands.set(name, builder);
		return typeof first === "string" ? builder : this;
	}

	commands(file: string): this;
	commands(endpoint: string, file: string): this;
	commands(first: string, second?: string): this {
		return this.file("command", first, second!);
	}

	converters(file: string): this;
	converters(endpoint: string, file: string): this;
	converters(first: string, second?: string): this {
		return this.file("converter", first, second!);
	}

	constraints(file: string): this;
	constraints(endpoint: string, file: string): this;
	constraints(first: string, second?: string): this {
		return this.file("constraint", first, second!);
	}

	build(): descriptors.Named<C> {
		this._files.forEach(file => {
			this._server.file(file.path, file.file);
		});

		const descriptor = super.build();

		const typeFiles = this._files.filter(file => file.type === "type");
		if (!typeFiles.empty()) {
			descriptor.types = [];

			this._types.forEach(type => (descriptor.types as Array<string | descriptors.NamedType>).push(type.build()));
			typeFiles.forEach(file => (descriptor.types as Array<string | descriptors.NamedType>).push(file.path));
		} else if (!this._types.empty()) {
			descriptor.types = {};
			this._types.forEach(typeBuilder => {
				const type = typeBuilder.build();
				(descriptor.types as descriptors.ComponentMap<descriptors.Type>)[type.name] = type;
			});
		}

		const commandFiles = this._files.filter(file => file.type === "command");
		if (!commandFiles.empty()) {
			descriptor.commands = [];

			this._commands.forEach(command => (descriptor.commands as Array<string | descriptors.NamedRemoteCommand>).push(command.build()));
			commandFiles.forEach(file => (descriptor.commands as Array<string | descriptors.NamedRemoteCommand>).push(file.path));
		} else if (!this._commands.empty()) {
			descriptor.commands = {};
			this._commands.forEach(commandBuilder => {
				const command = commandBuilder.build();
				(descriptor.commands as descriptors.ComponentMap<descriptors.RemoteCommand>)[command.name] = command;
			});
		}

		const converterFiles = this._files.filter(file => file.type === "converter");
		if (!converterFiles.empty()) {
			descriptor.converters = [];
			converterFiles.forEach(file => descriptor.converters!.push(file.path));
		}

		const constraintFiles = this._files.filter(file => file.type === "constraint");
		if (!constraintFiles.empty()) {
			descriptor.constraints = [];
			constraintFiles.forEach(file => descriptor.constraints!.push(file.path));
		}

		const moduleFiles = this._files.filter(file => file.type === "module");
		if (!moduleFiles.empty()) {
			descriptor.modules = [];
			moduleFiles.forEach(file => (descriptor.modules as Array<string | descriptors.NamedModule>).push(file.path));
		}

		return descriptor;
	}

	private file(type: ComponentType, first: string, second?: string): this {
		let path: string,
			file: string;

		if (second) {
			path = first;
			file = second;
		} else {
			path = type + this._files.length;
			file = first;
		}

		this._files.push({
			path,
			file,
			type
		});

		return this;
	}
}

export class InnerModuleBuilder extends ModuleBuilder {
	private _remote: string;

	constructor(parent: ModuleBuilder, serverBuilder: server.ServerBuilder) {
		super(parent, serverBuilder);
	}

	remote(path: string): this {
		this._remote = path;
		return this;
	}

	build(): descriptors.NamedModule {
		const descriptor = super.build();

		if (this._remote) {
			descriptor.remote = {
				path: this._remote
			}
		}

		return descriptor;
	}
}

export class RootModuleBuilder extends ModuleBuilder<ConnectorBuilder, descriptors.RootModule> {
	private _remoteBase: string;

	constructor(parent: ConnectorBuilder, serverBuilder: server.ServerBuilder) {
		super(parent, serverBuilder);
	}

	base(remoteBase: string): this {
		this._remoteBase = remoteBase;
		return this;
	}

	path(): ExtendedArray<string> {
		return new ExtendedArray(this._name!);
	}

	build(): descriptors.RootModule {
		const descriptor = super.build();

		descriptor.remote = {
			origin: this._server.getOrigin()
		};

		if (this._remoteBase) {
			descriptor.remote.base = this._remoteBase;
		}

		const proxy = this._server.getProxy();
		if (proxy) {
			descriptor.remote.proxy = proxy;
		}

		this._server.module(descriptor);

		return descriptor;
	}
}
