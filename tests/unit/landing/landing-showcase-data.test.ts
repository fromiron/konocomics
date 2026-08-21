import { describe, expect, it } from "vitest";

import catalogJson from "@/data/generated/catalog-v1.json";
import { landingEditorialRankingIds } from "@/data/landing-showcase";
import { catalogV1Schema } from "@/domain/catalog/schema";

const catalog = catalogV1Schema.parse(catalogJson);
const worksById = new Map(catalog.works.map((work) => [work.id, work] as const));

describe("landing editorial ranking data", () => {
  it("keeps ten unique, onboarding-eligible Catalog works in an explicit order", () => {
    expect(landingEditorialRankingIds).toHaveLength(10);
    expect(new Set(landingEditorialRankingIds).size).toBe(10);

    for (const workId of landingEditorialRankingIds) {
      const work = worksById.get(workId);
      expect(work, `Missing editorial ranking work: ${workId}`).toBeDefined();
      expect(work?.eligibility.onboardingEligible).toBe(true);
    }
  });
});
