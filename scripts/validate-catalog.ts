import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { catalogAssetFilename } from "../src/lib/catalog-asset";
import { runCatalogPipeline } from "./catalog/pipeline";
import { formatSourceIssue, hasErrors } from "./catalog/report";

const sourceDirectory = resolve(process.cwd(), "data/source");
const { catalog, issues } = runCatalogPipeline(sourceDirectory);
const expectedCatalogBytes = `${JSON.stringify(catalog, null, 2)}\n`;
const generatedCatalogPaths = [
  resolve(process.cwd(), "data/generated/catalog-v1.json"),
  resolve(process.cwd(), "src/data/generated/catalog-v1.json"),
  resolve(process.cwd(), "public/catalog", catalogAssetFilename(catalog.catalogVersion)),
] as const;
const artifactErrors: string[] = [];

for (const artifactPath of generatedCatalogPaths) {
  try {
    if (readFileSync(artifactPath, "utf8") !== expectedCatalogBytes) {
      artifactErrors.push(`Generated Catalog is stale or not byte-identical: ${artifactPath}`);
    }
  } catch {
    artifactErrors.push(`Generated Catalog is missing or unreadable: ${artifactPath}`);
  }
}

for (const validationIssue of issues) {
  console.log(formatSourceIssue(validationIssue));
}

for (const artifactError of artifactErrors) {
  console.log(`[error] ${artifactError}`);
}

const sourceErrorCount = issues.filter(
  (validationIssue) => validationIssue.severity === "error",
).length;
const errorCount = sourceErrorCount + artifactErrors.length;
const warningCount = issues.length - sourceErrorCount;
console.log(
  `Catalog ${catalog.catalogVersion}: ${catalog.works.length} works, ${catalog.volumes.length} volumes, ${errorCount} errors, ${warningCount} warnings`,
);

if (hasErrors(issues) || artifactErrors.length > 0) {
  process.exitCode = 1;
}
