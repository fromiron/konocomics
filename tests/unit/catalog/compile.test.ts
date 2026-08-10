import { describe, expect, it } from "vitest";

import { compileCatalog } from "../../../scripts/catalog/compile";
import {
  evidenceSourceRowSchema,
  factorSourceRowSchema,
  recommendationConfigSourceRowSchema,
  recommendationContextSourceRowSchema,
  themeSourceRowSchema,
  volumeSourceRowSchema,
  workSourceRowSchema,
} from "../../../scripts/catalog/source-schema";
import type { CatalogSource, Located } from "../../../scripts/catalog/types";
import { AXIS_IDS } from "@/domain/catalog/constants";

function located<T>(file: string, row: number, value: T): Located<T> {
  return { file, row, value };
}

function createValidSource(): CatalogSource {
  const work = workSourceRowSchema.parse({
    id: "test-work",
    title: "テスト作品",
    titleKana: "",
    creators: "テスト作者",
    publisher: "テスト出版社",
    demographic: "general",
    status: "completed",
    firstPublishedYear: "2020",
    genres: "fantasy",
    factorScope: "entry_1_3_volumes",
    onboardingEligible: "true",
    recommendationEligible: "true",
    libraryOnly: "false",
    metadataConfidence: "0.9",
    groupingConfidence: "0.9",
    sourceAgreement: "0.9",
    annotationReviewMethod: "human",
    annotationReviewedAt: "2026-08-11T00:00:00+09:00",
    annotationReviewReference: "reviews/test-review.md",
    evidenceId: "test-evidence",
  });
  const volume = volumeSourceRowSchema.parse({
    id: "test-work-v1",
    workId: "test-work",
    volumeNumber: "1",
    isbn: "9780306406157",
    releaseDate: "2020-01-01",
    editionKind: "standard",
    isRepresentative: "true",
    evidenceId: "test-evidence",
  });
  const evidence = evidenceSourceRowSchema.parse({
    id: "test-evidence",
    workId: "test-work",
    targetType: "work",
    targetId: "test-work",
    sourceType: "manual",
    sourceUrl: "https://example.com/source",
    fetchedAt: "2026-08-11T00:00:00+09:00",
    extractorVersion: "",
    reviewedByHuman: "true",
    confidence: "0.9",
    notes: "Test-only evidence fixture.",
  });
  const recommendationContext = recommendationContextSourceRowSchema.parse({
    workId: "test-work",
    catalogRole: "bridge",
    seriesGroupId: "",
    volumeCount: "1",
    reviewAverage: "",
    reviewCount: "",
  });
  const recommendationConfig = recommendationConfigSourceRowSchema.parse({
    catalogAverageRating: "3.5",
  });

  return {
    works: [located("works.csv", 7, work)],
    aliases: [],
    volumes: [located("volumes.csv", 4, volume)],
    factors: AXIS_IDS.map((axisId, index) =>
      located(
        "factors.csv",
        index + 2,
        factorSourceRowSchema.parse({
          workId: "test-work",
          axisId,
          state: "known",
          value: "2",
          confidence: "0.9",
          evidenceId: "test-evidence",
        }),
      ),
    ),
    themes: [
      located(
        "themes.csv",
        3,
        themeSourceRowSchema.parse({
          workId: "test-work",
          themeId: "adventure",
          centrality: "2",
          confidence: "0.9",
          evidenceId: "test-evidence",
        }),
      ),
    ],
    recommendationContext: [located("recommendation-context.csv", 2, recommendationContext)],
    recommendationConfig: [located("recommendation-config.csv", 2, recommendationConfig)],
    evidence: [located("evidence/evidence.csv", 2, evidence)],
  };
}

describe("catalog compilation", () => {
  it("is deterministic for the same source", () => {
    const source = createValidSource();
    const first = compileCatalog(source);
    const second = compileCatalog(source);

    expect(first.issues).toEqual([]);
    expect(second.catalog).toEqual(first.catalog);
    expect(second.context).toEqual(first.context);
    expect(first.catalog.catalogVersion).toMatch(/^v1-[a-f0-9]{12}$/u);
    expect(first.context.marketSnapshot.catalogVersion).toBe(first.catalog.catalogVersion);
    expect(first.context).toEqual({
      constraintByWorkId: {
        "test-work": {
          workId: "test-work",
          catalogRole: "bridge",
          volumeCount: 1,
        },
      },
      marketSnapshot: {
        catalogVersion: first.catalog.catalogVersion,
        catalogAverageRating: 3.5,
        byWorkId: { "test-work": { workId: "test-work" } },
      },
    });
  });

  it("changes the shared version when only normalized recommendation context changes", () => {
    const source = createValidSource();
    const original = compileCatalog(source);
    const contextRow = source.recommendationContext[0];
    if (contextRow === undefined) {
      throw new Error("Expected recommendation context fixture");
    }
    source.recommendationContext[0] = {
      ...contextRow,
      value: { ...contextRow.value, catalogRole: "discovery" },
    };
    const changed = compileCatalog(source);

    expect(changed.catalog.works).toEqual(original.catalog.works);
    expect(changed.catalog.catalogVersion).not.toBe(original.catalog.catalogVersion);
    expect(changed.context.marketSnapshot.catalogVersion).toBe(changed.catalog.catalogVersion);
    expect(changed.context.constraintByWorkId["test-work"]?.catalogRole).toBe("discovery");
  });

  it("requires static recommendation metadata for every recommendation-eligible work", () => {
    const source = createValidSource();
    source.recommendationContext = [];

    expect(compileCatalog(source).issues).toContainEqual(
      expect.objectContaining({
        code: "RECOMMENDATION_CONTEXT_MISSING",
        file: "works.csv",
        row: 7,
        field: "recommendationContext",
      }),
    );
  });

  it("requires exactly one explicit recommendation config row", () => {
    const missing = createValidSource();
    missing.recommendationConfig = [];
    expect(compileCatalog(missing).issues).toContainEqual(
      expect.objectContaining({
        code: "RECOMMENDATION_CONFIG_MISSING",
        file: "recommendation-config.csv",
      }),
    );

    const duplicate = createValidSource();
    const config = duplicate.recommendationConfig[0];
    if (config === undefined) {
      throw new Error("Expected recommendation config fixture");
    }
    duplicate.recommendationConfig.push({ ...config, row: 3 });
    expect(compileCatalog(duplicate).issues).toContainEqual(
      expect.objectContaining({
        code: "DUPLICATE_RECOMMENDATION_CONFIG",
        file: "recommendation-config.csv",
        row: 3,
      }),
    );
  });

  it("locates missing evidence on the referencing CSV row", () => {
    const source = createValidSource();
    const volume = source.volumes[0];
    if (volume === undefined) {
      throw new Error("Expected the test volume fixture");
    }
    source.volumes[0] = {
      ...volume,
      value: { ...volume.value, evidenceId: "missing-evidence" },
    };

    expect(compileCatalog(source).issues).toContainEqual(
      expect.objectContaining({
        code: "EVIDENCE_MISSING",
        file: "volumes.csv",
        row: 4,
        field: "evidenceId",
      }),
    );
  });

  it("locates semantic eligibility and coverage failures on the work row", () => {
    const source = createValidSource();
    const work = source.works[0];
    if (work === undefined) {
      throw new Error("Expected the test work fixture");
    }
    source.works[0] = {
      ...work,
      value: {
        ...work.value,
        libraryOnly: true,
      },
    };
    source.factors = source.factors.filter(
      ({ value }) => !["progression", "problemSolving", "strategy"].includes(value.axisId),
    );

    const issues = compileCatalog(source).issues;
    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "ELIGIBILITY_CONFLICT", file: "works.csv", row: 7 }),
        expect.objectContaining({
          code: "COVERAGE_BELOW_THRESHOLD",
          file: "works.csv",
          row: 7,
          field: "narrative",
        }),
      ]),
    );
  });

  it("rejects eligible annotations that have not passed a review gate", () => {
    const source = createValidSource();
    const work = source.works[0];
    if (work === undefined) {
      throw new Error("Expected the test work fixture");
    }
    source.works[0] = {
      ...work,
      value: {
        ...work.value,
        annotationReviewMethod: "unreviewed",
        annotationReviewedAt: undefined,
        annotationReviewReference: undefined,
      },
    };

    expect(compileCatalog(source).issues).toContainEqual(
      expect.objectContaining({
        code: "UNREVIEWED_ELIGIBILITY",
        file: "works.csv",
        row: 7,
        field: "annotationReviewMethod",
      }),
    );
  });

  it("locates evidence target and representative-volume failures", () => {
    const source = createValidSource();
    const evidence = source.evidence[0];
    const volume = source.volumes[0];
    if (evidence === undefined || volume === undefined) {
      throw new Error("Expected evidence and volume fixtures");
    }
    source.evidence[0] = {
      ...evidence,
      value: { ...evidence.value, targetType: "axis", targetId: "progression" },
    };
    source.volumes[0] = {
      ...volume,
      value: { ...volume.value, isRepresentative: false },
    };

    expect(compileCatalog(source).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "EVIDENCE_TARGET_MISMATCH",
          file: "works.csv",
          row: 7,
          field: "evidenceId",
        }),
        expect.objectContaining({
          code: "REPRESENTATIVE_VOLUME_MISSING",
          file: "works.csv",
          row: 7,
        }),
      ]),
    );
  });
});
