import * as crypto from 'crypto';
import * as os from 'os';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as execa from 'execa';
import { getProjectRoot } from './pnp-util';

export interface YarnBuildOptions {
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

/** @internal */
export interface YarnBuildCodeOptions extends YarnBuildOptions {
  readonly projectPath: string;
  readonly workspace: string;
}

/** @internal */
export class YarnBuildCode extends lambda.Code {
  readonly isInline = false;
  private readonly code: lambda.Code;

  constructor(options: YarnBuildCodeOptions) {
    super();

    const projectRoot = getProjectRoot(options.projectPath);
    const runInstall = options.runInstall ?? false;
    const runBuild = options.runBuild ?? false;

    const execaBaseOptions: execa.SyncOptions = {
      cwd: projectRoot,
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