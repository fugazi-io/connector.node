/**
 * No implementations. Only typescript decelerations for features already implemented in modern browsers (chrome) but are
 * not part of the lib.es6.d.ts
 *
 * Created by nitzan on 03/06/2017.
 */

export {};

declare global {
	interface ObjectConstructor {
		values<T>(o: { [s: string]: T }): T[];
		values(o: any): any[];
		entries<T>(o: { [s: string]: T }): [string, T][];
		entries(o: any): [string, any][];
	}
}