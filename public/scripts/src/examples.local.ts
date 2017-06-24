/// <reference path="../../../client-types/components/components.d.ts" />
/// <reference path="../../../client-types/components/modules.d.ts" />

/**
 * Created by nitzan on 13/06/2017.
 */

(function(): void {
	fugazi.components.modules.descriptor.loaded(<fugazi.components.modules.descriptor.Descriptor> {
		name: "samples.echo.local",
		title: "Simple local command examples",
		commands: {
			"echo": {
				title: "Echo command",
				returns: "string",
				parametersForm: "arguments",
				syntax: "local echo (str string)",
				handler: function(context: fugazi.app.modules.ModuleContext, str: string): string {
					return str;
				}
			}
		}
	});
})();