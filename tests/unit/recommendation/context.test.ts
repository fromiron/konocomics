import { describe, expect, it } from "vitest";

import {
  assertRecommendationContext,
  constraintMetadataFor,
  marketSignalFor,
  validateRecommendationContext,
} from "@/domain/recommendation/context";
import { createTestCatalog, createTestWork } from "../../helpers/catalog";
import { createTestRecommendationContext } from "../../helpers/recommendation";

describe("recommendation context", () => {
  it("accepts a matching bounded context and supplies deterministic fixture fallbacks", () => {
    const catalog = createTestCatalog();
    const work = catalog.works[0];
    expect(work).toBeDefined();
    const context = createTestRecommendationContext(catalog.catalogVersion, {
      constraintByWorkId:
        work === undefined
          ? {}
          : {
              [work.id]: {
                workId: work.id,
                catalogRole: "bridge",
                volumeCount: 1,
              },
            },
    });

    expect(validateRecommendationContext(catalog, context)).toEqual([]);
    expect(() => assertRecommendationContext(catalog, context)).not.toThrow();
    expect(constraintMetadataFor("missing", context)).toEqual({
      workId: "missing",
      catalogRole: "bridge",
      volumeCount: 0,
    });
    expect(marketSignalFor("missing", context)).toEqual({ workId: "missing", reviewCount: 0 });
  });

  it("rejects missing constraint metadata for recommendation-eligible works", () => {
    const catalog = createTestCatalog();
    const context = createTestRecommendationContext(catalog.catalogVersion);

    expect(validateRecommendationContext(catalog, context)).toEqual([
      {
        field: "constraintByWorkId.test-work",
        message: "Recommendation-eligible works require constraint metadata.",
      },
    ]);
    expect(() => assertRecommendationContext(catalog, context)).toThrow(
      "constraintByWorkId.test-work",
    );
  });

  it("does not mistake inherited object keys for context metadata", () => {
    const catalog = createTestCatalog(createTestWork({ id: "constructor" }));
    const context = createTestRecommendationContext(catalog.catalogVersion);

    expect(validateRecommendationContext(catalog, context)).toContainEqual({
      field: "constraintByWorkId.constructor",
      message: "Recommendation-eligible works require constraint metadata.",
    });
    expect(constraintMetadataFor("constructor", context)).toEqual({
      workId: "constructor",
      catalogRole: "bridge",
      volumeCount: 0,
    });
    expect(marketSignalFor("constructor", context)).toEqual({
      workId: "constructor",
      reviewCount: 0,
    });
  });

  it("rejects version, key, rating, and count boundary violations", () => {
    const catalog = createTestCatalog();
    const context = createTestRecommendationContext("wrong-version", {
      constraintByWorkId: {
        wrong: { workId: "other", catalogRole: "discovery", volumeCount: -1 },
      },
      marketSnapshot: {
        catalogVersion: "wrong-version",
        catalogAverageRating: Number.NaN,
        byWorkId: {
          wrong: { workId: "other", reviewAverage: 5.1, reviewCount: 1.5 },
        },
      },
    });

    expect(validateRecommendationContext(catalog, context).map((issue) => issue.field)).toEqual([
      "marketSnapshot.catalogVersion",
      "marketSnapshot.catalogAverageRating",
      "constraintByWorkId.test-work",
      "constraintByWorkId.wrong.workId",
      "constraintByWorkId.wrong.volumeCount",
      "marketSnapshot.byWorkId.wrong.workId",
      "marketSnapshot.byWorkId.wrong.reviewAverage",
      "marketSnapshot.byWorkId.wrong.reviewCount",
    ]);
    expect(() => assertRecommendationContext(catalog, context)).toThrow(
      "Recommendation context and catalog versions must match",
    );
  });
});
