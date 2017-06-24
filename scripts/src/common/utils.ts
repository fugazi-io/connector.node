/**
 * Created by nitzan on 24/04/2017.
 */

export class Future<T> implements PromiseLike<T> {
	private parent: Future<any>;
	private promise: Promise<T>;
	private resolveFunction: (value?: T | PromiseLike<T>) => void;
	private rejectFunction: (reason?: any) => void;

	constructor();
	constructor(parent: Future<any>, promise: Promise<any>);
	constructor(parent?: Future<any>, promise?: Promise<any>) {
		if (parent && promise) {
			this.parent = parent;
			this.promise = promise;
		} else {
			this.promise = new Promise(this.promiseExecutor.bind(this));
		}
	}

	public asPromise(): Promise<T> {
		return this.promise;
	}

	public then<TResult>(onfulfilled?: (value: T) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => TResult | PromiseLike<TResult>): Future<TResult>;
	public then<TResult>(onfulfilled?: (value: T) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => void): Future<TResult>;
	public then<TResult>(onfulfilled?: (value: T) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => any): Future<TResult> {
		return new Future(this, this.promise.then(onfulfilled!));
	}

	public catch(onrejected?: (reason: any) => T | PromiseLike<T>): Future<T>;
	public catch(onrejected?: (reason: any) => void): Future<T>;
	public catch(onrejected?: (reason: any) => any): Future<T> {
		return new Future(this, this.promise.catch(onrejected));
	}

	finally<TResult>(fn: (value: any) => TResult | PromiseLike<TResult>): Future<TResult> {
		return this.then(fn, function(e: any): void { fn(e); throw e; });
	}

	public resolve(value?: T | PromiseLike<T>) {
		if (this.parent) {
			this.parent.resolve(value);
		} else {
			this.resolveFunction(value);
		}
	}

	public reject(reason?: any) {
		if (this.parent) {
			this.parent.reject(reason);
		} else {
			this.rejectFunction(reason);
		}
	}

	private promiseExecutor(resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) {
		this.resolveFunction = resolve;
		this.rejectFunction = reject;
	}
}

import * as origpath from "path";
export namespace path {
	export type PathGetter = (...paths: string[]) => string;

	export function getter(...paths: string[]): PathGetter {

		return origpath.join.bind(origpath, ...paths);
	}
}
