import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2';
import * as apigatewayv2_integrations from '@aws-cdk/aws-apigatewayv2-integrations';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { PnpCode } from '../src';
import { buildTestApp, TEST_APP_PATH } from '../src/test-app';

export class IntegYarnWorkspace2Fn extends cdk.Stack {
  constructor(scope_: cdk.Construct, id: string, props: cdk.StackProps = {}) {
    super(scope_, id, props);

    const scope = this;
    // noinspection UnnecessaryLocalVariableJS
    const optionalYarnProjectDir = TEST_APP_PATH;

    // ::SNIP
    const code = PnpCode.fromYarnWorkspace(optionalYarnProjectDir, 'lambda');

    const defaultHandler = new lambda.Function(scope, 'Handler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code,
      handler: 'packages/lambda/dist/api.handler',
      environment: {
        NODE_OPTIONS: '--require ./.pnp.cjs',
      },
    });

    // Use your function in an API, for example
    const httpApi = new apigatewayv2.HttpApi(scope, 'HttpApi', {
      defaultIntegration: new apigatewayv2_integrations.LambdaProxyIntegration({
        handler: defaultHandler,
      }),
    });

    const handler2 = new lambda.Function(scope, 'Handler2', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code,
      handler: 'packages/lambda/dist/api2.handler',
      environment: {
        NODE_OPTIONS: '--require ./.pnp.cjs',
      },
    });

    httpApi.addRoutes({
      path: '/api2',
      integration: new apigatewayv2_integrations.LambdaProxyIntegration({
        handler: handler2,
      }),
    });
    // ::END-SNIP

    new cdk.CfnOutput(scope, 'HttpApiUrl', {
      value: httpApi.url!,
    });
  }
}

if (require.main === module) {
  buildTestApp();

  const app = new cdk.App();
  new IntegYarnWorkspace2Fn(app, 'integ-cdk-lambda-yarn-workspace-2fn');
}