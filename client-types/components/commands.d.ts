/// <reference path="../app/application.d.ts" />
/// <reference path="components.d.ts" />
/// <reference path="registry.d.ts" />
/// <reference path="syntax.d.ts" />
/// <reference path="types.d.ts" />
declare namespace fugazi.components.commands {
    class ExecutionResult {
        private asynced;
        protected type: types.Type;
        protected future: fugazi.Future<any>;
        constructor(type: types.Type, asynced: boolean);
        isAsync(): boolean;
        getType(): types.Type;
        then(successHandler: (value: any) => void): ExecutionResult;
        catch(errorHandler: (error: fugazi.Exception) => void): ExecutionResult;
        resolve(value: any): void;
        reject(error: fugazi.Exception): void;
    }
    class ExecutionParameters {
        private names;
        private values;
        constructor();
        add(name: string, value: any): void;
        has(name: string): boolean;
        get(name: string): any;
        asList(): any[];
        asStruct(): fugazi.PlainObject<any>;
        asMap(): collections.Map<any>;
    }
    class Executer {
        private fn;
        private executionResult;
        constructor(result: ExecutionResult, fn: (params: ExecutionParameters) => void);
        readonly result: ExecutionResult;
        execute(params: ExecutionParameters): ExecutionResult;
    }
    abstract class Command extends Component {
        protected asynced: boolean;
        protected returnType: types.Type;
        protected convert: {
            from: types.Type;
            converter: converters.Converter;
        };
        protected syntax: syntax.SyntaxRule[];
        constructor();
        isAsync(): boolean;
        getReturnType(): types.Type;
        getSyntax(): syntax.SyntaxRule[];
        isRestricted(): boolean;
        executeLater(context: app.modules.ModuleContext): Executer;
        executeNow(context: app.modules.ModuleContext, params: ExecutionParameters): ExecutionResult;
        protected abstract invokeHandler(context: app.modules.ModuleContext, params: ExecutionParameters): Promise<handler.Result>;
        protected handleHandlerResult(executionResult: ExecutionResult, result: handler.Result): void;
        protected validateResultValue(result: any): boolean;
        private knownConvertResult(value);
        private unknownConvertResult(value);
    }
    class LocalCommand extends Command {
        protected parametersForm: handler.PassedParametersForm;
        protected handler: handler.AsyncedHandler;
        constructor();
        protected invokeHandler(context: app.modules.ModuleContext, params: ExecutionParameters): Promise<handler.Result | any>;
    }
    namespace handler {
        function isHandlerResult(value: any): value is Result;
        enum ResultStatus {
            Success = 0,
            Failure = 1,
            Prompt = 2,
        }
        interface Result {
            status: ResultStatus;
            value?: any;
            error?: string;
        }
        interface PromptData {
            type: "password";
            message: string;
            handlePromptValue: (value: string) => void;
        }
        interface PromptResult extends Result {
            prompt: PromptData;
        }
        function isPromptData(result: any): result is PromptData;
        enum PassedParametersForm {
            List = 0,
            Arguments = 1,
            Struct = 2,
            Map = 3,
        }
        interface Handler extends Function {
        }
        interface SyncedHandler extends Handler {
            (context: app.modules.ModuleContext, ...params: any[]): Result | any;
        }
        interface AsyncedHandler extends Handler {
            (context: app.modules.ModuleContext, ...params: any[]): Promise<Result>;
        }
    }
    namespace descriptor {
        interface Descriptor extends components.descriptor.Descriptor {
            returns: types.Definition;
            convert?: {
                from: string;
                converter?: string;
            };
            syntax: string | string[];
            async?: boolean;
        }
        interface LocalCommandDescriptor extends Descriptor {
            handler: handler.Handler;
            parametersForm?: "list" | "arguments" | "map" | "struct";
        }
        interface RemoteHandlerDescriptor {
            endpoint: string;
            method?: string;
        }
        interface RemoteCommandDescriptor extends Descriptor {
            handler: RemoteHandlerDescriptor;
        }
    }
    namespace builder {
        function create(commandDescriptor: descriptor.Descriptor, parent: components.builder.Builder<components.Component>): components.builder.Builder<Command>;
        function create<T extends LocalCommand>(commandDescriptor: descriptor.Descriptor, parent: components.builder.Builder<components.Component>, ctor: {
            new (): T;
        }): components.builder.Builder<Command>;
    }
}
