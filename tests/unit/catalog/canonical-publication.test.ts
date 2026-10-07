import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve, toNamespacedPath } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { parse } from "csv-parse/sync";
import { expect, it } from "vitest";
import { z } from "zod";

import { GENRE_TAGS } from "../../../src/domain/catalog/constants";
import {
  mergeCanonicalTargets,
  prepareCanonicalApplication,
  deriveCanonicalContextAudit,
} from "../../../scripts/apply-catalog-authoring-canonical";
import { catalogPython } from "../../../scripts/catalog-python";
import { CATALOG_TABLES, readCatalogAuthority, sha256 } from "../../../scripts/catalog/authority";
import type { LexicalTable } from "../../../scripts/catalog/authority";
import {
  artifactDigest,
  canonicalPendingPath,
  canonicalPublicationPaths,
  commitCanonicalPublication,
  containedPath,
  publishPreparedCanonical,
  readCanonicalPublication,
  resolveCanonicalPath,
  verifyCanonicalCompletion,
  writeDurableJson,
} from "../../../scripts/catalog/canonical-publication";

const repository = resolve(import.meta.dirname, "../../..");
function smallTables(): LexicalTable[] {
  return CATALOG_TABLES.map((config) => {
    const values = (row: Record<string, string>) => ({
      sourceOrdinal: 1,
      sourceLine: 2,
      values: config.headers.map((field) => row[field] ?? ""),
    });
    const rows =
      config.path === "works.csv"
        ? [
            values({
              id: "target",
              title: "latest title",
              genres: "action",
              recommendationEligible: "true",
              libraryOnly: "false",
              annotationReviewMethod: "authorizedEvidencePanel",
            }),
            values({ id: "other", title: "Keep other" }),
          ]
        : config.path === "factors.csv"
          ? [
              values({ workId: "target", axisId: "plot_complexity", value: "1" }),
              values({ workId: "other", axisId: "plot_complexity", value: "4" }),
            ]
          : config.path === "evidence/evidence.csv"
            ? [
                values({
                  id: "old",
                  workId: "target",
                  sourceUrl: "https://example.com/original",
                  notes: "Retained evidence",
                }),
              ]
            : [];
    return { path: config.path, headers: config.headers, rows };
  });
}
const csvRows = (text: string) =>
  z.array(z.record(z.string(), z.string())).parse(parse(text, { columns: true }));

function contextAuditFixture() {
  const reference = "reviews/authorized-evidence-panel-v1-batch-r-original.md";
  const current = Buffer.from("Original immutable review\n");
  const prior = Buffer.from("Earlier context review\n");
  const binding = {
    workId: "target",
    priorReviewReference: "reviews/prior.md",
    reviewReference: reference,
    priorContextEvidenceSha256: {},
    replacementEvidenceId: "context-evidence",
    numericContextPreserved: true,
    candidateOnly: true,
    reviewedByHuman: false,
    contextOnly: false,
  };
  const record = { ...binding, priorReviewSha256: sha256(prior) };
  const suffix =
    "\n## Recommendation context supersession\n\nThe new frozen context replaces the prior selection provenance for these works. Previous evidence and reviews remain historical records; numeric context rows are unchanged. Factor decisions remain in the separately validated ledger.\n\n```json\n" +
    JSON.stringify([record], null, 2) +
    "\n```\n";
  const evidence = smallTables().find((t) => t.path === "evidence/evidence.csv")!;
  const fields: Record<string, string> = {
    id: "context-evidence",
    workId: "target",
    notes: "accepted | contextSupersessionV1|" + JSON.stringify(binding),
  };
  evidence.rows = [
    {
      sourceOrdinal: 1,
      sourceLine: 2,
      values: evidence.headers.map((field) => fields[field] ?? ""),
    },
  ];
  return {
    reference,
    current,
    candidate: Buffer.concat([current, Buffer.from(suffix)]),
    workIds: ["target"],
    evidence,
    priorReviewSha256: () => sha256(prior),
  };
}

it("derives an immutable canonical audit alias from exact bound context additions", () => {
  const fixture = contextAuditFixture();
  const before = Buffer.from(fixture.current);
  const alias = deriveCanonicalContextAudit(fixture);
  expect(alias.canonicalReference).toBe(
    fixture.reference.replace(/\.md$/u, `-context-${sha256(fixture.candidate)}.md`),
  );
  expect(alias.currentSha256).toBe(sha256(before));
  expect(alias.candidateSha256).toBe(sha256(fixture.candidate));
  expect(fixture.current.equals(before)).toBe(true);
});

it("rejects a canonical audit alias for original review edits or arbitrary append bytes", () => {
  const fixture = contextAuditFixture();
  const edited = Buffer.from(fixture.candidate);
  edited[0] = 88;
  expect(() => deriveCanonicalContextAudit({ ...fixture, candidate: edited })).toThrow(
    "outside appended context audit",
  );
  expect(() =>
    deriveCanonicalContextAudit({
      ...fixture,
      candidate: Buffer.concat([fixture.current, Buffer.from("arbitrary")]),
    }),
  ).toThrow("Unexpected existing review append");
});

it("rejects a canonical audit alias outside its target or accepted evidence binding", () => {
  const fixture = contextAuditFixture();
  expect(() => deriveCanonicalContextAudit({ ...fixture, workIds: ["other"] })).toThrow(
    "outside exact target group",
  );
  expect(() =>
    deriveCanonicalContextAudit({ ...fixture, priorReviewSha256: () => "0".repeat(64) }),
  ).toThrow("prior review changed");
  const notes = fixture.evidence.headers.indexOf("notes");
  fixture.evidence.rows[0]!.values[notes] = fixture.evidence.rows[0]!.values[notes]!.replace(
    '"contextOnly":false',
    '"contextOnly":true',
  );
  expect(() => deriveCanonicalContextAudit(fixture)).toThrow("accepted evidence binding");
});

it("uses the most specific declared restore origin without rewriting its marker", () => {
  const temporary = mkdtempSync(join(tmpdir(), "konocomics-nested-restore-"));
  const original = join(temporary, "original");
  const firstRestore = join(original, ".workspace/first-restore");
  const restored = join(temporary, "restored");
  try {
    writeFileSync(original, "Original repository is unavailable");
    const markerPath = join(restored, ".catalog-restore.json");
    writeDurableJson(markerPath, {
      schemaVersion: "catalog-restored-workspace-v1",
      originalRepositories: [original, firstRestore],
    });
    const markerBytes = readFileSync(markerPath);
    for (const origin of [original, firstRestore])
      expect(resolveCanonicalPath(join(origin, "data/source/catalog.sqlite"), restored)).toBe(
        join(restored, "data/source/catalog.sqlite"),
      );
    expect(readFileSync(markerPath)).toEqual(markerBytes);
    expect(readFileSync(original, "utf8")).toBe("Original repository is unavailable");
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});

it("maps declared Windows and POSIX identities without host normalization or path escapes", () => {
  const root = mkdtempSync(join(tmpdir(), "konocomics-cross-os-paths-"));
  const outside = mkdtempSync(join(tmpdir(), "konocomics-cross-os-outside-"));
  try {
    const marker = join(root, ".catalog-restore.json");
    writeDurableJson(marker, {
      schemaVersion: "catalog-restored-workspace-v1",
      originalRepositories: [
        "C:\\original",
        "C:\\original\\restored",
        "/home/author/catalog",
        "\\\\server\\share\\catalog",
      ],
    });
    const originalBytes = readFileSync(marker);
    for (const path of [
      "c:/ORIGINAL/data/source/catalog.sqlite",
      "C:\\original\\restored\\data\\source\\catalog.sqlite",
      "/home/author/catalog/data/source/catalog.sqlite",
      "\\\\SERVER\\SHARE\\catalog\\data\\source\\catalog.sqlite",
    ])
      expect(resolveCanonicalPath(path, root)).toBe(join(root, "data/source/catalog.sqlite"));
    for (const path of [
      "D:\\original\\data\\source\\catalog.sqlite",
      "C:\\original-other\\data\\source\\catalog.sqlite",
      "/home/Author/catalog/data/source/catalog.sqlite",
      "C:\\original\\safe\\..\\data\\source\\catalog.sqlite",
      "/home/author/catalog/safe/../data/source/catalog.sqlite",
      "C:original\\data\\source\\catalog.sqlite",
      "\\\\?\\C:\\original\\data\\source\\catalog.sqlite",
      "C:\\original\\data\\source\\catalog.sqlite\0",
    ])
      expect(() => resolveCanonicalPath(path, root)).toThrow();
    for (const path of [
      "..\\catalog.sqlite",
      "safe/../catalog.sqlite",
      "C:\\outside\\catalog.sqlite",
      "data/source/catalog.sqlite:stream",
    ])
      expect(() => containedPath(root, path)).toThrow();
    symlinkSync(outside, join(root, "linked"), process.platform === "win32" ? "junction" : "dir");
    const linkedArtifact = resolveCanonicalPath("C:\\original\\linked", root);
    expect(linkedArtifact).toBe(containedPath(root, "linked"));
    expect(() => artifactDigest(linkedArtifact)).toThrow("symlink");
    expect(readFileSync(marker)).toEqual(originalBytes);
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(outside, { recursive: true, force: true });
  }
});

it("reads a relocated SQLite artifact while preserving foreign prepared identity bytes", () => {
  const root = mkdtempSync(join(tmpdir(), "konocomics-cross-os-sqlite-"));
  try {
    for (const [origin, rawOutput, artifactPath] of [
      ["C:\\original", "C:\\original\\.workspace\\canonical", "data\\source\\catalog.sqlite"],
      [
        "/home/author/catalog",
        "/home/author/catalog/.workspace/canonical",
        "data/source/catalog.sqlite",
      ],
    ]) {
      writeDurableJson(join(root, ".catalog-restore.json"), {
        schemaVersion: "catalog-restored-workspace-v1",
        originalRepositories: [origin],
      });
      const output = join(root, ".workspace/canonical");
      const candidate = join(output, "candidate");
      const databasePath = join(candidate, "data/source/catalog.sqlite");
      mkdirSync(dirname(databasePath), { recursive: true });
      const database = new DatabaseSync(toNamespacedPath(databasePath));
      try {
        database.exec(
          "CREATE TABLE IF NOT EXISTS preserved(value TEXT); DELETE FROM preserved; INSERT INTO preserved VALUES ('original bytes')",
        );
      } finally {
        database.close();
      }
      const checksum = sha256(readFileSync(databasePath));
      const rawPrepared = {
        schemaVersion: "catalog-canonical-publication-v1",
        root: origin,
        output: rawOutput,
        kind: "publisher-metadata",
        requestSha256: "1".repeat(64),
        workIds: ["saved-work"],
        beforeSourceManifestDigest: "2".repeat(64),
        sourceManifestDigest: "3".repeat(64),
        catalogVersion: "saved-version",
        artifacts: [{ path: artifactPath, beforeSha256: null, sha256: checksum }],
        guards: [],
      };
      const preparedPath = join(output, "prepared.json");
      writeDurableJson(preparedPath, rawPrepared);
      const preparedBytes = readFileSync(preparedPath);
      const prepared = readCanonicalPublication(preparedPath);
      expect(prepared).toEqual(rawPrepared);
      expect(canonicalPublicationPaths(prepared, preparedPath)).toEqual({ root, output });
      const actual = containedPath(candidate, prepared.artifacts[0]!.path);
      expect(sha256(readFileSync(actual))).toBe(checksum);
      const readback = new DatabaseSync(toNamespacedPath(actual), { readOnly: true });
      try {
        expect(readback.prepare("SELECT value FROM preserved").get()?.value).toBe("original bytes");
      } finally {
        readback.close();
      }
      expect(readFileSync(preparedPath)).toEqual(preparedBytes);
      expect(() =>
        canonicalPublicationPaths({ ...prepared, root: "E:\\foreign" }, preparedPath),
      ).toThrow("not a declared restore origin");
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

it("rejects output paths that overlap canonical inputs before creating preparation files", () => {
  for (const output of [
    repository,
    resolve(repository, "../../.."),
    join(repository, "data/source/accidental"),
  ]) {
    expect(() =>
      prepareCanonicalApplication({
        root: repository,
        publicationRoot: join(repository, ".workspace/unread-publication"),
        workIds: ["target"],
        output,
      }),
    ).toThrow("Publication output overlaps a protected input");
  }
});

it("merges only selected meaning while retaining latest bibliography, non-target rows, and previous evidence", () => {
  const current = smallTables();
  const candidate = structuredClone(current);
  const works = candidate.find((table) => table.path === "works.csv")!;
  works.rows[0]!.values[works.headers.indexOf("title")] = "stale title";
  works.rows[0]!.values[works.headers.indexOf("genres")] = "mystery";
  works.rows[1]!.values[works.headers.indexOf("title")] = "Unrelated candidate change";
  candidate.find((table) => table.path === "evidence/evidence.csv")!.rows = [];
  const result = mergeCanonicalTargets(current, candidate, ["target"]);
  expect(csvRows(result.get("works.csv")!)).toMatchObject([
    { id: "target", title: "latest title", genres: "mystery" },
    { id: "other", title: "Keep other" },
  ]);
  expect(csvRows(result.get("evidence/evidence.csv")!)).toMatchObject([
    { id: "old", sourceUrl: "https://example.com/original" },
  ]);
  expect(result.has("book-metadata.csv")).toBe(false);
  const evidence = candidate.find((table) => table.path === "evidence/evidence.csv")!;
  evidence.rows = structuredClone(current.find((table) => table.path === evidence.path)!.rows);
  evidence.rows[0]!.values[evidence.headers.indexOf("sourceUrl")] = "https://example.com/changed";
  expect(() => mergeCanonicalTargets(current, candidate, ["target"])).toThrow(
    "Existing evidence identity changed",
  );
  const volume = candidate.find((table) => table.path === "volumes.csv")!;
  volume.rows.push({
    sourceOrdinal: 1,
    sourceLine: 2,
    values: volume.headers.map((field) => (field === "workId" ? "target" : "new-edition")),
  });
  expect(() => mergeCanonicalTargets(current, candidate, ["target"])).toThrow(
    "Target bibliography changed",
  );
});

it("requires explicit scope authority for Library-only correction and preserves the original Work fields", () => {
  const current = smallTables();
  const works = current.find((table) => table.path === "works.csv")!;
  works.rows[0]!.values[works.headers.indexOf("onboardingEligible")] = "true";
  const candidate = structuredClone(current);
  const next = candidate.find((table) => table.path === "works.csv")!;
  for (const [field, value] of Object.entries({
    onboardingEligible: "false",
    recommendationEligible: "false",
    libraryOnly: "true",
  }))
    next.rows[0]!.values[next.headers.indexOf(field)] = value;
  expect(() => mergeCanonicalTargets(current, candidate, ["target"])).toThrow();
  const result = mergeCanonicalTargets(current, candidate, ["target"], ["target"]);
  expect(csvRows(result.get("works.csv")!)).toMatchObject([
    {
      id: "target",
      title: "latest title",
      genres: "action",
      onboardingEligible: "false",
      recommendationEligible: "false",
      libraryOnly: "true",
      annotationReviewMethod: "authorizedEvidencePanel",
    },
    { id: "other", title: "Keep other" },
  ]);
  expect(csvRows(result.get("factors.csv")!)).toMatchObject([
    { workId: "target", value: "1" },
    { workId: "other", value: "4" },
  ]);
  expect(csvRows(result.get("evidence/evidence.csv")!)).toMatchObject([
    { id: "old", notes: "Retained evidence" },
  ]);
  next.rows[0]!.values[next.headers.indexOf("genres")] = "mystery";
  expect(() => mergeCanonicalTargets(current, candidate, ["target"], ["target"])).toThrow(
    "Scope correction changed Work genres",
  );
});

it("resumes an actual pre-seal preparation from a DB-only restore without rewriting its beginning", () => {
  const temporary = mkdtempSync(join(tmpdir(), "konocomics-canonical-pre-seal-"));
  const root = join(temporary, "repository");
  const restored = join(temporary, "restored");
  const parked = join(temporary, "original");
  const publicationRoot = join(root, ".workspace/verified-publication");
  const output = join(root, ".workspace/canonical");
  const environment = {
    ...process.env,
    KONOCOMICS_CATALOG_PYTHON: catalogPython(repository),
    PYTHONPATH: join(repository, "scripts"),
    PYTHONDONTWRITEBYTECODE: "1",
  };
  try {
    for (const destination of [root, publicationRoot]) {
      mkdirSync(join(destination, "data"), { recursive: true });
      cpSync(join(repository, "data/source"), join(destination, "data/source"), {
        recursive: true,
      });
    }
    const policyPaths = [
      "docs/factors/factor-dictionary.md",
      "docs/factors/annotation-guide.md",
      "docs/catalog-expansion/02-authorized-evidence-panel-v1.md",
      "docs/planning/09-catalog-authoring-authority.md",
    ];
    const policies = policyPaths.map((path) => {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      cpSync(join(repository, path), join(root, path));
      return { path, sha256: sha256(readFileSync(join(root, path))) };
    });
    const works = readCatalogAuthority(join(root, "data/source")).find(
      (table) => table.path === "works.csv",
    )!;
    const method = works.headers.indexOf("annotationReviewMethod");
    const target = works.rows.find((row) => row.values[method] === "authorizedEvidencePanel")!;
    expect(target).toBeDefined();
    const workId = target.values[0]!;
    const sourceSha256 = artifactDigest(join(root, "data/source"));
    writeDurableJson(join(publicationRoot, "READBACK.json"), {
      status: "SQL_BUILD_COVERAGE_ENGINE_VERIFIED",
      targetWorkIds: [workId],
      catalogSha256: sha256(readFileSync(join(publicationRoot, "data/source/catalog.sqlite"))),
      canonicalSha256: sha256(readFileSync(join(root, "data/source/catalog.sqlite"))),
      executionIdentity: { schemaVersion: "catalog-readback-code-v1", files: policies },
    });
    const prepare = (activeRoot: string) =>
      spawnSync(
        process.execPath,
        [
          "--import",
          "tsx",
          join(repository, "scripts/apply-catalog-authoring-canonical.ts"),
          "--prepare-only",
          "--publication-root",
          publicationRoot,
          "--work-ids",
          JSON.stringify([workId]),
          "--output",
          output,
          "--root",
          activeRoot,
        ],
        { cwd: repository, env: environment, encoding: "utf8", windowsHide: true },
      );
    // Withhold a Git contract to interrupt the real producer after begin.json, before sealing.
    const interrupted = prepare(root);
    expect(interrupted.status).not.toBe(0);
    expect(interrupted.stderr).toContain("gold-set-manifest.json");
    const beginningBytes = readFileSync(join(output, "begin.json"));
    expect(existsSync(join(output, "prepared.json"))).toBe(false);
    const manifest = "data/staging/catalog-expansion/gold-set-manifest.json";
    mkdirSync(dirname(join(root, manifest)), { recursive: true });
    cpSync(join(repository, manifest), join(root, manifest));
    const saved = spawnSync(
      catalogPython(repository),
      [
        "-B",
        "-c",
        [
          "import json,sys; from pathlib import Path",
          "from catalog_revision_store import RevisionWorkspace",
          "repo=Path(sys.argv[1]); store=RevisionWorkspace.create(repo, repo/'data/local/catalog-authoring/workspace.sqlite')",
          "store.save([Path(path) for path in json.loads(sys.argv[2])], 'canonical:pre-seal')",
          "store.save_bytes({'unrequested/history.txt': b'Unrelated retained history'}, 'unrelated history')",
          "store.backup()",
        ].join("\n"),
        root,
        JSON.stringify([publicationRoot, output, join(root, "data/source")]),
      ],
      { cwd: root, env: environment, encoding: "utf8", windowsHide: true },
    );
    expect(saved.status, saved.stderr || saved.stdout).toBe(0);
    mkdirSync(join(root, "scripts"));
    cpSync(
      join(repository, "scripts/catalog_workspace.py"),
      join(root, "scripts/catalog_workspace.py"),
    );
    const restoration = spawnSync(
      catalogPython(repository),
      [
        "-B",
        join(root, "scripts/catalog_workspace.py"),
        "--database",
        join(root, "data/local/catalog-authoring/backups/latest.sqlite"),
        "restore",
        "--destination",
        restored,
      ],
      { cwd: root, env: environment, encoding: "utf8", windowsHide: true },
    );
    expect(restoration.status, restoration.stderr || restoration.stdout).toBe(0);
    expect(existsSync(join(restored, "data/local/catalog-authoring/workspace.sqlite"))).toBe(true);
    for (const path of [
      ".workspace",
      "data/source",
      "data/generated",
      "src",
      "public",
      "unrequested",
    ])
      expect(existsSync(join(restored, path))).toBe(false);
    // Install only the Git contracts; the existing CLI must request every saved dependency.
    for (const path of [...policyPaths, manifest]) {
      mkdirSync(dirname(join(restored, path)), { recursive: true });
      cpSync(join(repository, path), join(restored, path));
    }
    const originalTree = artifactDigest(root);
    renameSync(root, parked);
    writeFileSync(root, "Original repository is unavailable");
    const resumed = prepare(restored);
    expect(resumed.status, resumed.stderr || resumed.stdout).toBe(0);
    const restoredOutput = join(restored, ".workspace/canonical");
    expect(readFileSync(join(restoredOutput, "begin.json"))).toEqual(beginningBytes);
    const prepared = readCanonicalPublication(join(restoredOutput, "prepared.json"));
    for (const artifact of prepared.artifacts)
      expect(artifactDigest(join(restoredOutput, "candidate", artifact.path))).toBe(
        artifact.sha256,
      );
    expect(artifactDigest(join(restored, "data/source"))).toBe(sourceSha256);
    expect(existsSync(join(restored, "unrequested"))).toBe(false);
    expect(artifactDigest(parked)).toBe(originalTree);
    expect(readFileSync(root, "utf8")).toBe("Original repository is unavailable");
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}, 120_000);

// Full-catalog publication and interrupted-swap recovery run through real CLI processes.
it("publishes a rebuilt selected canonical projection and resumes an interrupted source swap through the real lock broker", () => {
  const temporary = mkdtempSync(join(tmpdir(), "konocomics-canonical-publication-"));
  const root = join(temporary, "repository");
  const publicationRoot = join(root, ".workspace/verified-publication");
  const output = join(root, ".workspace/canonical");
  const completedPointerRelative = "data/local/catalog-authoring/locks/publication.completed.json";
  const completedPointerPath = join(root, completedPointerRelative);
  const environment = {
    ...process.env,
    KONOCOMICS_CATALOG_PYTHON: catalogPython(repository),
    PYTHONPATH: join(repository, "scripts"),
    PYTHONDONTWRITEBYTECODE: "1",
  };
  const cli = (...args: string[]) =>
    spawnSync(
      process.execPath,
      [
        "--import",
        "tsx",
        join(repository, "scripts/apply-catalog-authoring-canonical.ts"),
        ...args,
      ],
      {
        cwd: repository,
        env: environment,
        encoding: "utf8",
        windowsHide: true,
        maxBuffer: 8 * 1024 * 1024,
      },
    );
  const restoreSavedOperation = (sourceRoot: string, destination: string, paths: string[]) => {
    const saved = spawnSync(
      catalogPython(repository),
      [
        "-B",
        "-c",
        [
          "import json,sys; from pathlib import Path",
          "from catalog_revision_store import RevisionWorkspace",
          "repo=Path(sys.argv[1]); database=repo/'data/local/catalog-authoring/workspace.sqlite'",
          "created=not database.is_file()",
          "store=RevisionWorkspace.create(repo,database) if created else RevisionWorkspace(repo,database)",
          "store.save([Path(path) for path in json.loads(sys.argv[2])], 'canonical:restore-input')",
          "if created: store.save_bytes({'unrequested/history.txt': b'Unrelated retained history'}, 'unrelated history')",
          "store.backup()",
        ].join("\n"),
        sourceRoot,
        JSON.stringify(paths.filter((path) => existsSync(path))),
      ],
      { cwd: sourceRoot, env: environment, encoding: "utf8", windowsHide: true },
    );
    expect(saved.status, saved.stderr || saved.stdout).toBe(0);
    mkdirSync(join(sourceRoot, "scripts"), { recursive: true });
    cpSync(
      join(repository, "scripts/catalog_workspace.py"),
      join(sourceRoot, "scripts/catalog_workspace.py"),
    );
    const restored = spawnSync(
      catalogPython(repository),
      [
        "-B",
        join(sourceRoot, "scripts/catalog_workspace.py"),
        "--database",
        join(sourceRoot, "data/local/catalog-authoring/backups/latest.sqlite"),
        "restore",
        "--destination",
        destination,
      ],
      { cwd: sourceRoot, env: environment, encoding: "utf8", windowsHide: true },
    );
    expect(restored.status, restored.stderr || restored.stdout).toBe(0);
    expect(existsSync(join(destination, "data/local/catalog-authoring/workspace.sqlite"))).toBe(
      true,
    );
    for (const name of [
      ".workspace",
      "data/source",
      "data/generated",
      "src",
      "public",
      "unrequested",
    ])
      expect(existsSync(join(destination, name))).toBe(false);
  };
  const workspaceIdentity = (restoredRoot: string) => {
    const database = new DatabaseSync(
      toNamespacedPath(join(restoredRoot, "data/local/catalog-authoring/workspace.sqlite")),
      { readOnly: true },
    );
    try {
      return {
        generation: database.prepare("SELECT value FROM store_meta WHERE key='generation'").get(),
        revisions: database.prepare("SELECT id,payload_sha256 FROM revision ORDER BY id").all(),
        heads: database
          .prepare("SELECT kind,subject,revision_id FROM head ORDER BY kind,subject")
          .all(),
        sequence: database.prepare("SELECT coalesce(max(seq),0) AS sequence FROM change_log").get(),
      };
    } finally {
      database.close();
    }
  };
  try {
    for (const destination of [root, publicationRoot]) {
      mkdirSync(join(destination, "data"), { recursive: true });
      cpSync(join(repository, "data/source"), join(destination, "data/source"), {
        recursive: true,
      });
    }
    const manifest = "data/staging/catalog-expansion/gold-set-manifest.json";
    mkdirSync(dirname(join(root, manifest)), { recursive: true });
    cpSync(join(repository, manifest), join(root, manifest));
    const policyPaths = [
      "docs/factors/factor-dictionary.md",
      "docs/factors/annotation-guide.md",
      "docs/catalog-expansion/02-authorized-evidence-panel-v1.md",
      "docs/planning/09-catalog-authoring-authority.md",
    ];
    const policyBindings = policyPaths.map((path) => {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      cpSync(join(repository, path), join(root, path));
      return { path, sha256: sha256(readFileSync(join(root, path))) };
    });
    const tables = readCatalogAuthority(join(root, "data/source"));
    const works = tables.find((table) => table.path === "works.csv")!;
    const method = works.headers.indexOf("annotationReviewMethod");
    const target = works.rows.find((row) => row.values[method] === "authorizedEvidencePanel")!;
    expect(target).toBeDefined();
    const workId = target.values[0]!;
    const title = target.values[works.headers.indexOf("title")]!;
    const genre = GENRE_TAGS.find(
      (item) => !target.values[works.headers.indexOf("genres")]!.split(";").includes(item),
    )!;
    const candidateDb = new DatabaseSync(
      toNamespacedPath(join(publicationRoot, "data/source/catalog.sqlite")),
    );
    try {
      candidateDb
        .prepare("update source_works set genres=?,title=? where id=?")
        .run(genre, "Stale candidate bibliography", workId);
      candidateDb
        .prepare("update source_works set title='Unrelated candidate mutation' where id='naruto'")
        .run();
    } finally {
      candidateDb.close();
    }
    const readbackPath = join(publicationRoot, "READBACK.json");
    const readback = {
      status: "SQL_BUILD_COVERAGE_ENGINE_VERIFIED",
      targetWorkIds: [workId],
      catalogSha256: sha256(readFileSync(join(publicationRoot, "data/source/catalog.sqlite"))),
      canonicalSha256: sha256(readFileSync(join(root, "data/source/catalog.sqlite"))),
      executionIdentity: {
        schemaVersion: "catalog-readback-code-v1",
        files: policyBindings,
      },
    };
    for (const files of [
      undefined,
      policyBindings.slice(1),
      [...policyBindings, policyBindings[0]!],
    ]) {
      writeDurableJson(readbackPath, {
        ...readback,
        executionIdentity: files ? { ...readback.executionIdentity, files } : undefined,
      });
      expect(() =>
        prepareCanonicalApplication({
          root,
          publicationRoot,
          output: `${output}-unbound-policy`,
          workIds: [workId],
        }),
      ).toThrow("Readback must bind exactly one current policy");
      expect(existsSync(`${output}-unbound-policy`)).toBe(false);
    }
    const changedPolicy = join(root, policyPaths[2]!);
    const policyBytes = readFileSync(changedPolicy);
    writeDurableJson(readbackPath, readback);
    writeFileSync(changedPolicy, Buffer.concat([policyBytes, Buffer.from("\nNew quorum: 1.\n")]));
    expect(() =>
      prepareCanonicalApplication({
        root,
        publicationRoot,
        output: `${output}-changed-policy`,
        workIds: [workId],
      }),
    ).toThrow("Canonical policy changed after batch verification");
    expect(existsSync(`${output}-changed-policy`)).toBe(false);
    writeFileSync(changedPolicy, policyBytes);
    writeDurableJson(readbackPath, { ...readback, canonicalSha256: "0".repeat(64) });
    expect(() =>
      prepareCanonicalApplication({
        root,
        publicationRoot,
        output: `${output}-stale`,
        workIds: [workId],
      }),
    ).toThrow("Canonical advanced after batch verification");
    writeDurableJson(readbackPath, readback);
    const unsealedOrigin = join(temporary, "unavailable-unsealed-origin");
    writeFileSync(unsealedOrigin, "Original private preparation is unavailable");
    writeDurableJson(join(root, ".catalog-restore.json"), {
      schemaVersion: "catalog-restored-workspace-v1",
      originalRepositories: [unsealedOrigin],
    });
    const originalPublicationRoot = join(unsealedOrigin, ".workspace/verified-publication");
    const beginningPath = join(output, "begin.json");
    writeDurableJson(beginningPath, {
      root: unsealedOrigin,
      publicationRoot: originalPublicationRoot,
      requestSha256: sha256(
        JSON.stringify({
          publicationRoot: originalPublicationRoot,
          workIds: [workId],
          readbackSha256: sha256(readFileSync(readbackPath)),
        }),
      ),
    });
    const beginningBytes = readFileSync(beginningPath);
    const incompleteCandidate = join(output, "candidate/interrupted-copy.json");
    writeDurableJson(incompleteCandidate, { incomplete: true });
    writeDurableJson(beginningPath, {
      root: unsealedOrigin,
      publicationRoot: originalPublicationRoot,
      requestSha256: "0".repeat(64),
    });
    expect(() =>
      prepareCanonicalApplication({ root, publicationRoot, output, workIds: [workId] }),
    ).toThrow("Interrupted preparation belongs to another request");
    expect(existsSync(incompleteCandidate)).toBe(true);
    writeFileSync(beginningPath, beginningBytes);
    const preparation = cli(
      "--prepare-only",
      "--publication-root",
      publicationRoot,
      "--work-ids",
      JSON.stringify([workId]),
      "--output",
      output,
      "--root",
      root,
    );
    expect(preparation.status, preparation.stderr || preparation.stdout).toBe(0);
    expect(readFileSync(beginningPath)).toEqual(beginningBytes);
    expect(existsSync(incompleteCandidate)).toBe(false);
    expect(readFileSync(unsealedOrigin, "utf8")).toBe(
      "Original private preparation is unavailable",
    );
    const preparedPath = join(output, "prepared.json");
    const prepared = readCanonicalPublication(preparedPath);
    expect(prepared.guards).toEqual(expect.arrayContaining(policyBindings));
    for (const policy of policyBindings)
      expect(artifactDigest(join(output, "policies", policy.path))).toBe(policy.sha256);
    const savedPolicy = join(output, "policies", policyPaths[2]!);
    writeFileSync(savedPolicy, "Lost policy evidence");
    expect(() => publishPreparedCanonical(preparedPath)).toThrow(
      "Prepared policy snapshot changed",
    );
    writeFileSync(savedPolicy, policyBytes);
    const preparedBytes = readFileSync(preparedPath);
    writeDurableJson(preparedPath, {
      ...prepared,
      guards: prepared.guards.filter((guard) => !policyPaths.includes(guard.path)),
    });
    expect(() =>
      prepareCanonicalApplication({ root, publicationRoot, output, workIds: [workId] }),
    ).toThrow("Existing preparation lacks current policy guard");
    expect(() => publishPreparedCanonical(preparedPath)).toThrow(
      "Unstarted adjudication publication must bind current policy",
    );
    expect(existsSync(canonicalPendingPath(root))).toBe(false);
    expect(existsSync(join(output, "completion.json"))).toBe(false);
    expect(existsSync(completedPointerPath)).toBe(false);
    for (const artifact of prepared.artifacts)
      expect(artifactDigest(join(root, artifact.path))).toBe(artifact.beforeSha256);
    writeFileSync(preparedPath, preparedBytes);
    expect(() => commitCanonicalPublication(preparedPath)).toThrow();
    const previousSource = artifactDigest(join(root, "data/source"));
    const beforeArtifacts = prepared.artifacts.map((artifact) => ({
      path: artifact.path,
      sha256: artifactDigest(join(root, artifact.path)),
    }));
    writeFileSync(changedPolicy, Buffer.concat([policyBytes, Buffer.from("\nNew quorum: 1.\n")]));
    expect(() => publishPreparedCanonical(preparedPath)).toThrow(
      "Canonical policy changed during preparation",
    );
    expect(existsSync(canonicalPendingPath(root))).toBe(false);
    expect(existsSync(join(output, "completion.json"))).toBe(false);
    for (const artifact of beforeArtifacts)
      expect(artifactDigest(join(root, artifact.path))).toBe(artifact.sha256);
    writeFileSync(changedPolicy, policyBytes);
    mkdirSync(join(output, "rollback/data"), { recursive: true });
    renameSync(join(root, "data/source"), join(output, "rollback/data/source"));
    writeDurableJson(canonicalPendingPath(root), {
      preparedPath,
      preparedSha256: sha256(readFileSync(preparedPath)),
    });
    // A process killed while copying its private publish copy must be able to repair it on retry.
    const interruptedCopy = join(output, "publish/data/generated/catalog-v1.json");
    writeFileSync(interruptedCopy, "partial copy");

    // The original path is a file, so no restored command can read or recreate its tree.
    const restoredRoot = join(temporary, "restored-repository");
    const restoredOutput = join(restoredRoot, ".workspace/canonical");
    const parkedRoot = join(temporary, "inaccessible-original");
    const pendingBytes = readFileSync(canonicalPendingPath(root));
    restoreSavedOperation(root, restoredRoot, [
      output,
      publicationRoot,
      canonicalPendingPath(root),
      ...prepared.artifacts.map((artifact) => join(root, artifact.path)),
    ]);
    // Git contracts are a separate execution environment, not authoring artifacts.
    for (const path of [...policyPaths, manifest]) {
      mkdirSync(dirname(join(restoredRoot, path)), { recursive: true });
      cpSync(join(root, path), join(restoredRoot, path));
    }
    const restoreMarkerPath = join(restoredRoot, ".catalog-restore.json");
    const restoreMarkerBytes = readFileSync(restoreMarkerPath);
    const restoreMarker = JSON.parse(restoreMarkerBytes.toString("utf8"));
    const originalDigest = artifactDigest(root);
    renameSync(root, parkedRoot);
    writeFileSync(root, "Original repository access denied");
    try {
      writeDurableJson(restoreMarkerPath, {
        ...restoreMarker,
        originalRepositories: [join(temporary, "unrelated-repository")],
      });
      const rejected = cli(
        "--verify-completion",
        join(output, "completion.json"),
        "--root",
        restoredRoot,
      );
      expect(rejected.status).not.toBe(0);
      expect(existsSync(canonicalPendingPath(restoredRoot))).toBe(false);
      writeFileSync(restoreMarkerPath, restoreMarkerBytes);
      const restoredPointerPath = join(restoredRoot, completedPointerRelative);
      // Fail the atomic pointer rename after the real effect and completion have been written.
      mkdirSync(restoredPointerPath, { recursive: true });
      const recoveryArgs = [
        "--publication-root",
        publicationRoot,
        "--work-ids",
        JSON.stringify([workId]),
        "--output",
        output,
        "--root",
        restoredRoot,
      ];
      const interruptedPointer = cli(...recoveryArgs);
      expect(interruptedPointer.status).not.toBe(0);
      expect(
        existsSync(join(restoredOutput, "completion.json")),
        interruptedPointer.stderr || interruptedPointer.stdout,
      ).toBe(true);
      expect(readFileSync(canonicalPendingPath(restoredRoot))).toEqual(pendingBytes);
      const completionBytes = readFileSync(join(restoredOutput, "completion.json"));
      for (const artifact of prepared.artifacts)
        expect(artifactDigest(join(restoredRoot, artifact.path))).toBe(artifact.sha256);
      const unfinished = cli(
        "--verify-completion",
        join(output, "completion.json"),
        "--root",
        restoredRoot,
      );
      expect(unfinished.status).not.toBe(0);
      expect(unfinished.stderr).toContain("Completion still needs locked finalization");
      rmSync(restoredPointerPath, { recursive: true });
      const resumed = cli(...recoveryArgs);
      expect(resumed.status, resumed.stderr || resumed.stdout).toBe(0);
      expect(
        existsSync(join(restoredRoot, "data/local/catalog-authoring/locks/publication.lock")),
      ).toBe(true);
      expect(existsSync(canonicalPendingPath(restoredRoot))).toBe(false);
      expect(readFileSync(join(restoredOutput, "prepared.json"))).toEqual(preparedBytes);
      expect(readFileSync(join(restoredOutput, "completion.json"))).toEqual(completionBytes);
      expect(JSON.parse(readFileSync(restoredPointerPath, "utf8"))).toEqual({
        schemaVersion: "catalog-canonical-completion-pointer-v1",
        preparedPath,
        preparedSha256: sha256(preparedBytes),
        completionPath: join(output, "completion.json"),
        completionSha256: sha256(completionBytes),
      });
      for (const artifact of prepared.artifacts) {
        expect(artifactDigest(join(restoredRoot, artifact.path))).toBe(artifact.sha256);
        expect(existsSync(join(restoredOutput, "publish", artifact.path))).toBe(false);
      }
      expect(artifactDigest(join(restoredOutput, "rollback/data/source"))).toBe(previousSource);

      // A second restore carries an already-existing immutable completion with its original paths.
      const historicalRoot = join(temporary, "historical-repository");
      const historicalOutput = join(historicalRoot, ".workspace/canonical");
      restoreSavedOperation(restoredRoot, historicalRoot, [
        restoredOutput,
        join(restoredRoot, ".workspace/verified-publication"),
        canonicalPendingPath(restoredRoot),
        join(restoredRoot, completedPointerRelative),
        ...prepared.artifacts.map((artifact) => join(restoredRoot, artifact.path)),
      ]);
      const historicalIdentity = workspaceIdentity(historicalRoot);
      const verified = cli(
        "--verify-completion",
        join(output, "completion.json"),
        "--root",
        historicalRoot,
      );
      expect(verified.status, verified.stderr || verified.stdout).toBe(0);
      expect(JSON.parse(verified.stdout)).toMatchObject({
        status: "APPLIED",
        verification: "HISTORICAL_COMPLETION",
        completionPath: join(output, "completion.json"),
      });
      expect(readFileSync(join(historicalOutput, "prepared.json"))).toEqual(preparedBytes);
      expect(readFileSync(join(historicalOutput, "completion.json"))).toEqual(completionBytes);
      expect(existsSync(join(historicalRoot, completedPointerRelative))).toBe(false);
      for (const path of ["data/source", "data/generated", "src/data/generated", "public"])
        expect(existsSync(join(historicalRoot, path))).toBe(false);
      expect(workspaceIdentity(historicalRoot)).toEqual(historicalIdentity);
      expect(existsSync(join(restoredRoot, "unrequested"))).toBe(false);
      expect(existsSync(join(historicalRoot, "unrequested"))).toBe(false);
      expect(artifactDigest(parkedRoot)).toBe(originalDigest);
      expect(readFileSync(root, "utf8")).toBe("Original repository access denied");
    } finally {
      rmSync(root);
      renameSync(parkedRoot, root);
    }
    const completed = publishPreparedCanonical(preparedPath);
    expect(completed).toMatchObject({ status: "APPLIED", readback: "PASS" });
    expect(existsSync(canonicalPendingPath(root))).toBe(false);
    expect(artifactDigest(join(output, "rollback/data/source"))).toBe(previousSource);
    for (const artifact of prepared.artifacts)
      expect(artifactDigest(join(root, artifact.path))).toBe(artifact.sha256);
    const finalTables = readCatalogAuthority(join(root, "data/source"));
    const finalWorks = finalTables.find((table) => table.path === "works.csv")!;
    const finalWork = finalWorks.rows.find((row) => row.values[0] === workId)!;
    expect(finalWork.values[works.headers.indexOf("title")]).toBe(title);
    expect(finalWork.values[works.headers.indexOf("genres")]).toBe(genre);
    const originalNaruto = works.rows.find((row) => row.values[0] === "naruto")!.values;
    expect(finalWorks.rows.find((row) => row.values[0] === "naruto")!.values).toEqual(
      originalNaruto,
    );
    const compiled = z
      .object({
        catalogVersion: z.string(),
        works: z.array(
          z.object({ id: z.string(), title: z.string(), genres: z.array(z.string()) }),
        ),
      })
      .parse(JSON.parse(readFileSync(join(root, "data/generated/catalog-v1.json"), "utf8")));
    expect(compiled.catalogVersion).toBe(prepared.catalogVersion);
    expect(compiled.works.find((row) => row.id === workId)).toMatchObject({
      title,
      genres: [genre],
    });
    expect(publishPreparedCanonical(preparedPath)).toEqual(completed);
    const completedPointerBytes = Buffer.concat([
      readFileSync(completedPointerPath),
      Buffer.from("\n"),
    ]);
    writeFileSync(completedPointerPath, completedPointerBytes);
    writeFileSync(changedPolicy, Buffer.concat([policyBytes, Buffer.from("\nNew quorum: 1.\n")]));
    expect(verifyCanonicalCompletion(join(output, "completion.json"))).toMatchObject({
      status: "APPLIED",
      verification: "HISTORICAL_COMPLETION",
    });
    expect(readFileSync(completedPointerPath)).toEqual(completedPointerBytes);
    writeFileSync(changedPolicy, policyBytes);
    const laterDb = new DatabaseSync(toNamespacedPath(join(root, "data/source/catalog.sqlite")));
    try {
      laterDb.prepare("update source_works set title=? where id=?").run(`${title} updated`, workId);
    } finally {
      laterDb.close();
    }
    expect(verifyCanonicalCompletion(join(output, "completion.json"))).toMatchObject({
      status: "APPLIED",
      verification: "HISTORICAL_COMPLETION",
    });
    expect(() => publishPreparedCanonical(preparedPath)).toThrow(
      "Published artifact readback mismatch",
    );
    expect(readFileSync(completedPointerPath)).toEqual(completedPointerBytes);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}, 480_000);
