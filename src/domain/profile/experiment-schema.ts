import { z, type RefinementCtx } from "zod";

import { AXIS_IDS, THEME_TAGS } from "../catalog/constants";
import type { CatalogV1 } from "../catalog/types";
import { NEGATIVE_REASON_ORDER } from "./constants";
import type {
  AdjustmentPreference,
  ExternalNegativeReasonId,
  NegativeReasonId,
  ReadingState,
  Reaction,
} from "./types";

const PROFILE_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EXTERNAL_REASON_PATTERN = /^external:[a-z0-9]+(?:-[a-z0-9]+)*$/;

const READING_STATES = [
  "planned",
  "reading",
  "completed",
  "dropped",
  "hidden",
] as const satisfies readonly ReadingState[];
const REACTIONS = [
  "favorite",
  "liked",
  "neutral",
  "disliked",
] as const satisfies readonly Reaction[];
const ADJUSTMENT_PREFERENCES = [
  "veryLike",
  "like",
  "auto",
  "less",
  "exclude",
] as const satisfies readonly AdjustmentPreference[];

const profileIdSchema = z.string().min(1).max(64).regex(PROFILE_ID_PATTERN);

function isExperimentExternalReason(value: string): value is ExternalNegativeReasonId {
  return value.length >= 10 && value.length <= 64 && EXTERNAL_REASON_PATTERN.test(value);
}

export const experimentExternalNegativeReasonSchema = z
  .string()
  .min(10)
  .max(64)
  .regex(EXTERNAL_REASON_PATTERN)
  .transform((value, context): ExternalNegativeReasonId => {
    if (isExperimentExternalReason(value)) {
      return value;
    }
    context.addIssue({ code: "custom", message: "Invalid external negative reason" });
    return z.NEVER;
  });

export const experimentNegativeReasonSchema: z.ZodType<NegativeReasonId> = z.union([
  z.enum(NEGATIVE_REASON_ORDER),
  experimentExternalNegativeReasonSchema,
]);

const progressSchema = z.strictObject({
  volume: z.number().optional(),
  chapter: z.number().optional(),
});

const userWorkRecordSchema = z.strictObject({
  workId: z.string().min(1),
  readingState: z.enum(READING_STATES),
  reaction: z.enum(REACTIONS).optional(),
  progress: progressSchema.optional(),
  positiveReasons: z.array(z.string()).optional(),
  negativeReasons: z.array(experimentNegativeReasonSchema).optional(),
  droppedReasons: z.array(experimentNegativeReasonSchema).optional(),
  updatedAt: z.iso.datetime({ offset: true }),
});

const adjustmentPreferenceSchema = z.enum(ADJUSTMENT_PREFERENCES);

const adjustmentsSchema = z.strictObject({
  axes: z.partialRecord(z.enum(AXIS_IDS), adjustmentPreferenceSchema),
  themes: z.partialRecord(z.enum(THEME_TAGS), adjustmentPreferenceSchema),
});

const policiesSchema = z.strictObject({
  preferCompleted: z.literal(false),
  preferHidden: z.literal(false),
  preferVerified: z.literal(false),
  excludeIncomplete: z.literal(false),
});

function addDuplicateIssues(
  values: readonly string[] | undefined,
  path: readonly (string | number)[],
  context: RefinementCtx,
) {
  if (values === undefined) {
    return;
  }
  const firstIndexByValue = new Map<string, number>();
  values.forEach((value, index) => {
    if (firstIndexByValue.has(value)) {
      context.addIssue({
        code: "custom",
        path: [...path, index],
        message: "Duplicate array value",
      });
      return;
    }
    firstIndexByValue.set(value, index);
  });
}

export const experimentProfileV1Schema = z
  .strictObject({
    format: z.literal("konocomics-experiment-profile"),
    schemaVersion: z.literal(1),
    profileId: profileIdSchema,
    records: z.array(userWorkRecordSchema),
    adjustments: adjustmentsSchema,
    policies: policiesSchema,
  })
  .superRefine((profile, context) => {
    const firstRecordIndexByWorkId = new Map<string, number>();

    profile.records.forEach((record, recordIndex) => {
      if (firstRecordIndexByWorkId.has(record.workId)) {
        context.addIssue({
          code: "custom",
          path: ["records", recordIndex, "workId"],
          message: `Duplicate work id: ${record.workId}`,
        });
      } else {
        firstRecordIndexByWorkId.set(record.workId, recordIndex);
      }

      addDuplicateIssues(
        record.positiveReasons,
        ["records", recordIndex, "positiveReasons"],
        context,
      );
      addDuplicateIssues(
        record.negativeReasons,
        ["records", recordIndex, "negativeReasons"],
        context,
      );
      addDuplicateIssues(
        record.droppedReasons,
        ["records", recordIndex, "droppedReasons"],
        context,
      );

      if (record.negativeReasons !== undefined && record.reaction !== "disliked") {
        context.addIssue({
          code: "custom",
          path: ["records", recordIndex, "negativeReasons"],
          message: "negativeReasons are only allowed for a disliked record",
        });
      }
      if (record.droppedReasons !== undefined && record.readingState !== "dropped") {
        context.addIssue({
          code: "custom",
          path: ["records", recordIndex, "droppedReasons"],
          message: "droppedReasons are only allowed for a dropped record",
        });
      }

      const negativeReasons = new Set(record.negativeReasons ?? []);
      const droppedReasons = new Set(record.droppedReasons ?? []);
      for (const reason of negativeReasons) {
        if (droppedReasons.has(reason)) {
          context.addIssue({
            code: "custom",
            path: ["records", recordIndex, "droppedReasons"],
            message: `Reason appears in both negativeReasons and droppedReasons: ${reason}`,
          });
        }
      }

      const combinedReasons = new Set([...negativeReasons, ...droppedReasons]);
      if (combinedReasons.has("vagueDislike") && combinedReasons.size !== 1) {
        context.addIssue({
          code: "custom",
          path: ["records", recordIndex],
          message: "vagueDislike must be the record's only negative or dropped reason",
        });
      }
    });

    const positiveAnchorCount = profile.records.filter(
      (record) => record.reaction === "favorite" || record.reaction === "liked",
    ).length;
    if (positiveAnchorCount < 5 || positiveAnchorCount > 10) {
      context.addIssue({
        code: "custom",
        path: ["records"],
        message: "An experiment profile requires 5 through 10 positive anchors",
      });
    }

    const negativeSourceCount = profile.records.filter(
      (record) =>
        record.reaction === "disliked" ||
        (record.negativeReasons?.length ?? 0) > 0 ||
        (record.droppedReasons?.length ?? 0) > 0,
    ).length;
    if (negativeSourceCount > 3) {
      context.addIssue({
        code: "custom",
        path: ["records"],
        message: "An experiment profile allows at most 3 distinct negative sources",
      });
    }
  });

export type ExperimentProfileV1 = z.infer<typeof experimentProfileV1Schema>;

export function createExperimentProfileV1Schema(catalog: Pick<CatalogV1, "works">) {
  const catalogWorkIds = new Set(catalog.works.map((work) => work.id));
  return experimentProfileV1Schema.superRefine((profile, context) => {
    profile.records.forEach((record, recordIndex) => {
      if (!catalogWorkIds.has(record.workId)) {
        context.addIssue({
          code: "custom",
          path: ["records", recordIndex, "workId"],
          message: `Work id is not present in the catalog: ${record.workId}`,
        });
      }
    });
  });
}
