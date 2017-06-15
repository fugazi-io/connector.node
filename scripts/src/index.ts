/**
 * Created by nitzan on 16/02/2017.
 */

import * as path from "path";
import * as winston from "winston";

// re-export
import * as server from "./server";
export { server };

//import * as common from "./common";
export * from "./common";
import * as components from "./components";
import { ConnectorBuilder, Connector } from "./connector";
export {
	components,
	Connector,
	ConnectorBuilder
};

const pathFor = path.join.bind(path, __dirname, "../../");

function createEchoModule(connectorBuilder: ConnectorBuilder): void {
	connectorBuilder
		.server()
			.cors(true)
			.parent()
		.module("samples.echo")
			.descriptor({
				title: "Echo example",
				description: "Example of a (echo) remote and local commands using the node connector"
			})
			.modules(pathFor("public/scripts/bin/examples.local.js"))
			.module("remote")
				.descriptor({
					title: "Remote echo module",
				})
					.command("echo", {
						title: "Echo command",
						returns: "string",
						syntax: "remote echo (str string)"
					})
					.handler((request) => {
						return { data: request.data("str") };
					});
}

const pjson = require("../../package.json");
export const VERSION = pjson.version as string;

function cleanup(logger: winston.LoggerInstance) {
	logger.info("Closing...");
	process.exit(1);
}

if (require && require.main === module) {
	const builder = new ConnectorBuilder();
	createEchoModule(builder);

	const connector = builder.build();

	process.on("SIGINT", cleanup.bind(null, connector.logger));
	process.on("SIGTERM", cleanup.bind(null, connector.logger));

	connector.start().then(() => {
		connector.logger.info("connector started");
	});
}