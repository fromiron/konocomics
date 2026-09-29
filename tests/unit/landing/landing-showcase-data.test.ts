import { describe, expect, it } from "vitest";

import catalogJson from "@/data/generated/catalog-v1.json";
import landingJson from "@/data/generated/landing-v1.json";
import contextJson from "@/data/generated/recommendation-context-v1.json";
import { landingEditorialRankingIds, landingSampleProfile } from "@/data/landing-showcase";
import { catalogV1Schema } from "@/domain/catalog/schema";
import { recommendationContextSchema } from "@/domain/recommendation/context-schema";
import { landingProjectionSchema } from "@/features/landing/landing-types";

import { buildLandingProjection } from "../../../scripts/catalog/landing-projection";

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

describe("landing sample projection", () => {
  const landing = landingProjectionSchema.parse(landingJson);

  it("is exactly what the build derives from the bundled Catalog and engine", () => {
    expect(buildLandingProjection(catalog, recommendationContextSchema.parse(contextJson))).toEqual(
      landing,
    );
  });

  it("never repeats a work across the example, its sample profile, Top 10, and discovery", () => {
    const sampleIds = landingSampleProfile.map((entry) => entry.workId);
    expect(landing.sample.anchorWorks.map((work) => work.id)).toEqual(sampleIds);
    const featured = [
      landing.sample.recommendation.work.id,
      ...sampleIds,
      ...landing.editorialRankingWorks.map((work) => work.id),
      ...landing.discoveryWorks.map((work) => work.id),
    ];
    expect(new Set(featured).size).toBe(featured.length);
    expect(landing.sample.recommendation.contributions.length).toBeGreaterThan(0);
    expect(landing.sample.axes.length).toBeGreaterThan(0);
    expect(landing.sample.axes.length).toBeLessThanOrEqual(4);
    expect(landing.recommendableWorkCount).toBe(
      catalog.works.filter((work) => work.eligibility.recommendationEligible).length,
    );
  });
});
