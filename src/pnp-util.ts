import * as path from 'path';
import * as execa from 'execa';
import * as fs from 'fs-extra';

/** @internal */
export interface GetWorkspacePathOptions {
  readonly workspace: string;
  readonly cwd?: string;
}

/** @internal */
export function getWorkspacePath(options: GetWorkspacePathOptions): string {
  const cwd = options.cwd ?? process.cwd();

  const infoRes = execa.sync('yarn', ['workspace', options.workspace, 'info', '--name-only', '--json'], {
    cwd,
  });

  const lines = infoRes.stdout.split(/\r?\n/i).map(line => JSON.parse(line));
  for (const line of lines) {
    // name@workspace:path/here
    const parts = line.split('@workspace:');

    if (parts.length !== 2) {
      continue;
    }

    if (parts[0] === options.workspace) {
      return parts[1];
    }
  }

  throw new Error(`Cannot find a workspace named ${options.workspace} from ${options.cwd}`);
}

export function getProjectRoot(projectPath: string): string {
  let currentPath = path.resolve(projectPath);

  while (!fs.existsSync(path.join(currentPath, 'yarn.lock'))) {
    const before = currentPath;
    currentPath = path.resolve(currentPath, '..');

    if (currentPath === before) {
      // We've reached the end!
      throw new Error(`Could not find a yarn.lock starting from ${projectPath}`);
    }
  }

  return currentPath;
}