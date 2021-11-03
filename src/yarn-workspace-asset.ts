import * as os from 'os';
import * as path from 'path';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
import { fingerprint } from '@aws-cdk/core/lib/fs/fingerprint';
import * as execa from 'execa';
import * as fs from 'fs-extra';
import ignore from 'ignore';
import { getProjectRoot } from './pnp-util';
import { StopWatch } from './stop-watch';
import { WalkingIgnore } from './walking-ignore';

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

    const yarnWorkspaceLocalBundling = new YarnWorkspaceBundler({
      workDirectory: path.join(os.tmpdir(), '.pnp'),
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
    const stopWatch = StopWatch.start(`Bundling ${workspace}`);
    const focusedWorkspaceCache = focusWorkspace({
      projectRoot,
      workspace,
      cacheDirectory: this.workDirectory,
    });
    stopWatch.report('workspace focused');

    const assetDir = fs.mkdtempSync(path.join(this.workDirectory, 'asset'));
    fs.copySync(focusedWorkspaceCache, assetDir, {
      recursive: true,
    });
    stopWatch.report('dependencies cloned');

    const walkingIgnore = new WalkingIgnore(
      ignore().add(MERGE_IGNORE_PATTERNS),
      projectRoot,
    );

    fs.copySync(projectRoot, assetDir, {
      recursive: true,
      filter: (src) => {
        if (src === projectRoot) {
          return true;
        }
        return !walkingIgnore.test(src).ignored;
      },
    });
    stopWatch.report('workspaces bundled');
    stopWatch.report();

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
    const yarnFileIgnore = ignore().add(YARN_CDK_DEP_PATTERNS);
    fs.copySync(options.projectRoot, depsStagingPath, {
      recursive: true,
      filter: (src) => {
        const relativePath = path.relative(options.projectRoot, src);
        if (relativePath === '') {
          // Always include the project root
          return true;
        }

        const result = yarnFileIgnore.test(relativePath);

        const hasNoOpinion = !result.unignored && !result.ignored;
        if (hasNoOpinion && fs.statSync(src).isDirectory()) {
          // When ignore has no opinion and we've encountered a directory, we
          // traverse into it.
          return true;
        }

        return result.ignored;
      },
    });

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
  '!/.yarn/cache',
  '!/.yarn/unplugged',
  '/.yarnrc.yml',
  '/yarn.lock',
  '/package.json',
  '**/package.json',
];

const YARN_CDK_DEP_PATTERNS = [
  ...YARN_DEP_PATTERNS,
  '!**/cdk.out',
];

// Files to always ignore when merging the user's project into the asset.
const MERGE_IGNORE_PATTERNS = [
  ...YARN_DEP_PATTERNS,
  '/.git',
  '/.yarn',
  '/.pnp.cjs',
  '**/cdk.out',
];
