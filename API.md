# API Reference <a name="API Reference"></a>


## Structs <a name="Structs"></a>

### PnpCodeFromWorkspaceOptions <a name="@wheatstalk/cdk-lambda-pnp.PnpCodeFromWorkspaceOptions"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { PnpCodeFromWorkspaceOptions } from '@wheatstalk/cdk-lambda-pnp'

const pnpCodeFromWorkspaceOptions: PnpCodeFromWorkspaceOptions = { ... }
```

##### `cwd`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.PnpCodeFromWorkspaceOptions.property.cwd"></a>

```typescript
public readonly cwd: string;
```

- *Type:* `string`
- *Default:* the CDK app's CWD

Path to any directory within your yarn project.

---

##### `runBuild`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.PnpCodeFromWorkspaceOptions.property.runBuild"></a>

```typescript
public readonly runBuild: boolean;
```

- *Type:* `boolean`
- *Default:* does not build the code

Use 'yarn workspace ${name} build' to build your code.

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

##### `fromWorkspace` <a name="@wheatstalk/cdk-lambda-pnp.PnpCode.fromWorkspace"></a>

```typescript
import { PnpCode } from '@wheatstalk/cdk-lambda-pnp'

PnpCode.fromWorkspace(name: string, options?: PnpCodeFromWorkspaceOptions)
```

###### `name`<sup>Required</sup> <a name="@wheatstalk/cdk-lambda-pnp.PnpCode.parameter.name"></a>

- *Type:* `string`

---

###### `options`<sup>Optional</sup> <a name="@wheatstalk/cdk-lambda-pnp.PnpCode.parameter.options"></a>

- *Type:* [`@wheatstalk/cdk-lambda-pnp.PnpCodeFromWorkspaceOptions`](#@wheatstalk/cdk-lambda-pnp.PnpCodeFromWorkspaceOptions)

---




