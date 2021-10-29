# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### YarnBuildFunction <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunction"></a>

A lambda function bundled from a Yarn.build-based workspace.

#### Initializers <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunction.Initializer"></a>

```typescript
import { YarnBuildFunction } from '@wheatstalk/cdk-lambda-pnp'

new YarnBuildFunction(scope: Construct, id: string, props: YarnBuildFunctionProps)
```

##### `scope`<sup>Required</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunction.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Construct`](#@aws-cdk/core.Construct)

---

##### `id`<sup>Required</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunction.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunction.parameter.props"></a>

- *Type:* [`@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps`](#@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps)

---





### YarnWorkspaceFunction <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunction"></a>

A lambda function from a Yarn.build-based PNP Workspace.

#### Initializers <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunction.Initializer"></a>

```typescript
import { YarnWorkspaceFunction } from '@wheatstalk/cdk-lambda-pnp'

new YarnWorkspaceFunction(scope: Construct, id: string, props: YarnWorkspaceFunctionProps)
```

##### `scope`<sup>Required</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunction.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Construct`](#@aws-cdk/core.Construct)

---

##### `id`<sup>Required</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunction.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunction.parameter.props"></a>

- *Type:* [`@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps`](#@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps)

---





## Structs <a name="Structs"></a>

### YarnBuildFunctionProps <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { YarnBuildFunctionProps } from '@wheatstalk/cdk-lambda-pnp'

const yarnBuildFunctionProps: YarnBuildFunctionProps = { ... }
```

##### `maxEventAge`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.maxEventAge"></a>

```typescript
public readonly maxEventAge: Duration;
```

- *Type:* [`@aws-cdk/core.Duration`](#@aws-cdk/core.Duration)
- *Default:* Duration.hours(6)

The maximum age of a request that Lambda sends to a function for processing.

Minimum: 60 seconds
Maximum: 6 hours

---

##### `onFailure`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.onFailure"></a>

```typescript
public readonly onFailure: IDestination;
```

- *Type:* [`@aws-cdk/aws-lambda.IDestination`](#@aws-cdk/aws-lambda.IDestination)
- *Default:* no destination

The destination for failed invocations.

---

##### `onSuccess`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.onSuccess"></a>

```typescript
public readonly onSuccess: IDestination;
```

- *Type:* [`@aws-cdk/aws-lambda.IDestination`](#@aws-cdk/aws-lambda.IDestination)
- *Default:* no destination

The destination for successful invocations.

---

##### `retryAttempts`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.retryAttempts"></a>

```typescript
public readonly retryAttempts: number;
```

- *Type:* `number`
- *Default:* 2

The maximum number of times to retry when the function returns an error.

Minimum: 0
Maximum: 2

---

##### `allowAllOutbound`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.allowAllOutbound"></a>

```typescript
public readonly allowAllOutbound: boolean;
```

- *Type:* `boolean`
- *Default:* true

Whether to allow the Lambda to send all network traffic.

If set to false, you must individually add traffic rules to allow the
Lambda to connect to network targets.

---

##### `allowPublicSubnet`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.allowPublicSubnet"></a>

```typescript
public readonly allowPublicSubnet: boolean;
```

- *Type:* `boolean`
- *Default:* false

Lambda Functions in a public subnet can NOT access the internet.

Use this property to acknowledge this limitation and still place the function in a public subnet.

> https://stackoverflow.com/questions/52992085/why-cant-an-aws-lambda-function-inside-a-public-subnet-in-a-vpc-connect-to-the/52994841#52994841

---

##### `architecture`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.architecture"></a>

```typescript
public readonly architecture: Architecture;
```

- *Type:* [`@aws-cdk/aws-lambda.Architecture`](#@aws-cdk/aws-lambda.Architecture)
- *Default:* Architecture.X86_64

The system architectures compatible with this lambda function.

---

##### ~~`architectures`~~<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.architectures"></a>

- *Deprecated:* use `architecture`

```typescript
public readonly architectures: Architecture[];
```

- *Type:* [`@aws-cdk/aws-lambda.Architecture`](#@aws-cdk/aws-lambda.Architecture)[]
- *Default:* [Architecture.X86_64]

DEPRECATED.

---

##### `codeSigningConfig`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.codeSigningConfig"></a>

```typescript
public readonly codeSigningConfig: ICodeSigningConfig;
```

- *Type:* [`@aws-cdk/aws-lambda.ICodeSigningConfig`](#@aws-cdk/aws-lambda.ICodeSigningConfig)
- *Default:* Not Sign the Code

Code signing config associated with this function.

---

##### `currentVersionOptions`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.currentVersionOptions"></a>

```typescript
public readonly currentVersionOptions: VersionOptions;
```

- *Type:* [`@aws-cdk/aws-lambda.VersionOptions`](#@aws-cdk/aws-lambda.VersionOptions)
- *Default:* default options as described in `VersionOptions`

Options for the `lambda.Version` resource automatically created by the `fn.currentVersion` method.

---

##### `deadLetterQueue`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.deadLetterQueue"></a>

```typescript
public readonly deadLetterQueue: IQueue;
```

- *Type:* [`@aws-cdk/aws-sqs.IQueue`](#@aws-cdk/aws-sqs.IQueue)
- *Default:* SQS queue with 14 day retention period if `deadLetterQueueEnabled` is `true`

The SQS queue to use if DLQ is enabled.

---

##### `deadLetterQueueEnabled`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.deadLetterQueueEnabled"></a>

```typescript
public readonly deadLetterQueueEnabled: boolean;
```

- *Type:* `boolean`
- *Default:* false unless `deadLetterQueue` is set, which implies DLQ is enabled.

Enabled DLQ.

If `deadLetterQueue` is undefined,
an SQS queue with default options will be defined for your Function.

---

##### `description`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* `string`
- *Default:* No description.

A description of the function.

---

##### `environment`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.environment"></a>

```typescript
public readonly environment: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: `string`}
- *Default:* No environment variables.

Key-value pairs that Lambda caches and makes available for your Lambda functions.

Use environment variables to apply configuration changes, such
as test and production environment configurations, without changing your
Lambda function source code.

---

##### `environmentEncryption`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.environmentEncryption"></a>

```typescript
public readonly environmentEncryption: IKey;
```

- *Type:* [`@aws-cdk/aws-kms.IKey`](#@aws-cdk/aws-kms.IKey)
- *Default:* AWS Lambda creates and uses an AWS managed customer master key (CMK).

The AWS KMS key that's used to encrypt your function's environment variables.

---

##### `events`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.events"></a>

```typescript
public readonly events: IEventSource[];
```

- *Type:* [`@aws-cdk/aws-lambda.IEventSource`](#@aws-cdk/aws-lambda.IEventSource)[]
- *Default:* No event sources.

Event sources for this function.

You can also add event sources using `addEventSource`.

---

##### `filesystem`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.filesystem"></a>

```typescript
public readonly filesystem: FileSystem;
```

- *Type:* [`@aws-cdk/aws-lambda.FileSystem`](#@aws-cdk/aws-lambda.FileSystem)
- *Default:* will not mount any filesystem

The filesystem configuration for the lambda function.

---

##### `functionName`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.functionName"></a>

```typescript
public readonly functionName: string;
```

- *Type:* `string`
- *Default:* AWS CloudFormation generates a unique physical ID and uses that
ID for the function's name. For more information, see Name Type.

A name for the function.

---

##### `initialPolicy`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.initialPolicy"></a>

```typescript
public readonly initialPolicy: PolicyStatement[];
```

- *Type:* [`@aws-cdk/aws-iam.PolicyStatement`](#@aws-cdk/aws-iam.PolicyStatement)[]
- *Default:* No policy statements are added to the created Lambda role.

Initial policy statements to add to the created Lambda Role.

You can call `addToRolePolicy` to the created lambda to add statements post creation.

---

##### `insightsVersion`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.insightsVersion"></a>

```typescript
public readonly insightsVersion: LambdaInsightsVersion;
```

- *Type:* [`@aws-cdk/aws-lambda.LambdaInsightsVersion`](#@aws-cdk/aws-lambda.LambdaInsightsVersion)
- *Default:* No Lambda Insights

Specify the version of CloudWatch Lambda insights to use for monitoring.

> https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-Getting-Started-docker.html

---

##### `layers`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.layers"></a>

```typescript
public readonly layers: ILayerVersion[];
```

- *Type:* [`@aws-cdk/aws-lambda.ILayerVersion`](#@aws-cdk/aws-lambda.ILayerVersion)[]
- *Default:* No layers.

A list of layers to add to the function's execution environment.

You can configure your Lambda function to pull in
additional code during initialization in the form of layers. Layers are packages of libraries or other dependencies
that can be used by multiple functions.

---

##### `logRetention`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.logRetention"></a>

```typescript
public readonly logRetention: RetentionDays;
```

- *Type:* [`@aws-cdk/aws-logs.RetentionDays`](#@aws-cdk/aws-logs.RetentionDays)
- *Default:* logs.RetentionDays.INFINITE

The number of days log events are kept in CloudWatch Logs.

When updating
this property, unsetting it doesn't remove the log retention policy. To
remove the retention policy, set the value to `INFINITE`.

---

##### `logRetentionRetryOptions`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.logRetentionRetryOptions"></a>

```typescript
public readonly logRetentionRetryOptions: LogRetentionRetryOptions;
```

- *Type:* [`@aws-cdk/aws-lambda.LogRetentionRetryOptions`](#@aws-cdk/aws-lambda.LogRetentionRetryOptions)
- *Default:* Default AWS SDK retry options.

When log retention is specified, a custom resource attempts to create the CloudWatch log group.

These options control the retry policy when interacting with CloudWatch APIs.

---

##### `logRetentionRole`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.logRetentionRole"></a>

```typescript
public readonly logRetentionRole: IRole;
```

- *Type:* [`@aws-cdk/aws-iam.IRole`](#@aws-cdk/aws-iam.IRole)
- *Default:* A new role is created.

The IAM role for the Lambda function associated with the custom resource that sets the retention policy.

---

##### `memorySize`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.memorySize"></a>

```typescript
public readonly memorySize: number;
```

- *Type:* `number`
- *Default:* 128

The amount of memory, in MB, that is allocated to your Lambda function.

Lambda uses this value to proportionally allocate the amount of CPU
power. For more information, see Resource Model in the AWS Lambda
Developer Guide.

---

##### `profiling`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.profiling"></a>

```typescript
public readonly profiling: boolean;
```

- *Type:* `boolean`
- *Default:* No profiling.

Enable profiling.

> https://docs.aws.amazon.com/codeguru/latest/profiler-ug/setting-up-lambda.html

---

##### `profilingGroup`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.profilingGroup"></a>

```typescript
public readonly profilingGroup: IProfilingGroup;
```

- *Type:* [`@aws-cdk/aws-codeguruprofiler.IProfilingGroup`](#@aws-cdk/aws-codeguruprofiler.IProfilingGroup)
- *Default:* A new profiling group will be created if `profiling` is set.

Profiling Group.

> https://docs.aws.amazon.com/codeguru/latest/profiler-ug/setting-up-lambda.html

---

##### `reservedConcurrentExecutions`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.reservedConcurrentExecutions"></a>

```typescript
public readonly reservedConcurrentExecutions: number;
```

- *Type:* `number`
- *Default:* No specific limit - account limit.

The maximum of concurrent executions you want to reserve for the function.

> https://docs.aws.amazon.com/lambda/latest/dg/concurrent-executions.html

---

##### `role`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* [`@aws-cdk/aws-iam.IRole`](#@aws-cdk/aws-iam.IRole)
- *Default:* A unique role will be generated for this lambda function.
Both supplied and generated roles can always be changed by calling `addToRolePolicy`.

Lambda execution role.

This is the role that will be assumed by the function upon execution.
It controls the permissions that the function will have. The Role must
be assumable by the 'lambda.amazonaws.com' service principal.

The default Role automatically has permissions granted for Lambda execution. If you
provide a Role, you must add the relevant AWS managed policies yourself.

The relevant managed policies are "service-role/AWSLambdaBasicExecutionRole" and
"service-role/AWSLambdaVPCAccessExecutionRole".

---

##### ~~`securityGroup`~~<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.securityGroup"></a>

- *Deprecated:* - This property is deprecated, use securityGroups instead

```typescript
public readonly securityGroup: ISecurityGroup;
```

- *Type:* [`@aws-cdk/aws-ec2.ISecurityGroup`](#@aws-cdk/aws-ec2.ISecurityGroup)
- *Default:* If the function is placed within a VPC and a security group is
not specified, either by this or securityGroups prop, a dedicated security
group will be created for this function.

What security group to associate with the Lambda's network interfaces. This property is being deprecated, consider using securityGroups instead.

Only used if 'vpc' is supplied.

Use securityGroups property instead.
Function constructor will throw an error if both are specified.

---

##### `securityGroups`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* [`@aws-cdk/aws-ec2.ISecurityGroup`](#@aws-cdk/aws-ec2.ISecurityGroup)[]
- *Default:* If the function is placed within a VPC and a security group is
not specified, either by this or securityGroup prop, a dedicated security
group will be created for this function.

The list of security groups to associate with the Lambda's network interfaces.

Only used if 'vpc' is supplied.

---

##### `timeout`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.timeout"></a>

```typescript
public readonly timeout: Duration;
```

- *Type:* [`@aws-cdk/core.Duration`](#@aws-cdk/core.Duration)
- *Default:* Duration.seconds(3)

The function execution time (in seconds) after which Lambda terminates the function.

Because the execution time affects cost, set this value
based on the function's expected execution time.

---

##### `tracing`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.tracing"></a>

```typescript
public readonly tracing: Tracing;
```

- *Type:* [`@aws-cdk/aws-lambda.Tracing`](#@aws-cdk/aws-lambda.Tracing)
- *Default:* Tracing.Disabled

Enable AWS X-Ray Tracing for Lambda Function.

---

##### `vpc`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* [`@aws-cdk/aws-ec2.IVpc`](#@aws-cdk/aws-ec2.IVpc)
- *Default:* Function is not placed within a VPC.

VPC network to place Lambda network interfaces.

Specify this if the Lambda function needs to access resources in a VPC.

---

##### `vpcSubnets`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.vpcSubnets"></a>

```typescript
public readonly vpcSubnets: SubnetSelection;
```

- *Type:* [`@aws-cdk/aws-ec2.SubnetSelection`](#@aws-cdk/aws-ec2.SubnetSelection)
- *Default:* the Vpc default strategy if not specified

Where to place the network interfaces within the VPC.

Only used if 'vpc' is supplied. Note: internet access for Lambdas
requires a NAT gateway, so picking Public subnets is not allowed.

---

##### `runBuild`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.runBuild"></a>

```typescript
public readonly runBuild: boolean;
```

- *Type:* `boolean`
- *Default:* does not build the code

Use 'yarn workspace ${name} build' to build your code.

---

##### `runInstall`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.runInstall"></a>

```typescript
public readonly runInstall: boolean;
```

- *Type:* `boolean`
- *Default:* does not run yarn install

Use 'yarn install' to install dependencies.

---

##### `handler`<sup>Required</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.handler"></a>

```typescript
public readonly handler: string;
```

- *Type:* `string`

Name of the lambda handler, relative to the workspace.

---

##### `workspace`<sup>Required</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.workspace"></a>

```typescript
public readonly workspace: string;
```

- *Type:* `string`

Name of the workspace.

---

##### `projectPath`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildFunctionProps.property.projectPath"></a>

```typescript
public readonly projectPath: string;
```

- *Type:* `string`
- *Default:* process.cwd()

Optional location of a directory in the project.

---

### YarnBuildOptions <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildOptions"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { YarnBuildOptions } from '@wheatstalk/cdk-lambda-pnp'

const yarnBuildOptions: YarnBuildOptions = { ... }
```

##### `runBuild`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildOptions.property.runBuild"></a>

```typescript
public readonly runBuild: boolean;
```

- *Type:* `boolean`
- *Default:* does not build the code

Use 'yarn workspace ${name} build' to build your code.

---

##### `runInstall`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnBuildOptions.property.runInstall"></a>

```typescript
public readonly runInstall: boolean;
```

- *Type:* `boolean`
- *Default:* does not run yarn install

Use 'yarn install' to install dependencies.

---

### YarnWorkspaceFunctionProps <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { YarnWorkspaceFunctionProps } from '@wheatstalk/cdk-lambda-pnp'

const yarnWorkspaceFunctionProps: YarnWorkspaceFunctionProps = { ... }
```

##### `maxEventAge`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.maxEventAge"></a>

```typescript
public readonly maxEventAge: Duration;
```

- *Type:* [`@aws-cdk/core.Duration`](#@aws-cdk/core.Duration)
- *Default:* Duration.hours(6)

The maximum age of a request that Lambda sends to a function for processing.

Minimum: 60 seconds
Maximum: 6 hours

---

##### `onFailure`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.onFailure"></a>

```typescript
public readonly onFailure: IDestination;
```

- *Type:* [`@aws-cdk/aws-lambda.IDestination`](#@aws-cdk/aws-lambda.IDestination)
- *Default:* no destination

The destination for failed invocations.

---

##### `onSuccess`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.onSuccess"></a>

```typescript
public readonly onSuccess: IDestination;
```

- *Type:* [`@aws-cdk/aws-lambda.IDestination`](#@aws-cdk/aws-lambda.IDestination)
- *Default:* no destination

The destination for successful invocations.

---

##### `retryAttempts`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.retryAttempts"></a>

```typescript
public readonly retryAttempts: number;
```

- *Type:* `number`
- *Default:* 2

The maximum number of times to retry when the function returns an error.

Minimum: 0
Maximum: 2

---

##### `allowAllOutbound`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.allowAllOutbound"></a>

```typescript
public readonly allowAllOutbound: boolean;
```

- *Type:* `boolean`
- *Default:* true

Whether to allow the Lambda to send all network traffic.

If set to false, you must individually add traffic rules to allow the
Lambda to connect to network targets.

---

##### `allowPublicSubnet`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.allowPublicSubnet"></a>

```typescript
public readonly allowPublicSubnet: boolean;
```

- *Type:* `boolean`
- *Default:* false

Lambda Functions in a public subnet can NOT access the internet.

Use this property to acknowledge this limitation and still place the function in a public subnet.

> https://stackoverflow.com/questions/52992085/why-cant-an-aws-lambda-function-inside-a-public-subnet-in-a-vpc-connect-to-the/52994841#52994841

---

##### `architecture`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.architecture"></a>

```typescript
public readonly architecture: Architecture;
```

- *Type:* [`@aws-cdk/aws-lambda.Architecture`](#@aws-cdk/aws-lambda.Architecture)
- *Default:* Architecture.X86_64

The system architectures compatible with this lambda function.

---

##### ~~`architectures`~~<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.architectures"></a>

- *Deprecated:* use `architecture`

```typescript
public readonly architectures: Architecture[];
```

- *Type:* [`@aws-cdk/aws-lambda.Architecture`](#@aws-cdk/aws-lambda.Architecture)[]
- *Default:* [Architecture.X86_64]

DEPRECATED.

---

##### `codeSigningConfig`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.codeSigningConfig"></a>

```typescript
public readonly codeSigningConfig: ICodeSigningConfig;
```

- *Type:* [`@aws-cdk/aws-lambda.ICodeSigningConfig`](#@aws-cdk/aws-lambda.ICodeSigningConfig)
- *Default:* Not Sign the Code

Code signing config associated with this function.

---

##### `currentVersionOptions`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.currentVersionOptions"></a>

```typescript
public readonly currentVersionOptions: VersionOptions;
```

- *Type:* [`@aws-cdk/aws-lambda.VersionOptions`](#@aws-cdk/aws-lambda.VersionOptions)
- *Default:* default options as described in `VersionOptions`

Options for the `lambda.Version` resource automatically created by the `fn.currentVersion` method.

---

##### `deadLetterQueue`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.deadLetterQueue"></a>

```typescript
public readonly deadLetterQueue: IQueue;
```

- *Type:* [`@aws-cdk/aws-sqs.IQueue`](#@aws-cdk/aws-sqs.IQueue)
- *Default:* SQS queue with 14 day retention period if `deadLetterQueueEnabled` is `true`

The SQS queue to use if DLQ is enabled.

---

##### `deadLetterQueueEnabled`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.deadLetterQueueEnabled"></a>

```typescript
public readonly deadLetterQueueEnabled: boolean;
```

- *Type:* `boolean`
- *Default:* false unless `deadLetterQueue` is set, which implies DLQ is enabled.

Enabled DLQ.

If `deadLetterQueue` is undefined,
an SQS queue with default options will be defined for your Function.

---

##### `description`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* `string`
- *Default:* No description.

A description of the function.

---

##### `environment`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.environment"></a>

```typescript
public readonly environment: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: `string`}
- *Default:* No environment variables.

Key-value pairs that Lambda caches and makes available for your Lambda functions.

Use environment variables to apply configuration changes, such
as test and production environment configurations, without changing your
Lambda function source code.

---

##### `environmentEncryption`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.environmentEncryption"></a>

```typescript
public readonly environmentEncryption: IKey;
```

- *Type:* [`@aws-cdk/aws-kms.IKey`](#@aws-cdk/aws-kms.IKey)
- *Default:* AWS Lambda creates and uses an AWS managed customer master key (CMK).

The AWS KMS key that's used to encrypt your function's environment variables.

---

##### `events`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.events"></a>

```typescript
public readonly events: IEventSource[];
```

- *Type:* [`@aws-cdk/aws-lambda.IEventSource`](#@aws-cdk/aws-lambda.IEventSource)[]
- *Default:* No event sources.

Event sources for this function.

You can also add event sources using `addEventSource`.

---

##### `filesystem`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.filesystem"></a>

```typescript
public readonly filesystem: FileSystem;
```

- *Type:* [`@aws-cdk/aws-lambda.FileSystem`](#@aws-cdk/aws-lambda.FileSystem)
- *Default:* will not mount any filesystem

The filesystem configuration for the lambda function.

---

##### `functionName`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.functionName"></a>

```typescript
public readonly functionName: string;
```

- *Type:* `string`
- *Default:* AWS CloudFormation generates a unique physical ID and uses that
ID for the function's name. For more information, see Name Type.

A name for the function.

---

##### `initialPolicy`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.initialPolicy"></a>

```typescript
public readonly initialPolicy: PolicyStatement[];
```

- *Type:* [`@aws-cdk/aws-iam.PolicyStatement`](#@aws-cdk/aws-iam.PolicyStatement)[]
- *Default:* No policy statements are added to the created Lambda role.

Initial policy statements to add to the created Lambda Role.

You can call `addToRolePolicy` to the created lambda to add statements post creation.

---

##### `insightsVersion`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.insightsVersion"></a>

```typescript
public readonly insightsVersion: LambdaInsightsVersion;
```

- *Type:* [`@aws-cdk/aws-lambda.LambdaInsightsVersion`](#@aws-cdk/aws-lambda.LambdaInsightsVersion)
- *Default:* No Lambda Insights

Specify the version of CloudWatch Lambda insights to use for monitoring.

> https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-Getting-Started-docker.html

---

##### `layers`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.layers"></a>

```typescript
public readonly layers: ILayerVersion[];
```

- *Type:* [`@aws-cdk/aws-lambda.ILayerVersion`](#@aws-cdk/aws-lambda.ILayerVersion)[]
- *Default:* No layers.

A list of layers to add to the function's execution environment.

You can configure your Lambda function to pull in
additional code during initialization in the form of layers. Layers are packages of libraries or other dependencies
that can be used by multiple functions.

---

##### `logRetention`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.logRetention"></a>

```typescript
public readonly logRetention: RetentionDays;
```

- *Type:* [`@aws-cdk/aws-logs.RetentionDays`](#@aws-cdk/aws-logs.RetentionDays)
- *Default:* logs.RetentionDays.INFINITE

The number of days log events are kept in CloudWatch Logs.

When updating
this property, unsetting it doesn't remove the log retention policy. To
remove the retention policy, set the value to `INFINITE`.

---

##### `logRetentionRetryOptions`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.logRetentionRetryOptions"></a>

```typescript
public readonly logRetentionRetryOptions: LogRetentionRetryOptions;
```

- *Type:* [`@aws-cdk/aws-lambda.LogRetentionRetryOptions`](#@aws-cdk/aws-lambda.LogRetentionRetryOptions)
- *Default:* Default AWS SDK retry options.

When log retention is specified, a custom resource attempts to create the CloudWatch log group.

These options control the retry policy when interacting with CloudWatch APIs.

---

##### `logRetentionRole`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.logRetentionRole"></a>

```typescript
public readonly logRetentionRole: IRole;
```

- *Type:* [`@aws-cdk/aws-iam.IRole`](#@aws-cdk/aws-iam.IRole)
- *Default:* A new role is created.

The IAM role for the Lambda function associated with the custom resource that sets the retention policy.

---

##### `memorySize`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.memorySize"></a>

```typescript
public readonly memorySize: number;
```

- *Type:* `number`
- *Default:* 128

The amount of memory, in MB, that is allocated to your Lambda function.

Lambda uses this value to proportionally allocate the amount of CPU
power. For more information, see Resource Model in the AWS Lambda
Developer Guide.

---

##### `profiling`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.profiling"></a>

```typescript
public readonly profiling: boolean;
```

- *Type:* `boolean`
- *Default:* No profiling.

Enable profiling.

> https://docs.aws.amazon.com/codeguru/latest/profiler-ug/setting-up-lambda.html

---

##### `profilingGroup`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.profilingGroup"></a>

```typescript
public readonly profilingGroup: IProfilingGroup;
```

- *Type:* [`@aws-cdk/aws-codeguruprofiler.IProfilingGroup`](#@aws-cdk/aws-codeguruprofiler.IProfilingGroup)
- *Default:* A new profiling group will be created if `profiling` is set.

Profiling Group.

> https://docs.aws.amazon.com/codeguru/latest/profiler-ug/setting-up-lambda.html

---

##### `reservedConcurrentExecutions`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.reservedConcurrentExecutions"></a>

```typescript
public readonly reservedConcurrentExecutions: number;
```

- *Type:* `number`
- *Default:* No specific limit - account limit.

The maximum of concurrent executions you want to reserve for the function.

> https://docs.aws.amazon.com/lambda/latest/dg/concurrent-executions.html

---

##### `role`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* [`@aws-cdk/aws-iam.IRole`](#@aws-cdk/aws-iam.IRole)
- *Default:* A unique role will be generated for this lambda function.
Both supplied and generated roles can always be changed by calling `addToRolePolicy`.

Lambda execution role.

This is the role that will be assumed by the function upon execution.
It controls the permissions that the function will have. The Role must
be assumable by the 'lambda.amazonaws.com' service principal.

The default Role automatically has permissions granted for Lambda execution. If you
provide a Role, you must add the relevant AWS managed policies yourself.

The relevant managed policies are "service-role/AWSLambdaBasicExecutionRole" and
"service-role/AWSLambdaVPCAccessExecutionRole".

---

##### ~~`securityGroup`~~<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.securityGroup"></a>

- *Deprecated:* - This property is deprecated, use securityGroups instead

```typescript
public readonly securityGroup: ISecurityGroup;
```

- *Type:* [`@aws-cdk/aws-ec2.ISecurityGroup`](#@aws-cdk/aws-ec2.ISecurityGroup)
- *Default:* If the function is placed within a VPC and a security group is
not specified, either by this or securityGroups prop, a dedicated security
group will be created for this function.

What security group to associate with the Lambda's network interfaces. This property is being deprecated, consider using securityGroups instead.

Only used if 'vpc' is supplied.

Use securityGroups property instead.
Function constructor will throw an error if both are specified.

---

##### `securityGroups`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* [`@aws-cdk/aws-ec2.ISecurityGroup`](#@aws-cdk/aws-ec2.ISecurityGroup)[]
- *Default:* If the function is placed within a VPC and a security group is
not specified, either by this or securityGroup prop, a dedicated security
group will be created for this function.

The list of security groups to associate with the Lambda's network interfaces.

Only used if 'vpc' is supplied.

---

##### `timeout`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.timeout"></a>

```typescript
public readonly timeout: Duration;
```

- *Type:* [`@aws-cdk/core.Duration`](#@aws-cdk/core.Duration)
- *Default:* Duration.seconds(3)

The function execution time (in seconds) after which Lambda terminates the function.

Because the execution time affects cost, set this value
based on the function's expected execution time.

---

##### `tracing`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.tracing"></a>

```typescript
public readonly tracing: Tracing;
```

- *Type:* [`@aws-cdk/aws-lambda.Tracing`](#@aws-cdk/aws-lambda.Tracing)
- *Default:* Tracing.Disabled

Enable AWS X-Ray Tracing for Lambda Function.

---

##### `vpc`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* [`@aws-cdk/aws-ec2.IVpc`](#@aws-cdk/aws-ec2.IVpc)
- *Default:* Function is not placed within a VPC.

VPC network to place Lambda network interfaces.

Specify this if the Lambda function needs to access resources in a VPC.

---

##### `vpcSubnets`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.vpcSubnets"></a>

```typescript
public readonly vpcSubnets: SubnetSelection;
```

- *Type:* [`@aws-cdk/aws-ec2.SubnetSelection`](#@aws-cdk/aws-ec2.SubnetSelection)
- *Default:* the Vpc default strategy if not specified

Where to place the network interfaces within the VPC.

Only used if 'vpc' is supplied. Note: internet access for Lambdas
requires a NAT gateway, so picking Public subnets is not allowed.

---

##### `handler`<sup>Required</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.handler"></a>

```typescript
public readonly handler: string;
```

- *Type:* `string`

Name of the lambda handler, relative to the workspace.

---

##### `workspace`<sup>Required</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.workspace"></a>

```typescript
public readonly workspace: string;
```

- *Type:* `string`

Name of the workspace.

---

##### `projectPath`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.YarnWorkspaceFunctionProps.property.projectPath"></a>

```typescript
public readonly projectPath: string;
```

- *Type:* `string`
- *Default:* process.cwd()

Optional location of a directory in the project.

---

## Classes <a name="Classes"></a>

### PnpCode <a name="@wheatstalk/cdk-lambda-pnp.PnpCode"></a>

Provides bundled code.

#### Initializers <a name="@wheatstalk/cdk-lambda-pnp.PnpCode.Initializer"></a>

```typescript
import { PnpCode } from '@wheatstalk/cdk-lambda-pnp'

new PnpCode()
```


#### Static Functions <a name="Static Functions"></a>

##### `fromYarnBuild` <a name="@wheatstalk/cdk-lambda-pnp.PnpCode.fromYarnBuild"></a>

```typescript
import { PnpCode } from '@wheatstalk/cdk-lambda-pnp'

PnpCode.fromYarnBuild(projectRoot: string, workspace: string, options?: YarnBuildOptions)
```

###### `projectRoot`<sup>Required</sup> <a name="@wheatstalk/cdk-lambda-pnp.PnpCode.parameter.projectRoot"></a>

- *Type:* `string`

---

###### `workspace`<sup>Required</sup> <a name="@wheatstalk/cdk-lambda-pnp.PnpCode.parameter.workspace"></a>

- *Type:* `string`

---

###### `options`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.PnpCode.parameter.options"></a>

- *Type:* [`@wheatstalk/cdk-lambda-pnp.YarnBuildOptions`](#@wheatstalk/cdk-lambda-pnp.YarnBuildOptions)

---

##### `fromYarnWorkspace` <a name="@wheatstalk/cdk-lambda-pnp.PnpCode.fromYarnWorkspace"></a>

```typescript
import { PnpCode } from '@wheatstalk/cdk-lambda-pnp'

PnpCode.fromYarnWorkspace(projectRoot: string, workspace: string)
```

###### `projectRoot`<sup>Required</sup> <a name="@wheatstalk/cdk-lambda-pnp.PnpCode.parameter.projectRoot"></a>

- *Type:* `string`

---

###### `workspace`<sup>Required</sup> <a name="@wheatstalk/cdk-lambda-pnp.PnpCode.parameter.workspace"></a>

- *Type:* `string`

---




