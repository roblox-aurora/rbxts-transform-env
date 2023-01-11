/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TransformState } from "./transformState";
import dotenv from "dotenv";

export class EnvironmentProvider {
	public readonly nodeEnvironment: string;
	private variables = new Map<string, string>();

	public constructor(private state: TransformState) {
		const variables = dotenv.config();
		this.nodeEnvironment = process.env.NODE_ENV ?? state.config.defaultEnvironment;

		if (variables) {
			for (const [name, value] of Object.entries(process.env)) {
				this.variables.set(name, value!);
			}
		}

		if (!this.variables.has("NODE_ENV")) {
			this.variables.set("NODE_ENV", this.nodeEnvironment);
		}

		const varCount = this.variables.size;

		state.logger.infoIfVerbose("Fetched " + varCount + " environment variables from session");
	}

	public get(name: string): string | undefined {
		return this.variables.get(name);
	}

	public has(name: string): boolean {
		return this.variables.has(name);
	}

	public getAsNumber(name: string): number | undefined {
		const value = this.get(name);
		if (value && value.match(/\d+/gi)) {
			return parseFloat(value);
		}
	}

	public parseAsBoolean(name: string): boolean | undefined {
		const value = this.get(name);
		if (value) {
			return value.trim().toLowerCase() !== "false";
		} else {
			return undefined;
		}
	}
}
