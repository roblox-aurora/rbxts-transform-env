import { $env, $NODE_ENV } from "../../..";

const test = $env.string("USERPROFILE");

$env.string("test", "withDefault");

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

if ($env.boolean("USERPROFILE")) {
	const seqAddr = $env.string("USERPROFILE");
}

const something = $NODE_ENV === "production" ? "yes":"no";