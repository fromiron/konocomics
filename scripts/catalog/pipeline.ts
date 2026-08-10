import { compileCatalog } from "./compile";
import { loadCatalogSource } from "./load-source";
import type { SourceIssue } from "./types";

function sortIssues(issues: readonly SourceIssue[]) {
  return [...issues].sort((left, right) => {
    const fileOrder = left.file.localeCompare(right.file);
    if (fileOrder !== 0) {
      return fileOrder;
    }
    const rowOrder = (left.row ?? 0) - (right.row ?? 0);
    if (rowOrder !== 0) {
      return rowOrder;
    }
    const fieldOrder = (left.field ?? "").localeCompare(right.field ?? "");
    return fieldOrder === 0 ? left.code.localeCompare(right.code) : fieldOrder;
  });
}

export function runCatalogPipeline(sourceDirectory: string) {
  const loaded = loadCatalogSource(sourceDirectory);
  const compiled = compileCatalog(loaded.source);
  return {
    catalog: compiled.catalog,
    issues: sortIssues([...loaded.issues, ...compiled.issues]),
  };
}
