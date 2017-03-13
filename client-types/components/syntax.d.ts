/// <reference path="components.d.ts" />
/// <reference path="types.d.ts" />
declare module fugazi.components.commands.syntax {
    enum TokenType {
        Keyword = 0,
        Parameter = 1,
    }
    interface RuleToken {
        tolerates(input: any): boolean;
        validates(input: any): boolean;
        getTokenType(): TokenType;
        equals(otherToken: RuleToken): boolean;
        toString(): string;
    }
    class SyntaxRule extends components.Component {
        readonly raw: any;
        private tokens;
        constructor();
        add(token: RuleToken): void;
        getTokens(): RuleToken[];
        toString(): string;
    }
    class Keyword implements RuleToken {
        private value;
        private distanceCache;
        constructor(word: string);
        tolerates(input: string): boolean;
        validates(input: string): boolean;
        getTokenType(): TokenType;
        getWord(): string;
        equals(other: RuleToken): boolean;
        toString(): string;
        private computeDistance(challenge, target);
    }
    class Parameter implements RuleToken {
        private name;
        private type;
        constructor(name: string, type: types.Type);
        getName(): string;
        getType(): types.Type;
        tolerates(input: string | types.Type): boolean;
        validates(input: string | types.Type): boolean;
        getTokenType(): TokenType;
        equals(other: RuleToken): boolean;
        toString(): string;
    }
    namespace descriptor {
        interface Descriptor extends components.descriptor.Descriptor {
            rule: string;
        }
    }
    namespace builder {
        function create(rule: string, parent: components.builder.Builder<components.Component>): components.builder.Builder<SyntaxRule>;
    }
}
