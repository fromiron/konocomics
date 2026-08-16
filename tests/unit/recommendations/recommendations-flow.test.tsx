// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { type ReactNode, useEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import catalogJson from "@/data/generated/catalog-v1.json";
import recommendationContextJson from "@/data/generated/recommendation-context-v1.json";
import { catalogV1Schema } from "@/domain/catalog/schema";
import type { RecommendationPolicies, UserWorkRecord } from "@/domain/profile/types";
import { recommendationContextSchema } from "@/domain/recommendation/context-schema";
import type { RecommendationPlanEntry } from "@/domain/recommendation/types";
import type { RecommendationMotionListProps } from "@/features/recommendations/recommendation-motion-list";
import { RecommendationsFlow } from "@/features/recommendations/recommendations-flow";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    className,
    params,
    to,
  }: {
    children: ReactNode;
    className?: string;
    params?: { workId: string };
    to: string;
  }) => (
    <a
      className={className}
      href={params === undefined ? to : to.replace("$workId", params.workId)}
    >
      {children}
    </a>
  ),
}));

const testState = vi.hoisted(() => ({
  buildPlan: vi.fn(),
  coverPriorities: [] as boolean[],
  coverUrls: [] as Array<string | null | undefined>,
  adjustments: { axes: {}, themes: {} } as const,
  getRecommendationCache: vi.fn(),
  getProviderCache: vi.fn(),
  loadMotionList: vi.fn(),
  motionListRenders: [] as string[][],
  policies: {
    preferCompleted: false,
    preferHidden: false,
    preferVerified: false,
    excludeIncomplete: false,
  } as RecommendationPolicies,
  savePolicies: vi.fn(),
  saveProviderCache: vi.fn(),
  saveRecommendationCache: vi.fn(),
  saveUserWork: vi.fn(),
  userWorks: [] as UserWorkRecord[],
  catalog: null as unknown,
}));

let motionPreferenceListener: ((event: { matches: boolean }) => void) | null = null;

function TestMotionList({ items, shortage }: RecommendationMotionListProps) {
  testState.motionListRenders.push(items.map((item) => item.workId));
  return (
    <>
      {items.map((item) => (
        <li data-recommendation-work-id={item.workId} key={item.workId}>
          {item.content}
        </li>
      ))}
      {shortage}
    </>
  );
}

vi.mock("@/domain/recommendation/rank", () => ({
  buildRecommendationPlan: testState.buildPlan,
  selectRecommendationPlanEntries: (plan: readonly RecommendationPlanEntry[]) => plan.slice(0, 10),
  backfillRecommendationPlanEntries: ({
    excludedWorkIds,
    plan,
    survivors,
  }: {
    excludedWorkIds: readonly string[];
    plan: readonly RecommendationPlanEntry[];
    survivors: readonly RecommendationPlanEntry[];
  }) => {
    const excluded = new Set(excludedWorkIds);
    const survivorIds = new Set(survivors.map((entry) => entry.workId));
    const next = [...survivors];
    for (const entry of plan) {
      if (next.length >= 10) break;
      if (!excluded.has(entry.workId) && !survivorIds.has(entry.workId)) next.push(entry);
    }
    return next;
  },
}));

vi.mock("@/components/cover/CoverImage", () => ({
  CoverImage: function MockCoverImage({
    className,
    coverUrl,
    onSettled,
    priority = false,
    title,
  }: {
    className?: string;
    coverUrl?: string | null;
    onSettled?: () => void;
    priority?: boolean;
    title: string;
  }) {
    testState.coverPriorities.push(priority);
    testState.coverUrls.push(coverUrl);
    useEffect(() => {
      onSettled?.();
    }, [onSettled]);
    return (
      <span
        aria-label={title}
        className={className}
        data-cover-priority={priority ? "high" : "normal"}
        data-cover-settlement={onSettled === undefined ? "deferred" : "tracked"}
        data-cover-url={coverUrl ?? undefined}
        role="img"
      />
    );
  },
}));

vi.mock("@/features/catalog/catalog-provider", () => ({
  useCatalog: () => testState.catalog,
}));

vi.mock("@/features/recommendations/recommendation-motion-loader", () => ({
  loadRecommendationMotionList: testState.loadMotionList,
}));

vi.mock("@/infrastructure/db", () => ({
  usePersistence: () => ({
    status: { state: "ready", mode: "indexeddb", warning: null },
    userWorks: testState.userWorks,
    adjustments: testState.adjustments,
    policies: testState.policies,
    getRecommendationCache: testState.getRecommendationCache,
    getProviderCache: testState.getProviderCache,
    saveRecommendationCache: testState.saveRecommendationCache,
    savePolicies: testState.savePolicies,
    saveProviderCache: testState.saveProviderCache,
    saveUserWork: testState.saveUserWork,
  }),
}));

const catalog = catalogV1Schema.parse(catalogJson);
const recommendationContext = recommendationContextSchema.parse(recommendationContextJson);
const INPUT_HASH = "0".repeat(64);

const representativeWorkByIsbn = new Map(
  catalog.works.flatMap((work) => {
    const representativeVolumeId = catalog.representativeVolumeByWorkId[work.id];
    const volume = catalog.volumes.find((candidate) => candidate.id === representativeVolumeId);
    return volume === undefined ? [] : [[volume.isbn, work] as const];
  }),
);

function freshProviderRecord(isbn: string) {
  const work = representativeWorkByIsbn.get(isbn);
  if (work === undefined) return null;
  return {
    workId: work.id,
    provider: "rakuten" as const,
    isbn,
    imageUrl: `https://thumbnail.image.rakuten.co.jp/${work.id}.jpg`,
    fetchedAt: "2026-08-15T00:00:00.000Z",
    commercialExpiresAt: "2099-08-15T00:00:00.000Z",
    metadataExpiresAt: "2099-08-15T00:00:00.000Z",
  };
}

function makePlan(): RecommendationPlanEntry[] {
  const eligible = catalog.works.filter(
    (work) =>
      work.eligibility.recommendationEligible &&
      recommendationContext.constraintByWorkId[work.id] !== undefined,
  );
  const anchor = eligible[0];
  if (anchor === undefined) throw new Error("Expected an anchor fixture");
  return eligible.slice(5, 17).map((work, index) => {
    const metadata = recommendationContext.constraintByWorkId[work.id];
    if (metadata === undefined) throw new Error(`Missing recommendation metadata: ${work.id}`);
    return {
      workId: work.id,
      tasteScore: 0.9 - index * 0.01,
      confidence: 0.8,
      confidenceLevel: "normal",
      bestAnchorId: anchor.id,
      contributions: [
        {
          source: "similarity",
          group: "narrative",
          factorId: "strategy",
          value: 0.2,
          anchorWorkIds: [anchor.id],
          explainable: true,
        },
      ],
      penaltiesApplied: [],
      isDiscovery: metadata.catalogRole === "discovery",
      majorThemeKey: `fixture:${work.id}`,
      seriesGroupId: metadata.seriesGroupId ?? work.id,
    };
  });
}

function cacheRecord(plan: readonly RecommendationPlanEntry[]) {
  return {
    schemaVersion: 1 as const,
    engineVersion: "taste-v1" as const,
    inputHash: INPUT_HASH,
    plan: [...plan],
    computedAt: "2026-08-14T10:00:00+09:00",
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, reject, resolve };
}

beforeEach(() => {
  const plan = makePlan();
  const anchorIds = catalog.works.slice(0, 5).map((work) => work.id);
  testState.catalog = catalog;
  testState.userWorks = anchorIds.map((workId) => ({
    workId,
    readingState: "completed",
    reaction: "liked",
    updatedAt: "2026-08-14T09:00:00+09:00",
  }));
  testState.policies = {
    preferCompleted: false,
    preferHidden: false,
    preferVerified: false,
    excludeIncomplete: false,
  };
  testState.buildPlan.mockReset();
  testState.coverPriorities.length = 0;
  testState.coverUrls.length = 0;
  testState.buildPlan.mockReturnValue(plan);
  testState.getRecommendationCache.mockReset();
  testState.getRecommendationCache.mockResolvedValue(cacheRecord(plan));
  testState.saveRecommendationCache.mockReset();
  testState.saveRecommendationCache.mockResolvedValue(undefined);
  testState.getProviderCache.mockReset();
  testState.getProviderCache.mockImplementation(async (isbn: string) => freshProviderRecord(isbn));
  testState.saveProviderCache.mockReset();
  testState.saveProviderCache.mockImplementation(async (record) => record);
  testState.savePolicies.mockReset();
  testState.savePolicies.mockResolvedValue(undefined);
  testState.saveUserWork.mockReset();
  testState.saveUserWork.mockImplementation(async (record: UserWorkRecord) => record);
  testState.loadMotionList.mockReset();
  testState.loadMotionList.mockResolvedValue(TestMotionList);
  testState.motionListRenders.length = 0;
  motionPreferenceListener = null;
  vi.stubGlobal("crypto", {
    subtle: {
      digest: vi.fn().mockResolvedValue(new Uint8Array(32).buffer),
    },
  });
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    return window.setTimeout(() => callback(performance.now()), 0);
  });
  vi.stubGlobal("cancelAnimationFrame", (handle: number) => window.clearTimeout(handle));
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => {
      motionPreferenceListener = listener;
    },
    removeEventListener: () => undefined,
  }));
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value() {
      this.setAttribute("open", "");
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    value() {
      this.removeAttribute("open");
    },
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("RecommendationsFlow", () => {
  it("renders a cache hit as a grounded list with stable provenance hooks", async () => {
    const { container } = render(<RecommendationsFlow />);

    const list = await waitFor(() => {
      const element = container.querySelector("ul.recommendations-list");
      expect(element).toBeTruthy();
      return element as HTMLUListElement;
    });
    expect(within(list).getAllByRole("listitem").slice(0, 10)).toHaveLength(10);
    expect(testState.buildPlan).not.toHaveBeenCalled();
    const cards = list.querySelectorAll("li[data-recommendation-work-id]");
    expect(cards).toHaveLength(10);
    const lead = cards[0]?.querySelector("[data-contribution-summary]");
    expect(lead?.textContent).toContain("頭脳で解決する展開");
    expect(JSON.parse(lead?.getAttribute("data-contribution-summary") ?? "null")).toMatchObject({
      text: lead?.textContent,
      source: "similarity",
      group: "narrative",
      factorId: "strategy",
    });
    const firstCard = cards[0] as HTMLElement;
    const identityLink = firstCard.querySelector<HTMLAnchorElement>(
      ".recommendation-card__identity",
    );
    expect(identityLink?.getAttribute("href")).toBe(
      `/works/${firstCard.getAttribute("data-recommendation-work-id")}`,
    );
    expect(identityLink?.querySelector("h2")).toBeTruthy();
    expect(identityLink?.querySelector("button, details")).toBeNull();
    expect(within(firstCard).getAllByRole("button")).toHaveLength(3);
    expect(container.querySelector("main")?.getAttribute("data-recommendation-input-hash")).toBe(
      INPUT_HASH,
    );
    expect(screen.getAllByRole("checkbox", { name: /優先/u })).toHaveLength(3);
    expect(screen.queryByRole("checkbox", { name: /未完/u })).toBeNull();
    expect(list.getAttribute("data-recommendation-motion")).toBe("static");
    expect(testState.loadMotionList).not.toHaveBeenCalled();
    expect(
      firstCard.querySelector(".recommendation-card__cover")?.getAttribute("data-cover-priority"),
    ).toBe("high");
    expect(
      cards[1]?.querySelector(".recommendation-card__cover")?.getAttribute("data-cover-priority"),
    ).toBe("normal");
    expect(
      cards[1]?.querySelector(".recommendation-card__cover")?.getAttribute("data-cover-settlement"),
    ).toBe("deferred");
    await waitFor(() => {
      expect(
        firstCard.querySelector(".recommendation-card__cover")?.getAttribute("data-cover-url"),
      ).toBe(`https://thumbnail.image.rakuten.co.jp/${makePlan()[0]!.workId}.jpg`);
      expect(
        firstCard
          .querySelector(".recommendation-card__cover")
          ?.getAttribute("data-cover-settlement"),
      ).toBe("tracked");
    });

    const completed = within(firstCard).getByRole("button", { name: "読んだ" });
    fireEvent.mouseOver(completed);
    fireEvent.focus(completed);
    expect(testState.loadMotionList).not.toHaveBeenCalled();
  });

  it("keeps an honest candidate-shortage state instead of weakening list constraints", async () => {
    const shortPlan = makePlan().slice(0, 9);
    testState.getRecommendationCache.mockResolvedValue(cacheRecord(shortPlan));

    const { container } = render(<RecommendationsFlow />);

    await waitFor(() => {
      expect(container.querySelectorAll("li[data-recommendation-work-id]")).toHaveLength(9);
    });
    expect(screen.getByRole("heading", { name: "おすすめ候補が少なくなっています" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "好きな作品を追加" }).getAttribute("href")).toBe(
      "/onboarding",
    );
    expect(screen.getByRole("link", { name: "好みを見直す" }).getAttribute("href")).toBe("/taste");
  });

  it("treats a referentially invalid cache plan as a miss and replaces it", async () => {
    const validPlan = makePlan();
    testState.getRecommendationCache.mockResolvedValue(
      cacheRecord([{ ...validPlan[0]!, workId: "missing-current-work" }]),
    );
    testState.buildPlan.mockReturnValue(validPlan);

    const { container } = render(<RecommendationsFlow />);

    await waitFor(() => {
      expect(container.querySelectorAll("li[data-recommendation-work-id]")).toHaveLength(10);
    });
    expect(testState.buildPlan).toHaveBeenCalledTimes(1);
    expect(testState.saveRecommendationCache).toHaveBeenCalledWith(
      expect.objectContaining({ inputHash: INPUT_HASH, plan: validPlan }),
    );
    expect(
      container.querySelector("[data-recommendation-work-id='missing-current-work']"),
    ).toBeNull();
  });

  it("waits 200ms before showing calculation skeletons", async () => {
    vi.useFakeTimers();
    const pendingCache = deferred<ReturnType<typeof cacheRecord>>();
    testState.getRecommendationCache.mockReturnValue(pendingCache.promise);
    render(<RecommendationsFlow />);

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.queryByText("おすすめを計算しています…")).toBeNull();
    act(() => vi.advanceTimersByTime(201));
    expect(screen.getByText("おすすめを計算しています…")).toBeTruthy();
    expect(document.querySelectorAll(".recommendations-skeleton ol li")).toHaveLength(10);

    await act(async () => {
      pendingCache.resolve(cacheRecord(makePlan()));
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(document.querySelectorAll("li[data-recommendation-work-id]")).toHaveLength(10);
  });

  it("keeps a card until the completed base record is saved, then backfills and restores focus", async () => {
    const baseWrite = deferred<UserWorkRecord>();
    const motionLoad = deferred<typeof TestMotionList>();
    testState.saveUserWork.mockReturnValueOnce(baseWrite.promise);
    testState.loadMotionList.mockReturnValueOnce(motionLoad.promise);
    const { container } = render(<RecommendationsFlow />);
    await waitFor(() => {
      expect(container.querySelectorAll("li[data-recommendation-work-id]")).toHaveLength(10);
    });
    const firstCard = container.querySelector("li[data-recommendation-work-id]");
    const firstWorkId = firstCard?.getAttribute("data-recommendation-work-id");
    if (firstWorkId === null || firstWorkId === undefined) throw new Error("Missing first card");

    const completedButton = within(firstCard as HTMLElement).getByRole("button", {
      name: "読んだ",
    });
    act(() => {
      fireEvent.pointerDown(completedButton);
      fireEvent.keyDown(completedButton, { key: "Enter" });
    });
    fireEvent.click(completedButton);
    fireEvent.click(completedButton);
    expect(testState.loadMotionList).toHaveBeenCalledTimes(1);
    expect(testState.saveUserWork).toHaveBeenCalledTimes(1);
    expect(container.querySelector(`[data-recommendation-work-id='${firstWorkId}']`)).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(testState.saveUserWork).toHaveBeenCalledWith({
      workId: firstWorkId,
      readingState: "completed",
      updatedAt: expect.any(String),
    });

    await act(async () => {
      baseWrite.resolve(testState.saveUserWork.mock.calls[0]![0] as UserWorkRecord);
      await baseWrite.promise;
    });
    expect(container.querySelector(`[data-recommendation-work-id='${firstWorkId}']`)).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(
      container
        .querySelector("ul.recommendations-list")
        ?.getAttribute("data-recommendation-motion"),
    ).toBe("static");

    await act(async () => {
      motionLoad.resolve(TestMotionList);
      await motionLoad.promise;
    });
    expect(await screen.findByRole("dialog")).toBeTruthy();
    expect(
      container
        .querySelector("ul.recommendations-list")
        ?.getAttribute("data-recommendation-motion"),
    ).toBe("enabled");
    expect(testState.motionListRenders[0]).toContain(firstWorkId);
    expect(testState.motionListRenders.at(-1)).not.toContain(firstWorkId);
    expect(container.querySelector(`[data-recommendation-work-id='${firstWorkId}']`)).toBeNull();
    expect(
      container.querySelector(`[data-recommendation-work-id='${makePlan()[10]!.workId}']`),
    ).toBeTruthy();
    expect(screen.getByText("1件を除外し、新しい候補を追加しました")).toBeTruthy();

    fireEvent.click(screen.getByRole("radio", { name: "最高" }));
    fireEvent.click(screen.getByRole("button", { name: "保存" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(testState.saveUserWork).toHaveBeenLastCalledWith({
      workId: firstWorkId,
      readingState: "completed",
      reaction: "favorite",
      updatedAt: (testState.saveUserWork.mock.calls[0]![0] as UserWorkRecord).updatedAt,
    });
    await waitFor(() => {
      expect(document.activeElement).toBe(
        container.querySelector(`[data-recommendation-work-id='${makePlan()[1]!.workId}'] article`),
      );
    });
  });

  it("keeps removal, backfill, dialog, and focus static when the motion import fails", async () => {
    testState.loadMotionList.mockRejectedValueOnce(new Error("motion chunk failed"));
    const { container } = render(<RecommendationsFlow />);
    await waitFor(() => {
      expect(container.querySelectorAll("li[data-recommendation-work-id]")).toHaveLength(10);
    });
    const firstCard = container.querySelector("li[data-recommendation-work-id]") as HTMLElement;
    const removedWorkId = firstCard.dataset.recommendationWorkId;
    const focusWorkId = makePlan()[1]!.workId;

    fireEvent.pointerDown(within(firstCard).getByRole("button", { name: "読んだ" }));
    fireEvent.click(within(firstCard).getByRole("button", { name: "読んだ" }));

    expect(await screen.findByRole("dialog")).toBeTruthy();
    expect(testState.loadMotionList).toHaveBeenCalledTimes(1);
    expect(testState.saveUserWork).toHaveBeenCalledTimes(1);
    expect(
      container
        .querySelector("ul.recommendations-list")
        ?.getAttribute("data-recommendation-motion"),
    ).toBe("static");
    expect(container.querySelector(`[data-recommendation-work-id='${removedWorkId}']`)).toBeNull();
    expect(
      container.querySelector(`[data-recommendation-work-id='${makePlan()[10]!.workId}']`),
    ).toBeTruthy();
    expect(screen.getByText("1件を除外し、新しい候補を追加しました")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "スキップ" }));
    await waitFor(() => {
      expect(document.activeElement).toBe(
        container.querySelector(`[data-recommendation-work-id='${focusWorkId}'] article`),
      );
    });
  });

  it.each(["reduced", "missing"] as const)(
    "uses the static mutation path when matchMedia is %s",
    async (motionEnvironment) => {
      if (motionEnvironment === "missing") {
        vi.stubGlobal("matchMedia", undefined);
      } else {
        vi.stubGlobal("matchMedia", () => ({
          matches: true,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
        }));
      }
      const { container } = render(<RecommendationsFlow />);
      await waitFor(() => {
        expect(container.querySelectorAll("li[data-recommendation-work-id]")).toHaveLength(10);
      });
      const firstCard = container.querySelector("li[data-recommendation-work-id]") as HTMLElement;

      fireEvent.pointerDown(within(firstCard).getByRole("button", { name: "興味なし" }));
      fireEvent.click(within(firstCard).getByRole("button", { name: "興味なし" }));

      expect(await screen.findByRole("dialog")).toBeTruthy();
      expect(testState.loadMotionList).not.toHaveBeenCalled();
      expect(testState.saveUserWork).toHaveBeenCalledTimes(1);
      expect(
        container
          .querySelector("ul.recommendations-list")
          ?.getAttribute("data-recommendation-motion"),
      ).toBe("static");
    },
  );

  it("restores the focused action when an active motion island becomes reduced", async () => {
    const { container } = render(<RecommendationsFlow />);
    await waitFor(() => {
      expect(container.querySelectorAll("li[data-recommendation-work-id]")).toHaveLength(10);
    });
    const firstCard = container.querySelector("li[data-recommendation-work-id]") as HTMLElement;
    const completed = within(firstCard).getByRole("button", { name: "読んだ" });
    await act(async () => {
      fireEvent.pointerDown(completed);
      await Promise.resolve();
    });
    fireEvent.click(completed);
    expect(await screen.findByRole("dialog")).toBeTruthy();
    expect(
      container
        .querySelector("ul.recommendations-list")
        ?.getAttribute("data-recommendation-motion"),
    ).toBe("enabled");
    fireEvent.click(screen.getByRole("button", { name: "スキップ" }));
    const survivorWorkId = makePlan()[1]!.workId;
    const survivor = container.querySelector(
      `[data-recommendation-work-id='${survivorWorkId}']`,
    ) as HTMLElement;
    const hidden = within(survivor).getByRole("button", { name: "興味なし" });
    hidden.focus();
    expect(document.activeElement).toBe(hidden);
    const listener = motionPreferenceListener;
    if (listener === null) throw new Error("Expected a reduced-motion listener");

    act(() => listener({ matches: true }));

    await waitFor(() => {
      expect(
        container
          .querySelector("ul.recommendations-list")
          ?.getAttribute("data-recommendation-motion"),
      ).toBe("static");
      expect(document.activeElement).toBe(
        within(
          container.querySelector(
            `[data-recommendation-work-id='${survivorWorkId}']`,
          ) as HTMLElement,
        ).getByRole("button", { name: "興味なし" }),
      );
    });
  });

  it("finishes a cold pending removal statically when reduced motion is requested", async () => {
    const motionLoad = deferred<typeof TestMotionList>();
    testState.loadMotionList.mockReturnValueOnce(motionLoad.promise);
    const { container } = render(<RecommendationsFlow />);
    await waitFor(() => {
      expect(container.querySelectorAll("li[data-recommendation-work-id]")).toHaveLength(10);
    });
    const firstCard = container.querySelector("li[data-recommendation-work-id]") as HTMLElement;
    const removedWorkId = firstCard.dataset.recommendationWorkId;
    const completed = within(firstCard).getByRole("button", { name: "読んだ" });

    fireEvent.pointerDown(completed);
    fireEvent.click(completed);
    await waitFor(() => expect(testState.saveUserWork).toHaveBeenCalledTimes(1));
    expect(
      container.querySelector(`[data-recommendation-work-id='${removedWorkId}']`),
    ).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();

    const listener = motionPreferenceListener;
    if (listener === null) throw new Error("Expected a reduced-motion listener");
    act(() => listener({ matches: true }));
    await act(async () => {
      motionLoad.resolve(TestMotionList);
      await motionLoad.promise;
    });

    expect(await screen.findByRole("dialog")).toBeTruthy();
    expect(
      container
        .querySelector("ul.recommendations-list")
        ?.getAttribute("data-recommendation-motion"),
    ).toBe("static");
    expect(container.querySelector(`[data-recommendation-work-id='${removedWorkId}']`)).toBeNull();
    expect(
      container.querySelector(`[data-recommendation-work-id='${makePlan()[10]!.workId}']`),
    ).toBeTruthy();
    expect(testState.loadMotionList).toHaveBeenCalledTimes(1);
    expect(testState.motionListRenders).toEqual([]);

    fireEvent.click(screen.getByRole("button", { name: "スキップ" }));
    await waitFor(() => {
      expect(document.activeElement).toBe(
        container.querySelector(`[data-recommendation-work-id='${makePlan()[1]!.workId}'] article`),
      );
    });
  });

  it("drops the motion island before a policy recompute without requesting it again", async () => {
    const { container } = render(<RecommendationsFlow />);
    await waitFor(() => {
      expect(container.querySelectorAll("li[data-recommendation-work-id]")).toHaveLength(10);
    });
    const firstCard = container.querySelector("li[data-recommendation-work-id]") as HTMLElement;
    const completed = within(firstCard).getByRole("button", { name: "読んだ" });
    await act(async () => {
      fireEvent.pointerDown(completed);
      await Promise.resolve();
    });
    fireEvent.click(completed);
    expect(await screen.findByRole("dialog")).toBeTruthy();
    expect(
      container
        .querySelector("ul.recommendations-list")
        ?.getAttribute("data-recommendation-motion"),
    ).toBe("enabled");
    fireEvent.click(screen.getByRole("button", { name: "スキップ" }));

    fireEvent.click(screen.getByRole("checkbox", { name: "完結作を優先" }));

    await waitFor(() => {
      expect(testState.savePolicies).toHaveBeenCalledTimes(1);
      expect(
        container
          .querySelector("ul.recommendations-list")
          ?.getAttribute("data-recommendation-motion"),
      ).toBe("static");
    });
    expect(testState.loadMotionList).toHaveBeenCalledTimes(1);
  });

  it("keeps failed feedback cards and records selected interest reasons without inventing a skip reason", async () => {
    testState.saveUserWork.mockRejectedValueOnce(new Error("write failed"));
    const { container } = render(<RecommendationsFlow />);
    await waitFor(() => {
      expect(container.querySelectorAll("li[data-recommendation-work-id]")).toHaveLength(10);
    });
    let firstCard = container.querySelector("li[data-recommendation-work-id]") as HTMLElement;
    const failedWorkId = firstCard.dataset.recommendationWorkId;
    fireEvent.click(within(firstCard).getByRole("button", { name: "興味なし" }));
    expect((await screen.findByRole("alert")).textContent).toContain("カードは変更していません");
    expect(container.querySelector(`[data-recommendation-work-id='${failedWorkId}']`)).toBeTruthy();
    expect(testState.loadMotionList).toHaveBeenCalledTimes(1);
    expect(
      container
        .querySelector("ul.recommendations-list")
        ?.getAttribute("data-recommendation-motion"),
    ).toBe("static");

    firstCard = container.querySelector("li[data-recommendation-work-id]") as HTMLElement;
    const selectedReasonWorkId = firstCard.dataset.recommendationWorkId;
    fireEvent.click(within(firstCard).getByRole("button", { name: "興味なし" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("checkbox", { name: "展開が遅い" }));
    fireEvent.click(within(dialog).getByRole("button", { name: "保存" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(testState.saveUserWork).toHaveBeenLastCalledWith({
      workId: selectedReasonWorkId,
      readingState: "hidden",
      reaction: "disliked",
      negativeReasons: ["tooSlow"],
      updatedAt: expect.any(String),
    });

    const nextCard = [
      ...container.querySelectorAll<HTMLElement>("li[data-recommendation-work-id]"),
    ].find(
      (card) =>
        card.dataset.recommendationWorkId !== selectedReasonWorkId &&
        !within(card).getByRole<HTMLButtonElement>("button", { name: "興味なし" }).disabled,
    );
    if (nextCard === undefined) throw new Error("Expected a surviving recommendation card");
    fireEvent.click(within(nextCard).getByRole("button", { name: "興味なし" }));
    await screen.findByRole("dialog");
    fireEvent.click(screen.getByRole("button", { name: "スキップ" }));
    expect(testState.saveUserWork).toHaveBeenLastCalledWith({
      workId: nextCard.dataset.recommendationWorkId,
      readingState: "hidden",
      updatedAt: expect.any(String),
    });
  });

  it("keeps planned cards and preserves the hidden fourth policy when a visible policy changes", async () => {
    testState.policies = { ...testState.policies, excludeIncomplete: true };
    const { container } = render(<RecommendationsFlow />);
    await waitFor(() => {
      expect(container.querySelectorAll("li[data-recommendation-work-id]")).toHaveLength(10);
    });
    const firstCard = container.querySelector("li[data-recommendation-work-id]") as HTMLElement;
    const workId = firstCard.dataset.recommendationWorkId;
    const plannedButton = within(firstCard).getByRole("button", { name: "読みたい" });
    fireEvent.click(plannedButton);
    await waitFor(() => expect(plannedButton.getAttribute("aria-pressed")).toBe("true"));
    expect(container.querySelector(`[data-recommendation-work-id='${workId}']`)).toBeTruthy();

    fireEvent.click(screen.getByRole("checkbox", { name: "完結作を優先" }));
    await waitFor(() => {
      expect(testState.savePolicies).toHaveBeenCalledWith({
        preferCompleted: true,
        preferHidden: false,
        preferVerified: false,
        excludeIncomplete: true,
      });
    });
    expect(testState.loadMotionList).not.toHaveBeenCalled();
  });

  it("serializes policy writes so rapid chip input cannot lose an earlier choice", async () => {
    const policyWrite = deferred<void>();
    testState.savePolicies.mockReturnValueOnce(policyWrite.promise);
    render(<RecommendationsFlow />);
    await screen.findByRole("checkbox", { name: "完結作を優先" });

    fireEvent.click(screen.getByRole("checkbox", { name: "完結作を優先" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "隠れた作品を優先" }));
    expect(testState.savePolicies).toHaveBeenCalledTimes(1);
    expect(testState.savePolicies).toHaveBeenCalledWith({
      preferCompleted: true,
      preferHidden: false,
      preferVerified: false,
      excludeIncomplete: false,
    });

    await act(async () => {
      policyWrite.resolve();
      await policyWrite.promise;
    });
    await waitFor(() => {
      expect(
        screen.getByRole("checkbox", { name: "完結作を優先" }).getAttribute("aria-checked"),
      ).toBe("true");
      expect(
        screen.getByRole("checkbox", { name: "隠れた作品を優先" }).getAttribute("aria-checked"),
      ).toBe("false");
    });
  });

  it("freezes card feedback while a policy save and recomputation are in flight", async () => {
    const policyWrite = deferred<void>();
    testState.savePolicies.mockReturnValueOnce(policyWrite.promise);
    const { container } = render(<RecommendationsFlow />);
    await waitFor(() => {
      expect(container.querySelectorAll("li[data-recommendation-work-id]")).toHaveLength(10);
    });

    fireEvent.click(screen.getByRole("checkbox", { name: "完結作を優先" }));
    const firstCard = container.querySelector("li[data-recommendation-work-id]") as HTMLElement;
    const completedButton = within(firstCard).getByRole<HTMLButtonElement>("button", {
      name: "読んだ",
    });
    await waitFor(() => expect(completedButton.disabled).toBe(true));
    fireEvent.pointerDown(completedButton);
    fireEvent.click(completedButton);
    expect(testState.saveUserWork).not.toHaveBeenCalled();
    expect(testState.loadMotionList).not.toHaveBeenCalled();

    await act(async () => {
      policyWrite.resolve();
      await policyWrite.promise;
    });
    await waitFor(() => expect(completedButton.disabled).toBe(false));
  });
});
