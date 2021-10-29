import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { PnpCode } from './pnp-code';
import { getWorkspacePath } from './pnp-util';
import { YarnBuildOptions } from './yarn-build-code';

export interface YarnBuildFunctionProps extends lambda.FunctionOptions, YarnBuildOptions {
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
 * A lambda function bundled from a Yarn.build-based workspace.
 */
export class YarnBuildFunction extends lambda.Function {
  constructor(scope: cdk.Construct, id: string, props: YarnBuildFunctionProps) {
    const projectPath = props.projectPath ?? process.cwd();

    const workspacePath = getWorkspacePath({
      workspace: props.workspace,
      cwd: projectPath,
    });

    const code = PnpCode.fromYarnBuild(projectPath, props.workspace, props);

    const environment = {
      ...(props.environment ?? {}),
      NODE_OPTIONS: '--require bundle/.pnp.cjs',
    };

    super(scope, id, {
      ...props,
      runtime: lambda.Runtime.NODEJS_14_X,
      code: code,
      handler: `bundle/${workspacePath}/${props.handler}`,
      environment,
    });
  }
}