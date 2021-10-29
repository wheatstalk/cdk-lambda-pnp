const pj = require('projen');

const project = new pj.AwsCdkConstructLibrary({
  author: 'Josh Kellendonk',
  authorAddress: 'joshkellendonk@gmail.com',
  cdkVersion: '1.95.2',
  defaultReleaseBranch: 'main',
  name: '@wheatstalk/cdk-lambda-pnp',
  repositoryUrl: 'https://github.com/wheatstalk/cdk-lambda-pnp.git',
  description: 'Use yarn.build to build and bundle your AWS Lambda functions',

  keywords: [
    'cdk',
    'lambda',
    'yarn',
    'pnp',
    'bundling',
    'yarn.build',
  ],

  releaseEveryCommit: true,
  releaseToNpm: true,
  npmAccess: pj.NpmAccess.PUBLIC,

  projenUpgradeSecret: 'YARN_UPGRADE_TOKEN',
  autoApproveUpgrades: true,
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['github-actions', 'github-actions[bot]', 'misterjoshua'],
  },

  cdkDependenciesAsDeps: false,
  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/aws-lambda',
  ],

  bundledDeps: [
    'execa',
    'fs-extra',
    'globby@^11.0.4',
    'ignore-walk',
  ],

  cdkTestDependencies: [
    '@aws-cdk/aws-apigatewayv2',
    '@aws-cdk/aws-apigatewayv2-integrations',
  ],

  devDeps: [
    '@types/ignore-walk',
    '@types/execa',
    '@types/fs-extra',
    'ts-node',
    'aws-cdk',
    'markmac@^0.1',
    'shx',
    '@types/glob',
    '@wheatstalk/lit-snip@^0.0',
  ],

  tsconfig: {
    exclude: [
      'test/test-app/**',
    ],
  },

  // cdkDependencies: undefined,      /* Which AWS CDK modules (those that start with "@aws-cdk/") does this library require when consumed? */
  // cdkTestDependencies: undefined,  /* AWS CDK modules required for testing. */
  // deps: [],                        /* Runtime dependencies of this module. */
  // description: undefined,          /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],                     /* Build dependencies for this module. */
  // packageName: undefined,          /* The "name" in package.json. */
  // release: undefined,              /* Add release management to this project. */
});

project.npmignore.addPatterns('/test-app');

const ignores = [
  '/cdk.out',
  '/.idea',
];
for (const ignore of ignores) {
  project.addGitIgnore(ignore);
  project.npmignore.addPatterns(ignore);
}

project.package.setScript('integ:lit', 'cdk --app "ts-node -P tsconfig.dev.json test/integ.lit.ts"');

const macros = project.addTask('readme-macros');
macros.exec('shx mv README.md README.md.bak');
macros.exec('shx cat README.md.bak | markmac > README.md');
macros.exec('shx rm README.md.bak');
project.buildTask.spawn(macros);

project.synth();