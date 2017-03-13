/// <reference path="../core/types.d.ts" />
/// <reference path="../core/utils.d.ts" />
/// <reference path="../core/net.d.ts" />
/// <reference path="../app/application.d.ts" />
/// <reference path="registry.d.ts" />
declare namespace fugazi.components {
    type ComponentTypeName = "module" | "constraint" | "converter" | "command" | "type";
    enum ComponentType {
        Type = 0,
        Module = 1,
        Command = 2,
        Converter = 3,
        Constraint = 4,
        SyntaxRule = 5,
    }
    function typeFromName(name: ComponentTypeName): ComponentType;
    class Path {
        private names;
        constructor();
        constructor(path: string);
        constructor(path: string[], child?: string);
        readonly length: number;
        at(index: number): string;
        first(): string;
        last(): string;
        child(name: string): Path;
        parent(): Path;
        startsWith(prefix: Path): boolean;
        clone(): Path;
        equals(other: Path): boolean;
        forEach(callbackfn: (value: string, index: number) => void, thisArg?: any): void;
        toString(): string;
    }
    class Component {
        protected path: Path;
        protected type: ComponentType;
        protected parent: Component;
        protected name: string;
        protected title: string;
        protected description: string;
        constructor(type: ComponentType);
        getComponentType(): ComponentType;
        getName(): string;
        getPath(): Path;
        getTitle(): string;
        getDescription(): string;
        getParent(): Component;
        toString(): string;
    }
    namespace descriptor {
        interface Descriptor {
            name: string;
            title?: string;
            description?: string;
            componentConstructor?: {
                new (): Component;
            };
        }
        interface Loader<T extends Descriptor> {
            then(fn: (aDescriptor: T) => void): Loader<T>;
            catch(fn: (error: fugazi.Exception) => void): Loader<T>;
            getUrl(): net.Url;
            getUrlFor(path: string): net.Url;
        }
        abstract class BaseLoader<T extends Descriptor> implements Loader<T> {
            protected baseUrl: net.Url;
            constructor(baseUrl?: net.Url);
            getUrl(): net.Url;
            getUrlFor(path: string): net.Url;
            abstract then(fn: (aDescriptor: T) => void): Loader<T>;
            abstract catch(fn: (error: fugazi.Exception) => void): Loader<T>;
        }
        class ExistingLoader<T extends Descriptor> extends BaseLoader<T> {
            private aDescriptor;
            constructor(aDescriptor: T, baseUrl?: net.Url);
            then(fn: (aDescriptor: T) => void | T): Loader<T>;
            catch(fn: (error: fugazi.Exception) => void): Loader<T>;
        }
        class FailedLoader extends BaseLoader<Descriptor> {
            private error;
            constructor(error: fugazi.Exception, baseUrl?: net.Url);
            then(fn: (aDescriptor: Descriptor) => void): Loader<Descriptor>;
            catch(fn: (error: fugazi.Exception) => void): Loader<Descriptor>;
        }
    }
    interface ComponentResolver {
        resolve<T extends Component>(type: ComponentType, name: string): T;
    }
    namespace builder {
        class Exception extends fugazi.Exception {
        }
        enum State {
            None = 0,
            Initiated = 1,
            Building = 2,
            Built = 3,
            Associating = 4,
            Complete = 5,
            Failed = 6,
        }
        interface Builder<C extends Component> {
            getParent(): Builder<Component>;
            getState(): State;
            getPath(): Path;
            getName(): string;
            getTitle(): string;
            getDescription(): string;
            getComponent(): C;
            build(): Promise<C>;
            associate(): void;
            resolve<C2 extends Component>(type: ComponentType, name: string): C2;
        }
        function createAnonymousDescriptor<C extends Component>(type: ComponentType): descriptor.Descriptor;
        abstract class BaseBuilder<C extends Component, D extends descriptor.Descriptor> implements ComponentResolver, Builder<C> {
            private id;
            private path;
            private name;
            private title;
            private description;
            private state;
            private buildCalled;
            private descriptorState;
            private innerBuildersCount;
            private innerBuildersCompletedCount;
            private componentConstructor;
            protected loader: descriptor.Loader<D>;
            protected component: C;
            protected parent: Builder<Component>;
            protected componentDescriptor: D;
            protected future: fugazi.Future<C>;
            constructor(componentConstructor: {
                new (): C;
            }, loader: descriptor.Loader<D>, parent?: Builder<Component>);
            getParent(): Builder<Component>;
            getState(): State;
            getPath(): Path;
            getName(): string;
            getTitle(): string;
            getDescription(): string;
            getComponent(): C;
            build(): Promise<C>;
            associate(): void;
            resolve<C2 extends Component>(type: ComponentType, name: string): C2;
            protected hasInnerBuilders(): boolean;
            protected innerBuilderCreated(): void;
            protected innerBuilderCompleted(): void;
            protected abstract concreteBuild(): void;
            protected abstract concreteAssociate(): void;
            protected abstract onDescriptorReady(): void;
            private descriptorReady(componentDescriptor);
            private descriptorInvalid(error);
            private instantiateComponent();
        }
    }
}
