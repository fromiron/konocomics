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
import {
  assertNoPendingCanonicalPublication,
  canonicalPublicationPaths,
  publishPreparedCanonical,
  readCanonicalPublication,
  resolveCanonicalPath,
  sealCanonicalPublication,
  verifyCanonicalCompletion,
} from "./catalog/canonical-publication";
import { catalogPython, prepareRestoredCatalogOperation } from "./catalog-python";

const digest = z.string().regex(/^[a-f0-9]{64}$/u);
const httpsUrl = z.url().refine((value) => {
  const url = new URL(value);
  return url.protocol === "https:" && !url.username && !url.password;
});
const httpCaptureReceipt = z.strictObject({
  url: httpsUrl,
  resolvedUrl: httpsUrl,
  fetchedAt: z.iso.datetime({ offset: true }),
  status: z.literal(200),
  sha256: digest,
  bytes: z.number().int().positive(),
});
const browserCaptureReceipt = z.strictObject({
  kind: z.literal("browser-text"),
  url: httpsUrl,
  resolvedUrl: httpsUrl,
  observedAt: z.iso.datetime({ offset: true }),
  status: z.number().int().min(100).max(599).nullable(),
  complete: z.boolean().nullable(),
  contentType: z.string().nullable(),
  contentEncoding: z.string().nullable(),
  error: z.null(),
  recordedAt: z.iso.datetime({ offset: true }),
  rawPath: z.string().min(1),
  sha256: digest,
  bytes: z.number().int().positive(),
});
const captureReceipt = z.union([httpCaptureReceipt, browserCaptureReceipt]);
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

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&#(x[0-9a-f]+|[0-9]+);/giu, (entity, code: string) => {
      const point = Number.parseInt(code.replace(/^x/iu, ""), /^x/iu.test(code) ? 16 : 10);
      return point > 0 && point <= 0x10ffff && !(point >= 0xd800 && point <= 0xdfff)
        ? String.fromCodePoint(point)
        : entity;
    })
    .replace(/&nbsp;/giu, " ")
    .replace(/&hellip;/gu, "…")
    .replace(/&quot;/giu, '"')
    .replace(/&apos;|&#39;/giu, "'")
    .replace(/&lt;/giu, "<")
    .replace(/&gt;/giu, ">")
    .replace(/&amp;/giu, "&");
}

// Match the operator's extracted introduction to the same captured response.
// HTML cleanup changes the comparison view only, never the preserved bytes.
function captionText(value: string) {
  return decodeHtmlEntities(
    value
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, "")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, "")
      .replace(/<!--[\s\S]*?-->/gu, "")
      .replace(/<br\s*\/?>|<\/(?:p|li|h[1-6]|div|section|article|tr)>/giu, "\n")
      .replace(/<[^>]+>/gu, ""),
  )
    .replace(/\s+/gu, " ")
    .trim();
}

const shogakukanBookPage = z.object({
  component: z.literal("Books/Show"),
  props: z.object({
    book: z.object({
      isbn13_cd: z.string(),
      promo_contents: z.array(z.string().nullable()),
      promo_kbns: z.array(
        z.object({
          promo_kbn: z.number(),
          pivot: z.object({ promo_contents: z.string() }),
        }),
      ),
    }),
  }),
});

function capturedBookIntroduction(value: string, sourceUrl: string, isbn: string) {
  if (!["shogakukan.co.jp", "www.shogakukan.co.jp"].includes(new URL(sourceUrl).hostname))
    return "";
  const markup = value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, "")
    .replace(/<!--[\s\S]*?-->/gu, "");
  for (const tag of markup.matchAll(/<div\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/giu)) {
    const attributes = new Map<string, string>();
    for (const attribute of tag[0].matchAll(
      /\s([^\s"'<>/=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/gu,
    )) {
      const name = attribute[1];
      const content = attribute[2] ?? attribute[3];
      if (name !== undefined && content !== undefined)
        attributes.set(name.toLowerCase(), content);
    }
    const dataPage = attributes.get("data-page");
    if (attributes.get("id") !== "app" || !dataPage) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(decodeHtmlEntities(dataPage));
    } catch {
      continue;
    }
    const page = shogakukanBookPage.safeParse(parsed);
    if (!page.success) continue;
    const book = page.data.props.book;
    if (isbnIdentityKey(book.isbn13_cd) !== isbnIdentityKey(isbn)) continue;
    // Shogakukan's category 3 is the full introduction. Do not admit arbitrary
    // JSON strings, related books, or administrative fields as source text.
    const introduction = book.promo_contents[3];
    if (
      introduction &&
      book.promo_kbns.some(
        (category) => category.promo_kbn === 3 && category.pivot.promo_contents === introduction,
      )
    )
      return captionText(introduction);
  }
  return "";
}

function plainText(value: string) {
  return value.replace(/\s+/gu, " ").trim();
}

function readIntake(input: string, inputBytes: Buffer) {
  const folder = realpathSync(dirname(input));
  return intake.parse(JSON.parse(inputBytes.toString("utf8"))).map((entry) => {
    const receiptBytes = readFileSync(
      within(folder, realpathSync(resolve(folder, entry.receiptFile))),
    );
    assert.equal(sha256(receiptBytes), entry.receiptSha256, "Capture receipt hash mismatch");
    const receipt = captureReceipt.parse(JSON.parse(receiptBytes.toString("utf8")));
    const sourcePath = within(folder, realpathSync(resolve(folder, entry.sourceFile)));
    const source = readFileSync(sourcePath);
    assert.equal(sha256(source), receipt.sha256, "Captured response hash mismatch");
    assert.equal(source.length, receipt.bytes, "Captured response length mismatch");
    if ("kind" in receipt) {
      assert.equal(
        within(folder, realpathSync(resolve(folder, receipt.rawPath))),
        sourcePath,
        "Browser receipt names a different captured source",
      );
      const collection = z
        .object({ workId: z.string().min(1) })
        .parse(JSON.parse(readFileSync(join(folder, "collection-session.json"), "utf8")));
      assert.equal(collection.workId, entry.metadata.workId, "Browser collection Work mismatch");
      assert(
        receipt.status === null || (receipt.status >= 200 && receipt.status < 300),
        "Browser capture records an unsuccessful HTTP status",
      );
      assert(receipt.complete !== false, "Browser capture records incomplete source bytes");
    }
    if (entry.metadata.itemCaption !== undefined) {
      assert(entry.originalItemCaption.trim(), "Keep the publisher's original introduction");
      const original = plainText(entry.originalItemCaption);
      const rawText = source.toString("utf8");
      assert(
        plainText(rawText).includes(original) ||
          captionText(rawText).includes(original) ||
          capturedBookIntroduction(rawText, receipt.resolvedUrl, entry.metadata.isbn).includes(
            original,
          ),
        "Original introduction is absent from the captured source",
      );
      if (entry.captionKind === "original") {
        assert.equal(
          entry.metadata.itemCaption,
          entry.originalItemCaption.trim(),
          "Original caption must retain the extracted text",
        );
      }
    }
    return {
      ...entry.metadata,
      sourceUrl: receipt.resolvedUrl,
      fetchedAt: "kind" in receipt ? receipt.observedAt : receipt.fetchedAt,
    };
  });
}

// Only add reviewed snapshots. Refreshing an existing row needs a separate complete-source review.
export function importPublisherBookMetadata(input: string, output: string, root = process.cwd()) {
  root = resolve(root);
  input = resolveCanonicalPath(input, root);
  output = resolveCanonicalPath(output, root);
  const preparedPath = join(output, "prepared.json");
  assertNoPendingCanonicalPublication(root, preparedPath);
  within(join(root, ".workspace"), output);
  const inputBytes = readFileSync(input);
  if (existsSync(preparedPath)) {
    const prepared = readCanonicalPublication(preparedPath);
    assert.equal(
      canonicalPublicationPaths(prepared, preparedPath).root,
      root,
      "Metadata recovery root changed",
    );
    assert.equal(prepared.kind, "publisher-metadata", "Metadata recovery kind changed");
    assert.equal(prepared.requestSha256, sha256(inputBytes), "Metadata recovery input changed");
    const completionPath = join(output, "completion.json");
    const pendingPath = join(root, "data/local/catalog-authoring/locks/publication.pending.json");
    const historical = existsSync(completionPath) && !existsSync(pendingPath);
    if (historical) verifyCanonicalCompletion(completionPath);
    else publishPreparedCanonical(preparedPath);
    const report = z
      .object({ input: z.string(), inputSha256: digest, before: z.record(z.string(), z.unknown()) })
      .passthrough()
      .parse(JSON.parse(readFileSync(join(output, "receipt.json"), "utf8")));
    const result = {
      ...report,
      published: true,
      readback: "PASS",
      ...(historical ? { verification: "HISTORICAL_COMPLETION" } : {}),
    };
    if (!historical && (report.published !== true || report.readback !== "PASS"))
      writeFileSync(join(output, "receipt.json"), `${JSON.stringify(result, null, 2)}\n`);
    return result;
  }
  assert(!existsSync(output), "Use a new authoring output directory");
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
  sealCanonicalPublication(
    {
      root,
      output,
      kind: "publisher-metadata",
      requestSha256: sha256(inputBytes),
      workIds: [...new Set(rows.map((row) => row.workId))],
      beforeSourceManifestDigest: before.sourceManifestDigest,
      sourceManifestDigest: authority.sourceManifestDigest,
      catalogVersion: built.catalog.catalogVersion,
    },
    artifacts.map((artifact) => artifact.path),
  );
  publishPreparedCanonical(join(output, "prepared.json"));
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
    "Usage: node --import tsx scripts/import-publisher-book-metadata.ts --input <json> --output <new .workspace directory>",
  );
  const root = resolve(import.meta.dirname, "..");
  prepareRestoredCatalogOperation(root, {
    operation: "metadata",
    inputPath: values.input,
    outputRoot: values.output,
  });
  const input = within(root, realpathSync(resolveCanonicalPath(values.input, root)));
  const output = within(join(root, ".workspace"), resolveCanonicalPath(values.output, root));
  if (process.env.KONOCOMICS_AUTHORING_RECORDED !== "1") {
    const result = spawnSync(
      catalogPython(root),
      [
        "-X",
        "utf8",
        join(root, "scripts/catalog_workspace.py"),
        "run",
        "--label",
        "publisher-book-metadata",
        "--phase-boundary",
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
