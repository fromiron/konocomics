import { z } from "zod";

import { GENRE_TAGS, WORK_STATUSES } from "@/domain/catalog/constants";
import { isValidIsbn } from "@/domain/catalog/normalize";

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

export const landingProjectionSchema = z.strictObject({
  catalogVersion: z.string().trim().min(1),
  heroWorks: z.array(landingWorkSchema),
  editorialRankingWorks: z.array(landingWorkSchema),
});

export type LandingWork = z.infer<typeof landingWorkSchema>;
