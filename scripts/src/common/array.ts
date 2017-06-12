/**
 * Created by nitzan on 19/04/2017.
 */

export function equals(first: any[], second: any[]): boolean;
export function equals<T>(first: T[], second: T[]): boolean {
	if (!first && !second) {
		return true;
	}

	if (!first || !second) {
		return false;
	}

	if (first.length !== second.length) {
		return false;
	}

	for (let i = 0; i < first.length; i++) {
		if (first[i] != second[i]) {
			return false;
		}
	}

	return true;
}

export function clone(arr: any[]): any[];
export function clone<T>(arr: T[]): T[] {
	return arr.slice(0);
}

export function cloneAndPush(arr: any[], item: any): any[];
export function cloneAndPush<T>(arr: T[], item: T): T[] {
	const cloned = clone(arr);
	cloned.push(item);
	return cloned;
}

export function empty(arr: ArrayLike<any>): boolean {
	return arr.length === 0;
}

export function first<T = any>(arr: T[]): T {
	return arr[0];
}

export function last<T = any>(arr: T[]): T {
	return arr[arr.length - 1];
}

export type Extended<T> = T[] & {
	equals(other: T[]): boolean;
	clone(): T[];
	cloneAndPush(item: T): T[];
	empty(): boolean;
	first(): T;
	last(): T;
}
export function extend<T>(instance?: T[]): Extended<T> {
	instance = instance || [];

	Object.defineProperties(instance, {
		"equals": {
			value: equals.bind(instance, instance)
		},
		"clone": {
			value: clone.bind(instance, instance)
		},
		"cloneAndPush": {
			value: cloneAndPush.bind(instance, instance)
		},
		"empty": {
			value: empty.bind(instance, instance)
		},
		"first": {
			value: first.bind(instance, instance)
		},
		"last": {
			value: last.bind(instance, instance)
		}
	});

	return instance as Extended<T>;
}

export class ExtendedArray<T> extends Array<T> implements Extended<T> {
	static from<T>(arr: T[]): ExtendedArray<T> {
		return new ExtendedArray(...arr);
	}

	equals(other: T[]): boolean {
		return equals(this, other);
	}

	clone(): ExtendedArray<T> {
		return new ExtendedArray<T>(...this);
	}

	cloneAndPush(item: T): ExtendedArray<T> {
		return new ExtendedArray(...cloneAndPush(this, item));
	}

	concat(...items: T[][]): ExtendedArray<T>;
	concat(...items: (T | T[])[]): ExtendedArray<T>;
	concat(...items: (T | T[])[]): ExtendedArray<T> {
		return ExtendedArray.from(super.concat(...items));
	}

	empty(): boolean {
		return empty(this);
	}

	first(): T {
		return first(this);
	}

	last(): T {
		return last(this);
	}

	filter(callback: (value: T, index: number, array: T[]) => any, thisArg?: any): ExtendedArray<T> {
		return new ExtendedArray(...super.filter(callback, thisArg));
	}
}
