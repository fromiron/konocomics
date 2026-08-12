import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { aggregateG2Metrics } from "../src/domain/g2";
import { strings } from "../src/lib/strings";
import { experimentExitCode, EXPERIMENT_EXIT_CODES } from "./experiment/errors";
import { loadExperimentCatalog, loadRecommendationContext } from "./experiment/inputs";
import { assertDistinctOutputPath, writeAtomicOutput } from "./experiment/io";
import { G2_USAGE, parseG2CliOptions } from "./g2/options";
import { buildG2AggregateReport } from "./g2/report";
import { assertDistinctG2InputTargets, loadG2Results, resolveG2ResultPaths } from "./g2/results";

export type G2CliRuntime = {
  workingDirectory: string;
  writeStdout: (value: string) => void;
  writeStderr: (value: string) => void;
};

function errorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown G2 aggregate failure";
  return message.replace(/[\u0000-\u001f\u007f-\u009f]/gu, (character) =>
    character === "\n" ? character : "�",
  );
}

export async function runG2Aggregate(
  arguments_: readonly string[],
  runtime: G2CliRuntime,
): Promise<0 | 1 | 2> {
  try {
    const options = parseG2CliOptions(arguments_);
    if (options.help) {
      runtime.writeStdout(`${G2_USAGE}\n`);
      return EXPERIMENT_EXIT_CODES.success;
    }
    const catalogPath = resolve(runtime.workingDirectory, options.catalogPath);
    const contextPath = resolve(runtime.workingDirectory, options.contextPath);
    const resultPaths = await resolveG2ResultPaths(options.resultPaths, runtime.workingDirectory);
    const inputPaths = [catalogPath, contextPath, ...resultPaths];
    await assertDistinctG2InputTargets(inputPaths);
    const outputPath = assertDistinctOutputPath(
      options.outputPath,
      inputPaths,
      runtime.workingDirectory,
    );
    const catalog = await loadExperimentCatalog(catalogPath);
    const context = await loadRecommendationContext(contextPath, catalog);
    const results = await loadG2Results({
      paths: resultPaths,
      catalog,
      context,
      lexicon: strings.explanation,
    });
    const report = buildG2AggregateReport(catalog, aggregateG2Metrics(results, catalog));
    if (outputPath === "-") {
      runtime.writeStdout(report);
    } else {
      await writeAtomicOutput(outputPath, report, {
        inputPaths,
        workingDirectory: runtime.workingDirectory,
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
  void runG2Aggregate(process.argv.slice(2), {
    workingDirectory: process.cwd(),
    writeStdout: (value) => process.stdout.write(value),
    writeStderr: (value) => process.stderr.write(value),
  }).then((exitCode) => {
    process.exitCode = exitCode;
  });
}
