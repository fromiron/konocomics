import * as z from "zod/v4";
import type { RefinementCtx } from "zod/v4";

import { NEGATIVE_REASON_ORDER } from "./constants";
import type { ExternalNegativeReasonId, NegativeReasonId, UserWorkRecord } from "./types";

export const ONBOARDING_MIN_POSITIVE_WORKS = 5;
export const ONBOARDING_MAX_POSITIVE_WORKS = 10;
export const ONBOARDING_MAX_NEGATIVE_WORKS = 3;

const EXTERNAL_REASON_PATTERN = /^external:[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type PositiveOnboardingEntry = {
  workId: string;
  reaction: "favorite" | "liked";
};

export type NegativeDisposition = "disliked" | "dropped";

export type NegativeOnboardingEntry = {
  workId: string;
  disposition: NegativeDisposition;
  reasons: NegativeReasonId[];
};

type OnboardingDraftBase = {
  id: "current";
  positiveEntries: PositiveOnboardingEntry[];
  updatedAt: string;
};

export type FirstRunOnboardingDraft = OnboardingDraftBase & {
  mode: "firstRun";
  step: 1 | 2;
  negativeEntries: NegativeOnboardingEntry[];
};

export type AddWorksOnboardingDraft = OnboardingDraftBase & {
  mode: "add";
  step: 1;
  negativeEntries: [];
};

export type OnboardingDraft = FirstRunOnboardingDraft | AddWorksOnboardingDraft;

const positiveOnboardingEntrySchema = z.strictObject({
  workId: z.string().min(1),
  reaction: z.enum(["favorite", "liked"]),
});

function isExternalNegativeReason(value: string): value is ExternalNegativeReasonId {
  return value.length >= 10 && value.length <= 64 && EXTERNAL_REASON_PATTERN.test(value);
}

const externalNegativeReasonSchema = z
  .string()
  .min(10)
  .max(64)
  .regex(EXTERNAL_REASON_PATTERN)
  .transform((value, context): ExternalNegativeReasonId => {
    if (isExternalNegativeReason(value)) {
      return value;
    }
    context.addIssue({ code: "custom", message: "Invalid external negative reason" });
    return z.NEVER;
  });

const negativeReasonSchema: z.ZodType<NegativeReasonId> = z.union([
  z.enum(NEGATIVE_REASON_ORDER),
  externalNegativeReasonSchema,
]);

const negativeOnboardingEntrySchema = z.strictObject({
  workId: z.string().min(1),
  disposition: z.enum(["disliked", "dropped"]),
  reasons: z.array(negativeReasonSchema),
});

function addDuplicateWorkIssues(
  entries: readonly { workId: string }[],
  path: "positiveEntries" | "negativeEntries",
  context: RefinementCtx,
) {
  const firstIndexByWorkId = new Map<string, number>();
  entries.forEach((entry, index) => {
    if (firstIndexByWorkId.has(entry.workId)) {
      context.addIssue({
        code: "custom",
        path: [path, index, "workId"],
        message: "Duplicate onboarding work",
      });
      return;
    }
    firstIndexByWorkId.set(entry.workId, index);
  });
}

const draftBase = {
  id: z.literal("current"),
  positiveEntries: z.array(positiveOnboardingEntrySchema).max(ONBOARDING_MAX_POSITIVE_WORKS),
  updatedAt: z.iso.datetime({ offset: true }),
} as const;

export const onboardingDraftSchema: z.ZodType<OnboardingDraft> = z
  .discriminatedUnion("mode", [
    z.strictObject({
      ...draftBase,
      mode: z.literal("firstRun"),
      step: z.union([z.literal(1), z.literal(2)]),
      negativeEntries: z.array(negativeOnboardingEntrySchema).max(ONBOARDING_MAX_NEGATIVE_WORKS),
    }),
    z.strictObject({
      ...draftBase,
      mode: z.literal("add"),
      step: z.literal(1),
      negativeEntries: z.tuple([]),
    }),
  ])
  .superRefine((draft, context) => {
    addDuplicateWorkIssues(draft.positiveEntries, "positiveEntries", context);
    addDuplicateWorkIssues(draft.negativeEntries, "negativeEntries", context);

    const positiveWorkIds = new Set(draft.positiveEntries.map((entry) => entry.workId));
    draft.negativeEntries.forEach((entry, index) => {
      if (positiveWorkIds.has(entry.workId)) {
        context.addIssue({
          code: "custom",
          path: ["negativeEntries", index, "workId"],
          message: "A work cannot be both a positive and negative onboarding entry",
        });
      }
      if (entry.reasons.includes("vagueDislike") && entry.reasons.length !== 1) {
        context.addIssue({
          code: "custom",
          path: ["negativeEntries", index, "reasons"],
          message: "vagueDislike must be the entry's only reason",
        });
      }
      const firstIndexByReason = new Map<NegativeReasonId, number>();
      entry.reasons.forEach((reason, reasonIndex) => {
        if (firstIndexByReason.has(reason)) {
          context.addIssue({
            code: "custom",
            path: ["negativeEntries", index, "reasons", reasonIndex],
            message: "Duplicate onboarding reason",
          });
          return;
        }
        firstIndexByReason.set(reason, reasonIndex);
      });
    });
  });

export function createEmptyOnboardingDraft(
  updatedAt: string,
  mode: OnboardingDraft["mode"] = "firstRun",
): OnboardingDraft {
  return onboardingDraftSchema.parse({
    id: "current",
    mode,
    step: 1,
    positiveEntries: [],
    negativeEntries: [],
    updatedAt,
  });
}

export function restoreOnboardingDraft(value: unknown): OnboardingDraft {
  return onboardingDraftSchema.parse(value);
}

export function reconcileOnboardingDraftMode(
  draft: OnboardingDraft,
  hasCatalogBackedProfile: boolean,
  existingWorkIds: ReadonlySet<string>,
  positiveAvailableWorkIds: ReadonlySet<string>,
  negativeAvailableWorkIds: ReadonlySet<string>,
): OnboardingDraft {
  const restored = restoreOnboardingDraft(draft);
  const positiveEntries = restored.positiveEntries.filter(
    (entry) => positiveAvailableWorkIds.has(entry.workId) && !existingWorkIds.has(entry.workId),
  );
  const negativeEntries = restored.negativeEntries.filter(
    (entry) => negativeAvailableWorkIds.has(entry.workId) && !existingWorkIds.has(entry.workId),
  );

  if (hasCatalogBackedProfile) {
    return onboardingDraftSchema.parse({
      ...restored,
      mode: "add",
      step: 1,
      positiveEntries,
      negativeEntries: [],
    });
  }

  return onboardingDraftSchema.parse({
    ...restored,
    mode: "firstRun",
    step:
      restored.mode === "firstRun" && positiveEntries.length >= ONBOARDING_MIN_POSITIVE_WORKS
        ? restored.step
        : 1,
    positiveEntries,
    negativeEntries,
  });
}

function finalizedReasons(reasons: readonly NegativeReasonId[]): NegativeReasonId[] {
  return reasons.length === 0 ? ["vagueDislike"] : [...reasons];
}

export function finalizeOnboardingDraft(
  draft: OnboardingDraft,
  completedAt: string,
): UserWorkRecord[] {
  const restored = restoreOnboardingDraft(draft);
  const finalizedAt = z.iso.datetime({ offset: true }).parse(completedAt);
  const minimumPositiveWorks = restored.mode === "add" ? 1 : ONBOARDING_MIN_POSITIVE_WORKS;

  if (restored.positiveEntries.length < minimumPositiveWorks) {
    throw new Error(
      `${restored.mode === "add" ? "Add mode" : "Onboarding"} requires at least ${String(minimumPositiveWorks)} positive works`,
    );
  }

  const positives: UserWorkRecord[] = restored.positiveEntries.map((entry) => ({
    workId: entry.workId,
    readingState: "completed",
    reaction: entry.reaction,
    updatedAt: finalizedAt,
  }));
  const negatives: UserWorkRecord[] = restored.negativeEntries.map((entry) => {
    const reasons = finalizedReasons(entry.reasons);
    if (entry.disposition === "disliked") {
      return {
        workId: entry.workId,
        readingState: "completed",
        reaction: "disliked",
        negativeReasons: reasons,
        updatedAt: finalizedAt,
      };
    }
    return {
      workId: entry.workId,
      readingState: "dropped",
      droppedReasons: reasons,
      updatedAt: finalizedAt,
    };
  });

  return [...positives, ...negatives];
}
