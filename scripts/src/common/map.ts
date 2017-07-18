/**
 * Created by nitzan on 24/03/2017.
 */

import * as objects from "./object";

export function from(obj: objects.PlainObject): Map<string, any>;
export function from<T>(obj: objects.PlainObject<T>): Map<string, T> {
	const entries: [string, T][] = [];

	objects.forEach(obj, (value, key) => entries.push([key, value]));

	return new Map(entries);
}

export function empty(map: Map<any, any>): boolean {
	return map.size === 0;
}

export function keysArray<K>(map: Map<K, any>): K[] {
	const keys = [] as K[];

	for (let key of map.keys()) {
		keys.push(key);
	}

	return keys;
}

export function valuesArray<V>(map: Map<any, V>): V[] {
	const values = [] as V[];

	for (let value of map.values()) {
		values.push(value);
	}

	return values;
}

export function toArray<K, V, T>(map: Map<K, V>, mapper: (value: V, key: K, map: Map<K, V>) => T, thisArg?: any): T[] {
	const arr = [] as T[];

	for (let entry of map.entries()) {
		arr.push(mapper.call(thisArg, entry[1], entry[0], map));
	}

	return arr;
}

export function toObject<K, V>(map: Map<K, V>): objects.PlainObject<V> {
	const obj = Object.create(null);
	for (let [k, v] of map) {
		obj[k] = v;
	}
	return obj;
}

function _map<K1, V1, K2, V2, M extends Map<K2, V2>>(original: Map<K1, V1>, mapped: M, mapper: (value: V1, key: K1, map: Map<K1, V1>) => [K2, V2] | V2, thisArg?: any): M {
	for (let entry of original.entries()) {
		const newEntry = mapper.call(thisArg, entry[1], entry[0], original);

		if (newEntry instanceof Array) {
			mapped.set(newEntry[0], newEntry[1]);
		} else {
			mapped.set(entry[0] as any, newEntry);
		}
	}

	return mapped;
}

export function map<K1, V1, V2>(map: Map<K1, V1>, mapper: (value: V1, key: K1, map: Map<K1, V1>) => V2, thisArg?: any): Map<K1, V2>;
export function map<K1, V1, K2, V2>(map: Map<K1, V1>, mapper: (value: V1, key: K1, map: Map<K1, V1>) => [K2, V2], thisArg?: any): Map<K2, V2>;
export function map<K1, V1, K2, V2>(map: Map<K1, V1>, mapper: (value: V1, key: K1, map: Map<K1, V1>) => [K2, V2] | V2, thisArg?: any): Map<K2, V2> {
	const newMap = new Map<K2, V2>();

	return _map(map, newMap, mapper, thisArg);
}

function _filter<M extends Map<K, V>, K, V>(original: M, filtered: M, callback: (value: V, key: K, map: Map<K, V>) => boolean, thisArg?: any): M {
	for (let entry of original.entries()) {
		if (callback.call(thisArg || map, entry[1], entry[0], map)) {
			filtered.set(entry[0], entry[1]);
		}
	}

	return filtered;
}

export function filter<K, V, V2>(map: Map<K, V>, callback: (value: V, key: K, map: Map<K, V>) => boolean, thisArg?: any): Map<K, V2>;
export function filter<K, V>(map: Map<K, V>, callback: (value: V, key: K, map: Map<K, V>) => boolean, thisArg?: any): Map<K, V> {
	return _filter(map, new Map<K, V>(), callback, thisArg);
}

export type Extended<K, V> = Map<K, V> & {
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
export function extend<K, V>(instance?: objects.PlainObject<V> | Map<K, V> | Extended<K, V>): Extended<K, V> {
	instance = instance || new Map();

	if (instance)

	if (instance.hasOwnProperty("__extended__") || instance instanceof ExtendedMap) {
		return instance as Extended<K, V>;
	}

	Object.defineProperties(instance, {
		"__extended__": {
			value: true
		},
		"empty": {
			value: empty.bind(instance, instance)
		},
		"keysArray": {
			value: keysArray.bind(instance, instance)
		},
		"valuesArray": {
			value: valuesArray.bind(instance, instance)
		},
		"toArray": {
			value: toArray.bind(instance, instance)
		},
		"toObject": {
			value: toObject.bind(instance, instance)
		},
		"map": {
			value: map.bind(instance, instance)
		},
		"filter": {
			value: filter.bind(instance, instance)
		}
	});

	return instance as Extended<K, V>;
}

export class ExtendedMap<K, V> extends Map<K, V> implements Extended<K, V> {
	static from(obj: objects.PlainObject): ExtendedMap<string, any>;
	static from<T>(obj: objects.PlainObject<T>): ExtendedMap<string, T> {
		const entries: [string, T][] = [];

		objects.forEach(obj, (value, key) => entries.push([key, value]));

		return new ExtendedMap(entries);
	}

	empty() {
		return empty(this);
	}

	keysArray() {
		return keysArray(this);
	}

	valuesArray() {
		return valuesArray(this);
	}

	toArray<T>(mapper: (value: V, key: K, map: Map<K, V>) => T, thisArg?: any) {
		return toArray(this, mapper, thisArg);
	}

	toObject(): objects.PlainObject<V> {
		return toObject(this);
	}

	map<V2>(mapper: (value: V, key: K, map: Map<K, V>) => V2, thisArg?: any): ExtendedMap<K, V2>;
	map<K2, V2>(mapper: (value: V, key: K, map: Map<K, V>) => [K2, V2], thisArg?: any): ExtendedMap<K2, V2> {
		return _map(this, new ExtendedMap<K2, V2>(), mapper, thisArg);
	}

	filter<V2>(callback: (value: V, key: K, map: Map<K, V>) => boolean, thisArg?: any): ExtendedMap<K, V2>;
	filter(callback: (value: V, key: K, map: Map<K, V>) => boolean, thisArg?: any): ExtendedMap<K, V> {
		return _filter(this, new ExtendedMap<K, V>(), callback, thisArg);
	}
}