import * as os from 'os';
import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as execa from 'execa';
import * as fs from 'fs-extra';
import * as glob from 'glob';
import { buildTestApp, TEST_APP_PATH } from '../src/test-app';
import { YarnWorkspaceAsset } from '../src/yarn-workspace-asset';

beforeAll(() => {
  buildTestApp();
});

test('creating a yarn workspace asset', () => {
  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'pnp-test'));
  const app = new cdk.App({
    outdir: outdir,
  });
  const stack = new cdk.Stack(app, 'Stack');

  // WHEN
  const asset = new YarnWorkspaceAsset(stack, 'Asset', {
    projectPath: TEST_APP_PATH,
    workspace: 'lambda',
  });

  // THEN
  const res = glob.sync('**', {
    dot: true,
    nodir: true,
    cwd: path.join(outdir, asset.assetPath),
  });
  expect(res.sort()).toEqual([
    '.gitignore',
    '.pnp.cjs',
    '.yarn/cache/.gitignore',
    '.yarn/cache/uglify-js-npm-3.14.2-a003e21395-4d8e5c63b2.zip',
    '.yarn/install-state.gz',
    '.yarn/plugins/@ojkelly/plugin-build.cjs',
    '.yarn/plugins/@yarnpkg/plugin-workspace-tools.cjs',
    '.yarn/releases/yarn-berry.cjs',
    '.yarnrc.yml',
    'package.json',
    'packages/lambda/.npmignore',
    'packages/lambda/dist/api.d.ts',
    'packages/lambda/dist/api.js',
    'packages/lambda/dist/api2.d.ts',
    'packages/lambda/dist/api2.js',
    'packages/lambda/package.json',
    'packages/lambda/src/api.ts',
    'packages/lambda/src/api2.ts',
    'packages/lambda/tsconfig.dev.json',
    'packages/lib/dist/index.d.ts',
    'packages/lib/dist/index.js',
    'packages/lib/package.json',
    'packages/lib/src/index.d.ts',
    'packages/lib/src/index.js',
    'packages/lib/src/index.ts',
    'packages/lib/tsconfig.dev.json',
    'yarn.lock',
  ]);
});

test('running the code in a yarn workspace asset', () => {
  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'pnp-test'));
  const app = new cdk.App({
    outdir: outdir,
  });
  const stack = new cdk.Stack(app, 'Stack');
  const asset = new YarnWorkspaceAsset(stack, 'Asset', {
    projectPath: TEST_APP_PATH,
    workspace: 'lambda',
  });

  const assetPath = path.join(outdir, asset.assetPath);

  // WHEN
  const execaRes = execa.sync('node', ['packages/lambda/dist/api.js'], {
    cwd: assetPath,
    env: {
      NODE_OPTIONS: '--require ./.pnp.cjs',
    },
  });

  // THEN
  expect(execaRes.stdout).toEqual(
    JSON.stringify({
      statusCode: 200,
      body: JSON.stringify('function foobeard(){} // MUGLIFIED'),
    }),
  );
});

test('identical assets have the same asset path', () => {
  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'pnp-test'));
  const app = new cdk.App({
    outdir: outdir,
  });
  const stack = new cdk.Stack(app, 'Stack');

  // WHEN
  const asset1 = new YarnWorkspaceAsset(stack, 'Asset1', {
    projectPath: TEST_APP_PATH,
    workspace: 'lambda',
  });
  const asset2 = new YarnWorkspaceAsset(stack, 'Asset2', {
    projectPath: TEST_APP_PATH,
    workspace: 'lambda',
  });

  // THEN
  expect(asset1.assetPath).toEqual(asset2.assetPath);
});

test('different workspaces in the same project have different assets', () => {
  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'pnp-test'));
  const app = new cdk.App({
    outdir: outdir,
  });
  const stack = new cdk.Stack(app, 'Stack');

  // WHEN
  const asset1 = new YarnWorkspaceAsset(stack, 'Asset1', {
    projectPath: TEST_APP_PATH,
    workspace: 'lambda',
  });
  const asset2 = new YarnWorkspaceAsset(stack, 'Asset2', {
    projectPath: TEST_APP_PATH,
    workspace: 'lib',
  });

  // THEN
  expect(asset1.assetPath).not.toEqual(asset2.assetPath);
});