import { CallMacro } from "../macro";
import { EnvCallAsStringMacro } from "./env";
import { EnvCallAsBooleanMacro } from "./envBoolean";
import { EnvCallAsNumberMacro } from "./envNumber";

export const CALL_MACROS = new Array<CallMacro>(EnvCallAsNumberMacro, EnvCallAsStringMacro, EnvCallAsBooleanMacro);
