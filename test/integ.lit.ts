import * as path from 'path';
import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2';
import * as apigatewayv2_integrations from '@aws-cdk/aws-apigatewayv2-integrations';
import * as cdk from '@aws-cdk/core';
import * as execa from 'execa';
import { PnpWorkspaceFunction, PnpBundler } from '../src';

const TEST_APP_DIR = path.join(__dirname, '..', 'test-app');

export class IntegLit extends cdk.Stack {
  constructor(scope_: cdk.Construct, id: string, props: cdk.StackProps = {}) {
    super(scope_, id, props);

    const scope = this;
    // noinspection UnnecessaryLocalVariableJS
    const optionalYarnProjectDir = TEST_APP_DIR;

    // ::SNIP
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
    // ::END-SNIP

    new cdk.CfnOutput(scope, 'HttpApiUrl', {
      value: httpApi.url!,
    });
  }
}

if (require.main === module) {
  execa.sync('yarn', ['install'], { cwd: TEST_APP_DIR });
  execa.sync('yarn', ['build'], { cwd: TEST_APP_DIR });

  const app = new cdk.App();
  new IntegLit(app, 'integ-cdk-lambda-pnp-lit');
}