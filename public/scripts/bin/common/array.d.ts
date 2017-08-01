export declare function equals(first: any[], second: any[]): boolean;
export declare function clone(arr: any[]): any[];
export declare function cloneAndPush(arr: any[], item: any): any[];
export declare function empty(arr: ArrayLike<any>): boolean;
export declare function first<T = any>(arr: T[]): T;
export declare function last<T = any>(arr: T[]): T;
export declare type Extended<T> = T[] & {
    equals(other: T[]): boolean;
    clone(): T[];
    cloneAndPush(item: T): T[];
    empty(): boolean;
    first(): T;
    last(): T;
};
export declare function extend<T>(instance?: T[]): Extended<T>;
export declare class ExtendedArray<T> extends Array<T> implements Extended<T> {
    static from<T>(arr: T[]): ExtendedArray<T>;
    equals(other: T[]): boolean;
    clone(): ExtendedArray<T>;
    cloneAndPush(item: T): ExtendedArray<T>;
    concat(...items: T[][]): ExtendedArray<T>;
    concat(...items: (T | T[])[]): ExtendedArray<T>;
    empty(): boolean;
    first(): T;
    last(): T;
    filter(callback: (value: T, index: number, array: T[]) => any, thisArg?: any): ExtendedArray<T>;
}
