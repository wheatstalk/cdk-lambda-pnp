import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as globby from 'globby';
import { TEST_APP_PATH } from '../src/constants';
import { stageDeps, focusWorkspace, mergeProject } from '../src/workspace-focus-code';

const TEMP_PREFIX = path.join(os.tmpdir(), 'stage');

test('staging deps', () => {
  // WHEN
  const cwd = stageDeps({
    stagingDirectory: fs.mkdtempSync(TEMP_PREFIX),
    projectRoot: TEST_APP_PATH,
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
    stagingDirectory: fs.mkdtempSync(TEMP_PREFIX),
    projectRoot: TEST_APP_PATH,
  });

  // WHEN
  focusWorkspace({
    stagingDirectory: cwd,
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
    stagingDirectory: fs.mkdtempSync(TEMP_PREFIX),
    projectRoot: TEST_APP_PATH,
  });

  focusWorkspace({
    stagingDirectory: cwd,
    workspace: 'lambda',
  });

  // WHEN
  mergeProject({
    stagingDirectory: cwd,
    projectRoot: TEST_APP_PATH,
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