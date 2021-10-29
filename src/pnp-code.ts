import * as lambda from '@aws-cdk/aws-lambda';
import { YarnBuildCode, YarnBuildOptions } from './yarn-build-code';
import { YarnWorkspaceCode } from './yarn-workspace-code';

/**
 * Provides bundled code.
 */
export abstract class PnpCode {
  /**
   * Create lambda code with the yarn.build plugin.
   */
  static fromYarnBuild(projectRoot: string, workspace: string, options: YarnBuildOptions = {}): lambda.Code {
    return new YarnBuildCode({
      projectRoot,
      workspace,
      ...options,
    });
  }

  /**
   * Create lambda code by using `yarn workspaces focus`.
   */
  static fromYarnWorkspace(projectRoot: string, workspace: string): lambda.Code {
    return new YarnWorkspaceCode({
      projectRoot,
      workspace,
    });
  }
}