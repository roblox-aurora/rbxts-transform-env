import { CallMacro } from "../macro";
import { EnvCallAsStringMacro, EnvCallMacro } from "./env";
import { EnvCallAsBooleanMacro } from "./envBoolean";
import { EnvCallAsNumberMacro } from "./envNumber";

export const CALL_MACROS = new Array<CallMacro>(
	EnvCallMacro,
	EnvCallAsNumberMacro,
	EnvCallAsStringMacro,
	EnvCallAsBooleanMacro,
);
