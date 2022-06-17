/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import ts from "typescript";
import { TransformConfiguration, TransformState } from "./class/transformState";
import { transformFile } from "./transform/transformFile";

const DEFAULTS: TransformConfiguration = {
	verbose: false,
};

export default function transform(program: ts.Program, userConfiguration: TransformConfiguration) {
	const printer = ts.createPrinter();

	userConfiguration = { ...DEFAULTS, ...userConfiguration };

	if (process.argv.includes("--verbose")) {
		userConfiguration.verbose = true;
	}

	return (context: ts.TransformationContext): ((file: ts.SourceFile) => ts.Node) => {
		const state = new TransformState(program, context, userConfiguration);

		return (file: ts.SourceFile) => {
			const label = `$env:${file.fileName}`;

			const result = transformFile(state, file);

			return result;
		};
	};
}
