export declare type PlainObject<T = any> = {
    [key: string]: T;
};
export declare function forEach(obj: PlainObject, callbackfn: (value: any, key: string, instance: PlainObject) => void, thisArg?: any): void;
export declare function map<T, S>(obj: PlainObject<T>, mapper: (value: T, key: string, obj: PlainObject<T>) => S, thisArg?: any): PlainObject<S>;
