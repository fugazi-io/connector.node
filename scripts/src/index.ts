/**
 * Created by nitzan on 16/02/2017.
 */

import * as winston from "winston";

// re-export
import * as server from "./server";
export { server };

import * as components from "./components";
import { ConnectorBuilder } from "./connector";
export {
	components,
	ConnectorBuilder
};

function createEchoModule(connectorBuilder: ConnectorBuilder): void {
	connectorBuilder
		.server()
			.cors(true)
			.parent()
		.module("examples.remote")
			.descriptor({
				title: "Remote example",
				description: "Example of a (echo) remote command using the node connector"
			})
				.command("echo", {
					title: "Echo command",
					returns: "string",
					syntax: "remote echo (str string)"
				})
				.returns("string")
				.handler((request) => {
					return { data: request.data.search.get("str") };
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