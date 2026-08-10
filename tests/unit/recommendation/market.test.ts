import { describe, expect, it } from "vitest";

import { calculateBayesianRating, calculateMaturity } from "@/domain/recommendation/market";

describe("recommendation market signals", () => {
  it("uses a prior count of twenty and falls back to the catalog average", () => {
    expect(calculateBayesianRating(5, 20, 3)).toBe(4);
    expect(calculateBayesianRating(undefined, undefined, 3.5)).toBe(3.5);
    expect(calculateBayesianRating(4, 0, 3.5)).toBe(3.5);
  });

  it("bounds maturity at the verified-policy scale", () => {
    expect(calculateMaturity(undefined)).toBe(0);
    expect(calculateMaturity(0)).toBe(0);
    expect(calculateMaturity(15)).toBe(1);
    expect(calculateMaturity(100)).toBe(1);
  });
});
