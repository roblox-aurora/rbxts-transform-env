# rbxts-transform-env
Transformer for Roblox TypeScript compiler that allows getting values of process.env as string literals

# Changes from 1.0
- Removed `$ifEnv`. This should be doable via an if statement now.

# Installation
`npm i rbxts-transform-env`, then in your tsconfig.json:

```json
    "compilerOptions": {
        ...
        "plugins": [
            {
                "transform": "rbxts-transform-env"
            }
        ],
    }
```

# Usage
## `$NODE_ENV`
This will change to whatever the value of `NODE_ENV` is in your environment. If no value is set, this is defined in the configuration options above under `defaultEnvironment`, or `"production"` if no such value is present.

## `$env`
This contains three functions of which can be used to obtain environment variables

#### `$env.string( variable [, defaultValue] )`
This will attempt to grab the given `variable` from the environment, otherwise will provide the default value. (`undefined` if no default value is given)

#### `$env.boolean( variable )`
This can be used to get a boolean environment variable, or check if an environment variable exists.
If the value is not (case-insensitive) `false`, but is set it will be considered `true`. This can be used to also check if environment variables exist.

#### `$env.number( variable [, defaultValue] )`
This will attempt to grab the given `variable` from the environment and parse it as a number, otherwise will provide the default value. (`undefined` if no default value is given)

# Behaviours
If there is an if statement, an attempt will be made to short-circuit the if statement. e.g.

```ts
if ($NODE_ENV === "production") {
    // Code here
}
```
Any code in this if statement will not render (unless an else is specified) if the environment is not production. 

This also applies to `$env.boolean`. Currently `$env.string` and `$env.number` do not shortcut, but this may change in future.