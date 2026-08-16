// @vitest-environment jsdom

import { StrictMode } from "react";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type * as MotionReact from "motion/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { summarizeMangaDna } from "@/domain/profile/dna-summary";
import type { ProfileAdjustments, UserWorkRecord } from "@/domain/profile/types";
import { TasteFlow } from "@/features/taste/taste-flow";
import { createTestCatalog, createTestWork } from "../../helpers/catalog";

const testState = vi.hoisted(() => ({
  catalog: null as unknown,
  adjustments: { axes: {}, themes: {} } as ProfileAdjustments,
  onboardingCompletedAt: "2026-08-14T01:00:00.000Z" as string | null | undefined,
  search: new URLSearchParams(),
  saveProfileAdjustments: vi.fn(),
  userWorks: [] as UserWorkRecord[],
}));
const motionState = vi.hoisted(() => ({ reduced: false as boolean | null }));
let motionPreferenceListener: ((event: { matches: boolean }) => void) | null = null;

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof MotionReact>();
  return { ...actual, useReducedMotion: () => motionState.reduced };
});

vi.mock("next/navigation", () => ({
  useSearchParams: () => testState.search,
}));

vi.mock("@/features/catalog/catalog-provider", () => ({
  useCatalog: () => testState.catalog,
}));

vi.mock("@/infrastructure/db", () => ({
  usePersistence: () => ({
    status: { state: "ready", mode: "indexeddb", warning: null },
    userWorks: testState.userWorks,
    adjustments: testState.adjustments,
    onboardingCompletedAt: testState.onboardingCompletedAt,
    hasProfile: true,
    saveProfileAdjustments: testState.saveProfileAdjustments,
  }),
}));

function createProfileFixture() {
  const works = Array.from({ length: 5 }, (_, index) => ({
    ...createTestWork({ id: `work-${String(index + 1)}` }),
    title: `作品${String(index + 1)}`,
  }));
  const baseCatalog = createTestCatalog(works[0]);
  testState.catalog = { ...baseCatalog, works };
  testState.userWorks = works.map((work) => ({
    workId: work.id,
    readingState: "completed",
    reaction: "liked",
    updatedAt: "2026-08-14T00:00:00.000Z",
  }));
}

beforeEach(() => {
  createProfileFixture();
  testState.search = new URLSearchParams();
  testState.adjustments = { axes: {}, themes: {} };
  testState.onboardingCompletedAt = "2026-08-14T01:00:00.000Z";
  testState.saveProfileAdjustments.mockReset();
  testState.saveProfileAdjustments.mockResolvedValue(undefined);
  motionState.reduced = false;
  motionPreferenceListener = null;
  window.sessionStorage.clear();
  window.history.replaceState({}, "", "/taste");
  vi.stubGlobal("matchMedia", () => ({
    matches: motionState.reduced,
    addEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => {
      motionPreferenceListener = listener;
    },
    removeEventListener: () => undefined,
  }));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      disconnect() {}
      observe() {}
      takeRecords() {
        return [];
      }
      unobserve() {}
    },
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("TasteFlow", () => {
  it("does not render a profile backed only by catalog-stale records", () => {
    testState.userWorks = Array.from({ length: 5 }, (_, index) => ({
      workId: `stale-${String(index + 1)}`,
      readingState: "completed",
      reaction: "liked",
      updatedAt: "2026-08-14T00:00:00.000Z",
    }));

    render(<TasteFlow />);

    expect(screen.getByText("Manga DNA を読み込んでいます…")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "あなたの Manga DNA" })).toBeNull();
  });

  it("excludes catalog-stale records from the displayed confidence", async () => {
    testState.userWorks = [
      ...testState.userWorks,
      ...Array.from({ length: 3 }, (_, index) => ({
        workId: `stale-${String(index + 1)}`,
        readingState: "completed" as const,
        reaction: "liked" as const,
        updatedAt: "2026-08-14T00:00:00.000Z",
      })),
    ];

    render(<TasteFlow />);

    expect(await screen.findByText("分析の確信度: ふつう")).toBeTruthy();
  });

  it("renders ordered, uniquely labelled groups and saves Axis adjustments immediately", async () => {
    const { container } = render(<TasteFlow />);

    expect(await screen.findByRole("heading", { name: "あなたの Manga DNA" })).toBeTruthy();
    expect(container.querySelector(".taste-page--with-action")).toBeNull();
    expect(container.querySelector("main")?.classList.contains("page-entry-b")).toBe(true);
    const anchorRegion = screen.getByRole("region", { name: "選んだマンガ" });
    expect(within(anchorRegion).queryByRole("img")).toBeNull();
    expect(anchorRegion.querySelectorAll("li > .visually-hidden")).toHaveLength(5);
    const evidenceGraphics = container.querySelectorAll(".taste-top-card > ul[aria-hidden='true']");
    expect(evidenceGraphics.length).toBeGreaterThan(0);
    expect([...evidenceGraphics].every((graphic) => !graphic.hasAttribute("aria-label"))).toBe(
      true,
    );
    const groupHeadings = [...container.querySelectorAll(".taste-factor-group > h2")];
    expect(groupHeadings.map((heading) => heading.textContent)).toEqual([
      "テーマ",
      "展開",
      "トーン・関係",
      "作画",
      "ジャンル",
    ]);
    const headingIds = groupHeadings.map((heading) => heading.id);
    expect(new Set(headingIds).size).toBe(headingIds.length);
    expect(screen.getAllByRole("radiogroup")).toHaveLength(39);
    const expectedStrategy = summarizeMangaDna(
      (testState.catalog as ReturnType<typeof createTestCatalog>).works,
      testState.userWorks,
    ).axes.find((preference) => preference.factorId === "strategy")?.value;
    const strategyMeter = screen.getByRole("meter", { name: "戦略的な展開" });
    expect(Number(strategyMeter?.getAttribute("aria-valuenow"))).toBe(expectedStrategy);

    const strategyGroup = screen.getByRole("radiogroup", {
      name: "戦略的な展開の好みを調整",
    });
    fireEvent.click(within(strategyGroup).getByRole("radio", { name: "除外" }));

    await waitFor(() => {
      expect(testState.saveProfileAdjustments).toHaveBeenCalledWith({
        axes: { strategy: "exclude" },
        themes: {},
      });
      expect(screen.getByText("次のおすすめに反映されます")).toBeTruthy();
    });
  });

  it("restores stored adjustments on remount and rolls back a rejected save", async () => {
    testState.adjustments = { axes: { strategy: "like" }, themes: {} };
    testState.saveProfileAdjustments.mockRejectedValue(new Error("write failed"));
    const view = render(<TasteFlow />);

    const group = await screen.findByRole("radiogroup", {
      name: "戦略的な展開の好みを調整",
    });
    expect(within(group).getByRole("radio", { name: "好き" }).matches(":checked")).toBe(true);
    fireEvent.click(within(group).getByRole("radio", { name: "除外" }));

    expect((await screen.findByRole("alert")).textContent).toContain(
      "好みの調整を保存できませんでした",
    );
    expect(within(group).getByRole("radio", { name: "好き" }).matches(":checked")).toBe(true);

    view.unmount();
    render(<TasteFlow />);
    const remountedGroup = await screen.findByRole("radiogroup", {
      name: "戦略的な展開の好みを調整",
    });
    expect(within(remountedGroup).getByRole("radio", { name: "好き" }).matches(":checked")).toBe(
      true,
    );
  });

  it("consumes the URL immediately while the local 1200ms gate and reveal state continue", async () => {
    vi.useFakeTimers();
    testState.search = new URLSearchParams("reveal=1");
    window.history.replaceState({}, "", "/taste?reveal=1");
    const replaceState = vi.spyOn(window.history, "replaceState");

    const view = render(
      <StrictMode>
        <TasteFlow />
      </StrictMode>,
    );
    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByRole("link", { name: "おすすめを見る" })).toBeTruthy();
    expect(document.querySelector(".taste-page--with-action")).toBeTruthy();
    expect(document.querySelector(".page-entry-b")).toBeNull();
    expect(window.sessionStorage.getItem("konocomics:manga-dna-reveal:v1")).toBe(
      "2026-08-14T01:00:00.000Z",
    );
    expect(replaceState).toHaveBeenCalledTimes(1);
    expect(replaceState).toHaveBeenCalledWith({}, "", "/taste");
    expect(window.location.pathname + window.location.search).toBe("/taste");

    testState.search = new URLSearchParams();
    view.rerender(
      <StrictMode>
        <TasteFlow />
      </StrictMode>,
    );
    expect(screen.getByRole("link", { name: "おすすめを見る" })).toBeTruthy();
    expect(
      [...document.querySelectorAll("[data-reveal-ready]")].every(
        (fill) => fill.getAttribute("data-reveal-ready") === "false",
      ),
    ).toBe(true);

    act(() => vi.advanceTimersByTime(1199));
    expect(document.querySelector("[data-reveal-ready='true']")).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(document.querySelector("[data-reveal-ready='true']")).toBeTruthy();

    act(() => vi.advanceTimersByTime(1200));
    expect(replaceState).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("link", { name: "おすすめを見る" })).toBeTruthy();

    view.unmount();
    testState.search = new URLSearchParams("reveal=1");
    window.history.replaceState({}, "", "/taste?reveal=1");
    render(<TasteFlow />);
    await act(async () => Promise.resolve());
    expect(screen.getByRole("heading", { name: "あなたの Manga DNA" })).toBeTruthy();
    expect(screen.queryByRole("link", { name: "おすすめを見る" })).toBeNull();
    expect(document.querySelector(".page-entry-b")).toBeNull();
    expect(window.location.pathname + window.location.search).toBe("/taste");
  });

  it("consumes the mount query before persistence hydration and resumes the claimed reveal later", async () => {
    testState.search = new URLSearchParams("reveal=1");
    testState.onboardingCompletedAt = undefined;
    window.history.replaceState({}, "", "/taste?reveal=1");
    const replaceState = vi.spyOn(window.history, "replaceState");
    const view = render(
      <StrictMode>
        <TasteFlow />
      </StrictMode>,
    );

    await act(async () => Promise.resolve());
    expect(screen.getByText("Manga DNA を読み込んでいます…")).toBeTruthy();
    expect(replaceState).toHaveBeenCalledTimes(1);
    expect(window.location.pathname + window.location.search).toBe("/taste");
    expect(window.sessionStorage.getItem("konocomics:manga-dna-reveal:v1")).toBeNull();

    testState.onboardingCompletedAt = "2026-08-14T01:00:00.000Z";
    view.rerender(
      <StrictMode>
        <TasteFlow />
      </StrictMode>,
    );

    expect(await screen.findByRole("link", { name: "おすすめを見る" })).toBeTruthy();
    expect(window.sessionStorage.getItem("konocomics:manga-dna-reveal:v1")).toBe(
      "2026-08-14T01:00:00.000Z",
    );
    expect(document.querySelector(".taste-page--with-action")).toBeTruthy();
    expect(document.querySelector(".page-entry-b")).toBeNull();
    expect(replaceState).toHaveBeenCalledTimes(1);
  });

  it("allows one reveal for a new onboarding completion in the same session", async () => {
    testState.search = new URLSearchParams("reveal=1");
    window.sessionStorage.setItem("konocomics:manga-dna-reveal:v1", "2026-08-14T01:00:00.000Z");
    testState.onboardingCompletedAt = "2026-08-14T02:00:00.000Z";

    render(<TasteFlow />);
    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByRole("link", { name: "おすすめを見る" })).toBeTruthy();
    expect(window.sessionStorage.getItem("konocomics:manga-dna-reveal:v1")).toBe(
      "2026-08-14T02:00:00.000Z",
    );
  });

  it.each(["get", "set", "readback"] as const)(
    "fails closed to the complete static result when sessionStorage %s cannot verify the claim",
    async (failure) => {
      testState.search = new URLSearchParams("reveal=1");
      window.history.replaceState({}, "", "/taste?reveal=1");

      if (failure === "get") {
        vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
          throw new Error("get failed");
        });
      } else if (failure === "set") {
        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
          throw new Error("set failed");
        });
      } else {
        vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
      }

      render(<TasteFlow />);

      expect(await screen.findByRole("link", { name: "おすすめを見る" })).toBeTruthy();
      expect(window.location.pathname + window.location.search).toBe("/taste");
      expect(document.querySelector(".taste-top-card__label--reveal")).toBeNull();
      expect(document.querySelector(".taste-factor-bar__fill--reveal")).toBeNull();
    },
  );

  it("does not animate an unresolved preference and never starts later for that completion", async () => {
    motionState.reduced = null;
    testState.search = new URLSearchParams("reveal=1");
    window.history.replaceState({}, "", "/taste?reveal=1");

    const view = render(<TasteFlow />);

    expect(await screen.findByRole("link", { name: "おすすめを見る" })).toBeTruthy();
    expect(window.location.pathname + window.location.search).toBe("/taste");
    expect(document.querySelector(".taste-top-card__label--reveal")).toBeNull();

    motionState.reduced = false;
    view.rerender(<TasteFlow />);
    await act(async () => Promise.resolve());
    expect(document.querySelector(".taste-top-card__label--reveal")).toBeNull();
  });

  it("finishes an active reveal immediately when reduced motion becomes requested", async () => {
    testState.search = new URLSearchParams("reveal=1");
    window.history.replaceState({}, "", "/taste?reveal=1");

    render(<TasteFlow />);
    expect(await screen.findByRole("link", { name: "おすすめを見る" })).toBeTruthy();
    expect(document.querySelector(".taste-top-card__label--reveal")).toBeTruthy();

    expect(motionPreferenceListener).not.toBeNull();
    act(() => motionPreferenceListener?.({ matches: true }));

    await waitFor(() => {
      expect(window.location.pathname + window.location.search).toBe("/taste");
      expect(document.querySelector(".taste-top-card__label--reveal")).toBeNull();
      expect(document.querySelector(".taste-factor-bar__fill--reveal")).toBeNull();
    });
    expect(screen.getByRole("link", { name: "おすすめを見る" })).toBeTruthy();
  });
});
