import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import {
  AXIS_IDS,
  COVERAGE_THRESHOLDS,
  PROMOTION_REQUIRED_COVERAGE_GROUPS,
} from "../src/domain/catalog/constants";
import {
  calculateAxisCorrelations,
  calculateAxisValueRanges,
  calculateWorkCoverage,
} from "../src/domain/catalog/coverage";
import { runCatalogPipelineFromAuthority } from "./catalog/pipeline";
import { formatSourceIssue, hasErrors } from "./catalog/report";

export function reportCoverage(
  result = runCatalogPipelineFromAuthority(resolve(process.cwd(), "data/source")),
  compact = false,
) {
  const { catalog, issues } = result;
  let passCount = 0;
  let failCount = 0;

  for (const validationIssue of issues) {
    if (!compact || validationIssue.severity === "error")
      console.log(formatSourceIssue(validationIssue));
  }

  if (hasErrors(issues)) {
    return { passCount, failCount, sourceErrors: true };
  } else {
    const recommendationWorks = catalog.works.filter(
      (work) => work.eligibility.recommendationEligible,
    );
    if (!compact) console.log("# Catalog coverage");
    console.log(
      `Works: ${catalog.works.length}; recommendation eligible: ${recommendationWorks.length}`,
    );
    if (!compact) console.log("\n## Work groups");
    if (!compact) console.log("workId\tgenre\ttheme\tnarrative\ttone\tart\tstatus");
    for (const work of recommendationWorks) {
      const coverage = calculateWorkCoverage(work);
      const passes = PROMOTION_REQUIRED_COVERAGE_GROUPS.every(
        (group) => coverage[group] >= COVERAGE_THRESHOLDS[group],
      );
      if (passes) passCount += 1;
      else failCount += 1;
      if (!compact || !passes)
        console.log(
          [
            work.id,
            coverage.genre.toFixed(2),
            coverage.theme.toFixed(2),
            coverage.narrative.toFixed(2),
            coverage.tone.toFixed(2),
            coverage.art.toFixed(2),
            passes ? "PASS" : "FAIL",
          ].join("\t"),
        );
    }

    if (!compact) {
      console.log("\n## Axis states");
      console.log("axis\tknown\tunknown\tnotApplicable\tcoverage");
      for (const axisId of AXIS_IDS) {
        const counts = recommendationWorks.reduce(
          (total, work) => {
            total[work.axes[axisId].state] += 1;
            return total;
          },
          { known: 0, unknown: 0, notApplicable: 0 },
        );
        const expected = counts.known + counts.unknown;
        console.log(
          `${axisId}\t${counts.known}\t${counts.unknown}\t${counts.notApplicable}\t${expected === 0 ? "N/A" : (counts.known / expected).toFixed(2)}`,
        );
      }

      console.log("\n## Axis value ranges");
      console.log("axis\tknown\tmin\tmax\tdistinct");
      for (const range of calculateAxisValueRanges(catalog)) {
        console.log(
          [
            range.axisId,
            range.knownCount,
            range.minimum ?? "N/A",
            range.maximum ?? "N/A",
            range.distinctValues.join(","),
          ].join("\t"),
        );
      }

      console.log("\n## Axis correlations (absolute descending)");
      console.log("left\tright\tn\tr");
      const correlations = calculateAxisCorrelations(catalog).sort((left, right) => {
        const leftMagnitude = left.correlation === null ? -1 : Math.abs(left.correlation);
        const rightMagnitude = right.correlation === null ? -1 : Math.abs(right.correlation);
        return rightMagnitude - leftMagnitude;
      });
      for (const correlation of correlations) {
        console.log(
          `${correlation.left}\t${correlation.right}\t${correlation.sampleSize}\t${correlation.correlation === null ? "N/A" : correlation.correlation.toFixed(3)}`,
        );
      }
    }
  }
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;
  if (compact)
    console.log(`Coverage: ${passCount} PASS, ${failCount} FAIL, ${warningCount} warnings`);
  return { passCount, failCount, sourceErrors: false };
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  const result = reportCoverage(undefined, process.argv.includes("--compact"));
  if (result.sourceErrors || result.failCount > 0) process.exitCode = 1;
}
