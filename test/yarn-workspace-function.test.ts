import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import { YarnWorkspaceFunction } from '../src';
import { TEST_APP_PATH } from '../src/test-app';

test('creating a function', () => {
  const stack = new cdk.Stack();

  new YarnWorkspaceFunction(stack, 'Handler', {
    workspace: 'lambda',
    handler: 'dist/handler.handler',
    projectPath: TEST_APP_PATH,
  });
});

test('creating a function from a subpath', () => {
  const stack = new cdk.Stack();

  new YarnWorkspaceFunction(stack, 'Handler', {
    workspace: 'lambda',
    handler: 'dist/handler.handler',
    projectPath: path.join(TEST_APP_PATH, 'packages', 'lambda'),
  });
});