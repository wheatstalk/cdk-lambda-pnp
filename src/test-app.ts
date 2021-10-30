import * as path from 'path';
import * as execa from 'execa';

/** @internal */
export const TEST_APP_PATH = path.join(__dirname, '..', 'test-app');

/** @internal */
export function buildTestApp() {
  execa.sync('yarn', ['install'], { cwd: TEST_APP_PATH });
  execa.sync('yarn', ['build'], { cwd: TEST_APP_PATH });
}