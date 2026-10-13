import { describe, expect, it } from "vitest";

import { confirmedSeriesVolumeCounts } from "@/domain/catalog/series";

const catalog = {
  volumes: [
    { id: "a-1", workId: "a", volumeNumber: 1, isbn: "", editionKind: "standard" },
    { id: "b-1", workId: "b", volumeNumber: 1, isbn: "", editionKind: "standard" },
    { id: "c-3", workId: "c", volumeNumber: 3, isbn: "", editionKind: "standard" },
  ],
} as unknown as Parameters<typeof confirmedSeriesVolumeCounts>[0];

describe("confirmedSeriesVolumeCounts", () => {
  it("keeps only counts beyond what the Catalog's own volumes already imply", () => {
    const recorded: Record<string, number> = { a: 1, b: 23, c: 3, d: 0 };
    const counts = confirmedSeriesVolumeCounts(catalog, (workId) => recorded[workId], [
      "a",
      "b",
      "c",
      "d",
      "missing",
    ]);

    // An authoring fallback of the highest Catalog volume is not a series length.
    expect(counts.get("a")).toBe(0);
    expect(counts.get("c")).toBe(0);
    expect(counts.get("b")).toBe(23);
    expect(counts.get("d")).toBe(0);
    expect(counts.get("missing")).toBe(0);
  });
});
