import * as crypto from 'crypto';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as execa from 'execa';

/**
 * Provides bundled code.
 */
export abstract class PnpCode {
  /**
   * Create lambda code with yarn.build.
   * @param workspace The yarn workspace
   * @param options Bundling options
   */
  static fromYarnBuild(workspace: string, options: PnpCodeFromWorkspaceOptions = {}): lambda.Code {
    return new PnpCodeFromYarnBundleWorkspace({
      workspace,
      ...options,
    });
  }

  /**
   * Create lambda code with cdk-lambda-pnp's Dockerfile
   * @param workspace The yarn workspace
   * @param options Bundling options
   */
  static fromDockerBuild(workspace: string, options: PnpCodeFromWorkspaceOptions = {}): lambda.Code {
    return new PnpCodeFromDocker({
      workspace,
      ...options,
    });
  }
}

export interface PnpCodeFromWorkspaceOptions {
  /**
   * Path to any directory within a yarn project.
   * @default - the CDK app's CWD
   */
  readonly cwd?: string;

  /**
   * Use 'yarn install' to install dependencies.
   * @default - does not run yarn install
   */
  readonly runInstall?: boolean;

  /**
   * Use 'yarn workspace ${name} build' to build your code
   * @default - does not build the code
   */
  readonly runBuild?: boolean;
}

interface PnpCodeFromYarnBundleWorkspaceProps extends PnpCodeFromWorkspaceOptions {
  /**
   * Name of the workspace.
   */
  readonly workspace: string;
}

class PnpCodeFromYarnBundleWorkspace extends lambda.Code {
  readonly isInline = false;
  private readonly code: lambda.Code;

  constructor(options: PnpCodeFromYarnBundleWorkspaceProps) {
    super();

    const cwd = options.cwd ?? process.cwd();
    const runInstall = options.runInstall ?? false;
    const runBuild = options.runBuild ?? false;

    const execaBaseOptions: execa.SyncOptions = {
      cwd,
    };

    const versionRes = execa.sync('yarn', ['--version'], execaBaseOptions);
    if (!/^[23]/.test(versionRes.stdout)) {
      throw new Error(`Unsupported Yarn version ${versionRes.stdout} - use Yarn 2 or 3`);
    }

    const pluginRuntimeRes = execa.sync('yarn', ['plugin', 'runtime', '--json'], execaBaseOptions);
    if (!/@ojkelly\/plugin-build/.test(pluginRuntimeRes.stdout)) {
      throw new Error('No supported yarn plugins detected - you could run `yarn plugin import https://yarn.build/latest`');
    }

    const unique = crypto.randomBytes(10).toString('hex');
    const outputDir = path.join(os.tmpdir(), `pnpcode${unique}`);

    const bundleFile = 'bundle.zip';
    const execaBuildOptions: execa.SyncOptions = {
      ...execaBaseOptions,
      // Show the build output
      stdout: process.stdout,
      stderr: process.stderr,
    };

    if (runInstall) {
      execa.sync('yarn', ['install'], execaBuildOptions);
    }

    if (runBuild) {
      execa.sync('yarn', ['workspace', options.workspace, 'build'], execaBuildOptions);
    }

    execa.sync('yarn', ['workspace', options.workspace, 'bundle', '--output-directory', outputDir, '--archive-name', bundleFile], execaBuildOptions);

    this.code = lambda.Code.fromAsset(path.join(outputDir, bundleFile));
  }

  bind(scope: cdk.Construct): lambda.CodeConfig {
    return this.code.bind(scope);
  }
}

interface PnpCodeFromDockerOptions extends PnpCodeFromWorkspaceOptions {
  readonly workspace: string;
}

class PnpCodeFromDocker extends lambda.Code {
  readonly isInline = false;
  private readonly code: lambda.Code;

  constructor(options: PnpCodeFromDockerOptions) {
    super();

    const cwd = options.cwd ?? process.cwd();
    const runInstall = options.runInstall ?? false;
    const runBuild = options.runBuild ?? false;

    if (runInstall) {
      execa.sync('yarn', ['install'], { cwd });
    }

    if (runBuild) {
      execa.sync('yarn', ['workspace', options.workspace, 'build'], { cwd });
    }

    const unique = crypto.randomBytes(10).toString('hex');
    const localDockerfilePath = path.join(cwd, `pnp.Dockerfile${unique}`);
    fs.copyFileSync(PNP_DOCKERFILE_PATH, localDockerfilePath);
    try {
      this.code = lambda.Code.fromDockerBuild(cwd, {
        file: path.relative(cwd, PNP_DOCKERFILE_PATH),
        buildArgs: {
          WORKSPACE: options.workspace,
        },
      });
    } finally {
      fs.rmSync(localDockerfilePath);
    }
  }

  bind(scope: cdk.Construct): lambda.CodeConfig {
    return this.code.bind(scope);
  }
}

const PNP_DOCKERFILE_PATH = path.join(__dirname, '..', 'files', 'pnp.Dockerfile');