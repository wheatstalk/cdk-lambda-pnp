import * as os from 'os';
import * as path from 'path';
import { fingerprint } from '@aws-cdk/core/lib/fs/fingerprint';
import * as execa from 'execa';
import * as glob from 'glob';
import { buildTestApp, TEST_APP_PATH } from '../src/test-app';
import { YarnWorkspaceBundler } from '../src/yarn-workspace-bundler';

const workDirectory = path.join(os.tmpdir(), '.pnp');

beforeAll(() => {
  buildTestApp();
});

test('creating a yarn workspace asset', () => {
  const bundler = new YarnWorkspaceBundler({
    workDirectory,
  });

  // WHEN
  const outDir = bundler.bundle(TEST_APP_PATH, 'lambda');

  // THEN
  const res = glob.sync('**', {
    dot: true,
    nodir: true,
    cwd: outDir,
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
  const bundler = new YarnWorkspaceBundler({
    workDirectory,
  });

  const assetPath = bundler.bundle(TEST_APP_PATH, 'lambda');

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

test('identical assets have the same fingerprint', () => {
  const bundler = new YarnWorkspaceBundler({
    workDirectory,
  });

  // WHEN
  const asset1 = bundler.bundle(TEST_APP_PATH, 'lambda');
  const asset2 = bundler.bundle(TEST_APP_PATH, 'lambda');

  // THEN
  expect(fingerprint(asset1)).toEqual(fingerprint(asset2));
});

test('different workspaces in the same project have different assets', () => {
  const bundler = new YarnWorkspaceBundler({
    workDirectory,
  });

  // WHEN
  const asset1 = bundler.bundle(TEST_APP_PATH, 'lambda');
  const asset2 = bundler.bundle(TEST_APP_PATH, 'lib');

  // THEN
  expect(fingerprint(asset1)).not.toEqual(fingerprint(asset2));
});