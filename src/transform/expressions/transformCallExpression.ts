import ts from "typescript";
import { TransformerState } from "../../class/transformerState";

export function transformCallExpression(state: TransformerState, node: ts.CallExpression): ts.Expression {
	return node;
}
