/* eslint-disable @typescript-eslint/no-non-null-assertion */
import ts, { factory, SyntaxKind } from "typescript";
import { TransformState } from "../class/transformState";
import { transformNode } from "./transformNode";

export function transformShortcutIfLiterals(state: TransformState, statement: ts.Statement): ts.Statement {
	if (ts.isIfStatement(statement)) {
		if (ts.isBooleanLiteral(statement.expression)) {
			switch (statement.expression.kind) {
				case SyntaxKind.TrueKeyword:
					statement = statement.thenStatement;
					break;
				case SyntaxKind.FalseKeyword:
					statement = statement.elseStatement ?? factory.createEmptyStatement();
					break;
			}
		}
	}

	return statement;
}

export function transformStatement(state: TransformState, statement: ts.Statement): ts.Statement {
	return transformShortcutIfLiterals(
		state,
		ts.visitEachChild(statement, (newNode) => transformNode(state, newNode), state.context),
	);
}
