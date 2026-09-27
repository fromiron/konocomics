import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  closeSync,
  cpSync,
  existsSync,
  fsyncSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, posix, relative, resolve, win32 } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

import { assertCatalogCommitLock, catalogPython } from "../catalog-python";
import { publishDirectorySet } from "../promote-g2-catalog";
import { sha256, verifyCatalogAuthority } from "./authority";

export const CANONICAL_POLICY_PATHS = [
  "docs/factors/factor-dictionary.md",
  "docs/factors/annotation-guide.md",
  "docs/catalog-expansion/02-authorized-evidence-panel-v1.md",
  "docs/planning/09-catalog-authoring-authority.md",
] as const;

const digest = z.string().regex(/^[a-f0-9]{64}$/u);
const artifactSchema = z.strictObject({
  path: z.string().min(1),
  beforeSha256: digest.nullable(),
  sha256: digest,
});
export const canonicalPublicationSchema = z.strictObject({
  schemaVersion: z.literal("catalog-canonical-publication-v1"),
  root: z.string(),
  output: z.string(),
  kind: z.enum(["adjudication", "publisher-metadata"]),
  requestSha256: digest,
  workIds: z.array(z.string()).min(1),
  beforeSourceManifestDigest: digest,
  sourceManifestDigest: digest,
  catalogVersion: z.string().min(1),
  artifacts: z.array(artifactSchema).min(1),
  guards: z.array(z.strictObject({ path: z.string().min(1), sha256: digest })).default([]),
});
export type CanonicalPublication = z.infer<typeof canonicalPublicationSchema>;

function absoluteIdentity(value: string) {
  assert(!value.includes("\0"), "Artifact path contains NUL");
  assert(!value.split(/[\\/]/u).includes(".."), "Artifact path contains parent traversal");
  const drive = /^([a-z]):[\\/](.*)$/isu.exec(value);
  const unc = /^[\\/]{2}([^\\/]+)[\\/]([^\\/]+)(?:[\\/](.*))?$/su.exec(value);
  if (drive || unc) {
    assert(!unc || !["?", "."].includes(unc[1]!), "Device paths are not restore origins");
    const anchor = drive ? `${drive[1]!.toLowerCase()}:` : `//${unc![1]}/${unc![2]}`.toLowerCase();
    const parts = (drive?.[2] ?? unc?.[3] ?? "")
      .split(/[\\/]+/u)
      .filter((part) => part && part !== ".");
    assert(
      ![anchor.replace(/^[a-z]:$/u, ""), ...parts].some((part) => part.includes(":")),
      "Invalid Windows artifact path",
    );
    return { windows: true, anchor, parts };
  }
  assert(!/^[a-z]:|^\\/iu.test(value), "Artifact path requires an absolute drive or share");
  if (value.startsWith("/")) {
    assert(!value.includes("\\"), "Invalid POSIX artifact path");
    return {
      windows: false,
      anchor: "/",
      parts: value.split("/").filter((part) => part && part !== "."),
    };
  }
  return undefined;
}

const restoreSchema = z.object({
  schemaVersion: z.literal("catalog-restored-workspace-v1"),
  originalRepositories: z.array(
    z
      .string()
      .min(1)
      .refine((value) => !!absoluteIdentity(value)),
  ),
});

function identitySuffix(
  root: NonNullable<ReturnType<typeof absoluteIdentity>>,
  path: NonNullable<ReturnType<typeof absoluteIdentity>>,
) {
  const fold = (part: string) => (root.windows ? part.toLowerCase() : part);
  if (
    root.windows !== path.windows ||
    root.anchor !== path.anchor ||
    root.parts.length > path.parts.length ||
    root.parts.some((part, index) => fold(part) !== fold(path.parts[index]!))
  )
    return undefined;
  return path.parts.slice(root.parts.length);
}

function identityChild(root: string, name: string) {
  const identity = absoluteIdentity(root);
  assert(identity, "Publication root must be absolute");
  return (identity.windows ? win32 : posix).join(root, name);
}

/** Resolve declared restore aliases only at I/O boundaries; sealed JSON keeps its original bytes. */
export function resolveCanonicalPath(path: string, root: string) {
  root = resolve(root);
  const identity = absoluteIdentity(path) ?? absoluteIdentity(resolve(path.replaceAll("\\", "/")))!;
  const current = absoluteIdentity(root)!;
  const currentSuffix = identitySuffix(current, identity);
  if (currentSuffix) return resolve(root, ...currentSuffix);
  const marker = join(root, ".catalog-restore.json");
  if (!existsSync(marker)) {
    assert(
      identity.windows === current.windows,
      `Foreign artifact path requires a declared restore origin: ${path}`,
    );
    return resolve(path.replaceAll("\\", "/"));
  }
  const restored = restoreSchema.parse(JSON.parse(readFileSync(marker, "utf8")));
  const origins = restored.originalRepositories
    .map((origin) => absoluteIdentity(origin)!)
    .sort((left, right) => right.parts.length - left.parts.length);
  for (const origin of origins) {
    const suffix = identitySuffix(origin, identity);
    if (suffix) return resolve(root, ...suffix);
  }
  throw new Error(`Artifact is outside the restored repository and declared origins: ${path}`);
}

/** The actual prepared file locates the restore marker; its manifest cannot redirect the broker. */
export function canonicalPublicationPaths(prepared: CanonicalPublication, preparedPath: string) {
  preparedPath = resolve(preparedPath);
  let root = prepared.root;
  for (let folder = dirname(preparedPath); ; folder = dirname(folder)) {
    if (existsSync(join(folder, ".catalog-restore.json"))) {
      const restored = restoreSchema.parse(
        JSON.parse(readFileSync(join(folder, ".catalog-restore.json"), "utf8")),
      );
      assert(
        [folder, ...restored.originalRepositories].some((origin) => {
          const identity = absoluteIdentity(origin);
          const preparedIdentity = absoluteIdentity(prepared.root);
          return (
            identity && preparedIdentity && identitySuffix(identity, preparedIdentity)?.length === 0
          );
        }),
        "Prepared canonical root is not a declared restore origin",
      );
      root = folder;
      break;
    }
    if (dirname(folder) === folder) break;
  }
  const output = resolveCanonicalPath(prepared.output, root);
  assert.equal(
    preparedPath,
    join(output, "prepared.json"),
    "Prepared publication location changed",
  );
  return { root, output };
}

export function containedPath(root: string, path: string) {
  assert(!absoluteIdentity(path), `Path must be relative: ${path}`);
  const parts = path.split(/[\\/]+/u).filter((part) => part && part !== ".");
  assert(!parts.some((part) => part.includes(":")), `Invalid relative artifact path: ${path}`);
  const full = resolve(root, ...parts);
  const part = relative(root, full);
  assert(
    part &&
      !isAbsolute(part) &&
      part !== ".." &&
      !part.startsWith("../") &&
      !part.startsWith("..\\"),
    `Path must be inside ${root}: ${path}`,
  );
  return full;
}

export function artifactDigest(path: string): string | null {
  if (!existsSync(path)) return null;
  const info = lstatSync(path);
  assert(!info.isSymbolicLink(), `Publication cannot contain a symlink: ${path}`);
  if (info.isFile()) return sha256(readFileSync(path));
  assert(info.isDirectory(), `Unsupported publication artifact: ${path}`);
  return sha256(
    JSON.stringify(
      readdirSync(path)
        .sort()
        .map((name) => [name, artifactDigest(join(path, name))]),
    ),
  );
}

export function writeDurableJson(path: string, value: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.tmp`;
  const descriptor = openSync(temporary, "w");
  try {
    writeFileSync(descriptor, `${JSON.stringify(value, null, 2)}\n`);
    fsyncSync(descriptor);
  } finally {
    closeSync(descriptor);
  }
  renameSync(temporary, path);
}

export function canonicalPendingPath(root: string) {
  return join(root, "data/local/catalog-authoring/locks/publication.pending.json");
}

export function assertNoPendingCanonicalPublication(root: string, preparedPath?: string) {
  const path = canonicalPendingPath(root);
  if (!existsSync(path)) return;
  const pending = z
    .strictObject({ preparedPath: z.string(), preparedSha256: digest })
    .parse(JSON.parse(readFileSync(path, "utf8")));
  assert(
    preparedPath && resolveCanonicalPath(pending.preparedPath, root) === resolve(preparedPath),
    `Canonical publication needs recovery first: ${pending.preparedPath}`,
  );
  assert.equal(
    sha256(readFileSync(preparedPath)),
    pending.preparedSha256,
    "Recovery intent changed",
  );
}

export function sealCanonicalPublication(
  value: Omit<CanonicalPublication, "schemaVersion" | "artifacts" | "guards"> &
    Partial<Pick<CanonicalPublication, "guards">>,
  paths: readonly string[],
) {
  const artifacts = paths.map((path) => {
    const source = containedPath(join(value.output, "candidate"), path);
    const destination = containedPath(value.root, path);
    const checksum = artifactDigest(source);
    assert(checksum, `Missing staged publication artifact: ${path}`);
    return { path, beforeSha256: artifactDigest(destination), sha256: checksum };
  });
  const prepared = canonicalPublicationSchema.parse({
    ...value,
    schemaVersion: "catalog-canonical-publication-v1",
    artifacts,
  });
  assert.equal(new Set(paths).size, paths.length, "Duplicate canonical artifact");
  writeDurableJson(join(value.output, "prepared.json"), prepared);
  preparePublicationCopies(prepared);
  return prepared;
}

function preparePublicationCopies(
  prepared: CanonicalPublication,
  paths = { root: prepared.root, output: prepared.output },
) {
  for (const artifact of prepared.artifacts) {
    const source = containedPath(join(paths.output, "candidate"), artifact.path);
    assert.equal(artifactDigest(source), artifact.sha256, `Publish copy changed: ${artifact.path}`);
    if (artifactDigest(containedPath(paths.root, artifact.path)) === artifact.sha256) continue;
    const candidate = containedPath(join(paths.output, "publish"), artifact.path);
    if (existsSync(candidate) && artifactDigest(candidate) !== artifact.sha256) {
      // Incomplete copies are private scratch; rebuild them outside the shared commit lock.
      rmSync(candidate, { recursive: true, force: true });
    }
    if (!existsSync(candidate)) {
      mkdirSync(dirname(candidate), { recursive: true });
      cpSync(source, candidate, { recursive: true });
    }
    assert.equal(artifactDigest(candidate), artifact.sha256, "Recovery publish copy changed");
  }
}

export function readCanonicalPublication(preparedPath: string) {
  const prepared = canonicalPublicationSchema.parse(JSON.parse(readFileSync(preparedPath, "utf8")));
  const paths = canonicalPublicationPaths(prepared, preparedPath);
  // Policy guards added to adjudication publications also seal the retained audit inputs.
  // Legacy preparations have no document guards and keep their original recovery contract.
  if (prepared.kind === "adjudication")
    for (const guard of prepared.guards.filter((entry) => entry.path.startsWith("docs/")))
      assert.equal(
        artifactDigest(containedPath(join(paths.output, "policies"), guard.path)),
        guard.sha256,
        `Prepared policy snapshot changed: ${guard.path}`,
      );
  return prepared;
}

function completionValue(prepared: CanonicalPublication, preparedPath: string) {
  return {
    schemaVersion: "catalog-canonical-completion-v1",
    status: "APPLIED",
    readback: "PASS",
    completionPath: identityChild(prepared.output, "completion.json"),
    preparedSha256: sha256(readFileSync(preparedPath)),
    catalogVersion: prepared.catalogVersion,
    sourceManifestDigest: prepared.sourceManifestDigest,
    workIds: prepared.workIds,
    artifacts: prepared.artifacts,
  };
}

/** Historical acknowledgement verifies the immutable completed effect, not current deployment parity. */
export function verifyCanonicalCompletion(completionPath: string) {
  completionPath = resolve(completionPath);
  const preparedPath = join(dirname(completionPath), "prepared.json");
  const prepared = readCanonicalPublication(preparedPath);
  const paths = canonicalPublicationPaths(prepared, preparedPath);
  if (existsSync(canonicalPendingPath(paths.root))) {
    const pending = z
      .object({ preparedPath: z.string() })
      .parse(JSON.parse(readFileSync(canonicalPendingPath(paths.root), "utf8")));
    assert.notEqual(
      resolveCanonicalPath(pending.preparedPath, paths.root),
      resolve(preparedPath),
      "Completion still needs locked finalization; resume its publication before historical acknowledgement",
    );
  }
  assert.equal(completionPath, join(paths.output, "completion.json"));
  const expected = completionValue(prepared, preparedPath);
  assert.deepEqual(
    JSON.parse(readFileSync(completionPath, "utf8")),
    expected,
    "Completion changed",
  );
  for (const artifact of prepared.artifacts) {
    assert.equal(
      artifactDigest(containedPath(join(paths.output, "candidate"), artifact.path)),
      artifact.sha256,
      "Completed canonical artifact changed",
    );
  }
  assert.equal(
    verifyCatalogAuthority(join(paths.output, "candidate")).sourceManifestDigest,
    prepared.sourceManifestDigest,
  );
  return { ...expected, verification: "HISTORICAL_COMPLETION" };
}

/** The caller must hold publication.lock. Immutable candidates and rollback copies survive crashes. */
export function commitCanonicalPublication(
  preparedPath: string,
  recordChanges?: (changes: { writtenPaths: string[]; deletedPaths: string[] }) => void,
) {
  const writtenPaths = new Set<string>();
  const deletedPaths = new Set<string>();
  let failed = false;
  let failure: unknown;
  const writePublicationJson = (path: string, value: unknown) => {
    writeDurableJson(path, value);
    writtenPaths.add(path);
  };
  const renamePublication = (source: string, destination: string) => {
    renameSync(source, destination);
    writtenPaths.add(destination);
    deletedPaths.add(source);
  };
  try {
    preparedPath = resolve(preparedPath);
    const prepared = readCanonicalPublication(preparedPath);
    const paths = canonicalPublicationPaths(prepared, preparedPath);
    assertCatalogCommitLock(paths.root);
    assertNoPendingCanonicalPublication(paths.root, preparedPath);
    const completionPath = join(paths.output, "completion.json");
    const pendingPath = canonicalPendingPath(paths.root);
    if (prepared.kind === "adjudication" && !existsSync(pendingPath) && !existsSync(completionPath))
      for (const path of CANONICAL_POLICY_PATHS)
        assert.equal(
          prepared.guards.filter((guard) => guard.path === path).length,
          1,
          `Unstarted adjudication publication must bind current policy: ${path}`,
        );
    for (const guard of prepared.guards) {
      assert.equal(
        artifactDigest(containedPath(paths.root, guard.path)),
        guard.sha256,
        `Canonical policy changed during preparation: ${guard.path}`,
      );
    }
    if (!existsSync(pendingPath) && !existsSync(completionPath)) {
      assert.equal(
        verifyCatalogAuthority(paths.root).sourceManifestDigest,
        prepared.beforeSourceManifestDigest,
        "Canonical changed during preparation; prepare a new publication",
      );
      for (const artifact of prepared.artifacts) {
        assert.equal(
          artifactDigest(containedPath(paths.root, artifact.path)),
          artifact.beforeSha256,
          `Canonical artifact changed during preparation: ${artifact.path}`,
        );
      }
    }
    for (const artifact of prepared.artifacts) {
      assert.equal(
        artifactDigest(containedPath(join(paths.output, "candidate"), artifact.path)),
        artifact.sha256,
        `Publish copy changed: ${artifact.path}`,
      );
    }
    if (!existsSync(completionPath)) {
      if (!existsSync(pendingPath))
        writePublicationJson(pendingPath, {
          preparedPath: identityChild(prepared.output, "prepared.json"),
          preparedSha256: sha256(readFileSync(preparedPath)),
        });
      for (const artifact of prepared.artifacts) {
        assertCatalogCommitLock(paths.root);
        const output = containedPath(paths.root, artifact.path);
        const backup = containedPath(join(paths.output, "rollback"), artifact.path);
        const candidate = containedPath(join(paths.output, "publish"), artifact.path);
        const current = artifactDigest(output);
        if (current === artifact.sha256) continue;
        assert(
          current === artifact.beforeSha256 ||
            (current === null && artifactDigest(backup) === artifact.beforeSha256),
          `Canonical recovery conflicts with a later change: ${artifact.path}`,
        );
        if (existsSync(backup)) {
          assert.equal(artifactDigest(backup), artifact.beforeSha256, "Rollback artifact changed");
        }
        assert.equal(artifactDigest(candidate), artifact.sha256, "Recovery publish copy changed");
        mkdirSync(dirname(output), { recursive: true });
        mkdirSync(dirname(backup), { recursive: true });
        assertCatalogCommitLock(paths.root);
        if (current === null && existsSync(backup)) {
          // The process stopped after moving the old artifact but before installing its replacement.
          renamePublication(candidate, output);
        } else {
          publishDirectorySet([{ candidate, output, backup }], {
            existsSync,
            renameSync: renamePublication,
            // Keep prior artifacts until the storage phase has backed up the completed publication.
            rmSync: () => {},
          });
        }
        assert.equal(
          artifactDigest(output),
          artifact.sha256,
          "Published artifact readback mismatch",
        );
      }
    }
    assertCatalogCommitLock(paths.root);
    for (const artifact of prepared.artifacts) {
      assert.equal(
        artifactDigest(containedPath(paths.root, artifact.path)),
        artifact.sha256,
        `Published artifact readback mismatch: ${artifact.path}`,
      );
    }
    assert.equal(
      verifyCatalogAuthority(paths.root).sourceManifestDigest,
      prepared.sourceManifestDigest,
      "Published source readback mismatch",
    );
    const completed = completionValue(prepared, preparedPath);
    if (existsSync(completionPath)) {
      assert.deepEqual(
        JSON.parse(readFileSync(completionPath, "utf8")),
        completed,
        "Completion changed",
      );
    } else writePublicationJson(completionPath, completed);
    assertCatalogCommitLock(paths.root);
    writePublicationJson(
      join(paths.root, "data/local/catalog-authoring/locks/publication.completed.json"),
      {
        schemaVersion: "catalog-canonical-completion-pointer-v1",
        preparedPath: identityChild(prepared.output, "prepared.json"),
        preparedSha256: completed.preparedSha256,
        completionPath: completed.completionPath,
        completionSha256: sha256(readFileSync(completionPath)),
      },
    );
    if (existsSync(pendingPath)) {
      rmSync(pendingPath);
      deletedPaths.add(pendingPath);
    }
    return completed;
  } catch (error) {
    failed = true;
    failure = error;
    throw error;
  } finally {
    if (recordChanges && (writtenPaths.size || deletedPaths.size)) {
      try {
        recordChanges({
          writtenPaths: [...writtenPaths].filter((path) => existsSync(path)),
          deletedPaths: [...deletedPaths].filter((path) => !existsSync(path)),
        });
      } catch (error) {
        if (failed)
          throw new AggregateError(
            [failure, error],
            "Canonical commit and restored state recording failed",
          );
        throw error;
      }
    }
  }
}

/** Shared Python lock serializes every language's final commit, while preparation stays concurrent. */
export function publishPreparedCanonical(preparedPath: string) {
  const prepared = readCanonicalPublication(preparedPath);
  const paths = canonicalPublicationPaths(prepared, preparedPath);
  preparePublicationCopies(prepared, paths);
  const scripts = resolve(fileURLToPath(new URL("..", import.meta.url)));
  const result = spawnSync(
    catalogPython(paths.root),
    [
      "-B",
      "-X",
      "utf8",
      join(scripts, "catalog_authoring_locks.py"),
      "exec",
      "--repo",
      paths.root,
      "--name",
      "publication.lock",
      "--recovery",
      resolve(preparedPath),
      "--",
      process.execPath,
      "--import",
      "tsx",
      join(scripts, "apply-catalog-authoring-canonical.ts"),
      "--commit-prepared",
      resolve(preparedPath),
      "--root",
      paths.root,
    ],
    {
      cwd: resolve(scripts, ".."),
      encoding: "utf8",
      windowsHide: true,
      maxBuffer: 8 * 1024 * 1024,
    },
  );
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return z
    .object({
      status: z.literal("APPLIED"),
      readback: z.literal("PASS"),
      completionPath: z.string(),
    })
    .passthrough()
    .parse(JSON.parse(result.stdout.trim().split(/\r?\n/u).at(-1)!));
}
