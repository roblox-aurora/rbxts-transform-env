import { $env, $NODE_ENV } from "../../..";

$env("NODE_ENV");

const test = $env.string("POOP");

function testing() {
	if ($env.boolean("USERPROFILE")) {
		print("hi there??");
	} else {
		print("bye there");
	}
	
}

$NODE_ENV;
if ($NODE_ENV === "production") {}
if ("public-test" === $NODE_ENV) {}

if ($env.string("NODE_ENV") === "right") {}
if ($env.string("NODE_ENV2")) {}

const something = $NODE_ENV === "production" ? "yes":"no";