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

		return (file: ts.SourceFile) => {
			const result = transformFile(state, file);
			return result;
		};
	};
}
