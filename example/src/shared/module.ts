import { $env } from "../../..";

$env("NODE_ENV");

const test = $env.string("POOP");

function testing() {
	if ($env.boolean("USERPROFILE")) {
		print("hi there??");
	} else {
		print("bye there");
	}
	
}

if ($env.boolean("USERPROFILE")) {}