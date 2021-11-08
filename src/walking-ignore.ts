import * as path from 'path';
import * as fs from 'fs-extra';
import type {Ignore} from 'ignore';

/** @internal */
export class WalkingIgnore {
  private readonly basePath: string;
  private readonly ig: Ignore;

  constructor(ig: Ignore, basePath: string) {
    this.ig = ig;
    this.basePath = basePath;
  }

  test(fullPath: string) {
    const relativePath = path.relative(this.basePath, fullPath);

    if (fs.statSync(fullPath).isDirectory()) {
      // Look for an .npmignore every time we enter a new directory
      const npmIgnorePath = path.join(fullPath, '.npmignore');
      if (fs.existsSync(npmIgnorePath)) {
        this.loadNpmIgnore(relativePath, npmIgnorePath);
      }
    }

    // Always allow the project root
    if (relativePath === '') {
      return {
        ignored: false,
        unignored: false,
      };
    }

    const testResult = this.ig.test(relativePath);

    return {
      // ignore's TestResult can't be named, so we construct
      // an anonymous type here.
      ignored: testResult.ignored,
      unignored: testResult.unignored,
    };
  }

  private loadNpmIgnore(relativePath: string, npmIgnorePath: string) {
    const posixRelativePath = relativePath.split(path.sep).join(path.posix.sep);
    const ignoreLines = fs.readFileSync(npmIgnorePath).toString()
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line !== '' && line[0] !== '#');

    const lines = posixRelativePath === ''
      ? ignoreLines
      : ignoreLines
        .map(mapRelativePath);

    this.ig.add(lines);

    function mapRelativePath(line: string) {
      const not = line[0] === '!';
      const restOfLine = not ? line.substr(1) : line;

      const scopedRule = restOfLine[0] === '/'
        ? `/${posixRelativePath}${restOfLine}`
        : `/${posixRelativePath}/**/${restOfLine}`;

      return not
        ? '!' + scopedRule
        : scopedRule;
    }
  }
}