import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2';
import * as apigatewayv2_integrations from '@aws-cdk/aws-apigatewayv2-integrations';
import * as cdk from '@aws-cdk/core';
import { YarnWorkspaceFunction } from '../src';
import { TEST_APP_PATH } from '../src/test-app';

export class IntegYarnWorkspace extends cdk.Stack {
  constructor(scope_: cdk.Construct, id: string, props: cdk.StackProps = {}) {
    super(scope_, id, props);

    const scope = this;
    // noinspection UnnecessaryLocalVariableJS
    const optionalYarnProjectDir = TEST_APP_PATH;

    // ::SNIP
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
    // ::END-SNIP

    new cdk.CfnOutput(scope, 'HttpApiUrl', {
      value: httpApi.url!,
    });
  }
}

if (require.main === module) {
  const app = new cdk.App();
  new IntegYarnWorkspace(app, 'integ-cdk-lambda-yarn-workspace');
}