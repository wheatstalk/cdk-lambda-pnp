import * as path from 'path';
import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2';
import * as apigatewayv2_integrations from '@aws-cdk/aws-apigatewayv2-integrations';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { PnpCode } from '../src';

export class IntegLit extends cdk.Stack {
  constructor(scope_: cdk.Construct, id: string, props: cdk.StackProps = {}) {
    super(scope_, id, props);

    const scope = this;
    const optionalYarnPackageDir = path.join(__dirname, '..', 'test-app');

    // ::SNIP
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