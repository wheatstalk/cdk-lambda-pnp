import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import { getWorkspacePath, PnpBundler, PnpWorkspaceFunction } from '../src';

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

  new PnpWorkspaceFunction(stack, 'Handler', {
    workspace: 'lambda',
    handler: 'dist/handler.handler',
    bundler: PnpBundler.fromYarnBuild({
      projectPath: TEST_APP_PATH,
      runInstall: true,
      runBuild: true,
    }),
  });
});

const TEST_APP_PATH = path.join(__dirname, '..', 'test-app');