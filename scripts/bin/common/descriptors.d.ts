import "./polyfill";
export declare type Named<T extends Component> = T & {
    name: string;
};
export declare type ComponentMap<T extends Component> = {
    [name: string]: T;
};
export interface Component {
    name?: string;
    title?: string;
    description?: string;
}
export declare type NamedComponent = Named<Component>;
export declare type TypeDefinition = string | {
    [name: string]: TypeDefinition;
};
export interface Type extends Component {
    type: TypeDefinition;
}
export declare type NamedType = Named<Type>;
export interface Command extends Component {
}
export interface RemoteCommand extends Command {
    returns: TypeDefinition;
    syntax: string | string[];
    handler: {
        endpoint?: string;
        method?: string;
    };
}
export declare type NamedRemoteCommand = Named<RemoteCommand>;
export declare type ComponentCollection<T extends Component> = ComponentMap<T> | Array<string | Named<T>>;
export declare type CollectionIterator<T extends Component> = {
    forEach(cb: (value: Named<T> | string) => void, thisArg?: any): void;
};
export declare function collectionIterator<T extends Component>(collection: ComponentCollection<T>): CollectionIterator<T>;
export interface RelativeRemoteDescriptor {
    path: string;
}
export interface Module<R = RelativeRemoteDescriptor> extends Component {
    remote?: R;
    converters?: string[];
    constraints?: string[];
    types?: ComponentCollection<Type>;
    lookup?: {
        [name: string]: string;
    };
    modules?: ComponentCollection<Module>;
    commands?: ComponentCollection<Command>;
}
export declare type NamedModule = Named<Module>;
export interface RootRemoteDescriptor {
    base?: string;
    proxy?: string;
    origin: string;
}
export declare type RootModule = Named<Module<RootRemoteDescriptor>>;
