import ts from "typescript";
import { TransformerState } from "../class/transformerState";
import { transformCallExpression } from "./expressions/transformCallExpression";
import { transformNode } from "./transformNode";

const EXPRESSION_TRANSFORMERS = new Map<ts.SyntaxKind, (state: TransformerState, node: any) => ts.Expression>([
	[ts.SyntaxKind.CallExpression, transformCallExpression],
]);

export function transformExpression(state: TransformerState, node: ts.Expression): ts.Expression | ts.Expression[] {
	const transformer = EXPRESSION_TRANSFORMERS.get(node.kind);
	if (transformer) {
		return transformer(state, node);
	}

	return ts.visitEachChild(node, (newNode) => transformNode(state, newNode), state.context);
}
