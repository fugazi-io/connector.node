import * as objects from "./object";
export declare function from(obj: objects.PlainObject): Map<string, any>;
export declare function empty(map: Map<any, any>): boolean;
export declare function keysArray<K>(map: Map<K, any>): K[];
export declare function valuesArray<V>(map: Map<any, V>): V[];
export declare function toArray<K, V, T>(map: Map<K, V>, mapper: (value: V, key: K, map: Map<K, V>) => T, thisArg?: any): T[];
export declare function toObject<K, V>(map: Map<K, V>): objects.PlainObject<V>;
export declare function map<K1, V1, V2>(map: Map<K1, V1>, mapper: (value: V1, key: K1, map: Map<K1, V1>) => V2, thisArg?: any): Map<K1, V2>;
export declare function map<K1, V1, K2, V2>(map: Map<K1, V1>, mapper: (value: V1, key: K1, map: Map<K1, V1>) => [K2, V2], thisArg?: any): Map<K2, V2>;
export declare function filter<K, V, V2>(map: Map<K, V>, callback: (value: V, key: K, map: Map<K, V>) => boolean, thisArg?: any): Map<K, V2>;
export declare type Extended<K, V> = Map<K, V> & {
    empty(): boolean;
    keysArray(): K[];
    valuesArray(): V[];
    toArray<T>(mapper: (value: V, key: K, map: Map<K, V>) => T, thisArg?: any): T[];
    toObject(): objects.PlainObject<V>;
    map<V2>(mapper: (value: V, key: K, map: Map<K, V>) => V2, thisArg?: any): Map<K, V2>;
    map<K2, V2>(mapper: (value: V, key: K, map: Map<K, V>) => [K2, V2], thisArg?: any): Map<K2, V2>;
    filter(callback: (value: V, key: K, map: Map<K, V>) => boolean, thisArg?: any): Map<K, V>;
    filter<V2>(callback: (value: V, key: K, map: Map<K, V>) => boolean, thisArg?: any): Map<K, V2>;
};
export declare function extend<K, V>(instance?: objects.PlainObject<V> | Map<K, V> | Extended<K, V>): Extended<K, V>;
export declare class ExtendedMap<K, V> extends Map<K, V> implements Extended<K, V> {
    static from(obj: objects.PlainObject): ExtendedMap<string, any>;
    empty(): boolean;
    keysArray(): K[];
    valuesArray(): V[];
    toArray<T>(mapper: (value: V, key: K, map: Map<K, V>) => T, thisArg?: any): T[];
    toObject(): objects.PlainObject<V>;
    map<V2>(mapper: (value: V, key: K, map: Map<K, V>) => V2, thisArg?: any): ExtendedMap<K, V2>;
    filter<V2>(callback: (value: V, key: K, map: Map<K, V>) => boolean, thisArg?: any): ExtendedMap<K, V2>;
}
