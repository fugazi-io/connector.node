/// <reference path="registry.d.ts" />
/// <reference path="types.d.ts" />
declare module fugazi.components.types.constraints {
    function createBoundConstraints(definition: string, typeBuilder: components.builder.Builder<Type>): BoundConstraint[];
    interface BoundConstraintValidator {
        (value: any): boolean;
    }
    interface UnboundConstraintValidator {
        (...args: any[]): BoundConstraintValidator;
    }
    class Constraint extends components.Component {
        protected types: types.Type[];
        protected paramNames: string[];
        protected validator: UnboundConstraintValidator;
        constructor();
        handles(type: Type): boolean;
        bindWithArray(args: any[]): BoundConstraint;
    }
    class CoreConstraint extends Constraint {
        constructor(parent: components.Component, name: string, title: string, types: types.Type[], paramNames: string[], validator: UnboundConstraintValidator);
        constructor(parent: components.Component, name: string, title: string, description: string, types: types.Type[], paramNames: string[], validator: UnboundConstraintValidator);
    }
    class BoundConstraint {
        private constraint;
        private paramNames;
        private paramValues;
        private validator;
        constructor(constraint: Constraint, paramNames: string[], paramValues: any[], validator: BoundConstraintValidator);
        is(constraint: Constraint): boolean;
        validate(value: any): boolean;
        getParamValue(name: string): any;
    }
    module descriptor {
        interface Descriptor extends components.descriptor.Descriptor {
            types: string[];
            validator: UnboundConstraintValidator;
            params?: string[];
        }
    }
    module builder {
        function create(constraintDescriptor: descriptor.Descriptor, parent: components.builder.Builder<components.Component>): components.builder.Builder<Constraint>;
    }
}
