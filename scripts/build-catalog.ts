import { mkdirSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { catalogAssetFilename } from "../src/lib/catalog-asset";
import { runCatalogPipeline } from "./catalog/pipeline";
import { formatSourceIssue, hasErrors } from "./catalog/report";

const sourceDirectory = resolve(process.cwd(), "data/source");
const catalogOutputs = [
  resolve(process.cwd(), "data/generated/catalog-v1.json"),
  resolve(process.cwd(), "src/data/generated/catalog-v1.json"),
] as const;
const contextOutputs = [
  resolve(process.cwd(), "data/generated/recommendation-context-v1.json"),
  resolve(process.cwd(), "src/data/generated/recommendation-context-v1.json"),
] as const;
const { catalog, context, issues } = runCatalogPipeline(sourceDirectory);
const publicCatalogOutput = resolve(
  process.cwd(),
  "public/catalog",
  catalogAssetFilename(catalog.catalogVersion),
);

for (const validationIssue of issues) {
  console.log(formatSourceIssue(validationIssue));
}

if (hasErrors(issues)) {
  console.error("Catalog build refused because validation failed.");
  process.exitCode = 1;
} else {
  const artifacts = [
    ...catalogOutputs.map((output) => ({ output, value: catalog })),
    { output: publicCatalogOutput, value: catalog },
    ...contextOutputs.map((output) => ({ output, value: context })),
  ];
  for (const { output, value } of artifacts) {
    mkdirSync(dirname(output), { recursive: true });
    const temporaryOutput = `${output}.tmp`;
    writeFileSync(temporaryOutput, `${JSON.stringify(value, null, 2)}\n`, "utf8");
    renameSync(temporaryOutput, output);
  }
  console.log(
    `Built ${catalog.catalogVersion} with ${catalog.works.length} works and recommendation context.`,
  );
}
