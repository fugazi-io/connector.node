# fugazi connector.node

A node package for common functionality that is needed for fugazi connectors.  
That includes:

* An http server
* The ability to add modules, either as files or as raw js objects
* The ability to add (remote) commands as js objects and functions
* Automatically adds [remote config](https://github.com/fugazi-io/webclient/blob/master/docs/components/modules.md#remote-module)
* Supports [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) or serves a proxy frame instead
* A ready to use logger

## Installing
The package can be found in [npm @fugazi/connector](https://www.npmjs.com/package/@fugazi/connector).  
Then simply:
```bash
npm install --save @fugazi/connector
```

## Running
The package comes with a (very) simple example to illustrate what the connector does.  
The example includes a single remote command which expects a value (`any`) and returns this value.  

To run the example:
```bash
/CONNECTOR/PATH > node ./scripts/bin/index.js
```

You should now see that the connector is up and running and it should print the url for the descriptor, something like:
```
info: server started. listening on localhost:3333
info: you can load the following urls from any fugazi terminal:
info: http://localhost:3333/examples/remote/descriptor.json
```

Now open the fugazi client (http://fugazi.io) or a locally running instance and load the module:  
`load module from "http://localhost:3333/examples/remote/descriptor.json"`

After the loaded was loaded try it:  
`remote echo hey`

## Using as a package
Example of usage:
```
import * as fugazi from "fugazi.connector.node";

async function command(ctx: fugazi.CommandHandlerContext) {
    ...
}

const module: fugazi.RootModule = { ... }
const builder = new fugazi.Builder();
builder.module("/descriptor.json", module, true);
builder.command("/endpoint", "get", command);

const connector = builder.build();
connector.start();
```

## Using when cloning
1. Clone this repo (let's say that it was cloned to `/CONNECTOR/PATH`)
2. Install dependencies: `/CONNECTOR/PATH > npm install`
3. Compile the scripts:  
`/CONNECTOR/PATH > ./node_modules/typescript/bin/tsc -p ./scripts`

The rest is the same as the sections above.
