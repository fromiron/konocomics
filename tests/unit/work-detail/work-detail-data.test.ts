import { describe, expect, it } from "vitest";
import catalogJson from "@/data/generated/catalog-v1.json";
import { catalogV1Schema } from "@/domain/catalog/schema";
import {
  resolveWorkBookMetadata,
  selectSameAuthorWorks,
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
  it("prefers the stored publisher caption and keeps fresh Rakuten fields for other metadata", () => {
    expect(
      resolveWorkBookMetadata(work, volume, {
        itemCaption: " APIの紹介 ",
        publisherName: "API出版社",
        salesDate: "2003年08月08日頃",
        imageUrl: "https://example.com/api.jpg",
        itemUrl: "https://books.rakuten.co.jp/rb/1/",
      }),
    ).toMatchObject({
      itemCaption: "収集した紹介",
      captionSource: "publisher",
      captionSourceUrl: volume.metadata.sourceUrl,
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

  it("falls back to the nonblank Rakuten caption only when the publisher caption is absent", () => {
    const provider = {
      itemCaption: " APIの紹介 ",
      itemUrl: "https://books.rakuten.co.jp/rb/1/",
    };
    expect(
      resolveWorkBookMetadata(
        work,
        { ...volume, metadata: { ...volume.metadata, itemCaption: "  " } },
        provider,
      ),
    ).toMatchObject({
      itemCaption: "APIの紹介",
      captionSource: "rakuten",
      captionSourceUrl: provider.itemUrl,
    });
    expect(resolveWorkBookMetadata(work, undefined, provider)).toMatchObject({
      itemCaption: "APIの紹介",
      captionSource: "rakuten",
      captionSourceUrl: provider.itemUrl,
    });
    expect(
      resolveWorkBookMetadata(
        work,
        { ...volume, metadata: { ...volume.metadata, itemCaption: "  " } },
        { ...provider, itemCaption: "\n " },
      ).itemCaption,
    ).toBeUndefined();
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

  it("features the most-reviewed eligible same-author work and lists the rest deterministically", () => {
    const source = {
      ...work,
      id: "source",
      creators: ["作者 A"],
      eligibility: { onboardingEligible: false, recommendationEligible: true, libraryOnly: false },
    };
    const fewReviews = { ...source, id: "a", creators: ["作者 Ａ"] };
    const manyReviews = { ...source, id: "b" };
    const noReviews = { ...source, id: "c" };
    const libraryOnly = {
      ...source,
      id: "0",
      eligibility: { ...source.eligibility, recommendationEligible: false, libraryOnly: true },
    };
    const otherAuthor = { ...source, id: "d", creators: ["作者 B"] };
    const reviews: Record<string, number> = { a: 3, b: 40, 0: 99 };
    const select = (works: (typeof source)[]) =>
      selectSameAuthorWorks({ ...catalog, works }, source, (workId) => reviews[workId]);

    expect(select([source, noReviews, libraryOnly, fewReviews, manyReviews, otherAuthor])).toEqual({
      author: "作者 A",
      featured: manyReviews,
      others: [libraryOnly, fewReviews, noReviews],
    });
    // Identical input gives an identical selection, independent of catalog order.
    expect(select([manyReviews, fewReviews, source, noReviews, libraryOnly])).toEqual(
      select([source, noReviews, libraryOnly, fewReviews, manyReviews]),
    );
    expect(select([source, libraryOnly])).toEqual({
      author: "作者 A",
      featured: null,
      others: [libraryOnly],
    });
    expect(select([source])).toBeNull();
    expect(selectSameAuthorWorks(catalog, libraryOnly, () => undefined)).toBeNull();
  });
});
