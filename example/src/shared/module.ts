import { env, ifEnv } from "../../..";
// declare function env<T extends string = string>(name: string): T | undefined;
// declare function env<T extends string = string>(name: string, defaultValue: T): T;
// declare function env<T extends number>(name: string): T | undefined;
// declare function env<T extends number>(name: string, defaultValue: T): T;
// declare function env<T extends boolean>(name: string): T | undefined;
// declare function env<T extends boolean>(name: string, defaultValue: T): T;
// declare function ifEnv(name: string, matches: string, fn: () => void): void;


export function makeHello(name: string) {
	return env("HELLO");
}

const test = env<number>("TEST3");

const test2 = env<string>("TEST", "boss") === "hi there";
const test3 = env<"development" | "production">("NODE_ENV", "production")

print("test");

ifEnv("NODE_ENV", "development", function() {
	print("Hi!");
})

ifEnv("NODE_ENV", "development", () => {
	print("hi there!");
})