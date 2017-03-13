/// <reference path="../core/utils.d.ts" />
/// <reference path="components.d.ts" />
/// <reference path="constraints.d.ts" />
declare namespace fugazi.components.types {
    interface Definition {
    }
    interface TextualDefinition extends Definition, String {
    }
    interface StructDefinition extends Definition, fugazi.PlainObject<Definition> {
    }
    abstract class Type extends components.Component {
        constructor();
        is(type: Type | string): boolean;
        validate(value: any): boolean;
        toPathedString(): string;
        abstract satisfies(value: any): boolean;
    }
    class CoreType extends Type {
        private check;
        constructor(parent: components.Component, name: string, title: string, satisfyAndValidateFunction: (value: any) => boolean);
        constructor(parent: components.Component, name: string, title: string, description: string, satisfyAndValidateFunction: (value: any) => boolean);
        satisfies(value: any): boolean;
        validate(value: any): boolean;
    }
    class ConstrainedType extends Type {
        protected base: Type;
        protected constraints: constraints.BoundConstraint[];
        constructor();
        getPath(): Path;
        getHierarchicPaths(): Path[];
        getName(): string;
        is(type: Type | string): boolean;
        satisfies(value: any): boolean;
        validate(value: any): boolean;
        getConstraintParamValue(constraint: constraints.Constraint, paramName: string): any;
        getConstraintParamValues(constraint: constraints.Constraint, paramName: string): any[];
        toString(): string;
        toPathedString(): string;
        private isAnonymous();
    }
    namespace descriptor {
        interface Descriptor extends components.descriptor.Descriptor {
            type: Definition;
        }
        interface StructDescriptor extends Descriptor {
            base: string;
        }
        function isAnonymousDefinition(definition: TextualDefinition): boolean;
    }
    namespace builder {
        function create(typeDescriptor: string | descriptor.Descriptor | {
            [name: string]: any;
        }, parent: components.builder.Builder<components.Component>): components.builder.Builder<Type>;
    }
}
