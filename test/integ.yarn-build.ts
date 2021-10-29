import * as path from 'path';
import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2';
import * as apigatewayv2_integrations from '@aws-cdk/aws-apigatewayv2-integrations';
import * as cdk from '@aws-cdk/core';
import { YarnBuildFunction } from '../src';

const TEST_APP_DIR = path.join(__dirname, '..', 'test-app');

export class IntegYarnBuildLit extends cdk.Stack {
  constructor(scope_: cdk.Construct, id: string, props: cdk.StackProps = {}) {
    super(scope_, id, props);

    const scope = this;
    // noinspection UnnecessaryLocalVariableJS
    const optionalYarnProjectDir = TEST_APP_DIR;

    // ::SNIP
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
    // ::END-SNIP

    new cdk.CfnOutput(scope, 'HttpApiUrl', {
      value: httpApi.url!,
    });
  }
}

if (require.main === module) {
  const app = new cdk.App();
  new IntegYarnBuildLit(app, 'integ-cdk-lambda-yarn-build-lit');
}