import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { strings } from "../src/lib/strings";
import { experimentExitCode, EXPERIMENT_EXIT_CODES } from "./experiment/errors";
import { loadExperimentCatalog, loadRecommendationContext } from "./experiment/inputs";
import { assertDistinctOutputPath, writeAtomicOutput } from "./experiment/io";
import { EXPERIMENT_USAGE, parseExperimentCliOptions } from "./experiment/options";
import { loadExperimentProfiles, resolveExperimentProfilePaths } from "./experiment/profiles";
import { buildExperimentReport } from "./experiment/report";

export type ExperimentCliRuntime = {
  workingDirectory: string;
  writeStdout: (value: string) => void;
  writeStderr: (value: string) => void;
};

function errorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown experiment failure";
  return message.replace(/[\u0000-\u001f\u007f-\u009f]/gu, (character) =>
    character === "\n" ? character : "�",
  );
}

export async function runBaselineExperiment(
  arguments_: readonly string[],
  runtime: ExperimentCliRuntime,
): Promise<0 | 1 | 2> {
  try {
    const options = parseExperimentCliOptions(arguments_);
    if (options.help) {
      runtime.writeStdout(`${EXPERIMENT_USAGE}\n`);
      return EXPERIMENT_EXIT_CODES.success;
    }

    const catalogPath = resolve(runtime.workingDirectory, options.catalogPath);
    const contextPath = resolve(runtime.workingDirectory, options.contextPath);
    const profilePaths = await resolveExperimentProfilePaths(
      options.profilePaths,
      runtime.workingDirectory,
    );
    const inputPaths = [catalogPath, contextPath, ...profilePaths];
    const outputPath = assertDistinctOutputPath(
      options.outputPath,
      inputPaths,
      runtime.workingDirectory,
    );

    const catalog = await loadExperimentCatalog(catalogPath);
    const context = await loadRecommendationContext(contextPath, catalog);
    const profiles = await loadExperimentProfiles(profilePaths, catalog);
    const report = buildExperimentReport(
      { catalog, context, profiles, lexicon: strings.explanation },
      strings.experimentReport,
    );

    if (outputPath === "-") {
      runtime.writeStdout(report);
    } else {
      await writeAtomicOutput(outputPath, report, {
        workingDirectory: runtime.workingDirectory,
        inputPaths,
      });
    }
    return EXPERIMENT_EXIT_CODES.success;
  } catch (error) {
    runtime.writeStderr(`${errorMessage(error)}\n`);
    return experimentExitCode(error);
  }
}

const invokedPath = process.argv[1];
if (invokedPath !== undefined && import.meta.url === pathToFileURL(invokedPath).href) {
  void runBaselineExperiment(process.argv.slice(2), {
    workingDirectory: process.cwd(),
    writeStdout: (value) => process.stdout.write(value),
    writeStderr: (value) => process.stderr.write(value),
  }).then((exitCode) => {
    process.exitCode = exitCode;
  });
}
