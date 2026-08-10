import { resolve } from "node:path";

import { runCatalogPipeline } from "./catalog/pipeline";
import { formatSourceIssue, hasErrors } from "./catalog/report";

const sourceDirectory = resolve(process.cwd(), "data/source");
const { catalog, issues } = runCatalogPipeline(sourceDirectory);

for (const validationIssue of issues) {
  console.log(formatSourceIssue(validationIssue));
}

const errorCount = issues.filter((validationIssue) => validationIssue.severity === "error").length;
const warningCount = issues.length - errorCount;
console.log(
  `Catalog ${catalog.catalogVersion}: ${catalog.works.length} works, ${catalog.volumes.length} volumes, ${errorCount} errors, ${warningCount} warnings`,
);

if (hasErrors(issues)) {
  process.exitCode = 1;
}
