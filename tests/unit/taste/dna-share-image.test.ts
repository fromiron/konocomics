import { describe, expect, it } from "vitest";

import { fitChips, wrapText } from "@/features/taste/dna-share-image";

describe("Manga DNA card layout helpers", () => {
  it("fits whole chips over the allowed rows and keeps room for the trailing count chip", () => {
    const widths = [300, 300, 300, 300, 300];

    expect(fitChips(widths, 950, 10, 2, 0)).toBe(5);
    expect(fitChips(widths, 950, 10, 1, 0)).toBe(3);
    // Reserving a 200px 「ほか N作品」 chip on the last row gives up one title there.
    expect(fitChips(widths, 950, 10, 1, 200)).toBe(2);
  });

  it("never leaves a Japanese closing mark at the start of a line", () => {
    const measure = (value: string) => [...value].length * 10;

    const lines = wrapText(measure, "あいうえお。かきくけ", 50, 3);

    expect(lines.every((line) => !line.startsWith("。"))).toBe(true);
    expect(lines.join("")).toBe("あいうえお。かきくけ");
  });
});
