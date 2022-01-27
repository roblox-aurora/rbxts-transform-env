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
import { $env } from "rbxts-transform-env";

function sayHello() {
    return $env("HELLO");
}

const number = $env<number>("NUMBER")
```
and it will compile to

```lua
local function sayHello()
    return "Hello, World!"
end

local number = 20
```

If you want multiple ENV files, you can use the `files` argument in your plugin.


# Configuration
To configure rbxts-transform-env, and customize how emit is handled there are specific "properties"

### `ifStatementMode`
This affects if/else statements containing `if ($NODE_ENV === y)` comparisons or `if ($env(x) === y)` conditionals.

- `"block"` - Render the resulting conditional block as a block
    ```ts
    print("Some previous code");

    // e.g. where NODE_ENV === "development"
    if ($NODE_ENV === "development") {
        print("Success!");
    } else {
        print("Failed!");
    }
    ```
    will become
    ```lua
    print("Some previous code")
    do
        print("Success!")
    end
    ```
- `"inline"` (default) - Render the resulting conditional block inline

    ```ts
    // e.g. where NODE_ENV === "development"
    if ($NODE_ENV === "development") {
        print("Success!");
    } else {
        print("Failed!");
    }
    ```
    will become
    ```lua
    print("Some previous code")
    print("Success!")
    ```
- `"off"` - No behaviour

    ```ts
    // e.g. where NODE_ENV === "development"
    if ($NODE_ENV === "development") {
        print("Success!");
    } else {
        print("Failed!");
    }
    ```
    will become
    ```lua
    if "development" == "development" then
        print("Success!")
    else
        print("Failed!")
    end
    ```

### `conditionalMode`
This affects conditional statements containing `$NODE_ENV === y ? trueValue : falseValue` comparisons or `$env(x) === y ? trueValue : falseValue` conditionals.

- `"inline"` (default) - Render the resulting conditional block inline

    ```ts
    // e.g. where NODE_ENV === "development"
    const test = $NODE_ENV === "development" ? "Yes!" : "Nooo!"
    ```
    will become
    ```lua
    local test = "Yes!"
    ```
- `"off"` - No behaviour

    ```ts
    // e.g. where NODE_ENV === "development"
    const test = $NODE_ENV === "development" ? "Yes!" : "Nooo!"
    ```
    will become
    ```lua
    local test = if "development" == "development" then "Yes!" else "Nooo!"
    ```