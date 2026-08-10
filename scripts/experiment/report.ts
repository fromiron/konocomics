import {
  AXIS_IDS,
  COVERAGE_GROUPS,
  COVERAGE_THRESHOLDS,
  THEME_TAGS,
} from "../../src/domain/catalog/constants";
import type { CatalogV1, CoverageGroup, Work } from "../../src/domain/catalog/types";
import {
  generateBaselineExplanation,
  generateTasteExplanation,
  type BaselineRecommendationExplanation,
  type ExplanationLexicon,
  type TasteRecommendationExplanation,
} from "../../src/domain/explanation";
import { NEGATIVE_REASON_ORDER, REACTION_WEIGHTS } from "../../src/domain/profile/constants";
import type { ExperimentProfileV1 } from "../../src/domain/profile/experiment-schema";
import type {
  AdjustmentPreference,
  NegativeReasonId,
  UserWorkRecord,
} from "../../src/domain/profile/types";
import {
  BASELINE_VERSION,
  rankBaselineRecommendations,
} from "../../src/domain/recommendation/baseline";
import { compareText, roundScore } from "../../src/domain/recommendation/math";
import { rankRecommendations } from "../../src/domain/recommendation/rank";
import { workSimilarity } from "../../src/domain/recommendation/similarity";
import type {
  BaselineContribution,
  BaselineRecommendation,
  GroupContribution,
  RankedRecommendation,
  RecommendationContext,
  RecommendationInput,
} from "../../src/domain/recommendation/types";

type KnownNegativeReasonId = (typeof NEGATIVE_REASON_ORDER)[number];
type PositiveReaction = "favorite" | "liked";
type CoverageStatus = "SHRUNK" | "PARTIAL";

export type ExperimentReportCopy = {
  title: string;
  headings: {
    profile: string;
    profileSummary: string;
    tasteTop: string;
    baselineTop: string;
    diagnostic: string;
  };
  fields: {
    catalogVersion: string;
    factorDictionaryVersion: string;
    baselineVersion: string;
    profileCount: string;
    anchors: string;
    negativeSources: string;
    adjustments: string;
    score: string;
    confidence: string;
    bestAnchor: string;
    positiveReasons: string;
    caution: string;
    evidenceAnchors: string;
    penalties: string;
    coverage: string;
    ledger: string;
    reason: string;
    bayesianRating: string;
    maturity: string;
    tasteCount: string;
    baselineCount: string;
    shrunkCount: string;
    partialCount: string;
    reactionWeight: string;
  };
  ledgerColumns: {
    rank: string;
    delta: string;
    source: string;
    group: string;
    factorId: string;
    anchorWorkIds: string;
    negativeReasonId: string;
    explainable: string;
  };
  values: {
    none: string;
    yes: string;
    no: string;
  };
  reactionLabels: Readonly<Record<PositiveReaction, string>>;
  adjustmentLabels: Readonly<Record<AdjustmentPreference, string>>;
  negativeReasonLabels: Readonly<Record<KnownNegativeReasonId, string>>;
};

export type ExperimentReportInput = {
  catalog: CatalogV1;
  context: RecommendationContext;
  profiles: readonly ExperimentProfileV1[];
  lexicon: ExplanationLexicon;
};

type WorkReference = {
  workId: string;
  title: string;
};

type AnchorSummary = WorkReference & {
  reaction: PositiveReaction;
  reactionWeight: number;
};

type NegativeSourceSummary = WorkReference & {
  reasons: NegativeReasonId[];
};

type AdjustmentSummary = {
  factorId: string;
  factorLabel: string;
  preference: AdjustmentPreference;
};

export type CoverageWarning = {
  group: CoverageGroup;
  status: CoverageStatus;
  coverage: number;
  threshold: number;
  adjustedScore: number;
};

type TasteReportItem = WorkReference & {
  rank: number;
  recommendation: RankedRecommendation;
  bestAnchor: WorkReference;
  explanation: TasteRecommendationExplanation;
  coverageWarnings: CoverageWarning[];
};

type BaselineReportItem = WorkReference & {
  rank: number;
  recommendation: BaselineRecommendation;
  bestAnchor?: WorkReference;
  explanation: BaselineRecommendationExplanation;
};

export type ExperimentProfileReport = {
  profileId: string;
  anchors: AnchorSummary[];
  negativeSources: NegativeSourceSummary[];
  adjustments: AdjustmentSummary[];
  taste: TasteReportItem[];
  baseline: BaselineReportItem[];
  diagnostics: {
    shrunkGroupCount: number;
    partialGroupCount: number;
  };
};

export type ExperimentReportModel = {
  catalogVersion: string;
  factorDictionaryVersion: string;
  baselineVersion: string;
  profiles: ExperimentProfileReport[];
};

const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f-\u009f]/gu;
const MARKDOWN_CHARACTER_PATTERN = /[\\`*_{}\[\]()#+\-.!|]/gu;

export function escapeExperimentMarkdown(value: string) {
  return value
    .replace(CONTROL_CHARACTER_PATTERN, "�")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replace(MARKDOWN_CHARACTER_PATTERN, "\\$&");
}

export function formatExperimentNumber(value: number) {
  if (!Number.isFinite(value)) {
    throw new Error("Experiment reports only support finite numeric values.");
  }
  const rounded = roundScore(value);
  return String(Object.is(rounded, -0) ? 0 : rounded);
}

function requiredWork(worksById: ReadonlyMap<string, Work>, workId: string) {
  const work = worksById.get(workId);
  if (work === undefined) {
    throw new Error(`Experiment report references an unknown catalog work: ${workId}`);
  }
  return work;
}

function workReference(worksById: ReadonlyMap<string, Work>, workId: string): WorkReference {
  const work = requiredWork(worksById, workId);
  return { workId: work.id, title: work.title };
}

function reasonOrderIndex(reason: NegativeReasonId) {
  return NEGATIVE_REASON_ORDER.findIndex((candidate) => candidate === reason);
}

function compareNegativeReasons(left: NegativeReasonId, right: NegativeReasonId) {
  const leftIndex = reasonOrderIndex(left);
  const rightIndex = reasonOrderIndex(right);
  if (leftIndex >= 0 || rightIndex >= 0) {
    if (leftIndex < 0) {
      return 1;
    }
    if (rightIndex < 0) {
      return -1;
    }
    return leftIndex - rightIndex;
  }
  return compareText(left, right);
}

function reasonsFor(record: UserWorkRecord) {
  return [...new Set([...(record.negativeReasons ?? []), ...(record.droppedReasons ?? [])])].sort(
    compareNegativeReasons,
  );
}

function isPositiveReaction(reaction: UserWorkRecord["reaction"]): reaction is PositiveReaction {
  return reaction === "favorite" || reaction === "liked";
}

function summarizeAnchors(
  records: readonly UserWorkRecord[],
  worksById: ReadonlyMap<string, Work>,
) {
  return records
    .flatMap<AnchorSummary>((record) => {
      if (!isPositiveReaction(record.reaction)) {
        return [];
      }
      const work = requiredWork(worksById, record.workId);
      return [
        {
          workId: work.id,
          title: work.title,
          reaction: record.reaction,
          reactionWeight: REACTION_WEIGHTS[record.reaction],
        },
      ];
    })
    .sort(
      (left, right) =>
        right.reactionWeight - left.reactionWeight || compareText(left.workId, right.workId),
    );
}

function summarizeNegativeSources(
  records: readonly UserWorkRecord[],
  worksById: ReadonlyMap<string, Work>,
) {
  return records
    .flatMap<NegativeSourceSummary>((record) => {
      const reasons = reasonsFor(record);
      if (record.reaction !== "disliked" && reasons.length === 0) {
        return [];
      }
      const work = requiredWork(worksById, record.workId);
      return [{ workId: work.id, title: work.title, reasons }];
    })
    .sort((left, right) => compareText(left.workId, right.workId));
}

function summarizeAdjustments(
  profile: ExperimentProfileV1,
  lexicon: ExplanationLexicon,
): AdjustmentSummary[] {
  const axisAdjustments = AXIS_IDS.flatMap<AdjustmentSummary>((factorId) => {
    const preference = profile.adjustments.axes[factorId];
    return preference === undefined
      ? []
      : [{ factorId, factorLabel: lexicon.factorLabels[factorId] ?? factorId, preference }];
  });
  const themeAdjustments = THEME_TAGS.flatMap<AdjustmentSummary>((factorId) => {
    const preference = profile.adjustments.themes[factorId];
    return preference === undefined
      ? []
      : [{ factorId, factorLabel: lexicon.factorLabels[factorId] ?? factorId, preference }];
  });
  return [...axisAdjustments, ...themeAdjustments];
}

export function calculateCoverageWarnings(candidate: Work, anchor: Work): CoverageWarning[] {
  const similarity = workSimilarity(candidate, anchor);
  return COVERAGE_GROUPS.flatMap<CoverageWarning>((group) => {
    const result = similarity.groups[group];
    const threshold = COVERAGE_THRESHOLDS[group];
    if (result.coverage >= 1) {
      return [];
    }
    return [
      {
        group,
        status: result.coverage < threshold ? "SHRUNK" : "PARTIAL",
        coverage: roundScore(result.coverage),
        threshold: roundScore(threshold),
        adjustedScore: roundScore(result.adjustedScore),
      },
    ];
  });
}

function recommendationInput(
  catalog: CatalogV1,
  context: RecommendationContext,
  profile: ExperimentProfileV1,
): RecommendationInput {
  return {
    catalog,
    context,
    records: [...profile.records].sort((left, right) => compareText(left.workId, right.workId)),
    adjustments: profile.adjustments,
    policies: profile.policies,
  };
}

function buildProfileReport(options: {
  catalog: CatalogV1;
  context: RecommendationContext;
  profile: ExperimentProfileV1;
  lexicon: ExplanationLexicon;
  worksById: ReadonlyMap<string, Work>;
}): ExperimentProfileReport {
  const { catalog, context, lexicon, profile, worksById } = options;
  const input = recommendationInput(catalog, context, profile);
  const resolveTitle = (workId: string) => worksById.get(workId)?.title;
  const taste = rankRecommendations(input).map<TasteReportItem>((recommendation, index) => {
    const work = requiredWork(worksById, recommendation.workId);
    const bestAnchor = requiredWork(worksById, recommendation.bestAnchorId);
    return {
      rank: index + 1,
      workId: work.id,
      title: work.title,
      recommendation,
      bestAnchor: { workId: bestAnchor.id, title: bestAnchor.title },
      explanation: generateTasteExplanation({
        contributions: recommendation.contributions,
        confidenceLevel: recommendation.confidenceLevel,
        lexicon,
        resolveTitle,
      }),
      coverageWarnings: calculateCoverageWarnings(work, bestAnchor),
    };
  });
  const baseline = rankBaselineRecommendations(input).map<BaselineReportItem>(
    (recommendation, index) => {
      const work = requiredWork(worksById, recommendation.workId);
      const bestAnchor =
        recommendation.bestAnchorId === null
          ? undefined
          : workReference(worksById, recommendation.bestAnchorId);
      return {
        rank: index + 1,
        workId: work.id,
        title: work.title,
        recommendation,
        ...(bestAnchor === undefined ? {} : { bestAnchor }),
        explanation: generateBaselineExplanation({
          contributions: recommendation.contributions,
          bestAnchorId: recommendation.bestAnchorId,
          lexicon,
          resolveTitle,
        }),
      };
    },
  );
  const allCoverageWarnings = taste.flatMap((item) => item.coverageWarnings);

  return {
    profileId: profile.profileId,
    anchors: summarizeAnchors(profile.records, worksById),
    negativeSources: summarizeNegativeSources(profile.records, worksById),
    adjustments: summarizeAdjustments(profile, lexicon),
    taste,
    baseline,
    diagnostics: {
      shrunkGroupCount: allCoverageWarnings.filter(({ status }) => status === "SHRUNK").length,
      partialGroupCount: allCoverageWarnings.filter(({ status }) => status === "PARTIAL").length,
    },
  };
}

export function buildExperimentReportModel(input: ExperimentReportInput): ExperimentReportModel {
  const worksById = new Map(input.catalog.works.map((work) => [work.id, work]));
  const profiles = [...input.profiles].sort((left, right) =>
    compareText(left.profileId, right.profileId),
  );
  for (let index = 1; index < profiles.length; index += 1) {
    if (profiles[index - 1]?.profileId === profiles[index]?.profileId) {
      throw new Error(`Duplicate experiment profile id: ${profiles[index]?.profileId ?? ""}`);
    }
  }
  return {
    catalogVersion: input.catalog.catalogVersion,
    factorDictionaryVersion: input.catalog.factorDictionaryVersion,
    baselineVersion: BASELINE_VERSION,
    profiles: profiles.map((profile) =>
      buildProfileReport({
        catalog: input.catalog,
        context: input.context,
        profile,
        lexicon: input.lexicon,
        worksById,
      }),
    ),
  };
}

function displayWork(reference: WorkReference) {
  return `${escapeExperimentMarkdown(reference.title)} (${escapeExperimentMarkdown(reference.workId)})`;
}

function displayKnownReason(reason: NegativeReasonId, copy: ExperimentReportCopy) {
  const index = reasonOrderIndex(reason);
  if (index < 0) {
    return escapeExperimentMarkdown(reason);
  }
  const knownReason = NEGATIVE_REASON_ORDER[index];
  return knownReason === undefined
    ? escapeExperimentMarkdown(reason)
    : copy.negativeReasonLabels[knownReason];
}

function renderInlineList(values: readonly string[], copy: ExperimentReportCopy) {
  return values.length === 0 ? copy.values.none : values.join(", ");
}

export function renderCoverageWarningLine(warning: CoverageWarning) {
  return `  - ${warning.status} / ${warning.group} / coverage=${formatExperimentNumber(warning.coverage)} / threshold=${formatExperimentNumber(warning.threshold)} / adjustedScore=${formatExperimentNumber(warning.adjustedScore)}`;
}

function renderLedger(
  lines: string[],
  contributions: readonly (GroupContribution | BaselineContribution)[],
  copy: ExperimentReportCopy,
) {
  if (contributions.length === 0) {
    lines.push(copy.values.none);
    return;
  }
  const columns = copy.ledgerColumns;
  lines.push(
    `| ${columns.rank} | ${columns.delta} | ${columns.source} | ${columns.group} | ${columns.factorId} | ${columns.anchorWorkIds} | ${columns.negativeReasonId} | ${columns.explainable} |`,
    "| -: | -: | --- | --- | --- | --- | --- | --- |",
  );
  contributions.slice(0, 5).forEach((contribution, index) => {
    const negativeReasonId =
      "negativeReasonId" in contribution ? contribution.negativeReasonId : undefined;
    lines.push(
      `| ${String(index + 1)} | ${formatExperimentNumber(contribution.value)} | ${escapeExperimentMarkdown(contribution.source)} | ${escapeExperimentMarkdown(contribution.group)} | ${escapeExperimentMarkdown(contribution.factorId)} | ${renderInlineList(contribution.anchorWorkIds.map(escapeExperimentMarkdown), copy)} | ${negativeReasonId === undefined ? copy.values.none : escapeExperimentMarkdown(negativeReasonId)} | ${contribution.explainable ? copy.values.yes : copy.values.no} |`,
    );
  });
}

function renderProfileSummary(
  lines: string[],
  profile: ExperimentProfileReport,
  copy: ExperimentReportCopy,
) {
  lines.push(`### ${copy.headings.profileSummary}`, "");
  lines.push(
    `- ${copy.fields.anchors}: ${renderInlineList(
      profile.anchors.map(
        (anchor) =>
          `${displayWork(anchor)} — ${copy.reactionLabels[anchor.reaction]} / ${copy.fields.reactionWeight}=${formatExperimentNumber(anchor.reactionWeight)}`,
      ),
      copy,
    )}`,
  );
  lines.push(
    `- ${copy.fields.negativeSources}: ${renderInlineList(
      profile.negativeSources.map(
        (source) =>
          `${displayWork(source)} — ${renderInlineList(
            source.reasons.map((reason) => displayKnownReason(reason, copy)),
            copy,
          )}`,
      ),
      copy,
    )}`,
  );
  lines.push(
    `- ${copy.fields.adjustments}: ${renderInlineList(
      profile.adjustments.map(
        (adjustment) =>
          `${escapeExperimentMarkdown(adjustment.factorLabel)} (${escapeExperimentMarkdown(adjustment.factorId)})=${copy.adjustmentLabels[adjustment.preference]}`,
      ),
      copy,
    )}`,
    "",
  );
}

function renderTasteItem(lines: string[], item: TasteReportItem, copy: ExperimentReportCopy) {
  lines.push(`#### ${String(item.rank)}. ${displayWork(item)}`, "");
  lines.push(
    `- ${copy.fields.score}: ${formatExperimentNumber(item.recommendation.tasteScore)}`,
    `- ${copy.fields.confidence}: ${item.explanation.confidence.label}`,
    `- ${copy.fields.bestAnchor}: ${displayWork(item.bestAnchor)}`,
  );
  if (item.explanation.positiveReasons.length === 0) {
    lines.push(`- ${copy.fields.positiveReasons}: ${copy.values.none}`);
  } else {
    lines.push(`- ${copy.fields.positiveReasons}:`);
    for (const reason of item.explanation.positiveReasons) {
      lines.push(`  - ${escapeExperimentMarkdown(reason.text)}`);
    }
  }
  lines.push(
    `- ${copy.fields.caution}: ${
      item.explanation.caution === undefined
        ? copy.values.none
        : escapeExperimentMarkdown(item.explanation.caution.text)
    }`,
    `- ${copy.fields.evidenceAnchors}: ${renderInlineList(
      item.explanation.anchors.map(displayWork),
      copy,
    )}`,
    `- ${copy.fields.penalties}: ${renderInlineList(
      item.recommendation.penaltiesApplied.map((reason) => displayKnownReason(reason, copy)),
      copy,
    )}`,
  );
  if (item.coverageWarnings.length === 0) {
    lines.push(`- ${copy.fields.coverage}: ${copy.values.none}`);
  } else {
    lines.push(`- ${copy.fields.coverage}:`);
    for (const warning of item.coverageWarnings) {
      lines.push(renderCoverageWarningLine(warning));
    }
  }
  lines.push(`- ${copy.fields.ledger}:`, "");
  renderLedger(lines, item.recommendation.contributions, copy);
  lines.push("");
}

function renderBaselineItem(lines: string[], item: BaselineReportItem, copy: ExperimentReportCopy) {
  lines.push(`#### ${String(item.rank)}. ${displayWork(item)}`, "");
  lines.push(
    `- ${copy.fields.score}: ${formatExperimentNumber(item.recommendation.baselineScore)}`,
    `- ${copy.fields.bestAnchor}: ${
      item.bestAnchor === undefined ? copy.values.none : displayWork(item.bestAnchor)
    }`,
    `- ${copy.fields.reason}: ${
      item.explanation.reason === undefined
        ? copy.values.none
        : escapeExperimentMarkdown(item.explanation.reason.text)
    }`,
    `- ${copy.fields.bayesianRating}: ${formatExperimentNumber(item.recommendation.bayesianRating)}`,
    `- ${copy.fields.maturity}: ${formatExperimentNumber(item.recommendation.maturity)}`,
    `- ${copy.fields.ledger}:`,
    "",
  );
  renderLedger(lines, item.recommendation.contributions, copy);
  lines.push("");
}

export function renderExperimentReportMarkdown(
  model: ExperimentReportModel,
  copy: ExperimentReportCopy,
) {
  const lines = [
    `# ${copy.title}`,
    "",
    `- ${copy.fields.catalogVersion}: ${escapeExperimentMarkdown(model.catalogVersion)}`,
    `- ${copy.fields.factorDictionaryVersion}: ${escapeExperimentMarkdown(model.factorDictionaryVersion)}`,
    `- ${copy.fields.baselineVersion}: ${escapeExperimentMarkdown(model.baselineVersion)}`,
    `- ${copy.fields.profileCount}: ${String(model.profiles.length)}`,
    "",
  ];

  for (const profile of model.profiles) {
    lines.push(`## ${copy.headings.profile}: ${escapeExperimentMarkdown(profile.profileId)}`, "");
    renderProfileSummary(lines, profile, copy);

    lines.push(`### ${copy.headings.tasteTop} (${String(profile.taste.length)}/10)`, "");
    for (const item of profile.taste) {
      renderTasteItem(lines, item, copy);
    }

    lines.push(`### ${copy.headings.baselineTop} (${String(profile.baseline.length)}/10)`, "");
    for (const item of profile.baseline) {
      renderBaselineItem(lines, item, copy);
    }

    lines.push(
      `### ${copy.headings.diagnostic}`,
      "",
      `- ${copy.fields.tasteCount}: ${String(profile.taste.length)}/10`,
      `- ${copy.fields.baselineCount}: ${String(profile.baseline.length)}/10`,
      `- ${copy.fields.shrunkCount}: ${String(profile.diagnostics.shrunkGroupCount)}`,
      `- ${copy.fields.partialCount}: ${String(profile.diagnostics.partialGroupCount)}`,
      "",
    );
  }

  return `${lines.join("\n").replace(/\n+$/u, "")}\n`;
}

export function buildExperimentReport(input: ExperimentReportInput, copy: ExperimentReportCopy) {
  return renderExperimentReportMarkdown(buildExperimentReportModel(input), copy);
}
