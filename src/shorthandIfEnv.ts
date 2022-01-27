import ts, { Expression, factory } from "typescript";
import { MacroIdentifier, TransformerConfiguration } from ".";

export function shorthandConditionalIfEnv(
	node: ts.ConditionalExpression,
	config: TransformerConfiguration,
): Expression {
	const { condition, whenTrue, whenFalse } = node;

	if (ts.isBinaryExpression(condition)) {
		const { left, operatorToken, right } = condition;

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
				let condition = false;

				if (operatorToken.kind === ts.SyntaxKind.ExclamationEqualsEqualsToken) {
					condition = valueOf !== right.text;
				} else if (operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken) {
					condition = valueOf === right.text;
				}

				if (condition) {
					return whenTrue;
				} else {
					return whenFalse;
				}
			}
		}
	}

	return node;
}

export function shorthandIfEnv(
	node: ts.IfStatement,
	config: TransformerConfiguration,
): ts.Statement | ts.Statement[] | undefined {
	const { expression, thenStatement, elseStatement } = node;
	if (ts.isBinaryExpression(expression)) {
		const { left, operatorToken, right } = expression;

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
						if (ts.isBlock(thenStatement) && config.ifStatementMode === "inline") {
							return [...thenStatement.statements];
						}

						return thenStatement;
					} else if (elseStatement) {
						if (ts.isBlock(elseStatement) && config.ifStatementMode === "inline") {
							return [...elseStatement.statements];
						} else if (ts.isIfStatement(elseStatement)) {
							return shorthandIfEnv(elseStatement, config);
						} else {
							return elseStatement;
						}
					} else {
						return factory.createEmptyStatement();
					}
				}
			}
		} else if (ts.isIdentifier(left) && left.text === MacroIdentifier.NodeEnv) {
			if (ts.isStringLiteral(right)) {
				const valueOf = process.env["NODE_ENV"] ?? config.defaultEnvironment;

				let condition = false;
				if (operatorToken.kind === ts.SyntaxKind.ExclamationEqualsEqualsToken) {
					condition = valueOf !== right.text;
				} else if (operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken) {
					condition = valueOf === right.text;
				}

				if (condition) {
					if (ts.isBlock(thenStatement) && config.ifStatementMode === "inline") {
						return [...thenStatement.statements];
					}

					return thenStatement;
				} else if (elseStatement) {
					if (ts.isBlock(elseStatement) && config.ifStatementMode === "inline") {
						return [...elseStatement.statements];
					} else if (ts.isIfStatement(elseStatement)) {
						return shorthandIfEnv(elseStatement, config);
					} else {
						return elseStatement;
					}
				} else {
					return factory.createEmptyStatement();
				}
			}
		}
	}

	return node;
}
