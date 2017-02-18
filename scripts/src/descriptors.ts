/**
 * Created by nitzan on 17/02/2017.
 */

export type Named<T extends Component> = T & { name: string };
export type ComponentMap<T extends Component> = { [name: string]: T};

export interface Component {
	name?: string;
	title?: string;
	description?: string;
}

export type TypeDefinition = string | { [name: string]: TypeDefinition };
export interface Type extends Component {
	type: TypeDefinition;
}

export interface RemoteCommand extends Component {
	returns: TypeDefinition;
	syntax: string | string[];
	handler: {
		endpoint?: string;
		method?: string;
	}
}

export interface RemoteDescriptor {
	base?: string;
	proxy?: string;
	origin: string;
}

export interface Module extends Component {
	converters?: string[];
	constraints?: string[];
	types?: ComponentMap<Named<Type>>;
	modules?: ComponentMap<InnerModule> | Array<string | Named<InnerModule>>;
	commands?: ComponentMap<RemoteCommand> | Array<string | Named<RemoteCommand>>;
}

export type NamedModule = Named<Module>;
export type RootModule = Named<Module> & { remote: RemoteDescriptor; };

export type InnerModule = Module & {
	remote?: {
		path: string;
	}
};
