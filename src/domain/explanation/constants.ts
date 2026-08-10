import { AXIS_IDS, GENRE_TAGS, THEME_TAGS } from "../catalog/constants";
import type { AxisId } from "../catalog/types";
import type { ExplanationClusterId, ExplanationFactorId } from "./types";

export const EXPLANATION_CLUSTER_IDS = [
  "tacticalThinking",
  "relationshipAppeal",
  "toneLoad",
] as const satisfies readonly ExplanationClusterId[];

export const EXPLANATION_CLUSTERS = {
  tacticalThinking: ["problemSolving", "strategy", "mysteryReveal"],
  relationshipAppeal: ["characterArcWeight", "relationshipStructure"],
  toneLoad: ["darkness", "mentalStress"],
} as const satisfies Readonly<Record<ExplanationClusterId, readonly AxisId[]>>;

const EXPLANATION_FACTOR_IDS = new Set<string>([...AXIS_IDS, ...GENRE_TAGS, ...THEME_TAGS]);

const GENRE_TAG_IDS = new Set<string>(GENRE_TAGS);

export function isExplanationFactorId(factorId: string): factorId is ExplanationFactorId {
  return EXPLANATION_FACTOR_IDS.has(factorId);
}

export function isGenreTag(factorId: string): factorId is (typeof GENRE_TAGS)[number] {
  return GENRE_TAG_IDS.has(factorId);
}

export function explanationClusterFor(
  factorId: ExplanationFactorId,
): ExplanationClusterId | undefined {
  for (const clusterId of EXPLANATION_CLUSTER_IDS) {
    if (EXPLANATION_CLUSTERS[clusterId].some((candidate) => candidate === factorId)) {
      return clusterId;
    }
  }
  return undefined;
}
