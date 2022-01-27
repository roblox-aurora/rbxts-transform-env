import { $env, $ifEnv, $NODE_ENV } from "../../..";
// import {$dbg} from "rbxts-transform-debug";

export function makeHello(name: string) 
{
	if($NODE_ENV === "development") {
		print("in development");
	}
	return $NODE_ENV === "development" ? `Testing ${$NODE_ENV}, yes?` : "no";
}

const invalid = $env("NON_EXISTENT", 10);
const invalid2 = $env("SOME_BOOL", false);
const invalid3 = $env<boolean>("SOME_BOOL2", true);
const test = $env<number>("TEST3");

const test2 = $env<string>("TEST", "boss") === "hi there";
const lit = $env("Hi there");
const test3 = $env<"development" | "production">("NODE_ENV", "production")

if($env("NODE_ENV") === "development") {
	print("development!");
}

if ($NODE_ENV === "ddevelopment") {
	print("hi");
} else {
	print("not matching");
	print("Some more statement stuff here :-)");
}

if ($NODE_ENV === "development") {
	print("dev");
} else if ($NODE_ENV === "public-test") {
	print("public-test");
} else {
	print("prod");
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
