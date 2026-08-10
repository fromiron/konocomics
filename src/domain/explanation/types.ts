import type { AxisId, CoverageGroup, GenreTag, ThemeTag } from "../catalog/types";
import type { ConfidenceLevel } from "../profile/confidence";
import type { NegativeReasonId } from "../profile/types";
import type {
  BaselineContribution,
  BaselineRecommendation,
  ContributionSource,
  GroupContribution,
} from "../recommendation/types";

export type ExplanationClusterId = "tacticalThinking" | "relationshipAppeal" | "toneLoad";

export type ExplanationFactorId = AxisId | GenreTag | ThemeTag;

export type ExplanationTemplateId =
  | "positiveWithAnchor"
  | "positiveWithoutAnchor"
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

export type GenerateTasteExplanationInput = {
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
