# CDK Lambda PNP

This CDK library allows you to build and bundle your AWS Lambda functions from a Yarn PNP project.

## Use Yarn Build
If you have imported the [yarn.build](https://yarn.build/) plugin, you may
create a lambda using the plugin's `build` and `bundle` commands.

<!-- <macro exec="lit-snip ./test/integ.yarn-build.ts"> -->
```ts
const handler = new YarnBuildFunction(scope, 'Handler', {
  // Specify the yarn workspace package name
  workspace: 'lambda',
  // Specify the workspace-relative path containing the lambda handler
  handler: 'dist/api.handler',
  // Optionally run 'yarn install'.
  runInstall: true,
  // Optionally run 'yarn workspace lambda build'.
  runBuild: true,
  // Optionally specify where to find the yarn project
  projectPath: optionalYarnProjectDir,
});

// Use your function in an API, for example
const httpApi = new apigatewayv2.HttpApi(scope, 'HttpApi', {
  defaultIntegration: new apigatewayv2_integrations.LambdaProxyIntegration({
    handler,
  }),
});
```
<!-- </macro> -->

## Use Yarn's Workspace Focus
This construct provides an alternative to `yarn.build` that bundles the lambda
in a staging directory using `yarn workspaces focus ...`

<!-- <macro exec="lit-snip ./test/integ.workspace-focus.ts"> -->
```ts
const handler = new WorkspaceFocusFunction(scope, 'Handler', {
  // Specify the yarn workspace package name
  workspace: 'lambda',
  // Specify the workspace-relative file containing the lambda handler
  handler: 'dist/api.handler',
  // Optionally specify where to find the yarn project
  projectPath: optionalYarnProjectDir,
});

// Use your function in an API, for example
const httpApi = new apigatewayv2.HttpApi(scope, 'HttpApi', {
  defaultIntegration: new apigatewayv2_integrations.LambdaProxyIntegration({
    handler,
  }),
});
```
<!-- </macro> -->
