import ts, { factory } from "typescript";
import dotenv from "dotenv";
import path from "path";

function visitNodeAndChildren(
	node: ts.SourceFile,
	program: ts.Program,
	context: ts.TransformationContext,
): ts.SourceFile;
function visitNodeAndChildren(
	node: ts.Node,
	program: ts.Program,
	context: ts.TransformationContext,
): ts.Node | undefined;
function visitNodeAndChildren(
	node: ts.Node,
	program: ts.Program,
	context: ts.TransformationContext,
): ts.Node | undefined {
	return ts.visitEachChild(
		visitNode(node, program),
		(childNode) => visitNodeAndChildren(childNode, program, context),
		context,
	);
}

function transformLiteral(call: ts.CallExpression, name: string, elseExpression?: ts.Expression) {
	const {typeArguments} = call;
	const value = process.env[name];

	// has type arguments? 
	if (typeArguments) {
		const [litType] = typeArguments;
		if (litType.kind === ts.SyntaxKind.StringKeyword) {
			if (elseExpression && ts.isStringLiteral(elseExpression)) {
				return factory.createStringLiteral(value ?? elseExpression.text);
			} else if (value) {
				return factory.createStringLiteral(value);
			}
		} else if (litType.kind === ts.SyntaxKind.NumberKeyword) {
			if (elseExpression && ts.isNumericLiteral(elseExpression)) {
				return factory.createNumericLiteral(value ?? elseExpression.text);
			} else if (value) {
				return factory.createNumericLiteral(value);
			}
		}
	}

	return factory.createIdentifier("undefined");
}

function visitNode(node: ts.SourceFile, program: ts.Program): ts.SourceFile;
function visitNode(node: ts.Node, program: ts.Program): ts.Node | undefined;
function visitNode(node: ts.Node, program: ts.Program): ts.Node | undefined {
	if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "env") {
		const [arg, orElse] = node.arguments;
		if (ts.isStringLiteral(arg)) {
			return transformLiteral(node, arg.text, orElse);
		}
	}

    return node;
}

export default function transform(program: ts.Program, args: {files?: string[]}) {
	// load any .env files
	dotenv.config();

	// Load user custom config paths (if user specifies)
	const {files} = args;
	if (files !== undefined) {
		for (const filePath of files) {
			dotenv.config({path: path.resolve(filePath)})
		}
	}

	return (context: ts.TransformationContext) => (file: ts.SourceFile) => visitNodeAndChildren(file, program, context);
}
