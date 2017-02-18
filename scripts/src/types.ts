/**
 * Created by nitzan on 17/02/2017.
 */

function equals(obj1: any, obj2: any): boolean {
	if (Number.isNaN(obj1) && Number.isNaN(obj2)) {
		return true;
	}

	if (typeof obj1.equals === "function") {
		return obj1.equals(obj2);
	}

	if (obj1.constructor !== obj2.constructor) {
		return false;
	}

	if (isObject(obj1) && isObject(obj2)) {
		return Object.keys(obj1).length === Object.keys(obj2).length
			&& Object.keys(obj1).every((key: any) => equals(obj1[key], obj2[key]));
	}

	return obj1 == obj2;
}

function isObject(obj: any): boolean {
	return obj && obj.constructor === Object || false;
}

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

export class FugMap<K, V> extends Map<K, V> {
	empty(): boolean {
		return this.size === 0;
	}

	find(value: any): any {
		for (let entry of this.entries()) {
			if (equals(value, entry[1])) {
				return entry[0];
			}
		}

		return null;
	}

	contains(value: any): boolean {
		return this.find(value) !== null;
	}

	some(callback: (value: V, key: K, map: Map<K, V>) => boolean, thisArg?: any): boolean {
		for (let entry of this.entries()) {
			if (callback.call(thisArg || this, entry[1], entry[0], this)) {
				return true;
			}
		}

		return false;
	}

	every(callback: (value: V, key: K, map: Map<K, V>) => boolean, thisArg?: any): boolean {
		for (let entry of this.entries()) {
			if (!callback.call(thisArg || this, entry[1], entry[0], this)) {
				return false;
			}
		}

		return true;
	}

	filter<T>(callback: (value: V, key: K, map: Map<K, V>) => boolean, thisArg?: any): Map<K, T>;
	filter(callback: (value: V, key: K, map: Map<K, V>) => boolean, thisArg?: any): Map<K, V> {
		const filtered = new Map<K, V>();

		for (let entry of this.entries()) {
			if (callback.call(thisArg || this, entry[1], entry[0], this)) {
				filtered.set(entry[0], entry[1]);
			}
		}

		return filtered;
	}

	map(callback: (value: V, key: K, map: Map<K, V>) => any, thisArg?: any): any;
	map<T>(callback: (value: V, key: K, map: Map<K, V>) => T, thisArg?: any): Map<K, T> {
		const mapped = new Map<K, T>();

		for (let entry of this.entries()) {
			mapped.set(entry[0], callback.call(thisArg || this, entry[1], entry[0], this));
		}

		return mapped;
	}
}