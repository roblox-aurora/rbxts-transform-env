/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import ts from "typescript";
import { TransformConfiguration, TransformState } from "./class/transformState";
import { transformFile } from "./transform/transformFile";
import { LoggerProvider } from "./class/logProvider";
import { EnvironmentProvider } from "./class/environmentProvider";

const DEFAULTS: TransformConfiguration = {
	verbose: false,
	defaultEnvironment: "production",
	shortCircuitNodeEnv: true,
	expectedVariables: undefined,
};

export default function transform(program: ts.Program, userConfiguration: TransformConfiguration) {
	userConfiguration = { ...DEFAULTS, ...userConfiguration };
	const isProduction = (process.env.NODE_ENV ?? userConfiguration.defaultEnvironment) === "production";

	if (process.argv.includes("--verbose")) {
		userConfiguration.verbose = true;
	}

	const logger = new LoggerProvider(userConfiguration.verbose!, userConfiguration.verbose!);

	if (logger.verbose) {
		logger.write("\n");
	}
	logger.infoIfVerbose("Loaded environment transformer");
	let performedVariableCheck = false;

	return (context: ts.TransformationContext): ((file: ts.SourceFile) => ts.Node) => {
		const state = new TransformState(program, context, userConfiguration, logger);

		if (state.symbolProvider.moduleFile === undefined) {
			return file => file;
		}

		if (userConfiguration.expectedVariables && !performedVariableCheck) {
			let hasDiagnostic = false;

			for (const [variable, variableRequireConfig] of Object.entries(userConfiguration.expectedVariables)) {
				const hasVariable = state.environmentProvider.has(variable);
				if (!hasVariable) {
					if (typeof variableRequireConfig === "string") {
						if (
							variableRequireConfig === "error" ||
							(isProduction && variableRequireConfig === "errorOnProduction")
						) {
							logger.error(`Expected enviroment variable: '${variable}'`);
							hasDiagnostic = true;
						} else if (variableRequireConfig === "warn") {
							logger.warnIfVerbose(`Missing environment variable '${variable}'`);
						}
					} else {
						const [handler, message] = variableRequireConfig;
						if (handler === "error" || (isProduction && handler === "errorOnProduction")) {
							logger.error(message);
							hasDiagnostic = true;
						} else if (handler === "warn") {
							logger.warnIfVerbose(message);
						}
					}
				}
			}

			if (hasDiagnostic) {
				throw new Error(`Required environment variable(s) have not been configured - see above`);
			}

			performedVariableCheck = true;
		}

		return (file: ts.SourceFile) => {
			let printFile = false;

			const leading = ts.getLeadingCommentRanges(file.getFullText(), 0);
			if (leading) {
				const metaComment = "// @rbxts-transform-env";

				const srcFileText = file.getFullText();
				for (const leadingComment of leading) {
					const comment = srcFileText.substring(leadingComment.pos, leadingComment.end);
					if (comment.startsWith(metaComment)) {
						const metaTags = comment.substring(metaComment.length + 1).split(" ");
						if (metaTags.includes("debug:print_file")) {
							printFile = true;
						}
						break;
					}
				}
			}

			const result = transformFile(state, file);

			if (printFile) {
				const printer = ts.createPrinter({});
				console.log(printer.printFile(result));
			}

			return result;
		};
	};
}
