"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const server = require("./server");
exports.server = server;
const logger = require("./logger");
exports.logger = logger;
__export(require("./common"));
const components = require("./components");
exports.components = components;
const connector_1 = require("./connector");
exports.ConnectorBuilder = connector_1.ConnectorBuilder;
exports.Connector = connector_1.Connector;
const pathFor = path.join.bind(path, __dirname, "../../");
function createEchoModule(connectorBuilder) {
    connectorBuilder
        .server()
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
exports.VERSION = pjson.version;
function cleanup(logger) {
    logger.info("Closing...");
    process.exit(1);
}
if (require && require.main === module) {
    const builder = new connector_1.ConnectorBuilder();
    createEchoModule(builder);
    const connector = builder.build();
    process.on("SIGINT", cleanup.bind(null, connector.logger));
    process.on("SIGTERM", cleanup.bind(null, connector.logger));
    connector.start().then(() => {
        connector.logger.info("connector started");
    });
}
//# sourceMappingURL=index.js.map