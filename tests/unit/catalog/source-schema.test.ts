import { describe, expect, it } from "vitest";

import { parseCsvContent } from "../../../scripts/catalog/load-source";
import {
  factorSourceRowSchema,
  recommendationConfigSourceRowSchema,
  recommendationContextSourceRowSchema,
  themeSourceRowSchema,
  volumeSourceRowSchema,
  workSourceRowSchema,
} from "../../../scripts/catalog/source-schema";

describe("CSV diagnostics", () => {
  it("reports an invalid axis value at the exact data row and field", () => {
    const result = parseCsvContent(
      "factors.csv",
      "workId,axisId,state,value,confidence,evidenceId\nwork,progression,known,5,0.9,evidence\n",
      factorSourceRowSchema,
    );
    expect(result.issues).toEqual([
      expect.objectContaining({
        code: "CSV_ROW_INVALID",
        file: "factors.csv",
        row: 2,
        field: "value",
      }),
    ]);
  });

  it("reports an invalid theme centrality at the exact row", () => {
    const result = parseCsvContent(
      "themes.csv",
      "workId,themeId,centrality,confidence,evidenceId\nwork,adventure,3,0.9,evidence\n",
      themeSourceRowSchema,
    );
    expect(result.issues[0]).toEqual(
      expect.objectContaining({ file: "themes.csv", row: 2, field: "centrality" }),
    );
  });

  it("reports invalid work status without accepting a partial row", () => {
    const result = parseCsvContent(
      "works.csv",
      [
        "id,title,titleKana,creators,publisher,demographic,status,firstPublishedYear,genres,factorScope,onboardingEligible,recommendationEligible,libraryOnly,metadataConfidence,groupingConfidence,sourceAgreement,annotationReviewMethod,annotationReviewedAt,annotationReviewReference,evidenceId",
        "work,作品,,作者,出版社,general,finished,2020,fantasy,entry_1_3_volumes,true,true,false,0.9,0.9,0.9,unreviewed,,,evidence",
      ].join("\n"),
      workSourceRowSchema,
    );
    expect(result.rows).toEqual([]);
    expect(result.issues[0]).toEqual(
      expect.objectContaining({ file: "works.csv", row: 2, field: "status" }),
    );
  });

  it("rejects an invalid catalog ID at the source boundary", () => {
    const result = parseCsvContent(
      "works.csv",
      [
        "id,title,titleKana,creators,publisher,demographic,status,firstPublishedYear,genres,factorScope,onboardingEligible,recommendationEligible,libraryOnly,metadataConfidence,groupingConfidence,sourceAgreement,annotationReviewMethod,annotationReviewedAt,annotationReviewReference,evidenceId",
        "Invalid ID,作品,,作者,出版社,general,completed,2020,fantasy,entry_1_3_volumes,true,true,false,0.9,0.9,0.9,unreviewed,,,evidence",
      ].join("\n"),
      workSourceRowSchema,
    );
    expect(result.rows).toEqual([]);
    expect(result.issues[0]).toEqual(
      expect.objectContaining({ file: "works.csv", row: 2, field: "id" }),
    );
  });

  it("rejects an invalid ISBN checksum at the exact row", () => {
    const result = parseCsvContent(
      "volumes.csv",
      [
        "id,workId,volumeNumber,isbn,releaseDate,editionKind,isRepresentative,evidenceId",
        "work-v1,work,1,9780306406158,2020-01-01,standard,true,evidence",
      ].join("\n"),
      volumeSourceRowSchema,
    );
    expect(result.rows).toEqual([]);
    expect(result.issues[0]).toEqual(
      expect.objectContaining({ file: "volumes.csv", row: 2, field: "isbn" }),
    );
  });

  it("allows notApplicable only for motionImpact", () => {
    const result = parseCsvContent(
      "factors.csv",
      [
        "workId,axisId,state,value,confidence,evidenceId",
        "work,progression,notApplicable,,,evidence",
      ].join("\n"),
      factorSourceRowSchema,
    );
    expect(result.rows).toEqual([]);
    expect(result.issues[0]).toEqual(
      expect.objectContaining({ file: "factors.csv", row: 2, field: "state" }),
    );
  });

  it("requires timestamp and report provenance for a completed annotation review", () => {
    const result = parseCsvContent(
      "works.csv",
      [
        "id,title,titleKana,creators,publisher,demographic,status,firstPublishedYear,genres,factorScope,onboardingEligible,recommendationEligible,libraryOnly,metadataConfidence,groupingConfidence,sourceAgreement,annotationReviewMethod,annotationReviewedAt,annotationReviewReference,evidenceId",
        "work,作品,,作者,出版社,general,completed,2020,fantasy,entry_1_3_volumes,true,true,false,0.9,0.9,0.9,authorizedModelPanel,,,evidence",
      ].join("\n"),
      workSourceRowSchema,
    );
    expect(result.rows).toEqual([]);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ row: 2, field: "annotationReviewedAt" }),
        expect.objectContaining({ row: 2, field: "annotationReviewReference" }),
      ]),
    );
  });

  it("parses blank optional market values and rejects invalid recommendation context bounds", () => {
    const valid = parseCsvContent(
      "recommendation-context.csv",
      [
        "workId,catalogRole,seriesGroupId,volumeCount,reviewAverage,reviewCount",
        "work,bridge,,1,,",
      ].join("\n"),
      recommendationContextSourceRowSchema,
    );
    expect(valid.issues).toEqual([]);
    expect(valid.rows[0]?.value).toEqual({
      workId: "work",
      catalogRole: "bridge",
      seriesGroupId: undefined,
      volumeCount: 1,
      reviewAverage: undefined,
      reviewCount: undefined,
    });

    const invalid = parseCsvContent(
      "recommendation-context.csv",
      [
        "workId,catalogRole,seriesGroupId,volumeCount,reviewAverage,reviewCount",
        "work,featured,,1,5.1,-1",
      ].join("\n"),
      recommendationContextSourceRowSchema,
    );
    expect(invalid.rows).toEqual([]);
    expect(invalid.issues.map((issue) => issue.field)).toEqual(
      expect.arrayContaining(["catalogRole", "reviewAverage", "reviewCount"]),
    );
  });

  it("bounds the single recommendation config rating", () => {
    const result = parseCsvContent(
      "recommendation-config.csv",
      "catalogAverageRating\n5.1\n",
      recommendationConfigSourceRowSchema,
    );
    expect(result.rows).toEqual([]);
    expect(result.issues[0]).toEqual(
      expect.objectContaining({
        file: "recommendation-config.csv",
        row: 2,
        field: "catalogAverageRating",
      }),
    );
  });
});
