import { z } from "zod";

import { LANDING_LENS_MIN_ITEMS } from "@/data/landing-showcase";
import { AXIS_IDS, GENRE_TAGS, THEME_TAGS, WORK_STATUSES } from "@/domain/catalog/constants";
import { isValidIsbn } from "@/domain/catalog/normalize";
import { groupContributionSchema } from "@/infrastructure/db/validation";

const workIdSchema = z.string().regex(/^[a-z0-9]+(?:[a-z0-9-]*[a-z0-9])?$/u);

export const landingWorkSchema = z.strictObject({
  id: workIdSchema,
  title: z.string().trim().min(1),
  creators: z.array(z.string().trim().min(1)).min(1),
  genres: z.array(z.enum(GENRE_TAGS)),
  status: z.enum(WORK_STATUSES),
  isbn: z
    .string()
    .regex(/^(?:\d{13}|\d{9}[\dX])$/u)
    .refine(isValidIsbn)
    .optional(),
});

/**
 * One recommendation for the sample profile, as the engine returned it. `preferredFactorId` is the
 * lead the build chose across the shown cards (as the recommendations page varies its leads), so
 * the home renders that same lead from `contributions`.
 */
export const landingRecommendationSchema = z.strictObject({
  work: landingWorkSchema,
  confidenceLevel: z.enum(["high", "normal", "low"]),
  contributions: z.array(groupContributionSchema),
  preferredFactorId: z.enum([...AXIS_IDS, ...GENRE_TAGS, ...THEME_TAGS]),
});

/** Examples computed at build time from a fixed sample profile with the real engine. */
export const landingSampleSchema = z.strictObject({
  anchorWorks: z.array(landingWorkSchema).min(1),
  /** The sample's best recommendations (`LANDING_STAGE_COUNT`), in engine order. */
  stage: z.tuple([
    landingRecommendationSchema,
    landingRecommendationSchema,
    landingRecommendationSchema,
  ]),
  /** One liked-work lens: the following recommendations whose lead reason names the anchor. */
  lens: z.strictObject({
    anchorWorkId: workIdSchema,
    items: z
      .array(
        landingRecommendationSchema.extend({
          /** The publisher synopsis the bundled Catalog already carries, when it has one. */
          caption: z.string().trim().min(1).optional(),
        }),
      )
      .min(LANDING_LENS_MIN_ITEMS),
  }),
});

export const landingProjectionSchema = z.strictObject({
  catalogVersion: z.string().trim().min(1),
  recommendableWorkCount: z.number().int().nonnegative(),
  editorialRankingWorks: z.array(landingWorkSchema),
  sample: landingSampleSchema,
});

export type LandingWork = z.infer<typeof landingWorkSchema>;
export type LandingRecommendation = z.infer<typeof landingRecommendationSchema>;
export type LandingSample = z.infer<typeof landingSampleSchema>;
