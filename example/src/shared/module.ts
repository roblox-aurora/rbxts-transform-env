import { $env, $NODE_ENV } from "../../..";

export const NODE_ENV = $env.string("NODE_ENV", "development");
export const IS_DEV = NODE_ENV === "development";

if ($env.boolean("TEST")) {
	const TEST_ENV = $env.number("TEST");
	const IS_TEST = TEST_ENV === 20;
}