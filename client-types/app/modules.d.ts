/// <reference path="terminal.d.ts" />
declare module fugazi.app.modules {
    interface ModuleData {
        set(name: string, value: any): void;
        has(name: string): boolean;
        get(name: string): any;
    }
    class BaseModuleContext<Parent extends terminal.BaseTerminalContext> extends BaseContext<Parent> {
        private _data;
        private _dataProxy;
        constructor(parent: Parent);
        readonly data: ModuleData;
    }
    type DefaultModuleContext = BaseModuleContext<terminal.BaseTerminalContext>;
    class ModuleContext extends BaseModuleContext<terminal.RestrictedTerminalContext> {
    }
    class PrivilegedModuleContext extends BaseModuleContext<terminal.TerminalContext> {
    }
}
