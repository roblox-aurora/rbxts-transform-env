import { env } from "@rbxts/transform-types-env";

export function makeHello(name: string) {
    return env("HELLO");
}

const test2 = env("TEST")
const test3 = env("TEST2");