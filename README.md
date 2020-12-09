# rbxts-transform-env
Transformer for Roblox TypeScript compiler that allows getting values of process.env as string literals


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

The types will be available under `@rbxts/transform-env-types` at some point. Until then you can do:
```ts
declare function env(name: string): string | undefined;
declare function env(name: string, defaultValue: string): string;
```