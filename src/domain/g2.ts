import { z, type RefinementCtx } from "zod";

import { AXIS_IDS, THEME_TAGS } from "./catalog/constants";
import type { CatalogV1, Work } from "./catalog/types";
import {
  generateBaselineExplanation,
  generateTasteExplanation,
  type ExplanationLexicon,
} from "./explanation";
import {
  createExperimentProfileV1Schema,
  experimentProfileV1Schema,
  type ExperimentProfileV1,
} from "./profile/experiment-schema";
import { FACTOR_BACKED_NEGATIVE_REASON_IDS } from "./profile/constants";
import type { UserWorkRecord } from "./profile/types";
import { calculatePositiveAnchorScore } from "./recommendation/anchor";
import { BASELINE_VERSION, rankBaselineRecommendations } from "./recommendation/baseline";
import { compareText, ownRecordValue } from "./recommendation/math";
import { calculateNegativePenalties } from "./recommendation/penalty";
import {
  filterEligibleCandidates,
  positiveAnchors,
  rankRecommendations,
} from "./recommendation/rank";
import type { RecommendationContext, RecommendationInput } from "./recommendation/types";

export const G2_RESULT_FORMAT = "konocomics-g2-result";
export const G2_SCHEMA_VERSION = 1;
export const G2_CONTRACT_VERSION = "g2-v1";
export const G2_FACTOR_DICTIONARY_VERSION = "v1";

const PARTICIPANT_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA256_HEX_PATTERN = /^[0-9a-f]{64}$/;
const HOLDOUT_HASH_PREFIX = "konocomics-g2-holdout-v1";
const SLOT_HASH_PREFIX = "konocomics-g2-slot-v1";
const POSITIVE_REACTIONS = new Set(["favorite", "liked"]);
const FACTOR_BACKED_REASON_SET = new Set<string>(FACTOR_BACKED_NEGATIVE_REASON_IDS);

const participantIdSchema = z.string().min(1).max(64).regex(PARTICIPANT_ID_PATTERN);
const fivePointSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);
const g2EngineSchema = z.enum(["taste", "baseline"]);
const g2SlotIdSchema = z.enum(["A", "B"]);

export const g2RespondentSchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("human") }),
  z.strictObject({
    kind: z.literal("syntheticPilot"),
    label: z.literal("manual-round-trip"),
  }),
]);

export const g2PreResponseSchema = z.strictObject({
  workId: z.string().min(1),
  familiarity: z.enum(["read", "knownUnread", "unknown"]),
  wantToReadBefore: fivePointSchema,
});

export const g2PostResponseSchema = z.strictObject({
  slot: g2SlotIdSchema,
  rank: z.number().int().positive().max(10),
  workId: z.string().min(1),
  wantToReadAfter: fivePointSchema,
  agreement: fivePointSchema.nullable(),
});

const g2ResultItemSchema = z.strictObject({
  rank: z.number().int().positive().max(10),
  workId: z.string().min(1),
  explanationAvailable: z.boolean(),
});

const g2ResultListSchema = z.strictObject({
  engine: g2EngineSchema,
  items: z.array(g2ResultItemSchema).max(10),
});

function addIssue(context: RefinementCtx, path: readonly (string | number)[], message: string) {
  context.addIssue({ code: "custom", path: [...path], message });
}

function expectedDistinctWorkIds(slots: {
  A: { items: readonly { workId: string }[] };
  B: { items: readonly { workId: string }[] };
}) {
  const seen = new Set<string>();
  const workIds: string[] = [];
  for (const item of [...slots.A.items, ...slots.B.items]) {
    if (!seen.has(item.workId)) {
      seen.add(item.workId);
      workIds.push(item.workId);
    }
  }
  return workIds;
}

function refineNativeList(
  slot: "A" | "B",
  list: { items: readonly { rank: number; workId: string }[] },
  context: RefinementCtx,
) {
  const seen = new Set<string>();
  list.items.forEach((item, index) => {
    if (item.rank !== index + 1) {
      addIssue(context, ["slots", slot, "items", index, "rank"], "Ranks must be contiguous");
    }
    if (seen.has(item.workId)) {
      addIssue(
        context,
        ["slots", slot, "items", index, "workId"],
        "A native list cannot contain duplicate work ids",
      );
    }
    seen.add(item.workId);
  });
}

function refineG2Result(
  result: {
    participantId: string;
    profile: ExperimentProfileV1;
    holdoutWorkIds: readonly string[];
    slots: {
      A: {
        engine: "taste" | "baseline";
        items: readonly { rank: number; workId: string; explanationAvailable: boolean }[];
      };
      B: {
        engine: "taste" | "baseline";
        items: readonly { rank: number; workId: string; explanationAvailable: boolean }[];
      };
    };
    preResponses: readonly { workId: string }[];
    postResponses: readonly {
      slot: "A" | "B";
      rank: number;
      workId: string;
      agreement: 1 | 2 | 3 | 4 | 5 | null;
    }[];
  },
  context: RefinementCtx,
) {
  if (result.profile.profileId !== result.participantId) {
    addIssue(context, ["profile", "profileId"], "Profile id must equal participant id");
  }

  const positiveAnchorCount = result.profile.records.filter((record) =>
    POSITIVE_REACTIONS.has(record.reaction ?? ""),
  ).length;
  result.profile.records.forEach((record, recordIndex) => {
    if (record.positiveReasons !== undefined) {
      addIssue(
        context,
        ["profile", "records", recordIndex, "positiveReasons"],
        "G2 profiles cannot contain free-text positive reasons",
      );
    }
  });
  if (positiveAnchorCount < 6 || positiveAnchorCount > 10) {
    addIssue(context, ["profile", "records"], "G2 requires 6 through 10 positive anchors");
  }
  const expectedHoldoutCount = Math.min(2, positiveAnchorCount - 5);
  if (result.holdoutWorkIds.length !== expectedHoldoutCount) {
    addIssue(context, ["holdoutWorkIds"], "Holdout count does not match the positive anchors");
  }
  const holdoutSet = new Set(result.holdoutWorkIds);
  if (holdoutSet.size !== result.holdoutWorkIds.length) {
    addIssue(context, ["holdoutWorkIds"], "Holdout work ids must be distinct");
  }

  if (result.slots.A.engine === result.slots.B.engine) {
    addIssue(context, ["slots"], "A and B must contain different engines");
  }
  refineNativeList("A", result.slots.A, context);
  refineNativeList("B", result.slots.B, context);

  const distinctWorkIds = expectedDistinctWorkIds(result.slots);
  if (result.preResponses.length !== distinctWorkIds.length) {
    addIssue(context, ["preResponses"], "Pre responses must cover each distinct work once");
  }
  const preCount = Math.max(result.preResponses.length, distinctWorkIds.length);
  for (let index = 0; index < preCount; index += 1) {
    if (result.preResponses[index]?.workId !== distinctWorkIds[index]) {
      addIssue(
        context,
        ["preResponses", index, "workId"],
        "Pre responses must follow first appearance order",
      );
    }
  }

  const expectedPost = (["A", "B"] as const).flatMap((slot) =>
    result.slots[slot].items.map((item) => ({ slot, ...item })),
  );
  if (result.postResponses.length !== expectedPost.length) {
    addIssue(context, ["postResponses"], "Post responses must cover each list occurrence");
  }
  const postCount = Math.max(result.postResponses.length, expectedPost.length);
  for (let index = 0; index < postCount; index += 1) {
    const response = result.postResponses[index];
    const expected = expectedPost[index];
    if (
      response === undefined ||
      expected === undefined ||
      response.slot !== expected.slot ||
      response.rank !== expected.rank ||
      response.workId !== expected.workId
    ) {
      addIssue(
        context,
        ["postResponses", index],
        "Post responses must follow A then B occurrence order",
      );
      continue;
    }
    if (expected.explanationAvailable ? response.agreement === null : response.agreement !== null) {
      addIssue(
        context,
        ["postResponses", index, "agreement"],
        expected.explanationAvailable
          ? "Agreement is required when an explanation is available"
          : "Agreement must be null when no explanation is available",
      );
    }
  }
}

export const g2ResultV1Schema = z
  .strictObject({
    format: z.literal(G2_RESULT_FORMAT),
    schemaVersion: z.literal(G2_SCHEMA_VERSION),
    contractVersion: z.literal(G2_CONTRACT_VERSION),
    participantId: participantIdSchema,
    respondent: g2RespondentSchema,
    catalogVersion: z.string().trim().min(1),
    factorDictionaryVersion: z.literal(G2_FACTOR_DICTIONARY_VERSION),
    baselineVersion: z.literal(BASELINE_VERSION),
    profile: experimentProfileV1Schema,
    holdoutWorkIds: z.array(z.string().min(1)).min(1).max(2),
    slots: z.strictObject({
      A: g2ResultListSchema,
      B: g2ResultListSchema,
    }),
    preResponses: z.array(g2PreResponseSchema),
    listPreference: z.enum(["A", "B", "tie"]),
    postResponses: z.array(g2PostResponseSchema),
  })
  .superRefine(refineG2Result);

export type G2Respondent = z.infer<typeof g2RespondentSchema>;
export type G2PreResponse = z.infer<typeof g2PreResponseSchema>;
export type G2PostResponse = z.infer<typeof g2PostResponseSchema>;
export type G2ResultV1 = z.infer<typeof g2ResultV1Schema>;
export type G2Engine = z.infer<typeof g2EngineSchema>;
export type G2SlotId = z.infer<typeof g2SlotIdSchema>;
export type G2ListPreference = G2ResultV1["listPreference"];

export type G2Sha256Hex = (utf8Text: string) => string | Promise<string>;

export type G2ExperimentItem = {
  rank: number;
  workId: string;
  explanationAvailable: boolean;
  explanationTexts: string[];
};

export type G2ExperimentList = {
  engine: G2Engine;
  items: G2ExperimentItem[];
};

export type G2Experiment = {
  participantId: string;
  catalogVersion: string;
  profile: ExperimentProfileV1;
  postHoldoutProfile: ExperimentProfileV1;
  holdoutWorkIds: string[];
  nativeLists: {
    taste: G2ExperimentList;
    baseline: G2ExperimentList;
  };
  slots: {
    A: G2ExperimentList;
    B: G2ExperimentList;
  };
  distinctWorkIds: string[];
};

function sortedPartialRecord<Value>(
  order: readonly string[],
  values: Readonly<Record<string, Value | undefined>>,
) {
  return Object.fromEntries(
    order.flatMap((key) => {
      const value = ownRecordValue(values, key);
      return value === undefined ? [] : [[key, value]];
    }),
  );
}

function canonicalProfile(profile: ExperimentProfileV1): ExperimentProfileV1 {
  if (profile.records.some((record) => record.positiveReasons !== undefined)) {
    throw new Error("G2 profiles cannot contain free-text positive reasons.");
  }
  return experimentProfileV1Schema.parse({
    format: profile.format,
    schemaVersion: profile.schemaVersion,
    profileId: profile.profileId,
    records: [...profile.records].sort((left, right) => compareText(left.workId, right.workId)),
    adjustments: {
      axes: sortedPartialRecord(AXIS_IDS, profile.adjustments.axes),
      themes: sortedPartialRecord(THEME_TAGS, profile.adjustments.themes),
    },
    policies: {
      preferCompleted: profile.policies.preferCompleted,
      preferHidden: profile.policies.preferHidden,
      preferVerified: profile.policies.preferVerified,
      excludeIncomplete: profile.policies.excludeIncomplete,
    },
  });
}

async function digestHex(sha256Hex: G2Sha256Hex, value: string) {
  const digest = await sha256Hex(value);
  if (!SHA256_HEX_PATTERN.test(digest)) {
    throw new Error("SHA-256 adapter must return 64 lowercase hexadecimal characters.");
  }
  return digest;
}

function positiveRecords(profile: ExperimentProfileV1) {
  return profile.records.filter(
    (record) => record.reaction === "favorite" || record.reaction === "liked",
  );
}

export async function selectG2Holdout(options: {
  participantId: string;
  catalogVersion: string;
  profile: ExperimentProfileV1;
  sha256Hex: G2Sha256Hex;
}) {
  const participantId = participantIdSchema.parse(options.participantId);
  const profile = canonicalProfile(options.profile);
  const anchors = positiveRecords(profile);
  if (anchors.length < 6 || anchors.length > 10) {
    throw new Error("G2 requires 6 through 10 positive anchors.");
  }
  const keyed = await Promise.all(
    anchors.map(async (record) => ({
      record,
      key: await digestHex(
        options.sha256Hex,
        `${HOLDOUT_HASH_PREFIX}\u0000${options.catalogVersion}\u0000${participantId}\u0000${record.workId}`,
      ),
    })),
  );
  keyed.sort(
    (left, right) =>
      compareText(left.key, right.key) || compareText(left.record.workId, right.record.workId),
  );
  const holdoutCount = Math.min(2, anchors.length - 5);
  const holdoutWorkIds = keyed.slice(0, holdoutCount).map(({ record }) => record.workId);
  const holdoutSet = new Set(holdoutWorkIds);
  const postHoldoutProfile = experimentProfileV1Schema.parse({
    ...profile,
    records: profile.records.filter((record) => !holdoutSet.has(record.workId)),
  });
  return { profile, holdoutWorkIds, postHoldoutProfile };
}

function assertG2CatalogProfile(options: {
  participantId: string;
  profile: ExperimentProfileV1;
  postHoldoutProfile: ExperimentProfileV1;
  holdoutWorkIds: readonly string[];
  catalog: CatalogV1;
}) {
  const { catalog, holdoutWorkIds, participantId, postHoldoutProfile, profile } = options;
  if (profile.profileId !== participantId) {
    throw new Error("G2 participant id and profile id must match.");
  }
  const worksById = Object.fromEntries(catalog.works.map((work) => [work.id, work]));
  for (const record of positiveRecords(profile)) {
    const work = ownRecordValue(worksById, record.workId);
    if (work === undefined || !work.eligibility.recommendationEligible) {
      throw new Error(`G2 positive anchor is not recommendation eligible: ${record.workId}`);
    }
  }
  const restoredIds = new Set(
    filterEligibleCandidates({
      works: catalog.works,
      records: postHoldoutProfile.records,
      adjustments: postHoldoutProfile.adjustments,
      policies: postHoldoutProfile.policies,
    }).map((work) => work.id),
  );
  for (const workId of holdoutWorkIds) {
    if (!restoredIds.has(workId)) {
      throw new Error(`G2 holdout cannot be restored as a common candidate: ${workId}`);
    }
  }
}

function recommendationInput(options: {
  catalog: CatalogV1;
  context: RecommendationContext;
  profile: ExperimentProfileV1;
}): RecommendationInput {
  return {
    catalog: options.catalog,
    context: options.context,
    records: options.profile.records,
    adjustments: options.profile.adjustments,
    policies: options.profile.policies,
  };
}

function explanationResolver(catalog: CatalogV1) {
  const titleByWorkId = new Map(catalog.works.map((work) => [work.id, work.title]));
  return (workId: string) => titleByWorkId.get(workId);
}

function assertNativeItems(items: readonly G2ExperimentItem[]) {
  const ids = new Set<string>();
  items.forEach((item, index) => {
    if (item.rank !== index + 1 || item.rank > 10) {
      throw new Error("G2 native ranks must be contiguous from 1 through at most 10.");
    }
    if (ids.has(item.workId)) {
      throw new Error(`G2 native list contains duplicate work id: ${item.workId}`);
    }
    ids.add(item.workId);
  });
}

async function assignG2Slots(options: {
  participantId: string;
  catalogVersion: string;
  taste: G2ExperimentList;
  baseline: G2ExperimentList;
  sha256Hex: G2Sha256Hex;
}) {
  const digest = await digestHex(
    options.sha256Hex,
    `${SLOT_HASH_PREFIX}\u0000${options.catalogVersion}\u0000${options.participantId}`,
  );
  const tasteInA = Number.parseInt(digest.slice(0, 2), 16) % 2 === 0;
  return tasteInA
    ? { A: options.taste, B: options.baseline }
    : { A: options.baseline, B: options.taste };
}

export async function createG2Experiment(options: {
  participantId: string;
  profile: unknown;
  catalog: CatalogV1;
  context: RecommendationContext;
  sha256Hex: G2Sha256Hex;
  lexicon: ExplanationLexicon;
}): Promise<G2Experiment> {
  const participantId = participantIdSchema.parse(options.participantId);
  const importedProfile = createExperimentProfileV1Schema(options.catalog).parse(options.profile);
  const { holdoutWorkIds, postHoldoutProfile, profile } = await selectG2Holdout({
    participantId,
    catalogVersion: options.catalog.catalogVersion,
    profile: importedProfile,
    sha256Hex: options.sha256Hex,
  });
  assertG2CatalogProfile({
    participantId,
    profile,
    postHoldoutProfile,
    holdoutWorkIds,
    catalog: options.catalog,
  });

  const input = recommendationInput({
    catalog: options.catalog,
    context: options.context,
    profile: postHoldoutProfile,
  });
  const resolveTitle = explanationResolver(options.catalog);
  const tasteResults = rankRecommendations(input);
  const baselineResults = rankBaselineRecommendations(input);
  const tasteItems = tasteResults.map<G2ExperimentItem>((result, index) => {
    const explanation = generateTasteExplanation({
      contributions: result.contributions,
      confidenceLevel: result.confidenceLevel,
      lexicon: options.lexicon,
      resolveTitle,
    });
    const explanationTexts = [
      ...explanation.positiveReasons.map((reason) => reason.text),
      ...(explanation.caution === undefined ? [] : [explanation.caution.text]),
    ];
    return {
      rank: index + 1,
      workId: result.workId,
      explanationAvailable: explanationTexts.length > 0,
      explanationTexts,
    };
  });
  const baselineItems = baselineResults.map<G2ExperimentItem>((result, index) => {
    const explanation = generateBaselineExplanation({
      contributions: result.contributions,
      bestAnchorId: result.bestAnchorId,
      lexicon: options.lexicon,
      resolveTitle,
    });
    const explanationTexts = explanation.reason === undefined ? [] : [explanation.reason.text];
    return {
      rank: index + 1,
      workId: result.workId,
      explanationAvailable: explanationTexts.length > 0,
      explanationTexts,
    };
  });
  assertNativeItems(tasteItems);
  assertNativeItems(baselineItems);
  const nativeLists = {
    taste: { engine: "taste" as const, items: tasteItems },
    baseline: { engine: "baseline" as const, items: baselineItems },
  };
  const slots = await assignG2Slots({
    participantId,
    catalogVersion: options.catalog.catalogVersion,
    taste: nativeLists.taste,
    baseline: nativeLists.baseline,
    sha256Hex: options.sha256Hex,
  });
  return {
    participantId,
    catalogVersion: options.catalog.catalogVersion,
    profile,
    postHoldoutProfile,
    holdoutWorkIds,
    nativeLists,
    slots,
    distinctWorkIds: expectedDistinctWorkIds(slots),
  };
}

function resultList(list: G2ExperimentList) {
  return {
    engine: list.engine,
    items: list.items.map(({ rank, workId, explanationAvailable }) => ({
      rank,
      workId,
      explanationAvailable,
    })),
  };
}

export function createG2Result(options: {
  experiment: G2Experiment;
  respondent: G2Respondent;
  preResponses: readonly G2PreResponse[];
  listPreference: G2ListPreference;
  postResponses: readonly G2PostResponse[];
}): G2ResultV1 {
  return g2ResultV1Schema.parse({
    format: G2_RESULT_FORMAT,
    schemaVersion: G2_SCHEMA_VERSION,
    contractVersion: G2_CONTRACT_VERSION,
    participantId: options.experiment.participantId,
    respondent: options.respondent,
    catalogVersion: options.experiment.catalogVersion,
    factorDictionaryVersion: G2_FACTOR_DICTIONARY_VERSION,
    baselineVersion: BASELINE_VERSION,
    profile: options.experiment.profile,
    holdoutWorkIds: options.experiment.holdoutWorkIds,
    slots: {
      A: resultList(options.experiment.slots.A),
      B: resultList(options.experiment.slots.B),
    },
    preResponses: options.preResponses,
    listPreference: options.listPreference,
    postResponses: options.postResponses,
  });
}

export function canonicalizeG2Result(value: unknown): G2ResultV1 {
  const parsed = g2ResultV1Schema.parse(value);
  return g2ResultV1Schema.parse({
    ...parsed,
    profile: canonicalProfile(parsed.profile),
  });
}

export function serializeG2Result(value: unknown) {
  return `${JSON.stringify(canonicalizeG2Result(value), null, 2)}\n`;
}

function sameValue(left: unknown, right: unknown) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export async function validateG2ResultAgainstContext(options: {
  result: unknown;
  catalog: CatalogV1;
  context: RecommendationContext;
  sha256Hex: G2Sha256Hex;
  lexicon: ExplanationLexicon;
}): Promise<G2ResultV1> {
  const result = g2ResultV1Schema.parse(options.result);
  if (
    result.catalogVersion !== options.catalog.catalogVersion ||
    result.factorDictionaryVersion !== options.catalog.factorDictionaryVersion ||
    result.baselineVersion !== BASELINE_VERSION ||
    options.context.marketSnapshot.catalogVersion !== options.catalog.catalogVersion
  ) {
    throw new Error("G2 result, catalog, context, and engine versions must match.");
  }
  const experiment = await createG2Experiment({
    participantId: result.participantId,
    profile: result.profile,
    catalog: options.catalog,
    context: options.context,
    sha256Hex: options.sha256Hex,
    lexicon: options.lexicon,
  });
  const expectedDerived = {
    profile: experiment.profile,
    holdoutWorkIds: experiment.holdoutWorkIds,
    slots: {
      A: resultList(experiment.slots.A),
      B: resultList(experiment.slots.B),
    },
  };
  const actualDerived = {
    profile: result.profile,
    holdoutWorkIds: result.holdoutWorkIds,
    slots: result.slots,
  };
  if (!sameValue(actualDerived, expectedDerived)) {
    throw new Error("G2 result derived fields do not match the frozen engine input.");
  }
  return result;
}

export type G2Rate = {
  numerator: number;
  denominator: number;
  rate: number | null;
};

export type G2Lift = {
  sum: number;
  denominator: number;
  average: number | null;
};

export type G2EngineMetrics = {
  unknownWantToRead: G2Rate;
  explanationAgreement: G2Rate;
  explanationLift: G2Lift;
  dislikedLeakage: G2Rate;
  holdoutRecall: G2Rate;
};

export type G2PreferenceVerdict = "taste" | "baseline" | "tie";

export type G2ParticipantMetrics = {
  participantId: string;
  respondent: G2Respondent;
  preferenceVerdict: G2PreferenceVerdict;
  engines: Record<G2Engine, G2EngineMetrics>;
};

function rate(numerator: number, denominator: number): G2Rate {
  return { numerator, denominator, rate: denominator === 0 ? null : numerator / denominator };
}

function lift(sum: number, denominator: number): G2Lift {
  return { sum, denominator, average: denominator === 0 ? null : sum / denominator };
}

function postHoldoutRecords(result: G2ResultV1) {
  const heldOut = new Set(result.holdoutWorkIds);
  return result.profile.records.filter((record) => !heldOut.has(record.workId));
}

export function isG2DislikedLeakage(options: {
  candidate: Work;
  records: readonly UserWorkRecord[];
  worksById: Readonly<Record<string, Work>>;
}) {
  const anchors = positiveAnchors(options.worksById, options.records);
  const anchorScore = calculatePositiveAnchorScore(options.candidate, anchors);
  if (anchorScore === null) {
    return false;
  }
  const bestAnchor = ownRecordValue(options.worksById, anchorScore.bestAnchorId);
  if (bestAnchor === undefined) {
    throw new Error(`Missing G2 best anchor: ${anchorScore.bestAnchorId}`);
  }
  const penalties = calculateNegativePenalties({
    candidate: options.candidate,
    bestAnchor,
    negativeRecords: options.records,
    worksById: options.worksById,
  });
  return penalties.penaltiesApplied.some((reasonId) => FACTOR_BACKED_REASON_SET.has(reasonId));
}

function preferenceVerdict(result: G2ResultV1): G2PreferenceVerdict {
  if (result.listPreference === "tie") {
    return "tie";
  }
  return result.slots[result.listPreference].engine;
}

export function calculateG2ParticipantMetrics(
  value: unknown,
  catalog: CatalogV1,
): G2ParticipantMetrics {
  const result = g2ResultV1Schema.parse(value);
  const worksById = Object.fromEntries(catalog.works.map((work) => [work.id, work]));
  const records = postHoldoutRecords(result);
  const preByWorkId = new Map(result.preResponses.map((response) => [response.workId, response]));
  const postByOccurrence = new Map(
    result.postResponses.map((response) => [
      `${response.slot}\u0000${String(response.rank)}\u0000${response.workId}`,
      response,
    ]),
  );

  const metricsFor = (engine: G2Engine): G2EngineMetrics => {
    const slot: G2SlotId = result.slots.A.engine === engine ? "A" : "B";
    const items = result.slots[slot].items;
    let unknownNumerator = 0;
    let unknownDenominator = 0;
    let agreementNumerator = 0;
    let liftSum = 0;
    let liftDenominator = 0;
    let leakageNumerator = 0;
    let recallNumerator = 0;
    const holdoutIds = new Set(result.holdoutWorkIds);

    for (const item of items) {
      const pre = preByWorkId.get(item.workId);
      const post = postByOccurrence.get(`${slot}\u0000${String(item.rank)}\u0000${item.workId}`);
      const candidate = ownRecordValue(worksById, item.workId);
      if (pre === undefined || post === undefined || candidate === undefined) {
        throw new Error(`Incomplete G2 metric occurrence: ${engine}/${String(item.rank)}`);
      }
      if (pre.familiarity === "unknown") {
        unknownDenominator += 1;
        if (pre.wantToReadBefore >= 4) {
          unknownNumerator += 1;
        }
      }
      if (item.explanationAvailable) {
        liftSum += post.wantToReadAfter - pre.wantToReadBefore;
        liftDenominator += 1;
        if (post.agreement !== null && post.agreement >= 4) {
          agreementNumerator += 1;
        }
      }
      if (isG2DislikedLeakage({ candidate, records, worksById })) {
        leakageNumerator += 1;
      }
      if (holdoutIds.has(item.workId)) {
        recallNumerator += 1;
      }
    }
    return {
      unknownWantToRead: rate(unknownNumerator, unknownDenominator),
      explanationAgreement: rate(agreementNumerator, items.length),
      explanationLift: lift(liftSum, liftDenominator),
      dislikedLeakage: rate(leakageNumerator, items.length),
      holdoutRecall: rate(recallNumerator, result.holdoutWorkIds.length),
    };
  };
  const engines: Record<G2Engine, G2EngineMetrics> = {
    taste: metricsFor("taste"),
    baseline: metricsFor("baseline"),
  };

  return {
    participantId: result.participantId,
    respondent: result.respondent,
    preferenceVerdict: preferenceVerdict(result),
    engines,
  };
}

function sumRates(
  rows: readonly G2ParticipantMetrics[],
  engine: G2Engine,
  key: "unknownWantToRead" | "explanationAgreement" | "dislikedLeakage" | "holdoutRecall",
) {
  const numerator = rows.reduce((sum, row) => sum + row.engines[engine][key].numerator, 0);
  const denominator = rows.reduce((sum, row) => sum + row.engines[engine][key].denominator, 0);
  return rate(numerator, denominator);
}

function sumLifts(rows: readonly G2ParticipantMetrics[], engine: G2Engine) {
  const sum = rows.reduce((total, row) => total + row.engines[engine].explanationLift.sum, 0);
  const denominator = rows.reduce(
    (total, row) => total + row.engines[engine].explanationLift.denominator,
    0,
  );
  return lift(sum, denominator);
}

function compareFractions(
  left: Pick<G2Rate, "numerator" | "denominator">,
  right: Pick<G2Rate, "numerator" | "denominator">,
) {
  return left.numerator * right.denominator - right.numerator * left.denominator;
}

export type G2CriterionStatus = "PASS" | "FAIL" | "NOT_RUN";
export type G2Verdict = "GO" | "REVISE" | "INCOMPLETE";

export type G2AggregateMetrics = {
  humanCount: number;
  syntheticPilotCount: number;
  preference: {
    tasteWinCount: number;
    baselineWinCount: number;
    tieCount: number;
    tasteOrTieCount: number;
  };
  engines: Record<G2Engine, G2EngineMetrics>;
  criteria: {
    tasteOrTie: G2CriterionStatus;
    unknownWantToRead: G2CriterionStatus;
    tasteExplanationAgreement: G2CriterionStatus;
    dislikedLeakage: G2CriterionStatus;
    holdoutRecall: G2CriterionStatus;
  };
  verdict: G2Verdict;
  participants: G2ParticipantMetrics[];
};

export function aggregateG2Metrics(
  values: readonly unknown[],
  catalog: CatalogV1,
): G2AggregateMetrics {
  const participants = values
    .map((value) => calculateG2ParticipantMetrics(value, catalog))
    .sort((left, right) => compareText(left.participantId, right.participantId));
  const seen = new Set<string>();
  for (const participant of participants) {
    if (seen.has(participant.participantId)) {
      throw new Error(`Duplicate G2 participant id: ${participant.participantId}`);
    }
    seen.add(participant.participantId);
  }
  const humans = participants.filter((row) => row.respondent.kind === "human");
  const preference = {
    tasteWinCount: humans.filter((row) => row.preferenceVerdict === "taste").length,
    baselineWinCount: humans.filter((row) => row.preferenceVerdict === "baseline").length,
    tieCount: humans.filter((row) => row.preferenceVerdict === "tie").length,
    tasteOrTieCount: humans.filter((row) => row.preferenceVerdict !== "baseline").length,
  };
  const aggregateFor = (engine: G2Engine): G2EngineMetrics => ({
    unknownWantToRead: sumRates(humans, engine, "unknownWantToRead"),
    explanationAgreement: sumRates(humans, engine, "explanationAgreement"),
    explanationLift: sumLifts(humans, engine),
    dislikedLeakage: sumRates(humans, engine, "dislikedLeakage"),
    holdoutRecall: sumRates(humans, engine, "holdoutRecall"),
  });
  const engines: Record<G2Engine, G2EngineMetrics> = {
    taste: aggregateFor("taste"),
    baseline: aggregateFor("baseline"),
  };

  const exactlyTen = humans.length === 10;
  const criterion = (passes: boolean): G2CriterionStatus =>
    exactlyTen ? (passes ? "PASS" : "FAIL") : "NOT_RUN";
  const tasteUnknown = engines.taste.unknownWantToRead;
  const baselineUnknown = engines.baseline.unknownWantToRead;
  const tasteAgreement = engines.taste.explanationAgreement;
  const tasteLeakage = engines.taste.dislikedLeakage;
  const baselineLeakage = engines.baseline.dislikedLeakage;
  const tasteRecall = engines.taste.holdoutRecall;
  const baselineRecall = engines.baseline.holdoutRecall;
  const criteria = {
    tasteOrTie: criterion(preference.tasteOrTieCount >= 7),
    unknownWantToRead: criterion(
      tasteUnknown.denominator > 0 &&
        baselineUnknown.denominator > 0 &&
        compareFractions(tasteUnknown, baselineUnknown) > 0,
    ),
    tasteExplanationAgreement: criterion(
      tasteAgreement.denominator > 0 &&
        tasteAgreement.numerator * 10 >= tasteAgreement.denominator * 7,
    ),
    dislikedLeakage: criterion(
      tasteLeakage.denominator > 0 &&
        baselineLeakage.denominator > 0 &&
        compareFractions(tasteLeakage, baselineLeakage) <= 0,
    ),
    holdoutRecall: criterion(
      tasteRecall.denominator > 0 &&
        baselineRecall.denominator > 0 &&
        compareFractions(tasteRecall, baselineRecall) >= 0,
    ),
  };
  const statuses = Object.values(criteria);
  const verdict: G2Verdict = !exactlyTen
    ? "INCOMPLETE"
    : statuses.every((status) => status === "PASS")
      ? "GO"
      : "REVISE";

  return {
    humanCount: humans.length,
    syntheticPilotCount: participants.length - humans.length,
    preference,
    engines,
    criteria,
    verdict,
    participants,
  };
}
