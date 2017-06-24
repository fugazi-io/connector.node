/**
 * Created by nitzan on 24/04/2017.
 */

export type PlainObject<T = any> = { [key: string]: T };

export function forEach(obj: PlainObject, callbackfn: (value: any, key: string, instance: PlainObject) => void, thisArg?: any): void;
export function forEach<T>(obj: PlainObject<T>, callbackfn: (value: T, key: string, instance: PlainObject<T>) => void, thisArg?: any): void {
	Object.keys(obj).forEach((value, key, instance) => callbackfn.call(thisArg, value, key, instance));
}

export function map<T, S>(obj: PlainObject<T>, mapper: (value: T, key: string, obj: PlainObject<T>) => S, thisArg?: any): PlainObject<S> {
	const mapped = {} as PlainObject<S>;

	forEach(obj, (value, key) => {
		mapped[key] = mapper.call(thisArg, value, key, obj);
	});

	return mapped;
}