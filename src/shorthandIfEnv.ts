import ts, { factory } from "typescript";
import { MacroIdentifier, TransformerConfiguration } from ".";

export function shorthandConditionalIfEnv(node: ts.ConditionalExpression, config: TransformerConfiguration) {
	const { condition, whenTrue, whenFalse } = node;

	if (ts.isBinaryExpression(condition)) {
		const { left, right } = condition;

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
					process.env[envVar.text] ??
					(defaultValue !== undefined && ts.isStringLiteral(defaultValue)
						? defaultValue.text
						: config.defaultEnvironment);
				if (ts.isStringLiteral(right)) {
					if (valueOf === right.text) {
						return whenTrue;
					} else {
						return whenFalse;
					}
				}
			}
		} else if (ts.isIdentifier(left) && left.text === MacroIdentifier.NodeEnv) {
			if (ts.isStringLiteral(right)) {
				const valueOf = process.env["NODE_ENV"] ?? config.defaultEnvironment;
				if (valueOf === right.text) {
					return whenTrue;
				} else {
					return whenFalse;
				}
			}
		}
	}

	return node;
}

export function shorthandIfEnv(node: ts.IfStatement, config: TransformerConfiguration): ts.Statement | undefined {
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
					process.env[envVar.text] ??
					(defaultValue !== undefined && ts.isStringLiteral(defaultValue)
						? defaultValue.text
						: config.defaultEnvironment);
				if (ts.isStringLiteral(right)) {
					if (valueOf === right.text) {
						return thenStatement;
					} else {
						return elseStatement;
					}
				}
			}
		} else if (ts.isIdentifier(left) && left.text === MacroIdentifier.NodeEnv) {
			if (ts.isStringLiteral(right)) {
				const valueOf = process.env["NODE_ENV"] ?? config.defaultEnvironment;
				if (valueOf === right.text) {
					return thenStatement;
				} else {
					return elseStatement;
				}
			}
		}
	}

	return node;
}
