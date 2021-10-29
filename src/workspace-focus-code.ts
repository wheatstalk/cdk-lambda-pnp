import * as os from 'os';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as execa from 'execa';
import * as fs from 'fs-extra';
import * as globby from 'globby';
import * as ignorewalk from 'ignore-walk';

/** @internal */
export interface WorkspaceFocusCodeOptions {
  readonly projectRoot: string;
  readonly workspace: string;
}

/** @internal */
export class WorkspaceFocusCode extends lambda.Code {
  readonly isInline = false;
  private readonly projectRoot: string;
  private readonly workspace: string;

  constructor(options: WorkspaceFocusCodeOptions) {
    super();

    this.projectRoot = options.projectRoot;
    this.workspace = options.workspace;
  }

  bind(scope: cdk.Construct): lambda.CodeConfig {
    const app = cdk.App.of(scope);
    if (!app) {
      throw new Error('Cannot add pnp code by stage without an app');
    }

    const stageDir = fs.mkdtempSync(path.join(os.tmpdir(), '.pnp-code'));

    try {
      console.log(`Staging project dependencies ${this.projectRoot} => ${stageDir}`);
      stageDeps({
        cwd: stageDir,
        source: this.projectRoot,
      });

      console.log(`Focusing workspace ${this.workspace}`);
      focusWorkspace({
        cwd: stageDir,
        workspace: this.workspace,
      });

      console.log(`Merging project workspaces ${this.projectRoot} => ${stageDir}`);
      mergeProject({
        cwd: stageDir,
        source: this.projectRoot,
      });

      console.log('Producing asset from stage');
      return lambda.Code.fromAsset(stageDir).bind(scope);
    } finally {
      fs.removeSync(stageDir);
    }
  }
}

/** @internal */
export interface StageDepsOptions {
  readonly source: string;
  readonly cwd: string;
}

/** @internal */
export function stageDeps(options: StageDepsOptions): string {
  const depsStage = options.cwd;
  const source = options.source;

  const patterns = [
    '.yarn/**/*',
    '!.yarn/cache',
    'yarn.lock',
    '.yarnrc.yml',
    'package.json',
    '**/package.json',
  ];
  const fileList = globby.sync(patterns, {
    cwd: source,
    globstar: true,
    onlyFiles: true,
  });

  for (const file of fileList) {
    fs.copySync(path.join(source, file), path.join(depsStage, file), {
      recursive: true,
    });
  }

  return depsStage;
}

/** @internal */
export interface FocusWorkspaceOptions {
  readonly cwd: string;
  readonly workspace: string;
}

/** @internal */
export function focusWorkspace(options: FocusWorkspaceOptions): void {
  execa.sync('yarn', ['plugin', 'import', 'workspace-tools'], { cwd: options.cwd });
  execa.sync('yarn', ['workspaces', 'focus', options.workspace, '--production'], { cwd: options.cwd });
}

/** @internal */
export interface MergeProjectOptions {
  readonly cwd: string;
  readonly source: string;
}

/** @internal */
export function mergeProject(options: MergeProjectOptions): void {
  const files = ignorewalk.sync({
    path: options.source,
    ignoreFiles: ['.npmignore'],
    includeEmpty: false,
  });

  const badFiles = new Set(['.yarnrc.yml', '.pnp.cjs']);
  for (const file of files) {
    if (file.startsWith('.yarn') || badFiles.has(file)) {
      continue;
    }

    fs.copySync(path.join(options.source, file), path.join(options.cwd, file));
  }
}
