import assert from "assert";
import ts, { factory } from "typescript";
import { TransformState } from "../../../class/transformState";
import { toExpression } from "../../../util/toAst";
import { CallMacro } from "../macro";

export function getEnvDefaultValue(expression: ts.CallExpression): number | undefined {
	const [, defaultArgument] = expression.arguments;
	if (defaultArgument !== undefined && ts.isNumericLiteral(defaultArgument)) {
		return parseFloat(defaultArgument.text);
	}
}

export const EnvCallAsNumberMacro: CallMacro = {
	getSymbol(state: TransformState) {
		const envSymbol = state.symbolProvider.moduleFile?.get("$env");
		assert(envSymbol, "Could not find env macro symbol");

		const type = state.typeChecker.getDeclaredTypeOfSymbol(envSymbol);

		const numberConvertSymbol = type.getProperty("number");
		assert(numberConvertSymbol);

		return numberConvertSymbol;
	},
	transform(state: TransformState, callExpression: ts.CallExpression) {
		const environment = state.environmentProvider;
		const [variableArg] = callExpression.arguments;

		if (ts.isStringLiteral(variableArg)) {
			const variableName = variableArg.text;
			const variableValue = environment.getAsNumber(variableName);

			const expression = toExpression(variableValue ?? getEnvDefaultValue(callExpression));

			if (expression !== undefined) {
				return expression;
			}
		}

		throw `Not supported: ${callExpression.getText()} - should use string literal`;
	},
};
