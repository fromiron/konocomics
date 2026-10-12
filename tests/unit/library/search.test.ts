import { describe, expect, it } from "vitest";

import catalogJson from "@/data/generated/catalog-v1.json";
import { catalogV1Schema } from "@/domain/catalog/schema";
import {
  catalogWorkForRakutenItem,
  createLibraryWorkSearch,
  libraryWorkSearchText,
  normalizeLibraryQuery,
} from "@/features/library/search";

const catalog = catalogV1Schema.parse(catalogJson);

describe("library search", () => {
  it("finds source-backed Japanese names without changing work identity or analysis eligibility", () => {
    const search = createLibraryWorkSearch(catalog.works);
    for (const [query, id] of [
      ["スラムダンク", "work-5aaa689fe80174423ad4"],
      ["すらむだんく", "work-5aaa689fe80174423ad4"],
      ["メジャー", "work-c1ab3f526b37a071a876"],
      ["銀魂", "work-527c45f3ae21c5b5ade3"],
      ["ハチミツとクローバー", "work-0bfd1cd17ce207473ec2"],
    ] as const) {
      expect(search.search(query)[0]?.id).toBe(id);
      expect(catalog.works.find((work) => work.id === id)?.eligibility.libraryOnly).toBe(true);
    }
  });
  it("searches the local catalog by normalized title and creator before any provider path", () => {
    const target = catalog.works.find((work) => work.titleKana !== undefined) ?? catalog.works[0]!;
    const search = createLibraryWorkSearch(catalog.works);

    expect(search.search(target.title)[0]?.id).toBe(target.id);
    expect(search.search(target.creators[0] ?? "").some((work) => work.id === target.id)).toBe(
      true,
    );
    expect(search.search("   ")).toEqual([]);
  });

  it("shares kana, width and alias normalization without fuzzy matching in saved lists", () => {
    const work = {
      ...catalog.works[0]!,
      title: "HUNTER×HUNTER",
      titleKana: "ハンターハンター",
      aliases: ["HxH"],
      creators: ["冨樫義博"],
    };
    const text = libraryWorkSearchText(work);
    for (const query of ["ハンター", "はんたー", "ﾊﾝﾀｰ", "ＨｘＨ", "冨樫"]) {
      expect(text.includes(normalizeLibraryQuery(query))).toBe(true);
      expect(createLibraryWorkSearch([work]).search(query)[0]?.id).toBe(work.id);
    }
    expect(text.includes(normalizeLibraryQuery("ハントー"))).toBe(false);
  });

  it("maps a Rakuten ISBN to the canonical Catalog Work and leaves a mismatch external", () => {
    const volume = catalog.volumes[0]!;
    expect(catalogWorkForRakutenItem(catalog, { isbn: volume.isbn })?.id).toBe(volume.workId);
    expect(catalogWorkForRakutenItem(catalog, { isbn: "9784101010014" })).toBeUndefined();
  });
  it("ranks normalized exact titles and aliases before prefix, substring and fuzzy matches", () => {
    const base = catalog.works[0]!;
    const works = [
      { ...base, id: "substring", title: "恋するワンピース", titleKana: undefined, aliases: [] },
      { ...base, id: "prefix", title: "ワンピース外伝", titleKana: undefined, aliases: [] },
      { ...base, id: "exact", title: "ONE PIECE", titleKana: "ワンピース", aliases: ["onepiece"] },
      { ...base, id: "fuzzy", title: "ワンピス", titleKana: undefined, aliases: [] },
    ];
    const search = createLibraryWorkSearch(works);
    expect(search.search("ワンピース").map((work) => work.id)).toEqual([
      "exact",
      "prefix",
      "substring",
      "fuzzy",
    ]);
    expect(search.search("ONE PIECE")[0]?.id).toBe("exact");
    expect(search.search("ｏｎｅ　ｐｉｅｃｅ")[0]?.id).toBe("exact");
  });

  it("keeps short title intent and creator spacing while bounding long queries", () => {
    const base = catalog.works[0]!;
    const works = [
      { ...base, id: "bleach", title: "BLEACH", titleKana: undefined, aliases: [] },
      { ...base, id: "blame", title: "BLAME!", titleKana: undefined, aliases: [] },
      {
        ...base,
        id: "capeta",
        title: "capeta",
        creators: ["藤本 タツキ"],
        titleKana: undefined,
        aliases: [],
      },
      { ...base, id: "long", title: "あ".repeat(100), titleKana: undefined, aliases: [] },
    ];
    const search = createLibraryWorkSearch(works);
    expect(
      search
        .search("BL")
        .slice(0, 2)
        .map((work) => work.id),
    ).toEqual(["bleach", "blame"]);
    for (const query of ["capeta", "ｃａｐｅｔａ", "藤本タツキ", "藤本 タツキ"])
      expect(search.search(query)[0]?.id).toBe("capeta");
    expect(search.search("あ".repeat(100))[0]?.id).toBe("long");
    for (const query of ["あ".repeat(101), "あ".repeat(220), "😀".repeat(51)])
      expect(search.search(query)).toEqual([]);
    expect(works[2]!.creators).toEqual(["藤本 タツキ"]);
  });
});
