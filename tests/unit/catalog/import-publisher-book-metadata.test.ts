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
import { join, resolve } from "node:path";
import { expect, it, vi } from "vitest";

import { catalogV1Schema } from "@/domain/catalog/schema";
import { resolveWorkBookMetadata } from "@/features/work-detail/work-detail-data";
import * as authority from "../../../scripts/catalog/authority";
import { importPublisherBookMetadata } from "../../../scripts/import-publisher-book-metadata";
import { catalogPython } from "../../../scripts/catalog-python";
import {
  artifactDigest,
  canonicalPendingPath,
  readCanonicalPublication,
} from "../../../scripts/catalog/canonical-publication";

const { readCatalogAuthority, serializeCsv, sha256 } = authority;
const repository = resolve(import.meta.dirname, "../../..");

it("adds a captured introduction without losing metadata, and rejects damaged or mismatched input before publication", () => {
  const root = mkdtempSync(join(tmpdir(), "konocomics-publisher-metadata-"));
  const restoreParent = mkdtempSync(join(tmpdir(), "konocomics-publisher-metadata-restore-"));
  const parked = `${root}-original`;
  try {
    mkdirSync(join(root, "data"));
    cpSync(resolve("data/source"), join(root, "data/source"), { recursive: true });
    const source = join(root, "data/source");
    const before = readCatalogAuthority(source);
    const oldMetadata = before.find((table) => table.path === "book-metadata.csv")!;
    const catalog = catalogV1Schema.parse(
      JSON.parse(readFileSync(resolve("data/generated/catalog-v1.json"), "utf8")),
    );
    const volume = catalog.volumes.find((entry) => !entry.metadata)!;
    const folder = join(root, "collection");
    mkdirSync(folder);
    const html = "<p>Publisher introduction</p>";
    writeFileSync(join(folder, "source.html"), html);
    const receipt = JSON.stringify({
      url: "https://example.com/book",
      resolvedUrl: "https://example.com/book",
      fetchedAt: "2026-09-12T05:21:02Z",
      status: 200,
      sha256: sha256(html),
      bytes: Buffer.byteLength(html),
    });
    writeFileSync(join(folder, "capture.json"), receipt);
    const entry = {
      metadata: {
        workId: volume.workId,
        isbn: volume.isbn,
        publisherName: "",
        itemCaption: "Publisher introduction",
        salesDate: "",
        imageUrl: "",
        imprint: "",
        pageCount: "",
      },
      sourceFile: "source.html",
      receiptFile: "capture.json",
      receiptSha256: sha256(receipt),
      captionKind: "original",
      originalItemCaption: "Publisher introduction",
    };
    const input = join(folder, "publisher-metadata.json");
    const run = (name: string) =>
      importPublisherBookMetadata(input, join(root, ".workspace", name), root);
    const databaseHash = () => sha256(readFileSync(join(source, "catalog.sqlite")));
    const originalHash = databaseHash();
    writeFileSync(input, JSON.stringify([entry, entry]));
    expect(() => run("duplicate")).toThrow("Duplicate input ISBN");
    writeFileSync(
      input,
      JSON.stringify([{ ...entry, metadata: { ...entry.metadata, workId: "wrong-work" } }]),
    );
    expect(() => run("wrong-work")).toThrow("Work/ISBN mismatch");
    writeFileSync(input, JSON.stringify([entry]));
    writeFileSync(join(folder, "source.html"), "changed capture");
    expect(() => run("damaged")).toThrow("Captured response hash mismatch");
    expect(databaseHash()).toBe(originalHash);
    writeFileSync(join(folder, "source.html"), html);
    const verify = authority.verifyCatalogAuthority;
    for (const mode of ["opaque", "publish-copy"]) {
      const output = join(root, ".workspace", mode);
      const spy = vi
        .spyOn(authority, "verifyCatalogAuthority")
        .mockImplementation((sourceRoot, options) => {
          if (
            sourceRoot === join(output, "candidate") &&
            mode === "opaque" &&
            options?.includeSourceData
          ) {
            writeFileSync(
              join(sourceRoot, "data/source/README.md"),
              "Changed candidate source document",
            );
          }
          const result = verify(sourceRoot, options);
          if (
            sourceRoot === join(output, "candidate") &&
            mode === "publish-copy" &&
            !options?.includeSourceData
          ) {
            writeFileSync(
              join(output, "publish/data/generated/catalog-v1.json"),
              "Changed publish copy",
            );
          }
          return result;
        });
      expect(() => run(mode)).toThrow(
        mode === "opaque" ? "Opaque source documents changed" : "Publish copy changed",
      );
      spy.mockRestore();
      expect(databaseHash()).toBe(originalHash);
      expect(existsSync(join(root, "data/generated/catalog-v1.json"))).toBe(false);
    }
    const inputSha256 = sha256(readFileSync(input));
    const inputChange = vi
      .spyOn(authority, "verifyCatalogAuthority")
      .mockImplementation((sourceRoot, options) => {
        if (sourceRoot === root && options?.includeSourceData)
          writeFileSync(input, "Changed after parsing");
        return verify(sourceRoot, options);
      });
    const imported = run("import");
    inputChange.mockRestore();
    expect(imported.published).toBe(true);
    expect(imported.inputSha256).toBe(inputSha256);
    expect(imported.before).not.toHaveProperty("sourceData");
    const after = readCatalogAuthority(source);
    for (const table of before) {
      const next = after.find((candidate) => candidate.path === table.path)!;
      if (table.path === oldMetadata.path) {
        expect(next.rows.slice(0, table.rows.length).map((row) => row.values)).toEqual(
          table.rows.map((row) => row.values),
        );
        expect(next.rows).toHaveLength(table.rows.length + 1);
      } else expect(sha256(serializeCsv(next))).toBe(sha256(serializeCsv(table)));
    }
    const generated = catalogV1Schema.parse(
      JSON.parse(readFileSync(join(root, "data/generated/catalog-v1.json"), "utf8")),
    );
    const work = generated.works.find((entry) => entry.id === volume.workId)!;
    const collected = generated.volumes.find((entry) => entry.id === volume.id)!;
    expect(resolveWorkBookMetadata(work, collected, { itemCaption: "  " })).toMatchObject({
      itemCaption: entry.originalItemCaption,
      captionSource: "publisher",
      captionSourceUrl: "https://example.com/book",
    });
    expect(
      resolveWorkBookMetadata(work, collected, {
        itemCaption: "Rakuten",
        itemUrl: "https://example.com/rakuten",
      }),
    ).toMatchObject({ itemCaption: "Rakuten", captionSource: "rakuten" });
    const publishedHash = databaseHash();
    writeFileSync(input, JSON.stringify([entry]));
    expect(run("import")).toMatchObject({ published: true, verification: "HISTORICAL_COMPLETION" });
    expect(run("repeat").published).toBe(false);
    expect(databaseHash()).toBe(publishedHash);

    const restored = join(restoreParent, "repository");
    const output = join(root, ".workspace/import");
    const sealedBytes = new Map(
      ["prepared.json", "completion.json", "receipt.json"].map((name) => [
        name,
        readFileSync(join(output, name)),
      ]),
    );
    writeFileSync(
      canonicalPendingPath(root),
      JSON.stringify({
        preparedPath: join(output, "prepared.json"),
        preparedSha256: sha256(sealedBytes.get("prepared.json")!),
      }),
    );
    const preservedInput = new Map(
      [input, join(folder, "capture.json"), join(folder, "source.html")].map((path) => [
        path,
        readFileSync(path),
      ]),
    );
    const environment = {
      ...process.env,
      KONOCOMICS_CATALOG_PYTHON: catalogPython(repository),
      PYTHONPATH: join(repository, "scripts"),
      PYTHONDONTWRITEBYTECODE: "1",
    };
    const savedPublication = readCanonicalPublication(join(output, "prepared.json"));
    const retainedPaths = [
      folder,
      output,
      source,
      ...savedPublication.artifacts.map((artifact) => join(root, artifact.path)),
      canonicalPendingPath(root),
      join(root, "data/local/catalog-authoring/locks/publication.completed.json"),
    ];
    const saved = spawnSync(
      catalogPython(repository),
      [
        "-B",
        "-c",
        [
          "import json,sys; from pathlib import Path",
          "from catalog_revision_store import RevisionWorkspace",
          "repo=Path(sys.argv[1]); store=RevisionWorkspace.create(repo, repo/'data/local/catalog-authoring/workspace.sqlite')",
          "store.save([Path(path) for path in json.loads(sys.argv[2])], 'metadata:restore-input')",
          "store.save_bytes({'unrequested/history.txt': b'Unrelated retained history'}, 'unrelated history')",
          "store.backup()",
        ].join("\n"),
        root,
        JSON.stringify(retainedPaths),
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
    for (const name of [
      "collection",
      ".workspace",
      "data/source",
      "data/generated",
      "src",
      "public",
      "unrequested",
    ])
      expect(existsSync(join(restored, name))).toBe(false);
    // Runtime and source code are installed separately; generated artifacts stay in the DB.
    cpSync(join(repository, "scripts"), join(restored, "scripts"), { recursive: true });
    cpSync(join(repository, "src"), join(restored, "src"), {
      recursive: true,
      filter: (path) => path !== join(repository, "src/data/generated"),
    });
    symlinkSync(join(repository, "node_modules"), join(restored, "node_modules"), "junction");
    expect(existsSync(join(restored, "src/data/generated"))).toBe(false);
    const restoredOutput = join(restored, ".workspace/import");
    const originalTree = artifactDigest(root);
    renameSync(root, parked);
    writeFileSync(root, "Original repository is unavailable");
    const metadataCli = () =>
      spawnSync(
        process.execPath,
        [
          "--import",
          "tsx",
          join(restored, "scripts/import-publisher-book-metadata.ts"),
          "--input",
          input,
          "--output",
          join(root, ".workspace/import"),
        ],
        {
          cwd: restored,
          env: environment,
          encoding: "utf8",
          windowsHide: true,
          maxBuffer: 32 * 1024 * 1024,
        },
      );
    const recovered = metadataCli();
    expect(recovered.status, recovered.stderr || recovered.stdout).toBe(0);
    expect(existsSync(canonicalPendingPath(restored))).toBe(false);
    const restoredInput = join(restored, "collection/publisher-metadata.json");
    const conflictingInput = Buffer.from("Different existing input must not be overwritten");
    writeFileSync(restoredInput, conflictingInput);
    const rejected = metadataCli();
    expect(rejected.status).not.toBe(0);
    expect(readFileSync(restoredInput)).toEqual(conflictingInput);
    expect(readFileSync(join(restoredOutput, "prepared.json"))).toEqual(
      sealedBytes.get("prepared.json"),
    );
    writeFileSync(restoredInput, preservedInput.get(input)!);
    const repeated = metadataCli();
    expect(repeated.status, repeated.stderr || repeated.stdout).toBe(0);
    expect(repeated.stdout).toContain("HISTORICAL_COMPLETION");
    for (const [name, bytes] of sealedBytes)
      expect(readFileSync(join(restoredOutput, name))).toEqual(bytes);
    for (const [path, bytes] of preservedInput)
      expect(readFileSync(join(restored, path.slice(root.length + 1)))).toEqual(bytes);
    expect(existsSync(join(restored, "unrequested"))).toBe(false);
    expect(sha256(readFileSync(join(restored, "data/source/catalog.sqlite")))).toBe(publishedHash);
    expect(artifactDigest(parked)).toBe(originalTree);
    expect(readFileSync(root, "utf8")).toBe("Original repository is unavailable");
  } finally {
    vi.restoreAllMocks();
    rmSync(root, { recursive: true, force: true });
    rmSync(parked, { recursive: true, force: true });
    rmSync(restoreParent, { recursive: true, force: true });
  }
}, 240_000);
