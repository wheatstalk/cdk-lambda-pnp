import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { YarnWorkspaceAsset } from './yarn-workspace-asset';

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
    const asset = new YarnWorkspaceAsset(scope, 'Asset', {
      workspace: this.workspace,
      projectRoot: this.projectRoot,
    });

    return {
      s3Location: {
        bucketName: asset.s3BucketName,
        objectKey: asset.s3ObjectKey,
      },
    };
  }
}
