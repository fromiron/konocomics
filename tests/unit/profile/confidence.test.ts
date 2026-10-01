import { describe, expect, it } from "vitest";

import { AXIS_IDS, THEME_TAGS } from "@/domain/catalog/constants";
import { workAxesSchema } from "@/domain/catalog/schema";
import {
  calculateAverageFactorConfidence,
  calculateProfileConfidence,
  calculateRecommendationConfidence,
  calculateWorkConfidence,
  countPositiveAnchors,
  countReasonedNegativeWorks,
  getConfidenceLevel,
  projectProfileClarity,
} from "@/domain/profile/confidence";
import { roundScore } from "@/domain/recommendation/math";
import { createTestWork } from "../../helpers/catalog";
import { createTestRecord } from "../../helpers/recommendation";

describe("profile confidence", () => {
  it("counts distinct positive anchors and distinct factor-backed negative works", () => {
    const records = [
      createTestRecord({ workId: "anchor-a", reaction: "favorite" }),
      createTestRecord({ workId: "anchor-a", reaction: "liked" }),
      createTestRecord({ workId: "anchor-b", reaction: "liked" }),
      createTestRecord({
        workId: "negative-a",
        reaction: "disliked",
        negativeReasons: ["tooDark"],
      }),
      createTestRecord({
        workId: "negative-a",
        reaction: "disliked",
        droppedReasons: ["tooSlow"],
      }),
      createTestRecord({
        workId: "negative-b",
        reaction: "disliked",
        negativeReasons: ["genericStory", "external:no-time"],
      }),
      createTestRecord({
        workId: "not-reasoned",
        reaction: "disliked",
        negativeReasons: ["vagueDislike", "external:hiatus"],
      }),
    ];

    expect(countPositiveAnchors(records)).toBe(2);
    expect(countReasonedNegativeWorks(records)).toBe(2);
    expect(calculateProfileConfidence(records)).toBe(0.4);
  });

  it("caps the anchor and reasoned-negative terms independently", () => {
    const anchors = Array.from({ length: 10 }, (_, index) =>
      createTestRecord({ workId: `anchor-${index}`, reaction: "favorite" }),
    );
    const negatives = Array.from({ length: 3 }, (_, index) =>
      createTestRecord({
        workId: `negative-${index}`,
        reaction: "disliked",
        negativeReasons: ["tooDark"],
      }),
    );

    expect(calculateProfileConfidence([...anchors, ...negatives])).toBe(1);
  });
});

describe("projected onboarding clarity", () => {
  it("projects unsaved positive works through the same profile confidence levels", () => {
    expect(projectProfileClarity([], [], 10)).toEqual({
      confidence: 0,
      level: "low",
      positiveAnchorCount: 0,
      anchorsToNextLevel: 5,
    });
    const four = ["a", "b", "c", "d"];
    expect(projectProfileClarity([], four, 6)).toMatchObject({
      level: "low",
      anchorsToNextLevel: 1,
    });
    expect(projectProfileClarity([], [...four, "e"], 5)).toMatchObject({
      level: "normal",
      anchorsToNextLevel: 3,
    });
    expect(projectProfileClarity([], [...four, "e", "f", "g", "h"], 2)).toMatchObject({
      level: "high",
      anchorsToNextLevel: null,
    });
  });

  it("counts saved anchors once and stops the hint at the remaining capacity", () => {
    const saved = Array.from({ length: 6 }, (_, index) =>
      createTestRecord({ workId: `saved-${index}`, reaction: "liked" }),
    );
    const projected = projectProfileClarity(saved, ["saved-0", "new-a"], 0);

    expect(projected.positiveAnchorCount).toBe(7);
    expect(projected.level).toBe("normal");
    expect(projected.anchorsToNextLevel).toBeNull();
    expect(projected.confidence).toBe(
      calculateProfileConfidence([
        ...saved,
        createTestRecord({ workId: "new-a", reaction: "liked" }),
      ]),
    );
  });
});

describe("work and recommendation confidence", () => {
  it("averages only known Axis and present Theme confidence", () => {
    const axes = workAxesSchema.parse(
      Object.fromEntries(AXIS_IDS.map((axisId) => [axisId, { state: "unknown" }])),
    );
    axes.progression = { state: "known", value: 4, confidence: 0.2 };
    axes.darkness = { state: "known", value: 2, confidence: 0.8 };
    axes.motionImpact = { state: "notApplicable" };

    const base = createTestWork({
      axes,
      themes: [{ id: "adventure", centrality: 2, confidence: 0.5 }],
    });
    const work = {
      ...base,
      evidence: {
        metadataConfidence: 0,
        groupingConfidence: 0.75,
        sourceAgreement: 1,
      },
    };

    expect(calculateAverageFactorConfidence(work)).toBe(0.5);
    expect(calculateWorkConfidence(work)).toBe(0.65);
    expect(calculateRecommendationConfidence(0.8, 0.8)).toBe(0.8);
  });

  it("uses zero average confidence when no Axis or Theme confidence exists", () => {
    const axes = workAxesSchema.parse(
      Object.fromEntries(AXIS_IDS.map((axisId) => [axisId, { state: "unknown" }])),
    );
    const base = createTestWork({ axes, themes: [] });
    const work = {
      ...base,
      evidence: {
        ...base.evidence,
        groupingConfidence: 0.5,
        sourceAgreement: 0.5,
      },
    };

    expect(calculateAverageFactorConfidence(work)).toBe(0);
    expect(calculateWorkConfidence(work)).toBe(0.2);
  });

  it("is invariant to Theme input order", () => {
    const themes = THEME_TAGS.map((id, index) => ({
      id,
      centrality: (index % 2 === 0 ? 1 : 2) as 1 | 2,
      confidence: (index + 1) / (THEME_TAGS.length + 1),
    }));
    const forward = createTestWork({ themes });
    const reversed = createTestWork({ themes: [...themes].reverse() });

    expect(calculateAverageFactorConfidence(reversed)).toBe(
      calculateAverageFactorConfidence(forward),
    );
    expect(calculateWorkConfidence(reversed)).toBe(calculateWorkConfidence(forward));
  });

  it("uses the geometric mean for non-degenerate recommendation confidence", () => {
    expect(calculateRecommendationConfidence(0.36, 0.81)).toBe(0.54);
  });

  it("keeps intermediate precision until the final recommendation boundary", () => {
    const axes = workAxesSchema.parse(
      Object.fromEntries(AXIS_IDS.map((axisId) => [axisId, { state: "unknown" }])),
    );
    axes.progression = {
      state: "known",
      value: 2,
      confidence: 0.19425015128217638,
    };
    const work = createTestWork({
      axes,
      themes: [],
      evidence: {
        groupingConfidence: 0.4691309374757111,
        sourceAgreement: 0.4097697308752686,
      },
    });
    const workConfidence = calculateWorkConfidence(work);

    expect(workConfidence).toBe(0.2923302244395018);
    expect(roundScore(calculateRecommendationConfidence(0.1, workConfidence))).toBe(0.170976672222);
  });

  it.each([
    [0.75, "high"],
    [0.749999999999, "normal"],
    [0.5, "normal"],
    [0.499999999999, "low"],
  ] as const)("maps %s to the %s confidence level", (confidence, expected) => {
    expect(getConfidenceLevel(confidence)).toBe(expected);
  });
});
