import { createHash } from "node:crypto";
import { appendFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { AXIS_IDS } from "@/domain/catalog/constants";
import {
  assertMinimumCatalogSize,
  buildLibraryOnlyRows,
  deriveRakutenDemographic,
  parseRakutenCacheContent,
  parseRakutenSalesDate,
  parseRakutenVolumeNumber,
  type LibraryOnlyBuildInput,
} from "../../../scripts/promote-library-only-expansion";
import { runCatalogPipeline } from "../../../scripts/catalog/pipeline";
import { writeCatalogCsvProjection } from "../../../scripts/catalog/authority";
import { validateGoldSet } from "../../../scripts/validate-catalog-expansion";

const input: LibraryOnlyBuildInput = {
  candidate: {
    candidateId: "candidate-one",
    canonicalTitleJa: "候補作品",
    titleKana: "コウホサクヒン",
    creatorsJa: "作者一;作者二",
    firstPublishedYear: "2018",
    publicationStatus: "ongoing",
  },
  workId: "candidate-one",
  match: {
    matchStatus: "matched",
    isbn: "9781234567897",
    matchedTitle: "候補作品 1",
    editionKind: "standard",
    isRepresentative: "true",
    sourceUrl: "https://books.rakuten.co.jp/rb/123/",
  },
  cacheRecord: { retrievedAt: "2026-08-22" },
  cacheItem: {
    title: "候補作品 1",
    author: "作者一",
    publisherName: "集英社",
    isbn: "9781234567897",
    booksGenreId: "001001001042",
    salesDate: "2019年03月04日",
    itemUrl: "https://books.rakuten.co.jp/rb/123/",
  },
  confidence: "0.94",
};

function csvLine(headers: readonly string[], row: Record<string, string>) {
  return `${headers
    .map((header) => {
      const value = row[header];
      if (value === undefined) throw new Error(`Missing test CSV field: ${header}`);
      return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
    })
    .join(",")}\n`;
}

describe("library-only expansion row construction", () => {
  it("requires at least 1,000 works without imposing an upper cap", () => {
    expect(() => assertMinimumCatalogSize(999)).toThrow(/at least 1000 works/u);
    expect(() => assertMinimumCatalogSize(1_000)).not.toThrow();
    expect(() => assertMinimumCatalogSize(1_001)).not.toThrow();
  });

  it("binds the Rakuten cache hash to both outcome and items", () => {
    const payload = { outcome: "ok" as const, items: [input.cacheItem] };
    const record = {
      queryKey: "candidate-one",
      queryTitle: "候補作品",
      sourceItemIds: ["source-item-one"],
      retrievedAt: "2026-08-22",
      outcome: payload.outcome,
      responseSha256: createHash("sha256")
        .update(`${JSON.stringify(payload)}\n`)
        .digest("hex"),
      items: payload.items,
    };

    expect(parseRakutenCacheContent(`${JSON.stringify(record)}\n`)).toHaveLength(1);
    expect(() =>
      parseRakutenCacheContent(
        `${JSON.stringify({
          ...record,
          responseSha256: createHash("sha256")
            .update(`${JSON.stringify(record.items)}\n`)
            .digest("hex"),
        })}\n`,
      ),
    ).toThrow(/response hash mismatch/u);
  });

  it("parses exact dates but does not invent an exact day from approximate Rakuten dates", () => {
    expect(parseRakutenSalesDate("2019年03月04日")).toEqual({
      salesYear: "2019",
      releaseDate: "2019-03-04",
    });
    expect(parseRakutenSalesDate("2019年3月頃")).toEqual({
      salesYear: "2019",
      releaseDate: "",
    });
    expect(parseRakutenSalesDate("2019年03月04日頃")).toEqual({
      salesYear: "2019",
      releaseDate: "",
    });
    expect(parseRakutenSalesDate("2019-02-31")).toEqual({
      salesYear: "",
      releaseDate: "",
    });
  });

  it("keeps the canonical Work year separate from Rakuten volume dates", () => {
    expect(parseRakutenVolumeNumber("候補作品 1")).toBe(1);
    expect(parseRakutenVolumeNumber("候補作品（02）")).toBe(2);
    expect(parseRakutenVolumeNumber("候補作品")).toBeUndefined();

    const later = buildLibraryOnlyRows({
      ...input,
      match: { ...input.match, matchedTitle: "候補作品 2" },
      cacheItem: { ...input.cacheItem, title: "候補作品 2" },
    });
    expect(later.volume.volumeNumber).toBe("2");
    expect(later.volume.releaseDate).toBe("2019-03-04");
    expect(later.work.firstPublishedYear).toBe("2018");

    const unnumbered = buildLibraryOnlyRows({
      ...input,
      match: { ...input.match, matchedTitle: "候補作品" },
      cacheItem: { ...input.cacheItem, title: "候補作品" },
    });
    expect(unnumbered.volume.volumeNumber).toBe("");
    expect(unnumbered.work.firstPublishedYear).toBe("2018");
  });

  it("maps only explicit Rakuten audience genres", () => {
    expect(deriveRakutenDemographic("001001001042")).toBe("shonen");
    expect(deriveRakutenDemographic("001001004/001001004011")).toBe("josei");
    expect(deriveRakutenDemographic("001001001/001001003")).toBe("unknown");
    expect(deriveRakutenDemographic("001001006")).toBe("unknown");
  });

  it("builds bibliographic-only rows with every taste axis unknown", () => {
    const rows = buildLibraryOnlyRows(input);

    expect(rows.work).toMatchObject({
      title: "候補作品",
      creators: "作者一;作者二",
      publisher: "集英社",
      demographic: "shonen",
      firstPublishedYear: "2018",
      genres: "",
      onboardingEligible: "false",
      recommendationEligible: "false",
      libraryOnly: "true",
      annotationReviewMethod: "unreviewed",
    });
    expect(rows.volume).toMatchObject({
      volumeNumber: "1",
      isbn: "9781234567897",
      releaseDate: "2019-03-04",
      editionKind: "standard",
      isRepresentative: "true",
    });
    expect(rows.factors).toHaveLength(AXIS_IDS.length);
    expect(rows.factors.map((factor) => factor.axisId)).toEqual(AXIS_IDS);
    expect(rows.factors.every((factor) => factor.state === "unknown")).toBe(true);
    expect(rows.evidence).toMatchObject({
      targetType: "work",
      sourceType: "rakuten",
      reviewedByHuman: "false",
    });
  });

  it("fails closed when the representative is not a standard matched edition", () => {
    expect(() =>
      buildLibraryOnlyRows({
        ...input,
        match: { ...input.match, editionKind: "bunko" },
      }),
    ).toThrow(/representative standard match/u);
  });

  it("passes the Catalog pipeline and preserves the Gold manifest in an isolated source copy", () => {
    const temporaryRoot = mkdtempSync(join(tmpdir(), "konocomics-library-only-"));
    const source = join(temporaryRoot, "data/source");
    try {
      mkdirSync(join(temporaryRoot, "data"), { recursive: true });
      writeCatalogCsvProjection(join(process.cwd(), "data/source"), source);
      const rows = buildLibraryOnlyRows(input);
      appendFileSync(
        join(source, "works.csv"),
        csvLine(
          [
            "id",
            "title",
            "titleKana",
            "creators",
            "publisher",
            "demographic",
            "status",
            "firstPublishedYear",
            "genres",
            "factorScope",
            "onboardingEligible",
            "recommendationEligible",
            "libraryOnly",
            "metadataConfidence",
            "groupingConfidence",
            "sourceAgreement",
            "annotationReviewMethod",
            "annotationReviewedAt",
            "annotationReviewReference",
            "evidenceId",
          ],
          rows.work,
        ),
      );
      appendFileSync(
        join(source, "volumes.csv"),
        csvLine(
          [
            "id",
            "workId",
            "volumeNumber",
            "isbn",
            "releaseDate",
            "editionKind",
            "isRepresentative",
            "evidenceId",
          ],
          rows.volume,
        ),
      );
      for (const factor of rows.factors) {
        appendFileSync(
          join(source, "factors.csv"),
          csvLine(["workId", "axisId", "state", "value", "confidence", "evidenceId"], factor),
        );
      }
      appendFileSync(
        join(source, "evidence/evidence.csv"),
        csvLine(
          [
            "id",
            "workId",
            "targetType",
            "targetId",
            "sourceType",
            "sourceUrl",
            "fetchedAt",
            "extractorVersion",
            "reviewedByHuman",
            "confidence",
            "notes",
          ],
          rows.evidence,
        ),
      );

      expect(
        runCatalogPipeline(source).issues.filter((issue) => issue.severity === "error"),
      ).toEqual([]);
      const manifest: unknown = JSON.parse(
        readFileSync(
          join(process.cwd(), "data/staging/catalog-expansion/gold-set-manifest.json"),
          "utf8",
        ),
      );
      expect(validateGoldSet(temporaryRoot, manifest).workCount).toBe(150);
    } finally {
      rmSync(temporaryRoot, { recursive: true, force: true });
    }
  }, 120_000);
});
