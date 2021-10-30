import * as os from 'os';
import * as path from 'path';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
import { fingerprint } from '@aws-cdk/core/lib/fs/fingerprint';
import * as execa from 'execa';
import * as fs from 'fs-extra';
import * as globby from 'globby';
import * as ignorewalk from 'ignore-walk';

/** @internal */
export interface YarnWorkspaceAssetProps {
  readonly projectRoot: string;
  readonly workspace: string;
}

/** @internal */
export class YarnWorkspaceAsset extends cdk.Construct {
  public readonly s3BucketName: string;
  public readonly s3ObjectKey: string;
  public readonly assetPath: string;

  constructor(scope: cdk.Construct, id: string, props: YarnWorkspaceAssetProps) {
    super(scope, id);

    const projectRoot = props.projectRoot;
    const workspace = props.workspace;

    const app = cdk.App.of(scope);
    if (!app) {
      throw new Error('Cannot add pnp code by stage without an app');
    }

    const focusedWorkspacePath = focusWorkspace({
      projectRoot: projectRoot,
      workspace: workspace,
      cacheDirectory: path.join(app.assetOutdir, '.pnp-cache'),
    });

    const assetStaging = new s3_assets.Asset(this, 'Code', {
      assetHashType: cdk.AssetHashType.OUTPUT,
      path: focusedWorkspacePath,
      bundling: {
        image: cdk.DockerImage.fromRegistry('NEVER'),
        local: {
          tryBundle: (outputDir: string, _options: cdk.BundlingOptions): boolean => {
            fs.copySync(focusedWorkspacePath, outputDir, {
              recursive: true,
            });

            mergeProject({
              assetDirectory: outputDir,
              projectRoot: projectRoot,
            });

            return true;
          },
        },
      },
    });

    this.assetPath = assetStaging.assetPath;
    this.s3BucketName = assetStaging.s3BucketName;
    this.s3ObjectKey = assetStaging.s3ObjectKey;
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
  checkProjectRoot(options.projectRoot);

  const depsStagingPath = fs.mkdtempSync(path.join(os.tmpdir(), '.pnp-code'));
  try {
    // Stage the files yarn needs to install packages.
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
      cwd: options.projectRoot,
      globstar: true,
      onlyFiles: true,
    });

    for (const file of fileList) {
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