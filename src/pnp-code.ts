import * as lambda from '@aws-cdk/aws-lambda';
import { WorkspaceFocusCode } from './workspace-focus-code';
import { YarnBuildCode, YarnBuildOptions } from './yarn-build-code';

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
  static fromWorkspaceFocus(projectRoot: string, workspace: string): lambda.Code {
    return new WorkspaceFocusCode({
      projectRoot,
      workspace,
    });
  }
}