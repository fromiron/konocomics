// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AXIS_IDS, ART_AXIS_IDS } from "@/domain/catalog/constants";
import type { AxisId } from "@/domain/catalog/types";
import type { MangaDnaSummary } from "@/domain/profile/dna-summary";
import { ShareButton } from "@/features/work-detail/share-button";
import { WorkTraits } from "@/features/work-detail/work-traits";
import { explanationLexicon, tasteStrings, workDetailStrings } from "@/lib/strings";
import { createTestAxes, createTestWork } from "../../helpers/catalog";

const strings = workDetailStrings.traits;

function tasteAxes(values: Partial<Record<AxisId, number>>): MangaDnaSummary["axes"] {
  return AXIS_IDS.map((factorId) => ({
    factorId,
    state: values[factorId] === undefined ? "unknown" : "known",
    value: values[factorId] ?? null,
    anchorWorkIds: [],
  }));
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("WorkTraits", () => {
  it("draws confirmed axes and omits unknown values and groups without confirmed data", () => {
    const work = createTestWork({
      axes: createTestAxes({
        pacing: { state: "known", value: 4, confidence: 0.9 },
        darkness: { state: "unknown" },
        ...Object.fromEntries(ART_AXIS_IDS.map((id) => [id, { state: "unknown" }])),
        motionImpact: { state: "notApplicable" },
      }),
    });

    render(<WorkTraits tasteAxes={null} work={work} />);

    const pacing = screen.getByRole("meter", { name: explanationLexicon.factorLabels.pacing });
    expect(pacing.getAttribute("aria-valuenow")).toBe("4");
    expect(pacing.getAttribute("aria-valuetext")).toBe(tasteStrings.factorValue(4));
    expect(
      screen.queryByRole("group", {
        name: `${explanationLexicon.factorLabels.darkness}: ${strings.unknown}`,
      }),
    ).toBeNull();
    expect(screen.queryByText(explanationLexicon.factorLabels.darkness!)).toBeNull();
    expect(screen.queryByRole("region", { name: strings.groups.art })).toBeNull();
    expect(screen.queryByText(strings.groupUnknown)).toBeNull();
    expect(screen.queryByText(strings.notApplicable)).toBeNull();
    expect(
      within(screen.getByRole("region", { name: strings.groups.narrative })).getByRole("meter", {
        name: explanationLexicon.factorLabels.pacing,
      }),
    ).toBe(pacing);
    expect(screen.queryByText(strings.legendTaste)).toBeNull();
    expect(document.querySelector("[data-factor-reference]")).toBeNull();
  });

  it("overlays the viewer's Manga DNA with a legend and an accessible reference", () => {
    const work = createTestWork({
      axes: createTestAxes({ pacing: { state: "known", value: 4, confidence: 0.9 } }),
    });

    render(<WorkTraits tasteAxes={tasteAxes({ pacing: 1 })} work={work} />);

    expect(screen.getByText(strings.legendTaste)).toBeTruthy();
    const pacing = screen.getByRole("meter", { name: explanationLexicon.factorLabels.pacing });
    expect(pacing.getAttribute("aria-valuetext")).toBe(
      `${tasteStrings.factorValue(4)}（${strings.tasteReference(tasteStrings.factorValue(1))}）`,
    );
    expect(pacing.querySelector<HTMLElement>("[data-factor-reference]")?.style.left).toBe("25%");
    // Only axes with a known taste value get a marker.
    expect(document.querySelectorAll("[data-factor-reference]")).toHaveLength(1);
  });

  it("keeps the available values visible even when fewer than three axes are confirmed", () => {
    const axes = createTestAxes(
      Object.fromEntries(
        AXIS_IDS.map((id, index) => [
          id,
          index < 2 ? { state: "known", value: 2, confidence: 0.9 } : { state: "unknown" },
        ]),
      ),
    );

    render(<WorkTraits tasteAxes={null} work={createTestWork({ axes })} />);

    expect(screen.queryByText(strings.pending)).toBeNull();
    expect(screen.getAllByRole("meter")).toHaveLength(2);
    for (const id of AXIS_IDS.slice(0, 2)) {
      expect(
        screen
          .getByRole("meter", { name: explanationLexicon.factorLabels[id] })
          .getAttribute("aria-valuenow"),
      ).toBe("2");
    }
  });

  it("omits the entire section when no axes are confirmed", () => {
    const axes = createTestAxes(
      Object.fromEntries(AXIS_IDS.map((id) => [id, { state: "unknown" }])),
    );

    render(<WorkTraits tasteAxes={null} work={createTestWork({ axes })} />);

    expect(screen.queryByRole("region", { name: strings.heading })).toBeNull();
    expect(screen.queryByRole("heading", { name: strings.heading })).toBeNull();
    expect(screen.queryByRole("meter")).toBeNull();
    expect(screen.queryByText(strings.pending)).toBeNull();
    expect(screen.queryByText(strings.groupUnknown)).toBeNull();
  });
});

describe("ShareButton", () => {
  it("opens the OS share sheet with the page title and URL", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, share });

    render(<ShareButton title="七つの大罪" />);
    const button = await screen.findByRole("button", { name: workDetailStrings.share.action });
    await act(async () => fireEvent.click(button));

    expect(share).toHaveBeenCalledWith({ title: "七つの大罪", url: window.location.href });
    expect(screen.queryByText(workDetailStrings.share.failed)).toBeNull();
  });

  it("copies the link when sharing is unavailable and stays quiet when the sheet is dismissed", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, share: undefined, clipboard: { writeText } });

    render(<ShareButton title="七つの大罪" />);
    const shareButton = await screen.findByRole("button", {
      name: workDetailStrings.share.action,
    });
    await act(async () => fireEvent.click(shareButton));
    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(screen.getByText(workDetailStrings.share.copied)).toBeTruthy();

    cleanup();
    vi.stubGlobal("navigator", {
      ...navigator,
      share: vi.fn().mockRejectedValue(new DOMException("dismissed", "AbortError")),
    });
    render(<ShareButton title="七つの大罪" />);
    const dismissButton = await screen.findByRole("button", {
      name: workDetailStrings.share.action,
    });
    await act(async () => fireEvent.click(dismissButton));
    expect(screen.queryByText(workDetailStrings.share.failed)).toBeNull();
  });

  it("renders nothing when neither sharing nor copying is available", async () => {
    vi.stubGlobal("navigator", { ...navigator, share: undefined, clipboard: undefined });

    render(<ShareButton title="七つの大罪" />);
    await act(async () => Promise.resolve());

    expect(screen.queryByRole("button", { name: workDetailStrings.share.action })).toBeNull();
  });
});
