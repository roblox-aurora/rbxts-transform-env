import ts, { factory } from "typescript";
import { MacroIdentifier } from ".";

export function shorthandIfEnv(node: ts.IfStatement): ts.Statement | undefined {
	const { expression, thenStatement, elseStatement } = node;
	if (ts.isBinaryExpression(expression)) {
		const { left, right } = expression;

		if (
			ts.isCallExpression(left) &&
			ts.isIdentifier(left.expression) &&
			left.expression.text === MacroIdentifier.Env
		) {
			const {
				arguments: [envVar, defaultValue],
			} = left;

			if (ts.isStringLiteral(envVar)) {
				const valueOf =
					process.env[envVar.text] ?? (ts.isStringLiteral(defaultValue) ? defaultValue.text : undefined);
				if (ts.isStringLiteral(right)) {
					if (valueOf === right.text) {
						return thenStatement;
					} else {
						return elseStatement;
					}
				}
			}
		}
	}

	return node;
}
