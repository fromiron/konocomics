// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AXIS_IDS } from "@/domain/catalog/constants";
import { HomeAxisWheel } from "@/features/landing/home-axis-wheel";
import { glyphScatter, HomeScrambleHeading } from "@/features/landing/home-scramble-heading";
import type { LandingSample } from "@/features/landing/landing-types";
import { parseScrollRange, rangeProgress } from "@/features/landing/use-home-scroll-fallback";
import { explanationLexicon, landingStrings } from "@/lib/strings";

afterEach(cleanup);

describe("HomeScrambleHeading", () => {
  it("scatters the same way on every load, within the screen", () => {
    const first = glyphScatter(16);
    expect(glyphScatter(16)).toEqual(first);
    for (const glyph of first) {
      expect(Math.abs(glyph.x)).toBeLessThanOrEqual(42);
      expect(Math.abs(glyph.y)).toBeLessThanOrEqual(38);
      expect(Math.abs(glyph.turn)).toBeLessThanOrEqual(110);
    }
  });

  it("names the heading with the whole sentence and hides the glyphs", () => {
    render(<HomeScrambleHeading id="scramble" />);
    const heading = screen.getByRole("heading", { level: 2, name: landingStrings.how.title });
    const glyphs = heading.querySelectorAll(".home-scramble__glyph");
    expect(glyphs).toHaveLength([...landingStrings.how.titlePhrases.join("")].length);
    expect(heading.querySelectorAll("[data-accent]")).toHaveLength(
      [...landingStrings.how.titleAccent].length,
    );
    for (const phrase of heading.querySelectorAll(".home-scramble__phrase")) {
      expect(phrase.getAttribute("aria-hidden")).toBe("true");
    }
  });
});

describe("HomeAxisWheel", () => {
  const sample = {
    axes: [
      { axisId: "mysteryReveal", value: 3.8 },
      { axisId: "darkness", value: 3.4 },
    ],
  } as unknown as LandingSample;

  it("lists every Manga DNA axis by name and marks the sample's strong ones", () => {
    render(<HomeAxisWheel sample={sample} />);
    expect(
      screen.getByRole("heading", { level: 2, name: landingStrings.wheel.title(AXIS_IDS.length) }),
    ).toBeTruthy();
    const axes = screen.getByRole("list", { name: landingStrings.wheel.axesLabel });
    const items = within(axes).getAllByRole("listitem");
    expect(items.map((item) => item.getAttribute("aria-label"))).toEqual(
      AXIS_IDS.map((axisId) => explanationLexicon.factorLabels[axisId]),
    );
    expect(
      items
        .filter((item) => item.hasAttribute("data-highlight"))
        .map((item) => item.getAttribute("aria-label")),
    ).toEqual([
      explanationLexicon.factorLabels.mysteryReveal,
      explanationLexicon.factorLabels.darkness,
    ]);
  });

  it("keeps labels on the left half upright by flipping and reversing their glyphs", () => {
    render(<HomeAxisWheel sample={sample} />);
    const spokes = document.querySelectorAll<HTMLElement>(".home-wheel__spoke");
    for (const spoke of spokes) {
      const angle = Number.parseFloat(spoke.style.getPropertyValue("--spoke-angle"));
      const normalized = ((angle % 360) + 360) % 360;
      const glyphs = [...spoke.querySelectorAll<HTMLElement>(".home-wheel__glyph")];
      const flips = glyphs.map((glyph) => glyph.style.getPropertyValue("--glyph-flip"));
      const leftHalf = normalized > 90 && normalized < 270;
      expect(new Set(flips)).toEqual(new Set([leftHalf ? "1" : "0"]));
      expect(glyphs[0]?.style.getPropertyValue("--glyph-slot")).toBe(
        String(leftHalf ? glyphs.length - 1 : 0),
      );
    }
  });
});

describe("scroll timeline fallback ranges", () => {
  it("reads two-point ranges and rejects anything else", () => {
    expect(parseScrollRange(" entry 45% contain 62% ")).toEqual([
      { name: "entry", fraction: 0.45 },
      { name: "contain", fraction: 0.62 },
    ]);
    expect(parseScrollRange("")).toBeNull();
    expect(parseScrollRange("cover 0%")).toBeNull();
    expect(parseScrollRange("cover calc(18% + 6%) cover 40%")).toBeNull();
  });

  it("places range points as view timelines do for short and tall subjects", () => {
    const cover = parseScrollRange("cover 0% cover 100%")!;
    // A 900px spacer in an 824px visible area is covered over 1724px of scrolling.
    expect(rangeProgress(cover, 862, 900, 824)).toBeCloseTo(0.5);
    // The hero sheet (687px) leaves between exit 12% and exit 100%: 906.44px to 1511px.
    const exit = parseScrollRange("exit 12% exit 100%")!;
    expect(rangeProgress(exit, 906.44, 687, 824)).toBeCloseTo(0);
    expect(rangeProgress(exit, 1208.72, 687, 824)).toBeCloseTo(0.5);
    // A section taller than the view is entered over one view height, then contained.
    const tall = parseScrollRange("entry 50% contain 50%")!;
    expect(rangeProgress(tall, 400, 2000, 800)).toBeCloseTo(0);
    expect(rangeProgress(tall, 1400, 2000, 800)).toBeCloseTo(1);
    expect(rangeProgress(tall, -50, 2000, 800)).toBe(0);
    expect(rangeProgress(tall, 5000, 2000, 800)).toBe(1);
  });
});
