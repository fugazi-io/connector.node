# fugazi connector.node

A node package for common functionality that is needed for fugazi connectors.  
That includes:

* An http server
* The ability to add modules, either as files or as raw js objects
* The ability to add (remote) commands as js objects and functions
* Automatically adds [remote config](https://github.com/fugazi-io/webclient/blob/master/docs/components/modules.md#remote-module)
* Supports [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) or serves a proxy frame instead
* Supports session state
* A ready to use logger

## Installing
The package can be found in [npm @fugazi/connector](https://www.npmjs.com/package/@fugazi/connector).  
Then simply:
```bash
npm install --save @fugazi/connector
```

## Building & Running
The package comes with a (very) simple example to illustrate what the connector does.  
The example includes two commands which expects a value (`any`) and return this value, one version is a local command and 
  the other is a remote.

To run the example, first build it:
```bash
npm run compile
```

And then start it:

```bash
npm run start
// or
node ./scripts/bin/index.js
```

You should now see that the connector is up and running and it should print the url for the descriptor, something like:
```
info: ===== ROUTES START =====
info: # Files:
info:     /examples.local.js
info: # Commands:
info:     GET : /samples.echo/remote/echo
info: # Root modules:
info:     /samples.echo.json
info: ====== ROUTES END ======
info: server started. listening on localhost:3333
info: connector started
```

Now open the fugazi client (http://fugazi.io) or a locally running instance and load the module:  
`load module from "http://localhost:3333/samples.echo.json"`

After the module was loaded try it:  
`echo remote hey`
Or 
`echo local "how are you?"`

## Using as a package
The connector is created using builders in such a way that building can be chained.  
Example of usage (how the echo example is created):
```
import * as connector from "@fugazi/connector";

const CONNECTOR = new connector.ConnectorBuilder()
	.server()
		.cors(true)
		.parent()
	.module("samples.echo")
		.descriptor({
			title: "Echo example",
			description: "Example of a (echo) remote command using the node connector"
		})
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
			})
	.build();

CONNECTOR.start().then(() => {
	CONNECTOR.logger.info("connector started");
});
```

There's no documentation for the different builders and their methods yet, so until this issue is unresolved please check the 
contact section below.

## Using when cloning
1. Clone this repo (let's say that it was cloned to `/CONNECTOR/PATH`)
2. Install dependencies: `/CONNECTOR/PATH > npm install`
3. Compile the scripts:  
`/CONNECTOR/PATH > ./node_modules/typescript/bin/tsc -p ./scripts`

The rest is the same as the sections above.

## Contact
Feel free to [create issues](https://github.com/fugazi-io/connector.node/issues) if you're running into trouble, 
and welcome to ask any question in [our gitter](https://gitter.im/fugazi-io/Lobby).