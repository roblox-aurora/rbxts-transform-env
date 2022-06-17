import assert from "assert";
import ts, { factory } from "typescript";
import { TransformState } from "../../../class/transformState";
import { toExpression } from "../../../util/toAst";
import { CallMacro } from "../macro";

export function getEnvDefaultValue(expression: ts.CallExpression): boolean | undefined {
	const [, defaultArgument] = expression.arguments;
	if (defaultArgument !== undefined && ts.isBooleanLiteral(defaultArgument)) {
		return defaultArgument.kind === ts.SyntaxKind.TrueKeyword;
	}
}

export const EnvCallAsBooleanMacro: CallMacro = {
	getSymbol(state: TransformState) {
		const envSymbol = state.symbolProvider.moduleFile?.get("$env");
		assert(envSymbol, "Could not find env macro symbol");

		const type = state.typeChecker.getDeclaredTypeOfSymbol(envSymbol);

		const numberConvertSymbol = type.getProperty("boolean");
		assert(numberConvertSymbol);

		return numberConvertSymbol;
	},
	transform(state: TransformState, callExpression: ts.CallExpression) {
		const environment = state.environmentProvider;
		const [variableArg] = callExpression.arguments;

		if (ts.isStringLiteral(variableArg)) {
			const variableName = variableArg.text;
			const variableValue = environment.parseAsBoolean(variableName);

			const value = variableValue ?? getEnvDefaultValue(callExpression);
			const expression = toExpression(value);

			if (expression !== undefined) {
				return expression;
			}
		}

		throw `Not supported: ${callExpression.getText()} - should use string literal`;
	},
};
