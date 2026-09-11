import { describe, expect, it } from "vitest";
import catalogJson from "@/data/generated/catalog-v1.json";
import { catalogV1Schema } from "@/domain/catalog/schema";
import {
  resolveWorkBookMetadata,
  selectSameAuthorWork,
} from "@/features/work-detail/work-detail-data";

const catalog = catalogV1Schema.parse(catalogJson);
const work = catalog.works[0]!;
const volume = {
  ...catalog.volumes.find((entry) => entry.workId === work.id)!,
  metadata: {
    itemCaption: "収集した紹介",
    publisherName: "収集出版社",
    salesDate: "2003-08-06",
    imageUrl: "https://example.com/cover.jpg",
    pageCount: 208,
    sourceUrl: "https://example.com/book",
    fetchedAt: "2026-09-11T07:43:01.523Z",
  },
};

describe("work book information", () => {
  it("chooses each nonblank Rakuten field before collected information and preserves its citation", () => {
    expect(
      resolveWorkBookMetadata(work, volume, {
        itemCaption: " APIの紹介 ",
        publisherName: "API出版社",
        salesDate: "2003年08月08日頃",
        imageUrl: "https://example.com/api.jpg",
        itemUrl: "https://books.rakuten.co.jp/rb/1/",
      }),
    ).toMatchObject({
      itemCaption: "APIの紹介",
      captionSource: "rakuten",
      captionSourceUrl: "https://books.rakuten.co.jp/rb/1/",
      publisherName: "API出版社",
      salesDate: "2003年08月08日頃",
      imageUrl: "https://example.com/api.jpg",
      pageCount: 208,
    });
    expect(
      resolveWorkBookMetadata(work, volume, { itemCaption: "  ", publisherName: "API出版社" }),
    ).toMatchObject({
      itemCaption: "収集した紹介",
      captionSource: "publisher",
      captionSourceUrl: volume.metadata.sourceUrl,
      publisherName: "API出版社",
      salesDate: "2003-08-06",
      imageUrl: volume.metadata.imageUrl,
    });
  });

  it("uses collected data without a fresh provider and excludes a volume bound to another work", () => {
    expect(resolveWorkBookMetadata(work, volume, null).itemCaption).toBe("収集した紹介");
    expect(
      resolveWorkBookMetadata(work, { ...volume, workId: "different-work" }, null),
    ).toMatchObject({
      itemCaption: undefined,
      salesDate: undefined,
      imageUrl: undefined,
      pageCount: undefined,
      publisherName: work.publisher,
    });
    expect(resolveWorkBookMetadata(work, undefined, null).itemCaption).toBeUndefined();
  });

  it("selects a real eligible same-author work consistently and omits an empty banner", () => {
    const source = {
      ...work,
      id: "source",
      creators: ["作者 A"],
      eligibility: { onboardingEligible: false, recommendationEligible: true, libraryOnly: false },
    };
    const first = { ...source, id: "a", creators: ["作者 Ａ"] };
    const second = { ...source, id: "b" };
    const excluded = {
      ...source,
      id: "0",
      eligibility: { ...source.eligibility, recommendationEligible: false, libraryOnly: true },
    };
    expect(
      selectSameAuthorWork({ ...catalog, works: [source, second, excluded, first] }, source),
    ).toEqual({ work: first, author: "作者 A" });
    expect(selectSameAuthorWork({ ...catalog, works: [source] }, source)).toBeNull();
    expect(selectSameAuthorWork(catalog, excluded)).toBeNull();
  });
});
