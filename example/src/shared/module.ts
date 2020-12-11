import { $env, $ifEnv } from "../../..";


export function makeHello(name: string) {
	return $env("HELLO");
}

const test = $env<number>("TEST3");

const test2 = $env<string>("TEST", "boss") === "hi there";
const test3 = $env<"development" | "production">("NODE_ENV", "production")

print("test");

$ifEnv("NODE_ENV", "development", function() {
	print("Hi!");
})