import { describe, expect, it } from "vitest";

import {
  applyListConstraints,
  determinePopularWorkIds,
  sortScoredRecommendations,
} from "@/domain/recommendation/ordering";
import {
  createScoredRecommendation,
  createTestPolicies,
  createTestRecommendationContext,
} from "../../helpers/recommendation";

describe("recommendation ordering", () => {
  it("forms transitive leader cohorts and treats exactly 0.025 as a new cohort", () => {
    const candidates = [
      createScoredRecommendation({ workId: "a", tasteScore: 0.9, confidence: 0.5 }),
      createScoredRecommendation({ workId: "b", tasteScore: 0.876, confidence: 0.9 }),
      createScoredRecommendation({ workId: "c", tasteScore: 0.875, confidence: 1 }),
    ];

    expect(
      sortScoredRecommendations(candidates, createTestPolicies()).map((entry) => entry.workId),
    ).toEqual(["b", "a", "c"]);
    expect(
      sortScoredRecommendations([...candidates].reverse(), createTestPolicies()).map(
        (entry) => entry.workId,
      ),
    ).toEqual(["b", "a", "c"]);
  });

  it("quantizes a decimal 0.025 boundary before forming cohorts", () => {
    const candidates = [
      createScoredRecommendation({ workId: "leader", tasteScore: 0.3, confidence: 0.1 }),
      createScoredRecommendation({ workId: "boundary", tasteScore: 0.275, confidence: 1 }),
    ];

    expect(
      sortScoredRecommendations(candidates, createTestPolicies()).map((entry) => entry.workId),
    ).toEqual(["leader", "boundary"]);
  });

  it("keeps raw tuple ordering transitive across an epsilon chain", () => {
    const epsilon = Number.EPSILON;
    const candidates = [
      createScoredRecommendation({ workId: "a", tasteScore: 0.8, confidence: 0.5 }),
      createScoredRecommendation({
        workId: "b",
        tasteScore: 0.8,
        confidence: 0.5 + 3 * epsilon,
      }),
      createScoredRecommendation({
        workId: "c",
        tasteScore: 0.8,
        confidence: 0.5 + 6 * epsilon,
      }),
    ];

    expect(
      sortScoredRecommendations(candidates, createTestPolicies()).map((entry) => entry.workId),
    ).toEqual(["b", "c", "a"]);
  });

  it("never uses maturity by default and raises it only for verified preference", () => {
    const candidates = [
      createScoredRecommendation({
        workId: "a",
        tasteScore: 0.8,
        confidence: 0.7,
        bayesianRating: 3.5,
        maturity: 0,
      }),
      createScoredRecommendation({
        workId: "b",
        tasteScore: 0.8,
        confidence: 0.7,
        bayesianRating: 3.5,
        maturity: 1,
      }),
    ];

    expect(
      sortScoredRecommendations(candidates, createTestPolicies()).map((entry) => entry.workId),
    ).toEqual(["a", "b"]);
    expect(
      sortScoredRecommendations(candidates, createTestPolicies({ preferVerified: true })).map(
        (entry) => entry.workId,
      ),
    ).toEqual(["b", "a"]);
  });

  it("demotes popular works only inside a cohort when hidden preference is active", () => {
    const candidates = [
      createScoredRecommendation({
        workId: "popular",
        tasteScore: 0.8,
        confidence: 1,
        isPopular: true,
      }),
      createScoredRecommendation({
        workId: "hidden",
        tasteScore: 0.79,
        confidence: 0.5,
        isPopular: false,
      }),
    ];

    expect(
      sortScoredRecommendations(candidates, createTestPolicies({ preferHidden: true })).map(
        (entry) => entry.workId,
      ),
    ).toEqual(["hidden", "popular"]);
  });

  it("marks the top twenty percent and includes review-count ties", () => {
    const ids = Array.from({ length: 10 }, (_, index) => `work-${index}`);
    const context = createTestRecommendationContext("v1-test", {
      marketSnapshot: {
        catalogVersion: "v1-test",
        catalogAverageRating: 3.5,
        byWorkId: Object.fromEntries(
          ids.map((workId, index) => [
            workId,
            { workId, reviewCount: index < 3 ? 100 : 10 - index },
          ]),
        ),
      },
    });

    expect([...determinePopularWorkIds(ids, context)].sort()).toEqual([
      "work-0",
      "work-1",
      "work-2",
    ]);
  });
});

describe("recommendation list constraints", () => {
  it("caps best anchors, major theme combinations, series, and discovery", () => {
    const policies = createTestPolicies();
    const sameAnchor = Array.from({ length: 5 }, (_, index) =>
      createScoredRecommendation({ workId: `anchor-${index}`, bestAnchorId: "same-anchor" }),
    );
    const sameTheme = Array.from({ length: 4 }, (_, index) =>
      createScoredRecommendation({
        workId: `theme-${index}`,
        bestAnchorId: `anchor-${index}`,
        majorThemeKey: "same-theme",
      }),
    );
    const sameSeries = [
      createScoredRecommendation({ workId: "series-a", seriesGroupId: "same-series" }),
      createScoredRecommendation({ workId: "series-b", seriesGroupId: "same-series" }),
    ];
    const discoveries = Array.from({ length: 3 }, (_, index) =>
      createScoredRecommendation({
        workId: `discovery-${index}`,
        tasteScore: 0.8 - index * 0.01,
        isDiscovery: true,
      }),
    );

    expect(applyListConstraints(sameAnchor, policies).map((entry) => entry.workId)).toEqual([
      "anchor-0",
      "anchor-1",
      "anchor-2",
      "anchor-3",
    ]);
    expect(applyListConstraints(sameTheme, policies).map((entry) => entry.workId)).toEqual([
      "theme-0",
      "theme-1",
      "theme-2",
    ]);
    expect(applyListConstraints(sameSeries, policies).map((entry) => entry.workId)).toEqual([
      "series-a",
    ]);
    expect(applyListConstraints(discoveries, policies).map((entry) => entry.workId)).toEqual([
      "discovery-0",
      "discovery-1",
    ]);
  });

  it("keeps the inclusive discovery window and rejects the value just outside it", () => {
    const candidates = [
      createScoredRecommendation({ workId: "top", tasteScore: 0.8 }),
      createScoredRecommendation({ workId: "edge", tasteScore: 0.7, isDiscovery: true }),
      createScoredRecommendation({
        workId: "outside",
        tasteScore: 0.699999999999,
        isDiscovery: true,
      }),
    ];

    expect(
      applyListConstraints(candidates, createTestPolicies()).map((entry) => entry.workId),
    ).toEqual(["top", "edge"]);
  });

  it("anchors the discovery window to the highest taste even when a cohort tie-break moves it", () => {
    const candidates = [
      createScoredRecommendation({ workId: "cohort-first", tasteScore: 0.88, confidence: 1 }),
      createScoredRecommendation({ workId: "taste-leader", tasteScore: 0.9, confidence: 0.1 }),
      createScoredRecommendation({
        workId: "too-low-discovery",
        tasteScore: 0.79,
        isDiscovery: true,
      }),
    ];
    const policies = createTestPolicies();
    const sorted = sortScoredRecommendations(candidates, policies);

    expect(sorted[0]?.workId).toBe("cohort-first");
    expect(applyListConstraints(sorted, policies).map((entry) => entry.workId)).toEqual([
      "cohort-first",
      "taste-leader",
    ]);
  });

  it("replaces the lowest eligible non-discovery to satisfy the minimum", () => {
    const candidates = [
      ...Array.from({ length: 10 }, (_, index) =>
        createScoredRecommendation({
          workId: `regular-${index}`,
          tasteScore: 0.9 - index * 0.005,
          bestAnchorId: `anchor-${index}`,
        }),
      ),
      createScoredRecommendation({
        workId: "discovery",
        tasteScore: 0.84,
        isDiscovery: true,
        bestAnchorId: "anchor-discovery",
      }),
    ];

    const selected = applyListConstraints(candidates, createTestPolicies());
    expect(selected).toHaveLength(10);
    expect(selected.map((entry) => entry.workId)).toContain("discovery");
    expect(selected.map((entry) => entry.workId)).not.toContain("regular-9");
  });

  it("does not replace a regular when an under-limit discovery cannot satisfy a cap", () => {
    const regulars = Array.from({ length: 4 }, (_, index) =>
      createScoredRecommendation({
        workId: `regular-${index}`,
        tasteScore: 0.9 - index * 0.01,
        bestAnchorId: "shared-anchor",
      }),
    );
    const discovery = createScoredRecommendation({
      workId: "discovery",
      tasteScore: 0.86,
      bestAnchorId: "shared-anchor",
      isDiscovery: true,
    });

    expect(
      applyListConstraints([...regulars, discovery], createTestPolicies()).map(
        (entry) => entry.workId,
      ),
    ).toEqual(regulars.map((entry) => entry.workId));
  });

  it("expands hidden-policy discovery slots to a two-through-four quota", () => {
    const regular = Array.from({ length: 10 }, (_, index) =>
      createScoredRecommendation({
        workId: `hidden-regular-${index}`,
        tasteScore: 0.9 - index * 0.004,
        bestAnchorId: `hidden-anchor-${index}`,
      }),
    );
    const discovery = Array.from({ length: 5 }, (_, index) =>
      createScoredRecommendation({
        workId: `hidden-discovery-${index}`,
        tasteScore: 0.85 - index * 0.005,
        bestAnchorId: `hidden-discovery-anchor-${index}`,
        isDiscovery: true,
      }),
    );

    const selected = applyListConstraints(
      [...regular, ...discovery],
      createTestPolicies({ preferHidden: true }),
    );
    expect(selected.filter((entry) => entry.isDiscovery)).toHaveLength(2);

    const discoveryOnly = applyListConstraints(
      discovery,
      createTestPolicies({ preferHidden: true }),
    );
    expect(discoveryOnly).toHaveLength(4);
  });
});
