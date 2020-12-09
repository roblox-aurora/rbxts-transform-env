import { env } from "rbxts-transform-env";

export function makeHello(name: string) {
    return env("HELLO");
}

// const test2 = env<number>("TEST", 20)
// const test3 = env<boolean>("TEST2", false);
// const test4 = env("TEST");

// print(test2, test3, test4);

export const test5 = env("TEST");
