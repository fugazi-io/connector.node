# fugazi connector.node

A node package for common functionality that is needed for fugazi connectors.  
That includes:

* An http server
* The ability to add modules, either as files or as raw js objects
* The ability to add (remote) commands as js objects and functions
* Autmatically adds [remote config](https://github.com/fugazi-io/webclient/blob/master/docs/components/modules.md#remote-module)
* Supports [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) or serves a proxy frame instead
* A ready to use logger

## Running
The package comes with a (very) simple example to illustrate what the connector does.  
The example includes a single remote command which expects a value (`any`) and returns this value.  

To run the example:

1. Clone this repo (let's say that it was cloned to `/CONNECTOR`)
2. Install dependencies: `/CONNECTOR > npm install`
3. Compile the scripts: `/CONNECTOR > ./node_modules/typescript/bin/tsc -p ./scripts`
4. Run the example: `/CONNECTOR > node ./scripts/bin/index.js`

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
The package isn't published to npm yet, so in order to use it you'll have to use [npm link](https://docs.npmjs.com/cli/link): 

1. `/CONNECTOR > npm link`
2. In the project which you want to use the connector in: `/MY_PROJECT > npm link fugazi.connector.node`

Now you can import the package from your modules.

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
