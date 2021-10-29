import * as execa from 'execa';

/** @internal */
export interface GetWorkspaceRootOptions {
  readonly workspace: string;
  readonly cwd?: string;
}

/** @internal */
export function getWorkspacePath(options: GetWorkspaceRootOptions): string {
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