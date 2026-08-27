import { describe, expect, it } from "vitest";

import {
  compareCodeUnit,
  decidePromotionJudgment,
  type PromotionJudgmentInput,
} from "../../../scripts/catalog/promotion-judgment";

const verifiedInput: PromotionJudgmentInput = {
  targetStatus: "recommendationVerified",
  annotationStatus: "complete",
  reasonCodes: [],
  blockerCodes: [],
};

describe("promotion judgment", () => {
  it("accepts only a complete, unblocked Gold judgment", () => {
    expect(decidePromotionJudgment({ ...verifiedInput, targetStatus: "gold" })).toEqual({
      currentStatus: "gold",
      promotionOutcome: "gold",
      reasonCodes: [],
      blockerCodes: [],
    });
    expect(() =>
      decidePromotionJudgment({
        ...verifiedInput,
        targetStatus: "gold",
        reasonCodes: ["REVIEW_NOT_ACCEPTED"],
      }),
    ).toThrow();
    expect(() =>
      decidePromotionJudgment({
        ...verifiedInput,
        targetStatus: "gold",
        blockerCodes: ["ADULT_CONTENT"],
      }),
    ).toThrow();
  });

  it("returns the verified, blocked, and two pending states", () => {
    expect(decidePromotionJudgment(verifiedInput)).toMatchObject({
      currentStatus: "recommendationVerified",
      promotionOutcome: "recommendationVerified",
    });
    expect(
      decidePromotionJudgment({ ...verifiedInput, blockerCodes: ["ADULT_CONTENT"] }),
    ).toMatchObject({ currentStatus: "libraryOnly", promotionOutcome: "promotionBlocked" });
    expect(
      decidePromotionJudgment({
        ...verifiedInput,
        annotationStatus: "missing",
        reasonCodes: ["ANNOTATION_MISSING"],
      }),
    ).toMatchObject({ currentStatus: "libraryOnly", promotionOutcome: "pending" });
    expect(
      decidePromotionJudgment({
        ...verifiedInput,
        annotationStatus: "draft",
        reasonCodes: ["ANNOTATION_INCOMPLETE"],
      }),
    ).toMatchObject({ currentStatus: "annotationDraft", promotionOutcome: "pending" });
  });

  it("canonicalizes codes and ignores diagnostic-only runtime properties", () => {
    const first = decidePromotionJudgment({
      ...verifiedInput,
      annotationStatus: "draft",
      reasonCodes: ["REVIEW_NOT_ACCEPTED", "ANNOTATION_INCOMPLETE", "REVIEW_NOT_ACCEPTED"],
      blockerCodes: ["SAFETY_UNRESOLVED", "ADULT_CONTENT", "SAFETY_UNRESOLVED"],
      model: "model-a",
      provider: "provider-a",
      attempt: 1,
      confidence: 0.99,
    } as PromotionJudgmentInput);
    const second = decidePromotionJudgment({
      ...verifiedInput,
      annotationStatus: "draft",
      reasonCodes: ["ANNOTATION_INCOMPLETE", "REVIEW_NOT_ACCEPTED"],
      blockerCodes: ["ADULT_CONTENT", "SAFETY_UNRESOLVED"],
    });

    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    expect(first.reasonCodes).toEqual(["ANNOTATION_INCOMPLETE", "REVIEW_NOT_ACCEPTED"]);
    expect(first.blockerCodes).toEqual(["ADULT_CONTENT", "SAFETY_UNRESOLVED"]);
    expect(() => decidePromotionJudgment({ ...verifiedInput, blockerCodes: [""] })).toThrow(
      "Promotion blocker codes cannot contain an empty code",
    );
    expect(() =>
      decidePromotionJudgment({
        ...verifiedInput,
        reasonCodes: ["UNKNOWN_REASON" as never],
      }),
    ).toThrow("Promotion reason codes contain an unknown code");
  });

  it("uses code-unit ordering", () => {
    expect(compareCodeUnit("A", "a")).toBe(-1);
    expect(compareCodeUnit("a", "A")).toBe(1);
    expect(compareCodeUnit("同", "同")).toBe(0);
  });
});
