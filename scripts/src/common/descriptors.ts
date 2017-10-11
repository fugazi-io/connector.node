/**
 * Global definitions for the different fugazi components and utils to handle them.
 *
 * Created by nitzan on 17/02/2017.
 */

import "./polyfill"; // needed for compilation
import { map as mapObject } from "./object";

export type Named<T extends Component> = T & { name: string };
export type ComponentMap<T extends Component> = { [name: string]: T };

export interface Component {
	name?: string;
	title?: string;
	description?: string;
}
export type NamedComponent = Named<Component>;

export type TypeDefinition = string | { [name: string]: TypeDefinition };
export interface Type extends Component {
	type: TypeDefinition;
}
export type NamedType = Named<Type>;

export interface Command extends Component {}

export interface RemoteCommand extends Command {
	returns: TypeDefinition;
	syntax: string | string[];
	handler: {
		endpoint?: string;
		method?: string;
	}
}
export type NamedRemoteCommand = Named<RemoteCommand>;

export type ComponentCollection<T extends Component> = ComponentMap<T> | Array<string | Named<T>>;
export type CollectionIterator<T extends Component> = {
	forEach(cb: (value: Named<T> | string) => void, thisArg?: any): void;
}
export function collectionIterator<T extends Component>(collection: ComponentCollection<T>): CollectionIterator<T> {
	const array = collection instanceof Array ? collection : Object.values(mapObject(collection, (value, name) => Object.assign(value, { name })));

	return {
		forEach: array.forEach
	};
}

export interface RelativeRemoteDescriptor {
	path: string;
}
export interface Module<R = RelativeRemoteDescriptor> extends Component {
	remote?: R;
	converters?: string[];
	constraints?: string[];
	types?: ComponentCollection<Type>;
	lookup?: { [name: string]: string };
	modules?: ComponentCollection<Module>;
	commands?: ComponentCollection<Command>;
}
export type NamedModule = Named<Module>;

export interface RootRemoteDescriptor {
	base?: string;
	proxy?: string;
	auth?: "basic"; // currently only basic auth is supported
	origin: string;
}
export type RootModule = Named<Module<RootRemoteDescriptor>>;
