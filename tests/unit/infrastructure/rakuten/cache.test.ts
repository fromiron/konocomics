import { describe, expect, it } from "vitest";

import { parseProviderCacheRecord } from "@/infrastructure/db/validation";
import {
  createProviderCacheRecord,
  inspectProviderCache,
  RAKUTEN_COMMERCIAL_TTL_MS,
  RAKUTEN_METADATA_TTL_MS,
  type RakutenBookItem,
} from "@/infrastructure/rakuten";

const ITEM: RakutenBookItem = {
  title: "20世紀少年 1",
  author: "浦沢直樹",
  publisherName: "小学館",
  isbn: "9784091855312",
  itemCaption: "世界の終わりが始まる。",
  salesDate: "2000年01月",
  itemPrice: 770,
  itemUrl: "https://books.rakuten.co.jp/rb/123/",
  imageUrl: "https://thumbnail.image.rakuten.co.jp/book.jpg?_ex=600x600",
  availability: 1,
  reviewAverage: 4.5,
  reviewCount: 12,
};
const FETCHED_AT = "2026-08-14T01:00:00.000Z";

describe("Rakuten provider cache", () => {
  it("joins client-owned work identity and injected time with split 24h/90d expiry", () => {
    const record = createProviderCacheRecord({
      workId: "20th-century-boys",
      item: ITEM,
      fetchedAt: FETCHED_AT,
    });

    expect(record).toEqual({
      workId: "20th-century-boys",
      provider: "rakuten",
      isbn: "9784091855312",
      imageUrl: "https://thumbnail.image.rakuten.co.jp/book.jpg?_ex=600x600",
      itemUrl: "https://books.rakuten.co.jp/rb/123/",
      affiliateUrl: undefined,
      chirayomiUrl: undefined,
      itemCaption: "世界の終わりが始まる。",
      itemPrice: 770,
      availability: 1,
      reviewAverage: 4.5,
      reviewCount: 12,
      fetchedAt: FETCHED_AT,
      commercialExpiresAt: "2026-08-15T01:00:00.000Z",
      metadataExpiresAt: "2026-11-12T01:00:00.000Z",
    });
    expect(Date.parse(record.commercialExpiresAt) - Date.parse(FETCHED_AT)).toBe(
      RAKUTEN_COMMERCIAL_TTL_MS,
    );
    expect(Date.parse(record.metadataExpiresAt) - Date.parse(FETCHED_AT)).toBe(
      RAKUTEN_METADATA_TTL_MS,
    );
    expect(parseProviderCacheRecord(record)).toEqual(record);
  });

  it("uses strict expiry boundaries and retains stale itemUrl while hiding commercial fields", () => {
    const record = createProviderCacheRecord({
      workId: "20th-century-boys",
      item: ITEM,
      fetchedAt: FETCHED_AT,
    });

    expect(inspectProviderCache(record, "2026-08-15T00:59:59.999Z")).toMatchObject({
      commercialFresh: true,
      metadataFresh: true,
      commercial: { itemPrice: 770, availability: 1 },
      metadata: {
        itemUrl: ITEM.itemUrl,
        itemCaption: ITEM.itemCaption,
      },
      fallbackItemUrl: ITEM.itemUrl,
    });
    const commercialExpired = inspectProviderCache(record, record.commercialExpiresAt);
    expect(commercialExpired).toMatchObject({ commercialFresh: false, metadataFresh: true });
    expect(commercialExpired.commercial).toBeNull();
    expect(commercialExpired.metadata?.itemCaption).toBe(ITEM.itemCaption);
    expect(commercialExpired.fallbackItemUrl).toBe(ITEM.itemUrl);

    const metadataExpired = inspectProviderCache(record, record.metadataExpiresAt);
    expect(metadataExpired).toMatchObject({
      commercialFresh: false,
      metadataFresh: false,
      commercial: null,
      metadata: null,
      fallbackItemUrl: ITEM.itemUrl,
    });
    expect(metadataExpired).not.toHaveProperty("itemCaption");
  });

  it("rejects non-ISO injection, invalid identity, and the legacy single expiry shape", () => {
    expect(() =>
      createProviderCacheRecord({ workId: "", item: ITEM, fetchedAt: FETCHED_AT }),
    ).toThrow();
    expect(() =>
      createProviderCacheRecord({
        workId: "20th-century-boys",
        item: ITEM,
        fetchedAt: "August 14, 2026",
      }),
    ).toThrow();
    expect(() =>
      parseProviderCacheRecord({
        workId: "legacy",
        provider: "rakuten",
        isbn: ITEM.isbn,
        fetchedAt: FETCHED_AT,
        expiresAt: "2026-08-15T01:00:00.000Z",
      }),
    ).toThrow();
  });
});
