import * as lambda from '@aws-cdk/aws-lambda';
import { WorkspaceFocusCode } from './workspace-focus-code';
import { YarnBuildCode, YarnBuildOptions } from './yarn-build-code';

/**
 * Provides bundled code.
 */
export abstract class PnpCode {
  /**
   * Create lambda code with yarn.build.
   */
  static fromYarnBuild(projectRoot: string, workspace: string, options: YarnBuildOptions = {}): lambda.Code {
    return new YarnBuildCode({
      projectRoot,
      workspace,
      ...options,
    });
  }

  static fromWorkspaceFocus(projectRoot: string, workspace: string): lambda.Code {
    return new WorkspaceFocusCode({
      projectRoot,
      workspace,
    });
  }
}