/// <reference path="polyfill.d.ts" />
declare module fugazi {
    interface PlainObject<T> {
        [key: string]: T;
    }
    interface Callback {
        (): void;
    }
    function is(obj: any, type: NumberConstructor): obj is number;
    function is(obj: any, type: StringConstructor): obj is string;
    function is<T>(obj: any, type: {
        prototype: T;
    }): obj is T;
    function isNull(value: any): boolean;
    function isUndefined(value: any): boolean;
    function isNothing(value: any): boolean;
    function isInteger(num: any): boolean;
    function isFloat(num: any): boolean;
    function isPlainObject(value: any): boolean;
    class Error {
        name: string;
        message: string;
        stack: string;
        linenumber: number;
        constructor(message?: string);
    }
    class Exception extends Error {
        constructor(message: string);
        constructor(message: string, name: string);
        toString(): string;
    }
    module collections {
        interface ArrayLike<T> {
            length: number;
            [index: number]: T;
        }
        interface KeyValueEntry<T> {
            key: string;
            value: T;
        }
        interface Iterator<T> {
            hasNext(): boolean;
            next(): T;
        }
        interface KeyValueIteratorCallback<T> extends Callback {
            (value: T, key: string): void;
        }
        interface KeyValueBooleanIteratorCallback<T> extends Callback {
            (value: T, key: string): boolean;
        }
        class PlainObjectIterator<T> implements Iterator<KeyValueEntry<T>> {
            private items;
            private keys;
            private index;
            constructor(obj: PlainObject<T>);
            hasNext(): boolean;
            next(): KeyValueEntry<T>;
            nextKey(): string;
            nextValue(): T;
        }
        function isEmpty(obj: PlainObject<any>): boolean;
        function defaults(obj: PlainObject<any>, other: PlainObject<any>): void;
        function forEachKeyValue<T>(obj: PlainObject<T>, callback: KeyValueIteratorCallback<T>): void;
        function everyKeyValue<T>(obj: PlainObject<T>, callback: KeyValueBooleanIteratorCallback<T>): boolean;
        function someKeyValue<T>(obj: PlainObject<T>, callback: KeyValueBooleanIteratorCallback<T>): boolean;
        function cloneArray<T>(array: ArrayLike<T>): Array<T>;
        class ArrayIterator<T> implements Iterator<T> {
            private items;
            private index;
            constructor(items: ArrayLike<T>);
            hasNext(): boolean;
            next(): T;
        }
        interface Hashable {
            hash(): string;
        }
        class Map<T> {
            private items;
            private count;
            constructor();
            keys(): string[];
            values(): T[];
            has(key: string): boolean;
            set(key: string, value: T): void;
            get(key: string): T;
            remove(key: string): T;
            empty(): boolean;
            size(): number;
            toString(): string;
            asObject(): {
                [key: string]: T;
            };
            forEach(callback: (value: T, key: string) => void): void;
            every(callback: KeyValueBooleanIteratorCallback<T>): boolean;
            some(callback: KeyValueBooleanIteratorCallback<T>): boolean;
            clone(): Map<T>;
            getIterator(): MapIterator<T>;
            extend(obj: PlainObject<T>): void;
            extend(map: Map<T>): void;
            defaults(obj: PlainObject<T>): void;
            defaults(map: Map<T>): void;
        }
        class MapEntry<K extends Hashable, V> {
            key: K;
            value: V;
            constructor(key: K, value: V);
        }
        class EntryMap<K extends Hashable, V> extends Map<MapEntry<K, V>> {
            hasEntry(key: K): boolean;
            setEntry(key: K, value: V): void;
            getEntry(key: K): V;
            removeEntry(key: K): V;
        }
        class MapIterator<T> implements Iterator<KeyValueEntry<T>> {
            private values;
            private keys;
            private index;
            constructor(items: {
                [key: string]: T;
            });
            hasNext(): boolean;
            next(): KeyValueEntry<T>;
            nextKey(): string;
            nextValue(): T;
        }
        function map<T>(obj?: PlainObject<any> | Map<T>, recursive?: boolean): Map<T>;
        class Stack<T> {
            private items;
            constructor();
            size(): number;
            push(item: T): void;
            peek(): T;
            pop(): T;
        }
        function stack<T>(): Stack<T>;
    }
    class Future<T> implements PromiseLike<T> {
        private parent;
        private promise;
        private resolveFunction;
        private rejectFunction;
        constructor();
        constructor(parent: Future<any>, promise: Promise<any>);
        asPromise(): Promise<T>;
        then<TResult>(onfulfilled?: (value: T) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => TResult | PromiseLike<TResult>): Future<TResult>;
        then<TResult>(onfulfilled?: (value: T) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => void): Future<TResult>;
        catch(onrejected?: (reason: any) => T | PromiseLike<T>): Future<T>;
        catch(onrejected?: (reason: any) => void): Future<T>;
        finally<TResult>(fn: (value: any) => TResult | PromiseLike<TResult>): Future<TResult>;
        resolve(value?: T | PromiseLike<T>): void;
        reject(reason?: any): void;
        private promiseExecutor(resolve, reject);
    }
}
