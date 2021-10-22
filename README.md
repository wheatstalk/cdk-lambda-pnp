# CDK Lambda PNP

This CDK library allows you to build and bundle your AWS Lambda functions from a Yarn PNP project.

## Usage
<!-- <macro exec="lit-snip ./test/integ.lit.ts"> -->
```ts
const handler = new lambda.Function(scope, 'Handler', {
  runtime: lambda.Runtime.NODEJS_14_X,
  // Build your code from a yarn workspace.
  code: PnpCode.fromWorkspace('lambda', {
    // Provide an optional yarn package directory. The default is
    // the process's current working directory.
    cwd: optionalYarnPackageDir,
    // Runs 'yarn workspace lambda build'
    runBuild: true,
  }),
  // Path to your handler. Yarn.build puts your project structure under
  // the bundle/ subdirectory.
  handler: 'bundle/packages/lambda/dist/handler.handler',
  environment: {
    // Ensures that the pnp runtime is loaded every time.
    NODE_OPTIONS: '--require bundle/.pnp.cjs',
  },
});

const httpApi = new apigatewayv2.HttpApi(scope, 'HttpApi', {
  defaultIntegration: new apigatewayv2_integrations.LambdaProxyIntegration({
    handler,
  }),
});
```
<!-- </macro> -->
