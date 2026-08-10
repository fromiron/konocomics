import { describe, expect, it } from "vitest";

import { rankRecommendations } from "@/domain/recommendation/rank";
import { createGolden20Input } from "../../fixtures/recommendation/golden-20";

describe("twenty-work recommendation golden", () => {
  it("exposes every ranking and score-ledger change for review", () => {
    const input = createGolden20Input();
    expect(input.catalog.works).toHaveLength(20);
    const recommendations = rankRecommendations(input);
    for (const recommendation of recommendations) {
      expect(
        recommendation.contributions.reduce((sum, contribution) => sum + contribution.value, 0),
      ).toBeCloseTo(recommendation.tasteScore, 10);
    }
    expect(recommendations).toMatchSnapshot();
  });
});
