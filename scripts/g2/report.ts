import type {
  G2AggregateMetrics,
  G2CriterionStatus,
  G2Engine,
  G2Lift,
  G2ParticipantMetrics,
  G2Rate,
} from "../../src/domain/g2";
import type { CatalogV1 } from "../../src/domain/catalog/types";
import { BASELINE_VERSION } from "../../src/domain/recommendation/baseline";
import { roundScore } from "../../src/domain/recommendation/math";

function escapeCell(value: string) {
  return value
    .replace(/[\u0000-\u001f\u007f-\u009f]/gu, "�")
    .replaceAll("\\", "\\\\")
    .replaceAll("|", "\\|")
    .replaceAll("\n", " ");
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) {
    throw new Error("G2 reports only support finite numbers.");
  }
  const rounded = roundScore(value);
  return String(Object.is(rounded, -0) ? 0 : rounded);
}

function formatNullable(value: number | null) {
  return value === null ? "null" : formatNumber(value);
}

function formatRate(value: G2Rate) {
  return `${String(value.numerator)}/${String(value.denominator)} (${formatNullable(value.rate)})`;
}

function formatLift(value: G2Lift) {
  return `${formatNumber(value.sum)}/${String(value.denominator)} (${formatNullable(value.average)})`;
}

function criterionDetail(metrics: G2AggregateMetrics, key: keyof G2AggregateMetrics["criteria"]) {
  const taste = metrics.engines.taste;
  const baseline = metrics.engines.baseline;
  switch (key) {
    case "tasteOrTie":
      return `${String(metrics.preference.tasteOrTieCount)}/${String(metrics.humanCount)}; requires exactly 10 humans and >=7`;
    case "unknownWantToRead":
      return `Taste ${formatRate(taste.unknownWantToRead)}; Baseline ${formatRate(baseline.unknownWantToRead)}; Taste must be greater`;
    case "tasteExplanationAgreement":
      return `Taste ${formatRate(taste.explanationAgreement)}; requires >=0.7`;
    case "dislikedLeakage":
      return `Taste ${formatRate(taste.dislikedLeakage)}; Baseline ${formatRate(baseline.dislikedLeakage)}; Taste must be <=`;
    case "holdoutRecall":
      return `Taste ${formatRate(taste.holdoutRecall)}; Baseline ${formatRate(baseline.holdoutRecall)}; Taste must be >=`;
  }
}

const CRITERION_LABELS = {
  tasteOrTie: "Taste or tie",
  unknownWantToRead: "Unknown Want-to-Read",
  tasteExplanationAgreement: "Taste Explanation Agreement",
  dislikedLeakage: "Disliked Leakage@10",
  holdoutRecall: "Holdout Recall@10",
} as const;

function respondentLabel(row: G2ParticipantMetrics) {
  return row.respondent.kind === "human" ? "human" : "syntheticPilot:manual-round-trip";
}

function participantRow(row: G2ParticipantMetrics) {
  return [
    escapeCell(row.participantId),
    respondentLabel(row),
    row.preferenceVerdict,
    formatRate(row.engines.taste.unknownWantToRead),
    formatRate(row.engines.baseline.unknownWantToRead),
    formatRate(row.engines.taste.explanationAgreement),
    formatRate(row.engines.baseline.explanationAgreement),
    formatRate(row.engines.taste.dislikedLeakage),
    formatRate(row.engines.baseline.dislikedLeakage),
    formatRate(row.engines.taste.holdoutRecall),
    formatRate(row.engines.baseline.holdoutRecall),
  ].join(" | ");
}

function engineMetricRows(metrics: G2AggregateMetrics, engine: G2Engine) {
  const values = metrics.engines[engine];
  const name = engine === "taste" ? "Taste" : "Baseline";
  return [
    `${name} | Unknown Want-to-Read | ${formatRate(values.unknownWantToRead)}`,
    `${name} | Explanation Agreement | ${formatRate(values.explanationAgreement)}`,
    `${name} | Disliked Leakage@10 | ${formatRate(values.dislikedLeakage)}`,
    `${name} | Holdout Recall@10 | ${formatRate(values.holdoutRecall)}`,
  ];
}

export function buildG2AggregateReport(catalog: CatalogV1, metrics: G2AggregateMetrics) {
  const criteria = Object.entries(metrics.criteria) as [
    keyof G2AggregateMetrics["criteria"],
    G2CriterionStatus,
  ][];
  const lines = [
    "# konocomics G2 aggregate",
    "",
    "## Identity",
    "",
    `- Result format: \`konocomics-g2-result\``,
    `- Contract version: \`g2-v1\``,
    `- Catalog version: \`${escapeCell(catalog.catalogVersion)}\``,
    `- Factor dictionary version: \`${escapeCell(catalog.factorDictionaryVersion)}\``,
    `- Baseline version: \`${BASELINE_VERSION}\``,
    "",
    "## Accepted results",
    "",
    `- Human: ${String(metrics.humanCount)}`,
    `- Synthetic pilot: ${String(metrics.syntheticPilotCount)}`,
    `- Verdict: **${metrics.verdict}**`,
    "",
    "## Five GO criteria",
    "",
    "Criterion | Status | Evidence",
    "--- | --- | ---",
    ...criteria.map(
      ([key, status]) => `${CRITERION_LABELS[key]} | ${status} | ${criterionDetail(metrics, key)}`,
    ),
    "",
    "## Aggregate counts and rates",
    "",
    `- Preference: Taste ${String(metrics.preference.tasteWinCount)}, Baseline ${String(metrics.preference.baselineWinCount)}, tie ${String(metrics.preference.tieCount)}, Taste-or-tie ${String(metrics.preference.tasteOrTieCount)}`,
    "",
    "Engine | Metric | Numerator/denominator (rate)",
    "--- | --- | ---",
    ...engineMetricRows(metrics, "taste"),
    ...engineMetricRows(metrics, "baseline"),
    "",
    "## Participant rows",
    "",
    "Participant | Respondent | Preference | Taste unknown WTR | Baseline unknown WTR | Taste agreement | Baseline agreement | Taste leakage | Baseline leakage | Taste recall | Baseline recall",
    "--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---",
    ...metrics.participants.map(participantRow),
    "",
    "## Diagnostics",
    "",
    "Engine | Explanation Lift sum/coverage (average) | Explanation availability/occurrences",
    "--- | --- | ---",
    ...(["taste", "baseline"] as const).map((engine) => {
      const values = metrics.engines[engine];
      const label = engine === "taste" ? "Taste" : "Baseline";
      return `${label} | ${formatLift(values.explanationLift)} | ${String(values.explanationLift.denominator)}/${String(values.explanationAgreement.denominator)}`;
    }),
  ];
  return `${lines.join("\n")}\n`;
}
