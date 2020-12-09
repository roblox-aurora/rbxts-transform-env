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

For example, you have a `.env` file in your project directory as following:

```env
HELLO=Hello, World!
NUMBER=20
```

Then in the typescript code, you can do 
```ts
import { env } from "rbxts-transform-env";

function sayHello() {
    return env("HELLO");
}

const number = env<number>("NUMBER")
```
and it will compile to

```lua
local function sayHello()
    return "Hello, World!"
end

local number = 20
```

If you want multiple ENV files, you can use the `files` argument in your plugin.