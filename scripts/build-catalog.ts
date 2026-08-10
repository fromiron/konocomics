import { mkdirSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { runCatalogPipeline } from "./catalog/pipeline";
import { formatSourceIssue, hasErrors } from "./catalog/report";

const sourceDirectory = resolve(process.cwd(), "data/source");
const outputs = [
  resolve(process.cwd(), "data/generated/catalog-v1.json"),
  resolve(process.cwd(), "src/data/generated/catalog-v1.json"),
] as const;
const { catalog, issues } = runCatalogPipeline(sourceDirectory);

for (const validationIssue of issues) {
  console.log(formatSourceIssue(validationIssue));
}

if (hasErrors(issues)) {
  console.error("Catalog build refused because validation failed.");
  process.exitCode = 1;
} else {
  const serialized = `${JSON.stringify(catalog, null, 2)}\n`;
  for (const output of outputs) {
    mkdirSync(dirname(output), { recursive: true });
    const temporaryOutput = `${output}.tmp`;
    writeFileSync(temporaryOutput, serialized, "utf8");
    renameSync(temporaryOutput, output);
  }
  console.log(`Built ${catalog.catalogVersion} with ${catalog.works.length} works.`);
}
