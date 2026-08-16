import type { ProviderCacheRecord } from "@/infrastructure/db/records";
import * as z from "zod/v4";

import { rakutenBookItemSchema, type RakutenBookItem } from "./schema";

export const RAKUTEN_COMMERCIAL_TTL_MS = 24 * 60 * 60 * 1_000;
// The product contract defines three months as a deterministic 90-day TTL.
export const RAKUTEN_METADATA_TTL_MS = 90 * 24 * 60 * 60 * 1_000;

type CreateProviderCacheRecordInput = Readonly<{
  workId: string;
  item: RakutenBookItem;
  fetchedAt: string;
}>;

export type ProviderCacheState = Readonly<{
  commercialFresh: boolean;
  metadataFresh: boolean;
  commercial: Readonly<{
    itemPrice?: number;
    availability?: ProviderCacheRecord["availability"];
  }> | null;
  metadata: Readonly<{
    imageUrl?: string;
    itemUrl?: string;
    affiliateUrl?: string;
    chirayomiUrl?: string;
    itemCaption?: string;
    reviewAverage?: number;
    reviewCount?: number;
  }> | null;
  fallbackItemUrl?: string;
}>;

function expiryFrom(fetchedAt: string, ttl: number): string {
  const timestamp = Date.parse(z.iso.datetime({ offset: true }).parse(fetchedAt));
  return new Date(timestamp + ttl).toISOString();
}

export function createProviderCacheRecord({
  workId,
  item,
  fetchedAt,
}: CreateProviderCacheRecordInput): ProviderCacheRecord {
  const parsedItem = rakutenBookItemSchema.parse(item);
  const parsedWorkId = z.string().min(1).parse(workId);
  const parsedFetchedAt = z.iso.datetime({ offset: true }).parse(fetchedAt);
  const record: ProviderCacheRecord = {
    workId: parsedWorkId,
    provider: "rakuten",
    isbn: parsedItem.isbn,
    imageUrl: parsedItem.imageUrl,
    itemUrl: parsedItem.itemUrl,
    affiliateUrl: parsedItem.affiliateUrl,
    chirayomiUrl: parsedItem.chirayomiUrl,
    itemCaption: parsedItem.itemCaption,
    itemPrice: parsedItem.itemPrice,
    availability: parsedItem.availability,
    reviewAverage: parsedItem.reviewAverage,
    reviewCount: parsedItem.reviewCount,
    fetchedAt: parsedFetchedAt,
    commercialExpiresAt: expiryFrom(parsedFetchedAt, RAKUTEN_COMMERCIAL_TTL_MS),
    metadataExpiresAt: expiryFrom(parsedFetchedAt, RAKUTEN_METADATA_TTL_MS),
  };
  return record;
}

export function inspectProviderCache(record: ProviderCacheRecord, now: string): ProviderCacheState {
  const nowTimestamp = Date.parse(z.iso.datetime({ offset: true }).parse(now));
  const commercialFresh = nowTimestamp < Date.parse(record.commercialExpiresAt);
  const metadataFresh = nowTimestamp < Date.parse(record.metadataExpiresAt);
  return {
    commercialFresh,
    metadataFresh,
    commercial: commercialFresh
      ? { itemPrice: record.itemPrice, availability: record.availability }
      : null,
    metadata: metadataFresh
      ? {
          imageUrl: record.imageUrl,
          itemUrl: record.itemUrl,
          affiliateUrl: record.affiliateUrl,
          chirayomiUrl: record.chirayomiUrl,
          itemCaption: record.itemCaption,
          reviewAverage: record.reviewAverage,
          reviewCount: record.reviewCount,
        }
      : null,
    fallbackItemUrl: record.itemUrl,
  };
}
