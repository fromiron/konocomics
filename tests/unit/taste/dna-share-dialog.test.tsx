// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Work } from "@/domain/catalog/types";
import { summarizeMangaDna } from "@/domain/profile/dna-summary";
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

describe("DnaShareButton", () => {
  it("offers every analysed work and keeps the analysed count when one is hidden", async () => {
    const { summary, worksById } = worksAndSummary(5);
    render(<DnaShareButton summary={summary} worksById={worksById} />);

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

  it("falls back to a retryable state when the image cannot be drawn", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    const { summary, worksById } = worksAndSummary(5);
    render(<DnaShareButton summary={summary} worksById={worksById} />);

    fireEvent.click(screen.getByRole("button", { name: strings.open }));

    await waitFor(() => {
      expect(screen.getByText(strings.renderFailed)).toBeTruthy();
    });
    expect(screen.getByRole("button", { name: strings.retry })).toBeTruthy();
    expect(screen.getByRole("button", { name: strings.save }).hasAttribute("disabled")).toBe(true);
    expect(screen.getByRole("button", { name: strings.copy })).toBeTruthy();
  });

  it("asks for more works instead of sharing an empty analysis", async () => {
    render(
      <DnaShareButton
        summary={{ analyzedWorkIds: [], axes: [], topPreferences: [] }}
        worksById={new Map()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: strings.open }));

    const dialog = await screen.findByRole("dialog", { name: strings.title });
    expect(within(dialog).getByText(strings.empty)).toBeTruthy();
    expect(within(dialog).getByRole("link", { name: strings.addWorks }).getAttribute("href")).toBe(
      "/onboarding",
    );
    expect(within(dialog).queryByRole("button", { name: strings.save })).toBeNull();
  });

  it("shows the link for manual copying only when the clipboard refuses", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    const { summary, worksById } = worksAndSummary(5);
    render(<DnaShareButton summary={summary} worksById={worksById} />);
    fireEvent.click(screen.getByRole("button", { name: strings.open }));
    const dialog = await screen.findByRole("dialog", { name: strings.title });
    expect(within(dialog).queryByRole("textbox", { name: strings.linkLabel })).toBeNull();

    fireEvent.click(within(dialog).getByRole("button", { name: strings.copy }));

    const link = await within(dialog).findByRole("textbox", { name: strings.linkLabel });
    expect(link).toHaveProperty("value", `${window.location.origin}/?landing=1&via=share-card`);
    expect(within(dialog).getByText(strings.status.copyFailed)).toBeTruthy();
  });
});
