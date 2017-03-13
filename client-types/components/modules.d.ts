/// <reference path="../core/polyfill.d.ts" />
/// <reference path="../core/types.d.ts" />
/// <reference path="../core/net.d.ts" />
/// <reference path="../app/frames.d.ts" />
/// <reference path="../app/modules.d.ts" />
/// <reference path="constraints.d.ts" />
/// <reference path="converters.d.ts" />
/// <reference path="components.d.ts" />
/// <reference path="commands.d.ts" />
/// <reference path="types.d.ts" />
declare namespace fugazi.components.modules {
    class Module extends Component {
        private remote;
        private params;
        private modules;
        private types;
        private commands;
        private converters;
        private constraints;
        constructor();
        loaded(): Promise<void>;
        isRemote(): boolean;
        getRemote(): Remote;
        authenticate(): void;
        isNamespaceOnly(): boolean;
        hasParameter(name: string): boolean;
        getParameter(name: string, context: app.modules.ModuleContext): string;
        addModule(aModule: Module): void;
        hasModule(name: string): boolean;
        getModule(name: string): Module;
        getModules(): Module[];
        forEachModule(fn: (aModule: Module) => void): void;
        addType(aType: types.Type): void;
        hasType(name: string): boolean;
        getType(name: string): types.Type;
        getTypes(): types.Type[];
        forEachType(fn: (type: types.Type) => void): void;
        addConstraint(aConstraint: types.constraints.Constraint): void;
        hasConstraint(name: string): boolean;
        getConstraint(name: string): types.constraints.Constraint;
        getConstraints(): types.constraints.Constraint[];
        forEachConstraint(fn: (constraint: types.constraints.Constraint) => void): void;
        addCommand(aCommand: commands.Command): void;
        hasCommand(name: string): boolean;
        getCommand(name: string): commands.Command;
        getCommands(): commands.Command[];
        forEachCommand(fn: (command: commands.Command) => void): void;
        addConverter(converter: converters.Converter): void;
        hasConverter(name: string): boolean;
        getConverter(name: string): converters.Converter;
        getConverters(): converters.Converter[];
        forEachConverter(fn: (converter: converters.Converter) => void): void;
    }
    abstract class Authenticator {
        protected constructor();
        abstract authenticated(): boolean;
        abstract descriptor(): commands.descriptor.LocalCommandDescriptor;
        abstract authenticate(context: app.Context, ...params: any[]): commands.handler.Result;
        abstract interceptRequest(options: net.RequestProperties, data?: net.RequestData): void;
        abstract interceptResponse(response: net.HttpResponse): void;
    }
    interface Remote {
        proxied(): boolean;
        authenticator(): Authenticator;
        base(originName?: string): net.Url | null;
        frame(originName?: string): app.frames.ProxyFrame;
    }
    class RemoteSource implements Remote {
        private static DEFAULT_ID;
        private _base;
        private _proxy;
        private _default;
        private _authenticator;
        private _origins;
        private _frames;
        constructor(desc: descriptor.SourceRemoteDescriptor);
        init(): Promise<void>;
        proxied(): boolean;
        frame(originName?: string): app.frames.ProxyFrame;
        authenticator(): Authenticator;
        base(originName?: string): net.Url | null;
        loginCommandDescriptor(): commands.descriptor.LocalCommandDescriptor;
        private getOriginName(originName?);
    }
    class RemotePath implements Remote {
        private _path;
        private _parent;
        constructor(path: string);
        proxied(): boolean;
        frame(originName?: string): app.frames.ProxyFrame;
        authenticator(): Authenticator;
        base(originName?: string): net.Url | null;
    }
    namespace descriptor {
        function loaded(moduleDescriptor: Descriptor): void;
        interface InnerComponentsCollection<T extends components.descriptor.Descriptor> {
        }
        interface InnerComponentsArrayCollection<T extends components.descriptor.Descriptor> extends InnerComponentsCollection<T>, Array<string | T> {
        }
        interface InnerComponentsObjectCollection<T extends components.descriptor.Descriptor> extends InnerComponentsCollection<T>, fugazi.PlainObject<string | T> {
        }
        interface InnerModulesCollection {
        }
        interface InnerModulesArrayCollection extends InnerModulesCollection, Array<Descriptor | string> {
        }
        interface InnerModulesObjectCollection extends InnerModulesCollection, fugazi.PlainObject<Descriptor | string> {
        }
        interface Descriptor extends components.descriptor.Descriptor {
            basePath?: string;
            remote?: RemoteDescriptor;
            lookup?: {
                [name: string]: string;
            };
            modules?: InnerModulesCollection;
            types?: string | InnerComponentsCollection<types.descriptor.Descriptor>;
            commands?: string | InnerComponentsCollection<commands.descriptor.Descriptor>;
            converters?: string | InnerComponentsCollection<converters.descriptor.Descriptor>;
            constraints?: string | InnerComponentsCollection<types.constraints.descriptor.Descriptor>;
        }
        type AuthenticationMethod = "none" | "basic" | "custom";
        interface BaseSourceRemoteDescriptor {
            base?: string;
            proxy?: string;
            default?: string;
            auth?: AuthenticationMethod;
        }
        interface SingleSourceRemoteDescriptor extends BaseSourceRemoteDescriptor {
            origin: string;
        }
        interface MultiSourceRemoteDescriptor extends BaseSourceRemoteDescriptor {
            origins: {
                [name: string]: string;
            };
        }
        type SourceRemoteDescriptor = SingleSourceRemoteDescriptor | MultiSourceRemoteDescriptor;
        function isSingleSourceRemoteDescriptor(remote: SourceRemoteDescriptor): remote is SingleSourceRemoteDescriptor;
        interface RelativeRemoteDescriptor {
            path: string;
        }
        type RemoteDescriptor = SourceRemoteDescriptor | RelativeRemoteDescriptor;
        function isRelativeRemoteDescriptor(remote: RemoteDescriptor): remote is RelativeRemoteDescriptor;
        abstract class RemoteLoader extends components.descriptor.BaseLoader<Descriptor> {
            protected cached: boolean;
            protected future: Future<Descriptor>;
            constructor(url: net.Url, cached: boolean);
            then(fn: (aDescriptor: Descriptor) => Descriptor): components.descriptor.Loader<Descriptor>;
            catch(fn: (error: fugazi.Exception) => void): components.descriptor.Loader<Descriptor>;
        }
        class HttpLoader extends RemoteLoader {
            constructor(url: net.Url, cached?: boolean);
            private loaded(response);
            private failed(response);
        }
        class ScriptLoader extends RemoteLoader {
            private static LOADED_TIMEOUT;
            private loaded;
            private scriptId;
            private timer;
            constructor(url: net.Url, cached?: boolean);
            loadedCalled(moduleDescriptor: Descriptor): void;
            private scriptLoaded();
            private failed(message);
        }
    }
    namespace builder {
        function create(url: net.Url): components.builder.Builder<Module>;
        function create(moduleDescriptor: descriptor.Descriptor, parent?: components.builder.Builder<components.Component>): components.builder.Builder<Module>;
        class Builder extends components.builder.BaseBuilder<Module, descriptor.Descriptor> {
            private innerModuleBuilders;
            private innerTypesBuilders;
            private innerCommandsBuilders;
            private innerConvertersBuilders;
            private innerConstraintBuilders;
            private innerModuleRemoteBuilders;
            private innerTypeModuleRemoteBuilders;
            private innerCommandModuleRemoteBuilders;
            private innerConvertersModuleRemoteBuilders;
            private innerConstraintModuleRemoteBuilders;
            private basePath;
            private remote;
            private params;
            constructor(loader: components.descriptor.Loader<descriptor.Descriptor>, parent?: components.builder.Builder<components.Component>);
            resolve<C2 extends Component>(type: ComponentType, name: string): C2;
            getBasePath(): any;
            protected onDescriptorReady(): void;
            protected concreteBuild(): void;
            protected concreteAssociate(): void;
            private createParameters();
            private createInnerModuleBuilders();
            private createInnerCommandBuilders();
            private createInnerConvertersBuilders();
            private createInnerConstraintBuilders();
            private createInnerTypeBuilders();
            private createInnerUrl(path);
            private remoteModuleBuilt(info, collectionType);
            private handleRemoteDescriptor(remote);
            private handleRemoteRelativeDescriptor(relative);
            private handleRemoteSourceDescriptor(source);
        }
    }
}
