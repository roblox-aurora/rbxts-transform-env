import { env } from "rbxts-transform-env";

export function makeHello(name: string) {
    return env("HELLO");
}


