import ts, { factory } from "typescript";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

let verboseLogging = false;

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

function log(message: string) {
	if (verboseLogging) {
		process.stdout.write(`[rbxts-transform-env] ${message}\n`);
	}
}


function transformLiteral(program: ts.Program, call: ts.CallExpression, name: string, elseExpression?: ts.Expression) {
	const {typeArguments} = call;
	const value = process.env[name];

	log("TransformLiteral " + name + ": " + value ?? "undefined")

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
		} else if (litType.kind === ts.SyntaxKind.BooleanKeyword) {
			if (value !== undefined) {
				return value ? factory.createTrue() : factory.createFalse();
			} else if (elseExpression && ts.isLiteralTypeNode(elseExpression)) {
				return factory.createFalse()
			}
		}
	} else {
		if (elseExpression && ts.isStringLiteral(elseExpression)) {
			return factory.createStringLiteral(value ?? elseExpression.text);
		} else if (value) {
			return factory.createStringLiteral(value);
		}
	}
	
	return factory.createIdentifier("undefined");
}

const sourceText = fs.readFileSync(path.join(__dirname, "..", 'index.d.ts'), 'utf8')
function isEnvModule(sourceFile: ts.SourceFile) {
	return sourceFile.text === sourceText;
}

function isEnvImportExpression(node: ts.Node, program: ts.Program) {
	if (!ts.isImportDeclaration(node)) {
		return false;
	}


	if (!node.importClause) {
		return false;
	}

	const namedBindings = node.importClause.namedBindings
	if (!node.importClause.name && !namedBindings) {
		return false;
	}

	const importSymbol = program.getTypeChecker().getSymbolAtLocation(node.moduleSpecifier)
	
	if (!importSymbol || !isEnvModule(importSymbol.valueDeclaration.getSourceFile())) {
		return false;
	}

	return true;
}

function visitNode(node: ts.SourceFile, program: ts.Program): ts.SourceFile;
function visitNode(node: ts.Node, program: ts.Program): ts.Node | undefined;
function visitNode(node: ts.Node, program: ts.Program): ts.Node | undefined {
	if (isEnvImportExpression(node, program)) {
		log("Erased import statement");
		return;
	}

	if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "env") {
		const [arg, orElse] = node.arguments;
		if (ts.isStringLiteral(arg)) {
			return transformLiteral(program, node, arg.text, orElse);
		}
	}

    return node;
}

interface TransformerConfiguration {
	files?: string[];
	verbose?: boolean;
}

export default function transform(program: ts.Program, configuration: TransformerConfiguration) {
	// Load user custom config paths (if user specifies)
	const {files, verbose} = configuration;
	// load any .env files
	dotenv.config();


	if (verbose !== undefined) {
		verboseLogging = verbose;
	}

	if (files !== undefined) {
		for (const filePath of files) {
			log("Loaded extra environment file: " + filePath);
			dotenv.config({path: path.resolve(filePath)})
		}
	}



	return (context: ts.TransformationContext) => (file: ts.SourceFile) => visitNodeAndChildren(file, program, context);
}
