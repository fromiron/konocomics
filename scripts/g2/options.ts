import { parseArgs } from "node:util";

import { ExperimentUsageError } from "../experiment/errors";

export const DEFAULT_G2_PATHS = {
  resultsDirectory: "data/local/g2-results",
  catalog: "data/generated/recommendation-profile-catalog-v1.json",
  context: "data/generated/recommendation-profile-context-v1.json",
  output: "-",
} as const;

export const G2_USAGE = `Usage: pnpm --silent g2:aggregate [options]

Options:
  -r, --result <json>  G2 result JSON path; repeatable
      --catalog <json> Catalog JSON path
      --context <json> Recommendation context JSON path
  -o, --output <path>  Markdown output path, or - for stdout
  -h, --help           Show this help`;

export type G2CliOptions = {
  resultPaths: string[];
  catalogPath: string;
  contextPath: string;
  outputPath: string;
  help: boolean;
};

export function parseG2CliOptions(arguments_: readonly string[]): G2CliOptions {
  try {
    const { values, tokens } = parseArgs({
      args: [...arguments_],
      allowPositionals: false,
      strict: true,
      tokens: true,
      options: {
        result: { type: "string", short: "r", multiple: true },
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
      if (token.name !== "result") {
        if (seenScalarOptions.has(token.name)) {
          throw new ExperimentUsageError(`${token.rawName} may only be provided once`);
        }
        seenScalarOptions.add(token.name);
      }
    }

    return {
      resultPaths: values.result ?? [],
      catalogPath: values.catalog ?? DEFAULT_G2_PATHS.catalog,
      contextPath: values.context ?? DEFAULT_G2_PATHS.context,
      outputPath: values.output ?? DEFAULT_G2_PATHS.output,
      help: values.help ?? false,
    };
  } catch (error) {
    if (error instanceof ExperimentUsageError) {
      throw error;
    }
    throw new ExperimentUsageError(
      error instanceof Error ? error.message : "Invalid G2 aggregate options",
      { cause: error },
    );
  }
}
