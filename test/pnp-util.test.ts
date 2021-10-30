import * as os from 'os';
import * as path from 'path';
import { getProjectRoot, getWorkspacePath } from '../src/pnp-util';
import { TEST_APP_PATH } from '../src/test-app';

test('get workspace path', () => {
  const workspace = 'lambda';

  const workspaceRoot = getWorkspacePath({
    workspace,
    cwd: TEST_APP_PATH,
  });

  expect(workspaceRoot).toEqual('packages/lambda');
});

test('project root', () => {
  // WHEN
  const projectRoot = getProjectRoot(TEST_APP_PATH);

  // THEN
  expect(projectRoot).toEqual(path.resolve(TEST_APP_PATH));
});

test('project root subdir', () => {
  const subdir = path.join(TEST_APP_PATH, 'packages', 'lambda', 'src');

  // WHEN
  const projectRoot = getProjectRoot(subdir);

  // THEN
  expect(projectRoot).toEqual(path.resolve(TEST_APP_PATH));
});

test('outside of project', () => {
  expect(() => getProjectRoot(os.tmpdir())).toThrow(/could not find.*yarn.lock/i);
});