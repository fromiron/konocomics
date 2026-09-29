import { z } from "zod";

import { AXIS_IDS, GENRE_TAGS, WORK_STATUSES } from "@/domain/catalog/constants";
import { isValidIsbn } from "@/domain/catalog/normalize";
import { groupContributionSchema } from "@/infrastructure/db/validation";

export const landingWorkSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9]+(?:[a-z0-9-]*[a-z0-9])?$/u),
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

/** An example computed at build time from a fixed sample profile with the real engine. */
export const landingSampleSchema = z.strictObject({
  anchorWorks: z.array(landingWorkSchema).min(1),
  recommendation: z.strictObject({
    work: landingWorkSchema,
    confidenceLevel: z.enum(["high", "normal", "low"]),
    contributions: z.array(groupContributionSchema),
  }),
  axes: z.array(
    z.strictObject({
      axisId: z.enum(AXIS_IDS),
      value: z.number().min(0).max(4),
    }),
  ),
});

export const landingProjectionSchema = z.strictObject({
  catalogVersion: z.string().trim().min(1),
  recommendableWorkCount: z.number().int().nonnegative(),
  editorialRankingWorks: z.array(landingWorkSchema),
  discoveryWorks: z.array(landingWorkSchema),
  sample: landingSampleSchema,
});

export type LandingWork = z.infer<typeof landingWorkSchema>;
export type LandingSample = z.infer<typeof landingSampleSchema>;
