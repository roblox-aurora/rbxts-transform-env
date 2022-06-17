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
		const envSymbol = state.symbolProvider.moduleFile?.envNamespace;
		assert(envSymbol, "Could not find env macro symbol");
		return envSymbol.get("string");
	},
	transform(state: TransformState, callExpression: ts.CallExpression) {
		const environment = state.environmentProvider;
		const [variableArg] = callExpression.arguments;

		if (ts.isStringLiteral(variableArg)) {
			const variableName = variableArg.text;
			const variableValue = environment.get(variableName);

			const expression =
				toExpression(variableValue ?? getEnvDefaultValue(callExpression)) ??
				factory.createIdentifier("undefined");

			if (ts.isIfStatement(callExpression.parent) || ts.isBinaryExpression(callExpression.parent)) {
				const prereqId = factory.createUniqueName(variableName);
				state.prereqDeclaration(
					prereqId,
					expression,
					factory.createUnionTypeNode([
						factory.createTypeReferenceNode("string"),
						factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
					]),
				);
				return prereqId;
			} else if (ts.isVariableDeclaration(callExpression.parent)) {
				return factory.createAsExpression(
					expression,
					factory.createUnionTypeNode([
						factory.createTypeReferenceNode("string"),
						factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
					]),
				);
			}

			if (expression !== undefined) {
				return expression;
			}
		}

		throw `Not supported: ${callExpression.getText()} - should use string literal`;
	},
};
