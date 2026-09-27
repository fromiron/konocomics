import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";
import { runLibraryOnlyExpansion } from "../../../scripts/promote-library-only-expansion";
import { repairCatalogExpansionCanonical } from "../../../scripts/repair-catalog-expansion-canonical";
import { repairRepresentativeIsbns } from "../../../scripts/repair-representative-isbns";

it("blocks all maintained write entrypoints before they inspect or mutate an unfinished canonical publication", () => {
  const root = mkdtempSync(join(tmpdir(), "konocomics-maintenance-pending-"));
  try {
    const lockRoot = join(root, "data/local/catalog-authoring/locks");
    mkdirSync(lockRoot, { recursive: true });
    const pending = join(lockRoot, "publication.pending.json");
    const marker = JSON.stringify({ preparedPath: join(root, "in-flight/prepared.json") });
    writeFileSync(pending, marker);
    for (const operation of [
      () => repairRepresentativeIsbns("apply", root),
      () => repairCatalogExpansionCanonical("apply", root),
      () => runLibraryOnlyExpansion("--write", root),
    ]) {
      expect(operation).toThrow("Recover the pending canonical publication before another write");
      expect(readFileSync(pending, "utf8")).toBe(marker);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
