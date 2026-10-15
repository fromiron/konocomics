import { describe, expect, it } from "vitest";
import catalogJson from "@/data/generated/catalog-v1.json";
import contextJson from "@/data/generated/recommendation-context-v1.json";
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
  it("keeps verified series totals separate from the represented edition and preserves creator data", () => {
    for (const [id, count, edition] of [
      ["work-1ffb6ba18b9d7c2daeda", 16, 1],
      ["work-31b4dc55b32d1b29be08", 3, 2],
    ] as const) {
      const work = catalog.works.find((entry) => entry.id === id)!;
      expect(work.status).toBe("completed");
      expect(contextJson.constraintByWorkId[id].volumeCount).toBe(count);
      expect(
        catalog.volumes.find((entry) => entry.id === catalog.representativeVolumeByWorkId[id])
          ?.volumeNumber,
      ).toBe(edition);
    }
    expect(
      catalog.works.find((entry) => entry.id === "work-0153a125c5a56225b06c")?.creators,
    ).toContain("ヤマシタ トモコ");
    const conan = catalog.works.find((entry) => entry.id === "work-39555fe7402dada0d79f")!;
    const edition = catalog.volumes.find(
      (entry) => entry.id === catalog.representativeVolumeByWorkId[conan.id],
    );
    expect(resolveWorkBookMetadata(conan, edition, null).itemCaption).toContain("ホームズに憧れる");
  });

  it("rejects chapter lists without discarding a real fallback or prose", () => {
    const list = "FILE.1 平成のホームズ FILE.2 小さくなった名探偵 FILE.3 仲間はずれの名探偵";
    expect(resolveWorkBookMetadata(work, undefined, { itemCaption: list })).toMatchObject({
      itemCaption: undefined,
      captionRejected: true,
    });
    expect(resolveWorkBookMetadata(work, volume, { itemCaption: list })).toMatchObject({
      itemCaption: volume.metadata.itemCaption,
      captionSource: "publisher",
    });
    expect(
      resolveWorkBookMetadata(
        work,
        { ...volume, metadata: { ...volume.metadata, itemCaption: list } },
        { itemCaption: "出版社とは異なる有効な紹介。" },
      ),
    ).toMatchObject({
      itemCaption: "出版社とは異なる有効な紹介。",
      captionSource: "rakuten",
    });
    const prose = "第1話と第2話に登場する事件をめぐる物語。";
    expect(resolveWorkBookMetadata(work, undefined, { itemCaption: prose }).itemCaption).toBe(
      prose,
    );
  });

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
      authors: ["作者 A"],
      sharedAuthorsByWorkId: new Map([
        ["0", ["作者 A"]],
        ["b", ["作者 A"]],
        ["a", ["作者 A"]],
        ["c", ["作者 A"]],
      ]),
      featured: manyReviews,
      others: [libraryOnly, fewReviews, noReviews],
    });
    // Identical input gives an identical selection, independent of catalog order.
    expect(select([manyReviews, fewReviews, source, noReviews, libraryOnly])).toEqual(
      select([source, noReviews, libraryOnly, fewReviews, manyReviews]),
    );
    expect(select([source, libraryOnly])).toEqual({
      authors: ["作者 A"],
      sharedAuthorsByWorkId: new Map([["0", ["作者 A"]]]),
      featured: null,
      others: [libraryOnly],
    });
    expect(select([source])).toBeNull();
  });

  it.each([
    ["a-brides-story", "work-1fc61ddbeb429b4a2c15"],
    ["a-silent-voice", "work-0ede6921b81169dc2dda"],
  ])("connects real author spelling variants in both directions: %s / %s", (leftId, rightId) => {
    for (const [sourceId, targetId] of [
      [leftId, rightId],
      [rightId, leftId],
    ]) {
      const source = catalog.works.find((entry) => entry.id === sourceId)!;
      const target = catalog.works.find((entry) => entry.id === targetId)!;
      const selected = selectSameAuthorWorks(catalog, source, () => undefined);
      expect(selected).not.toBeNull();
      expect([selected?.featured, ...(selected?.others ?? [])]).toContain(target);
      expect(selected?.sharedAuthorsByWorkId.get(targetId!)).toEqual(source.creators);
    }
  });

  it("preserves each coauthor connection once, using source names and deterministic candidate order", () => {
    const source = {
      ...work,
      id: "source",
      creators: ["作者 A", "作者Ａ", "作者B", "候補なし", " "],
    };
    const onlyA = { ...source, id: "a", creators: ["作者\u3000Ａ"] };
    const onlyB = { ...source, id: "b", creators: ["作者 B"] };
    const both = { ...source, id: "c", creators: ["作者B", "作者A", "作者 Ａ"] };
    const unrelated = { ...source, id: "d", creators: ["作者C"] };
    const blankAuthor = { ...source, id: "e", creators: ["\u3000"] };
    const works = [source, both, onlyB, unrelated, onlyA, blankAuthor];
    const select = (entries: typeof works) =>
      selectSameAuthorWorks({ ...catalog, works: entries }, source, () => 10);
    const selected = select(works);

    expect(selected).toEqual({
      authors: ["作者 A", "作者B"],
      sharedAuthorsByWorkId: new Map([
        ["a", ["作者 A"]],
        ["b", ["作者B"]],
        ["c", ["作者 A", "作者B"]],
      ]),
      featured: onlyA,
      others: [onlyB, both],
    });
    expect(select([...works].reverse())).toEqual(selected);
  });

  it.each([
    ["dr-stone", "work-f4ae52fca1e80f395a62", "稲垣理一郎"],
    ["pluto", "work-16eae11fad7ae466efec", "手塚治虫"],
  ])("keeps the real shared author for %s coauthor works", (sourceId, targetId, sharedAuthor) => {
    const source = catalog.works.find((entry) => entry.id === sourceId)!;
    const target = catalog.works.find((entry) => entry.id === targetId)!;
    const selected = selectSameAuthorWorks(catalog, source, () => undefined);

    expect([selected?.featured, ...(selected?.others ?? [])]).toContain(target);
    expect(selected?.authors).toContain(sharedAuthor);
    expect(selected?.sharedAuthorsByWorkId.get(targetId)).toEqual([sharedAuthor]);
  });

  it("allows library-only sources and candidates without inventing an eligible featured work", () => {
    const source = {
      ...work,
      id: "source",
      creators: ["作者 A"],
      eligibility: { onboardingEligible: false, recommendationEligible: false, libraryOnly: true },
    };
    const candidate = { ...source, id: "candidate", creators: ["作者Ａ"] };
    const selected = selectSameAuthorWorks(
      { ...catalog, works: [source, candidate] },
      source,
      () => undefined,
    );

    expect(selected).toEqual({
      authors: ["作者 A"],
      sharedAuthorsByWorkId: new Map([[candidate.id, ["作者 A"]]]),
      featured: null,
      others: [candidate],
    });
  });
});
