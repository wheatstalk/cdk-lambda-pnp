import * as os from 'os';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as execa from 'execa';
import * as fs from 'fs-extra';
import * as globby from 'globby';
import * as ignorewalk from 'ignore-walk';

/** @internal */
export interface YarnWorkspaceCodeOptions {
  readonly projectRoot: string;
  readonly workspace: string;
}

/** @internal */
export class YarnWorkspaceCode extends lambda.Code {
  readonly isInline = false;
  private readonly projectRoot: string;
  private readonly workspace: string;

  constructor(options: YarnWorkspaceCodeOptions) {
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
      console.info(`Staging project dependencies: ${this.projectRoot} => ${stageDir}`);
      stageDeps({
        stagingDirectory: stageDir,
        projectRoot: this.projectRoot,
      });

      console.info(`Focusing staged project workspace: ${this.workspace}`);
      focusWorkspace({
        stagingDirectory: stageDir,
        workspace: this.workspace,
      });

      console.info(`Merging project workspaces: ${this.projectRoot} => ${stageDir}`);
      mergeProject({
        stagingDirectory: stageDir,
        projectRoot: this.projectRoot,
      });

      console.info('Producing asset from stage');
      return lambda.Code.fromAsset(stageDir).bind(scope);
    } finally {
      fs.removeSync(stageDir);
    }
  }
}

/** @internal */
export interface StageDepsOptions {
  readonly projectRoot: string;
  readonly stagingDirectory: string;
}

/** @internal */
export function stageDeps(options: StageDepsOptions): string {
  checkProjectRoot(options.projectRoot);

  const depsStage = options.stagingDirectory;
  const source = options.projectRoot;

  const patterns = [
    '.yarn/**/*',
    '!.yarn/cache',
    'yarn.lock',
    '.yarnrc.yml',
    'package.json',
    '**/package.json',
    '!**/cdk.out',
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
  readonly stagingDirectory: string;
  readonly workspace: string;
}

/** @internal */
export function focusWorkspace(options: FocusWorkspaceOptions): void {
  execa.sync('yarn', ['plugin', 'import', 'workspace-tools'], { cwd: options.stagingDirectory });
  execa.sync('yarn', ['workspaces', 'focus', options.workspace, '--production'], { cwd: options.stagingDirectory });
}

/** @internal */
export interface MergeProjectOptions {
  readonly stagingDirectory: string;
  readonly projectRoot: string;
}

/** @internal */
export function mergeProject(options: MergeProjectOptions): void {
  checkProjectRoot(options.projectRoot);

  const files = ignorewalk.sync({
    path: options.projectRoot,
    ignoreFiles: ['.npmignore'],
    includeEmpty: false,
  });

  const badFiles = new Set(['.yarnrc.yml', '.pnp.cjs']);
  for (const file of files) {
    if (file.startsWith('.yarn') || badFiles.has(file)) {
      continue;
    }

    fs.copySync(path.join(options.projectRoot, file), path.join(options.stagingDirectory, file));
  }
}

/** @internal */
function checkProjectRoot(projectRoot: string) {
  if (!fs.existsSync(path.join(projectRoot, 'yarn.lock'))) {
    throw new Error(`The given project root ${projectRoot} does not contain a yarn.lock!`);
  }
}
