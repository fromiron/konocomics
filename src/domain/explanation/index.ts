export { EXPLANATION_CLUSTERS, EXPLANATION_CLUSTER_IDS, explanationClusterFor } from "./constants";
export { generateBaselineExplanation, generateTasteExplanation } from "./generate";
export type {
  BaselineExplanationSentence,
  BaselineRecommendationExplanation,
  ExplanationAnchor,
  ExplanationClusterId,
  ExplanationFactorId,
  ExplanationLexicon,
  ExplanationTemplateId,
  GenerateBaselineExplanationInput,
  GenerateTasteExplanationInput,
  StructuredExplanationSentence,
  TasteExplanationSentence,
  TasteRecommendationExplanation,
  WorkTitleResolver,
} from "./types";
