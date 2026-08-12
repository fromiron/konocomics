import { compileCatalog } from "./compile";
import { ART_EVIDENCE_MANIFEST_FILE, validateArtEvidence } from "./art-evidence";
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
  const artEvidenceLoadFailed = loaded.issues.some(
    (issue) => issue.severity === "error" && issue.file === ART_EVIDENCE_MANIFEST_FILE,
  );
  const artEvidenceIssues = artEvidenceLoadFailed
    ? []
    : validateArtEvidence({
        works: loaded.source.works,
        factors: loaded.source.factors,
        evidence: loaded.source.evidence,
        manifest: loaded.artEvidence,
      });
  return {
    catalog: compiled.catalog,
    context: compiled.context,
    issues: sortIssues([...loaded.issues, ...compiled.issues, ...artEvidenceIssues]),
  };
}
