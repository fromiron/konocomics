import { describe, expect, it } from "vitest";

import { AXIS_IDS } from "@/domain/catalog/constants";
import type { ScaleValue } from "@/domain/catalog/types";
import {
  calculatePositiveAnchorScore,
  type PositiveAnchorInput,
} from "@/domain/recommendation/anchor";
import { workSimilarity } from "@/domain/recommendation/similarity";
import { createTestAxes, createTestWork } from "../../helpers/catalog";

function uniformWork(id: string, value: ScaleValue, matchingTags = true) {
  const axes = createTestAxes();
  for (const axisId of AXIS_IDS) {
    axes[axisId] = { state: "known", value, confidence: 1 };
  }
  return createTestWork({
    id,
    axes,
    genres: matchingTags ? ["fantasy"] : ["action"],
    themes: matchingTags
      ? [{ id: "adventure", centrality: 2, confidence: 1 }]
      : [{ id: "combat", centrality: 2, confidence: 1 }],
  });
}

describe("positive anchor aggregation", () => {
  it("returns no score without a positive anchor", () => {
    expect(calculatePositiveAnchorScore(createTestWork(), [])).toBeNull();
  });

  it("applies reaction weights before selecting the best anchor", () => {
    const candidate = uniformWork("candidate", 2);
    const result = calculatePositiveAnchorScore(candidate, [
      { work: uniformWork("favorite-far", 0, false), reaction: "favorite" },
      { work: uniformWork("liked-match", 2), reaction: "liked" },
    ]);

    expect(result?.bestAnchorId).toBe("liked-match");
    expect(result?.bestMatch).toBeCloseTo(0.8);
    expect(result?.bestAnchorReactionWeight).toBe(0.8);
  });

  it("breaks exact best-anchor ties by work id", () => {
    const candidate = uniformWork("candidate", 2);
    const result = calculatePositiveAnchorScore(candidate, [
      { work: uniformWork("anchor-z", 2), reaction: "favorite" },
      { work: uniformWork("anchor-a", 2), reaction: "favorite" },
    ]);

    expect(result?.bestAnchorId).toBe("anchor-a");
  });

  it("breaks mathematically equal decimal matches by work id", () => {
    const candidate = createTestWork({ id: "candidate" });
    const anchorA = createTestWork({
      id: "anchor-a",
      genres: ["action"],
      themes: [{ id: "adventure", centrality: 1, confidence: 1 }],
      axes: createTestAxes({
        artRealism: { state: "known", value: 0, confidence: 1 },
        artDensity: { state: "known", value: 0, confidence: 1 },
        visualSoftness: { state: "known", value: 0, confidence: 1 },
        motionImpact: { state: "known", value: 0, confidence: 1 },
      }),
    });
    const anchorZ = createTestWork({
      id: "anchor-z",
      themes: [{ id: "adventure", centrality: 1, confidence: 1 }],
      axes: createTestAxes({
        progression: { state: "known", value: 4, confidence: 1 },
        problemSolving: { state: "known", value: 4, confidence: 1 },
        worldBuilding: { state: "unknown" },
        characterArcWeight: { state: "known", value: 4, confidence: 1 },
        relationshipStructure: { state: "known", value: 4, confidence: 1 },
        comedy: { state: "known", value: 4, confidence: 1 },
        darkness: { state: "known", value: 4, confidence: 1 },
        mentalStress: { state: "known", value: 4, confidence: 1 },
        romance: { state: "known", value: 4, confidence: 1 },
        emotionalWarmth: { state: "known", value: 4, confidence: 1 },
        artRealism: { state: "known", value: 4, confidence: 1 },
        artDensity: { state: "known", value: 4, confidence: 1 },
        visualSoftness: { state: "known", value: 4, confidence: 1 },
        motionImpact: { state: "known", value: 4, confidence: 1 },
      }),
    });

    expect(workSimilarity(candidate, anchorA).score).toBeCloseTo(0.65, 12);
    expect(workSimilarity(candidate, anchorZ).score).toBeCloseTo(0.65, 12);
    expect(
      calculatePositiveAnchorScore(candidate, [
        { work: anchorZ, reaction: "favorite" },
        { work: anchorA, reaction: "favorite" },
      ])?.bestAnchorId,
    ).toBe("anchor-a");
  });

  it("preserves a real best-match difference smaller than output precision", () => {
    const candidate = createTestWork({
      id: "candidate",
      axes: createTestAxes({
        progression: { state: "known", value: 0, confidence: 1 },
        problemSolving: { state: "known", value: 0, confidence: 1 },
      }),
    });
    const anchorA = createTestWork({
      id: "anchor-a",
      axes: createTestAxes({
        progression: { state: "known", value: 0, confidence: 0.5 },
        problemSolving: { state: "known", value: 4, confidence: 0.5 },
      }),
    });
    const anchorZ = createTestWork({
      id: "anchor-z",
      axes: createTestAxes({
        progression: { state: "known", value: 0, confidence: 0.500000000001 },
        problemSolving: { state: "known", value: 4, confidence: 0.5 },
      }),
    });
    const scoreA = workSimilarity(candidate, anchorA).score;
    const scoreZ = workSimilarity(candidate, anchorZ).score;

    expect(scoreZ).toBeGreaterThan(scoreA);
    expect(scoreZ - scoreA).toBeLessThan(1e-12);
    expect(
      calculatePositiveAnchorScore(candidate, [
        { work: anchorA, reaction: "favorite" },
        { work: anchorZ, reaction: "favorite" },
      ])?.bestAnchorId,
    ).toBe("anchor-z");
  });

  it("uses a raw-score leader cohort for a non-transitive tolerance chain", () => {
    const candidate = createTestWork({
      id: "candidate",
      axes: createTestAxes({
        progression: { state: "known", value: 0, confidence: 1 },
        problemSolving: { state: "known", value: 0, confidence: 1 },
      }),
    });
    const anchorWithConfidence = (id: string, confidence: number) =>
      createTestWork({
        id,
        axes: createTestAxes({
          progression: { state: "known", value: 0, confidence },
          problemSolving: { state: "known", value: 4, confidence: 0.5 },
        }),
      });
    const anchors = [
      anchorWithConfidence("anchor-a", 0.5),
      anchorWithConfidence("anchor-b", 0.5000000000001),
      anchorWithConfidence("anchor-c", 0.5000000000002),
    ];

    expect(
      calculatePositiveAnchorScore(
        candidate,
        anchors.map((work) => ({ work, reaction: "favorite" as const })),
      )?.bestAnchorId,
    ).toBe("anchor-b");

    const best = createTestWork({ id: "best", axes: candidate.axes });
    const supporterResult = calculatePositiveAnchorScore(candidate, [
      { work: best, reaction: "favorite" },
      ...anchors.map((work) => ({ work, reaction: "favorite" as const })),
    ]);
    expect(supporterResult?.supporterMatches.map((entry) => entry.workId)).toEqual([
      "anchor-b",
      "anchor-c",
    ]);
  });

  it("uses the two strongest same-cluster supporters with their reaction weights", () => {
    const candidate = uniformWork("candidate", 2);
    const anchors: PositiveAnchorInput[] = [
      { work: uniformWork("anchor-d", 2), reaction: "liked" },
      { work: uniformWork("anchor-c", 2), reaction: "liked" },
      { work: uniformWork("anchor-b", 2), reaction: "liked" },
      { work: uniformWork("anchor-a", 2), reaction: "favorite" },
      { work: uniformWork("anchor-far", 0, false), reaction: "liked" },
    ];

    const result = calculatePositiveAnchorScore(candidate, anchors);
    expect(result?.supporterMatches).toEqual([
      { workId: "anchor-b", match: 0.8 },
      { workId: "anchor-c", match: 0.8 },
    ]);
    expect(result?.support).toBeCloseTo(0.8);
    expect(result?.consensusBonus).toBeCloseTo(0.03);
    expect(result?.appliedConsensusBonus).toBe(0);

    expect(calculatePositiveAnchorScore(candidate, [...anchors].reverse())).toEqual(result);
  });

  it("caps the nominal consensus bonus at 0.05", () => {
    const candidate = uniformWork("candidate", 2);
    const result = calculatePositiveAnchorScore(candidate, [
      { work: uniformWork("anchor-c", 2), reaction: "favorite" },
      { work: uniformWork("anchor-b", 2), reaction: "favorite" },
      { work: uniformWork("anchor-a", 2), reaction: "favorite" },
    ]);

    expect(result?.consensusBonus).toBe(0.05);
    expect(result?.positiveAnchorScore).toBe(1);
  });

  it("does not grow the capped bonus when a matching cluster expands to eight anchors", () => {
    const candidate = uniformWork("candidate", 2);
    const scoreWith = (count: number) =>
      calculatePositiveAnchorScore(
        candidate,
        Array.from({ length: count }, (_, index) => ({
          work: uniformWork(`anchor-${index}`, 2),
          reaction: "favorite" as const,
        })),
      );
    const threeAnchors = scoreWith(3);
    const eightAnchors = scoreWith(8);

    expect(threeAnchors?.consensusBonus).toBe(0.05);
    expect(eightAnchors?.consensusBonus).toBe(0.05);
    expect(eightAnchors?.positiveAnchorScore).toBe(threeAnchors?.positiveAnchorScore);
    expect(eightAnchors?.positiveAnchorScore).toBeLessThanOrEqual(1);
  });

  it("includes a supporter at the decimal-sensitive exact 0.65 boundary", () => {
    const best = createTestWork({
      id: "best",
      themes: [{ id: "adventure", centrality: 2, confidence: 1 }],
    });
    const supporter = createTestWork({
      id: "supporter",
      genres: ["action"],
      themes: [{ id: "adventure", centrality: 1, confidence: 1 }],
      axes: createTestAxes({
        artRealism: { state: "known", value: 0, confidence: 1 },
        artDensity: { state: "known", value: 0, confidence: 1 },
        visualSoftness: { state: "known", value: 0, confidence: 1 },
        motionImpact: { state: "known", value: 0, confidence: 1 },
      }),
    });

    const result = calculatePositiveAnchorScore(best, [
      { work: best, reaction: "favorite" },
      { work: supporter, reaction: "favorite" },
    ]);

    expect(result?.supporterMatches).toHaveLength(1);
    expect(result?.supporterMatches[0]?.workId).toBe("supporter");
    expect(result?.supporterMatches[0]?.match).toBeCloseTo(0.65, 12);
    expect(result?.consensusBonus).toBeCloseTo(0.015, 12);
  });

  it("excludes a supporter that is genuinely below 0.65 within output precision", () => {
    const best = createTestWork({ id: "best" });
    const supporter = createTestWork({
      id: "supporter",
      genres: ["action"],
      themes: [{ id: "adventure", centrality: 1, confidence: 1 }],
      axes: createTestAxes({
        progression: { state: "known", value: 1, confidence: 1e-11 },
        artRealism: { state: "known", value: 0, confidence: 1 },
        artDensity: { state: "known", value: 0, confidence: 1 },
        visualSoftness: { state: "known", value: 0, confidence: 1 },
        motionImpact: { state: "known", value: 0, confidence: 1 },
      }),
    });
    const similarity = workSimilarity(best, supporter).score;
    const result = calculatePositiveAnchorScore(best, [
      { work: best, reaction: "favorite" },
      { work: supporter, reaction: "favorite" },
    ]);

    expect(similarity).toBeLessThan(0.65);
    expect(0.65 - similarity).toBeLessThan(1e-12);
    expect(result?.supporterMatches).toEqual([]);
  });
});
