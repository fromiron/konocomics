import { describe, expect, it } from "vitest";

import catalogJson from "@/data/generated/catalog-v1.json";
import landingJson from "@/data/generated/landing-v1.json";
import contextJson from "@/data/generated/recommendation-context-v1.json";
import {
  LANDING_LENS_MIN_ITEMS,
  LANDING_STAGE_COUNT,
  landingEditorialRankingIds,
  landingSampleProfile,
} from "@/data/landing-showcase";
import { catalogV1Schema } from "@/domain/catalog/schema";
import { generateTasteExplanation } from "@/domain/explanation";
import { recommendationContextSchema } from "@/domain/recommendation/context-schema";
import {
  landingProjectionSchema,
  type LandingRecommendation,
} from "@/features/landing/landing-types";
import { sampleReasonOf } from "@/features/landing/sample-reason";
import { explanationLexicon } from "@/lib/strings";

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

  it("never repeats a work across the stage, the lens, the sample profile, and Top 10", () => {
    const sampleIds = landingSampleProfile.map((entry) => entry.workId);
    expect(landing.sample.anchorWorks.map((work) => work.id)).toEqual(sampleIds);
    const featured = [
      ...landing.sample.stage.map(({ work }) => work.id),
      ...landing.sample.lens.items.map(({ work }) => work.id),
      ...sampleIds,
      ...landing.editorialRankingWorks.map((work) => work.id),
    ];
    expect(new Set(featured).size).toBe(featured.length);
    expect(landing.sample.stage).toHaveLength(LANDING_STAGE_COUNT);
    expect(landing.sample.lens.items.length).toBeGreaterThanOrEqual(LANDING_LENS_MIN_ITEMS);
    expect(landing.recommendableWorkCount).toBe(
      catalog.works.filter((work) => work.eligibility.recommendationEligible).length,
    );
  });

  it("varies the stage leads and names the lens's liked work in every lens lead", () => {
    const titles = new Map(
      landing.sample.anchorWorks.map((work) => [work.id, work.title] as const),
    );
    const resolveTitle = (workId: string) => titles.get(workId);
    // The home renders each entry's lead from its contributions and the lead the build chose.
    const leadOf = (entry: LandingRecommendation) => {
      const [lead] = generateTasteExplanation({
        contributions: entry.contributions,
        confidenceLevel: entry.confidenceLevel,
        lexicon: explanationLexicon,
        preferredFactorId: entry.preferredFactorId,
        resolveTitle,
      }).positiveReasons;
      expect(lead?.factorId).toBe(entry.preferredFactorId);
      expect(sampleReasonOf(entry, resolveTitle).text).toBe(lead?.text);
      return lead?.text;
    };
    const anchorTitle = titles.get(landing.sample.lens.anchorWorkId);

    const stageLeads = landing.sample.stage.map(leadOf);
    stageLeads.forEach((lead) => expect(lead).toBeDefined());
    expect(new Set(stageLeads).size).toBeGreaterThan(1);
    expect(anchorTitle).toBeDefined();
    for (const entry of landing.sample.lens.items) {
      expect(leadOf(entry)).toContain(`『${anchorTitle ?? ""}』`);
    }
  });
});
