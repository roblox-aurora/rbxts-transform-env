import ts, { factory } from "typescript";
import { TransformState } from "../../class/transformState";
import { transformNode } from "../transformNode";

export function transformBinaryExpression(state: TransformState, node: ts.BinaryExpression): ts.Expression {
	if (state.config.shortCircuitNodeEnv) {
		const nodeEnvConstant = state.symbolProvider.moduleFile?.nodeEnvConstant;

		const leftSymbol = state.getSymbol(node.left);
		const rightSymbol = state.getSymbol(node.right);

		if (leftSymbol === nodeEnvConstant) {
			if (ts.isStringLiteral(node.right)) {
				return node.right.text === state.environmentProvider.nodeEnvironment
					? factory.createTrue()
					: factory.createFalse();
			}
		} else if (rightSymbol === nodeEnvConstant) {
			if (ts.isStringLiteral(node.left)) {
				return node.left.text === state.environmentProvider.nodeEnvironment
					? factory.createTrue()
					: factory.createFalse();
			}
		}
	}

	return ts.visitEachChild(node, (node) => transformNode(state, node), state.context);
}
