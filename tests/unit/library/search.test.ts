import { describe, expect, it } from "vitest";

import catalogJson from "@/data/generated/catalog-v1.json";
import { catalogV1Schema } from "@/domain/catalog/schema";
import { catalogWorkForRakutenItem, createLibraryWorkSearch } from "@/features/library/search";

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

  it("maps a Rakuten ISBN to the canonical Catalog Work and leaves a mismatch external", () => {
    const volume = catalog.volumes[0]!;
    expect(catalogWorkForRakutenItem(catalog, { isbn: volume.isbn })?.id).toBe(volume.workId);
    expect(catalogWorkForRakutenItem(catalog, { isbn: "9784101010014" })).toBeUndefined();
  });
});
