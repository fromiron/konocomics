import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { z } from "zod";

import { isbnIdentityKey } from "../src/domain/catalog/normalize";
import { buildCatalog } from "./build-catalog";
import {
  CATALOG_BOOK_METADATA_TABLE,
  finalizeCatalogAuthorityProjection,
  serializeCsv,
  sha256,
  verifyCatalogAuthority,
  writeCatalogCsvProjection,
} from "./catalog/authority";
import { bookMetadataSourceRowSchema, volumeSourceRowSchema } from "./catalog/source-schema";
import { publishDirectorySet } from "./promote-g2-catalog";

const digest = z.string().regex(/^[a-f0-9]{64}$/u);
const httpsUrl = z.url().refine((value) => {
  const url = new URL(value);
  return url.protocol === "https:" && !url.username && !url.password;
});
const captureReceipt = z.strictObject({
  url: httpsUrl,
  resolvedUrl: httpsUrl,
  fetchedAt: z.iso.datetime({ offset: true }),
  status: z.literal(200),
  sha256: digest,
  bytes: z.number().int().positive(),
});
const intake = z
  .array(
    z.strictObject({
      metadata: bookMetadataSourceRowSchema.omit({ sourceUrl: true, fetchedAt: true }),
      sourceFile: z.string().min(1),
      receiptFile: z.string().min(1),
      receiptSha256: digest,
      captionKind: z.enum(["original", "summary"]),
      originalItemCaption: z.string(),
    }),
  )
  .min(1);

function within(parent: string, path: string) {
  const part = relative(parent, path);
  assert(
    part &&
      !isAbsolute(part) &&
      part !== ".." &&
      !part.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`),
    `Path must be inside ${parent}: ${path}`,
  );
  return path;
}

function readIntake(input: string, inputBytes: Buffer) {
  const folder = realpathSync(dirname(input));
  return intake.parse(JSON.parse(inputBytes.toString("utf8"))).map((entry) => {
    const receiptBytes = readFileSync(
      within(folder, realpathSync(resolve(folder, entry.receiptFile))),
    );
    assert.equal(sha256(receiptBytes), entry.receiptSha256, "Capture receipt hash mismatch");
    const receipt = captureReceipt.parse(JSON.parse(receiptBytes.toString("utf8")));
    const source = readFileSync(within(folder, realpathSync(resolve(folder, entry.sourceFile))));
    assert.equal(sha256(source), receipt.sha256, "Captured response hash mismatch");
    assert.equal(source.length, receipt.bytes, "Captured response length mismatch");
    if (entry.metadata.itemCaption !== undefined) {
      assert(entry.originalItemCaption.trim(), "Keep the publisher's original introduction");
      if (entry.captionKind === "original") {
        assert.equal(
          entry.metadata.itemCaption,
          entry.originalItemCaption.trim(),
          "Original caption must retain the extracted text",
        );
      }
    }
    return { ...entry.metadata, sourceUrl: receipt.resolvedUrl, fetchedAt: receipt.fetchedAt };
  });
}

// Only add reviewed snapshots. Refreshing an existing row needs a separate complete-source review.
export function importPublisherBookMetadata(input: string, output: string, root = process.cwd()) {
  input = resolve(input);
  output = resolve(output);
  root = resolve(root);
  within(join(root, ".tmp"), output);
  assert(!existsSync(output), "Use a new authoring output directory");
  const inputBytes = readFileSync(input);
  const rows = readIntake(input, inputBytes);
  const source = join(root, "data/source");
  const database = join(source, "catalog.sqlite");
  const originalDatabaseSha256 = sha256(readFileSync(database));
  const { sourceData, ...before } = verifyCatalogAuthority(root, { includeSourceData: true });
  assert(sourceData);
  const tables = sourceData.tables;
  const previousMetadata = tables.find(
    (table) => table.path === CATALOG_BOOK_METADATA_TABLE.path,
  ) ?? {
    path: CATALOG_BOOK_METADATA_TABLE.path,
    headers: CATALOG_BOOK_METADATA_TABLE.headers,
    rows: [],
  };
  const metadata = { ...previousMetadata, rows: [...previousMetadata.rows] };
  const volumes = tables.find((table) => table.path === "volumes.csv")!;
  const volumeByIsbn = new Map(
    volumes.rows.map((row) => {
      const value = volumeSourceRowSchema.parse(
        Object.fromEntries(volumes.headers.map((key, i) => [key, row.values[i]])),
      );
      return [isbnIdentityKey(value.isbn), value];
    }),
  );
  const existing = new Map(
    metadata.rows.map((row) => {
      const value = bookMetadataSourceRowSchema.parse(
        Object.fromEntries(metadata.headers.map((key, i) => [key, row.values[i]])),
      );
      const volume = volumeByIsbn.get(isbnIdentityKey(value.isbn));
      assert(volume?.workId === value.workId, "Existing metadata Work/ISBN mismatch");
      return [isbnIdentityKey(value.isbn), value];
    }),
  );
  assert.equal(existing.size, metadata.rows.length, "Duplicate existing metadata ISBN");
  const seen = new Set<string>();
  const dispositions = rows.map((row) => {
    const key = isbnIdentityKey(row.isbn);
    assert(!seen.has(key), `Duplicate input ISBN: ${row.isbn}`);
    seen.add(key);
    const volume = volumeByIsbn.get(key);
    if (volume !== undefined)
      assert.equal(volume.workId, row.workId, "Publisher metadata Work/ISBN mismatch");
    const status =
      volume === undefined
        ? "deferred-missing-volume"
        : existing.has(key)
          ? "preserved-existing-metadata"
          : row.itemCaption === undefined
            ? "skipped-empty-caption"
            : "added";
    if (status === "added") {
      metadata.rows.push({
        sourceOrdinal: metadata.rows.length + 1,
        sourceLine: metadata.rows.length + 2,
        values: CATALOG_BOOK_METADATA_TABLE.headers.map((header) => String(row[header] ?? "")),
      });
    }
    return { workId: row.workId, isbn: row.isbn, status };
  });
  mkdirSync(output, { recursive: true });
  const report = {
    input,
    inputSha256: sha256(inputBytes),
    originalDatabaseSha256,
    before,
    dispositions,
  };
  const saveReport = (result: object) =>
    writeFileSync(join(output, "receipt.json"), `${JSON.stringify(result, null, 2)}\n`);
  if (!dispositions.some((row) => row.status === "added")) {
    const result = { ...report, published: false };
    saveReport(result);
    return result;
  }

  const candidateRoot = join(output, "candidate");
  const projected = join(candidateRoot, "data/source");
  writeCatalogCsvProjection(source, projected);
  writeFileSync(join(projected, metadata.path), serializeCsv(metadata));
  finalizeCatalogAuthorityProjection(source, projected);
  const { sourceData: candidateData, ...authority } = verifyCatalogAuthority(candidateRoot, {
    includeSourceData: true,
  });
  assert(candidateData);
  assert.deepEqual(
    candidateData.opaqueFiles,
    sourceData.opaqueFiles,
    "Opaque source documents changed",
  );
  for (const table of tables) {
    if (table.path !== metadata.path) {
      assert(
        serializeCsv(table).equals(
          serializeCsv(candidateData.tables.find((entry) => entry.path === table.path)!),
        ),
        `${table.path}: unrelated source changed`,
      );
    }
  }
  const built = buildCatalog(candidateRoot, "authority", { compact: true, verify: true });
  const sources = [join(projected, "catalog.sqlite"), ...built.artifactPaths];
  const artifacts = sources.map((file) => ({
    path: relative(candidateRoot, file),
    sha256: sha256(readFileSync(file)),
  }));
  const prepared = {
    ...report,
    authority,
    catalogVersion: built.catalog.catalogVersion,
    artifacts,
    published: false,
  };
  saveReport(prepared);
  const swaps = artifacts.map((artifact) => {
    const candidate = within(output, join(output, "publish", artifact.path));
    const backup = within(output, join(output, "rollback", artifact.path));
    const destination = within(root, join(root, artifact.path));
    for (const file of [candidate, backup, destination])
      mkdirSync(dirname(file), { recursive: true });
    copyFileSync(join(candidateRoot, artifact.path), candidate);
    return { candidate, backup, output: destination };
  });
  assert.equal(
    sha256(readFileSync(database)),
    originalDatabaseSha256,
    "Canonical changed during preparation",
  );
  assert.equal(
    verifyCatalogAuthority(root).sourceManifestDigest,
    before.sourceManifestDigest,
    "Source manifest changed during preparation",
  );
  assert.equal(
    verifyCatalogAuthority(candidateRoot).sourceManifestDigest,
    authority.sourceManifestDigest,
    "Candidate source changed during preparation",
  );
  for (const [index, swap] of swaps.entries()) {
    assert.equal(
      sha256(readFileSync(swap.candidate)),
      artifacts[index]!.sha256,
      "Publish copy changed",
    );
  }
  assert.equal(
    sha256(readFileSync(database)),
    originalDatabaseSha256,
    "Canonical changed before publication",
  );
  publishDirectorySet(swaps);
  for (const artifact of artifacts) {
    assert.equal(
      sha256(readFileSync(join(root, artifact.path))),
      artifact.sha256,
      "Published artifact readback mismatch",
    );
  }
  assert.equal(verifyCatalogAuthority(root).sourceManifestDigest, authority.sourceManifestDigest);
  const result = { ...prepared, published: true, readback: "PASS" };
  saveReport(result);
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { values } = parseArgs({
    options: { input: { type: "string" }, output: { type: "string" } },
  });
  assert(
    values.input && values.output,
    "Usage: node --import tsx scripts/import-publisher-book-metadata.ts --input <json> --output <new .tmp directory>",
  );
  const root = resolve(import.meta.dirname, "..");
  const input = within(root, realpathSync(resolve(values.input)));
  const output = within(join(root, ".tmp"), resolve(values.output));
  if (process.env.KONOCOMICS_AUTHORING_RECORDED !== "1") {
    const result = spawnSync(
      "python",
      [
        "-X",
        "utf8",
        join(root, "scripts/catalog_workspace.py"),
        "run",
        "--label",
        "publisher-book-metadata",
        "--input",
        dirname(input),
        "--input",
        join(root, "data/source"),
        "--input",
        join(root, "scripts"),
        "--output",
        output,
        "--output",
        join(root, "data/source/catalog.sqlite"),
        "--",
        process.execPath,
        "--import",
        "tsx",
        process.argv[1],
        "--input",
        input,
        "--output",
        output,
      ],
      { cwd: root, stdio: "inherit", windowsHide: true },
    );
    if (result.error) throw result.error;
    process.exit(result.status ?? 1);
  }
  console.log(JSON.stringify(importPublisherBookMetadata(input, output, root)));
}
