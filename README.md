![GitHub Workflow Status](https://img.shields.io/github/workflow/status/wheatstalk/cdk-lambda-pnp/build)
[![npm](https://img.shields.io/npm/v/@wheatstalk/cdk-lambda-pnp)](https://www.npmjs.com/package/@wheatstalk/cdk-lambda-pnp)
[![construct hub link](https://img.shields.io/badge/link-construct%20hub-blue)](https://constructs.dev/packages/@wheatstalk/cdk-lambda-pnp)

# CDK Lambda PnP Functions

This CDK library allows you to bundle and deploy your AWS Lambda functions
from a Yarn PnP project. This project emphasizes using the PnP runtime inside
the Lambda environment without single-file bundling.

**Features**

* Bundles yarn workspaces and their dependencies so that you can use Yarn PnP in AWS Lambda.
* Smaller node dependency file sizes due to PnP compression
* First-class support for [`yarn workspaces focus`][yarn-workspaces-focus] and [`yarn.BUILD`][yarn-build]
* CDK hotswap compatibility to speed up your inner loop
* Allows you to group related lambda handlers into fewer assets to reduce asset publishing time
* Bring-your-own typescript compiler (works with tsc, esbuild, and swc.)
* Supports cross-workspace module resolution
* Supports hard-to-bundle packages if yarn PnP supports them

[yarn-workspaces-focus]: https://yarnpkg.com/cli/workspaces/focus
[yarn-build]: https://yarn.build/

## Yarn Workspace Function

`YarnWorkspaceFunction` provides a basic lambda function from a yarn workspace.
Your compiled code and dependencies are staged and trimmed down using yarn's
`workspace-tools` plugin and `yarn workspaces focus` command.

<!-- <macro exec="lit-snip ./test/integ.yarn-workspace.ts"> -->
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

The `YarnBuildFunction` construct provides a more robust out-of-the-box
experience through the [yarn.BUILD](https://yarn.build/) yarn plugin. In
addition to bundling code from a yarn workspace, this construct allows you
to run yarn.BUILD's build command during construct synthesis. This build
command will automatically build your workspace and all workspace
dependencies.

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
