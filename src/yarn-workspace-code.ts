import * as os from 'os';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { fingerprint } from '@aws-cdk/core/lib/fs/fingerprint';
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

    const focusedWorkspace = prepareFocusedWorkspace({
      projectRoot: this.projectRoot,
      workspace: this.workspace,
      cacheDirectory: app.assetOutdir,
    });

    const assetDirectory = fs.mkdtempSync(path.join(os.tmpdir(), '.pnp-code'));
    try {
      fs.copySync(focusedWorkspace, assetDirectory, {
        recursive: true,
      });

      console.info(`Merging project workspaces: ${this.projectRoot} => ${assetDirectory}`);
      mergeProject({
        assetDirectory,
        projectRoot: this.projectRoot,
      });

      console.info('Producing asset from stage');
      return lambda.Code.fromAsset(assetDirectory).bind(scope);
    } finally {
      fs.removeSync(assetDirectory);
    }
  }
}

export interface PrepareFocusedWorkspaceOptions {
  readonly projectRoot: string;
  readonly workspace: string;
  readonly cacheDirectory: string;
}

/** @internal */
export function prepareFocusedWorkspace(options: PrepareFocusedWorkspaceOptions) {
  const depsStagingDirectory = fs.mkdtempSync(path.join(os.tmpdir(), '.pnp-code'));

  try {
    console.info(`Staging project dependencies: ${(options.projectRoot)} => ${depsStagingDirectory}`);
    stageDeps({
      depsStagingDirectory,
      projectRoot: options.projectRoot,
    });

    const stageFingerprint = fingerprint(depsStagingDirectory, {
      extraHash: options.workspace,
    });

    const cacheDirectory = path.join(options.cacheDirectory, '.pnp-cache.' + stageFingerprint);

    if (!fs.existsSync(cacheDirectory)) {
      console.info(`Focusing staged project workspace: ${(options.workspace)}`);
      focusWorkspace({
        depsStagingDirectory,
        workspace: options.workspace,
      });

      fs.moveSync(depsStagingDirectory, cacheDirectory);
    } else {
      console.info(`Reusing cached focused project workspace: ${(options.workspace)}`);
    }

    return cacheDirectory;
  } finally {
    if (fs.existsSync(depsStagingDirectory)) {
      fs.removeSync(depsStagingDirectory);
    }
  }
}

/** @internal */
export interface StageDepsOptions {
  readonly projectRoot: string;
  readonly depsStagingDirectory: string;
}

/** @internal */
export function stageDeps(options: StageDepsOptions): string {
  checkProjectRoot(options.projectRoot);

  const depsStage = options.depsStagingDirectory;
  const source = options.projectRoot;

  const patterns = [
    '.yarn/patches',
    '.yarn/plugins',
    '.yarn/releases',
    '.yarn/sdks',
    '.yarn/versions',
    '.yarnrc.yml',
    'yarn.lock',
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
  readonly depsStagingDirectory: string;
  readonly workspace: string;
}

/** @internal */
export function focusWorkspace(options: FocusWorkspaceOptions): void {
  execa.sync('yarn', ['plugin', 'import', 'workspace-tools'], { cwd: options.depsStagingDirectory });
  execa.sync('yarn', ['workspaces', 'focus', options.workspace, '--production'], { cwd: options.depsStagingDirectory });
}

/** @internal */
export interface MergeProjectOptions {
  readonly assetDirectory: string;
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

    fs.copySync(path.join(options.projectRoot, file), path.join(options.assetDirectory, file));
  }
}

/** @internal */
function checkProjectRoot(projectRoot: string) {
  if (!fs.existsSync(path.join(projectRoot, 'yarn.lock'))) {
    throw new Error(`The given project root ${projectRoot} does not contain a yarn.lock!`);
  }
}
