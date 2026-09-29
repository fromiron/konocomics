import { landingEditorialRankingIds, landingSampleProfile } from "../../src/data/landing-showcase";
import { AXIS_IDS, GENRE_TAGS } from "../../src/domain/catalog/constants";
import type { CatalogV1, Work } from "../../src/domain/catalog/types";
import { summarizeMangaDna } from "../../src/domain/profile/dna-summary";
import type { UserWorkRecord } from "../../src/domain/profile/types";
import { rankRecommendations } from "../../src/domain/recommendation/rank";
import type { RecommendationContext } from "../../src/domain/recommendation/types";

const DISCOVERY_LIMIT = 8;
const SAMPLE_AXIS_LIMIT = 4;
// Fixed so the generated projection is byte-stable across builds.
const SAMPLE_RECORDED_AT = "2026-01-01T00:00:00.000Z";

function compareIds(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

/** The static landing projection: editorial picks plus an engine-computed example. */
export function buildLandingProjection(catalog: CatalogV1, context: RecommendationContext) {
  const volumesById = new Map(catalog.volumes.map((volume) => [volume.id, volume] as const));
  const worksById = new Map(catalog.works.map((work) => [work.id, work] as const));
  const toLandingWork = (work: Work) => {
    const representativeVolumeId = catalog.representativeVolumeByWorkId[work.id];
    return {
      id: work.id,
      title: work.title,
      creators: work.creators,
      genres: work.genres,
      status: work.status,
      ...(representativeVolumeId === undefined
        ? {}
        : { isbn: volumesById.get(representativeVolumeId)?.isbn }),
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

  // The example is the best-ranked result that the page does not already feature.
  const featuredIds = new Set<string>([
    ...landingEditorialRankingIds,
    ...records.map((r) => r.workId),
  ]);
  const recommendation = rankRecommendations({
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
  }).find((entry) => !featuredIds.has(entry.workId));
  if (recommendation === undefined) {
    throw new Error("Landing sample profile produced no example recommendation");
  }
  // Recommendations may come from works that onboarding does not list, so only existence matters.
  const recommendedWork = worksById.get(recommendation.workId);
  if (recommendedWork === undefined) {
    throw new Error(
      `Landing example recommendation is outside the Catalog: ${recommendation.workId}`,
    );
  }

  const axisOrder = new Map(AXIS_IDS.map((axisId, index) => [axisId, index] as const));
  const axes = summarizeMangaDna(catalog.works, records)
    .axes.flatMap((axis) =>
      axis.state === "known" && axis.value !== null && axis.value > 0
        ? [{ axisId: axis.factorId, value: axis.value }]
        : [],
    )
    .sort(
      (left, right) =>
        right.value - left.value ||
        (axisOrder.get(left.axisId) ?? 0) - (axisOrder.get(right.axisId) ?? 0),
    )
    .slice(0, SAMPLE_AXIS_LIMIT);

  // One work per genre, in genre order, never repeating a work featured elsewhere on the page.
  const usedIds = new Set([...featuredIds, recommendedWork.id]);
  const discoveryWorks: Work[] = [];
  const candidates = catalog.works
    .filter(
      (work) => work.eligibility.onboardingEligible && work.eligibility.recommendationEligible,
    )
    .sort((left, right) => compareIds(left.id, right.id));
  for (const genre of GENRE_TAGS) {
    const work = candidates.find(
      (candidate) => candidate.genres.includes(genre) && !usedIds.has(candidate.id),
    );
    if (work === undefined) continue;
    usedIds.add(work.id);
    discoveryWorks.push(work);
    if (discoveryWorks.length === DISCOVERY_LIMIT) break;
  }

  return {
    catalogVersion: catalog.catalogVersion,
    recommendableWorkCount: catalog.works.filter((work) => work.eligibility.recommendationEligible)
      .length,
    editorialRankingWorks: editorialRankingWorks.map(toLandingWork),
    discoveryWorks: discoveryWorks.map(toLandingWork),
    sample: {
      anchorWorks: sampleWorks.map(toLandingWork),
      recommendation: {
        work: toLandingWork(recommendedWork),
        confidenceLevel: recommendation.confidenceLevel,
        contributions: recommendation.contributions,
      },
      axes,
    },
  };
}
