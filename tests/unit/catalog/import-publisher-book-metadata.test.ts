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

it("imports browser snapshots with honest null HTTP fields and rejects mixed or unbound captures", () => {
  const root = mkdtempSync(join(tmpdir(), "konocomics-browser-metadata-"));
  try {
    mkdirSync(join(root, "data"));
    cpSync(join(repository, "data/source"), join(root, "data/source"), { recursive: true });
    const before = readCatalogAuthority(join(root, "data/source"));
    const catalog = catalogV1Schema.parse(
      JSON.parse(readFileSync(join(repository, "data/generated/catalog-v1.json"), "utf8")),
    );
    const volume = catalog.volumes.find((entry) => !entry.metadata)!;
    const folder = join(root, "collection");
    mkdirSync(folder);
    const body = "Same-book details\nPublisher introduction & literal <name>.\nPurchase";
    const original = "Publisher introduction & literal <name>.";
    const receipt = {
      kind: "browser-text",
      url: "https://example.com/exact-book",
      resolvedUrl: "https://example.com/exact-book",
      observedAt: "2026-10-01T09:23:02.447Z",
      status: null,
      complete: null,
      contentType: "text/plain; source=browser body.innerText",
      contentEncoding: "utf-8",
      error: null,
      recordedAt: "2026-10-01T09:23:02.499Z",
      rawPath: "capture.body",
      bytes: Buffer.byteLength(body),
      sha256: sha256(body),
    };
    const entry = {
      metadata: {
        workId: volume.workId,
        isbn: volume.isbn,
        publisherName: "",
        itemCaption: original,
        salesDate: "",
        imageUrl: "",
        imprint: "",
        pageCount: "",
      },
      sourceFile: "capture.body",
      receiptFile: "capture.json",
      receiptSha256: "",
      captionKind: "original",
      originalItemCaption: original,
    };
    const input = join(folder, "publisher-metadata.json");
    const write = (capture: object = receipt, intake: object = entry, raw = body) => {
      const bytes = JSON.stringify(capture);
      writeFileSync(join(folder, "capture.json"), bytes);
      writeFileSync(join(folder, "capture.body"), raw);
      writeFileSync(input, JSON.stringify([{ ...intake, receiptSha256: sha256(bytes) }]));
      writeFileSync(
        join(folder, "collection-session.json"),
        JSON.stringify({ workId: volume.workId }),
      );
    };
    const run = (name: string) =>
      importPublisherBookMetadata(input, join(root, ".workspace", name), root);
    const originalHash = sha256(readFileSync(join(root, "data/source/catalog.sqlite")));
    const invalid = [
      ["unsupported-kind", { ...receipt, kind: "document-text" }, entry, body],
      ["unknown-time", { ...receipt, observedAt: null }, entry, body],
      ["date-only", { ...receipt, observedAt: "2026-10-01" }, entry, body],
      ["error", { ...receipt, error: "Capture failed" }, entry, body],
      ["failed-status", { ...receipt, status: 403 }, entry, body],
      ["incomplete", { ...receipt, complete: false }, entry, body],
      ["length", { ...receipt, bytes: receipt.bytes + 1 }, entry, body],
      ["raw-hash", receipt, entry, "Changed raw body"],
      ["path", { ...receipt, rawPath: "other.body" }, entry, body],
      ["url", { ...receipt, resolvedUrl: "http://example.com/another-work" }, entry, body],
      ["credentials", { ...receipt, url: "https://secret@example.com/another-work" }, entry, body],
      [
        "wrong-work",
        receipt,
        { ...entry, metadata: { ...entry.metadata, workId: "wrong-work" } },
        body,
      ],
      [
        "wrong-isbn",
        receipt,
        { ...entry, metadata: { ...entry.metadata, isbn: "9784750339313" } },
        body,
      ],
      [
        "absent-original",
        receipt,
        {
          ...entry,
          metadata: { ...entry.metadata, itemCaption: "Another introduction" },
          originalItemCaption: "Another introduction",
        },
        body,
      ],
    ] as const;
    writeFileSync(join(folder, "other.body"), body);
    for (const [name, capture, intake, raw] of invalid) {
      write(capture, intake, raw);
      expect(() => run(name), name).toThrow();
      expect(sha256(readFileSync(join(root, "data/source/catalog.sqlite")))).toBe(originalHash);
      expect(existsSync(join(root, ".workspace", name))).toBe(false);
    }
    write();
    const actualReceiptBytes = readFileSync(join(folder, "capture.json"));
    writeFileSync(
      join(folder, "capture.json"),
      JSON.stringify({ ...receipt, url: "https://example.com/another-work" }),
    );
    expect(() => run("cross-url-receipt")).toThrow("Capture receipt hash mismatch");
    write();
    writeFileSync(
      join(folder, "collection-session.json"),
      JSON.stringify({ workId: "other-work" }),
    );
    expect(() => run("cross-work-collection")).toThrow("Browser collection Work mismatch");
    write();
    const shell = "<html><script src='/app.js'></script></html>";
    write(
      {
        url: receipt.url,
        resolvedUrl: receipt.resolvedUrl,
        fetchedAt: receipt.observedAt,
        status: 200,
        sha256: sha256(shell),
        bytes: Buffer.byteLength(shell),
      },
      entry,
      shell,
    );
    expect(() => run("http-shell-browser-intro")).toThrow("Original introduction is absent");
    write();
    const imported = run("import-browser");
    expect(imported.published).toBe(true);
    expect(readFileSync(join(folder, "capture.json"))).toEqual(actualReceiptBytes);
    expect(JSON.parse(actualReceiptBytes.toString("utf8"))).toMatchObject({
      status: null,
      complete: null,
    });
    const after = readCatalogAuthority(join(root, "data/source"));
    for (const table of before) {
      const next = after.find((candidate) => candidate.path === table.path)!;
      if (table.path === "book-metadata.csv")
        expect(next.rows.slice(0, table.rows.length).map((row) => row.values)).toEqual(
          table.rows.map((row) => row.values),
        );
      else expect(sha256(serializeCsv(next))).toBe(sha256(serializeCsv(table)));
    }
    const generated = catalogV1Schema.parse(
      JSON.parse(readFileSync(join(root, "data/generated/catalog-v1.json"), "utf8")),
    );
    const collected = generated.volumes.find((item) => item.id === volume.id)!;
    expect(collected.metadata).toMatchObject({
      itemCaption: original,
      sourceUrl: receipt.resolvedUrl,
      fetchedAt: receipt.observedAt,
    });
    expect(run("repeat-browser").published).toBe(false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}, 480_000);

it("binds HTML-normalized original text while keeping a reviewed summary separate", () => {
  const root = mkdtempSync(join(tmpdir(), "konocomics-normalized-metadata-"));
  try {
    mkdirSync(join(root, "data"));
    cpSync(join(repository, "data/source"), join(root, "data/source"), { recursive: true });
    const catalog = catalogV1Schema.parse(
      JSON.parse(readFileSync(join(repository, "data/generated/catalog-v1.json"), "utf8")),
    );
    const volume = catalog.volumes.find((item) => !item.metadata)!;
    const folder = join(root, "collection");
    mkdirSync(folder);
    const html = "<p>Publisher <em>introduction</em><br>A &amp; B &#x3042;.</p>";
    const receipt = JSON.stringify({
      url: "https://example.com/book",
      resolvedUrl: "https://example.com/book",
      fetchedAt: "2026-10-01T09:23:02Z",
      status: 200,
      sha256: sha256(html),
      bytes: Buffer.byteLength(html),
    });
    writeFileSync(join(folder, "source.html"), html);
    writeFileSync(join(folder, "capture.json"), receipt);
    const input = join(folder, "publisher-metadata.json");
    writeFileSync(
      input,
      JSON.stringify([
        {
          metadata: {
            workId: volume.workId,
            isbn: volume.isbn,
            publisherName: "",
            itemCaption: "Reviewed summary",
            salesDate: "",
            imageUrl: "",
            imprint: "",
            pageCount: "",
          },
          sourceFile: "source.html",
          receiptFile: "capture.json",
          receiptSha256: sha256(receipt),
          captionKind: "summary",
          originalItemCaption: "Publisher introduction\nA & B あ.",
        },
      ]),
    );
    expect(
      importPublisherBookMetadata(input, join(root, ".workspace/import-summary"), root).published,
    ).toBe(true);
    const generated = catalogV1Schema.parse(
      JSON.parse(readFileSync(join(root, "data/generated/catalog-v1.json"), "utf8")),
    );
    expect(generated.volumes.find((item) => item.id === volume.id)!.metadata).toMatchObject({
      itemCaption: "Reviewed summary",
    });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}, 480_000);

it("binds an escaped publisher book introduction without admitting other JSON fields", () => {
  const root = mkdtempSync(join(tmpdir(), "konocomics-inertia-metadata-"));
  try {
    mkdirSync(join(root, "data"));
    cpSync(join(repository, "data/source"), join(root, "data/source"), { recursive: true });
    const catalog = catalogV1Schema.parse(
      JSON.parse(readFileSync(join(repository, "data/generated/catalog-v1.json"), "utf8")),
    );
    const volume = catalog.volumes.find((item) => !item.metadata)!;
    const folder = join(root, "collection");
    mkdirSync(folder);
    const introduction = "<p>紹介文「全体」 &amp; &#9829;</p><p>次の段落。</p>";
    const original = "紹介文「全体」 & ♥\n次の段落。";
    const hidden = "紹介に使わない管理情報";
    const book = {
      isbn13_cd: volume.isbn,
      promo_contents: [null, null, "紹介文", introduction],
      promo_kbns: [{ promo_kbn: 3, pivot: { promo_contents: introduction } }],
      administrative_note: hidden,
    };
    const sourceHtml = (value = book) => {
      const json = JSON.stringify({ component: "Books/Show", props: { book: value } })
        .replace(/[^\x20-\x7e]/gu, (character) =>
          `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`,
        )
        .replace(/&/gu, "&amp;")
        .replace(/"/gu, "&quot;")
        .replace(/</gu, "&lt;")
        .replace(/>/gu, "&gt;");
      return `<html><div id="app" data-page="${json}"></div></html>`;
    };
    const input = join(folder, "publisher-metadata.json");
    const write = (
      html: string,
      caption = original,
      url = "https://www.shogakukan.co.jp/books/09131393",
    ) => {
      const receipt = JSON.stringify({
        url,
        resolvedUrl: url,
        fetchedAt: "2026-10-01T09:23:02Z",
        status: 200,
        sha256: sha256(html),
        bytes: Buffer.byteLength(html),
      });
      writeFileSync(join(folder, "source.html"), html);
      writeFileSync(join(folder, "capture.json"), receipt);
      writeFileSync(
        input,
        JSON.stringify([
          {
            metadata: {
              workId: volume.workId,
              isbn: volume.isbn,
              publisherName: "小学館",
              itemCaption: caption,
              salesDate: "",
              imageUrl: "",
              imprint: "",
              pageCount: "",
            },
            sourceFile: "source.html",
            receiptFile: "capture.json",
            receiptSha256: sha256(receipt),
            captionKind: "original",
            originalItemCaption: caption,
          },
        ]),
      );
      return receipt;
    };
    const run = (name: string) =>
      importPublisherBookMetadata(input, join(root, ".workspace", name), root);
    const html = sourceHtml();
    const otherIsbn = volume.isbn === "9784091865618" ? "9784091313935" : "9784091865618";
    for (const [name, raw, caption] of [
      ["hidden", html, hidden],
      ["wrong-book", sourceHtml({ ...book, isbn13_cd: otherIsbn }), original],
      ["wrong-category", sourceHtml({ ...book, promo_kbns: [] }), original],
      ["unbound-suffix", html, original + " 存在しない続き。"],
      ["script-only", `<script>${html}</script>`, original],
      ["malformed", '<div id="app" data-page="{&quot;props&quot;:"></div>', original],
    ] as const) {
      write(raw, caption);
      expect(() => run(name)).toThrow("Original introduction is absent");
      expect(existsSync(join(root, ".workspace", name))).toBe(false);
    }
    write(html, original, "https://example.com/book");
    expect(() => run("other-publisher")).toThrow("Original introduction is absent");
    const receipt = write(html);
    expect(run("import-inertia").published).toBe(true);
    expect(readFileSync(join(folder, "source.html"), "utf8")).toBe(html);
    expect(readFileSync(join(folder, "capture.json"), "utf8")).toBe(receipt);
    const generated = catalogV1Schema.parse(
      JSON.parse(readFileSync(join(root, "data/generated/catalog-v1.json"), "utf8")),
    );
    expect(generated.volumes.find((item) => item.id === volume.id)!.metadata?.itemCaption).toBe(
      original,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}, 480_000);

// Real publication, DB-only restore, and CLI resume share one full-catalog timeout.
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
    ).toMatchObject({
      itemCaption: entry.originalItemCaption,
      captionSource: "publisher",
      captionSourceUrl: "https://example.com/book",
    });
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
}, 480_000);
