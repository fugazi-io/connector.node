interface ObjectConstructor {
    is<T>(obj: any, type: {
        new (): T;
    }): obj is T;
    is(obj: any, type: any): boolean;
    isObject(obj: any): boolean;
    equals(obj1: any, obj2: any): boolean;
    merge(...sources: any[]): any;
    merge<T>(...sources: T[]): T;
    deepMerge(...sources: any[]): any;
    deepMerge<T>(...sources: T[]): T;
    partial<S extends T, T>(source: S, options: {
        include?: Array<keyof S>;
        exclude?: Array<keyof S>;
    }): T;
}
declare function equals(obj1: any, obj2: any): boolean;
interface URLUtils {
    hash: string;
    search: string;
    pathname: string;
    port: string;
    hostname: string;
    host: string;
    password: string;
    username: string;
    protocol: string;
    origin: string;
    href: string;
}
interface URL extends URLUtils {
    new (url: string, base?: string | URL): URL;
}
interface String {
    empty(): boolean;
    trimLeft(): string;
    trimRight(): string;
    startsWith(searchString: string, position?: number): boolean;
    endsWith(searchString: string, position?: number): boolean;
    has(substr: string): boolean;
    first(): string;
    last(): string;
    test(regex: RegExp): boolean;
    exec(regex: RegExp): RegExpExecArray;
    count(character: string): number;
    forEach(fn: (char: string, index?: number, str?: string) => void): void;
    some(fn: (char: string, index?: number, str?: string) => boolean): boolean;
    every(fn: (char: string, index?: number, str?: string) => boolean): boolean;
}
interface ArrayConstructor {
    from(arrayLike: any, mapFn?: Function, thisArg?: any): Array<any>;
}
interface Array<T> {
    empty(): boolean;
    first(condition?: (item: T) => boolean): T;
    last(): T;
    clone(): Array<T>;
    equals(other: Array<T>): boolean;
    includes(item: T, fromIndex?: number): boolean;
    includesAll(items: T[]): boolean;
    includesAll(...items: T[]): boolean;
    remove(item: T | number): T;
    replace(item: number | T, other: T): T;
    extend(other: Array<T>): void;
    getIterator(): fugazi.collections.ArrayIterator<any>;
}
interface MapConstructor {
    from<V>(obj: {
        [key: string]: V;
    } | Map<any, V>, deep?: boolean): Map<string, V>;
}
interface Map<K, V> {
    empty(): boolean;
    find(value: V): K;
    contains(value: V): boolean;
    clone(deep?: boolean): Map<K, V>;
    toObject(): {
        [key: string]: any;
    };
    equals(other: Map<K, V>): boolean;
    merge(...maps: Array<Map<K, V> | {
        [key: string]: V;
    }>): void;
    deepMerge(...maps: Array<Map<K, V> | {
        [key: string]: V;
    }>): void;
    some(callback: (value: V, key: K, map: Map<K, V>) => boolean, thisArg?: any): boolean;
    every(callback: (value: V, key: K, map: Map<K, V>) => boolean, thisArg?: any): boolean;
    map<T>(callback: (value: V, key: K, map: Map<K, V>) => T, thisArg?: any): T[];
    map<K2, V2>(callback: (value: V, key: K, map: Map<K, V>) => [K2, V2], thisArg?: any): Map<K2, V2>;
}
