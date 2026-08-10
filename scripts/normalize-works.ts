import { resolve } from "node:path";

import { normalizeTitle } from "../src/domain/catalog/normalize";
import { evaluateGroupingCandidate } from "../src/domain/catalog/grouping";
import { loadCatalogSource } from "./catalog/load-source";
import { formatSourceIssue, hasErrors } from "./catalog/report";

const sourceDirectory = resolve(process.cwd(), "data/source");
const loaded = loadCatalogSource(sourceDirectory);

for (const validationIssue of loaded.issues) {
  console.log(formatSourceIssue(validationIssue));
}

if (hasErrors(loaded.issues)) {
  process.exitCode = 1;
} else {
  console.log("workId\tcanonical\tkanaFolded");
  for (const row of [...loaded.source.works].sort((left, right) =>
    left.value.id.localeCompare(right.value.id),
  )) {
    const normalized = normalizeTitle(row.value.title);
    console.log(`${row.value.id}\t${normalized.canonical}\t${normalized.kanaFolded}`);
  }

  console.log("\nPotential duplicate Work groups (score >= 0.70)");
  console.log("leftWorkId\trightWorkId\tscore\tdecision");
  let candidateCount = 0;
  const works = [...loaded.source.works].sort((left, right) =>
    left.value.id.localeCompare(right.value.id),
  );
  for (let leftIndex = 0; leftIndex < works.length; leftIndex += 1) {
    const left = works[leftIndex];
    if (left === undefined) {
      continue;
    }
    for (let rightIndex = leftIndex + 1; rightIndex < works.length; rightIndex += 1) {
      const right = works[rightIndex];
      if (right === undefined) {
        continue;
      }
      const result = evaluateGroupingCandidate(
        {
          title: left.value.title,
          seriesName: left.value.title,
          creators: left.value.creators,
          ...(left.value.publisher === undefined ? {} : { publisher: left.value.publisher }),
        },
        {
          title: right.value.title,
          seriesName: right.value.title,
          creators: right.value.creators,
          ...(right.value.publisher === undefined ? {} : { publisher: right.value.publisher }),
        },
      );
      if (result.score >= 0.7) {
        candidateCount += 1;
        console.log(
          `${left.value.id}\t${right.value.id}\t${result.score.toFixed(2)}\t${result.decision}`,
        );
      }
    }
  }
  if (candidateCount === 0) {
    console.log("(none)");
  }
}
