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
export class YarnWorkspaceAsset extends cdk.Construct {
  public readonly s3BucketName: string;
  public readonly s3ObjectKey: string;
  public readonly assetPath: string;

  constructor(scope: cdk.Construct, id: string, props: YarnWorkspaceAssetProps) {
    super(scope, id);

    const projectRoot = getProjectRoot(props.projectPath);
    const workspace = props.workspace;

    if (!fs.existsSync(path.join(projectRoot, 'yarn.lock'))) {
      throw new Error(`The given project root ${projectRoot} does not contain a yarn.lock!`);
    }

    const app = cdk.App.of(scope);
    if (!app) {
      throw new Error('Cannot add pnp code by stage without an app');
    }

    const focusedWorkspaceCache = focusWorkspace({
      projectRoot,
      workspace,
      cacheDirectory: path.join(app.assetOutdir, '.pnp-cache'),
    });

    const assetStaging = new s3_assets.Asset(this, 'Code', {
      assetHashType: cdk.AssetHashType.OUTPUT,
      path: focusedWorkspaceCache,
      bundling: {
        image: cdk.DockerImage.fromRegistry('NEVER'),
        local: new YarnWorkspaceLocalBundling({
          focusedWorkspaceCache,
          projectRoot,
        }),
      },
    });

    this.assetPath = assetStaging.assetPath;
    this.s3BucketName = assetStaging.s3BucketName;
    this.s3ObjectKey = assetStaging.s3ObjectKey;
  }
}

interface YarnWorkspaceLocalBundlingOptions {
  readonly projectRoot: string;
  readonly focusedWorkspaceCache: string;
}

class YarnWorkspaceLocalBundling implements cdk.ILocalBundling {
  private readonly projectRoot: string;
  private readonly focusedWorkspaceCache: string;

  constructor(options: YarnWorkspaceLocalBundlingOptions) {
    this.projectRoot = options.projectRoot;
    this.focusedWorkspaceCache = options.focusedWorkspaceCache;
  }

  tryBundle(outputDir: string, _options: cdk.BundlingOptions): boolean {
    fs.copySync(this.focusedWorkspaceCache, outputDir, {
      recursive: true,
    });

    // Find a list of files that aren't ignored by .npmignore files
    const files = ignorewalk.sync({
      path: this.projectRoot,
      ignoreFiles: ['.npmignore'],
      includeEmpty: false,
    });

    // Futher filter the list of files to copy to the asset.
    const ig = ignore().add(MERGE_IGNORE_PATTERNS);
    for (const file of ig.filter(files)) {
      const projectPath = path.join(this.projectRoot, file);
      const outputPath = path.join(outputDir, file);
      fs.copySync(projectPath, outputPath);
    }

    return true;
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