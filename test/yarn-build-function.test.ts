import * as cdk from '@aws-cdk/core';
import { YarnBuildFunction } from '../src';
import { TEST_APP_PATH } from '../src/constants';

test('creating a function', () => {
  const stack = new cdk.Stack();

  new YarnBuildFunction(stack, 'Handler', {
    workspace: 'lambda',
    handler: 'dist/handler.handler',
    runInstall: true,
    runBuild: true,
    projectPath: TEST_APP_PATH,
  });
});
