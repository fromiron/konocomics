import { describe, expect, it } from "vitest";

import type { AxisFactor } from "@/domain/catalog/types";
import { filterPlanForMood, workMatchesMood } from "@/domain/recommendation/mood";
import { selectRecommendationPlanEntries } from "@/domain/recommendation/ordering";
import type { RecommendationPlanEntry } from "@/domain/recommendation/types";
import { createTestAxes, createTestWork } from "../../helpers/catalog";
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

const known = (value: 0 | 1 | 2 | 3 | 4): AxisFactor => ({
  state: "known",
  value,
  confidence: 0.9,
});
const unknownFactor: AxisFactor = { state: "unknown" };

function workWith(id: string, axes: Parameters<typeof createTestAxes>[0]) {
  return createTestWork({ id, axes: createTestAxes(axes) });
}

describe("recommendation moods", () => {
  it("matches only confirmed values against the starting thresholds", () => {
    expect(workMatchesMood(workWith("a", { mentalStress: known(1) }), "lowStress")).toBe(true);
    expect(workMatchesMood(workWith("b", { mentalStress: known(2) }), "lowStress")).toBe(false);
    expect(workMatchesMood(workWith("c", { mentalStress: unknownFactor }), "lowStress")).toBe(
      false,
    );
    expect(workMatchesMood(workWith("d", { emotionalWarmth: known(3) }), "warm")).toBe(true);
    expect(workMatchesMood(workWith("e", { emotionalWarmth: known(2) }), "warm")).toBe(false);
    expect(workMatchesMood(workWith("f", { pacing: known(4) }), "fastPaced")).toBe(true);
    expect(workMatchesMood(workWith("g", { pacing: unknownFactor }), "fastPaced")).toBe(false);
  });

  it("keeps the plan's entries and order and never widens the condition", () => {
    const worksById = new Map([
      ["fast-1", workWith("fast-1", { pacing: known(4) })],
      ["slow", workWith("slow", { pacing: known(1) })],
      ["fast-2", workWith("fast-2", { pacing: known(3) })],
      ["unknown", workWith("unknown", { pacing: unknownFactor })],
    ]);
    const plan = [
      planEntry("fast-1", { tasteScore: 0.9 }),
      planEntry("slow", { tasteScore: 0.85 }),
      planEntry("fast-2", { tasteScore: 0.8 }),
      planEntry("unknown", { tasteScore: 0.75 }),
    ];

    const filtered = filterPlanForMood({
      plan,
      worksById,
      mood: "fastPaced",
      dismissedWorkIds: new Set(),
      excludedWorkIds: new Set(),
    });

    expect(filtered).toEqual([plan[0], plan[2]]);
    expect(filtered[0]).toBe(plan[0]);
  });

  it("drops mood-scoped dismissals and session exclusions before list constraints", () => {
    const worksById = new Map(
      ["a", "b", "c", "d"].map((id) => [id, workWith(id, { pacing: known(4) })] as const),
    );
    const plan = ["a", "b", "c", "d"].map((id) => planEntry(id));

    const filtered = filterPlanForMood({
      plan,
      worksById,
      mood: "fastPaced",
      dismissedWorkIds: new Set(["a"]),
      excludedWorkIds: new Set(["c"]),
    });

    expect(filtered.map((entry) => entry.workId)).toEqual(["b", "d"]);
  });

  it("measures the Discovery window from the best remaining mood candidate", () => {
    const worksById = new Map([
      ["top-slow", workWith("top-slow", { pacing: known(0) })],
      ["fast", workWith("fast", { pacing: known(4) })],
      ["fast-discovery", workWith("fast-discovery", { pacing: known(4) })],
    ]);
    const plan = [
      planEntry("top-slow", { tasteScore: 0.95 }),
      planEntry("fast", { tasteScore: 0.6 }),
      planEntry("fast-discovery", { tasteScore: 0.55, isDiscovery: true }),
    ];
    const policies = createTestPolicies();

    // Against the whole plan the discovery work sits outside the 0.10 window.
    expect(
      selectRecommendationPlanEntries(plan, policies).map((entry) => entry.workId),
    ).not.toContain("fast-discovery");

    const moodEntries = selectRecommendationPlanEntries(
      filterPlanForMood({
        plan,
        worksById,
        mood: "fastPaced",
        dismissedWorkIds: new Set(),
        excludedWorkIds: new Set(),
      }),
      policies,
    );
    expect(moodEntries.map((entry) => entry.workId)).toEqual(["fast", "fast-discovery"]);
    expect(moodEntries[0]?.tasteScore).toBe(0.6);
  });
});
