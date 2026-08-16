import { describe, expect, it } from "vitest";

import {
  backfillRecommendationPlanEntries,
  selectRecommendationPlanEntries,
} from "@/domain/recommendation/ordering";
import { buildRecommendationPlan, rankRecommendations } from "@/domain/recommendation/rank";
import type { RankedRecommendation, RecommendationPlanEntry } from "@/domain/recommendation/types";
import { createGolden20Input } from "../../fixtures/recommendation/golden-20";
import { createTestPolicies } from "../../helpers/recommendation";

function planEntry(
  workId: string,
  overrides: Partial<RecommendationPlanEntry> = {},
): RecommendationPlanEntry {
  return {
    workId,
    tasteScore: 0.8,
    confidence: 0.7,
    confidenceLevel: "normal",
    bestAnchorId: `anchor:${workId}`,
    contributions: [],
    penaltiesApplied: [],
    isDiscovery: false,
    majorThemeKey: `theme:${workId}`,
    seriesGroupId: `series:${workId}`,
    ...overrides,
  };
}

function rankedEntry(entry: RecommendationPlanEntry): RankedRecommendation {
  return {
    workId: entry.workId,
    tasteScore: entry.tasteScore,
    confidence: entry.confidence,
    confidenceLevel: entry.confidenceLevel,
    bestAnchorId: entry.bestAnchorId,
    contributions: entry.contributions,
    penaltiesApplied: entry.penaltiesApplied,
  };
}

describe("recommendation plan", () => {
  it("keeps the constrained first ten byte-equivalent to rankRecommendations", () => {
    const input = createGolden20Input();
    const plan = buildRecommendationPlan(input);

    expect(plan.length).toBeGreaterThan(10);
    expect(selectRecommendationPlanEntries(plan, input.policies).map(rankedEntry)).toEqual(
      rankRecommendations(input),
    );
  });

  it("is deterministic across catalog, record, and context map permutations", () => {
    const input = createGolden20Input();
    const permuted = structuredClone(input);
    permuted.catalog.works.reverse();
    permuted.records.reverse();
    permuted.context.constraintByWorkId = Object.fromEntries(
      Object.entries(permuted.context.constraintByWorkId).reverse(),
    );
    permuted.context.marketSnapshot.byWorkId = Object.fromEntries(
      Object.entries(permuted.context.marketSnapshot.byWorkId).reverse(),
    );

    expect(buildRecommendationPlan(permuted)).toEqual(buildRecommendationPlan(input));
  });
});

describe("recommendation plan backfill", () => {
  it("normalizes survivor input to the full-plan rank before an early return", () => {
    const plan = [planEntry("first"), planEntry("second"), planEntry("third")];

    expect(
      backfillRecommendationPlanEntries({
        plan,
        survivors: [plan[2]!, plan[0]!],
        excludedWorkIds: [],
        policies: createTestPolicies(),
        limit: 2,
      }).map((entry) => entry.workId),
    ).toEqual(["first", "third"]);
  });

  it("preserves survivor rank and restores the discovery minimum before regular reserves", () => {
    const plan = [
      planEntry("regular-1", { tasteScore: 0.9 }),
      planEntry("regular-2", { tasteScore: 0.89 }),
      planEntry("regular-3", { tasteScore: 0.88 }),
      planEntry("discovery-1", { tasteScore: 0.87, isDiscovery: true }),
      planEntry("regular-reserve", { tasteScore: 0.86 }),
      planEntry("discovery-reserve", { tasteScore: 0.85, isDiscovery: true }),
    ];
    const initial = selectRecommendationPlanEntries(plan, createTestPolicies(), 4);
    const survivors = initial.filter(
      (entry) => entry.workId !== "regular-2" && entry.workId !== "discovery-1",
    );

    expect(
      backfillRecommendationPlanEntries({
        plan,
        survivors,
        excludedWorkIds: ["regular-2", "discovery-1"],
        policies: createTestPolicies(),
        limit: 4,
      }).map((entry) => entry.workId),
    ).toEqual(["regular-1", "regular-3", "regular-reserve", "discovery-reserve"]);
  });

  it("puts a cap-unlocked higher reserve back into its full-plan rank", () => {
    const plan = [
      planEntry("removed-blocker", { seriesGroupId: "shared-series", tasteScore: 0.9 }),
      planEntry("higher-survivor", { tasteScore: 0.89 }),
      planEntry("unlocked-reserve", { seriesGroupId: "shared-series", tasteScore: 0.88 }),
      planEntry("lower-survivor", { tasteScore: 0.87 }),
    ];
    const initial = selectRecommendationPlanEntries(plan, createTestPolicies(), 3);
    const survivors = initial.filter((entry) => entry.workId !== "removed-blocker");

    expect(initial.map((entry) => entry.workId)).toEqual([
      "removed-blocker",
      "higher-survivor",
      "lower-survivor",
    ]);
    expect(
      backfillRecommendationPlanEntries({
        plan,
        survivors,
        excludedWorkIds: ["removed-blocker"],
        policies: createTestPolicies(),
        limit: 3,
      }).map((entry) => entry.workId),
    ).toEqual(["higher-survivor", "unlocked-reserve", "lower-survivor"]);
  });

  it("skips reserves that violate anchor, theme, or series caps", () => {
    const survivors = Array.from({ length: 4 }, (_, index) =>
      planEntry(`survivor-${String(index)}`, {
        bestAnchorId: "shared-anchor",
        majorThemeKey: index < 3 ? "shared-theme" : `theme-${String(index)}`,
        seriesGroupId: `series-${String(index)}`,
      }),
    );
    const plan = [
      ...survivors,
      planEntry("blocked-anchor", { bestAnchorId: "shared-anchor" }),
      planEntry("blocked-theme", { majorThemeKey: "shared-theme" }),
      planEntry("blocked-series", { seriesGroupId: "series-0" }),
      planEntry("valid-reserve", { isDiscovery: true, tasteScore: 0.79 }),
    ];

    expect(
      backfillRecommendationPlanEntries({
        plan,
        survivors,
        excludedWorkIds: [],
        policies: createTestPolicies(),
        limit: 5,
      }).map((entry) => entry.workId),
    ).toEqual([...survivors.map((entry) => entry.workId), "valid-reserve"]);
  });

  it("never revives an excluded work and stops cleanly when candidates are exhausted", () => {
    const plan = [planEntry("removed"), planEntry("survivor")];

    expect(
      backfillRecommendationPlanEntries({
        plan,
        survivors: [plan[1]!],
        excludedWorkIds: ["removed"],
        policies: createTestPolicies(),
      }).map((entry) => entry.workId),
    ).toEqual(["survivor"]);
  });

  it("returns an empty result for an empty plan", () => {
    expect(
      backfillRecommendationPlanEntries({
        plan: [],
        survivors: [],
        excludedWorkIds: [],
        policies: createTestPolicies(),
      }),
    ).toEqual([]);
  });

  it("rejects a duplicate plan instead of making reserve identity ambiguous", () => {
    const duplicate = planEntry("duplicate");

    expect(() =>
      backfillRecommendationPlanEntries({
        plan: [duplicate, { ...duplicate }],
        survivors: [],
        excludedWorkIds: [],
        policies: createTestPolicies(),
      }),
    ).toThrow("Duplicate recommendation plan work: duplicate");
  });

  it("keeps the discovery maximum and score window while choosing reserves", () => {
    const plan = [
      planEntry("taste-leader", { tasteScore: 0.9 }),
      planEntry("discovery-1", { tasteScore: 0.89, isDiscovery: true }),
      planEntry("discovery-2", { tasteScore: 0.88, isDiscovery: true }),
      planEntry("discovery-over-cap", { tasteScore: 0.87, isDiscovery: true }),
      planEntry("discovery-outside-window", { tasteScore: 0.799999999999, isDiscovery: true }),
      planEntry("regular-reserve", { tasteScore: 0.7 }),
    ];

    expect(
      backfillRecommendationPlanEntries({
        plan,
        survivors: plan.slice(0, 3),
        excludedWorkIds: [],
        policies: createTestPolicies(),
        limit: 4,
      }).map((entry) => entry.workId),
    ).toEqual(["taste-leader", "discovery-1", "discovery-2", "regular-reserve"]);
  });

  it("returns the same full-plan-ranked result on repeated calls", () => {
    const plan = [
      planEntry("survivor"),
      planEntry("discovery", { isDiscovery: true }),
      planEntry("reserve"),
    ];
    const options = {
      plan,
      survivors: [plan[0]!],
      excludedWorkIds: [] as string[],
      policies: createTestPolicies(),
      limit: 3,
    };

    expect(backfillRecommendationPlanEntries(options)).toEqual(
      backfillRecommendationPlanEntries(options),
    );
  });
});
