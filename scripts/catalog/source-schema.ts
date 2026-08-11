import { z } from "zod";

import {
  AXIS_IDS,
  DEMOGRAPHICS,
  EDITION_KINDS,
  FACTOR_SOURCE_TYPES,
  GENRE_TAGS,
  THEME_TAGS,
  WORK_STATUSES,
} from "../../src/domain/catalog/constants";
import { isValidIsbn, normalizeIsbn } from "../../src/domain/catalog/normalize";

const requiredText = z.string().trim().min(1);
const catalogSourceId = requiredText.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u, {
  message: "Must be a lowercase kebab-case catalog ID",
});
const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : value));
const csvBoolean = z.enum(["true", "false"]).transform((value) => value === "true");
const csvNumber = z
  .string()
  .trim()
  .regex(/^-?\d+(?:\.\d+)?$/u)
  .transform(Number);
const csvInteger = z.string().trim().regex(/^\d+$/u).transform(Number).pipe(z.number().int());
const optionalCsvInteger = z.union([z.literal("").transform(() => undefined), csvInteger]);
const confidence = csvNumber.pipe(z.number().min(0).max(1));
const scaleValue = csvInteger.pipe(
  z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
);
const centrality = csvInteger.pipe(z.union([z.literal(1), z.literal(2)]));
const annotationReviewReference = optionalText.pipe(
  z
    .string()
    .regex(/^reviews\/[a-z0-9]+(?:-[a-z0-9]+)*\.md$/u, {
      message: "Must reference a Markdown report under data/source/reviews",
    })
    .optional(),
);
const csvList = z.string().transform((value) =>
  value
    .split(";")
    .map((item) => item.trim())
    .filter((item) => item !== ""),
);

export const workSourceRowSchema = z
  .strictObject({
    id: catalogSourceId,
    title: requiredText,
    titleKana: optionalText,
    creators: csvList.pipe(z.array(requiredText).min(1)),
    publisher: optionalText,
    demographic: z.enum(DEMOGRAPHICS),
    status: z.enum(WORK_STATUSES),
    firstPublishedYear: optionalCsvInteger.pipe(z.number().int().min(1800).max(2200).optional()),
    genres: csvList.pipe(z.array(z.enum(GENRE_TAGS))),
    factorScope: z.literal("entry_1_3_volumes"),
    onboardingEligible: csvBoolean,
    recommendationEligible: csvBoolean,
    libraryOnly: csvBoolean,
    metadataConfidence: confidence,
    groupingConfidence: confidence,
    sourceAgreement: confidence,
    annotationReviewMethod: z.enum(["unreviewed", "human", "authorizedModelPanel"]),
    annotationReviewedAt: z.union([
      z.literal("").transform(() => undefined),
      z.iso.datetime({ offset: true }),
    ]),
    annotationReviewReference,
    evidenceId: catalogSourceId,
  })
  .superRefine((row, context) => {
    const isReviewed = row.annotationReviewMethod !== "unreviewed";
    if (isReviewed && row.annotationReviewedAt === undefined) {
      context.addIssue({
        code: "custom",
        path: ["annotationReviewedAt"],
        message: "A completed annotation review requires its timestamp",
      });
    }
    if (isReviewed && row.annotationReviewReference === undefined) {
      context.addIssue({
        code: "custom",
        path: ["annotationReviewReference"],
        message: "A completed annotation review requires its report reference",
      });
    }
    if (!isReviewed && row.annotationReviewedAt !== undefined) {
      context.addIssue({
        code: "custom",
        path: ["annotationReviewedAt"],
        message: "An unreviewed annotation cannot have a review timestamp",
      });
    }
    if (!isReviewed && row.annotationReviewReference !== undefined) {
      context.addIssue({
        code: "custom",
        path: ["annotationReviewReference"],
        message: "An unreviewed annotation cannot have a review report",
      });
    }
  });

export const aliasSourceRowSchema = z.strictObject({
  workId: catalogSourceId,
  alias: requiredText,
});

export const volumeSourceRowSchema = z.strictObject({
  id: catalogSourceId,
  workId: catalogSourceId,
  volumeNumber: optionalCsvInteger.pipe(z.number().int().positive().optional()),
  isbn: requiredText
    .transform(normalizeIsbn)
    .refine(isValidIsbn, { message: "ISBN checksum is invalid" }),
  releaseDate: z.union([z.literal("").transform(() => undefined), z.iso.date()]),
  editionKind: z.enum(EDITION_KINDS),
  isRepresentative: csvBoolean,
  evidenceId: catalogSourceId,
});

const factorCommon = {
  workId: catalogSourceId,
  axisId: z.enum(AXIS_IDS),
  evidenceId: catalogSourceId,
};

export const factorSourceRowSchema = z
  .discriminatedUnion("state", [
    z.strictObject({
      ...factorCommon,
      state: z.literal("known"),
      value: scaleValue,
      confidence,
    }),
    z.strictObject({
      ...factorCommon,
      state: z.literal("unknown"),
      value: z.literal(""),
      confidence: z.literal(""),
    }),
    z.strictObject({
      ...factorCommon,
      state: z.literal("notApplicable"),
      value: z.literal(""),
      confidence: z.literal(""),
    }),
  ])
  .superRefine((row, context) => {
    if (row.state === "notApplicable" && row.axisId !== "motionImpact") {
      context.addIssue({
        code: "custom",
        path: ["state"],
        message: "notApplicable is only defined for motionImpact in factor dictionary v1",
      });
    }
  });

export const themeSourceRowSchema = z.strictObject({
  workId: catalogSourceId,
  themeId: z.enum(THEME_TAGS),
  centrality,
  confidence,
  evidenceId: catalogSourceId,
});

export const recommendationContextSourceRowSchema = z
  .strictObject({
    workId: catalogSourceId,
    catalogRole: z.enum(["anchor", "bridge", "discovery"]),
    seriesGroupId: optionalText.pipe(catalogSourceId.optional()),
    volumeCount: csvInteger.pipe(z.number().int().nonnegative()),
    reviewAverage: z.union([
      z.literal("").transform(() => undefined),
      csvNumber.pipe(z.number().min(0).max(5)),
    ]),
    reviewCount: optionalCsvInteger.pipe(z.number().int().nonnegative().optional()),
  })
  .superRefine((row, context) => {
    if (row.reviewAverage === undefined && (row.reviewCount ?? 0) > 0) {
      context.addIssue({
        code: "custom",
        path: ["reviewAverage"],
        message: `Missing reviewAverage for reviewed work ${row.workId}`,
      });
    }
    if (row.reviewAverage !== undefined && (row.reviewCount ?? 0) === 0) {
      context.addIssue({
        code: "custom",
        path: ["reviewCount"],
        message: `reviewAverage requires a positive reviewCount for work ${row.workId}`,
      });
    }
  });

export const recommendationConfigSourceRowSchema = z.strictObject({
  catalogAverageRating: csvNumber.pipe(z.number().min(0).max(5)),
});

export const evidenceSourceRowSchema = z.strictObject({
  id: catalogSourceId,
  workId: catalogSourceId,
  targetType: z.enum(["work", "volume", "axis", "theme"]),
  targetId: requiredText,
  sourceType: z.enum(FACTOR_SOURCE_TYPES),
  sourceUrl: z.union([z.literal("").transform(() => undefined), z.url()]),
  fetchedAt: z.iso.datetime({ offset: true }),
  extractorVersion: optionalText,
  reviewedByHuman: csvBoolean,
  confidence,
  notes: requiredText,
});
