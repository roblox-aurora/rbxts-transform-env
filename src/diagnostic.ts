import ts from "byots";
import { EOL } from "os";

function createFormatDiagnosticsHost(): ts.FormatDiagnosticsHost {
	return {
		getCurrentDirectory: () => process.cwd(),
		getCanonicalFileName: (fileName) => fileName,
		getNewLine: () => EOL,
	};
}

function formatDiagnostics(diagnostics: ReadonlyArray<ts.Diagnostic>) {
	return ts.formatDiagnosticsWithColorAndContext(diagnostics, createFormatDiagnosticsHost());
}

function createDiagnostic(
	messageText: string,
	category: ts.DiagnosticCategory = ts.DiagnosticCategory.Warning,
	node?: ts.Node,
): ts.Diagnostic {
	return {
		category,
		code: (" rbxts-transform-env" as unknown) as number,
		file: node?.getSourceFile(),
		messageText,
		start: node?.getStart(),
		length: node?.getEnd(),
	};
}

function warn(message: string, node?: ts.Node): void {
	console.log(formatDiagnostics([createDiagnostic(message, ts.DiagnosticCategory.Warning, node)]));
}

export default warn;
