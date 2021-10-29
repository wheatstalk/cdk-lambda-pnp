import * as lambda from '@aws-cdk/aws-lambda';
import { WorkspaceFocusPnpCode } from './workspace-focus-pnp-code';
import { YarnBuildPnpCode, YarnBuildOptions } from './yarn-build-pnp-code';

/**
 * Provides bundled code.
 */
export abstract class PnpCode {
  /**
   * Create lambda code with yarn.build.
   */
  static fromYarnBuild(projectRoot: string, workspace: string, options: YarnBuildOptions = {}): lambda.Code {
    return new YarnBuildPnpCode({
      projectRoot,
      workspace,
      ...options,
    });
  }

  static fromWorkspaceFocus(projectRoot: string, workspace: string): lambda.Code {
    return new WorkspaceFocusPnpCode({
      projectRoot,
      workspace,
    });
  }
}