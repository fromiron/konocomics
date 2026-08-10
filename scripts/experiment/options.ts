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

type ValueOption = "profile" | "catalog" | "context" | "output";
type ScalarOption = Exclude<ValueOption, "profile"> | "help";

const LONG_VALUE_OPTIONS: Readonly<Record<string, ValueOption>> = {
  "--profile": "profile",
  "--catalog": "catalog",
  "--context": "context",
  "--output": "output",
};

const SHORT_VALUE_OPTIONS: Readonly<Record<string, ValueOption>> = {
  "-p": "profile",
  "-o": "output",
};

function splitLongOption(argument: string): { flag: string; inlineValue?: string } {
  const equalsIndex = argument.indexOf("=");
  if (equalsIndex < 0) {
    return { flag: argument };
  }
  return {
    flag: argument.slice(0, equalsIndex),
    inlineValue: argument.slice(equalsIndex + 1),
  };
}

function requireValue(flag: string, value: string | undefined): string {
  if (value === undefined || value.length === 0) {
    throw new ExperimentUsageError(`${flag} requires a non-empty value`);
  }
  return value;
}

function looksLikeOption(value: string | undefined) {
  return value !== undefined && value !== "-" && value.startsWith("-");
}

function markScalarSeen(option: ScalarOption, seen: Set<ScalarOption>, flag: string) {
  if (seen.has(option)) {
    throw new ExperimentUsageError(`${flag} may only be provided once`);
  }
  seen.add(option);
}

export function parseExperimentCliOptions(arguments_: readonly string[]): ExperimentCliOptions {
  const profilePaths: string[] = [];
  let catalogPath: string = DEFAULT_EXPERIMENT_PATHS.catalog;
  let contextPath: string = DEFAULT_EXPERIMENT_PATHS.context;
  let outputPath: string = DEFAULT_EXPERIMENT_PATHS.output;
  let help = false;
  const seenScalarOptions = new Set<ScalarOption>();

  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index];
    if (argument === undefined) {
      continue;
    }

    if (argument === "--help" || argument === "-h") {
      markScalarSeen("help", seenScalarOptions, argument);
      help = true;
      continue;
    }

    const { flag, inlineValue } = splitLongOption(argument);
    const option = LONG_VALUE_OPTIONS[flag] ?? SHORT_VALUE_OPTIONS[flag];
    if (option === undefined) {
      throw new ExperimentUsageError(`Unknown option: ${argument}`);
    }
    if (inlineValue !== undefined && !flag.startsWith("--")) {
      throw new ExperimentUsageError(`Unknown option: ${argument}`);
    }

    let value = inlineValue;
    if (value === undefined) {
      index += 1;
      value = arguments_[index];
      if (looksLikeOption(value)) {
        throw new ExperimentUsageError(`${flag} requires a non-empty value`);
      }
    }
    value = requireValue(flag, value);

    if (option === "profile") {
      profilePaths.push(value);
      continue;
    }

    markScalarSeen(option, seenScalarOptions, flag);
    if (option === "catalog") {
      catalogPath = value;
    } else if (option === "context") {
      contextPath = value;
    } else {
      outputPath = value;
    }
  }

  return { profilePaths, catalogPath, contextPath, outputPath, help };
}
