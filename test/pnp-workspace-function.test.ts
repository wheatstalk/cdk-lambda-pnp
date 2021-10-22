import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import { getWorkspaceRoot, PnpWorkspaceFunction } from '../src';

test('get workspace path', () => {
  const workspace = 'lambda';

  const workspaceRoot = getWorkspaceRoot({
    workspace,
    cwd: TEST_APP_PATH,
  });

  expect(workspaceRoot).toEqual('packages/lambda');
});

test('creating a function', () => {
  const stack = new cdk.Stack();

  new PnpWorkspaceFunction(stack, 'Handler', {
    workspace: 'lambda',
    handler: 'dist/handler.handler',
    cwd: TEST_APP_PATH,
    runInstall: true,
    runBuild: true,
  });
});

const TEST_APP_PATH = path.join(__dirname, '..', 'test-app');