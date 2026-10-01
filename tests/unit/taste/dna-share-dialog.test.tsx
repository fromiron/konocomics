// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Work } from "@/domain/catalog/types";
import { parseDnaShareLink } from "@/domain/profile/dna-share";
import { summarizeMangaDna } from "@/domain/profile/dna-summary";
import type { RankedRecommendation } from "@/domain/recommendation/types";
import { DnaShareButton } from "@/features/taste/dna-share-dialog";
import { tasteStrings } from "@/lib/strings";
import { createTestWork } from "../../helpers/catalog";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
}));

const strings = tasteStrings.share;

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function worksAndSummary(count: number) {
  const works: Work[] = Array.from({ length: count }, (_, index) => ({
    ...createTestWork({ id: `work-${String(index + 1)}` }),
    title: `作品${String(index + 1)}`,
  }));
  const summary = summarizeMangaDna(
    works,
    works.map((work) => ({
      workId: work.id,
      readingState: "completed" as const,
      reaction: "liked" as const,
      updatedAt: "2026-09-01T00:00:00.000Z",
    })),
  );
  return { summary, worksById: new Map(works.map((work) => [work.id, work] as const)) };
}

const recommendation: Pick<RankedRecommendation, "workId" | "contributions" | "confidenceLevel"> = {
  workId: "work-9",
  confidenceLevel: "high",
  contributions: [
    {
      source: "similarity",
      group: "tone",
      factorId: "darkness",
      value: 0.2,
      anchorWorkIds: ["work-1"],
      explainable: true,
    },
  ],
};

function mockClipboard(writeText: (value: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
}

describe("DnaShareButton", () => {
  it("offers every analysed work and keeps the analysed count when one is left out", async () => {
    const { summary, worksById } = worksAndSummary(5);
    render(<DnaShareButton recommendations={[]} summary={summary} worksById={worksById} />);

    fireEvent.click(screen.getByRole("button", { name: strings.open }));
    const dialog = await screen.findByRole("dialog", { name: strings.title });

    const chips = within(dialog).getAllByRole("checkbox");
    expect(new Set(chips.map((chip) => chip.closest("label")?.textContent))).toEqual(
      new Set([...worksById.values()].map((work) => work.title)),
    );
    expect(chips.every((chip) => chip.getAttribute("aria-checked") === "true")).toBe(true);
    expect(within(dialog).getByText(strings.worksHelp(5))).toBeTruthy();

    fireEvent.click(chips[0]!);
    expect(chips[0]?.getAttribute("aria-checked")).toBe("false");
    expect(within(dialog).getByText(strings.worksHelp(5))).toBeTruthy();
  });

  it("copies a DNA page link that carries the shown DNA and the engine's reason", async () => {
    const writeText = vi.fn<(value: string) => Promise<void>>().mockResolvedValue(undefined);
    mockClipboard(writeText);
    const { summary, worksById } = worksAndSummary(5);
    worksById.set("work-9", { ...createTestWork({ id: "work-9" }), title: "おすすめ作品" });
    render(
      <DnaShareButton recommendations={[recommendation]} summary={summary} worksById={worksById} />,
    );
    fireEvent.click(screen.getByRole("button", { name: strings.open }));
    const dialog = await screen.findByRole("dialog", { name: strings.title });
    expect(within(dialog).getByText(strings.previewRecommendations(["おすすめ作品"]))).toBeTruthy();

    fireEvent.click(within(dialog).getAllByRole("checkbox")[0]!);
    fireEvent.click(within(dialog).getByRole("button", { name: strings.copy }));

    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    const url = new URL(writeText.mock.calls[0]![0]);
    expect(url.origin + url.pathname).toBe(`${window.location.origin}/share`);
    const link = parseDnaShareLink(url.search);
    expect(link?.analyzedWorkCount).toBe(5);
    expect(link?.workIds).toHaveLength(4);
    expect(link?.recommendations).toEqual([{ workId: "work-9", reasonFactorId: "darkness" }]);
    expect(within(dialog).getByText(strings.status.copied)).toBeTruthy();
    expect(
      within(dialog).getByRole("link", { name: strings.openPageNewTab }).getAttribute("href"),
    ).toBe(url.toString());
  });

  it("asks for more works instead of sharing an empty analysis", async () => {
    render(
      <DnaShareButton
        recommendations={[]}
        summary={{ analyzedWorkIds: [], axes: [] }}
        worksById={new Map()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: strings.open }));

    const dialog = await screen.findByRole("dialog", { name: strings.title });
    expect(within(dialog).getByText(strings.empty)).toBeTruthy();
    expect(within(dialog).getByRole("link", { name: strings.addWorks }).getAttribute("href")).toBe(
      "/onboarding",
    );
    expect(within(dialog).queryByRole("button", { name: strings.copy })).toBeNull();
  });

  it("shows the link for manual copying only when the clipboard refuses", async () => {
    mockClipboard(vi.fn().mockRejectedValue(new Error("denied")));
    const { summary, worksById } = worksAndSummary(5);
    render(<DnaShareButton recommendations={[]} summary={summary} worksById={worksById} />);
    fireEvent.click(screen.getByRole("button", { name: strings.open }));
    const dialog = await screen.findByRole("dialog", { name: strings.title });
    expect(within(dialog).queryByRole("textbox", { name: strings.linkLabel })).toBeNull();

    fireEvent.click(within(dialog).getByRole("button", { name: strings.copy }));

    const input = await within(dialog).findByRole("textbox", { name: strings.linkLabel });
    const value = (input as HTMLInputElement).value;
    expect(value.startsWith(`${window.location.origin}/share?v=1&dna=`)).toBe(true);
    expect(parseDnaShareLink(new URL(value).search)?.analyzedWorkCount).toBe(5);
    expect(within(dialog).getByText(strings.status.copyFailed)).toBeTruthy();
  });
});
