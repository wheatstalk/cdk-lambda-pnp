import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as execa from 'execa';

/**
 * Provides bundled code.
 */
export abstract class PnpCode {
  /**
   * Create lambda code from the given yarn workspace.
   */
  static fromWorkspace(name: string, options: PnpCodeFromWorkspaceOptions = {}): lambda.Code {
    const cwd = options.cwd ?? process.cwd();
    const build = options.runBuild ?? false;

    const execaOptions = {
      cwd,
    };

    const versionRes = execa.sync('yarn', ['--version'], execaOptions);
    if (!/^[23]/.test(versionRes.stdout)) {
      throw new Error(`Unsupported Yarn version ${versionRes.stdout} - use Yarn 2 or 3`);
    }

    const pluginRuntimeRes = execa.sync('yarn', ['plugin', 'runtime', '--json'], execaOptions);
    if (!/@ojkelly\/plugin-build/.test(pluginRuntimeRes.stdout)) {
      throw new Error('No supported yarn plugins detected - you could run `yarn plugin import https://yarn.build/latest`');
    }

    const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pnpcode'));
    const bundleFile = 'bundle.zip';

    if (build) {
      execa.sync('yarn', ['workspace', name, 'build'], execaOptions);
    }

    execa.sync('yarn', ['workspace', name, 'bundle', '--output-directory', outputDir, '--archive-name', bundleFile], execaOptions);

    return lambda.Code.fromAsset(path.join(outputDir, bundleFile));
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