import assert from "assert";
import ts from "typescript";
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
		const envSymbol = state.symbolProvider.moduleFile?.envNamespace;
		assert(envSymbol, "Could not find env macro symbol");
		return envSymbol.get("boolean");
	},
	transform(state: TransformState, callExpression: ts.CallExpression) {
		const environment = state.environmentProvider;
		const [variableArg] = callExpression.arguments;

		if (ts.isStringLiteral(variableArg)) {
			const variableName = variableArg.text;
			let variableValue = environment.parseAsBoolean(variableName);

			if (variableValue === undefined) {
				variableValue = getEnvDefaultValue(callExpression) ?? false;
			}

			const value = variableValue;
			const expression = toExpression(value);

			if (expression !== undefined) {
				return expression;
			}
		}

		throw `Not supported: ${callExpression.getText()} - should use string literal`;
	},
};
