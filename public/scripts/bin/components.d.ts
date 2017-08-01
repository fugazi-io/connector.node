import { ExtendedArray } from "./common/array";
import * as descriptors from "./common/descriptors";
import { ConnectorBuilder } from "./connector";
import * as server from "./server";
export declare abstract class ComponentBuilder<P, C extends descriptors.Component> {
    protected _parent: P;
    protected _name: string | undefined;
    protected _title: string | undefined;
    protected _description: string | undefined;
    protected _server: server.ServerBuilder;
    protected constructor(parent: P, serverBuilder: server.ServerBuilder);
    parent(): P;
    name(name: string): this;
    title(title: string): this;
    description(description: string): this;
    descriptor(descriptor: C): this;
    path(): ExtendedArray<string>;
    build(): descriptors.Named<C>;
}
export declare class TypeBuilder extends ComponentBuilder<ModuleBuilder, descriptors.Type> {
    private _type;
    constructor(parent: ModuleBuilder, serverBuilder: server.ServerBuilder);
    descriptor(value: Partial<descriptors.Type>): this;
    type(value: string | descriptors.TypeDefinition): this;
    build(): descriptors.Named<descriptors.Type>;
}
export declare class RemoteCommandBuilder extends ComponentBuilder<ModuleBuilder, descriptors.RemoteCommand> {
    static readonly DEFAULT_METHOD: string;
    static readonly DEFAULT_RETURNS: string;
    private _endpoint;
    private _syntax;
    private _handler;
    private _returns;
    private _method;
    constructor(parent: ModuleBuilder, serverBuilder: server.ServerBuilder);
    descriptor(descriptor: Partial<descriptors.RemoteCommand>): this;
    syntax(...rules: string[]): this;
    endpoint(path: string): this;
    method(value: server.HttpMethod): this;
    handler(fn: server.CommandHandler): this;
    returns(type: descriptors.TypeDefinition): this;
    build(): descriptors.NamedRemoteCommand;
}
export declare abstract class ModuleBuilder<P = any, C extends descriptors.Module = descriptors.Module> extends ComponentBuilder<P, C> {
    private _files;
    private _lookup;
    private _types;
    private _modules;
    private _commands;
    constructor(parent: P, serverBuilder: server.ServerBuilder);
    descriptor(descriptor: Partial<descriptors.Module>): this;
    type(name: string): TypeBuilder;
    type(descriptor: descriptors.NamedType): this;
    type(name: string, descriptor: descriptors.Type): this;
    types(file: string): this;
    types(endpoint: string, file: string): this;
    lookup(handlerParameterName: string, variableName: string): this;
    command(descriptor: descriptors.NamedRemoteCommand, handler?: server.CommandHandler): this;
    command(name: string, descriptor?: Partial<descriptors.RemoteCommand>, handler?: server.CommandHandler): RemoteCommandBuilder;
    commands(file: string): this;
    commands(endpoint: string, file: string): this;
    converters(file: string): this;
    converters(endpoint: string, file: string): this;
    constraints(file: string): this;
    constraints(endpoint: string, file: string): this;
    module(name: string): ModuleBuilder;
    module(descriptor: descriptors.NamedModule): this;
    module(name: string, descriptor: descriptors.Module): this;
    modules(file: string): this;
    modules(endpoint: string, file: string): this;
    build(): descriptors.Named<C>;
    private file(type, first, second?);
}
export declare class InnerModuleBuilder extends ModuleBuilder {
    private _remote;
    constructor(parent: ModuleBuilder, serverBuilder: server.ServerBuilder);
    remote(path: string): this;
    build(): descriptors.NamedModule;
}
export declare class RootModuleBuilder extends ModuleBuilder<ConnectorBuilder, descriptors.RootModule> {
    private _remoteBase;
    constructor(parent: ConnectorBuilder, serverBuilder: server.ServerBuilder);
    base(remoteBase: string): this;
    path(): ExtendedArray<string>;
    build(): descriptors.RootModule;
}
