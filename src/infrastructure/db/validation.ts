import * as z from "zod/v4";

import {
  finalizeOnboardingDraft,
  restoreOnboardingDraft,
  type OnboardingDraft,
} from "@/domain/profile/onboarding";
import { AXIS_IDS, THEME_TAGS } from "@/domain/catalog/constants";
import {
  isExternalWorkId,
  parseExternalWorkNormalizedKeyV1,
  type ExternalWorkId,
} from "@/domain/catalog/external-work";
import { NEGATIVE_REASON_ORDER } from "@/domain/profile/constants";
import type {
  ExternalNegativeReasonId,
  NegativeReasonId,
  ProfileAdjustments,
  RecommendationPolicies,
  UserWorkRecord,
} from "@/domain/profile/types";
import type { GroupContribution, RecommendationPlanEntry } from "@/domain/recommendation/types";
import {
  RECOMMENDATION_CACHE_SCHEMA_VERSION,
  RECOMMENDATION_ENGINE_VERSION,
} from "@/domain/recommendation/input-hash";
import { isbnIdentityKey } from "@/domain/catalog/normalize";
import { rakutenAvailabilitySchema, rakutenIsbnSchema } from "@/infrastructure/rakuten/schema";

import type { OnboardingCommit } from "./backend";
import type { ExternalWorkRecord, ProviderCacheRecord, RecommendationCacheRecord } from "./records";

const EXTERNAL_REASON_PATTERN = /^external:[a-z0-9]+(?:-[a-z0-9]+)*$/;

const externalNegativeReasonSchema = z.custom<ExternalNegativeReasonId>(
  (value) =>
    typeof value === "string" &&
    value.length >= 10 &&
    value.length <= 64 &&
    EXTERNAL_REASON_PATTERN.test(value),
);

const negativeReasonSchema: z.ZodType<NegativeReasonId> = z.union([
  z.enum(NEGATIVE_REASON_ORDER),
  externalNegativeReasonSchema,
]);

const userWorkRecordSchema: z.ZodType<UserWorkRecord> = z
  .strictObject({
    workId: z.string().min(1),
    readingState: z.enum(["planned", "reading", "completed", "dropped", "hidden"]),
    reaction: z.enum(["favorite", "liked", "neutral", "disliked"]).optional(),
    progress: z
      .strictObject({
        volume: z.number().int().nonnegative().optional(),
        chapter: z.number().int().nonnegative().optional(),
      })
      .optional(),
    positiveReasons: z.array(z.string().min(1)).optional(),
    negativeReasons: z.array(negativeReasonSchema).min(1).optional(),
    droppedReasons: z.array(negativeReasonSchema).min(1).optional(),
    updatedAt: z.iso.datetime({ offset: true }),
  })
  .superRefine((record, context) => {
    if (record.negativeReasons !== undefined && record.reaction !== "disliked") {
      context.addIssue({
        code: "custom",
        path: ["negativeReasons"],
        message: "negativeReasons require a disliked reaction",
      });
    }
    if (record.droppedReasons !== undefined && record.readingState !== "dropped") {
      context.addIssue({
        code: "custom",
        path: ["droppedReasons"],
        message: "droppedReasons require a dropped reading state",
      });
    }

    const seenReasons = new Set<NegativeReasonId>();
    for (const [field, reasons] of [
      ["negativeReasons", record.negativeReasons],
      ["droppedReasons", record.droppedReasons],
    ] as const) {
      reasons?.forEach((reason, index) => {
        if (seenReasons.has(reason)) {
          context.addIssue({
            code: "custom",
            path: [field, index],
            message: "Negative reasons must be unique across a work record",
          });
        }
        seenReasons.add(reason);
      });
    }
    if (seenReasons.has("vagueDislike") && seenReasons.size !== 1) {
      context.addIssue({
        code: "custom",
        path: ["negativeReasons"],
        message: "vagueDislike must be the work record's only negative or dropped reason",
      });
    }
  });

const catalogUserWorkRecordSchema: z.ZodType<UserWorkRecord> = userWorkRecordSchema.refine(
  (record) => record.workId !== "external" && !record.workId.startsWith("ext:"),
  {
    path: ["workId"],
    message: "Catalog user work cannot use the reserved external namespace",
  },
);

const userWorkRecordsSchema = z
  .array(catalogUserWorkRecordSchema)
  .superRefine((records, context) => {
    const workIds = new Set<string>();
    records.forEach((record, index) => {
      if (workIds.has(record.workId)) {
        context.addIssue({
          code: "custom",
          path: [index, "workId"],
          message: "User work ids must be unique",
        });
      }
      workIds.add(record.workId);
    });
  });

const externalWorkIdSchema = z.custom<ExternalWorkId>(isExternalWorkId, {
  message: "External work id must use the supported Rakuten v1 namespace",
});

const externalWorkRecordSchema: z.ZodType<ExternalWorkRecord> = z
  .strictObject({
    id: externalWorkIdSchema,
    normalizedKey: z.string().trim().min(1),
    title: z.string().trim().min(1),
    creators: z.array(z.string().trim().min(1)).min(1),
    isbnSamples: z.array(rakutenIsbnSchema.transform(isbnIdentityKey)).min(1),
    coverUrl: z
      .url()
      .refine((value) => new URL(value).protocol === "https:")
      .optional(),
    record: userWorkRecordSchema,
  })
  .superRefine((externalWork, context) => {
    if (externalWork.record.workId !== externalWork.id) {
      context.addIssue({
        code: "custom",
        path: ["record", "workId"],
        message: "External work record id must match its embedded user work id",
      });
    }

    try {
      parseExternalWorkNormalizedKeyV1(externalWork.normalizedKey);
    } catch {
      context.addIssue({
        code: "custom",
        path: ["normalizedKey"],
        message: "External work normalized key must remain canonical v1 identity material",
      });
    }

    for (const [field, values] of [
      ["creators", externalWork.creators],
      ["isbnSamples", externalWork.isbnSamples],
    ] as const) {
      const seen = new Set<string>();
      values.forEach((value, index) => {
        const identity = field === "isbnSamples" ? isbnIdentityKey(value) : value;
        if (seen.has(identity)) {
          context.addIssue({
            code: "custom",
            path: [field, index],
            message: `External work ${field} must be unique`,
          });
        }
        seen.add(identity);
      });
    }
  });

const externalWorkRecordsSchema = z
  .array(externalWorkRecordSchema)
  .superRefine((records, context) => {
    const ids = new Set<string>();
    const normalizedKeys = new Set<string>();
    records.forEach((record, index) => {
      if (ids.has(record.id)) {
        context.addIssue({
          code: "custom",
          path: [index, "id"],
          message: "External work ids must be unique",
        });
      }
      if (normalizedKeys.has(record.normalizedKey)) {
        context.addIssue({
          code: "custom",
          path: [index, "normalizedKey"],
          message: "External work normalized keys must be unique",
        });
      }
      ids.add(record.id);
      normalizedKeys.add(record.normalizedKey);
    });
  });

const timestampSchema = z.iso.datetime({ offset: true });
const recommendationInputHashSchema = z.string().regex(/^[a-f0-9]{64}$/);
const adjustmentPreferenceSchema = z.enum(["veryLike", "like", "auto", "less", "exclude"]);
const profileAdjustmentsSchema: z.ZodType<ProfileAdjustments> = z.strictObject({
  axes: z.partialRecord(z.enum(AXIS_IDS), adjustmentPreferenceSchema),
  themes: z.partialRecord(z.enum(THEME_TAGS), adjustmentPreferenceSchema),
});
const recommendationPoliciesSchema: z.ZodType<RecommendationPolicies> = z.strictObject({
  preferCompleted: z.boolean(),
  preferHidden: z.boolean(),
  preferVerified: z.boolean(),
  excludeIncomplete: z.boolean(),
});
const groupContributionSchema: z.ZodType<GroupContribution> = z.strictObject({
  source: z.enum([
    "baseline",
    "similarity",
    "consensus",
    "adjustment",
    "penalty",
    "policy",
    "clamp",
  ]),
  group: z.enum(["genre", "theme", "narrative", "tone", "art", "overall"]),
  factorId: z.string().min(1),
  value: z.number().finite(),
  anchorWorkIds: z.array(z.string().min(1)),
  axisPreferenceDirection: z.enum(["higher", "lower"]).optional(),
  negativeReasonId: negativeReasonSchema.optional(),
  explainable: z.boolean(),
});
const recommendationPlanEntrySchema: z.ZodType<RecommendationPlanEntry> = z.strictObject({
  workId: z.string().min(1),
  tasteScore: z.number().finite().min(0).max(1),
  confidence: z.number().finite().min(0).max(1),
  confidenceLevel: z.enum(["high", "normal", "low"]),
  bestAnchorId: z.string().min(1),
  contributions: z.array(groupContributionSchema),
  penaltiesApplied: z.array(negativeReasonSchema),
  isDiscovery: z.boolean(),
  majorThemeKey: z.string().min(1),
  seriesGroupId: z.string().min(1),
});
const recommendationCacheRecordSchema: z.ZodType<RecommendationCacheRecord> = z.strictObject({
  schemaVersion: z.literal(RECOMMENDATION_CACHE_SCHEMA_VERSION),
  engineVersion: z.literal(RECOMMENDATION_ENGINE_VERSION),
  inputHash: recommendationInputHashSchema,
  plan: z.array(recommendationPlanEntrySchema).superRefine((entries, context) => {
    const workIds = new Set<string>();
    entries.forEach((entry, index) => {
      if (workIds.has(entry.workId)) {
        context.addIssue({
          code: "custom",
          path: [index, "workId"],
          message: "Recommendation plan work ids must be unique",
        });
      }
      workIds.add(entry.workId);
    });
  }),
  computedAt: timestampSchema,
});

const httpsUrlSchema = z.url().refine((value) => new URL(value).protocol === "https:");
const providerCacheRecordSchema: z.ZodType<ProviderCacheRecord> = z
  .strictObject({
    workId: z.string().min(1),
    provider: z.literal("rakuten"),
    isbn: rakutenIsbnSchema,
    imageUrl: httpsUrlSchema.optional(),
    itemUrl: httpsUrlSchema.optional(),
    affiliateUrl: httpsUrlSchema.optional(),
    chirayomiUrl: httpsUrlSchema.optional(),
    itemCaption: z.string().trim().min(1).optional(),
    itemPrice: z.number().int().nonnegative().optional(),
    availability: rakutenAvailabilitySchema.optional(),
    reviewAverage: z.number().finite().min(0).max(5).optional(),
    reviewCount: z.number().int().nonnegative().optional(),
    fetchedAt: timestampSchema,
    commercialExpiresAt: timestampSchema,
    metadataExpiresAt: timestampSchema,
  })
  .superRefine((record, context) => {
    const fetchedAt = Date.parse(record.fetchedAt);
    const commercialExpiresAt = Date.parse(record.commercialExpiresAt);
    const metadataExpiresAt = Date.parse(record.metadataExpiresAt);
    if (commercialExpiresAt <= fetchedAt) {
      context.addIssue({
        code: "custom",
        path: ["commercialExpiresAt"],
        message: "Commercial provider data must expire after it is fetched",
      });
    }
    if (metadataExpiresAt <= commercialExpiresAt) {
      context.addIssue({
        code: "custom",
        path: ["metadataExpiresAt"],
        message: "Provider metadata must outlive commercial data",
      });
    }
  });

export function parseOnboardingDraft(value: unknown): OnboardingDraft {
  return restoreOnboardingDraft(value);
}

export function parseUserWorks(value: unknown): UserWorkRecord[] {
  return userWorkRecordsSchema.parse(value);
}

export function parseUserWork(value: unknown): UserWorkRecord {
  return catalogUserWorkRecordSchema.parse(value);
}

export function parseExternalWorks(value: unknown): ExternalWorkRecord[] {
  return externalWorkRecordsSchema.parse(value);
}

export function parseExternalWork(value: unknown): ExternalWorkRecord {
  return externalWorkRecordSchema.parse(value);
}

export function parseExternalUserWorkRecord(id: ExternalWorkId, value: unknown): UserWorkRecord {
  const record = userWorkRecordSchema.parse(value);
  if (record.workId !== id) {
    throw new TypeError("External user work id must match its parent external work id");
  }
  return record;
}

export function isMinimalPlannedUserWork(value: unknown): boolean {
  const parsed = userWorkRecordSchema.safeParse(value);
  if (!parsed.success) return false;

  const record = parsed.data;
  return (
    record.readingState === "planned" &&
    record.reaction === undefined &&
    record.progress?.volume === undefined &&
    record.progress?.chapter === undefined &&
    (record.positiveReasons?.length ?? 0) === 0 &&
    (record.negativeReasons?.length ?? 0) === 0 &&
    (record.droppedReasons?.length ?? 0) === 0
  );
}

export function createEmptyProfileAdjustments(): ProfileAdjustments {
  return { axes: {}, themes: {} };
}

export function parseProfileAdjustments(value: unknown): ProfileAdjustments {
  return profileAdjustmentsSchema.parse(value);
}

export function createDefaultRecommendationPolicies(): RecommendationPolicies {
  return {
    preferCompleted: false,
    preferHidden: false,
    preferVerified: false,
    excludeIncomplete: false,
  };
}

export function parseRecommendationPolicies(value: unknown): RecommendationPolicies {
  return recommendationPoliciesSchema.parse(value);
}

export function parseRecommendationInputHash(value: unknown): string {
  return recommendationInputHashSchema.parse(value);
}

export function parseRecommendationCacheRecord(
  value: unknown,
  expectedInputHash?: string,
): RecommendationCacheRecord {
  const record = recommendationCacheRecordSchema.parse(value);
  if (
    expectedInputHash !== undefined &&
    record.inputHash !== parseRecommendationInputHash(expectedInputHash)
  ) {
    throw new Error("Recommendation cache key does not match its input hash");
  }
  return record;
}

export function parseProviderCacheIsbn(value: unknown): string {
  return rakutenIsbnSchema.parse(value);
}

export function parseProviderCacheRecord(
  value: unknown,
  expectedIsbn?: string,
): ProviderCacheRecord {
  const record = providerCacheRecordSchema.parse(value);
  if (expectedIsbn !== undefined && record.isbn !== parseProviderCacheIsbn(expectedIsbn)) {
    throw new Error("Provider cache key does not match its ISBN");
  }
  return record;
}

export function parseWorkId(value: unknown): string {
  return z
    .string()
    .min(1)
    .refine((workId) => workId !== "external" && !workId.startsWith("ext:"), {
      message: "Catalog work id cannot use the reserved external namespace",
    })
    .parse(value);
}

export function parseOnboardingCompletedAt(value: unknown): string | null {
  return value === null || value === undefined ? null : timestampSchema.parse(value);
}

export function createOnboardingCommit(
  draft: OnboardingDraft,
  completedAt: string,
): OnboardingCommit {
  const finalizedAt = timestampSchema.parse(completedAt);
  const userWorks = parseUserWorks(finalizeOnboardingDraft(draft, finalizedAt));
  return draft.mode === "add"
    ? { mode: "add", userWorks }
    : { mode: "firstRun", userWorks, onboardingCompletedAt: finalizedAt };
}
