import ts, { factory } from "typescript";
import { CALL_MACROS } from "../transform/macros/call";
import { CallMacro, PropertyMacro } from "../transform/macros/macro";
import { PROPERTY_MACROS } from "../transform/macros/property";
import { EnvironmentProvider } from "./environmentProvider";
import { SymbolProvider } from "./symbolProvider";

export interface TransformConfiguration {
	verbose?: boolean;
}

export class TransformState {
	private isMacrosSetup = false;
	private callMacros = new Map<ts.Symbol, CallMacro>();
	private propertyMacros = new Map<ts.Symbol, PropertyMacro>();

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
	) {
		this.typeChecker = program.getTypeChecker();
		this.symbolProvider = new SymbolProvider(this);
		this.environmentProvider = new EnvironmentProvider(this);
		this.initMacros();
	}

	private initMacros() {
		if (this.isMacrosSetup) return;
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

	private prereqStack = new Array<Array<ts.Statement>>();

	public capture<T>(cb: () => T): [T, ts.Statement[]] {
		this.prereqStack.push([]);
		const result = cb();
		return [result, this.prereqStack.pop()!];
	}

	public prereq(statement: ts.Statement): void {
		const stack = this.prereqStack[this.prereqStack.length - 1];
		if (stack) stack.push(statement);
	}

	public prereqList(statements: ts.Statement[]): void {
		const stack = this.prereqStack[this.prereqStack.length - 1];
		if (stack) stack.push(...statements);
	}

	public prereqDeclaration(id: string | ts.Identifier, value: ts.Expression): void {
		this.prereq(
			factory.createVariableStatement(
				undefined,
				factory.createVariableDeclarationList(
					[factory.createVariableDeclaration(id, undefined, undefined, value)],
					ts.NodeFlags.Const,
				),
			),
		);
	}
}
