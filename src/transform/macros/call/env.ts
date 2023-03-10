import assert from "assert";
import ts, { factory } from "typescript";
import { TransformState } from "../../../class/transformState";
import { toExpression } from "../../../util/toAst";
import { CallMacro } from "../macro";

export function getEnvDefaultValue(expression: ts.CallExpression): ts.Expression | undefined {
	const [, defaultArgument] = expression.arguments;
	if (
		defaultArgument !== undefined &&
		(ts.isStringLiteral(defaultArgument) || ts.isNumericLiteral(defaultArgument))
	) {
		return factory.createStringLiteral(defaultArgument.text);
	} else if (defaultArgument !== undefined && ts.isTemplateLiteral(defaultArgument)) {
		return defaultArgument;
	}
}

export function isUnsafeToPrint(variable: string): boolean {
	const valueLower = variable.toLowerCase();
	return (
		valueLower.includes("token") ||
		valueLower.includes("secret") ||
		valueLower.includes("api") ||
		valueLower.includes("key")
	);
}

export const EnvCallAsStringMacro: CallMacro = {
	getSymbol(state: TransformState) {
		const envSymbol = state.symbolProvider.moduleFile?.envNamespace;
		assert(envSymbol, "Could not find env macro symbol");
		return [envSymbol.get("string"), envSymbol.get("expectString")];
	},
	transform(state: TransformState, callExpression: ts.CallExpression) {
		const environment = state.environmentProvider;
		const [variableArg, variableDefault] = callExpression.arguments;
		const printer = ts.createPrinter({});

		if (ts.isStringLiteral(variableArg)) {
			const variableName = variableArg.text;
			const variableValue = environment.get(variableName);

			const expression =
				(variableValue !== undefined ? toExpression(variableValue) : getEnvDefaultValue(callExpression)) ??
				factory.createIdentifier("undefined");

			if (state.config.verbose) {
				state.logger.infoIfVerbose(
					`Transform variable ${variableName} to ${
						isUnsafeToPrint(variableName)
							? "***"
							: printer.printNode(ts.EmitHint.Expression, expression, callExpression.getSourceFile())
					}`,
				);
				console.log("\t", callExpression.getSourceFile().fileName);
			}
			// console.log(variableName, ts.SyntaxKind[expression.kind]);

			if (ts.isIfStatement(callExpression.parent) || ts.isBinaryExpression(callExpression.parent)) {
				const prereqId = factory.createUniqueName(variableName);
				state.prereqDeclaration(
					prereqId,
					expression,
					variableDefault === undefined
						? factory.createUnionTypeNode([
								factory.createTypeReferenceNode("string"),
								factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
						  ])
						: factory.createTypeReferenceNode("string"),
				);
				return prereqId;
			} else if (ts.isVariableDeclaration(callExpression.parent)) {
				if (variableDefault === undefined) {
					return factory.createAsExpression(
						expression,
						factory.createUnionTypeNode([
							factory.createTypeReferenceNode("string"),
							factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
						]),
					);
				} else {
					return factory.createAsExpression(expression, factory.createTypeReferenceNode("string"));
				}
			}

			if (expression !== undefined) {
				return expression;
			}
		}

		throw `Not supported: ${callExpression.getText()} - should use string literal`;
	},
};
