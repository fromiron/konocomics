// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { OnboardingFlow } from "@/features/onboarding/onboarding-flow";
import {
  OnboardingAlreadyCompletedError,
  OnboardingWorkConflictError,
} from "@/infrastructure/db/backend";
import { createTestCatalog, createTestWork } from "../../helpers/catalog";

const testState = vi.hoisted(() => ({
  catalog: null as unknown,
  clearOnboardingDraft: vi.fn(),
  draft: null as unknown,
  finalizeOnboarding: vi.fn(),
  hasProfile: false,
  navigate: vi.fn(),
  onboardingCompletedAt: null as string | null,
  refresh: vi.fn(),
  saveOnboardingDraft: vi.fn(),
  userWorks: [] as unknown[],
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, className, to }: { children: ReactNode; className?: string; to: string }) => (
    <a className={className} href={to}>
      {children}
    </a>
  ),
  useNavigate: () => testState.navigate,
}));

vi.mock("@/features/catalog/catalog-provider", () => ({
  useCatalog: () => testState.catalog,
}));

vi.mock("@/infrastructure/db", () => ({
  usePersistence: () => ({
    status: { state: "ready", mode: "indexeddb", warning: null },
    onboardingDraft: testState.draft,
    onboardingCompletedAt: testState.onboardingCompletedAt,
    hasProfile: testState.hasProfile,
    userWorks: testState.userWorks,
    refresh: testState.refresh,
    saveOnboardingDraft: testState.saveOnboardingDraft,
    clearOnboardingDraft: testState.clearOnboardingDraft,
    finalizeOnboarding: testState.finalizeOnboarding,
  }),
}));

const monster = {
  ...createTestWork({ id: "monster" }),
  title: "MONSTER",
  titleKana: "モンスター",
};

const defaultPositiveWorks = Array.from({ length: 5 }, (_, index) =>
  createTestWork({ id: `positive-${String(index + 1)}` }),
);

beforeEach(() => {
  const baseCatalog = createTestCatalog(monster);
  testState.catalog = { ...baseCatalog, works: [...defaultPositiveWorks, monster] };
  testState.draft = {
    id: "current",
    mode: "firstRun",
    step: 2,
    positiveEntries: [
      { workId: "positive-1", reaction: "favorite" },
      { workId: "positive-2", reaction: "liked" },
      { workId: "positive-3", reaction: "liked" },
      { workId: "positive-4", reaction: "liked" },
      { workId: "positive-5", reaction: "liked" },
    ],
    negativeEntries: [{ workId: "monster", disposition: "disliked", reasons: [] }],
    updatedAt: "2026-08-14T00:00:00+09:00",
  };
  testState.finalizeOnboarding.mockReset();
  testState.clearOnboardingDraft.mockReset();
  testState.hasProfile = false;
  testState.onboardingCompletedAt = null;
  testState.navigate.mockReset();
  testState.refresh.mockReset();
  testState.refresh.mockResolvedValue(undefined);
  testState.saveOnboardingDraft.mockReset();
  testState.saveOnboardingDraft.mockResolvedValue(undefined);
  testState.clearOnboardingDraft.mockResolvedValue(undefined);
  testState.userWorks = [];
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("OnboardingFlow finalization", () => {
  it("does not offer library-only works as negative profile evidence", async () => {
    vi.useFakeTimers();
    const libraryOnlyWork = {
      ...createTestWork({
        id: "library-only",
        eligibility: {
          onboardingEligible: false,
          recommendationEligible: false,
          libraryOnly: true,
        },
      }),
      title: "保管専用作品",
    };
    testState.catalog = {
      ...(testState.catalog as ReturnType<typeof createTestCatalog>),
      works: [...defaultPositiveWorks, monster, libraryOnlyWork],
    };

    render(<OnboardingFlow />);
    fireEvent.change(screen.getByRole("searchbox", { name: "合わなかったマンガを検索" }), {
      target: { value: "保管専用作品" },
    });
    await act(async () => vi.advanceTimersByTime(300));

    expect(screen.queryByText("保管専用作品")).toBeNull();
  });

  it("marks only the initially resolved Step 1 content for B entry and does not replay on Step 2", () => {
    testState.draft = {
      id: "current",
      mode: "firstRun",
      step: 1,
      positiveEntries: defaultPositiveWorks.map((work) => ({
        workId: work.id,
        reaction: "liked" as const,
      })),
      negativeEntries: [],
      updatedAt: "2026-08-14T00:00:00+09:00",
    };

    const { container } = render(<OnboardingFlow />);
    const main = container.querySelector("main");

    expect(main?.getAttribute("data-page-entry-b")).toBe("active");
    fireEvent.click(screen.getByRole("button", { name: "次へ (5/10)" }));

    expect(container.querySelector("main")).toBe(main);
    expect(main?.classList.contains("onboarding-page--entry-b")).toBe(false);
  });

  it("does not mark an initially resolved Step 2 for B entry", () => {
    const { container } = render(<OnboardingFlow />);

    expect(container.querySelector("main")?.hasAttribute("data-page-entry-b")).toBe(false);
  });

  it("recovers an already-completed stale profile through add mode", () => {
    testState.catalog = createTestCatalog(monster);
    testState.draft = null;
    testState.onboardingCompletedAt = "2026-08-01T00:00:00+09:00";
    testState.userWorks = [];

    render(<OnboardingFlow />);

    expect(
      screen.getByRole("heading", { level: 1, name: "好きなマンガを追加してください" }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "1作品以上えらんでください" })).toHaveProperty(
      "disabled",
      true,
    );
  });

  it("removes stale draft works that are absent from the current catalog", () => {
    testState.catalog = createTestCatalog(monster);

    render(<OnboardingFlow />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "好きなマンガを 5〜10 作品えらんでください",
      }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "あと 5 作品" })).toHaveProperty("disabled", true);
    expect(screen.getByText("まだ選ばれていません")).toBeTruthy();
  });

  it("clears a Step 1 limit message when moving to Step 2", () => {
    const selectedWorks = Array.from({ length: 10 }, (_, index) => ({
      ...createTestWork({ id: `positive-${String(index + 1)}` }),
      title: `好きな作品${String(index + 1)}`,
    }));
    const candidate = { ...createTestWork({ id: "candidate" }), title: "追加候補" };
    const baseCatalog = createTestCatalog(candidate);
    testState.catalog = {
      ...baseCatalog,
      works: [...defaultPositiveWorks, ...selectedWorks, candidate],
    };
    testState.draft = {
      id: "current",
      mode: "firstRun",
      step: 1,
      positiveEntries: selectedWorks.map((work) => ({
        workId: work.id,
        reaction: "liked" as const,
      })),
      negativeEntries: [],
      updatedAt: "2026-08-14T00:00:00+09:00",
    };
    testState.saveOnboardingDraft.mockResolvedValue(undefined);

    render(<OnboardingFlow />);
    fireEvent.click(screen.getByRole("button", { name: "追加候補 — 好きに追加" }));
    expect(screen.getByRole("status").textContent).toContain("最大 10 作品までです");

    fireEvent.click(screen.getByRole("button", { name: "次へ (10/10)" }));

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "合わなかった・途中でやめたマンガはありますか？ 任意",
      }),
    ).toBeTruthy();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("keeps max-limit feedback reachable without checking a rejected candidate radio", async () => {
    vi.useFakeTimers();
    const selectedWorks = ["negative-1", "negative-2", "negative-3"].map((id, index) => ({
      ...createTestWork({ id }),
      title: `合わない作品${String(index + 1)}`,
    }));
    const candidate = { ...createTestWork({ id: "candidate" }), title: "候補作品" };
    const baseCatalog = createTestCatalog(candidate);
    testState.catalog = {
      ...baseCatalog,
      works: [...defaultPositiveWorks, ...selectedWorks, candidate],
    };
    testState.draft = {
      id: "current",
      mode: "firstRun",
      step: 2,
      positiveEntries: defaultPositiveWorks.map((work) => ({
        workId: work.id,
        reaction: "liked" as const,
      })),
      negativeEntries: selectedWorks.map((work) => ({
        workId: work.id,
        disposition: "disliked" as const,
        reasons: [],
      })),
      updatedAt: "2026-08-14T00:00:00+09:00",
    };

    render(<OnboardingFlow />);
    fireEvent.change(screen.getByRole("searchbox", { name: "合わなかったマンガを検索" }), {
      target: { value: "候補作品" },
    });
    await act(async () => vi.advanceTimersByTime(300));

    const candidateGroup = screen.getByRole("group", { name: "候補作品 — この作品について" });
    const candidateRadio = within(candidateGroup).getByRole("radio", { name: "合わなかった" });
    expect(candidateRadio.getAttribute("aria-disabled")).not.toBe("true");
    fireEvent.click(candidateRadio);

    expect(candidateRadio.getAttribute("aria-checked")).toBe("false");
    expect(screen.getByRole("status").textContent).toContain("最大 3 作品までです");
    expect(testState.saveOnboardingDraft).not.toHaveBeenCalled();
  });

  it("freezes every Step 2 mutation and re-enables controls when finalization fails", async () => {
    let rejectFinalization: ((reason: Error) => void) | undefined;
    testState.finalizeOnboarding.mockReturnValue(
      new Promise<void>((_resolve, reject) => {
        rejectFinalization = reject;
      }),
    );

    render(<OnboardingFlow />);

    fireEvent.click(screen.getByRole("button", { name: "好みを見る" }));

    const search = screen.getByRole("searchbox", { name: "合わなかったマンガを検索" });
    const remove = screen.getByRole("button", { name: "MONSTER — この作品を外す" });
    const disposition = screen.getByRole("radio", { name: "合わなかった" });
    const reason = screen.getByRole("checkbox", { name: "展開が遅い" });
    const completionButtons = screen.getAllByRole("button", { name: "保存しています…" });

    await waitFor(() => {
      expect(search.matches(":disabled")).toBe(true);
      expect(remove.matches(":disabled")).toBe(true);
      expect(disposition.getAttribute("aria-disabled")).toBe("true");
      expect(reason.getAttribute("aria-disabled")).toBe("true");
      expect(completionButtons).toHaveLength(2);
      expect(completionButtons.every((button) => button.matches(":disabled"))).toBe(true);
    });

    fireEvent.change(search, { target: { value: "べつ" } });
    fireEvent.click(remove);
    fireEvent.click(disposition);
    fireEvent.click(reason);
    completionButtons.forEach((button) => fireEvent.click(button));

    expect(testState.finalizeOnboarding).toHaveBeenCalledTimes(1);
    expect(testState.saveOnboardingDraft).not.toHaveBeenCalled();

    await act(async () => {
      rejectFinalization?.(new Error("write failed"));
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "好みを見る" }).matches(":disabled")).toBe(false);
      expect(
        screen.getByRole("searchbox", { name: "合わなかったマンガを検索" }).matches(":disabled"),
      ).toBe(false);
    });
    expect(screen.getByRole("alert").textContent).toContain("好みを保存できませんでした");
  });

  it("uses current-catalog records for the first-profile reveal decision", async () => {
    testState.hasProfile = true;
    testState.userWorks = Array.from({ length: 5 }, (_, index) => ({
      workId: `stale-${String(index + 1)}`,
      readingState: "completed",
      reaction: "liked",
      updatedAt: "2026-08-13T00:00:00+09:00",
    }));

    render(<OnboardingFlow />);
    fireEvent.click(screen.getByRole("button", { name: "好みを見る" }));

    await waitFor(() => {
      expect(testState.navigate).toHaveBeenCalledWith({
        to: "/taste",
        search: { reveal: "1" },
      });
    });
  });
});

describe("OnboardingFlow add mode", () => {
  const existingRecord = {
    workId: "monster",
    readingState: "reading",
    reaction: "favorite",
    progress: { volume: 7, chapter: 58 },
    positiveReasons: ["緻密な駆け引き"],
    updatedAt: "2026-08-13T00:00:00+09:00",
  } as const;

  function useCatalogBackedProfile() {
    const existingWorks = Array.from({ length: 5 }, (_, index) => ({
      ...createTestWork({ id: `existing-${String(index + 1)}` }),
      title: `登録済み作品${String(index + 1)}`,
    }));
    const candidate = { ...createTestWork({ id: "new-candidate" }), title: "追加候補" };
    const baseCatalog = createTestCatalog(existingWorks[0]);
    testState.catalog = { ...baseCatalog, works: [...existingWorks, candidate] };
    testState.userWorks = existingWorks.map((work) => ({
      workId: work.id,
      readingState: "completed",
      reaction: "liked",
      updatedAt: "2026-08-13T00:00:00+09:00",
    }));
    testState.draft = null;
  }

  it("enters add mode for an existing profile and completes after one new positive work", async () => {
    useCatalogBackedProfile();
    testState.finalizeOnboarding.mockResolvedValue(undefined);

    const { container } = render(<OnboardingFlow />);

    expect(
      screen.getByRole("heading", { level: 1, name: "好きなマンガを追加してください" }),
    ).toBeTruthy();
    expect(container.querySelector("main")?.getAttribute("data-page-entry-b")).toBe("active");
    expect(screen.queryByText("STEP 1 / 2")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "追加候補 — 好きに追加" }));
    fireEvent.click(screen.getByRole("button", { name: "追加する (1/10)" }));

    await waitFor(() => {
      expect(testState.finalizeOnboarding).toHaveBeenCalledTimes(1);
      expect(testState.navigate).toHaveBeenCalledWith({ to: "/taste", replace: true });
    });
    expect(testState.finalizeOnboarding.mock.calls[0]?.[0]).toMatchObject({
      mode: "add",
      step: 1,
      positiveEntries: [{ workId: "new-candidate", reaction: "liked" }],
      negativeEntries: [],
    });
    expect(testState.navigate).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole("heading", {
        name: "合わなかった・途中でやめたマンガはありますか？ 任意",
      }),
    ).toBeNull();
  });

  it("preserves the add draft on the ordinary return action", async () => {
    useCatalogBackedProfile();
    testState.saveOnboardingDraft.mockResolvedValue(undefined);

    render(<OnboardingFlow />);
    fireEvent.click(screen.getByRole("button", { name: "追加候補 — 好きに追加" }));
    fireEvent.click(screen.getByRole("button", { name: "DNAに戻る" }));

    await waitFor(() => {
      expect(testState.navigate).toHaveBeenCalledWith({ to: "/taste", replace: true });
    });
    expect(testState.saveOnboardingDraft).toHaveBeenLastCalledWith(
      expect.objectContaining({
        mode: "add",
        positiveEntries: [{ workId: "new-candidate", reaction: "liked" }],
      }),
    );
    expect(testState.clearOnboardingDraft).not.toHaveBeenCalled();
    expect(testState.finalizeOnboarding).not.toHaveBeenCalled();
  });

  it("clears the add draft only through the separately labeled discard action", async () => {
    useCatalogBackedProfile();
    testState.clearOnboardingDraft.mockResolvedValue(undefined);

    render(<OnboardingFlow />);
    fireEvent.click(screen.getByRole("button", { name: "追加候補 — 好きに追加" }));
    fireEvent.click(screen.getByRole("button", { name: "入力内容を破棄" }));

    await waitFor(() => {
      expect(testState.clearOnboardingDraft).toHaveBeenCalledTimes(1);
      expect(testState.navigate).toHaveBeenCalledWith({ to: "/taste", replace: true });
    });
    expect(testState.finalizeOnboarding).not.toHaveBeenCalled();
  });

  it("recovers a concurrent work conflict with specific copy and fresh state", async () => {
    useCatalogBackedProfile();
    testState.finalizeOnboarding.mockRejectedValue(
      new OnboardingWorkConflictError("new-candidate"),
    );

    render(<OnboardingFlow />);
    fireEvent.click(screen.getByRole("button", { name: "追加候補 — 好きに追加" }));
    fireEvent.click(screen.getByRole("button", { name: "追加する (1/10)" }));

    await waitFor(() => {
      expect(testState.refresh).toHaveBeenCalledTimes(1);
      expect(screen.getByRole("alert").textContent).toBe(
        "「追加候補」は別の画面ですでに追加されています。最新の内容を読み込みました。選び直してください。",
      );
    });
    expect(testState.navigate).not.toHaveBeenCalled();
  });

  it("returns to the completed profile when another tab finishes first-run onboarding", async () => {
    testState.finalizeOnboarding.mockRejectedValue(new OnboardingAlreadyCompletedError());

    render(<OnboardingFlow />);
    fireEvent.click(screen.getByRole("button", { name: "好みを見る" }));

    await waitFor(() => {
      expect(testState.refresh).toHaveBeenCalledTimes(1);
      expect(testState.navigate).toHaveBeenCalledWith({ to: "/taste", replace: true });
    });
    expect(
      screen.queryByText(
        "好みを保存できませんでした。入力内容を確認して、もう一度お試しください。",
      ),
    ).toBeNull();
  });

  it.each([
    {
      step: 1 as const,
      searchLabel: "好きなマンガを検索",
      selectionName: "MONSTER — 好きに追加",
    },
    {
      step: 2 as const,
      searchLabel: "合わなかったマンガを検索",
      selectionName: "MONSTER — この作品について",
    },
  ])("does not offer an existing record again in Step $step", async (testCase) => {
    vi.useFakeTimers();
    testState.userWorks =
      testCase.step === 1
        ? [
            existingRecord,
            ...defaultPositiveWorks.slice(0, 4).map((work) => ({
              workId: work.id,
              readingState: "completed" as const,
              reaction: "liked" as const,
              updatedAt: "2026-08-13T00:00:00+09:00",
            })),
          ]
        : [existingRecord];
    testState.draft = {
      id: "current",
      mode: testCase.step === 1 ? "add" : "firstRun",
      step: testCase.step,
      positiveEntries:
        testCase.step === 1
          ? []
          : defaultPositiveWorks.map((work) => ({
              workId: work.id,
              reaction: "liked" as const,
            })),
      negativeEntries: [],
      updatedAt: "2026-08-14T00:00:00+09:00",
    };

    render(<OnboardingFlow />);

    expect(screen.queryByRole("button", { name: testCase.selectionName })).toBeNull();
    expect(screen.queryByRole("group", { name: testCase.selectionName })).toBeNull();

    fireEvent.change(screen.getByRole("searchbox", { name: testCase.searchLabel }), {
      target: { value: "MONSTER" },
    });
    await act(async () => vi.advanceTimersByTime(300));

    expect(screen.getByText("見つかりませんでした。別の書き方で試してください")).toBeTruthy();
    expect(screen.queryByText("MONSTER")).toBeNull();
    expect(testState.saveOnboardingDraft).not.toHaveBeenCalled();
    expect(existingRecord.progress).toEqual({ volume: 7, chapter: 58 });
    expect(existingRecord.positiveReasons).toEqual(["緻密な駆け引き"]);
  });
});
