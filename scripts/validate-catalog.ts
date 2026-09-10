import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { catalogAssetFilename } from "../src/lib/catalog-asset";
import { runCatalogPipelineFromAuthority } from "./catalog/pipeline";
import { formatSourceIssue } from "./catalog/report";

export function validateCatalogArtifacts(
  root = process.cwd(),
  result = runCatalogPipelineFromAuthority(resolve(root, "data/source")),
  compact = false,
) {
  const { catalog, issues } = result;
  const expectedCatalogBytes = `${JSON.stringify(catalog, null, 2)}\n`;
  const generatedCatalogPaths = [
    resolve(root, "data/generated/catalog-v1.json"),
    resolve(root, "src/data/generated/catalog-v1.json"),
    resolve(root, "public/catalog", catalogAssetFilename(catalog.catalogVersion)),
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
    if (!compact || validationIssue.severity === "error")
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

  return { errorCount, warningCount, artifactErrors };
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  const result = validateCatalogArtifacts(
    process.cwd(),
    undefined,
    process.argv.includes("--compact"),
  );
  if (result.errorCount > 0) process.exitCode = 1;
}
