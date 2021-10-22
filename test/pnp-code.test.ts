import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { PnpCode } from '../src';

test('creating a function', () => {
  const stack = new cdk.Stack();

  new lambda.Function(stack, 'Handler', {
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'bundle/packages/lambda/dist/handler.handler',
    code: PnpCode.fromWorkspace('lambda', {
      cwd: path.join(__dirname, '..', 'test-app'),
      runBuild: true,
    }),
  });
});

