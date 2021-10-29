import * as os from 'os';
import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as fs from 'fs-extra';
import * as globby from 'globby';
import { YarnBuildFunction } from '../src';
import { focusWorkspace, mergeProject, stageDeps } from '../src/workspace-focus-code';

const TEMP_PREFIX = path.join(os.tmpdir(), 'stage');
const TEST_APP_PATH = path.join(__dirname, '..', 'test-app');

test('staging deps', () => {
  // WHEN
  const cwd = stageDeps({
    cwd: fs.mkdtempSync(TEMP_PREFIX),
    source: TEST_APP_PATH,
  });

  // THEN
  const stagedFileList = globby.sync(['**', '.*', '.*/**'], {
    cwd,
    expandDirectories: true,
    globstar: true,
    onlyFiles: true,
  });
  expect(stagedFileList).toEqual(
    expect.arrayContaining([
      'package.json',
      'yarn.lock',
      'packages/lambda/package.json',
      'packages/lib/package.json',
      '.yarnrc.yml',
      '.yarn/releases/yarn-berry.cjs',
      '.yarn/plugins/@ojkelly/plugin-build.cjs',
    ]),
  );

  expect(stagedFileList).not.toEqual(
    expect.arrayContaining([
      expect.stringContaining('.yarn/cache'),
    ]),
  );
});

test('focusing a workspace', () => {
  const cwd = stageDeps({
    cwd: fs.mkdtempSync(TEMP_PREFIX),
    source: TEST_APP_PATH,
  });

  // WHEN
  focusWorkspace({
    cwd,
    workspace: 'lambda',
  });

  // THEN
  expect(fs.existsSync(path.join(cwd, '.pnp.cjs'))).toEqual(true);
  expect(fs.readdirSync(path.join(cwd, '.yarn', 'cache'))).toEqual([
    '.gitignore',
    expect.stringMatching(/^uglify-js-.*\.zip/),
    // None of the dev deps
  ]);
});

test('merging a workspace', () => {
  const cwd = stageDeps({
    cwd: fs.mkdtempSync(TEMP_PREFIX),
    source: TEST_APP_PATH,
  });

  focusWorkspace({
    cwd,
    workspace: 'lambda',
  });

  // WHEN
  mergeProject({
    cwd,
    source: TEST_APP_PATH,
  });

  // THEN
  expect(fs.readdirSync(path.join(cwd, '.yarn', 'cache'))).toEqual([
    '.gitignore',
    expect.stringMatching(/^uglify-js-.*\.zip/),
    // None of the dev deps merged over top of the workspace focus
  ]);
  expect(fs.readdirSync(path.join(cwd, 'packages', 'lambda', 'src'))).toEqual([
    'api.ts',
  ]);
});

test('creating a function', () => {
  const stack = new cdk.Stack();

  new YarnBuildFunction(stack, 'Handler', {
    workspace: 'lambda',
    handler: 'dist/handler.handler',
    projectPath: TEST_APP_PATH,
  });
});