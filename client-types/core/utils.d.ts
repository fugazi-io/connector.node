/// <reference path="dom.d.ts" />
/// <reference path="logger.d.ts" />
declare module fugazi.utils {
    function defaults(obj: Object, other: Object): void;
    function random(min: number, max: number, integer?: boolean): number;
    function applyMixins(derivedCtor: any, baseCtors: any[]): void;
    interface GenerateIdParameters {
        min?: number;
        max?: number;
        length?: number;
        prefix?: string;
    }
    function generateId(params?: GenerateIdParameters): string;
    class Timer {
        private name;
        private interval;
        private callback;
        constructor(interval: number, callback: Callback);
        reset(): void;
        cancel(): void;
    }
    function loadScript(url: string): any;
    function loadScript(url: string, name: string): any;
    function loadScript(url: string, cached: boolean): any;
    function loadScript(url: string, name: string, cached: boolean): any;
}
