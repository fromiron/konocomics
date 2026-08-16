import * as z from "zod/v4";

import { isValidIsbn, normalizeIsbn } from "@/domain/catalog/normalize";

const httpsUrlSchema = z.url().refine((value) => new URL(value).protocol === "https:", {
  message: "Rakuten URLs must use HTTPS",
});

export const rakutenIsbnSchema = z
  .string()
  .transform(normalizeIsbn)
  .pipe(
    z
      .string()
      .regex(/^(?:\d{13}|\d{9}[\dX])$/u)
      .refine(isValidIsbn, { message: "ISBN checksum is invalid" }),
  );

export const rakutenAvailabilitySchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
]);

export type RakutenAvailability = z.infer<typeof rakutenAvailabilitySchema>;

export const rakutenBookItemSchema = z.strictObject({
  title: z.string().trim().min(1),
  author: z.string().trim().min(1),
  publisherName: z.string().trim().min(1),
  isbn: rakutenIsbnSchema,
  itemCaption: z.string().trim().min(1).optional(),
  salesDate: z.string().trim().min(1).optional(),
  itemPrice: z.number().int().nonnegative(),
  itemUrl: httpsUrlSchema,
  affiliateUrl: httpsUrlSchema.optional(),
  imageUrl: httpsUrlSchema.optional(),
  chirayomiUrl: httpsUrlSchema.optional(),
  availability: rakutenAvailabilitySchema,
  reviewAverage: z.number().finite().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
});

export type RakutenBookItem = z.infer<typeof rakutenBookItemSchema>;

export const rakutenSearchResponseSchema = z.strictObject({
  items: z.array(rakutenBookItemSchema),
});

export const rakutenItemResponseSchema = z.strictObject({
  listing: rakutenBookItemSchema,
});

export const rakutenErrorResponseSchema = z.strictObject({
  error: z.enum(["invalid_request", "provider_unavailable"]),
});

export const rakutenTitleQuerySchema = z.string().trim().min(1).max(100);
