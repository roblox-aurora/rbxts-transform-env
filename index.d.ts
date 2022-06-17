/**
 * Macro namespace for grabbing an environment variable
 */
export namespace $env {
	/**
	 * Attempts to fetch the given environment variable - if not set, it will be `undefined` or the default value if given.
	 * @param name The name of the variable
	 * @param defaultValue The default value to use if undefined
	 */
	export function string(name: string): string | undefined;
	export function string(name: string, defaultValue: string): string;

	/**
	 * Converts the given environment variable to a boolean - if not set will be `false`.
	 * @param name The environment variable to use
	 */
	export function boolean(name: string): boolean;

	/**
	 * Attempts to convert the given environment variable to a number - if not set, it will be `undefined` or the default value if given.
	 * @param name The name of the variable
	 * @param defaultValue The default value to use if undefined
	 */
	export function number(name: string): number | undefined;
	export function number(name: string, defaultValue: number): number;
}

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
// export function $ifEnv(envVar: string, matches: string, runMatched: () => void): void;
// export function $ifEnv(envVar: string, matches: readonly string[], runMatched: (matched: string) => void): void;

/**
 * Returns the `NODE_ENV` variable
 */
export const $NODE_ENV: string;
