/**
 * Created by nitzan on 24/03/2017.
 */

import * as map  from "./map";
import * as array  from "./array";
import * as utils  from "./utils";
import * as descriptors  from "./descriptors";
import * as clientTypes  from "./clientTypes";

export { map, array, utils, descriptors, clientTypes };

export function equals(obj1: any, obj2: any): boolean {
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

export function isObject(obj: any): boolean {
	return obj && obj.constructor === Object || false;
}