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
export function $env<T extends number>(variable: string, defaultValue: T): number;
export function $env<T extends boolean>(variable: string): T | undefined;
export function $env<T extends boolean>(variable: string, defaultValue: T): boolean;

/**
 * Macro for rendering a block of code if the variable matches the specified value
 * @param envVar The environment variable
 * @param matches The value(s) to match
 * @param runMatched The function containing the code to render
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
export function $ifEnv(envVar: string, matches: string, runMatched: () => void): void;
export function $ifEnv(envVar: string, matches: readonly string[], runMatched: (matched: string) => void): void;

/**
 * Returns the `NODE_ENV` variable
 */
export const $NODE_ENV: string;
