import ts from "typescript";
import { TransformState } from "../../class/transformState";
import { transformNode } from "../transformNode";

export function transformIdentifier(state: TransformState, node: ts.Identifier): ts.Expression {
	const symbol = state.getSymbol(node);
	if (symbol !== undefined) {
		const macro = state.identifierMacros.get(symbol);
		if (macro) {
			return macro.transform(state, node, { symbol, symbols: [symbol] });
		}
	}

	return ts.visitEachChild(node, (node) => transformNode(state, node), state.context);
}
