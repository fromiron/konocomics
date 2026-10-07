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
});
