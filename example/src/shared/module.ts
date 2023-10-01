// @rbxts-transform-env debug:print_file
import { $env, $NODE_ENV } from "../../..";

export const NODE_ENV = $env.string("NODE_ENV", "development");
export const ANOTHER_VAR = $env.string("TEST2", "NOPE");
export const IS_DEV = NODE_ENV === "development";

if ($env.boolean("FALSY", true)) {
	const TEST_ENV = $env.number("TEST");
	const IS_TEST = TEST_ENV === 20;
}

if ($env.boolean("ANALYTICS_API_URL")) {
	const ANALYTICS_API_URL = $env.string("ANALYTICS_API_URL")!;
	const ANALYTICS_API_PORT = $env.number("ANALYTICS_API_PORT", 3000);
	const USE_HTTPS = $env.boolean("ANALYTICS_USE_HTTPS", true);

	const URI = `${USE_HTTPS ? "https" : "http"}://${ANALYTICS_API_URL}:${ANALYTICS_API_PORT}`;
	print("Our analytics URI is: ", URI);
}

export const DefaultValue = $env.number("DEFAULT_VALUE", 0.05);
export const DefaultString = $env.string("DEFAULT_STR");

// $env.expectString("TEST", "A 'TEST' variable is required in your environment.");

const test: number = DefaultValue;

$NODE_ENV;