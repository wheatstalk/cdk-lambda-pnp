import * as os from 'os';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
import * as fs from 'fs-extra';
import { getProjectRoot } from './pnp-util';
import { YarnWorkspaceBundler } from './yarn-workspace-bundler';

/** @internal */
export interface YarnWorkspaceCodeOptions {
  readonly projectPath: string;
  readonly workspace: string;
}

/** @internal */
export class YarnWorkspaceCode extends lambda.Code {
  readonly isInline = false;
  private readonly assetDir: string;
  private asset?: s3_assets.Asset;

  constructor(options: YarnWorkspaceCodeOptions) {
    super();

    const projectRoot = getProjectRoot(options.projectPath);
    const workspace = options.workspace;

    if (!fs.existsSync(path.join(projectRoot, 'yarn.lock'))) {
      throw new Error(`The given project root ${projectRoot} does not contain a yarn.lock!`);
    }

    const yarnWorkspaceLocalBundling = new YarnWorkspaceBundler({
      workDirectory: path.join(os.tmpdir(), '.pnp'),
    });

    this.assetDir = yarnWorkspaceLocalBundling.bundle(projectRoot, workspace);
  }

  bind(scope: cdk.Construct): lambda.CodeConfig {
    const asset = new s3_assets.Asset(scope, 'Asset', {
      path: this.assetDir,
    });

    this.asset = asset;

    return {
      s3Location: {
        bucketName: asset.s3BucketName,
        objectKey: asset.s3ObjectKey,
      },
    };
  }

  public bindToResource(resource: cdk.CfnResource, options: lambda.ResourceBindOptions = { }) {
    if (!this.asset) {
      throw new Error('bindToResource() must be called after bind()');
    }

    const resourceProperty = options.resourceProperty || 'Code';

    // https://github.com/aws/aws-cdk/issues/1432
    this.asset.addResourceMetadata(resource, resourceProperty);
  }
}
