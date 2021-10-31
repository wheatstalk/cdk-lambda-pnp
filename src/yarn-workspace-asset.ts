import * as os from 'os';
import * as path from 'path';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
import { fingerprint } from '@aws-cdk/core/lib/fs/fingerprint';
import * as execa from 'execa';
import * as fs from 'fs-extra';
import * as glob from 'glob';
import ignore from 'ignore';
import * as ignorewalk from 'ignore-walk';
import { getProjectRoot } from './pnp-util';

/** @internal */
export interface YarnWorkspaceAssetProps {
  readonly projectPath: string;
  readonly workspace: string;
}

/** @internal */
export class YarnWorkspaceAsset extends s3_assets.Asset {
  constructor(scope: cdk.Construct, id: string, props: YarnWorkspaceAssetProps) {

    const projectRoot = getProjectRoot(props.projectPath);
    const workspace = props.workspace;

    if (!fs.existsSync(path.join(projectRoot, 'yarn.lock'))) {
      throw new Error(`The given project root ${projectRoot} does not contain a yarn.lock!`);
    }

    const app = cdk.App.of(scope);
    if (!app) {
      throw new Error('Cannot add pnp code by stage without an app');
    }

    const workDirectory = path.join(app.assetOutdir, '.pnp');

    const yarnWorkspaceLocalBundling = new YarnWorkspaceBundler({
      workDirectory,
    });

    const assetDir = yarnWorkspaceLocalBundling.bundle(projectRoot, workspace);

    super(scope, id, {
      path: assetDir,
    });
  }
}

interface YarnWorkspaceBundlerOptions {
  readonly workDirectory: string;
}

class YarnWorkspaceBundler {
  private readonly workDirectory: string;

  constructor(options: YarnWorkspaceBundlerOptions) {
    this.workDirectory = options.workDirectory;
  }

  public bundle(projectRoot: string, workspace: string) {
    const focusedWorkspaceCache = focusWorkspace({
      projectRoot,
      workspace,
      cacheDirectory: this.workDirectory,
    });

    const assetDir = fs.mkdtempSync(path.join(this.workDirectory, 'asset'));
    fs.copySync(focusedWorkspaceCache, assetDir, {
      recursive: true,
    });

    // Find a list of files that aren't ignored by .npmignore files
    const files = ignorewalk.sync({
      path: projectRoot,
      ignoreFiles: ['.npmignore'],
      includeEmpty: false,
    });

    // Further filter the list of files to copy to the asset.
    const ig = ignore().add(MERGE_IGNORE_PATTERNS);
    for (const file of ig.filter(files)) {
      const projectPath = path.join(projectRoot, file);
      const outputPath = path.join(assetDir, file);
      fs.copySync(projectPath, outputPath);
    }

    return assetDir;
  }
}

/** @internal */
export interface PrepareFocusedWorkspaceOptions {
  readonly projectRoot: string;
  readonly workspace: string;
  readonly cacheDirectory: string;
}

/** @internal */
export function focusWorkspace(options: PrepareFocusedWorkspaceOptions) {
  const depsStagingPath = fs.mkdtempSync(path.join(os.tmpdir(), '.pnp-code'));
  try {
    // Stage the files yarn needs to install packages.
    const yarnFileIgnore = ignore().add(YARN_DEP_PATTERNS);
    const fileList = glob.sync('**', {
      cwd: options.projectRoot,
      dot: true,
      mark: true,
    });

    for (const file of fileList) {
      // We're looking for files matching the ignore pattern above.
      if (!yarnFileIgnore.test(file).ignored) {
        continue;
      }

      fs.copySync(path.join(options.projectRoot, file), path.join(depsStagingPath, file), {
        recursive: true,
      });
    }

    // Cache dependencies to speed up changes that don't require a yarn install.
    const stageFingerprint = fingerprint(depsStagingPath, { extraHash: options.workspace });
    const cacheDirectory = path.join(options.cacheDirectory, '.pnp-cache.' + stageFingerprint);
    if (!fs.existsSync(cacheDirectory)) {
      // Cache miss. Time to install focused packages.
      execa.sync('yarn', ['plugin', 'import', 'workspace-tools'], { cwd: depsStagingPath });
      execa.sync('yarn', ['workspaces', 'focus', options.workspace, '--production'], { cwd: depsStagingPath });
      fs.moveSync(depsStagingPath, cacheDirectory);
    }

    return cacheDirectory;
  } finally {
    if (fs.existsSync(depsStagingPath)) {
      fs.removeSync(depsStagingPath);
    }
  }
}

// Files needed for yarn to install the right deps.
const YARN_DEP_PATTERNS = [
  '/.yarn/patches/**',
  '/.yarn/plugins/**',
  '/.yarn/releases/**',
  '/.yarn/sdks/**',
  '/.yarn/versions/**',
  '/.yarnrc.yml',
  '/yarn.lock',
  '/package.json',
  '**/package.json',
  '!**/cdk.out/**/package.json',
];

// Files to always ignore when merging the user's project into the asset.
const MERGE_IGNORE_PATTERNS = [
  ...YARN_DEP_PATTERNS,
  '/.git',
  '/.yarn',
  '/.pnp.cjs',
];