import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { YarnWorkspaceAsset } from './yarn-workspace-asset';

/** @internal */
export interface YarnWorkspaceCodeOptions {
  readonly projectPath: string;
  readonly workspace: string;
}

/** @internal */
export class YarnWorkspaceCode extends lambda.Code {
  readonly isInline = false;
  private readonly projectPath: string;
  private readonly workspace: string;
  private asset?: YarnWorkspaceAsset;

  constructor(options: YarnWorkspaceCodeOptions) {
    super();

    this.projectPath = options.projectPath;
    this.workspace = options.workspace;
  }

  bind(scope: cdk.Construct): lambda.CodeConfig {
    const asset = new YarnWorkspaceAsset(scope, 'Asset', {
      workspace: this.workspace,
      projectPath: this.projectPath,
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
