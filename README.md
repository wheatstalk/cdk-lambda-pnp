# CDK Lambda PNP

This CDK library allows you to build and bundle your AWS Lambda functions from a Yarn PNP project.

## Usage
<!-- <macro exec="lit-snip ./test/integ.lit.ts"> -->
```ts
// Create a lambda function from a yarn workspace, including only the
// needed dependencies.
const handler = new PnpWorkspaceFunction(scope, 'Handler', {
  // Specify the yarn workspace package name
  workspace: 'lambda',
  // Specify the workspace-relative file containing the lambda handler
  handler: 'dist/api.handler',

  // Optionally specify how your yarn pnp project hshould be bundled.
  bundler: PnpBundler.fromWorkspaceFocus({
    // Provide an optional yarn project directory. Useful in case you're
    // building a lambda from outside of a yarn pnp environment. By
    // default, we use the process's current working directory.
    projectPath: optionalYarnProjectDir,
  }),
});

// Use your function in an API, for example
const httpApi = new apigatewayv2.HttpApi(scope, 'HttpApi', {
  defaultIntegration: new apigatewayv2_integrations.LambdaProxyIntegration({
    handler,
  }),
});
```
<!-- </macro> -->
