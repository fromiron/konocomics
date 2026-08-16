import { z } from "zod";

import { rewriteRakutenImageUrl } from "./image";
import { rakutenBookItemSchema, type RakutenBookItem } from "./schema";

export const RAKUTEN_BOOKS_ENDPOINT =
  "https://openapi.rakuten.co.jp/services/api/BooksBook/Search/20170404";
export const RAKUTEN_TIMEOUT_MS = 5_000;
export const RAKUTEN_CDN_CACHE_CONTROL = "public, s-maxage=86400, stale-while-revalidate=604800";

export type RakutenCredentials = Readonly<{
  applicationId: string;
  accessKey: string;
  affiliateId?: string;
}>;

type RakutenEnvironment = Readonly<Record<string, string | undefined>>;

const credentialsSchema = z.strictObject({
  applicationId: z.string().trim().min(1),
  accessKey: z.string().trim().min(1),
  affiliateId: z.string().trim().min(1).optional(),
});

export type RakutenBooksQuery =
  Readonly<{ kind: "search"; title: string }> | Readonly<{ kind: "item"; isbn: string }>;

const optionalTextSchema = z.string().transform((value) => {
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
});

const optionalHttpsUrlSchema = z.string().transform((value, context) => {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return undefined;
  }
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") {
      throw new Error("URL must use HTTPS");
    }
    return trimmed;
  } catch {
    context.addIssue({ code: "custom", message: "Expected a valid HTTPS URL" });
    return z.NEVER;
  }
});

const upstreamRakutenBookSchema = z.object({
  title: z.string(),
  author: z.string(),
  publisherName: z.string(),
  isbn: z.string(),
  itemCaption: optionalTextSchema.optional(),
  salesDate: optionalTextSchema.optional(),
  itemPrice: z.number(),
  itemUrl: z.string(),
  affiliateUrl: optionalHttpsUrlSchema.optional(),
  largeImageUrl: optionalHttpsUrlSchema.optional(),
  chirayomiUrl: optionalHttpsUrlSchema.optional(),
  availability: z.number(),
  reviewAverage: z.number(),
  reviewCount: z.number(),
});

const upstreamRakutenResponseSchema = z.object({
  items: z.array(upstreamRakutenBookSchema),
});

const RAKUTEN_RESPONSE_ELEMENTS = [
  "title",
  "author",
  "publisherName",
  "isbn",
  "itemCaption",
  "salesDate",
  "itemPrice",
  "itemUrl",
  "affiliateUrl",
  "largeImageUrl",
  "chirayomiUrl",
  "availability",
  "reviewAverage",
  "reviewCount",
].join(",");

export function readRakutenCredentials(
  environment: RakutenEnvironment = process.env,
): RakutenCredentials | null {
  const affiliateId = environment.RAKUTEN_AFFILIATE_ID?.trim();
  const parsed = credentialsSchema.safeParse({
    applicationId: environment.RAKUTEN_APPLICATION_ID,
    accessKey: environment.RAKUTEN_ACCESS_KEY,
    affiliateId: affiliateId === "" ? undefined : affiliateId,
  });
  return parsed.success ? parsed.data : null;
}

function buildRakutenUrl(query: RakutenBooksQuery, credentials: RakutenCredentials): URL {
  const url = new URL(RAKUTEN_BOOKS_ENDPOINT);
  url.searchParams.set("applicationId", credentials.applicationId);
  url.searchParams.set("format", "json");
  url.searchParams.set("formatVersion", "2");
  url.searchParams.set("elements", RAKUTEN_RESPONSE_ELEMENTS);
  if (credentials.affiliateId !== undefined) {
    url.searchParams.set("affiliateId", credentials.affiliateId);
  }
  if (query.kind === "search") {
    url.searchParams.set("title", query.title);
  } else {
    url.searchParams.set("isbn", query.isbn);
  }
  return url;
}

function minimizeRakutenBook(value: z.infer<typeof upstreamRakutenBookSchema>): RakutenBookItem {
  return rakutenBookItemSchema.parse({
    title: value.title,
    author: value.author,
    publisherName: value.publisherName,
    isbn: value.isbn,
    itemCaption: value.itemCaption,
    salesDate: value.salesDate,
    itemPrice: value.itemPrice,
    itemUrl: value.itemUrl,
    affiliateUrl: value.affiliateUrl,
    imageUrl:
      value.largeImageUrl === undefined
        ? undefined
        : rewriteRakutenImageUrl(value.largeImageUrl, 600),
    chirayomiUrl: value.chirayomiUrl,
    availability: value.availability,
    reviewAverage: value.reviewAverage,
    reviewCount: value.reviewCount,
  });
}

export async function fetchRakutenBooks(
  query: RakutenBooksQuery,
  credentials: RakutenCredentials,
): Promise<RakutenBookItem[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RAKUTEN_TIMEOUT_MS);
  try {
    const response = await fetch(buildRakutenUrl(query, credentials), {
      cache: "no-store",
      headers: { Accept: "application/json", accessKey: credentials.accessKey },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Rakuten responded with ${String(response.status)}`);
    }
    const payload: unknown = await response.json();
    return upstreamRakutenResponseSchema.parse(payload).items.map(minimizeRakutenBook);
  } finally {
    clearTimeout(timeout);
  }
}
