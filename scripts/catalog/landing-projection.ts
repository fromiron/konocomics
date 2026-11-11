import {
  LANDING_LENS_MIN_ITEMS,
  LANDING_STAGE_COUNT,
  landingEditorialRankingIds,
  landingSampleProfile,
} from "../../src/data/landing-showcase";
import type { CatalogV1, Work } from "../../src/domain/catalog/types";
import { generateVariedTasteExplanations } from "../../src/domain/explanation/generate";
import {
  groupRecommendationLenses,
  RECOMMENDATION_LENS_CANDIDATE_LIMIT,
} from "../../src/domain/explanation/lens";
import type { TasteRecommendationExplanation } from "../../src/domain/explanation/types";
import type { UserWorkRecord } from "../../src/domain/profile/types";
import {
  buildRecommendationPlan,
  selectRecommendationPlanEntries,
} from "../../src/domain/recommendation/rank";
import type {
  RecommendationContext,
  RecommendationInput,
  RecommendationPlanEntry,
} from "../../src/domain/recommendation/types";
import { explanationLexicon } from "../../src/lib/strings";

// Fixed so the generated projection is byte-stable across builds.
const SAMPLE_RECORDED_AT = "2026-01-01T00:00:00.000Z";

/**
 * The static landing projection: the editorial Top 10 plus engine-computed examples for a fixed
 * sample profile. The examples are its best recommendations (stage cards) and one liked-work lens,
 * explained and grouped exactly as the recommendations page explains and groups its shelves.
 */
export function buildLandingProjection(catalog: CatalogV1, context: RecommendationContext) {
  const volumesById = new Map(catalog.volumes.map((volume) => [volume.id, volume] as const));
  const worksById = new Map(catalog.works.map((work) => [work.id, work] as const));
  const representativeVolume = (workId: string) => {
    const volumeId = catalog.representativeVolumeByWorkId[workId];
    return volumeId === undefined ? undefined : volumesById.get(volumeId);
  };
  const toLandingWork = (work: Work) => {
    const isbn = representativeVolume(work.id)?.isbn;
    return {
      id: work.id,
      title: work.title,
      creators: work.creators,
      genres: work.genres,
      status: work.status,
      ...(isbn === undefined ? {} : { isbn }),
    };
  };
  const requireWork = (workId: string, purpose: string) => {
    const work = worksById.get(workId);
    if (work === undefined || !work.eligibility.onboardingEligible) {
      throw new Error(`Landing ${purpose} work is unavailable: ${workId}`);
    }
    return work;
  };

  const editorialRankingWorks = landingEditorialRankingIds.map((workId) =>
    requireWork(workId, "editorial ranking"),
  );
  const sampleWorks = landingSampleProfile.map(({ workId }) => {
    const work = requireWork(workId, "sample profile");
    if (!work.eligibility.recommendationEligible) {
      throw new Error(`Landing sample profile work is not recommendable: ${workId}`);
    }
    return work;
  });
  const records: UserWorkRecord[] = landingSampleProfile.map(({ workId, reaction }) => ({
    workId,
    readingState: "completed",
    reaction,
    updatedAt: SAMPLE_RECORDED_AT,
  }));
  const input: RecommendationInput = {
    catalog,
    records,
    adjustments: { axes: {}, themes: {} },
    policies: {
      preferCompleted: false,
      preferHidden: false,
      preferVerified: false,
      excludeIncomplete: false,
    },
    context,
  };
  // Reasons name only the sample's own works, exactly as the home resolves them at runtime.
  const sampleTitles = new Map(sampleWorks.map((work) => [work.id, work.title] as const));
  const resolveTitle = (workId: string) => sampleTitles.get(workId);
  // Recommendations may come from works that onboarding does not list, so only existence matters.
  // The stored lead factor lets the home render the very lead chosen here from the contributions.
  const toRecommendation = (
    entry: RecommendationPlanEntry,
    explanations: ReadonlyMap<string, TasteRecommendationExplanation>,
  ) => {
    const work = worksById.get(entry.workId);
    const lead = explanations.get(entry.workId)?.positiveReasons[0];
    if (work === undefined) {
      throw new Error(`Landing example recommendation is outside the Catalog: ${entry.workId}`);
    }
    if (lead === undefined) {
      throw new Error(`Landing example recommendation has no lead reason: ${entry.workId}`);
    }
    return {
      work: toLandingWork(work),
      confidenceLevel: entry.confidenceLevel,
      contributions: entry.contributions,
      preferredFactorId: lead.factorId,
    };
  };

  // The page never repeats a work: examples skip the sample's own works and the Top 10.
  const shownIds = new Set<string>([
    ...landingEditorialRankingIds,
    ...records.map((record) => record.workId),
  ]);
  const plan = buildRecommendationPlan(input);
  // The stage is the top of what `rankRecommendations` returns for this profile.
  const stage = selectRecommendationPlanEntries(plan, input.policies)
    .filter((entry) => !shownIds.has(entry.workId))
    .slice(0, LANDING_STAGE_COUNT);
  stage.forEach((entry) => shownIds.add(entry.workId));
  // The rest of the plan's top feeds the lens grouping, as on the recommendations page.
  const lensCandidates = plan
    .filter((entry) => !shownIds.has(entry.workId))
    .slice(0, RECOMMENDATION_LENS_CANDIDATE_LIMIT);
  // Displayed entries first, then the lens candidates: the page's order of operations, so the
  // stage leads vary first and the lens groups by the varied leads.
  const explanations = generateVariedTasteExplanations(
    [...stage, ...lensCandidates].map((entry) => ({
      workId: entry.workId,
      contributions: entry.contributions,
      confidenceLevel: entry.confidenceLevel,
      lexicon: explanationLexicon,
      resolveTitle,
    })),
  );
  if (
    stage.length < LANDING_STAGE_COUNT ||
    stage.some((entry) => explanations.get(entry.workId)?.positiveReasons[0] === undefined)
  ) {
    throw new Error(
      `Landing sample profile produced fewer than ${String(LANDING_STAGE_COUNT)} explained examples`,
    );
  }

  const lens = groupRecommendationLenses({
    items: lensCandidates,
    leadReasonOf: (entry) => explanations.get(entry.workId)?.positiveReasons[0],
    lexicon: explanationLexicon,
    resolveTitle,
  }).find((candidate) => candidate.kind === "anchor");
  if (lens?.kind !== "anchor" || lens.items.length < LANDING_LENS_MIN_ITEMS) {
    throw new Error(
      `Landing sample profile produced no liked-work lens of ${String(LANDING_LENS_MIN_ITEMS)} works`,
    );
  }

  return {
    catalogVersion: catalog.catalogVersion,
    recommendableWorkCount: catalog.works.filter((work) => work.eligibility.recommendationEligible)
      .length,
    editorialRankingWorks: editorialRankingWorks.map(toLandingWork),
    sample: {
      anchorWorks: sampleWorks.map(toLandingWork),
      stage: stage.map((entry) => toRecommendation(entry, explanations)),
      lens: {
        anchorWorkId: lens.anchorWorkId,
        items: lens.items.map((entry) => {
          const caption = representativeVolume(entry.workId)?.metadata?.itemCaption?.trim();
          return { ...toRecommendation(entry, explanations), ...(caption ? { caption } : {}) };
        }),
      },
    },
  };
}
