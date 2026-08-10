import { compareText } from "../recommendation/math";
import type { BaselineContribution, GroupContribution } from "../recommendation/types";
import { explanationClusterFor, isExplanationFactorId, isGenreTag } from "./constants";
import type {
  BaselineExplanationSentence,
  BaselineRecommendationExplanation,
  ExplanationAnchor,
  ExplanationClusterId,
  ExplanationFactorId,
  ExplanationLexicon,
  GenerateBaselineExplanationInput,
  GenerateTasteExplanationInput,
  TasteExplanationSentence,
  TasteRecommendationExplanation,
  WorkTitleResolver,
} from "./types";

const MAX_POSITIVE_REASONS = 3;
const MAX_ANCHORS = 3;
const TEMPLATE_TOKEN_PATTERN = /\{factorLabel\}|\{anchorTitle\}/gu;

type TasteCandidate = {
  contribution: GroupContribution;
  factorId: ExplanationFactorId;
  factorLabel: string;
  clusterId?: ExplanationClusterId;
};

type TasteCompetitionCandidate = TasteCandidate & {
  kind: TasteExplanationSentence["kind"];
};

function compareTasteContributionIdentity(left: GroupContribution, right: GroupContribution) {
  return (
    compareText(left.source, right.source) ||
    compareText(left.group, right.group) ||
    compareText(left.factorId, right.factorId) ||
    compareText(left.anchorWorkIds.join("\u0000"), right.anchorWorkIds.join("\u0000")) ||
    compareText(left.negativeReasonId ?? "", right.negativeReasonId ?? "")
  );
}

function compareBaselineContributionIdentity(
  left: BaselineContribution,
  right: BaselineContribution,
) {
  return (
    compareText(left.source, right.source) ||
    compareText(left.factorId, right.factorId) ||
    compareText(left.anchorWorkIds.join("\u0000"), right.anchorWorkIds.join("\u0000"))
  );
}

function interpolateTemplate(
  template: string,
  values: { factorLabel?: string; anchorTitle?: string },
) {
  return template.replace(TEMPLATE_TOKEN_PATTERN, (token) =>
    token === "{factorLabel}" ? (values.factorLabel ?? "") : (values.anchorTitle ?? ""),
  );
}

function cachedTitleResolver(resolveTitle: WorkTitleResolver): WorkTitleResolver {
  const cache = new Map<string, string | undefined>();
  return (workId) => {
    if (!cache.has(workId)) {
      cache.set(workId, resolveTitle(workId));
    }
    return cache.get(workId);
  };
}

function firstResolvedTitle(anchorWorkIds: readonly string[], resolveTitle: WorkTitleResolver) {
  for (const workId of anchorWorkIds) {
    const title = resolveTitle(workId);
    if (title !== undefined && title !== "") {
      return title;
    }
  }
  return undefined;
}

function tasteCandidateFor(
  contribution: GroupContribution,
  lexicon: ExplanationLexicon,
): TasteCandidate | undefined {
  if (!contribution.explainable || !isExplanationFactorId(contribution.factorId)) {
    return undefined;
  }
  const factorLabel = lexicon.factorLabels[contribution.factorId];
  if (factorLabel === undefined) {
    return undefined;
  }
  const clusterId = explanationClusterFor(contribution.factorId);
  return {
    contribution,
    factorId: contribution.factorId,
    factorLabel: clusterId === undefined ? factorLabel : lexicon.clusterLabels[clusterId],
    ...(clusterId === undefined ? {} : { clusterId }),
  };
}

function selectTasteContributions(
  contributions: readonly GroupContribution[],
  lexicon: ExplanationLexicon,
) {
  const candidates = contributions.flatMap<TasteCandidate>((contribution) => {
    const candidate = tasteCandidateFor(contribution, lexicon);
    return candidate === undefined ? [] : [candidate];
  });
  const positives = candidates.filter(({ contribution }) => contribution.value > 0);
  const globalCaution = candidates
    .filter(({ contribution }) => contribution.source === "similarity" && contribution.value < 0)
    .sort(
      (left, right) =>
        left.contribution.value - right.contribution.value ||
        compareTasteContributionIdentity(left.contribution, right.contribution),
    )[0];
  const competition: TasteCompetitionCandidate[] = [
    ...positives.map((candidate) => ({ ...candidate, kind: "positive" as const })),
    ...(globalCaution === undefined ? [] : [{ ...globalCaution, kind: "caution" as const }]),
  ].sort(
    (left, right) =>
      Math.abs(right.contribution.value) - Math.abs(left.contribution.value) ||
      compareTasteContributionIdentity(left.contribution, right.contribution),
  );
  const usedGroups = new Set<string>();
  const usedClusters = new Set<ExplanationClusterId>();
  const selectedPositives: TasteCandidate[] = [];
  let selectedCaution: TasteCandidate | undefined;

  for (const candidate of competition) {
    if (
      usedGroups.has(candidate.contribution.group) ||
      (candidate.clusterId !== undefined && usedClusters.has(candidate.clusterId))
    ) {
      continue;
    }
    if (candidate.kind === "positive") {
      if (selectedPositives.length >= MAX_POSITIVE_REASONS) {
        continue;
      }
      selectedPositives.push(candidate);
    } else {
      selectedCaution = candidate;
    }
    usedGroups.add(candidate.contribution.group);
    if (candidate.clusterId !== undefined) {
      usedClusters.add(candidate.clusterId);
    }
  }

  selectedPositives.sort(
    (left, right) =>
      right.contribution.value - left.contribution.value ||
      compareTasteContributionIdentity(left.contribution, right.contribution),
  );
  return { selectedPositives, selectedCaution };
}

function tasteSentenceFor(options: {
  candidate: TasteCandidate;
  kind: TasteExplanationSentence["kind"];
  lexicon: ExplanationLexicon;
  resolveTitle: WorkTitleResolver;
}): TasteExplanationSentence {
  const { candidate, kind, lexicon, resolveTitle } = options;
  const { contribution, factorId, factorLabel } = candidate;
  const anchorTitle =
    contribution.source === "similarity"
      ? firstResolvedTitle(contribution.anchorWorkIds, resolveTitle)
      : undefined;
  const template =
    kind === "positive"
      ? anchorTitle === undefined
        ? lexicon.templates.positiveWithoutAnchor
        : lexicon.templates.positiveWithAnchor
      : anchorTitle === undefined
        ? lexicon.templates.cautionSimilarityWithoutAnchor
        : lexicon.templates.cautionSimilarityWithAnchor;

  return {
    kind,
    text: interpolateTemplate(template, {
      factorLabel,
      ...(anchorTitle === undefined ? {} : { anchorTitle }),
    }),
    source: contribution.source,
    group: contribution.group,
    factorId,
    value: contribution.value,
    anchorWorkIds: [...contribution.anchorWorkIds],
    ...(contribution.negativeReasonId === undefined
      ? {}
      : { negativeReasonId: contribution.negativeReasonId }),
  };
}

function collectAnchors(
  sentences: readonly (TasteExplanationSentence | BaselineExplanationSentence)[],
  allowedSource: "similarity" | "genre",
  resolveTitle: WorkTitleResolver,
) {
  const seen = new Set<string>();
  const anchors: ExplanationAnchor[] = [];

  for (const sentence of sentences) {
    if (sentence.source !== allowedSource) {
      continue;
    }
    for (const workId of sentence.anchorWorkIds) {
      if (seen.has(workId)) {
        continue;
      }
      const title = resolveTitle(workId);
      if (title === undefined || title === "") {
        continue;
      }
      seen.add(workId);
      anchors.push({ workId, title });
      if (anchors.length >= MAX_ANCHORS) {
        return anchors;
      }
    }
  }

  return anchors;
}

function isSelectableBaselineContribution(contribution: BaselineContribution) {
  if (!contribution.explainable) {
    return false;
  }
  if (contribution.source === "genre") {
    return isGenreTag(contribution.factorId);
  }
  if (contribution.source === "market") {
    return contribution.factorId === "bayesianRating";
  }
  return contribution.factorId === "maturity";
}

function hasBaselineCopy(contribution: BaselineContribution, lexicon: ExplanationLexicon) {
  return (
    contribution.source !== "genre" ||
    (isGenreTag(contribution.factorId) && lexicon.factorLabels[contribution.factorId] !== undefined)
  );
}

function baselineSentenceFor(options: {
  contribution: BaselineContribution;
  bestAnchorId: string | null;
  lexicon: ExplanationLexicon;
  resolveTitle: WorkTitleResolver;
}): BaselineExplanationSentence {
  const { bestAnchorId, contribution, lexicon, resolveTitle } = options;
  let text: string;
  if (contribution.source === "genre" && isGenreTag(contribution.factorId)) {
    const factorLabel = lexicon.factorLabels[contribution.factorId] ?? "";
    const anchorTitle = bestAnchorId === null ? undefined : resolveTitle(bestAnchorId);
    text = interpolateTemplate(
      anchorTitle === undefined || anchorTitle === ""
        ? lexicon.templates.baselineGenreWithoutAnchor
        : lexicon.templates.baselineGenreWithAnchor,
      {
        factorLabel,
        ...(anchorTitle === undefined || anchorTitle === "" ? {} : { anchorTitle }),
      },
    );
  } else if (contribution.source === "market") {
    text = interpolateTemplate(lexicon.templates.baselineMarketObserved, {});
  } else {
    text = interpolateTemplate(lexicon.templates.baselineMaturity, {});
  }

  return {
    kind: "baseline",
    text,
    source: contribution.source,
    group: contribution.group,
    factorId: contribution.factorId,
    value: contribution.value,
    anchorWorkIds: [...contribution.anchorWorkIds],
  };
}

export function generateTasteExplanation({
  confidenceLevel,
  contributions,
  lexicon,
  resolveTitle,
}: GenerateTasteExplanationInput): TasteRecommendationExplanation {
  const cachedResolveTitle = cachedTitleResolver(resolveTitle);
  const { selectedCaution, selectedPositives } = selectTasteContributions(contributions, lexicon);
  const positiveReasons = selectedPositives.map((candidate) =>
    tasteSentenceFor({
      candidate,
      kind: "positive",
      lexicon,
      resolveTitle: cachedResolveTitle,
    }),
  );
  const caution =
    selectedCaution === undefined
      ? undefined
      : tasteSentenceFor({
          candidate: selectedCaution,
          kind: "caution",
          lexicon,
          resolveTitle: cachedResolveTitle,
        });
  return {
    positiveReasons,
    ...(caution === undefined ? {} : { caution }),
    anchors: collectAnchors(
      [...positiveReasons, ...(caution === undefined ? [] : [caution])],
      "similarity",
      cachedResolveTitle,
    ),
    confidence: {
      level: confidenceLevel,
      label: lexicon.confidenceLabels[confidenceLevel],
    },
  };
}

export function generateBaselineExplanation({
  bestAnchorId,
  contributions,
  lexicon,
  resolveTitle,
}: GenerateBaselineExplanationInput): BaselineRecommendationExplanation {
  const cachedResolveTitle = cachedTitleResolver(resolveTitle);
  const selected = [...contributions]
    .filter(isSelectableBaselineContribution)
    .sort(
      (left, right) => right.value - left.value || compareBaselineContributionIdentity(left, right),
    )[0];
  if (selected === undefined || !hasBaselineCopy(selected, lexicon)) {
    return { anchors: [] };
  }
  const reason = baselineSentenceFor({
    contribution: selected,
    bestAnchorId,
    lexicon,
    resolveTitle: cachedResolveTitle,
  });
  return {
    reason,
    anchors: collectAnchors([reason], "genre", cachedResolveTitle),
  };
}
