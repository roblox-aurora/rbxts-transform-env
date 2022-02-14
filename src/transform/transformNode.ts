import ts from "typescript";
import { TransformerState } from "../class/transformerState";
import { transformExpression } from "./transformExpression";

export function transformNode(state: TransformerState, node: ts.Node): ts.Node | ts.Node[] {
	if (ts.isExpression(node)) {
		return transformExpression(state, node);
	}

	return ts.visitEachChild(node, (newNode) => transformNode(state, newNode), state.context);
}
