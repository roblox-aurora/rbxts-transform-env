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
	const printer = ts.createPrinter();

	userConfiguration = { ...DEFAULTS, ...userConfiguration };

	if (process.argv.includes("--verbose")) {
		userConfiguration.verbose = true;
	}

	const SHOULD_DEBUG_PROFILE = process.env.DEBUG_PROFILE;
	const SHOULD_DEBUG_EMIT = process.env.DEBUG_OUTPUT;

	return (context: ts.TransformationContext): ((file: ts.SourceFile) => ts.Node) => {
		const logger = new LoggerProvider(
			SHOULD_DEBUG_PROFILE !== undefined || userConfiguration.verbose!,
			userConfiguration.verbose!,
		);

		if (logger.verbose) {
			logger.write("\n");
		}

		const state = new TransformState(program, context, userConfiguration, logger);

		return (file: ts.SourceFile) => {
			const label = `$env:${file.fileName}`;

			if (SHOULD_DEBUG_PROFILE !== undefined) {
				console.count("$env:transformations");
				console.time(label);
			}

			const result = transformFile(state, file);

			if (SHOULD_DEBUG_PROFILE !== undefined) console.timeEnd(label);

			if (SHOULD_DEBUG_EMIT !== undefined) {
				fs.writeFileSync(file.fileName.replace(/\.(ts)$/gm, ".ts-output"), printer.printFile(result));
			}

			return result;
		};
	};
}
