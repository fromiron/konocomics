import { z } from "zod";

import {
  AXIS_IDS,
  DEMOGRAPHICS,
  EDITION_KINDS,
  FACTOR_SOURCE_TYPES,
  GENRE_TAGS,
  THEME_TAGS,
  WORK_STATUSES,
} from "./constants";
import { isValidIsbn } from "./normalize";

const confidenceSchema = z.number().min(0).max(1);
const catalogIdSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:[a-z0-9-]*[a-z0-9])?$/);

export const genreTagSchema = z.enum(GENRE_TAGS);
export const themeTagSchema = z.enum(THEME_TAGS);
export const axisIdSchema = z.enum(AXIS_IDS);

export const axisFactorSchema = z.discriminatedUnion("state", [
  z.strictObject({
    state: z.literal("known"),
    value: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    confidence: confidenceSchema,
  }),
  z.strictObject({ state: z.literal("unknown") }),
  z.strictObject({ state: z.literal("notApplicable") }),
]);

export const workAxesSchema = z
  .record(axisIdSchema, axisFactorSchema)
  .superRefine((axes, context) => {
    for (const axisId of AXIS_IDS) {
      if (axisId !== "motionImpact" && axes[axisId].state === "notApplicable") {
        context.addIssue({
          code: "custom",
          path: [axisId, "state"],
          message: "notApplicable is only defined for motionImpact in factor dictionary v1",
        });
      }
    }
  });

export const themeFactorSchema = z.strictObject({
  id: themeTagSchema,
  centrality: z.union([z.literal(1), z.literal(2)]),
  confidence: confidenceSchema,
});

export const catalogEligibilitySchema = z.strictObject({
  onboardingEligible: z.boolean(),
  recommendationEligible: z.boolean(),
  libraryOnly: z.boolean(),
});

export const workEvidenceSchema = z.strictObject({
  metadataConfidence: confidenceSchema,
  groupingConfidence: confidenceSchema,
  sourceAgreement: confidenceSchema,
  annotationReviewedAt: z.iso.datetime({ offset: true }).optional(),
});

export const workSchema = z.strictObject({
  id: catalogIdSchema,
  title: z.string().trim().min(1),
  titleKana: z.string().trim().min(1).optional(),
  aliases: z.array(z.string().trim().min(1)),
  creators: z.array(z.string().trim().min(1)).min(1),
  publisher: z.string().trim().min(1).optional(),
  demographic: z.enum(DEMOGRAPHICS).optional(),
  status: z.enum(WORK_STATUSES),
  firstPublishedYear: z.number().int().min(1800).max(2200).optional(),
  genres: z.array(genreTagSchema),
  themes: z.array(themeFactorSchema),
  axes: workAxesSchema,
  factorScope: z.literal("entry_1_3_volumes"),
  eligibility: catalogEligibilitySchema,
  evidence: workEvidenceSchema,
});

export const volumeSchema = z.strictObject({
  id: catalogIdSchema,
  workId: catalogIdSchema,
  volumeNumber: z.number().int().positive().optional(),
  isbn: z
    .string()
    .regex(/^(?:\d{13}|\d{9}[\dX])$/)
    .refine(isValidIsbn, { message: "ISBN checksum is invalid" }),
  releaseDate: z.iso.date().optional(),
  editionKind: z.enum(EDITION_KINDS),
});

export const factorEvidenceSchema = z.strictObject({
  sourceType: z.enum(FACTOR_SOURCE_TYPES),
  sourceUrl: z.url().optional(),
  fetchedAt: z.iso.datetime({ offset: true }),
  extractorVersion: z.string().trim().min(1).optional(),
  reviewedByHuman: z.boolean(),
  confidence: confidenceSchema,
});

export const catalogV1Schema = z.strictObject({
  schemaVersion: z.literal(1),
  catalogVersion: z.string().trim().min(1),
  factorDictionaryVersion: z.literal("v1"),
  works: z.array(workSchema),
  volumes: z.array(volumeSchema),
  representativeVolumeByWorkId: z.record(catalogIdSchema, catalogIdSchema),
});
