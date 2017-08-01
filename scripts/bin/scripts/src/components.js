"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const map_1 = require("./common/map");
const array_1 = require("./common/array");
const descriptors = require("./common/descriptors");
class ComponentBuilder {
    constructor(parent, serverBuilder) {
        this._parent = parent;
        this._server = serverBuilder;
    }
    parent() {
        return this._parent;
    }
    name(name) {
        this._name = name;
        return this;
    }
    title(title) {
        this._title = title;
        return this;
    }
    description(description) {
        this._description = description;
        return this;
    }
    descriptor(descriptor) {
        if (!this._name || descriptor.name) {
            this._name = descriptor.name;
        }
        this._title = descriptor.title;
        this._description = descriptor.description;
        return this;
    }
    path() {
        return this._parent.path().concat(this._name);
    }
    build() {
        if (!this._name) {
            throw new Error("name missing");
        }
        return {
            name: this._name,
            title: this._title || this._name,
            description: this._description
        };
    }
}
exports.ComponentBuilder = ComponentBuilder;
class TypeBuilder extends ComponentBuilder {
    constructor(parent, serverBuilder) {
        super(parent, serverBuilder);
    }
    descriptor(value) {
        super.descriptor(value);
        this._type = value.type;
        return this;
    }
    type(value) {
        this._type = value;
        return this;
    }
    build() {
        const descriptor = super.build();
        descriptor.type = this._type;
        return descriptor;
    }
}
exports.TypeBuilder = TypeBuilder;
class RemoteCommandBuilder extends ComponentBuilder {
    constructor(parent, serverBuilder) {
        super(parent, serverBuilder);
        this._syntax = new array_1.ExtendedArray();
    }
    descriptor(descriptor) {
        super.descriptor(descriptor);
        if (descriptor.returns) {
            this._returns = descriptor.returns;
        }
        if (typeof descriptor.syntax === "string") {
            this._syntax.push(descriptor.syntax);
        }
        else if (descriptor.syntax instanceof Array) {
            this._syntax.push(...descriptor.syntax);
        }
        if (descriptor.handler) {
            this._endpoint = descriptor.handler.endpoint;
            this._method = descriptor.handler.method;
        }
        return this;
    }
    syntax(...rules) {
        this._syntax.push(...rules);
        return this;
    }
    endpoint(path) {
        this._endpoint = path;
        return this;
    }
    method(value) {
        this._method = value;
        return this;
    }
    handler(fn) {
        this._handler = fn;
        return this;
    }
    returns(type) {
        this._returns = type;
        return this;
    }
    build() {
        const method = this._method || RemoteCommandBuilder.DEFAULT_METHOD;
        let endpoint;
        if (this._endpoint) {
            endpoint = this._endpoint.startsWith("/") ? this._endpoint : "/" + this._endpoint;
        }
        else {
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
            path: normalizeEndpointForServer(endpoint),
            handler: this._handler
        });
        return descriptor;
    }
}
RemoteCommandBuilder.DEFAULT_METHOD = "GET";
RemoteCommandBuilder.DEFAULT_RETURNS = "GET";
exports.RemoteCommandBuilder = RemoteCommandBuilder;
function normalizeEndpointForServer(endpoint) {
    const re = /\{\s*([a-zA-Z0-9]+)\s*\}/;
    let match;
    while ((match = re.exec(endpoint)) !== null) {
        endpoint = endpoint.replace(match[0], ":" + match[1]);
    }
    return endpoint;
}
class ModuleBuilder extends ComponentBuilder {
    constructor(parent, serverBuilder) {
        super(parent, serverBuilder);
        this._files = new array_1.ExtendedArray();
        this._lookup = new map_1.ExtendedMap();
        this._types = new map_1.ExtendedMap();
        this._modules = new map_1.ExtendedMap();
        this._commands = new map_1.ExtendedMap();
    }
    descriptor(descriptor) {
        super.descriptor(descriptor);
        if (descriptor.types) {
            descriptors.collectionIterator(descriptor.types).forEach((type) => {
                if (typeof type === "string") {
                    this.types(type);
                }
                else {
                    this.type(type);
                }
            });
        }
        if (descriptor.modules) {
            descriptors.collectionIterator(descriptor.modules).forEach((module) => {
                if (typeof module === "string") {
                    this.modules(module);
                }
                else {
                    this.module(module);
                }
            });
        }
        if (descriptor.commands) {
            descriptors.collectionIterator(descriptor.commands).forEach((command) => {
                if (typeof command === "string") {
                    this.commands(command);
                }
                else {
                    this.command(command);
                }
            });
        }
        return this;
    }
    type(first, second) {
        let name, descriptor, builder;
        if (second) {
            name = first;
            descriptor = Object.assign({}, second);
            descriptor.name = name;
        }
        else if (typeof first === "string") {
            name = first;
        }
        else {
            name = first.name;
            descriptor = Object.assign({}, first);
        }
        if (this._types.has(name)) {
            builder = this._types.get(name);
        }
        else {
            builder = new TypeBuilder(this, this._server);
            this._types.set(name, builder);
        }
        if (descriptor) {
            builder.descriptor(descriptor);
            return this;
        }
        return builder;
    }
    types(first, second) {
        return this.file("type", first, second);
    }
    lookup(handlerParameterName, variableName) {
        this._lookup.set(handlerParameterName, variableName);
        return this;
    }
    command(first, second, third) {
        let name;
        let handler;
        let descriptor;
        if (typeof first === "string") {
            name = first;
            handler = third;
            descriptor = second || {};
            descriptor.name = name;
        }
        else {
            name = first.name;
            handler = second;
            descriptor = first;
        }
        let builder = new RemoteCommandBuilder(this, this._server);
        if (descriptor) {
            builder.descriptor(descriptor);
        }
        this._commands.set(name, builder);
        return typeof first === "string" ? builder : this;
    }
    commands(first, second) {
        return this.file("command", first, second);
    }
    converters(first, second) {
        return this.file("converter", first, second);
    }
    constraints(first, second) {
        return this.file("constraint", first, second);
    }
    module(first, second) {
        let name, descriptor, builder;
        if (second) {
            name = first;
            descriptor = Object.assign({}, second);
            descriptor.name = name;
        }
        else if (typeof first === "string") {
            name = first;
        }
        else {
            name = first.name;
            descriptor = Object.assign({}, first);
        }
        if (this._modules.has(name)) {
            builder = this._modules.get(name);
        }
        else {
            builder = new InnerModuleBuilder(this, this._server);
            this._modules.set(name, builder);
        }
        builder.name(name);
        if (descriptor) {
            builder.descriptor(descriptor);
            return this;
        }
        return builder;
    }
    modules(first, second) {
        return this.file("module", first, second);
    }
    build() {
        this._files.forEach(file => {
            this._server.file(file.path, file.file);
        });
        const descriptor = super.build();
        if (!this._lookup.empty()) {
            descriptor.lookup = this._lookup.toObject();
        }
        const typeFiles = this._files.filter(file => file.type === "type");
        if (!typeFiles.empty()) {
            descriptor.types = [];
            this._types.forEach(type => descriptor.types.push(type.build()));
            typeFiles.forEach(file => descriptor.types.push(this._server.getUrlFor(file.path)));
        }
        else if (!this._types.empty()) {
            descriptor.types = {};
            this._types.forEach(typeBuilder => {
                const type = typeBuilder.build();
                descriptor.types[type.name] = type;
            });
        }
        const commandFiles = this._files.filter(file => file.type === "command");
        if (!commandFiles.empty()) {
            descriptor.commands = [];
            this._commands.forEach(command => descriptor.commands.push(command.build()));
            commandFiles.forEach(file => descriptor.commands.push(this._server.getUrlFor(file.path)));
        }
        else if (!this._commands.empty()) {
            descriptor.commands = {};
            this._commands.forEach(commandBuilder => {
                const command = commandBuilder.build();
                descriptor.commands[command.name] = command;
            });
        }
        const converterFiles = this._files.filter(file => file.type === "converter");
        if (!converterFiles.empty()) {
            descriptor.converters = [];
            converterFiles.forEach(file => descriptor.converters.push(this._server.getUrlFor(file.path)));
        }
        const constraintFiles = this._files.filter(file => file.type === "constraint");
        if (!constraintFiles.empty()) {
            descriptor.constraints = [];
            constraintFiles.forEach(file => descriptor.constraints.push(this._server.getUrlFor(file.path)));
        }
        const moduleFiles = this._files.filter(file => file.type === "module");
        if (!moduleFiles.empty()) {
            descriptor.modules = [];
            this._modules.forEach(module => descriptor.modules.push(module.build()));
            moduleFiles.forEach(file => descriptor.modules.push(this._server.getUrlFor(file.path)));
        }
        else if (!this._modules.empty()) {
            descriptor.modules = {};
            this._modules.forEach(moduleBuilder => {
                const module = moduleBuilder.build();
                descriptor.modules[module.name] = module;
            });
        }
        return descriptor;
    }
    file(type, first, second) {
        let path, file;
        if (second) {
            path = first;
            file = second;
        }
        else {
            file = first;
            path = file.substring(file.lastIndexOf("/"));
        }
        if (!path.startsWith("/")) {
            path = "/" + path;
        }
        this._files.push({
            path,
            file,
            type
        });
        return this;
    }
}
exports.ModuleBuilder = ModuleBuilder;
class InnerModuleBuilder extends ModuleBuilder {
    constructor(parent, serverBuilder) {
        super(parent, serverBuilder);
    }
    remote(path) {
        this._remote = path;
        return this;
    }
    build() {
        const descriptor = super.build();
        if (this._remote) {
            descriptor.remote = {
                path: this._remote
            };
        }
        return descriptor;
    }
}
exports.InnerModuleBuilder = InnerModuleBuilder;
class RootModuleBuilder extends ModuleBuilder {
    constructor(parent, serverBuilder) {
        super(parent, serverBuilder);
    }
    base(remoteBase) {
        this._remoteBase = remoteBase;
        return this;
    }
    path() {
        return new array_1.ExtendedArray(this._name);
    }
    build() {
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
exports.RootModuleBuilder = RootModuleBuilder;
//# sourceMappingURL=components.js.map