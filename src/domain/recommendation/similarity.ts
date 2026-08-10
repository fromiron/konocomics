import {
  ART_AXIS_IDS,
  GENRE_TAGS,
  NARRATIVE_AXIS_IDS,
  THEME_TAGS,
  TONE_AXIS_IDS,
} from "../catalog/constants";
import type {
  AxisFactor,
  AxisId,
  CoverageGroup,
  GenreTag,
  ScaleValue,
  ThemeFactor,
  ThemeTag,
  Work,
} from "../catalog/types";
import {
  adjustScoreForCoverage,
  calculateAxisPairCoverage,
  calculateTagPairCoverage,
} from "./coverage";
import { GROUP_WEIGHTS, PRESENCE_SENSITIVE_AXIS_IDS } from "./constants";
import type { GroupSimilarityResult, SimilarityContribution, WorkSimilarityResult } from "./types";

type AxisCoverageGroup = Exclude<CoverageGroup, "genre" | "theme">;

function isPresenceSensitiveAxis(axisId: AxisId) {
  return PRESENCE_SENSITIVE_AXIS_IDS.some((candidate) => candidate === axisId);
}

function axisIdsForGroup(group: AxisCoverageGroup): readonly AxisId[] {
  switch (group) {
    case "narrative":
      return NARRATIVE_AXIS_IDS;
    case "tone":
      return TONE_AXIS_IDS;
    case "art":
      return ART_AXIS_IDS;
  }
}

export function calculateAxisValueSimilarity(axisId: AxisId, left: ScaleValue, right: ScaleValue) {
  let distance = Math.abs(left - right) / 4;
  if (isPresenceSensitiveAxis(axisId) && ((left === 0 && right > 0) || (right === 0 && left > 0))) {
    distance = Math.min(1, distance * 1.5);
  }
  return 1 - distance;
}

function knownPair(
  left: AxisFactor,
  right: AxisFactor,
): {
  left: Extract<AxisFactor, { state: "known" }>;
  right: Extract<AxisFactor, { state: "known" }>;
} | null {
  if (left.state !== "known" || right.state !== "known") {
    return null;
  }
  return { left, right };
}

export function calculateAxisGroupSimilarity(
  left: Work,
  right: Work,
  group: AxisCoverageGroup,
): GroupSimilarityResult {
  const axisIds = axisIdsForGroup(group);
  const { coverage } = calculateAxisPairCoverage(left.axes, right.axes, axisIds);
  const observations = axisIds.flatMap((axisId) => {
    const pair = knownPair(left.axes[axisId], right.axes[axisId]);
    if (pair === null) {
      return [];
    }
    return [
      {
        axisId,
        effectiveWeight: Math.min(pair.left.confidence, pair.right.confidence),
        similarity: calculateAxisValueSimilarity(axisId, pair.left.value, pair.right.value),
      },
    ];
  });
  const observedEffectiveWeightSum = observations.reduce(
    (sum, observation) => sum + observation.effectiveWeight,
    0,
  );
  const rawScore =
    observedEffectiveWeightSum === 0
      ? 0.5
      : observations.reduce(
          (sum, observation) => sum + observation.similarity * observation.effectiveWeight,
          0,
        ) / observedEffectiveWeightSum;
  const { adjustedScore, coverageScale } = adjustScoreForCoverage(group, rawScore, coverage);
  const contributions =
    observedEffectiveWeightSum === 0
      ? []
      : observations.flatMap<SimilarityContribution>((observation) => {
          const value =
            (observation.similarity - 0.5) *
            (observation.effectiveWeight / observedEffectiveWeightSum) *
            GROUP_WEIGHTS[group] *
            coverageScale;
          return value === 0 ? [] : [{ group, factorId: observation.axisId, value }];
        });

  return { group, rawScore, coverage, coverageScale, adjustedScore, contributions };
}

function calculateTagGroupSimilarity<Tag extends GenreTag | ThemeTag>(options: {
  group: "genre" | "theme";
  orderedTags: readonly Tag[];
  leftWeights: ReadonlyMap<Tag, number>;
  rightWeights: ReadonlyMap<Tag, number>;
}): GroupSimilarityResult {
  const { group, leftWeights, orderedTags, rightWeights } = options;
  const coverage = calculateTagPairCoverage([...leftWeights], [...rightWeights]);
  const tagWeights = orderedTags.flatMap((factorId) => {
    const leftWeight = leftWeights.get(factorId) ?? 0;
    const rightWeight = rightWeights.get(factorId) ?? 0;
    const unionWeight = Math.max(leftWeight, rightWeight);
    return unionWeight === 0
      ? []
      : [
          {
            factorId,
            intersectionWeight: Math.min(leftWeight, rightWeight),
            unionWeight,
          },
        ];
  });
  const totalUnionWeight = tagWeights.reduce((sum, tag) => sum + tag.unionWeight, 0);
  const totalIntersectionWeight = tagWeights.reduce((sum, tag) => sum + tag.intersectionWeight, 0);
  const rawScore = totalUnionWeight === 0 ? 0.5 : totalIntersectionWeight / totalUnionWeight;
  const { adjustedScore, coverageScale } = adjustScoreForCoverage(group, rawScore, coverage);
  const contributions =
    totalUnionWeight === 0
      ? []
      : tagWeights.flatMap<SimilarityContribution>((tag) => {
          const value =
            ((tag.intersectionWeight - 0.5 * tag.unionWeight) / totalUnionWeight) *
            GROUP_WEIGHTS[group] *
            coverageScale;
          return value === 0 ? [] : [{ group, factorId: tag.factorId, value }];
        });

  return { group, rawScore, coverage, coverageScale, adjustedScore, contributions };
}

function genreWeights(genres: readonly GenreTag[]) {
  return new Map(genres.map((genre) => [genre, 1]));
}

function themeWeights(themes: readonly ThemeFactor[]) {
  const weights = new Map<ThemeTag, number>();
  for (const theme of themes) {
    weights.set(theme.id, Math.max(weights.get(theme.id) ?? 0, theme.centrality));
  }
  return weights;
}

export function calculateGenreGroupSimilarity(left: Work, right: Work) {
  return calculateTagGroupSimilarity({
    group: "genre",
    orderedTags: GENRE_TAGS,
    leftWeights: genreWeights(left.genres),
    rightWeights: genreWeights(right.genres),
  });
}

export function calculateThemeGroupSimilarity(left: Work, right: Work) {
  return calculateTagGroupSimilarity({
    group: "theme",
    orderedTags: THEME_TAGS,
    leftWeights: themeWeights(left.themes),
    rightWeights: themeWeights(right.themes),
  });
}

export function workSimilarity(left: Work, right: Work): WorkSimilarityResult {
  const genre = calculateGenreGroupSimilarity(left, right);
  const theme = calculateThemeGroupSimilarity(left, right);
  const narrative = calculateAxisGroupSimilarity(left, right, "narrative");
  const tone = calculateAxisGroupSimilarity(left, right, "tone");
  const art = calculateAxisGroupSimilarity(left, right, "art");
  const groups = { genre, theme, narrative, tone, art };
  const contributions = [genre, theme, narrative, tone, art].flatMap(
    (result) => result.contributions,
  );
  const score =
    genre.adjustedScore * GROUP_WEIGHTS.genre +
    theme.adjustedScore * GROUP_WEIGHTS.theme +
    narrative.adjustedScore * GROUP_WEIGHTS.narrative +
    tone.adjustedScore * GROUP_WEIGHTS.tone +
    art.adjustedScore * GROUP_WEIGHTS.art;

  return { score, groups, contributions };
}
