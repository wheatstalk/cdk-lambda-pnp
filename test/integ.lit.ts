import * as path from 'path';
import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2';
import * as apigatewayv2_integrations from '@aws-cdk/aws-apigatewayv2-integrations';
import * as cdk from '@aws-cdk/core';
import { PnpWorkspaceFunction } from '../src';

export class IntegLit extends cdk.Stack {
  constructor(scope_: cdk.Construct, id: string, props: cdk.StackProps = {}) {
    super(scope_, id, props);

    const scope = this;
    const optionalYarnProjectDir = path.join(__dirname, '..', 'test-app');

    // ::SNIP
    // Create a lambda function from a yarn workspace, including only the
    // needed dependencies.
    const handler = new PnpWorkspaceFunction(scope, 'Handler', {
      // Specify the yarn workspace package name
      workspace: 'lambda',
      // Specify the workspace-relative file containing the lambda handler
      handler: 'dist/api.handler',
      // Optionally run 'yarn install'.
      runInstall: true,
      // Optionally run 'yarn workspace lambda build'.
      runBuild: true,

      // Provide an optional yarn project directory. Useful in case you're
      // building a lambda from outside of a yarn pnp environment. By
      // default, we use the process's current working directory.
      cwd: optionalYarnProjectDir,
    });

    // Use your function in an API, for example
    const httpApi = new apigatewayv2.HttpApi(scope, 'HttpApi', {
      defaultIntegration: new apigatewayv2_integrations.LambdaProxyIntegration({
        handler,
      }),
    });
    // ::END-SNIP

    new cdk.CfnOutput(scope, 'HttpApiUrl', {
      value: httpApi.url!,
    });
  }
}

if (require.main === module) {
  const app = new cdk.App();
  new IntegLit(app, 'integ-cdk-lambda-pnp-lit');
}