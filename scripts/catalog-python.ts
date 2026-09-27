import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { z } from "zod";

const runtimeSchema = z.object({ python: z.string().min(1) });
const ownerSchema = z.object({ path: z.string(), pid: z.number().int(), nonce: z.string() });

type RestoredCatalogOperation =
  | { operation: "metadata"; inputPath: string; outputRoot: string }
  | {
      operation: "canonical";
      outputRoot: string;
      action: "prepare" | "commit" | "verify";
      inputPath?: string;
      publicationRoot?: string;
    };

/** Existing CLI entry points explicitly prepare only their requested restored inputs. */
export function prepareRestoredCatalogOperation(root: string, request: RestoredCatalogOperation) {
  root = resolve(root);
  const markerPath = join(root, ".catalog-restore.json");
  if (!existsSync(markerPath)) return { status: "NOT_REQUIRED" };
  const marker = z
    .object({ schemaVersion: z.string(), materialization: z.string().optional() })
    .parse(JSON.parse(readFileSync(markerPath, "utf8")));
  if (
    marker.schemaVersion !== "catalog-restored-workspace-v1" ||
    marker.materialization !== "on-demand"
  )
    return { status: "NOT_REQUIRED" };
  const result = spawnSync(
    catalogPython(root),
    [
      "-B",
      "-X",
      "utf8",
      "-c",
      "import json,sys; from pathlib import Path; sys.path.insert(0,sys.argv[1]); from catalog_retention import prepare_restored_operation; print(json.dumps(prepare_restored_operation(Path(sys.argv[2]),json.loads(sys.argv[3]))))",
      resolve(import.meta.dirname),
      root,
      JSON.stringify(request),
    ],
    { cwd: root, encoding: "utf8", windowsHide: true, maxBuffer: 8 * 1024 * 1024 },
  );
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return z
    .object({ status: z.string().min(1) })
    .passthrough()
    .parse(JSON.parse(result.stdout.trim().split(/\r?\n/u).at(-1)!));
}

/** Record only mutations performed by this existing CLI phase, including successful deletions. */
export function recordRestoredCatalogOperation(
  root: string,
  preparation: Record<string, unknown>,
  writtenPaths: readonly string[],
  deletedPaths: readonly string[] = [],
) {
  if (preparation.status !== "MATERIALIZED" || (!writtenPaths.length && !deletedPaths.length))
    return;
  const result = spawnSync(
    catalogPython(root),
    [
      "-B",
      "-X",
      "utf8",
      "-c",
      "import json,sys; from pathlib import Path; sys.path.insert(0,sys.argv[1]); from catalog_retention import record_restored_operation; value=json.loads(sys.argv[3]); print(json.dumps(record_restored_operation(Path(sys.argv[2]),value['preparation'],[Path(path) for path in value['writtenPaths']],deleted_paths=[Path(path) for path in value['deletedPaths']])))",
      resolve(import.meta.dirname),
      resolve(root),
      JSON.stringify({ preparation, writtenPaths, deletedPaths }),
    ],
    { cwd: root, encoding: "utf8", windowsHide: true, maxBuffer: 8 * 1024 * 1024 },
  );
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

/** Legacy private fixtures may use Python on PATH; WAL writers validate SQLite themselves. */
export function catalogPython(root: string): string {
  if (process.env.KONOCOMICS_CATALOG_PYTHON) return process.env.KONOCOMICS_CATALOG_PYTHON;
  const receipt = join(root, "data/local/catalog-authoring/runtime/runtime.json");
  if (!existsSync(receipt)) return "python";
  const runtime = runtimeSchema.parse(JSON.parse(readFileSync(receipt, "utf8")));
  const executable = resolve(root, runtime.python);
  if (!existsSync(executable))
    throw new Error("Catalog Python runtime is missing; run setup_catalog_runtime.py");
  return executable;
}

/** The lock broker is the direct parent and retains its OS lock for this child's lifetime. */
export function assertCatalogCommitLock(root: string): void {
  const owner = ownerSchema.parse(JSON.parse(process.env.CATALOG_COMMIT_LOCK_HELD ?? "null"));
  const expected = resolve(root, "data/local/catalog-authoring/locks/publication.lock");
  if (resolve(owner.path).toLowerCase() !== expected.toLowerCase() || owner.pid !== process.ppid) {
    throw new Error("Canonical commit requires the repository lock broker");
  }
  const actual = ownerSchema.parse(JSON.parse(readFileSync(`${expected}.owner.json`, "utf8")));
  if (actual.pid !== owner.pid || actual.nonce !== owner.nonce)
    throw new Error("Canonical commit lock owner changed");
}
