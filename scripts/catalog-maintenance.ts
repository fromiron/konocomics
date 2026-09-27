import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { z } from "zod";
import { assertCatalogCommitLock, catalogPython } from "./catalog-python";

const count = z.number().int().nonnegative();
export const representativeRepairResultSchema = z.strictObject({
  mode: z.enum(["apply", "dry-run"]),
  alreadyApplied: z.boolean(),
  replacements: count,
  volumeCorrections: count,
  unsupported: count,
  additionalUnsupported: count,
  duplicateBlocked: count,
  duplicateResolved: count,
  mappingRows: count,
  changedFiles: z.array(z.string()),
});
export const canonicalRepairResultSchema = z.strictObject({
  mode: z.enum(["apply", "dry-run"]),
  alreadyApplied: z.boolean(),
  changedFiles: z.array(z.string()),
  pairCount: count,
  removedRows: count,
  rewrittenRows: count,
});
export const libraryExpansionResultSchema = z.strictObject({
  mode: z.literal("--write"),
  promotedCount: count,
  existingCount: count,
  catalogVersion: z.string().min(1),
});
const operationSchema = z.enum(["representative-isbns", "canonical-repair", "library-expansion"]);
type MaintenanceOperation = z.infer<typeof operationSchema>;

export function maintenanceLockHeld(root: string) {
  if (!process.env.CATALOG_COMMIT_LOCK_HELD) return false;
  assertCatalogCommitLock(root);
  assert(
    !existsSync(join(root, "data/local/catalog-authoring/locks/publication.pending.json")),
    "Recover the pending canonical publication before maintenance",
  );
  return true;
}

/** Rare repair commands keep their existing checks under one bounded lock; hot batch preparation is separate. */
export function runLockedMaintenance<T>(
  root: string,
  operation: MaintenanceOperation,
  schema: z.ZodType<T>,
): T {
  root = resolve(root);
  const result = spawnSync(
    catalogPython(root),
    [
      "-B",
      "-X",
      "utf8",
      join(import.meta.dirname, "catalog_authoring_locks.py"),
      "exec",
      "--repo",
      root,
      "--name",
      "publication.lock",
      "--",
      process.execPath,
      "--import",
      "tsx",
      join(import.meta.dirname, "catalog-maintenance.ts"),
      "--root",
      root,
      "--operation",
      operation,
    ],
    {
      cwd: resolve(import.meta.dirname, ".."),
      encoding: "utf8",
      windowsHide: true,
      maxBuffer: 8 * 1024 * 1024,
    },
  );
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return schema.parse(JSON.parse(result.stdout.trim().split(/\r?\n/u).at(-1)!));
}

async function main() {
  const { values } = parseArgs({
    options: { root: { type: "string" }, operation: { type: "string" } },
  });
  assert(values.root);
  const root = resolve(values.root);
  assert(maintenanceLockHeld(root), "Maintenance writes require the shared lock broker");
  const operation = operationSchema.parse(values.operation);
  if (operation === "representative-isbns") {
    const { repairRepresentativeIsbns } = await import("./repair-representative-isbns");
    console.log(
      JSON.stringify(
        representativeRepairResultSchema.parse(repairRepresentativeIsbns("apply", root)),
      ),
    );
  } else if (operation === "canonical-repair") {
    const { repairCatalogExpansionCanonical } =
      await import("./repair-catalog-expansion-canonical");
    console.log(
      JSON.stringify(
        canonicalRepairResultSchema.parse(repairCatalogExpansionCanonical("apply", root)),
      ),
    );
  } else {
    const { runLibraryOnlyExpansion } = await import("./promote-library-only-expansion");
    console.log(
      JSON.stringify(libraryExpansionResultSchema.parse(runLibraryOnlyExpansion("--write", root))),
    );
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
