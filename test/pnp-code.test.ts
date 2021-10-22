import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as execa from 'execa';
import { PnpCode } from '../src';

test('creating a function', () => {
  const stack = new cdk.Stack();

  const cwd = path.join(__dirname, '..', 'test-app');
  execa.sync('yarn', ['install'], { cwd });

  const code = PnpCode.fromWorkspace('lambda', {
    cwd,
    runBuild: true,
  });

  new lambda.Function(stack, 'Handler', {
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'bundle/packages/lambda/dist/handler.handler',
    code: code,
  });
});

