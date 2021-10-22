import * as crypto from 'crypto';
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
   * Create lambda code from the given yarn workspace.
   */
  static fromWorkspace(name: string, options: PnpCodeFromWorkspaceOptions = {}): lambda.Code {
    return new PnpCodeFromWorkspace({
      name,
      ...options,
    });
  }
}

export interface PnpCodeFromWorkspaceOptions {
  /**
   * Path to any directory within your yarn project.
   * @default - the CDK app's CWD
   */
  readonly cwd?: string;

  /**
   * Use 'yarn workspace ${name} build' to build your code
   * @default - does not build the code
   */
  readonly runBuild?: boolean;
}

interface PnpCodeFromWorkspaceProps extends PnpCodeFromWorkspaceOptions {
  /**
   * Name of the workspace.
   */
  readonly name: string;
}

class PnpCodeFromWorkspace extends lambda.Code {
  readonly isInline = false;
  private readonly code: lambda.Code;

  constructor(options: PnpCodeFromWorkspaceProps) {
    super();

    const cwd = options.cwd ?? process.cwd();
    const build = options.runBuild ?? false;

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

    if (build) {
      execa.sync('yarn', ['workspace', options.name, 'build'], execaBuildOptions);
    }

    execa.sync('yarn', ['workspace', options.name, 'bundle', '--output-directory', outputDir, '--archive-name', bundleFile], execaBuildOptions);

    this.code = lambda.Code.fromAsset(path.join(outputDir, bundleFile));
  }

  bind(scope: cdk.Construct): lambda.CodeConfig {
    return this.code.bind(scope);
  }
}