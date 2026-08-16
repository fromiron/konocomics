import { describe, expect, it } from "vitest";

import { createRecommendationFeedbackRecord } from "@/domain/profile/recommendation-feedback";

const UPDATED_AT = "2026-08-14T09:00:00.000+09:00";

describe("recommendation feedback mapping", () => {
  it("maps planned without inventing a reaction", () => {
    expect(
      createRecommendationFeedbackRecord({
        action: "planned",
        workId: "planned-work",
        updatedAt: UPDATED_AT,
      }),
    ).toEqual({
      workId: "planned-work",
      readingState: "planned",
      updatedAt: UPDATED_AT,
    });
  });

  it.each([
    ["highest", "favorite"],
    ["good", "liked"],
    ["neutral", "neutral"],
    ["poor", "disliked"],
  ] as const)("maps completed %s to %s", (choice, reaction) => {
    expect(
      createRecommendationFeedbackRecord({
        action: "completed",
        workId: "completed-work",
        reaction: choice,
        updatedAt: UPDATED_AT,
      }),
    ).toEqual({
      workId: "completed-work",
      readingState: "completed",
      reaction,
      updatedAt: UPDATED_AT,
    });
  });

  it("keeps a skipped completed reaction absent", () => {
    expect(
      createRecommendationFeedbackRecord({
        action: "completed",
        workId: "completed-work",
        reaction: "skip",
        updatedAt: UPDATED_AT,
      }),
    ).toEqual({
      workId: "completed-work",
      readingState: "completed",
      updatedAt: UPDATED_AT,
    });
  });

  it("maps selected hidden reasons to disliked and copies the caller-owned array", () => {
    const reasons = ["tooDark", "tooStressful"] as const;
    const record = createRecommendationFeedbackRecord({
      action: "hidden",
      workId: "hidden-work",
      reasons,
      updatedAt: UPDATED_AT,
    });

    expect(record).toEqual({
      workId: "hidden-work",
      readingState: "hidden",
      reaction: "disliked",
      negativeReasons: ["tooDark", "tooStressful"],
      updatedAt: UPDATED_AT,
    });
    expect(record.negativeReasons).not.toBe(reasons);
  });

  it("keeps skipped hidden feedback reasonless instead of synthesizing vagueDislike", () => {
    expect(
      createRecommendationFeedbackRecord({
        action: "hidden",
        workId: "hidden-work",
        reasons: [],
        updatedAt: UPDATED_AT,
      }),
    ).toEqual({
      workId: "hidden-work",
      readingState: "hidden",
      updatedAt: UPDATED_AT,
    });
  });
});
