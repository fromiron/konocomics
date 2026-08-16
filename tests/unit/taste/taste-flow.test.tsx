// @vitest-environment jsdom

import { StrictMode, type ReactNode } from "react";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type * as MotionReact from "motion/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { summarizeMangaDna } from "@/domain/profile/dna-summary";
import type {
  ProfileAdjustments,
  RecommendationPolicies,
  UserWorkRecord,
} from "@/domain/profile/types";
import { TasteFlow } from "@/features/taste/taste-flow";
import { createTestAxes, createTestCatalog, createTestWork } from "../../helpers/catalog";

const testState = vi.hoisted(() => ({
  catalog: null as unknown,
  adjustments: { axes: {}, themes: {} } as ProfileAdjustments,
  getProviderCache: vi.fn(),
  onboardingCompletedAt: "2026-08-14T01:00:00.000Z" as string | null | undefined,
  policies: {
    preferCompleted: false,
    preferHidden: false,
    preferVerified: false,
    excludeIncomplete: false,
  } as RecommendationPolicies,
  saveProfileAdjustments: vi.fn(),
  saveProviderCache: vi.fn(),
  userWorks: [] as UserWorkRecord[],
}));
const motionState = vi.hoisted(() => ({ reduced: false as boolean | null }));
let motionPreferenceListener: ((event: { matches: boolean }) => void) | null = null;

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof MotionReact>();
  return { ...actual, useReducedMotion: () => motionState.reduced };
});

vi.mock("@/data/generated/recommendation-context-v1.json", () => ({
  default: {
    constraintByWorkId: Object.fromEntries(
      Array.from({ length: 7 }, (_, index) => {
        const workId = `work-${String(index + 1)}`;
        return [workId, { workId, catalogRole: "bridge", volumeCount: 1 }];
      }),
    ),
    marketSnapshot: {
      catalogVersion: "v1-test",
      catalogAverageRating: 0,
      byWorkId: {},
    },
  },
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, className, to }: { children: ReactNode; className?: string; to: string }) => (
    <a className={className} href={to}>
      {children}
    </a>
  ),
}));

vi.mock("@/features/catalog/catalog-provider", () => ({
  useCatalog: () => testState.catalog,
}));

vi.mock("@/infrastructure/db", () => ({
  usePersistence: () => ({
    status: { state: "ready", mode: "indexeddb", warning: null },
    userWorks: testState.userWorks,
    adjustments: testState.adjustments,
    policies: testState.policies,
    getProviderCache: testState.getProviderCache,
    onboardingCompletedAt: testState.onboardingCompletedAt,
    hasProfile: true,
    saveProfileAdjustments: testState.saveProfileAdjustments,
    saveProviderCache: testState.saveProviderCache,
  }),
}));

function createProfileFixture() {
  const works = Array.from({ length: 7 }, (_, index) => {
    const strategy = index === 5 ? 4 : index === 6 ? 0 : 2;
    return {
      ...createTestWork({
        id: `work-${String(index + 1)}`,
        axes: createTestAxes({ strategy: { state: "known", value: strategy, confidence: 0.9 } }),
      }),
      title: `作品${String(index + 1)}`,
    };
  });
  const baseCatalog = createTestCatalog(works[0]);
  testState.catalog = { ...baseCatalog, works };
  testState.userWorks = works.slice(0, 5).map((work) => ({
    workId: work.id,
    readingState: "completed",
    reaction: "liked",
    updatedAt: "2026-08-14T00:00:00.000Z",
  }));
}

function consumeReveal() {
  window.history.replaceState({}, "", "/taste");
}

beforeEach(() => {
  createProfileFixture();
  testState.adjustments = { axes: {}, themes: {} };
  testState.onboardingCompletedAt = "2026-08-14T01:00:00.000Z";
  testState.saveProfileAdjustments.mockReset();
  testState.saveProfileAdjustments.mockResolvedValue(undefined);
  testState.getProviderCache.mockReset();
  testState.getProviderCache.mockResolvedValue(null);
  testState.saveProviderCache.mockReset();
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
  it("renders cached Rakuten covers for positive anchor works", async () => {
    const catalog = testState.catalog as ReturnType<typeof createTestCatalog>;
    const work = catalog.works[0]!;
    const volumeId = catalog.representativeVolumeByWorkId[work.id]!;
    const isbn = catalog.volumes.find((volume) => volume.id === volumeId)!.isbn;
    testState.getProviderCache.mockResolvedValue({
      workId: work.id,
      provider: "rakuten",
      isbn,
      imageUrl: "https://thumbnail.image.rakuten.co.jp/book.jpg?_ex=600x600",
      fetchedAt: "2026-08-14T00:00:00.000Z",
      commercialExpiresAt: "2099-08-14T00:00:00.000Z",
      metadataExpiresAt: "2099-08-14T00:00:00.000Z",
    });

    const { container } = render(<TasteFlow />);

    await waitFor(() => {
      expect(container.querySelector<HTMLImageElement>(".taste-anchor-cover img")?.src).toBe(
        "https://thumbnail.image.rakuten.co.jp/book.jpg?_ex=200x200",
      );
    });
    expect(testState.getProviderCache).toHaveBeenCalledWith(isbn);
  });

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

  it("keeps all groups in summary and opens only the selected adjustment group", async () => {
    const onGroupChange = vi.fn();
    const view = render(<TasteFlow onGroupChange={onGroupChange} />);

    expect(await screen.findByRole("heading", { name: "あなたの Manga DNA" })).toBeTruthy();
    expect(
      [...view.container.querySelectorAll(".taste-factor-group > h2")].map(
        (heading) => heading.textContent,
      ),
    ).toEqual(["テーマ", "展開", "トーン・関係", "作画", "ジャンル"]);
    expect(screen.getByRole("button", { name: "すべて" }).getAttribute("aria-pressed")).toBe(
      "true",
    );

    view.rerender(<TasteFlow mode="adjust" onGroupChange={onGroupChange} />);

    expect(
      [...view.container.querySelectorAll(".taste-factor-group > h2")].map(
        (heading) => heading.textContent,
      ),
    ).toEqual([]);
    expect(screen.queryByRole("button", { name: "すべて" })).toBeNull();
    const themeFilter = screen.getByRole("button", { name: "テーマ" });
    expect(themeFilter.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(themeFilter);
    expect(onGroupChange).toHaveBeenLastCalledWith("theme");
  });

  it("renders the selected labelled group and saves Axis adjustments immediately", async () => {
    const { container } = render(<TasteFlow group="narrative" mode="adjust" />);

    expect(await screen.findByRole("heading", { name: "あなたの Manga DNA" })).toBeTruthy();
    expect(container.querySelector(".taste-page--with-action")).toBeNull();
    expect(container.querySelector("main")?.classList.contains("page-entry-b")).toBe(true);
    const radar = screen.getByRole("region", { name: "好みの分布" });
    expect(radar.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(within(radar).getByText("描き込みの密度")).toBeTruthy();
    const anchorRegion = screen.getByRole("region", { name: "選んだマンガ" });
    expect(within(anchorRegion).queryByRole("img")).toBeNull();
    expect(anchorRegion.querySelectorAll("li > .visually-hidden")).toHaveLength(5);
    const evidenceGraphics = container.querySelectorAll(".taste-top-card > ul[aria-hidden='true']");
    expect(evidenceGraphics.length).toBeGreaterThan(0);
    expect([...evidenceGraphics].every((graphic) => !graphic.hasAttribute("aria-label"))).toBe(
      true,
    );
    const groupHeadings = [...container.querySelectorAll(".taste-factor-group > h2")];
    expect(groupHeadings.map((heading) => heading.textContent)).toEqual(["展開"]);
    const headingIds = groupHeadings.map((heading) => heading.id);
    expect(new Set(headingIds).size).toBe(headingIds.length);
    expect(screen.getAllByRole("radiogroup")).toHaveLength(6);
    const expectedStrategy = summarizeMangaDna(
      (testState.catalog as ReturnType<typeof createTestCatalog>).works,
      testState.userWorks,
    ).axes.find((preference) => preference.factorId === "strategy")?.value;
    const strategyMeter = screen.getByRole("meter", { name: "戦略的な展開" });
    expect(Number(strategyMeter?.getAttribute("aria-valuenow"))).toBe(expectedStrategy);

    const strategyGroup = screen.getByRole("radiogroup", {
      name: "戦略的な展開の好みを調整",
    });
    const beforePreview = screen.getByRole("region", { name: "ページを開いた時" });
    const afterPreview = screen.getByRole("region", { name: "現在の調整" });
    expect(within(beforePreview).getByText("work-6")).toBeTruthy();
    expect(within(afterPreview).getByText("work-6")).toBeTruthy();
    fireEvent.click(within(strategyGroup).getByRole("radio", { name: "除外" }));

    await waitFor(() => {
      expect(testState.saveProfileAdjustments).toHaveBeenCalledWith({
        axes: { strategy: "exclude" },
        themes: {},
      });
      expect(screen.getByText("次のおすすめに反映されます")).toBeTruthy();
      expect(within(beforePreview).getByText("work-6")).toBeTruthy();
      expect(within(afterPreview).queryByText("work-6")).toBeNull();
      expect(within(afterPreview).getByText("work-7")).toBeTruthy();
    });
  });

  it("restores stored adjustments on remount and rolls back a rejected save", async () => {
    testState.adjustments = { axes: { strategy: "like" }, themes: {} };
    testState.saveProfileAdjustments.mockRejectedValue(new Error("write failed"));
    const view = render(<TasteFlow group="narrative" mode="adjust" />);

    const group = await screen.findByRole("radiogroup", {
      name: "戦略的な展開の好みを調整",
    });
    expect(within(group).getByRole("radio", { name: "好き" }).getAttribute("aria-checked")).toBe(
      "true",
    );
    fireEvent.click(within(group).getByRole("radio", { name: "除外" }));

    expect((await screen.findByRole("alert")).textContent).toContain(
      "好みの調整を保存できませんでした",
    );
    expect(within(group).getByRole("radio", { name: "好き" }).getAttribute("aria-checked")).toBe(
      "true",
    );

    view.unmount();
    render(<TasteFlow group="narrative" mode="adjust" />);
    const remountedGroup = await screen.findByRole("radiogroup", {
      name: "戦略的な展開の好みを調整",
    });
    expect(
      within(remountedGroup).getByRole("radio", { name: "好き" }).getAttribute("aria-checked"),
    ).toBe("true");
  });

  it("consumes the URL immediately while the local 1200ms gate and reveal state continue", async () => {
    vi.useFakeTimers();
    window.history.replaceState({}, "", "/taste?reveal=1");
    const replaceState = vi.spyOn(window.history, "replaceState");

    const view = render(
      <StrictMode>
        <TasteFlow onRevealConsumed={consumeReveal} reveal="1" />
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

    view.rerender(
      <StrictMode>
        <TasteFlow onRevealConsumed={consumeReveal} />
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
    window.history.replaceState({}, "", "/taste?reveal=1");
    render(<TasteFlow onRevealConsumed={consumeReveal} reveal="1" />);
    await act(async () => Promise.resolve());
    expect(screen.getByRole("heading", { name: "あなたの Manga DNA" })).toBeTruthy();
    expect(screen.queryByRole("link", { name: "おすすめを見る" })).toBeNull();
    expect(document.querySelector(".page-entry-b")).toBeNull();
    expect(window.location.pathname + window.location.search).toBe("/taste");
  });

  it("consumes the mount query before persistence hydration and resumes the claimed reveal later", async () => {
    testState.onboardingCompletedAt = undefined;
    window.history.replaceState({}, "", "/taste?reveal=1");
    const replaceState = vi.spyOn(window.history, "replaceState");
    const view = render(
      <StrictMode>
        <TasteFlow onRevealConsumed={consumeReveal} reveal="1" />
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
        <TasteFlow onRevealConsumed={consumeReveal} />
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
    window.sessionStorage.setItem("konocomics:manga-dna-reveal:v1", "2026-08-14T01:00:00.000Z");
    testState.onboardingCompletedAt = "2026-08-14T02:00:00.000Z";

    render(<TasteFlow reveal="1" />);
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

      render(<TasteFlow onRevealConsumed={consumeReveal} reveal="1" />);

      expect(await screen.findByRole("link", { name: "おすすめを見る" })).toBeTruthy();
      expect(window.location.pathname + window.location.search).toBe("/taste");
      expect(document.querySelector(".taste-top-card__label--reveal")).toBeNull();
      expect(document.querySelector(".taste-factor-bar__fill--reveal")).toBeNull();
    },
  );

  it("does not animate an unresolved preference and never starts later for that completion", async () => {
    motionState.reduced = null;
    window.history.replaceState({}, "", "/taste?reveal=1");

    const view = render(<TasteFlow onRevealConsumed={consumeReveal} reveal="1" />);

    expect(await screen.findByRole("link", { name: "おすすめを見る" })).toBeTruthy();
    expect(window.location.pathname + window.location.search).toBe("/taste");
    expect(document.querySelector(".taste-top-card__label--reveal")).toBeNull();

    motionState.reduced = false;
    view.rerender(<TasteFlow onRevealConsumed={consumeReveal} />);
    await act(async () => Promise.resolve());
    expect(document.querySelector(".taste-top-card__label--reveal")).toBeNull();
  });

  it("finishes an active reveal immediately when reduced motion becomes requested", async () => {
    window.history.replaceState({}, "", "/taste?reveal=1");

    render(<TasteFlow onRevealConsumed={consumeReveal} reveal="1" />);
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
