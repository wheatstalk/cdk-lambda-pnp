import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { PnpCode } from './pnp-code';
import { getProjectRoot, getWorkspacePath } from './pnp-util';

export interface WorkspaceFocusFunctionProps extends lambda.FunctionOptions {
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
export class WorkspaceFocusFunction extends lambda.Function {
  constructor(scope: cdk.Construct, id: string, props: WorkspaceFocusFunctionProps) {
    const projectPath = props.projectPath ?? process.cwd();

    const projectRoot = getProjectRoot(projectPath);

    const code = PnpCode.fromWorkspaceFocus(projectRoot, props.workspace);

    const environment = {
      ...(props.environment ?? {}),
      NODE_OPTIONS: '--require .pnp.cjs',
    };

    const workspacePath = getWorkspacePath({
      workspace: props.workspace,
      cwd: projectRoot,
    });

    super(scope, id, {
      ...props,
      runtime: lambda.Runtime.NODEJS_14_X,
      code: code,
      handler: `${workspacePath}/${props.handler}`,
      environment,
    });
  }
}
