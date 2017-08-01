export declare class Future<T> implements PromiseLike<T> {
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
export declare namespace path {
    type PathGetter = (...paths: string[]) => string;
    function getter(...paths: string[]): PathGetter;
}
