import type { AxisId, CatalogV1, CoverageGroup, GenreTag, ThemeTag, Work } from "../catalog/types";
import type {
  NegativeReasonId,
  ProfileAdjustments,
  RecommendationPolicies,
  UserWorkRecord,
} from "../profile/types";
import type { ConfidenceLevel } from "../profile/confidence";

export type SimilarityFactorId = AxisId | GenreTag | ThemeTag;

export type SimilarityContribution = {
  group: CoverageGroup;
  factorId: SimilarityFactorId;
  value: number;
};

export type GroupSimilarityResult = {
  group: CoverageGroup;
  rawScore: number;
  coverage: number;
  coverageScale: number;
  adjustedScore: number;
  contributions: SimilarityContribution[];
};

export type WorkSimilarityResult = {
  score: number;
  groups: Record<CoverageGroup, GroupSimilarityResult>;
  contributions: SimilarityContribution[];
};

export type ContributionSource =
  "baseline" | "similarity" | "consensus" | "adjustment" | "penalty" | "policy" | "clamp";

export type AxisPreferenceDirection = "higher" | "lower";

export type GroupContribution = {
  source: ContributionSource;
  group: CoverageGroup | "overall";
  factorId: string;
  value: number;
  anchorWorkIds: string[];
  axisPreferenceDirection?: AxisPreferenceDirection;
  negativeReasonId?: NegativeReasonId;
  explainable: boolean;
};

export type CatalogRole = "anchor" | "bridge" | "discovery";

export type RecommendationConstraintMetadata = {
  workId: string;
  catalogRole: CatalogRole;
  seriesGroupId?: string;
  volumeCount: number;
};

export type RecommendationWorkMarketSignal = {
  workId: string;
  reviewAverage?: number;
  reviewCount?: number;
};

export type RecommendationContext = {
  constraintByWorkId: Record<string, RecommendationConstraintMetadata>;
  marketSnapshot: {
    catalogVersion: string;
    catalogAverageRating: number;
    byWorkId: Record<string, RecommendationWorkMarketSignal>;
  };
};

export type RecommendationInput = {
  catalog: CatalogV1;
  records: UserWorkRecord[];
  adjustments: ProfileAdjustments;
  policies: RecommendationPolicies;
  context: RecommendationContext;
};

export type RankedRecommendation = {
  workId: string;
  tasteScore: number;
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  bestAnchorId: string;
  contributions: GroupContribution[];
  penaltiesApplied: NegativeReasonId[];
};

export type BaselineContribution = {
  source: "genre" | "market" | "maturity";
  group: "genre" | "overall";
  factorId: GenreTag | "bayesianRating" | "maturity";
  value: number;
  anchorWorkIds: string[];
  explainable: boolean;
};

export type BaselineRecommendation = {
  workId: string;
  baselineScore: number;
  bestAnchorId: string | null;
  genreScore: number;
  bayesianRating: number;
  maturity: number;
  contributions: BaselineContribution[];
};

export type ScoredRecommendation = Omit<RankedRecommendation, "confidenceLevel"> & {
  work: Work;
  bayesianRating: number;
  maturity: number;
  isPopular: boolean;
  isDiscovery: boolean;
  majorThemeKey: string;
  seriesGroupId: string;
};
