import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { expect, it, vi } from "vitest";

import { catalogV1Schema } from "@/domain/catalog/schema";
import { resolveWorkBookMetadata } from "@/features/work-detail/work-detail-data";
import * as authority from "../../../scripts/catalog/authority";
import { importPublisherBookMetadata } from "../../../scripts/import-publisher-book-metadata";

const { readCatalogAuthority, serializeCsv, sha256 } = authority;

it("adds a captured introduction without losing metadata, and rejects damaged or mismatched input before publication", () => {
  const root = mkdtempSync(join(tmpdir(), "konocomics-publisher-metadata-"));
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
      importPublisherBookMetadata(input, join(root, ".tmp", name), root);
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
      const output = join(root, ".tmp", mode);
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
    expect(run("repeat").published).toBe(false);
    expect(databaseHash()).toBe(publishedHash);
  } finally {
    vi.restoreAllMocks();
    rmSync(root, { recursive: true, force: true });
  }
}, 60_000);
