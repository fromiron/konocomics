import { describe, expect, it } from "vitest";

import type { CatalogV1 } from "@/domain/catalog/types";
import {
  createRecommendationInputProjection,
  RECOMMENDATION_CACHE_SCHEMA_VERSION,
  RECOMMENDATION_ENGINE_VERSION,
  serializeRecommendationInput,
} from "@/domain/recommendation/input-hash";
import type { RecommendationInput } from "@/domain/recommendation/types";
import { createTestWork } from "../../helpers/catalog";
import {
  createTestAdjustments,
  createTestPolicies,
  createTestRecommendationContext,
  createTestRecord,
} from "../../helpers/recommendation";

function inputFixture(): RecommendationInput {
  const works = [
    ...["anchor-z", "negative-b", "dropped-a", "excluded-c", "hidden-e", "planned-d"].map((id) =>
      createTestWork({ id }),
    ),
    createTestWork({
      id: "library-only",
      eligibility: {
        onboardingEligible: false,
        recommendationEligible: false,
        libraryOnly: true,
      },
    }),
  ];
  const catalog: CatalogV1 = {
    schemaVersion: 1,
    catalogVersion: "v1-input-hash",
    factorDictionaryVersion: "v1",
    works,
    volumes: [],
    representativeVolumeByWorkId: {},
  };
  return {
    catalog,
    context: createTestRecommendationContext(catalog.catalogVersion),
    records: [
      createTestRecord({
        workId: "anchor-z",
        reaction: "favorite",
        positiveReasons: ["free text"],
        progress: { volume: 9 },
        updatedAt: "2026-01-01T00:00:00.000Z",
      }),
      createTestRecord({
        workId: "negative-b",
        reaction: "disliked",
        negativeReasons: ["tooDark", "tooSlow"],
      }),
      createTestRecord({
        workId: "dropped-a",
        readingState: "dropped",
        reaction: undefined,
        droppedReasons: ["genericStory"],
      }),
      createTestRecord({ workId: "excluded-c", reaction: "neutral" }),
      createTestRecord({
        workId: "hidden-e",
        readingState: "hidden",
        reaction: undefined,
      }),
      createTestRecord({
        workId: "planned-d",
        readingState: "planned",
        reaction: undefined,
      }),
      createTestRecord({
        workId: "catalog-out",
        reaction: "favorite",
        negativeReasons: ["tooStressful"],
      }),
      createTestRecord({
        workId: "library-only",
        reaction: "favorite",
        negativeReasons: ["tooDark"],
      }),
    ],
    adjustments: createTestAdjustments({
      axes: { pacing: "less", strategy: "auto" },
      themes: { combat: "exclude", adventure: "like" },
    }),
    policies: createTestPolicies({ preferHidden: true, preferVerified: true }),
  };
}

describe("recommendation input projection", () => {
  it("contains only versioned, current-catalog inputs that can affect recommendations", () => {
    expect(createRecommendationInputProjection(inputFixture())).toEqual({
      schemaVersion: 1,
      cacheSchemaVersion: RECOMMENDATION_CACHE_SCHEMA_VERSION,
      engineVersion: RECOMMENDATION_ENGINE_VERSION,
      catalogVersion: "v1-input-hash",
      anchors: [{ workId: "anchor-z", reaction: "favorite" }],
      negativeRecords: [
        { workId: "dropped-a", disposition: "dropped", reasons: ["genericStory"] },
        {
          workId: "negative-b",
          disposition: "disliked",
          reasons: ["tooDark", "tooSlow"],
        },
      ],
      adjustments: {
        axes: [{ factorId: "pacing", preference: "less" }],
        themes: [
          { factorId: "adventure", preference: "like" },
          { factorId: "combat", preference: "exclude" },
        ],
      },
      policies: {
        preferCompleted: false,
        preferHidden: true,
        preferVerified: true,
        excludeIncomplete: false,
      },
      eligibilityExclusions: ["dropped-a", "excluded-c", "hidden-e", "negative-b"],
    });
  });

  it("is invariant to permutations and ignores timestamps, progress, positive text, auto, and planned-only data", () => {
    const first = inputFixture();
    const second = structuredClone(first);
    second.catalog.works.reverse();
    second.records.reverse();
    for (const record of second.records) {
      record.updatedAt = "2099-12-31T23:59:59.000Z";
      record.progress = { volume: 999, chapter: 999 };
      record.positiveReasons = ["different free text"];
      record.negativeReasons?.reverse();
      record.droppedReasons?.reverse();
    }
    second.records.find((record) => record.workId === "planned-d")!.positiveReasons = [
      "still irrelevant",
    ];
    const catalogOut = second.records.find((record) => record.workId === "catalog-out")!;
    catalogOut.reaction = "disliked";
    catalogOut.negativeReasons = ["powerInflation"];
    second.adjustments = createTestAdjustments({
      axes: { strategy: "auto", pacing: "less" },
      themes: { adventure: "like", combat: "exclude" },
    });

    expect(serializeRecommendationInput(second)).toBe(serializeRecommendationInput(first));
  });

  it("changes for every ranking-relevant input family", () => {
    const original = inputFixture();
    const serialized = serializeRecommendationInput(original);
    const variants = [
      (() => {
        const next = structuredClone(original);
        next.catalog.catalogVersion = "v2-input-hash";
        return next;
      })(),
      (() => {
        const next = structuredClone(original);
        next.records.find((record) => record.workId === "anchor-z")!.reaction = "liked";
        return next;
      })(),
      (() => {
        const next = structuredClone(original);
        next.records.find((record) => record.workId === "negative-b")!.negativeReasons = [
          "tooComplex",
        ];
        return next;
      })(),
      (() => {
        const next = structuredClone(original);
        next.records.find((record) => record.workId === "planned-d")!.readingState = "reading";
        return next;
      })(),
      (() => {
        const next = structuredClone(original);
        next.adjustments.axes.pacing = "veryLike";
        return next;
      })(),
      ...(["preferCompleted", "preferHidden", "preferVerified", "excludeIncomplete"] as const).map(
        (policy) => {
          const next = structuredClone(original);
          next.policies[policy] = !next.policies[policy];
          return next;
        },
      ),
    ];

    for (const variant of variants) {
      expect(serializeRecommendationInput(variant)).not.toBe(serialized);
    }
  });
});
