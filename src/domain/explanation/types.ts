import type { AxisId, CoverageGroup, GenreTag, ThemeTag } from "../catalog/types";
import type { ConfidenceLevel } from "../profile/confidence";
import type { NegativeReasonId } from "../profile/types";
import type {
  AxisPreferenceDirection,
  BaselineContribution,
  BaselineRecommendation,
  ContributionSource,
  GroupContribution,
} from "../recommendation/types";

export type ExplanationClusterId = "tacticalThinking" | "relationshipAppeal" | "toneLoad";

export type ExplanationFactorId = AxisId | GenreTag | ThemeTag;

export type ExplanationTemplateId =
  | "positiveWithAnchor"
  | "positiveGenreWithAnchor"
  | "positiveThemeWithAnchor"
  | "positiveRepeatedAnchor"
  | "positiveRepeatedAxisWithAnchor"
  | "positiveWithoutAnchor"
  | "positiveAxisWithoutAnchor"
  | "positiveAxisAdjustment"
  | "positiveThemeAdjustment"
  | "positiveLowerAxisAdjustment"
  | "cautionSimilarityWithAnchor"
  | "cautionSimilarityWithoutAnchor"
  | "baselineGenreWithAnchor"
  | "baselineGenreWithoutAnchor"
  | "baselineMarketObserved"
  | "baselineMaturity";

export type ExplanationLexicon = {
  factorLabels: Readonly<Partial<Record<ExplanationFactorId, string>>>;
  clusterLabels: Readonly<Record<ExplanationClusterId, string>>;
  confidenceLabels: Readonly<Record<ConfidenceLevel, string>>;
  templates: Readonly<Record<ExplanationTemplateId, string>>;
};

export type TasteExplanationSentence = {
  kind: "positive" | "caution";
  text: string;
  source: ContributionSource;
  group: CoverageGroup | "overall";
  factorId: ExplanationFactorId;
  value: number;
  anchorWorkIds: string[];
  axisPreferenceDirection?: AxisPreferenceDirection;
  negativeReasonId?: NegativeReasonId;
};

export type BaselineExplanationSentence = {
  kind: "baseline";
  text: string;
  source: BaselineContribution["source"];
  group: BaselineContribution["group"];
  factorId: BaselineContribution["factorId"];
  value: number;
  anchorWorkIds: string[];
};

export type StructuredExplanationSentence = TasteExplanationSentence | BaselineExplanationSentence;

export type ExplanationAnchor = {
  workId: string;
  title: string;
};

export type TasteRecommendationExplanation = {
  positiveReasons: TasteExplanationSentence[];
  caution?: TasteExplanationSentence;
  anchors: ExplanationAnchor[];
  confidence: {
    level: ConfidenceLevel;
    label: string;
  };
};

export type BaselineRecommendationExplanation = {
  reason?: BaselineExplanationSentence;
  anchors: ExplanationAnchor[];
};

export type WorkTitleResolver = (workId: string) => string | undefined;

/**
 * How the lead reason is chosen among the selected positives (02 §6.9). `axisOrThemeFirst` leads
 * with the strongest Axis/Theme reason and lets a Genre match lead only when no Axis/Theme reason
 * is shown; `contributionValue` keeps the plain value order that frozen experiment output records.
 */
export type LeadReasonOrder = "axisOrThemeFirst" | "contributionValue";

export type GenerateTasteExplanationInput = {
  /** Presentation only: choose an existing valid reason before rendering its wording. */
  preferredFactorId?: ExplanationFactorId;
  /** Presentation only; defaults to `axisOrThemeFirst`. Never changes which reasons are shown. */
  leadReasonOrder?: LeadReasonOrder;
  contributions: readonly GroupContribution[];
  confidenceLevel: ConfidenceLevel;
  lexicon: ExplanationLexicon;
  resolveTitle: WorkTitleResolver;
};

export type GenerateBaselineExplanationInput = {
  contributions: readonly BaselineContribution[];
  bestAnchorId: BaselineRecommendation["bestAnchorId"];
  lexicon: ExplanationLexicon;
  resolveTitle: WorkTitleResolver;
};
