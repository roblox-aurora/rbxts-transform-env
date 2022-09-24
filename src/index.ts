/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import ts from "typescript";
import { TransformConfiguration, TransformState } from "./class/transformState";
import { transformFile } from "./transform/transformFile";
import fs from "fs";
import { LoggerProvider } from "./class/logProvider";

const DEFAULTS: TransformConfiguration = {
	verbose: false,
	defaultEnvironment: "production",
	shortCircuitNodeEnv: true,
};

export default function transform(program: ts.Program, userConfiguration: TransformConfiguration) {
	userConfiguration = { ...DEFAULTS, ...userConfiguration };

	if (process.argv.includes("--verbose")) {
		userConfiguration.verbose = true;
	}

	const logger = new LoggerProvider(userConfiguration.verbose!, userConfiguration.verbose!);

	if (logger.verbose) {
		logger.write("\n");
	}
	logger.infoIfVerbose("Loaded environment transformer");
	return (context: ts.TransformationContext): ((file: ts.SourceFile) => ts.Node) => {
		const state = new TransformState(program, context, userConfiguration, logger);

		if (state.symbolProvider.moduleFile === undefined) {
			return (file) => file;
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
