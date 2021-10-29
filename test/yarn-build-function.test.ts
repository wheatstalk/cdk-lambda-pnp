import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import { getWorkspacePath, YarnBuildFunction } from '../src';

test('get workspace path', () => {
  const workspace = 'lambda';

  const workspaceRoot = getWorkspacePath({
    workspace,
    cwd: TEST_APP_PATH,
  });

  expect(workspaceRoot).toEqual('packages/lambda');
});

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

const TEST_APP_PATH = path.join(__dirname, '..', 'test-app');