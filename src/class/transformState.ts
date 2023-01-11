/* eslint-disable @typescript-eslint/no-non-null-assertion */
import ts, { factory } from "typescript";
import { CALL_MACROS } from "../transform/macros/call";
import { IDENTIFIER_MACROS } from "../transform/macros/identifier";
import { CallMacro, IdentifierMacro, PropertyMacro } from "../transform/macros/macro";
import { PROPERTY_MACROS } from "../transform/macros/property";
import { EnvironmentProvider } from "./environmentProvider";
import { LoggerProvider } from "./logProvider";
import { SymbolProvider } from "./symbolProvider";

type Handler = "warn" | "error" | "errorOnProduction";

export interface TransformConfiguration {
	verbose?: boolean;
	defaultEnvironment: string;
	shortCircuitNodeEnv: boolean;
	expectedVariables: Record<string, [Handler, string] | Handler> | undefined;
}

export class TransformState {
	private isMacrosSetup = false;

	public readonly callMacros = new Map<ts.Symbol, CallMacro>();
	public readonly propertyMacros = new Map<ts.Symbol, PropertyMacro>();
	public readonly identifierMacros = new Map<ts.Symbol, IdentifierMacro>();

	public readonly typeChecker: ts.TypeChecker;
	public readonly options = this.program.getCompilerOptions();
	public readonly srcDir = this.options.rootDir ?? this.program.getCurrentDirectory();
	public readonly baseDir = this.options.baseUrl ?? this.options.configFilePath ?? this.program.getCurrentDirectory();
	public readonly tsconfigFile = this.options.configFilePath ?? this.program.getCurrentDirectory();
	public readonly symbolProvider: SymbolProvider;
	public readonly environmentProvider: EnvironmentProvider;

	public constructor(
		public readonly program: ts.Program,
		public readonly context: ts.TransformationContext,
		public readonly config: TransformConfiguration,
		public readonly logger: LoggerProvider,
	) {
		this.typeChecker = program.getTypeChecker();
		this.symbolProvider = new SymbolProvider(this);
		this.environmentProvider = new EnvironmentProvider(this);
		this.initMacros();
	}

	private initMacros() {
		if (this.isMacrosSetup) return;
		if (!this.symbolProvider.moduleFile) return; // skip over not being used
		this.isMacrosSetup = true;

		for (const macro of CALL_MACROS) {
			const symbols = macro.getSymbol(this);
			if (Array.isArray(symbols)) {
				for (const symbol of symbols) {
					this.callMacros.set(symbol, macro);
				}
			} else {
				this.callMacros.set(symbols, macro);
			}
		}

		for (const macro of PROPERTY_MACROS) {
			const symbols = macro.getSymbol(this);
			if (Array.isArray(symbols)) {
				for (const symbol of symbols) {
					this.propertyMacros.set(symbol, macro);
				}
			} else {
				this.propertyMacros.set(symbols, macro);
			}
		}

		for (const macro of IDENTIFIER_MACROS) {
			const symbols = macro.getSymbol(this);
			if (Array.isArray(symbols)) {
				for (const symbol of symbols) {
					this.identifierMacros.set(symbol, macro);
				}
			} else {
				this.identifierMacros.set(symbols, macro);
			}
		}
	}

	public getCallMacro(symbol: ts.Symbol): CallMacro | undefined {
		return this.callMacros.get(symbol);
	}

	public getPropertyMacro(symbol: ts.Symbol): PropertyMacro | undefined {
		return this.propertyMacros.get(symbol);
	}

	public getSymbol(node: ts.Node, followAlias = true): ts.Symbol | undefined {
		const symbol = this.typeChecker.getSymbolAtLocation(node);

		if (symbol && followAlias) {
			return ts.skipAlias(symbol, this.typeChecker);
		} else {
			return symbol;
		}
	}

	private prereqId = new Map<string, ts.Identifier>();
	private prereqStack = new Array<Array<ts.Statement>>();

	public capture<T>(cb: () => T): [T, ts.Statement[]] {
		this.prereqStack.push([]);
		const result = cb();

		const lastStack = this.prereqStack.pop()!;

		if (this.prereqStack.length === 0) {
			this.prereqId.clear();
		}

		return [result, lastStack];
	}

	public prereq(statement: ts.Statement): void {
		const stack = this.prereqStack[this.prereqStack.length - 1];
		if (stack) stack.push(statement);
	}

	public prereqList(statements: ts.Statement[]): void {
		const stack = this.prereqStack[this.prereqStack.length - 1];
		if (stack) stack.push(...statements);
	}

	public prereqDeclaration(id: string | ts.Identifier, value: ts.Expression, type?: ts.TypeNode): void {
		this.prereq(
			factory.createVariableStatement(
				undefined,
				factory.createVariableDeclarationList(
					[factory.createVariableDeclaration(id, undefined, type, value)],
					ts.NodeFlags.Let,
				),
			),
		);
	}
}
