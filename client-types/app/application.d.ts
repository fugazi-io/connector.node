/// <reference path="../../lib/react.d.ts" />
/// <reference path="storage.d.ts" />
/// <reference path="../core/configuration.d.ts" />
/// <reference path="../core/dom.d.ts" />
/// <reference path="../components/types.d.ts" />
/// <reference path="../components/registry.d.ts" />
/// <reference path="../view/main.d.ts" />
declare module fugazi.app {
    const version: {
        code: string;
        name: string;
        toString: () => string;
    };
    const Events: {
        Loaded: string;
        Ready: string;
    };
    type Variable = {
        name: string;
        type: components.types.Type;
        value: any;
    };
    interface Context {
        getId(): string;
        guessType(value: any): components.types.Type;
        guessTypeFromString(value: string): components.types.Type;
        getConverter(from: components.types.Type, to: components.types.Type): components.converters.Converter;
    }
    abstract class BaseContext<T extends Context> implements Context {
        private id;
        private parent;
        constructor(parent?: T, id?: string);
        getId(): string;
        getParent(): T;
        guessType(value: any): components.types.Type;
        guessTypeFromString(value: string): components.types.Type;
        getConverter(from: components.types.Type, to: components.types.Type): components.converters.Converter;
    }
    class ApplicationContext extends BaseContext<null> {
    }
    namespace bus {
        interface EventHandler {
            (): void;
        }
        function register(eventName: string, eventHandler: EventHandler): void;
        function unregister(eventName: string, eventHandler: EventHandler): void;
        function post(eventName: string): void;
    }
    namespace location {
        function current(): net.Url;
        function base(): net.Url;
        function currentScript(): net.Url;
        function scripts(scriptPath?: string): net.Url;
        function modules(modulePath: string): net.Url;
        function modules(type: "js" | "json", modulePath?: string): net.Url;
    }
}
