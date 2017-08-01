"use strict";
(function () {
    fugazi.components.modules.descriptor.loaded({
        name: "samples.echo.local",
        title: "Simple local command examples",
        commands: {
            "echo": {
                title: "Echo command",
                returns: "string",
                parametersForm: "arguments",
                syntax: "local echo (str string)",
                handler: function (context, str) {
                    return str;
                }
            }
        }
    });
})();
//# sourceMappingURL=examples.local.js.map