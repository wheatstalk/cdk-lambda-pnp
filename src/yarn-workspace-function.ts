import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { PnpCode } from './pnp-code';
import { getWorkspacePath } from './pnp-util';

export interface YarnWorkspaceFunctionProps extends lambda.FunctionOptions {
  /**
   * Name of the workspace
   */
  readonly workspace: string;

  /**
   * Name of the lambda handler, relative to the workspace.
   */
  readonly handler: string;

  /**
   * Optional location of a directory in the project
   * @default process.cwd()
   */
  readonly projectPath?: string;
}

/**
 * A lambda function from a Yarn.build-based PNP Workspace.
 */
export class YarnWorkspaceFunction extends lambda.Function {
  constructor(scope: cdk.Construct, id: string, props: YarnWorkspaceFunctionProps) {
    const projectPath = props.projectPath ?? process.cwd();

    const environment = {
      ...(props.environment ?? {}),
      NODE_OPTIONS: '--require ./.pnp.cjs',
    };

    const workspacePath = getWorkspacePath({
      cwd: projectPath,
      workspace: props.workspace,
    });

    super(scope, id, {
      ...props,
      runtime: lambda.Runtime.NODEJS_14_X,
      code: PnpCode.fromYarnWorkspace(projectPath, props.workspace),
      handler: `${workspacePath}/${props.handler}`,
      environment,
    });
  }
}
