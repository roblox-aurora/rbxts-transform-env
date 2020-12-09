import { env } from "rbxts-transform-env";

export function makeHello(name: string) {
    return env("HELLO");
}

const test2 = env<number>("TEST", 20)
const test3 = env("TEST2");

if (test2 === 20) {
    print("20!!");
}