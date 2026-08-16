import * as z from "zod/v4";

import { EXTERNAL_WORK_ID_V1_PATTERN, type ExternalWorkId } from "@/domain/catalog/external-work";
import { COVERAGE_GROUPS } from "@/domain/catalog/constants";
import { catalogIdSchema, genreTagSchema } from "@/domain/catalog/schema";

const optionalQuery = z
  .preprocess(
    (value) =>
      typeof value === "string" || typeof value === "number" || typeof value === "boolean"
        ? String(value)
        : value,
    z.string().trim().min(1).max(100),
  )
  .optional()
  .catch(undefined);
const legacyOne = z
  .preprocess((value) => (value === 1 ? "1" : value), z.literal("1").optional())
  .catch(undefined);
const optionalShelf = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[A-Za-z0-9][A-Za-z0-9_-]*$/u)
  .optional()
  .catch(undefined);

export const emptySearchSchema = z.object({});

export const landingSearchSchema = z.object({
  landing: legacyOne,
});

export const onboardingSearchSchema = z.object({
  q: optionalQuery,
  genre: genreTagSchema.optional().catch(undefined),
  shelf: optionalShelf,
});

export const tasteSearchSchema = z.object({
  mode: z.enum(["summary", "adjust"]).optional().catch(undefined),
  group: z.enum(COVERAGE_GROUPS).optional().catch(undefined),
  reveal: legacyOne,
});

export const recommendationsSearchSchema = z.object({
  preview: catalogIdSchema.optional().catch(undefined),
  genre: genreTagSchema.optional().catch(undefined),
  sort: z.literal("recommended").optional().catch(undefined),
  shelf: optionalShelf,
});

export const librarySearchSchema = z.object({
  state: z
    .enum(["planned", "reading", "completed", "dropped", "hidden"])
    .optional()
    .catch(undefined),
  q: optionalQuery,
  sort: z.enum(["updated", "title"]).optional().catch(undefined),
  view: z.enum(["list", "grid"]).optional().catch(undefined),
});

export const settingsSearchSchema = z.object({
  section: z.enum(["policies", "data", "app"]).optional().catch(undefined),
});

export const externalWorkSearchSchema = z.object({
  workId: z
    .custom<ExternalWorkId>(
      (value) => typeof value === "string" && EXTERNAL_WORK_ID_V1_PATTERN.test(value),
    )
    .optional()
    .catch(undefined),
});
