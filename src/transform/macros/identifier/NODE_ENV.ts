import assert from "assert";
import ts, { factory, SyntaxKind } from "typescript";
import { TransformState } from "../../../class/transformState";
import { IdentifierMacro } from "../macro";

export const NodeEnvMacro: IdentifierMacro = {
	getSymbol(state: TransformState) {
		const envSymbol = state.symbolProvider.moduleFile?.nodeEnvConstant;
		assert(envSymbol, "Could not find env macro symbol");
		return envSymbol;
	},
	transform(state: TransformState, node: ts.Identifier) {
		if (ts.isImportSpecifier(node.parent)) {
			return node;
		}

		return factory.createAsExpression(
			factory.createStringLiteral(state.environmentProvider.nodeEnvironment),
			factory.createTypeReferenceNode("string"),
		);
	},
};
