import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { PnpCode } from '../src';

test('bundling code', () => {
  const stack = new cdk.Stack();

  const code = PnpCode.fromYarnBuild(path.join(__dirname, '..', 'test-app'), 'lambda', {
    runInstall: true,
    runBuild: true,
  });

  new lambda.Function(stack, 'Handler', {
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'bundle/packages/lambda/dist/handler.handler',
    code: code,
  });
});
