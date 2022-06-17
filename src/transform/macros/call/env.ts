import assert from "assert";
import ts, { factory } from "typescript";
import { TransformState } from "../../../class/transformState";
import { toExpression } from "../../../util/toAst";
import { CallMacro } from "../macro";

export function getEnvDefaultValue(expression: ts.CallExpression): string | undefined {
	const [, defaultArgument] = expression.arguments;
	if (
		defaultArgument !== undefined &&
		(ts.isStringLiteral(defaultArgument) || ts.isNumericLiteral(defaultArgument))
	) {
		return defaultArgument.text;
	}
}

export const EnvCallAsStringMacro: CallMacro = {
	getSymbol(state: TransformState) {
		const envSymbol = state.symbolProvider.moduleFile?.get("$env");
		assert(envSymbol, "Could not find env macro symbol");

		const type = state.typeChecker.getDeclaredTypeOfSymbol(envSymbol);

		const numberConvertSymbol = type.getProperty("string");
		assert(numberConvertSymbol);

		return numberConvertSymbol;
	},
	transform(state: TransformState, callExpression: ts.CallExpression) {
		const environment = state.environmentProvider;
		const [variableArg] = callExpression.arguments;

		if (ts.isStringLiteral(variableArg)) {
			const variableName = variableArg.text;
			const variableValue = environment.get(variableName);

			const expression = toExpression(variableValue ?? getEnvDefaultValue(callExpression));

			if (ts.isIfStatement(callExpression.parent) || ts.isBinaryExpression(callExpression.parent)) {
				const prereqId = factory.createUniqueName(variableName);
				state.prereqDeclaration(
					prereqId,
					expression ?? factory.createIdentifier("undefined"),
					factory.createUnionTypeNode([
						factory.createTypeReferenceNode("string"),
						factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
					]),
				);
				return prereqId;
			}

			if (expression !== undefined) {
				return expression;
			}
		}

		throw `Not supported: ${callExpression.getText()} - should use string literal`;
	},
};

export const EnvCallMacro: CallMacro = {
	getSymbol(state: TransformState) {
		const symbol = state.symbolProvider.moduleFile?.get("$env");
		assert(symbol, "Could not find debug macro symbol");
		return symbol;
	},
	transform(state: TransformState, callExpression: ts.CallExpression) {
		const environment = state.environmentProvider;
		const [variableArg] = callExpression.arguments;

		if (ts.isStringLiteral(variableArg)) {
			const variableName = variableArg.text;
			const variableValue = environment.get(variableName);

			const expression = toExpression(variableValue ?? getEnvDefaultValue(callExpression));

			if (expression !== undefined) {
				return expression;
			}
		}

		throw `Not supported: ${callExpression.getText()} - should use string literal`;
	},
};
