// @vitest-environment jsdom

import { StrictMode, type AnchorHTMLAttributes } from "react";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type * as MotionReact from "motion/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { THEME_TAGS } from "@/domain/catalog/constants";
import { summarizeMangaDna } from "@/domain/profile/dna-summary";
import type {
  ProfileAdjustments,
  RecommendationPolicies,
  UserWorkRecord,
} from "@/domain/profile/types";
import { TasteFlow } from "@/features/taste/taste-flow";
import { RecommendationDiffPreview } from "@/features/taste/taste-insights";
import { tasteStrings, mediaStrings } from "@/lib/strings";
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
  Link: ({
    children,
    to,
    params,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    to: string;
    params?: { workId: string };
    preload?: boolean;
  }) => {
    delete props.preload;
    return (
      <a {...props} href={to.replace("$workId", params?.workId ?? "")}>
        {children}
      </a>
    );
  },
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

function createSessionStorageStub(
  overrides: Partial<Pick<Storage, "getItem" | "setItem">>,
): Storage {
  const storage = window.sessionStorage;
  return {
    clear: storage.clear.bind(storage),
    getItem: storage.getItem.bind(storage),
    key: storage.key.bind(storage),
    get length() {
      return storage.length;
    },
    removeItem: storage.removeItem.bind(storage),
    setItem: storage.setItem.bind(storage),
    ...overrides,
  };
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
  it.each([
    { before: ["work-6"], after: ["work-6"], lists: 1, message: tasteStrings.previewUnchanged },
    {
      before: ["work-6", "work-7"],
      after: ["work-7", "work-6"],
      lists: 2,
      message: tasteStrings.previewChanged,
    },
    { before: [], after: [], lists: 0, message: tasteStrings.previewEmpty },
    { before: [], after: ["work-6"], lists: 1, message: tasteStrings.previewChanged },
    { before: ["work-6"], after: [], lists: 1, message: tasteStrings.previewChanged },
    { before: null, after: ["work-6"], lists: 0, message: tasteStrings.previewUnavailable },
    {
      before: ["missing-work"],
      after: ["missing-work"],
      lists: 1,
      message: tasteStrings.previewUnchanged,
    },
  ])(
    "distinguishes preview results without duplicate lists or raw IDs: $before → $after",
    ({ before, after, lists, message }) => {
      const works = [6, 7].map((number) => ({
        ...createTestWork({ id: `work-${String(number)}` }),
        title: `作品${String(number)}`,
      }));
      const { container } = render(
        <RecommendationDiffPreview
          after={after}
          before={before}
          coverUrls={new Map()}
          onCoverVisible={() => undefined}
          worksById={new Map(works.map((work) => [work.id, work]))}
        />,
      );

      expect(screen.queryAllByRole("list")).toHaveLength(lists);
      expect(screen.getAllByText(message)).toHaveLength(1);
      if (before !== null && after !== null && before.length !== after.length) {
        const emptyLabel =
          before.length === 0 ? tasteStrings.previewBefore : tasteStrings.previewAfter;
        const populatedLabel =
          before.length === 0 ? tasteStrings.previewAfter : tasteStrings.previewBefore;
        const empty = screen.getByRole("region", { name: emptyLabel });
        expect(within(empty).getByText(tasteStrings.previewEmpty)).toBeTruthy();
        expect(within(empty).queryByRole("list")).toBeNull();
        expect(
          within(screen.getByRole("region", { name: populatedLabel })).getByRole("list"),
        ).toBeTruthy();
      }
      expect(container.querySelector("code")).toBeNull();
      expect(screen.queryByText("missing-work")).toBeNull();
      if (after?.some((workId) => workId === "missing-work")) {
        expect(screen.getByText(tasteStrings.previewWorkUnavailable)).toBeTruthy();
        expect(screen.queryByRole("link")).toBeNull();
      }
      if (lists === 0) {
        expect(screen.queryByText(tasteStrings.previewUnchanged)).toBeNull();
        expect(screen.queryByText(tasteStrings.previewChanged)).toBeNull();
      }
    },
  );

  it("shows the evidence-ranked representative five works", async () => {
    testState.userWorks = [
      ...testState.userWorks,
      {
        workId: "work-6",
        readingState: "completed",
        reaction: "favorite",
        updatedAt: "2026-08-13T00:00:00.000Z",
      },
    ];

    render(<TasteFlow />);

    const anchorRegion = await screen.findByRole("region", { name: tasteStrings.anchorsHeading });
    expect(
      within(anchorRegion)
        .getAllByRole("link")
        .map((link) => link.querySelector("strong")?.textContent),
    ).toEqual(["作品6", "作品1", "作品2", "作品3", "作品4"]);
  });

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

  it("shows a one-line coaching summary for normal confidence that adds works through onboarding", async () => {
    render(<TasteFlow />);

    const coachHeading = await screen.findByRole("heading", { name: tasteStrings.coach.heading });
    expect(screen.getByText(tasteStrings.coach.description)).toBeTruthy();
    expect(screen.getByRole("link", { name: tasteStrings.coach.action }).getAttribute("href")).toBe(
      "/onboarding",
    );
    expect(coachHeading.closest("section")?.querySelector("img")).toBeNull();
    expect(screen.getByText("分析の確信度: ふつう")).toBeTruthy();
    expect(screen.queryByRole("link", { name: tasteStrings.addWorks })).toBeNull();
  });

  it("hides the coaching banner when profile confidence is high", async () => {
    const catalog = testState.catalog as ReturnType<typeof createTestCatalog>;
    const extra = { ...createTestWork({ id: "work-8" }), title: "作品8" };
    testState.catalog = { ...catalog, works: [...catalog.works, extra] };
    testState.userWorks = [...catalog.works, extra].map((work) => ({
      workId: work.id,
      readingState: "completed" as const,
      reaction: "liked" as const,
      updatedAt: "2026-08-14T00:00:00.000Z",
    }));

    render(<TasteFlow />);

    expect(await screen.findByText("分析の確信度: 高い")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: tasteStrings.coach.heading })).toBeNull();
    expect(screen.getByRole("link", { name: tasteStrings.addWorks })).toBeTruthy();
    const recent = screen
      .getByRole("heading", { name: tasteStrings.recentFeedbackHeading })
      .closest("section");
    if (recent === null) throw new Error("Missing recent feedback summary");
    // Every recent record is 「好き」, so the label appears once above all eight covers.
    const statusGroups = within(recent).getAllByRole("list", {
      name: tasteStrings.feedbackLabels.liked,
    });
    expect(statusGroups).toHaveLength(1);
    expect(within(statusGroups[0]!).getAllByRole("link")).toHaveLength(8);
    expect(statusGroups[0]!.querySelectorAll(".taste-feedback-cover")).toHaveLength(8);
    expect(
      within(recent).getAllByText(tasteStrings.feedbackLabels.liked, { exact: true }),
    ).toHaveLength(1);
    expect(
      within(recent).getByRole("link", { name: tasteStrings.openLibrary }).getAttribute("href"),
    ).toBe("/library");
  });

  it("shows five compact group summaries and opens one labelled detail panel at a time", async () => {
    const onGroupChange = vi.fn();
    const { container, rerender } = render(<TasteFlow onGroupChange={onGroupChange} />);

    expect(await screen.findByRole("heading", { name: "あなたの Manga DNA" })).toBeTruthy();
    expect(
      [...container.querySelectorAll(".taste-factor-group h3")].map(
        (heading) => heading.textContent,
      ),
    ).toEqual(["ジャンル", "テーマ", "展開", "トーン・関係", "作画"]);
    expect(container.querySelectorAll("section.taste-factor-group")).toHaveLength(5);
    expect(container.querySelectorAll(".taste-factor-group__icon")).toHaveLength(0);
    // Themes start with the six strongest rows; the rest open through 「すべて表示」.
    expect(container.querySelectorAll(".taste-factor-row")).toHaveLength(32);
    expect(container.querySelectorAll(".taste-factor-group__details:not([hidden])")).toHaveLength(
      0,
    );
    expect(screen.queryByRole("radiogroup")).toBeNull();

    const genreDetailsButton = screen.getByRole("button", { name: "ジャンルの分析の内訳を見る" });
    const themeDetails = screen.getByRole("button", { name: "テーマの詳細設定" });
    const narrativeDetails = screen.getByRole("button", { name: "展開の詳細設定" });
    genreDetailsButton.focus();
    fireEvent.click(genreDetailsButton);
    rerender(<TasteFlow group="genre" onGroupChange={onGroupChange} />);

    const genreDetails = container.querySelector<HTMLElement>("#taste-group-genre-details");
    expect(onGroupChange).toHaveBeenLastCalledWith("genre");
    expect(document.activeElement).toBe(genreDetailsButton);
    expect(genreDetailsButton.getAttribute("aria-expanded")).toBe("true");
    expect(genreDetails?.classList.contains("taste-factor-group__rows--analysis")).toBe(true);
    expect(genreDetails?.className).toContain("md:grid-cols-2");
    expect(genreDetails?.querySelectorAll(".taste-factor-row--analysis")).toHaveLength(10);
    expect(within(genreDetails as HTMLElement).queryByRole("radiogroup")).toBeNull();

    expect(themeDetails.getAttribute("aria-expanded")).toBe("false");
    themeDetails.focus();
    fireEvent.click(themeDetails);
    rerender(<TasteFlow group="theme" onGroupChange={onGroupChange} />);

    expect(onGroupChange).toHaveBeenLastCalledWith("theme");
    expect(document.activeElement).toBe(themeDetails);
    expect(genreDetailsButton.getAttribute("aria-expanded")).toBe("false");
    expect(themeDetails.getAttribute("aria-expanded")).toBe("true");
    expect(container.querySelectorAll(".taste-factor-group__details:not([hidden])")).toHaveLength(
      1,
    );
    expect(screen.getAllByRole("radiogroup").length).toBeGreaterThan(0);

    narrativeDetails.focus();
    fireEvent.click(narrativeDetails);
    rerender(<TasteFlow group="narrative" onGroupChange={onGroupChange} />);
    expect(onGroupChange).toHaveBeenLastCalledWith("narrative");
    expect(document.activeElement).toBe(narrativeDetails);
    expect(themeDetails.getAttribute("aria-expanded")).toBe("false");
    expect(narrativeDetails.getAttribute("aria-expanded")).toBe("true");
    expect(container.querySelectorAll(".taste-factor-group__details:not([hidden])")).toHaveLength(
      1,
    );
    rerender(<TasteFlow onGroupChange={onGroupChange} />);
    expect(narrativeDetails.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(narrativeDetails);
  });

  it("opens the strongest six theme rows first and reveals the rest on demand", async () => {
    const { container } = render(<TasteFlow group="theme" />);
    await screen.findByRole("heading", { name: "あなたの Manga DNA" });
    const details = container.querySelector<HTMLElement>("#taste-group-theme-details");
    if (details === null) throw new Error("Missing theme details");
    const rows = () => [...details.querySelectorAll<HTMLElement>(".taste-factor-row")];
    const rowValues = () =>
      rows().map((row) => {
        const meter = row.querySelector("[role='meter']");
        return meter === null ? -1 : Number(meter.getAttribute("aria-valuenow"));
      });

    expect(rows()).toHaveLength(6);
    expect(rowValues()).toEqual([...rowValues()].sort((left, right) => right - left));
    const total = THEME_TAGS.length;
    const showAll = within(details).getByRole("button", {
      name: tasteStrings.groupShowAllLabel("テーマ", total, false),
    });
    expect(showAll.getAttribute("aria-expanded")).toBe("false");
    expect(showAll.getAttribute("aria-controls")).toBe("taste-group-theme-details");

    fireEvent.click(showAll);
    expect(rows()).toHaveLength(total);
    expect(showAll.getAttribute("aria-expanded")).toBe("true");
    expect(showAll.getAttribute("aria-label")).toBe(
      tasteStrings.groupShowAllLabel("テーマ", total, true),
    );
  });

  it("keeps the focused adjustment visible when the save message covers it", async () => {
    const { container } = render(<TasteFlow group="narrative" />);
    const group = await screen.findByRole("radiogroup", {
      name: tasteStrings.adjustmentGroupLabel("戦略的な展開"),
    });
    const radio = within(group).getByRole("radio", { name: "除外" });
    const label = radio.closest("label");
    const snackbar = container.querySelector(".taste-snackbar");
    if (label === null || snackbar === null) throw new Error("Missing adjustment UI");
    const scrollIntoView = vi.fn();
    Object.defineProperty(label, "scrollIntoView", { value: scrollIntoView });
    vi.spyOn(label, "getBoundingClientRect").mockReturnValue(new DOMRect(200, 600, 60, 44));
    vi.spyOn(snackbar, "getBoundingClientRect").mockReturnValue(new DOMRect(16, 580, 300, 80));

    radio.focus();
    expect(scrollIntoView).toHaveBeenLastCalledWith({ block: "nearest", inline: "nearest" });
    fireEvent.click(radio);
    await waitFor(() =>
      expect(scrollIntoView).toHaveBeenLastCalledWith({ block: "center", inline: "nearest" }),
    );
    expect(document.activeElement).toBe(radio);
  });

  it("renders the selected labelled group and saves Axis adjustments immediately", async () => {
    const { container } = render(<TasteFlow group="narrative" mode="adjust" />);

    expect(await screen.findByRole("heading", { name: "あなたの Manga DNA" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "おすすめを調整" })).toBeTruthy();
    expect(screen.getByText(tasteStrings.modeDescriptions.adjust)).toBeTruthy();
    expect(container.querySelector(".taste-page--with-action")).toBeNull();
    expect(container.querySelector("main")?.classList.contains("page-entry-b")).toBe(true);
    const axes = screen.getByRole("region", { name: tasteStrings.axesHeading });
    expect(axes.querySelector("svg")).toBeNull();
    const axisMeters = within(axes).getAllByRole("meter");
    expect(axisMeters.length).toBeGreaterThan(0);
    expect(axisMeters.length).toBeLessThanOrEqual(8);
    const axisValues = axisMeters.map((meter) => Number(meter.getAttribute("aria-valuenow")));
    expect(axisValues).toEqual([...axisValues].sort((left, right) => right - left));
    const anchorRegion = screen.getByRole("region", { name: tasteStrings.anchorsHeading });
    expect(within(anchorRegion).queryByRole("img")).toBeNull();
    expect(anchorRegion.querySelectorAll("li > a")).toHaveLength(5);
    expect(anchorRegion.querySelector("li > .visually-hidden")).toBeNull();
    expect(anchorRegion.innerHTML).not.toContain("linear-gradient");
    const topPreferenceGrid = container.querySelector(".taste-top-summary__grid");
    expect(topPreferenceGrid?.tagName).toBe("OL");
    expect(topPreferenceGrid?.className).toContain("grid-cols-1");
    expect(topPreferenceGrid?.querySelectorAll(":scope > li")).toHaveLength(3);
    const topPreferenceCards = container.querySelectorAll(".taste-top-card");
    expect(topPreferenceCards).toHaveLength(3);
    expect(
      [...topPreferenceCards].every(
        (card, index) =>
          card.querySelector("h3 > span")?.className.includes("line-clamp-2") === true &&
          card.querySelector(".taste-top-card__rank")?.textContent === String(index + 1) &&
          card.querySelector(".taste-top-card__rank")?.getAttribute("aria-hidden") !== "true" &&
          card.querySelector(".taste-top-card__level")?.className.includes("--font-size-14") ===
            true &&
          card.querySelector("svg.dna-ink-line")?.getAttribute("aria-hidden") === "true" &&
          card.querySelector("p") !== null,
      ),
    ).toBe(true);
    expect(container.querySelector(".taste-top-card .taste-evidence-cover")).toBeNull();
    expect([...topPreferenceCards].some((card) => card.textContent?.includes("『作品"))).toBe(true);
    const groupHeadings = [...container.querySelectorAll(".taste-factor-group h3")];
    expect(groupHeadings.map((heading) => heading.textContent)).toEqual([
      "ジャンル",
      "テーマ",
      "展開",
      "トーン・関係",
      "作画",
    ]);
    expect(container.querySelectorAll("section.taste-factor-group")).toHaveLength(5);
    expect(container.querySelector("details.taste-factor-group")).toBeNull();
    expect(
      screen.getByRole("button", { name: "展開の詳細設定を閉じる" }).getAttribute("aria-expanded"),
    ).toBe("true");
    expect(container.querySelectorAll(".taste-factor-group__details:not([hidden])")).toHaveLength(
      1,
    );
    const headingIds = groupHeadings.map((heading) => heading.id);
    expect(new Set(headingIds).size).toBe(headingIds.length);
    expect(screen.getAllByRole("radiogroup")).toHaveLength(6);
    const expectedStrategy = summarizeMangaDna(
      (testState.catalog as ReturnType<typeof createTestCatalog>).works,
      testState.userWorks,
    ).axes.find((preference) => preference.factorId === "strategy")?.value;
    const strategyMeter = screen.getByRole("meter", { name: "戦略的な展開" });
    expect(Number(strategyMeter?.getAttribute("aria-valuenow"))).toBe(expectedStrategy);
    const strategyMeterValueBeforeAdjustment = strategyMeter.getAttribute("aria-valuenow");
    const strategyMeterTransformBeforeAdjustment = strategyMeter
      .querySelector(".taste-factor-bar__fill")
      ?.getAttribute("style");

    const narrativePanel = container.querySelector("#taste-group-narrative-details") as HTMLElement;
    const columnHeadings = narrativePanel.querySelector(".taste-factor-group__column-headings");
    expect(columnHeadings?.getAttribute("aria-hidden")).toBe("true");
    expect(columnHeadings?.textContent).toContain("分析した好み");
    expect(columnHeadings?.textContent).toContain("おすすめへの反映");
    expect(narrativePanel.querySelectorAll(".taste-factor-row__adjustment-label")).toHaveLength(6);
    expect(
      [...narrativePanel.querySelectorAll(".taste-factor-row__adjustment-label")].every(
        (label) => label.textContent === "おすすめへの反映",
      ),
    ).toBe(true);

    const strategyGroup = screen.getByRole("radiogroup", {
      name: "「戦略的な展開」のおすすめへの反映を設定",
    });
    const strategyRadios = within(strategyGroup).getAllByRole("radio");
    expect(strategyRadios).toHaveLength(5);
    expect(
      ["とても好き", "好き", "自動", "控えめに", "除外"].map((label) =>
        within(strategyGroup).getByRole("radio", { name: label }).getAttribute("aria-checked"),
      ),
    ).toEqual(["false", "false", "true", "false", "false"]);
    expect(strategyGroup.className).toContain("flex-nowrap");
    expect(strategyGroup.className).not.toContain("rounded-");
    expect(strategyGroup.className).not.toContain("border-line");
    expect(strategyGroup.querySelectorAll(".taste-adjustment-option__marker")).toHaveLength(5);
    expect(
      [...strategyGroup.querySelectorAll(".taste-adjustment-option__marker")].every(
        (marker) => marker.getAttribute("aria-hidden") === "true",
      ),
    ).toBe(true);
    expect(
      within(strategyGroup)
        .getByRole("radio", { name: "除外" })
        .closest("label")
        ?.className.includes("border-l"),
    ).toBe(true);
    expect(screen.queryByRole("region", { name: tasteStrings.previewBefore })).toBeNull();
    const afterPreview = screen.getByRole("region", { name: tasteStrings.previewAfter });
    expect(
      within(afterPreview).getByRole("link", { name: mediaStrings.openDetails("作品6") }),
    ).toBeTruthy();
    expect(within(afterPreview).queryByText("work-6")).toBeNull();
    fireEvent.click(within(strategyGroup).getByRole("radio", { name: "除外" }));

    await waitFor(() => {
      expect(testState.saveProfileAdjustments).toHaveBeenCalledWith({
        axes: { strategy: "exclude" },
        themes: {},
      });
      expect(testState.saveProfileAdjustments).toHaveBeenCalledTimes(1);
      expect(
        within(strategyGroup).getByRole("radio", { name: "除外" }).getAttribute("aria-checked"),
      ).toBe("true");
      expect(
        screen.getByText("「戦略的な展開」のおすすめへの反映を「除外」に変更しました。"),
      ).toBeTruthy();
      const strategyMeterAfterAdjustment = screen.getByRole("meter", {
        name: "戦略的な展開",
      });
      expect(strategyMeterAfterAdjustment.getAttribute("aria-valuenow")).toBe(
        strategyMeterValueBeforeAdjustment,
      );
      expect(
        strategyMeterAfterAdjustment
          .querySelector(".taste-factor-bar__fill")
          ?.getAttribute("style"),
      ).toBe(strategyMeterTransformBeforeAdjustment);
      expect(container.querySelector(".taste-factor-bar--highlighted")).toBeNull();
      const beforePreview = screen.getByRole("region", { name: tasteStrings.previewBefore });
      expect(
        within(beforePreview).getByRole("link", { name: mediaStrings.openDetails("作品6") }),
      ).toBeTruthy();
      expect(
        within(afterPreview).queryByRole("link", { name: mediaStrings.openDetails("作品6") }),
      ).toBeNull();
      expect(
        within(afterPreview).getByRole("link", { name: mediaStrings.openDetails("作品7") }),
      ).toBeTruthy();
      expect(screen.getByRole("region", { name: tasteStrings.previewAfter })).toBe(afterPreview);
    });
  });

  it("restores stored adjustments on remount and rolls back a rejected save", async () => {
    testState.adjustments = { axes: { strategy: "like" }, themes: {} };
    testState.saveProfileAdjustments.mockRejectedValue(new Error("write failed"));
    const view = render(<TasteFlow group="narrative" mode="adjust" />);

    const group = await screen.findByRole("radiogroup", {
      name: "「戦略的な展開」のおすすめへの反映を設定",
    });
    expect(within(group).getByRole("radio", { name: "好き" }).getAttribute("aria-checked")).toBe(
      "true",
    );
    fireEvent.click(within(group).getByRole("radio", { name: "除外" }));

    expect((await screen.findByRole("alert")).textContent).toContain(
      "おすすめの設定を保存できませんでした",
    );
    expect(within(group).getByRole("radio", { name: "好き" }).getAttribute("aria-checked")).toBe(
      "true",
    );

    view.unmount();
    render(<TasteFlow group="narrative" mode="adjust" />);
    const remountedGroup = await screen.findByRole("radiogroup", {
      name: "「戦略的な展開」のおすすめへの反映を設定",
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
    expect(screen.queryByRole("heading", { name: tasteStrings.coach.heading })).toBeNull();
    expect(document.querySelector('img[src="/media/taste-dna-coach.png"]')).toBeNull();
    expect(window.sessionStorage.getItem("konocomics:manga-dna-reveal:v1")).toBe(
      "2026-08-14T02:00:00.000Z",
    );
  });

  it.each(["get", "set", "readback"] as const)(
    "fails closed to the complete static result when sessionStorage %s cannot verify the claim",
    async (failure) => {
      window.history.replaceState({}, "", "/taste?reveal=1");

      if (failure === "get") {
        vi.spyOn(window, "sessionStorage", "get").mockReturnValue(
          createSessionStorageStub({
            getItem: () => {
              throw new Error("get failed");
            },
          }),
        );
      } else if (failure === "set") {
        vi.spyOn(window, "sessionStorage", "get").mockReturnValue(
          createSessionStorageStub({
            setItem: () => {
              throw new Error("set failed");
            },
          }),
        );
      } else {
        vi.spyOn(window, "sessionStorage", "get").mockReturnValue(
          createSessionStorageStub({ getItem: () => null }),
        );
      }

      render(<TasteFlow onRevealConsumed={consumeReveal} reveal="1" />);

      expect(await screen.findByRole("link", { name: "おすすめを見る" })).toBeTruthy();
      expect(window.location.pathname + window.location.search).toBe("/taste");
      expect(document.querySelector('.dna-ink-line[data-draw="true"]')).toBeNull();
      expect(document.querySelector(".taste-factor-bar__fill--reveal")).toBeNull();
    },
  );

  it("does not animate an unresolved preference and never starts later for that completion", async () => {
    motionState.reduced = null;
    window.history.replaceState({}, "", "/taste?reveal=1");

    const view = render(<TasteFlow onRevealConsumed={consumeReveal} reveal="1" />);

    expect(await screen.findByRole("link", { name: "おすすめを見る" })).toBeTruthy();
    expect(window.location.pathname + window.location.search).toBe("/taste");
    expect(document.querySelector('.dna-ink-line[data-draw="true"]')).toBeNull();

    motionState.reduced = false;
    view.rerender(<TasteFlow onRevealConsumed={consumeReveal} />);
    await act(async () => Promise.resolve());
    expect(document.querySelector('.dna-ink-line[data-draw="true"]')).toBeNull();
  });

  it("finishes an active reveal immediately when reduced motion becomes requested", async () => {
    window.history.replaceState({}, "", "/taste?reveal=1");

    render(<TasteFlow onRevealConsumed={consumeReveal} reveal="1" />);
    expect(await screen.findByRole("link", { name: "おすすめを見る" })).toBeTruthy();
    expect(document.querySelector('.dna-ink-line[data-draw="true"]')).toBeTruthy();

    expect(motionPreferenceListener).not.toBeNull();
    act(() => motionPreferenceListener?.({ matches: true }));

    await waitFor(() => {
      expect(window.location.pathname + window.location.search).toBe("/taste");
      expect(document.querySelector('.dna-ink-line[data-draw="true"]')).toBeNull();
      expect(document.querySelector(".taste-factor-bar__fill--reveal")).toBeNull();
    });
    expect(screen.getByRole("link", { name: "おすすめを見る" })).toBeTruthy();
  });
});
