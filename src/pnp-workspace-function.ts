import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as execa from 'execa';
import { PnpCode, PnpCodeFromWorkspaceOptions } from './pnp-code';

export interface PnpWorkspaceFunctionProps extends lambda.FunctionOptions, PnpCodeFromWorkspaceOptions {
  /**
   * Name of the workspace
   */
  readonly workspace: string;

  /**
   * Name of the lambda handler, relative to the workspace's root.
   */
  readonly handler: string;
}

/**
 * A lambda function from a Yarn PNP Workspace.
 */
export class PnpWorkspaceFunction extends lambda.Function {
  constructor(scope: cdk.Construct, id: string, props: PnpWorkspaceFunctionProps) {
    const workspaceRoot = getWorkspaceRoot({
      workspace: props.workspace,
      cwd: props.cwd,
    });
    const handler = `bundle/${workspaceRoot}/${props.handler}`;

    const code = PnpCode.fromWorkspace(props.workspace, props);
    const environment = {
      ...(props.environment ?? {}),
      NODE_OPTIONS: '--require bundle/.pnp.cjs',
    };

    super(scope, id, {
      ...props,
      runtime: lambda.Runtime.NODEJS_14_X,
      code,
      handler,
      environment,
    });
  }
}

/** @internal */
export interface GetWorkspaceRootOptions {
  readonly workspace: string;
  readonly cwd?: string;
}

/** @internal */
export function getWorkspaceRoot(options: GetWorkspaceRootOptions): string {
  const cwd = options.cwd ?? process.cwd();

  const infoRes = execa.sync('yarn', ['workspace', options.workspace, 'info', '--name-only', '--json'], {
    cwd,
  });

  const lines = infoRes.stdout.split(/\r?\n/i).map(line => JSON.parse(line));
  for (const line of lines) {
    // name@workspace:path/here
    const parts = line.split('@workspace:');

    if (parts.length !== 2) {
      continue;
    }

    if (parts[0] === options.workspace) {
      return parts[1];
    }
  }

  throw new Error(`Cannot find a workspace named ${options.workspace} from ${options.cwd}`);
}