# CDK Lambda PNP

This CDK library allows you to build and bundle your AWS Lambda functions from a Yarn PNP project.

## Usage
<!-- <macro exec="lit-snip ./test/integ.lit.ts"> -->
```ts
// Build and bundle your code from a yarn workspace, including only the
// needed dependencies.
const code = PnpCode.fromWorkspace('lambda', {
  // Provide an optional yarn project directory. The default is the
  // process's current working directory.
  cwd: optionalYarnProjectDir,
  // Runs 'yarn workspace lambda build'. The default is not to build.
  runBuild: true,
});

// Add the code to your function
const handler = new lambda.Function(scope, 'Handler', {
  runtime: lambda.Runtime.NODEJS_14_X,
  code: code,
  // The bundler puts your project in the asset's bundle/ directory.
  handler: 'bundle/packages/lambda/dist/handler.handler',
  environment: {
    // Ensures that the pnp runtime is loaded every time.
    NODE_OPTIONS: '--require bundle/.pnp.cjs',
  },
});

// Use your function in an API, for example
const httpApi = new apigatewayv2.HttpApi(scope, 'HttpApi', {
  defaultIntegration: new apigatewayv2_integrations.LambdaProxyIntegration({
    handler,
  }),
});
```
<!-- </macro> -->
