/// <reference path="components.d.ts" />
/// <reference path="types.d.ts" />
declare namespace fugazi.components.converters {
    class Converter extends Component {
        private input;
        private output;
        private conversionFunction;
        constructor();
        convert(value: any): any;
        getInput(): types.Type;
        getOutput(): types.Type;
    }
    namespace descriptor {
        interface Descriptor extends components.descriptor.Descriptor {
            input: string;
            output: string;
            converter: (input: any) => any;
        }
    }
    namespace builder {
        function create(converterDescriptor: descriptor.Descriptor, parent: components.builder.Builder<components.Component>): components.builder.Builder<Converter>;
    }
}
