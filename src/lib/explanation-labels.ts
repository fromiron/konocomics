import { explanationClusterFor, type ExplanationFactorId } from "@/domain/explanation";

import { explanationLexicon } from "./strings";

/** Short label for a reason's factor, using the cluster name when the factor belongs to one. */
export function explanationFactorLabel(factorId: ExplanationFactorId) {
  const cluster = explanationClusterFor(factorId);
  return cluster === undefined
    ? explanationLexicon.factorLabels[factorId]
    : explanationLexicon.clusterLabels[cluster];
}
