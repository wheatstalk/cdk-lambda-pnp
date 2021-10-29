# CDK Lambda PnP Functions

This CDK library allows you to bundle and deploy your AWS Lambda functions
from a Yarn PnP project. This project emphasizes using the PnP runtime inside
the Lambda environment without single-file bundling.

## Yarn Workspace Function

This construct provides a basic lambda function from a yarn workspace. Your
compiled code and dependencies are staged and trimmed down using yarn's
`workspace-tools` plugin and `yarn workspaces focus` command.

<!-- <macro exec="lit-snip ./test/integ.workspace-focus.ts"> -->
```ts
const handler = new YarnWorkspaceFunction(scope, 'Handler', {
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

### Excluding files

To exclude files from the lambda code bundle, add standard `.npmignore` files
to your packages. It is generally recommended to include a `.npmignore` in the
package that synthesizes your `cdk.out` cloud assembly to avoid bundling the
`cdk.out` directory.

Example project structure:

```
.
├── package.json
├── ...
└── packages
    ├── api
    │   ├── package.json
    │   └── ...
    └── cdk
        ├── package.json
        ├── .npmignore
        ├── ...
        └── cdk.out <.npmignored>
            └── ... <.npmignored>
```

## Use yarn.BUILD

This construct provides a more robust out-of-the-box experience through the
[yarn.BUILD](https://yarn.build/) yarn plugin. In addition to bundling code
from a yarn workspace, this construct allows you to run yarn.BUILD's build
command during construct synthesis. 

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
