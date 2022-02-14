import ts, { transformNodes } from "typescript";
import { transformNode } from "../transform/transformNode";

export interface TransformerConfiguration {
	files?: string[];

	ifStatementMode: "block" | "inline" | "off";
	conditionalMode: "inline" | "off";
	defaultEnvironment: string;

	verbose?: boolean;
}

export class TransformerState {
	public constructor(
		public readonly program: ts.Program,
		public readonly context: ts.TransformationContext,
		public readonly config: TransformerConfiguration,
	) {}

	public transform<T extends ts.Node>(node: T): T {
		return ts.visitEachChild(node, (newNode) => transformNode(this, newNode), this.context);
	}
}
