/**
 * Macro for grabbing an environment variable
 *
 * E.g. if you set NODE_ENV=development
 * ```ts
 * const env = $env("NODE_ENV");
 * ```
 * will become
 * ```lua
 * local env = "development"
 * ```
 *
 * @param variable The environment variable
 * @param defaultValue The default value if the environment variable is not set.
 */
export function $env<T extends string = string>(variable: string): T | undefined;
export function $env<T extends string = string>(variable: string, defaultValue: T): T;
export function $env<T extends number>(variable: string): T | undefined;
export function $env<T extends number>(variable: string, defaultValue: T): T;
export function $env<T extends boolean>(variable: string): T | undefined;
export function $env<T extends boolean>(variable: string, defaultValue: T): T;

/**
 * Macro for rendering a block of code if the variable matches the specified value
 * @param variable The environment variable
 * @param matches The value to match
 * @param fn The function containing the code to render
 *
 * **The third argument MUST be an arrow function.**
 * e.g.
 *
 * ```ts
 * $ifEnv("NODE_ENV", "development", () => {
 * print("Example code that will be rendered only if NODE_ENV is 'development'")
 * })
 * ```
 *
 * will result in
 * ```lua
 * (function()
 *  print("Example code that will be rendered only if NODE_ENV is 'development'")
 * end)()
 * ```
 * IF NODE_ENV is 'development', otherwise nothing will be emitted.
 */
export function $ifEnv(variable: string, matches: string, fn: () => void): void;
