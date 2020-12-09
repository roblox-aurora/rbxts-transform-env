import { env } from "../../..";
declare function env<T extends string | number | boolean = string>(name: string): T | undefined;
declare function env<T extends string | number | boolean = string>(name: string, defaultValue: T): T;

export function makeHello(name: string) {
	return env("HELLO");
}

const test = env<number>("TEST3");

const test2 = env<string>("TEST", "boss") === "hi there";