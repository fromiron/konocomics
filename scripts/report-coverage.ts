import { resolve } from "node:path";

import { AXIS_IDS, COVERAGE_GROUPS, COVERAGE_THRESHOLDS } from "../src/domain/catalog/constants";
import {
  calculateAxisCorrelations,
  calculateAxisValueRanges,
  calculateWorkCoverage,
} from "../src/domain/catalog/coverage";
import { runCatalogPipeline } from "./catalog/pipeline";
import { formatSourceIssue, hasErrors } from "./catalog/report";

const sourceDirectory = resolve(process.cwd(), "data/source");
const { catalog, issues } = runCatalogPipeline(sourceDirectory);

for (const validationIssue of issues) {
  console.log(formatSourceIssue(validationIssue));
}

if (hasErrors(issues)) {
  process.exitCode = 1;
} else {
  const recommendationWorks = catalog.works.filter(
    (work) => work.eligibility.recommendationEligible,
  );
  console.log("# Catalog coverage");
  console.log(
    `Works: ${catalog.works.length}; recommendation eligible: ${recommendationWorks.length}`,
  );
  console.log("\n## Work groups");
  console.log("workId\tgenre\ttheme\tnarrative\ttone\tart\tstatus");
  for (const work of recommendationWorks) {
    const coverage = calculateWorkCoverage(work);
    const passes = COVERAGE_GROUPS.every((group) => coverage[group] >= COVERAGE_THRESHOLDS[group]);
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
