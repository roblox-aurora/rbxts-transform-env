import { $env, $ifEnv, $NODE_ENV } from "../../..";
// import {$dbg} from "rbxts-transform-debug";

export function makeHello(name: string) {
	return $NODE_ENV === "development" ? `Testing ${$NODE_ENV}, yes?` : "no";
}

const test = $env<number>("TEST3");

const test2 = $env<string>("TEST", "boss") === "hi there";
const test3 = $env<"development" | "production">("NODE_ENV", "production")

if ($env<string>("NODE_ENV", "development") === "development") {
	print("hi");
} else {
	print("not matching");
}

if ($NODE_ENV === "development") {
	print("hi NODE_ENV");
}

print("test");

$ifEnv("NODE_ENV", ["development"], (value) => { print(value) });
$ifEnv("NODE_ENV", "development", function() {
	print("Hi!");
	// $dbg("Test");
})

$ifEnv("NODE_ENV", "blah", () => {})
