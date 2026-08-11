import { parseArgs } from "node:util";

import { ExperimentUsageError } from "./errors";

export const DEFAULT_EXPERIMENT_PATHS = {
  profilesDirectory: "data/fixtures/experiment-profiles",
  catalog: "data/generated/catalog-v1.json",
  context: "data/generated/recommendation-context-v1.json",
  output: "-",
} as const;

export const EXPERIMENT_USAGE = `Usage: pnpm --silent experiment:baseline [options]

Options:
  -p, --profile <json>  Profile JSON path; repeatable
      --catalog <json>  Catalog JSON path
      --context <json>  Recommendation context JSON path
  -o, --output <path>   Markdown output path, or - for stdout
  -h, --help            Show this help`;

export type ExperimentCliOptions = {
  profilePaths: string[];
  catalogPath: string;
  contextPath: string;
  outputPath: string;
  help: boolean;
};

export function parseExperimentCliOptions(arguments_: readonly string[]): ExperimentCliOptions {
  try {
    const { values, tokens } = parseArgs({
      args: [...arguments_],
      allowPositionals: false,
      strict: true,
      tokens: true,
      options: {
        profile: { type: "string", short: "p", multiple: true },
        catalog: { type: "string" },
        context: { type: "string" },
        output: { type: "string", short: "o" },
        help: { type: "boolean", short: "h" },
      },
    });
    const seenScalarOptions = new Set<string>();

    for (const token of tokens) {
      if (token.kind === "option-terminator") {
        throw new ExperimentUsageError("Unknown option: --");
      }
      if (token.kind !== "option") {
        continue;
      }

      const argument = arguments_[token.index];
      if (
        token.rawName.startsWith("-") &&
        !token.rawName.startsWith("--") &&
        argument !== token.rawName
      ) {
        throw new ExperimentUsageError(`Unknown option: ${argument ?? token.rawName}`);
      }
      if (token.value === "") {
        throw new ExperimentUsageError(`${token.rawName} requires a non-empty value`);
      }
      if (token.name !== "profile") {
        if (seenScalarOptions.has(token.name)) {
          throw new ExperimentUsageError(`${token.rawName} may only be provided once`);
        }
        seenScalarOptions.add(token.name);
      }
    }

    return {
      profilePaths: values.profile ?? [],
      catalogPath: values.catalog ?? DEFAULT_EXPERIMENT_PATHS.catalog,
      contextPath: values.context ?? DEFAULT_EXPERIMENT_PATHS.context,
      outputPath: values.output ?? DEFAULT_EXPERIMENT_PATHS.output,
      help: values.help ?? false,
    };
  } catch (error) {
    if (error instanceof ExperimentUsageError) {
      throw error;
    }
    throw new ExperimentUsageError(
      error instanceof Error ? error.message : "Invalid experiment options",
      { cause: error },
    );
  }
}
