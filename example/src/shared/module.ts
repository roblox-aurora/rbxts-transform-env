import { env } from "@rbxts/transform-types-env";

export function makeHello(name: string) {
    return env("HELLO");
}