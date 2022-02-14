import ts from "typescript";
import { TransformerState } from "../class/transformerState";
import { transformNode } from "./transformNode";

const STATEMENT_TRANSFORMERS = new Map<ts.SyntaxKind, (state: TransformerState, node: any) => ts.Statement>([]);

export function transformExpression(state: TransformerState, node: ts.Statement): ts.Statement | ts.Statement[] {
	const transformer = STATEMENT_TRANSFORMERS.get(node.kind);
	if (transformer) {
		return transformer(state, node);
	}

	return ts.visitEachChild(node, (newNode) => transformNode(state, newNode), state.context);
}
