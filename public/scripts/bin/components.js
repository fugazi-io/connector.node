"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var map_1 = require("./common/map");
var array_1 = require("./common/array");
var descriptors = require("./common/descriptors");
var ComponentBuilder = (function () {
    function ComponentBuilder(parent, serverBuilder) {
        this._parent = parent;
        this._server = serverBuilder;
    }
    ComponentBuilder.prototype.parent = function () {
        return this._parent;
    };
    ComponentBuilder.prototype.name = function (name) {
        this._name = name;
        return this;
    };
    ComponentBuilder.prototype.title = function (title) {
        this._title = title;
        return this;
    };
    ComponentBuilder.prototype.description = function (description) {
        this._description = description;
        return this;
    };
    ComponentBuilder.prototype.descriptor = function (descriptor) {
        if (!this._name || descriptor.name) {
            this._name = descriptor.name;
        }
        this._title = descriptor.title;
        this._description = descriptor.description;
        return this;
    };
    ComponentBuilder.prototype.path = function () {
        return this._parent.path().concat(this._name);
    };
    ComponentBuilder.prototype.build = function () {
        if (!this._name) {
            throw new Error("name missing");
        }
        return {
            name: this._name,
            title: this._title || this._name,
            description: this._description
        };
    };
    return ComponentBuilder;
}());
exports.ComponentBuilder = ComponentBuilder;
var TypeBuilder = (function (_super) {
    __extends(TypeBuilder, _super);
    function TypeBuilder(parent, serverBuilder) {
        return _super.call(this, parent, serverBuilder) || this;
    }
    TypeBuilder.prototype.descriptor = function (value) {
        _super.prototype.descriptor.call(this, value);
        this._type = value.type;
        return this;
    };
    TypeBuilder.prototype.type = function (value) {
        this._type = value;
        return this;
    };
    TypeBuilder.prototype.build = function () {
        var descriptor = _super.prototype.build.call(this);
        descriptor.type = this._type;
        return descriptor;
    };
    return TypeBuilder;
}(ComponentBuilder));
exports.TypeBuilder = TypeBuilder;
var RemoteCommandBuilder = (function (_super) {
    __extends(RemoteCommandBuilder, _super);
    function RemoteCommandBuilder(parent, serverBuilder) {
        var _this = _super.call(this, parent, serverBuilder) || this;
        _this._syntax = new array_1.ExtendedArray();
        return _this;
    }
    RemoteCommandBuilder.prototype.descriptor = function (descriptor) {
        _super.prototype.descriptor.call(this, descriptor);
        if (descriptor.returns) {
            this._returns = descriptor.returns;
        }
        if (typeof descriptor.syntax === "string") {
            this._syntax.push(descriptor.syntax);
        }
        else if (descriptor.syntax instanceof Array) {
            (_a = this._syntax).push.apply(_a, descriptor.syntax);
        }
        if (descriptor.handler) {
            this._endpoint = descriptor.handler.endpoint;
            this._method = descriptor.handler.method;
        }
        return this;
        var _a;
    };
    RemoteCommandBuilder.prototype.syntax = function () {
        var rules = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rules[_i] = arguments[_i];
        }
        (_a = this._syntax).push.apply(_a, rules);
        return this;
        var _a;
    };
    RemoteCommandBuilder.prototype.endpoint = function (path) {
        this._endpoint = path;
        return this;
    };
    RemoteCommandBuilder.prototype.method = function (value) {
        this._method = value;
        return this;
    };
    RemoteCommandBuilder.prototype.handler = function (fn) {
        this._handler = fn;
        return this;
    };
    RemoteCommandBuilder.prototype.returns = function (type) {
        this._returns = type;
        return this;
    };
    RemoteCommandBuilder.prototype.build = function () {
        var method = this._method || RemoteCommandBuilder.DEFAULT_METHOD;
        var endpoint;
        if (this._endpoint) {
            endpoint = this._endpoint.startsWith("/") ? this._endpoint : "/" + this._endpoint;
        }
        else {
            endpoint = "/" + this.path().join("/");
        }
        var descriptor = _super.prototype.build.call(this);
        descriptor.returns = this._returns || "any";
        descriptor.syntax = this._syntax;
        descriptor.handler = {
            method: method,
            endpoint: endpoint
        };
        this._server.command({
            method: method,
            path: normalizeEndpointForServer(endpoint),
            handler: this._handler
        });
        return descriptor;
    };
    RemoteCommandBuilder.DEFAULT_METHOD = "GET";
    RemoteCommandBuilder.DEFAULT_RETURNS = "GET";
    return RemoteCommandBuilder;
}(ComponentBuilder));
exports.RemoteCommandBuilder = RemoteCommandBuilder;
function normalizeEndpointForServer(endpoint) {
    var re = /\{\s*([a-zA-Z0-9]+)\s*\}/;
    var match;
    while ((match = re.exec(endpoint)) !== null) {
        endpoint = endpoint.replace(match[0], ":" + match[1]);
    }
    return endpoint;
}
var ModuleBuilder = (function (_super) {
    __extends(ModuleBuilder, _super);
    function ModuleBuilder(parent, serverBuilder) {
        var _this = _super.call(this, parent, serverBuilder) || this;
        _this._files = new array_1.ExtendedArray();
        _this._lookup = new map_1.ExtendedMap();
        _this._types = new map_1.ExtendedMap();
        _this._modules = new map_1.ExtendedMap();
        _this._commands = new map_1.ExtendedMap();
        return _this;
    }
    ModuleBuilder.prototype.descriptor = function (descriptor) {
        var _this = this;
        _super.prototype.descriptor.call(this, descriptor);
        if (descriptor.types) {
            descriptors.collectionIterator(descriptor.types).forEach(function (type) {
                if (typeof type === "string") {
                    _this.types(type);
                }
                else {
                    _this.type(type);
                }
            });
        }
        if (descriptor.modules) {
            descriptors.collectionIterator(descriptor.modules).forEach(function (module) {
                if (typeof module === "string") {
                    _this.modules(module);
                }
                else {
                    _this.module(module);
                }
            });
        }
        if (descriptor.commands) {
            descriptors.collectionIterator(descriptor.commands).forEach(function (command) {
                if (typeof command === "string") {
                    _this.commands(command);
                }
                else {
                    _this.command(command);
                }
            });
        }
        return this;
    };
    ModuleBuilder.prototype.type = function (first, second) {
        var name, descriptor, builder;
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
    };
    ModuleBuilder.prototype.types = function (first, second) {
        return this.file("type", first, second);
    };
    ModuleBuilder.prototype.lookup = function (handlerParameterName, variableName) {
        this._lookup.set(handlerParameterName, variableName);
        return this;
    };
    ModuleBuilder.prototype.command = function (first, second, third) {
        var name;
        var handler;
        var descriptor;
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
        var builder = new RemoteCommandBuilder(this, this._server);
        if (descriptor) {
            builder.descriptor(descriptor);
        }
        this._commands.set(name, builder);
        return typeof first === "string" ? builder : this;
    };
    ModuleBuilder.prototype.commands = function (first, second) {
        return this.file("command", first, second);
    };
    ModuleBuilder.prototype.converters = function (first, second) {
        return this.file("converter", first, second);
    };
    ModuleBuilder.prototype.constraints = function (first, second) {
        return this.file("constraint", first, second);
    };
    ModuleBuilder.prototype.module = function (first, second) {
        var name, descriptor, builder;
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
    };
    ModuleBuilder.prototype.modules = function (first, second) {
        return this.file("module", first, second);
    };
    ModuleBuilder.prototype.build = function () {
        var _this = this;
        this._files.forEach(function (file) {
            _this._server.file(file.path, file.file);
        });
        var descriptor = _super.prototype.build.call(this);
        if (!this._lookup.empty()) {
            descriptor.lookup = this._lookup.toObject();
        }
        var typeFiles = this._files.filter(function (file) { return file.type === "type"; });
        if (!typeFiles.empty()) {
            descriptor.types = [];
            this._types.forEach(function (type) { return descriptor.types.push(type.build()); });
            typeFiles.forEach(function (file) { return descriptor.types.push(_this._server.getUrlFor(file.path)); });
        }
        else if (!this._types.empty()) {
            descriptor.types = {};
            this._types.forEach(function (typeBuilder) {
                var type = typeBuilder.build();
                descriptor.types[type.name] = type;
            });
        }
        var commandFiles = this._files.filter(function (file) { return file.type === "command"; });
        if (!commandFiles.empty()) {
            descriptor.commands = [];
            this._commands.forEach(function (command) { return descriptor.commands.push(command.build()); });
            commandFiles.forEach(function (file) { return descriptor.commands.push(_this._server.getUrlFor(file.path)); });
        }
        else if (!this._commands.empty()) {
            descriptor.commands = {};
            this._commands.forEach(function (commandBuilder) {
                var command = commandBuilder.build();
                descriptor.commands[command.name] = command;
            });
        }
        var converterFiles = this._files.filter(function (file) { return file.type === "converter"; });
        if (!converterFiles.empty()) {
            descriptor.converters = [];
            converterFiles.forEach(function (file) { return descriptor.converters.push(_this._server.getUrlFor(file.path)); });
        }
        var constraintFiles = this._files.filter(function (file) { return file.type === "constraint"; });
        if (!constraintFiles.empty()) {
            descriptor.constraints = [];
            constraintFiles.forEach(function (file) { return descriptor.constraints.push(_this._server.getUrlFor(file.path)); });
        }
        var moduleFiles = this._files.filter(function (file) { return file.type === "module"; });
        if (!moduleFiles.empty()) {
            descriptor.modules = [];
            this._modules.forEach(function (module) { return descriptor.modules.push(module.build()); });
            moduleFiles.forEach(function (file) { return descriptor.modules.push(_this._server.getUrlFor(file.path)); });
        }
        else if (!this._modules.empty()) {
            descriptor.modules = {};
            this._modules.forEach(function (moduleBuilder) {
                var module = moduleBuilder.build();
                descriptor.modules[module.name] = module;
            });
        }
        return descriptor;
    };
    ModuleBuilder.prototype.file = function (type, first, second) {
        var path, file;
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
            path: path,
            file: file,
            type: type
        });
        return this;
    };
    return ModuleBuilder;
}(ComponentBuilder));
exports.ModuleBuilder = ModuleBuilder;
var InnerModuleBuilder = (function (_super) {
    __extends(InnerModuleBuilder, _super);
    function InnerModuleBuilder(parent, serverBuilder) {
        return _super.call(this, parent, serverBuilder) || this;
    }
    InnerModuleBuilder.prototype.remote = function (path) {
        this._remote = path;
        return this;
    };
    InnerModuleBuilder.prototype.build = function () {
        var descriptor = _super.prototype.build.call(this);
        if (this._remote) {
            descriptor.remote = {
                path: this._remote
            };
        }
        return descriptor;
    };
    return InnerModuleBuilder;
}(ModuleBuilder));
exports.InnerModuleBuilder = InnerModuleBuilder;
var RootModuleBuilder = (function (_super) {
    __extends(RootModuleBuilder, _super);
    function RootModuleBuilder(parent, serverBuilder) {
        return _super.call(this, parent, serverBuilder) || this;
    }
    RootModuleBuilder.prototype.base = function (remoteBase) {
        this._remoteBase = remoteBase;
        return this;
    };
    RootModuleBuilder.prototype.path = function () {
        return new array_1.ExtendedArray(this._name);
    };
    RootModuleBuilder.prototype.build = function () {
        var descriptor = _super.prototype.build.call(this);
        descriptor.remote = {
            origin: this._server.getOrigin()
        };
        if (this._remoteBase) {
            descriptor.remote.base = this._remoteBase;
        }
        var proxy = this._server.getProxy();
        if (proxy) {
            descriptor.remote.proxy = proxy;
        }
        this._server.module(descriptor);
        return descriptor;
    };
    return RootModuleBuilder;
}(ModuleBuilder));
exports.RootModuleBuilder = RootModuleBuilder;
//# sourceMappingURL=components.js.map