import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { PnpCode } from './pnp-code';
import { getWorkspacePath } from './pnp-util';
import { YarnBuildOptions } from './yarn-build-pnp-code';

export interface PnpWorkspaceFunctionProps extends lambda.FunctionOptions {
  /**
   * Name of the workspace
   */
  readonly workspace: string;

  /**
   * Name of the lambda handler, relative to the workspace.
   */
  readonly handler: string;

  /**
   * The bundler.
   * @default - use PnpBundler.fromWorkspaceFocus()
   */
  readonly bundler?: PnpBundler;
}

/**
 * A lambda function from a Yarn PNP Workspace.
 */
export class PnpWorkspaceFunction extends lambda.Function {
  constructor(scope: cdk.Construct, id: string, props: PnpWorkspaceFunctionProps) {
    const bundler = props.bundler ?? PnpBundler.fromWorkspaceFocus();

    const bundle = bundler.bundle(props.workspace);

    const environment = {
      ...(props.environment ?? {}),
      NODE_OPTIONS: `--require ${bundle.pnpRuntimePath}`,
    };

    super(scope, id, {
      ...props,
      runtime: lambda.Runtime.NODEJS_14_X,
      code: bundle.code,
      handler: `${bundle.assetPathPrefix}/${props.handler}`,
      environment,
    });
  }
}

export abstract class PnpBundler {
  static fromYarnBuild(options: YarnBuildBundlerOptions = {}): PnpBundler {
    return new YarnBuildBundler(options);
  }

  static fromWorkspaceFocus(options: WorkspaceFocusBundlerOptions = {}): PnpBundler {
    return new WorkspaceFocusBundler(options);
  }

  abstract bundle(workspace: string): PnpWorkspaceFunctionCodeConfig;
}

export interface PnpWorkspaceFunctionCodeConfig {
  readonly pnpRuntimePath: string;
  readonly assetPathPrefix: string;
  readonly code: lambda.Code;
}

export interface YarnBuildBundlerOptions extends YarnBuildOptions {
  readonly projectPath?: string;
}

class YarnBuildBundler extends PnpBundler {
  private readonly projectPath: string;

  constructor(private readonly options: YarnBuildBundlerOptions) {
    super();

    this.projectPath = this.options.projectPath ?? process.cwd();
  }

  bundle(workspace: string): PnpWorkspaceFunctionCodeConfig {
    const workspacePath = getWorkspacePath({
      workspace,
      cwd: this.projectPath,
    });

    return {
      code: PnpCode.fromYarnBuild(this.projectPath, workspace, this.options),
      assetPathPrefix: `bundle/${workspacePath}`,
      pnpRuntimePath: 'bundle/.pnp.cjs',
    };
  }
}

export interface WorkspaceFocusBundlerOptions {
  readonly projectPath?: string;
}

class WorkspaceFocusBundler extends PnpBundler {
  private readonly projectPath: string;

  constructor(private readonly options: WorkspaceFocusBundlerOptions) {
    super();

    this.projectPath = this.options.projectPath ?? process.cwd();
  }

  bundle(workspace: string): PnpWorkspaceFunctionCodeConfig {
    const workspacePath = getWorkspacePath({
      workspace,
      cwd: this.projectPath,
    });

    const projectRoot = this.projectPath;

    return {
      code: PnpCode.fromWorkspaceFocus(projectRoot, workspace),
      assetPathPrefix: workspacePath,
      pnpRuntimePath: '.pnp.cjs',
    };
  }
}