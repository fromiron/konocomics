import { describe, expect, it } from "vitest";

import { GENRE_TAGS, THEME_TAGS } from "@/domain/catalog/constants";
import type { CatalogV1, GenreTag, ThemeTag, Work } from "@/domain/catalog/types";
import {
  BASELINE_VERSION,
  calculateGenreJaccard,
  rankBaselineRecommendations,
} from "@/domain/recommendation/baseline";
import { calculateBayesianRating, calculateMaturity } from "@/domain/recommendation/market";
import { roundScore } from "@/domain/recommendation/math";
import type {
  RecommendationConstraintMetadata,
  RecommendationInput,
  RecommendationWorkMarketSignal,
} from "@/domain/recommendation/types";
import { createTestAxes, createTestWork } from "../../helpers/catalog";
import {
  createTestAdjustments,
  createTestPolicies,
  createTestRecord,
} from "../../helpers/recommendation";

function catalogWith(works: Work[], catalogVersion = "v1-baseline-test"): CatalogV1 {
  return {
    schemaVersion: 1,
    catalogVersion,
    factorDictionaryVersion: "v1",
    works,
    volumes: [],
    representativeVolumeByWorkId: {},
  };
}

function inputWith(options: {
  works: Work[];
  records: RecommendationInput["records"];
  adjustments?: RecommendationInput["adjustments"];
  policies?: RecommendationInput["policies"];
  catalogAverageRating?: number;
  constraints?: RecommendationConstraintMetadata[];
  marketSignals?: RecommendationWorkMarketSignal[];
}): RecommendationInput {
  const catalog = catalogWith(options.works);
  const constraintOverrides = new Map(
    options.constraints?.map((metadata) => [metadata.workId, metadata]),
  );
  const constraintByWorkId = Object.fromEntries(
    options.works
      .filter((work) => work.eligibility.recommendationEligible)
      .map((work) => [
        work.id,
        constraintOverrides.get(work.id) ?? {
          workId: work.id,
          catalogRole: "bridge" as const,
          volumeCount: 0,
        },
      ]),
  );

  return {
    catalog,
    records: options.records,
    adjustments: options.adjustments ?? createTestAdjustments(),
    policies: options.policies ?? createTestPolicies(),
    context: {
      constraintByWorkId,
      marketSnapshot: {
        catalogVersion: catalog.catalogVersion,
        catalogAverageRating: options.catalogAverageRating ?? 3.5,
        byWorkId: Object.fromEntries(
          (options.marketSignals ?? []).map((signal) => [signal.workId, signal]),
        ),
      },
    },
  };
}

function positiveRecord(workId: string, reaction: "favorite" | "liked" = "favorite") {
  return createTestRecord({ workId, reaction, readingState: "completed" });
}

describe("Baseline v1 Genre matching", () => {
  it("uses set Jaccard for identical, disjoint, one-third, empty, and duplicate tags", () => {
    expect(calculateGenreJaccard(["fantasy"], ["fantasy"])).toBe(1);
    expect(calculateGenreJaccard(["fantasy"], ["action"])).toBe(0);
    expect(calculateGenreJaccard(["fantasy", "action"], ["fantasy", "comedy"])).toBe(1 / 3);
    expect(calculateGenreJaccard([], ["fantasy"])).toBe(0);
    expect(calculateGenreJaccard([], [])).toBe(0);
    expect(calculateGenreJaccard(["fantasy", "fantasy"], ["fantasy"])).toBe(1);
  });

  it("publishes the frozen version and the .54/.50 favorite-liked goldens", () => {
    const anchor = createTestWork({ id: "anchor", genres: ["fantasy", "comedy"] });
    const candidate = createTestWork({ id: "candidate", genres: ["fantasy", "action"] });
    const run = (reaction: "favorite" | "liked") =>
      rankBaselineRecommendations(
        inputWith({
          works: [anchor, candidate],
          records: [positiveRecord(anchor.id, reaction)],
          catalogAverageRating: 3,
          constraints: [
            { workId: anchor.id, catalogRole: "bridge", volumeCount: 0 },
            { workId: candidate.id, catalogRole: "bridge", volumeCount: 15 },
          ],
          marketSignals: [{ workId: candidate.id, reviewAverage: 5, reviewCount: 20 }],
        }),
      )[0];

    expect(BASELINE_VERSION).toBe("v1");
    expect(run("favorite")).toEqual({
      workId: "candidate",
      baselineScore: 0.54,
      bestAnchorId: "anchor",
      genreScore: 0.333333333333,
      bayesianRating: 4,
      maturity: 1,
      contributions: [
        {
          source: "market",
          group: "overall",
          factorId: "bayesianRating",
          value: 0.24,
          anchorWorkIds: [],
          explainable: true,
        },
        {
          source: "genre",
          group: "genre",
          factorId: "fantasy",
          value: 0.2,
          anchorWorkIds: ["anchor"],
          explainable: true,
        },
        {
          source: "maturity",
          group: "overall",
          factorId: "maturity",
          value: 0.1,
          anchorWorkIds: [],
          explainable: true,
        },
      ],
    });
    expect(run("liked")?.baselineScore).toBe(0.5);
    expect(run("liked")?.genreScore).toBe(0.266666666667);
  });

  it("selects the maximum anchor and resolves a one-ULP reaction tie by work id", () => {
    const candidate = createTestWork({
      id: "candidate",
      genres: ["action", "fantasy", "mystery"],
    });
    const anchorA = createTestWork({
      id: "anchor-a",
      genres: ["action", "fantasy", "mystery", "comedy", "historical"],
    });
    const anchorZ = createTestWork({
      id: "anchor-z",
      genres: ["action", "fantasy", "mystery", "sports"],
    });
    const tied = rankBaselineRecommendations(
      inputWith({
        works: [anchorZ, candidate, anchorA],
        records: [positiveRecord(anchorZ.id, "liked"), positiveRecord(anchorA.id, "favorite")],
        catalogAverageRating: 0,
      }),
    )[0];
    const exactAnchor = createTestWork({ id: "anchor-exact", genres: candidate.genres });
    const maximum = rankBaselineRecommendations(
      inputWith({
        works: [anchorA, candidate, exactAnchor],
        records: [positiveRecord(anchorA.id), positiveRecord(exactAnchor.id)],
        catalogAverageRating: 0,
      }),
    )[0];

    expect((3 / 4) * 0.8).toBeGreaterThan(3 / 5);
    expect(tied?.bestAnchorId).toBe("anchor-a");
    expect(tied?.genreScore).toBe(0.6);
    expect(maximum?.bestAnchorId).toBe("anchor-exact");
    expect(maximum?.genreScore).toBe(1);
  });

  it("returns an empty list without anchors and keeps zero-overlap cap keys unique", () => {
    const anchor = createTestWork({ id: "anchor", genres: ["fantasy"] });
    const candidates = ["action", "comedy", "historical", "mystery", "sports"].map((genre) =>
      createTestWork({ id: `candidate-${genre}`, genres: [genre as GenreTag], themes: [] }),
    );

    expect(
      rankBaselineRecommendations(
        inputWith({ works: candidates, records: [], catalogAverageRating: 0 }),
      ),
    ).toEqual([]);

    const results = rankBaselineRecommendations(
      inputWith({
        works: [anchor, ...candidates],
        records: [positiveRecord(anchor.id)],
        catalogAverageRating: 0,
      }),
    );
    expect(results).toHaveLength(5);
    expect(
      results.every(
        (result) =>
          result.bestAnchorId === null &&
          result.genreScore === 0 &&
          result.contributions.every((entry) => entry.source !== "genre"),
      ),
    ).toBe(true);
  });
});

describe("Baseline v1 score ledger", () => {
  it("keeps missing market prior-only, omits zero terms, and q12s every public number", () => {
    const anchor = createTestWork({ id: "anchor", genres: ["fantasy"] });
    const candidate = createTestWork({ id: "candidate", genres: ["action"] });
    const priorOnly = rankBaselineRecommendations(
      inputWith({
        works: [anchor, candidate],
        records: [positiveRecord(anchor.id)],
        catalogAverageRating: 3.5,
      }),
    )[0];
    const zero = rankBaselineRecommendations(
      inputWith({
        works: [anchor, candidate],
        records: [positiveRecord(anchor.id)],
        catalogAverageRating: 0,
        marketSignals: [{ workId: candidate.id, reviewAverage: 0, reviewCount: 20 }],
      }),
    )[0];
    const rawBayesian = calculateBayesianRating(4.000000000001, 1, 3.5);
    const rawMaturity = calculateMaturity(2);
    const rounded = rankBaselineRecommendations(
      inputWith({
        works: [anchor, candidate],
        records: [positiveRecord(anchor.id)],
        constraints: [
          { workId: anchor.id, catalogRole: "bridge", volumeCount: 0 },
          { workId: candidate.id, catalogRole: "bridge", volumeCount: 2 },
        ],
        marketSignals: [{ workId: candidate.id, reviewAverage: 4.000000000001, reviewCount: 1 }],
      }),
    )[0];

    expect(priorOnly?.contributions).toEqual([
      {
        source: "market",
        group: "overall",
        factorId: "bayesianRating",
        value: 0.21,
        anchorWorkIds: [],
        explainable: false,
      },
    ]);
    expect(zero).toMatchObject({ baselineScore: 0, genreScore: 0, bayesianRating: 0, maturity: 0 });
    expect(zero?.contributions).toEqual([]);
    expect(rounded?.bayesianRating).toBe(roundScore(rawBayesian));
    expect(rounded?.maturity).toBe(roundScore(rawMaturity));
    expect(rounded?.baselineScore).toBe(roundScore(0.3 * (rawBayesian / 5) + 0.1 * rawMaturity));
    expect(rounded?.contributions.every((entry) => entry.value === roundScore(entry.value))).toBe(
      true,
    );
  });

  it("keeps the rounded ledger within the public score tolerance", () => {
    const anchor = createTestWork({ id: "anchor", genres: ["fantasy", "comedy"] });
    const candidate = createTestWork({ id: "candidate", genres: ["fantasy", "action"] });
    const result = rankBaselineRecommendations(
      inputWith({
        works: [anchor, candidate],
        records: [positiveRecord(anchor.id, "liked")],
        catalogAverageRating: 3.123456789012,
        constraints: [
          { workId: anchor.id, catalogRole: "bridge", volumeCount: 0 },
          { workId: candidate.id, catalogRole: "bridge", volumeCount: 7 },
        ],
        marketSignals: [{ workId: candidate.id, reviewAverage: 4.765432109876, reviewCount: 37 }],
      }),
    )[0];
    const ledgerTotal = result?.contributions.reduce((sum, entry) => sum + entry.value, 0) ?? 0;

    expect(Math.abs(ledgerTotal - (result?.baselineScore ?? 0))).toBeLessThanOrEqual(1e-11);
  });
});

describe("Baseline v1 input and eligibility", () => {
  it("shares candidate exclusions and hard excludes while retaining planned and ongoing works", () => {
    const anchor = createTestWork({ id: "anchor" });
    const ineligible = createTestWork({
      id: "ineligible",
      eligibility: {
        onboardingEligible: true,
        recommendationEligible: false,
        libraryOnly: false,
      },
    });
    const axisExcluded = createTestWork({
      id: "axis-excluded",
      axes: createTestAxes({ strategy: { state: "known", value: 3, confidence: 0.9 } }),
    });
    const centralTheme = createTestWork({
      id: "central-theme",
      themes: [{ id: "combat", centrality: 2, confidence: 0.9 }],
    });
    const softTheme = createTestWork({
      id: "soft-theme",
      themes: [{ id: "combat", centrality: 1, confidence: 0.9 }],
    });
    const works = [
      anchor,
      createTestWork({ id: "reading" }),
      createTestWork({ id: "completed" }),
      createTestWork({ id: "dropped" }),
      createTestWork({ id: "hidden" }),
      createTestWork({ id: "disliked" }),
      ineligible,
      axisExcluded,
      centralTheme,
      softTheme,
      createTestWork({ id: "planned" }),
      createTestWork({ id: "ongoing", status: "ongoing" }),
      createTestWork({ id: "constructor" }),
    ];
    const records = [
      positiveRecord(anchor.id),
      createTestRecord({ workId: "reading", reaction: "neutral", readingState: "reading" }),
      createTestRecord({ workId: "completed", reaction: "neutral", readingState: "completed" }),
      createTestRecord({ workId: "dropped", reaction: "neutral", readingState: "dropped" }),
      createTestRecord({ workId: "hidden", reaction: "neutral", readingState: "hidden" }),
      createTestRecord({ workId: "disliked", reaction: "disliked", readingState: "planned" }),
      createTestRecord({ workId: "planned", reaction: "neutral", readingState: "planned" }),
      positiveRecord("catalog-out"),
    ];
    const results = rankBaselineRecommendations(
      inputWith({
        works,
        records,
        adjustments: createTestAdjustments({
          axes: { strategy: "exclude" },
          themes: { combat: "exclude" },
        }),
      }),
    );

    expect(results.map((result) => result.workId)).toEqual([
      "constructor",
      "ongoing",
      "planned",
      "soft-theme",
    ]);
    expect(results.every((result) => result.bestAnchorId === anchor.id)).toBe(true);
  });

  it("ignores soft adjustments and negative reasons in Baseline scoring", () => {
    const anchor = createTestWork({ id: "anchor" });
    const negative = createTestWork({ id: "negative" });
    const candidate = createTestWork({
      id: "candidate",
      axes: createTestAxes({ progression: { state: "known", value: 4, confidence: 0.9 } }),
    });
    const base = inputWith({
      works: [anchor, negative, candidate],
      records: [
        positiveRecord(anchor.id),
        createTestRecord({
          workId: negative.id,
          reaction: "disliked",
          readingState: "completed",
        }),
      ],
    });
    const adjusted = inputWith({
      works: [anchor, negative, candidate],
      records: [
        positiveRecord(anchor.id),
        createTestRecord({
          workId: negative.id,
          reaction: "disliked",
          readingState: "completed",
          negativeReasons: ["tooDark"],
        }),
      ],
      adjustments: createTestAdjustments({ axes: { progression: "veryLike" } }),
    });

    expect(rankBaselineRecommendations(adjusted)).toEqual(rankBaselineRecommendations(base));
  });

  it.each(["preferCompleted", "preferHidden", "preferVerified", "excludeIncomplete"] as const)(
    "rejects non-default policy %s",
    (policy) => {
      const anchor = createTestWork({ id: "anchor" });
      const candidate = createTestWork({ id: "candidate" });
      const input = inputWith({
        works: [anchor, candidate],
        records: [positiveRecord(anchor.id)],
        policies: createTestPolicies({ [policy]: true }),
      });

      expect(() => rankBaselineRecommendations(input)).toThrow(
        `Baseline v1 requires ${policy}=false.`,
      );
    },
  );

  it("rejects duplicate records and invalid recommendation context", () => {
    const anchor = createTestWork({ id: "anchor" });
    const candidate = createTestWork({ id: "candidate" });
    const duplicate = inputWith({
      works: [anchor, candidate],
      records: [positiveRecord(anchor.id), positiveRecord(anchor.id)],
    });
    const mismatched = inputWith({
      works: [anchor, candidate],
      records: [positiveRecord(anchor.id)],
    });
    mismatched.context.marketSnapshot.catalogVersion = "wrong-version";
    const incomplete = inputWith({
      works: [anchor, candidate],
      records: [positiveRecord(anchor.id)],
    });
    delete incomplete.context.constraintByWorkId.candidate;

    expect(() => rankBaselineRecommendations(duplicate)).toThrow(
      "Duplicate user work record: anchor",
    );
    expect(() => rankBaselineRecommendations(mismatched)).toThrow(
      "Recommendation context and catalog versions must match.",
    );
    expect(() => rankBaselineRecommendations(incomplete)).toThrow(
      "Recommendation-eligible works require constraint metadata.",
    );
  });
});

describe("Baseline v1 ordering and D13 constraints", () => {
  it("sorts by public q12 score then work id and is invariant to input/map order", () => {
    const anchor = createTestWork({ id: "anchor", genres: ["fantasy"] });
    const candidates = ["z", "b", "a"].map((id) =>
      createTestWork({ id, genres: ["action"], themes: [] }),
    );
    const signals: RecommendationWorkMarketSignal[] = [
      { workId: "a", reviewAverage: 4, reviewCount: 1 },
      { workId: "z", reviewAverage: 4.000000000001, reviewCount: 1 },
      { workId: "b", reviewAverage: 4.0000001, reviewCount: 1 },
    ];
    const forward = inputWith({
      works: [anchor, ...candidates],
      records: [positiveRecord(anchor.id)],
      marketSignals: signals,
    });
    const reversed = inputWith({
      works: [...candidates, anchor].reverse(),
      records: [positiveRecord(anchor.id)],
      marketSignals: [...signals].reverse(),
    });

    expect(rankBaselineRecommendations(forward).map((result) => result.workId)).toEqual([
      "b",
      "a",
      "z",
    ]);
    expect(rankBaselineRecommendations(reversed)).toEqual(rankBaselineRecommendations(forward));
    expect(rankBaselineRecommendations(forward)[1]?.baselineScore).toBe(
      rankBaselineRecommendations(forward)[2]?.baselineScore,
    );
  });

  it("shares anchor, major Theme, and series caps without grouping zero-overlap candidates", () => {
    const anchor = createTestWork({ id: "anchor", genres: ["fantasy"] });
    const sameAnchor = Array.from({ length: 5 }, (_, index) =>
      createTestWork({ id: `anchor-candidate-${index}`, genres: ["fantasy"], themes: [] }),
    );
    const sameTheme = Array.from({ length: 4 }, (_, index) =>
      createTestWork({
        id: `theme-candidate-${index}`,
        genres: ["fantasy"],
        themes: [{ id: "combat", centrality: 2, confidence: 0.9 }],
      }),
    );
    const sameSeries = ["series-a", "series-b"].map((id) =>
      createTestWork({ id, genres: ["fantasy"], themes: [] }),
    );
    const records = [positiveRecord(anchor.id)];

    expect(
      rankBaselineRecommendations(inputWith({ works: [anchor, ...sameAnchor], records })),
    ).toHaveLength(4);
    expect(
      rankBaselineRecommendations(inputWith({ works: [anchor, ...sameTheme], records })),
    ).toHaveLength(3);
    expect(
      rankBaselineRecommendations(
        inputWith({
          works: [anchor, ...sameSeries],
          records,
          constraints: sameSeries.map((work) => ({
            workId: work.id,
            catalogRole: "bridge",
            seriesGroupId: "shared-series",
            volumeCount: 0,
          })),
        }),
      ),
    ).toHaveLength(1);
  });

  it("uses the inclusive q12 Discovery window and enforces the default maximum", () => {
    const anchor = createTestWork({ id: "anchor", genres: ["fantasy"] });
    const top = createTestWork({ id: "top", genres: ["fantasy"], themes: [] });
    const edge = createTestWork({ id: "edge", genres: ["fantasy"], themes: [] });
    const outside = createTestWork({ id: "outside", genres: ["fantasy"], themes: [] });
    const extra = createTestWork({ id: "extra", genres: ["fantasy"], themes: [] });
    const works = [anchor, top, edge, outside, extra];
    const constraints: RecommendationConstraintMetadata[] = works.map((work) => ({
      workId: work.id,
      catalogRole: work.id === "anchor" || work.id === "top" ? "bridge" : "discovery",
      volumeCount: 0,
    }));
    const results = rankBaselineRecommendations(
      inputWith({
        works,
        records: [positiveRecord(anchor.id)],
        catalogAverageRating: 3,
        constraints,
        marketSignals: [
          { workId: top.id, reviewAverage: 5, reviewCount: 20 },
          { workId: edge.id, reviewAverage: 1.666666666666, reviewCount: 20 },
          { workId: extra.id, reviewAverage: 1.666666666666, reviewCount: 20 },
          { workId: outside.id, reviewAverage: 1.6666666666, reviewCount: 20 },
        ],
      }),
    );

    expect(results.map((result) => result.workId)).toEqual(["top", "edge", "extra"]);
    expect(results.filter((result) => result.workId !== "top")).toHaveLength(2);
    expect(results.find((result) => result.workId === "edge")?.baselineScore).toBe(0.74);
    expect(results.some((result) => result.workId === "outside")).toBe(false);
  });

  it("backfills one eligible Discovery into a full Top 10 without relaxing caps", () => {
    const tags = GENRE_TAGS.slice(0, 10);
    const themes = THEME_TAGS.slice(0, 10);
    const anchors = tags.map((genre, index) =>
      createTestWork({ id: `anchor-${index}`, genres: [genre], themes: [] }),
    );
    const regulars = tags.map((genre, index) =>
      createTestWork({
        id: `regular-${index}`,
        genres: [genre],
        themes: [{ id: themes[index] as ThemeTag, centrality: 2, confidence: 0.9 }],
      }),
    );
    const discovery = createTestWork({
      id: "zz-discovery",
      genres: [tags[0] as GenreTag],
      themes: [],
    });
    const works = [...anchors, ...regulars, discovery];
    const results = rankBaselineRecommendations(
      inputWith({
        works,
        records: anchors.map((anchor) => positiveRecord(anchor.id)),
        catalogAverageRating: 3,
        constraints: [
          ...works.map((work) => ({
            workId: work.id,
            catalogRole: "bridge" as const,
            volumeCount: 0,
          })),
          { workId: discovery.id, catalogRole: "discovery", volumeCount: 0 },
        ],
        marketSignals: [
          ...regulars.map((work) => ({ workId: work.id, reviewAverage: 5, reviewCount: 20 })),
          { workId: discovery.id, reviewAverage: 2, reviewCount: 20 },
        ],
      }),
    );

    expect(results).toHaveLength(10);
    expect(results.some((result) => result.workId === discovery.id)).toBe(true);
    expect(results.some((result) => result.workId === "regular-9")).toBe(false);
  });
});
