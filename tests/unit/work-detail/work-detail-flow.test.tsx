// @vitest-environment jsdom

import {
  act,
  cleanup,
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import type { AnchorHTMLAttributes } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import catalogJson from "@/data/generated/catalog-v1.json";
import recommendationContextJson from "@/data/generated/recommendation-context-v1.json";
import { catalogV1Schema } from "@/domain/catalog/schema";
import { explanationClusterFor, generateTasteExplanation } from "@/domain/explanation";
import type { UserWorkRecord } from "@/domain/profile/types";
import { recommendationContextSchema } from "@/domain/recommendation/context-schema";
import { scoreWorkCompatibility } from "@/domain/recommendation/rank";
import { CatalogProvider } from "@/features/catalog/catalog-provider";
import { WorkDetailFlow } from "@/features/work-detail/work-detail-flow";
import type { ProviderCacheRecord } from "@/infrastructure/db";
import type * as RakutenExports from "@/infrastructure/rakuten";
import { buildRakutenBooksSearchUrl } from "@/infrastructure/rakuten";
import {
  coverStrings,
  explanationLexicon,
  libraryStrings,
  mediaStrings,
  workDetailStrings,
} from "@/lib/strings";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    params,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    to: string;
    params?: { workId: string };
    preload?: boolean;
  }) => {
    delete props.preload;
    return <a {...props} href={to.replace("$workId", params?.workId ?? "")} />;
  },
}));

type TestStatus =
  | { state: "initializing"; mode: null; warning: null }
  | { state: "ready"; mode: "indexeddb"; warning: null };

const testState = vi.hoisted(() => ({
  status: { state: "initializing", mode: null, warning: null } as TestStatus,
  userWorks: undefined as UserWorkRecord[] | undefined,
  adjustments: { axes: {}, themes: {} },
  policies: {
    preferCompleted: false,
    preferHidden: false,
    preferVerified: false,
    excludeIncomplete: false,
  },
  saveUserWork: vi.fn<(record: UserWorkRecord) => Promise<UserWorkRecord>>(),
  removeMinimalPlannedUserWork:
    vi.fn<(workId: string) => Promise<"removed" | "already-absent" | "preserved-conflict">>(),
  removeUserWorkIfUnchanged:
    vi.fn<
      (
        workId: string,
        expectedUpdatedAt: string,
      ) => Promise<"removed" | "already-absent" | "preserved-conflict">
    >(),
  addUserWorkIfAbsent:
    vi.fn<(record: UserWorkRecord) => Promise<{ kind: "added" | "already-exists" }>>(),
  getProviderCache: vi.fn<(isbn: string) => Promise<ProviderCacheRecord | null>>(),
  saveProviderCache: vi.fn(),
  requestRakutenBook: vi.fn(),
}));

vi.mock("@/infrastructure/db", () => ({
  usePersistence: () => ({
    status: testState.status,
    userWorks: testState.userWorks,
    adjustments: testState.adjustments,
    policies: testState.policies,
    saveUserWork: testState.saveUserWork,
    removeMinimalPlannedUserWork: testState.removeMinimalPlannedUserWork,
    removeUserWorkIfUnchanged: testState.removeUserWorkIfUnchanged,
    addUserWorkIfAbsent: testState.addUserWorkIfAbsent,
    getProviderCache: testState.getProviderCache,
    saveProviderCache: testState.saveProviderCache,
  }),
}));

vi.mock("@/infrastructure/rakuten", async (importOriginal) => {
  const actual = await importOriginal<typeof RakutenExports>();
  return { ...actual, requestRakutenBook: testState.requestRakutenBook };
});

const catalog = catalogV1Schema.parse(catalogJson);
const recommendationContext = recommendationContextSchema.parse(recommendationContextJson);
const target = catalog.works[10]!;
const targetIsbn = catalog.volumes.find(
  (volume) => volume.id === catalog.representativeVolumeByWorkId[target.id],
)!.isbn;

function providerCacheRecord(options: {
  commercialFresh: boolean;
  metadataFresh: boolean;
  commercialExpiresInMs?: number;
  metadataExpiresInMs?: number;
}): ProviderCacheRecord {
  const now = Date.now();
  return {
    workId: target.id,
    provider: "rakuten",
    isbn: targetIsbn,
    imageUrl: "https://thumbnail.image.rakuten.co.jp/book.jpg?_ex=600x600",
    itemUrl: "https://books.rakuten.co.jp/rb/123/",
    affiliateUrl: "https://hb.afl.rakuten.co.jp/example",
    itemCaption: "期限境界を確認するための作品紹介です。",
    publisherName: "講談社",
    itemPrice: 770,
    availability: 1,
    reviewAverage: 4.8,
    reviewCount: 24,
    fetchedAt: new Date(now - 48 * 60 * 60 * 1_000).toISOString(),
    commercialExpiresAt: new Date(
      now +
        (options.commercialExpiresInMs ??
          (options.commercialFresh ? 60 * 60 * 1_000 : -60 * 60 * 1_000)),
    ).toISOString(),
    metadataExpiresAt: new Date(
      now +
        (options.metadataExpiresInMs ??
          (options.metadataFresh ? 60 * 60 * 1_000 : -60 * 60 * 1_000)),
    ).toISOString(),
  };
}

function renderDetail(workId = target.id) {
  return render(
    <CatalogProvider catalog={catalog}>
      <WorkDetailFlow workId={workId} />
    </CatalogProvider>,
  );
}

function finishPageEntry(element: Element) {
  const standardEvent = createEvent.animationEnd(element);
  Object.defineProperty(standardEvent, "animationName", { value: "page-entry-b-enter" });
  fireEvent(element, standardEvent);
  const prefixedEvent = new window.Event("webkitAnimationEnd", { bubbles: true });
  Object.defineProperty(prefixedEvent, "animationName", { value: "page-entry-b-enter" });
  fireEvent(element, prefixedEvent);
}

beforeEach(() => {
  testState.status = { state: "initializing", mode: null, warning: null };
  testState.userWorks = [];
  testState.adjustments = { axes: {}, themes: {} };
  testState.policies = {
    preferCompleted: false,
    preferHidden: false,
    preferVerified: false,
    excludeIncomplete: false,
  };
  testState.saveUserWork.mockReset();
  testState.saveUserWork.mockImplementation(async (record) => record);
  testState.removeMinimalPlannedUserWork.mockReset();
  testState.removeMinimalPlannedUserWork.mockResolvedValue("removed");
  testState.removeUserWorkIfUnchanged.mockReset();
  testState.removeUserWorkIfUnchanged.mockResolvedValue("removed");
  testState.addUserWorkIfAbsent.mockReset();
  testState.addUserWorkIfAbsent.mockResolvedValue({ kind: "added" });
  testState.getProviderCache.mockReset();
  testState.getProviderCache.mockResolvedValue(null);
  testState.saveProviderCache.mockReset();
  testState.requestRakutenBook.mockReset();
  testState.requestRakutenBook.mockRejectedValue(new Error("provider unavailable"));
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

describe("WorkDetailFlow", () => {
  it("groups the author's other works under one section with a featured book and a shelf", async () => {
    testState.status = { state: "ready", mode: "indexeddb", warning: null };
    renderDetail("monster");

    const heading = await screen.findByRole("heading", {
      level: 2,
      name: workDetailStrings.sameAuthor.heading("浦沢直樹"),
    });
    const section = heading.closest("section");
    if (section === null) throw new Error("Missing same-author section");
    expect(
      within(section).queryByRole("heading", {
        level: 3,
        name: workDetailStrings.sameAuthor.othersHeading,
      }),
    ).toBeNull();
    expect(
      within(section).getByRole("list", { name: workDetailStrings.sameAuthor.othersHeading }),
    ).toBeTruthy();
    const links = within(section)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(links).not.toContain("/works/monster");
    expect(new Set(links).size).toBe(links.length);
  });

  it("offers four reading states and explains 「読んだ」 only for continuing series", async () => {
    testState.status = { state: "ready", mode: "indexeddb", warning: null };
    const view = renderDetail("monster");

    const controls = await screen.findByRole("group", { name: workDetailStrings.state.heading });
    expect(within(controls).getAllByRole("button")).toHaveLength(4);
    for (const name of Object.values(workDetailStrings.state.options)) {
      expect(within(controls).getByRole("button", { name }).getAttribute("aria-pressed")).toBe(
        "false",
      );
    }
    expect(screen.queryByRole("group", { name: workDetailStrings.state.reactionGroup })).toBeNull();
    expect(screen.queryByText(workDetailStrings.state.ongoingHint)).toBeNull();

    view.unmount();
    renderDetail("a-brides-story");
    expect(await screen.findByText(workDetailStrings.state.ongoingHint)).toBeTruthy();
  });

  it("requires 「読んだ」 before editing a reaction and clears only the reaction on a second tap", async () => {
    testState.status = { state: "ready", mode: "indexeddb", warning: null };
    testState.userWorks = [
      {
        workId: "monster",
        readingState: "hidden",
        reaction: "disliked",
        negativeReasons: ["tooDark"],
        updatedAt: "2026-08-14T00:00:00.000Z",
      },
    ];
    const view = renderDetail("monster");

    expect(screen.queryByRole("group", { name: workDetailStrings.state.reactionGroup })).toBeNull();
    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: workDetailStrings.state.options.completed }),
      );
    });
    const completed = testState.saveUserWork.mock.calls.at(-1)?.[0];
    if (completed === undefined) throw new Error("Expected the reading state to be saved");
    expect(completed).toMatchObject({ readingState: "completed", reaction: "disliked" });
    testState.userWorks = [completed];
    view.rerender(
      <CatalogProvider catalog={catalog}>
        <WorkDetailFlow workId="monster" />
      </CatalogProvider>,
    );
    const reactions = await screen.findByRole("group", {
      name: workDetailStrings.state.reactionGroup,
    });
    await act(async () => {
      fireEvent.click(within(reactions).getByRole("button", { name: "良かった" }));
    });
    const saved = testState.saveUserWork.mock.calls.at(-1)?.[0] as UserWorkRecord;
    expect(saved).toMatchObject({
      workId: "monster",
      readingState: "completed",
      reaction: "liked",
    });
    // Dislike reasons do not survive a reaction that is no longer 「いまいち」.
    expect(saved.negativeReasons).toBeUndefined();
    expect(
      await screen.findByText(
        workDetailStrings.state.reactionSaved(
          workDetailStrings.state.options.completed,
          "良かった",
        ),
      ),
    ).toBeTruthy();

    view.unmount();
    testState.userWorks = [{ ...saved, updatedAt: "2026-08-15T00:00:00.000Z" }];
    renderDetail("monster");
    const pressed = within(
      await screen.findByRole("group", { name: workDetailStrings.state.reactionGroup }),
    ).getByRole("button", { name: "良かった" });
    expect(pressed.getAttribute("aria-pressed")).toBe("true");
    expect(
      screen
        .getByRole("button", { name: workDetailStrings.state.options.completed })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    await act(async () => {
      fireEvent.click(pressed);
    });
    const cleared = testState.saveUserWork.mock.calls.at(-1)?.[0] as UserWorkRecord;
    expect(cleared.readingState).toBe("completed");
    expect(cleared.reaction).toBeUndefined();
    expect(await screen.findByText(workDetailStrings.state.reactionCleared)).toBeTruthy();
  });

  it("keeps the bookmark in place after rating and keeps a read state with its progress", async () => {
    testState.status = { state: "ready", mode: "indexeddb", warning: null };
    testState.userWorks = [
      {
        workId: "monster",
        readingState: "completed",
        progress: { volume: 4 },
        updatedAt: "2026-08-14T00:00:00.000Z",
      },
    ];
    renderDetail("monster");
    const bookmark = await screen.findByRole("button", {
      name: workDetailStrings.state.options.planned,
    });

    expect(
      await screen.findByText(
        workDetailStrings.state.progressNote(libraryStrings.progress(4, undefined)),
      ),
    ).toBeTruthy();
    expect(
      screen
        .getByRole("button", { name: workDetailStrings.state.options.planned })
        .getAttribute("aria-pressed"),
    ).toBe("false");
    await act(async () => {
      fireEvent.click(
        within(
          screen.getByRole("group", { name: workDetailStrings.state.reactionGroup }),
        ).getByRole("button", { name: "最高" }),
      );
    });
    expect(testState.saveUserWork.mock.calls.at(-1)?.[0]).toMatchObject({
      readingState: "completed",
      reaction: "favorite",
      progress: { volume: 4 },
    });
    expect(bookmark.isConnected).toBe(true);
    expect(bookmark.getAttribute("aria-pressed")).toBe("false");
  });

  it.each(["planned", "dropped", "hidden"] as const)(
    "hides reactions in %s while preserving the saved reaction for a return to 「読んだ」",
    async (readingState) => {
      const record: UserWorkRecord = {
        workId: target.id,
        readingState: "completed",
        reaction: "liked",
        progress: { volume: 3 },
        updatedAt: "2026-08-14T00:00:00.000Z",
      };
      testState.userWorks = [record];
      const view = renderDetail();

      await act(async () => {
        fireEvent.click(
          screen.getByRole("button", { name: workDetailStrings.state.options[readingState] }),
        );
      });
      const saved = testState.saveUserWork.mock.calls.at(-1)?.[0];
      if (saved === undefined) throw new Error("Expected the changed reading state");
      expect(saved).toMatchObject({ readingState, reaction: "liked", progress: record.progress });
      testState.userWorks = [saved];
      view.rerender(
        <CatalogProvider catalog={catalog}>
          <WorkDetailFlow workId={target.id} />
        </CatalogProvider>,
      );
      expect(
        screen.queryByRole("group", { name: workDetailStrings.state.reactionGroup }),
      ).toBeNull();
      expect(screen.queryByRole("button", { name: libraryStrings.reactions.liked })).toBeNull();

      await act(async () => {
        fireEvent.click(
          screen.getByRole("button", { name: workDetailStrings.state.options.completed }),
        );
      });
      const returned = testState.saveUserWork.mock.calls.at(-1)?.[0];
      if (returned === undefined) throw new Error("Expected the restored completed state");
      testState.userWorks = [returned];
      view.rerender(
        <CatalogProvider catalog={catalog}>
          <WorkDetailFlow workId={target.id} />
        </CatalogProvider>,
      );
      const reactions = screen.getByRole("group", { name: workDetailStrings.state.reactionGroup });
      expect(
        within(reactions)
          .getByRole("button", { name: libraryStrings.reactions.liked })
          .getAttribute("aria-pressed"),
      ).toBe("true");
      expect(returned).toMatchObject({
        readingState: "completed",
        reaction: "liked",
        progress: record.progress,
      });
    },
  );

  it("keeps the saved state and reaction available when a state change fails", async () => {
    testState.userWorks = [
      {
        workId: target.id,
        readingState: "completed",
        reaction: "liked",
        updatedAt: "2026-08-14T00:00:00.000Z",
      },
    ];
    testState.saveUserWork.mockRejectedValue(new Error("write failed"));
    renderDetail();

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: workDetailStrings.state.options.planned }),
      );
    });
    expect(screen.getByText(workDetailStrings.state.error)).toBeTruthy();
    expect(
      screen
        .getByRole("button", { name: workDetailStrings.state.options.completed })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    expect(
      screen
        .getByRole("button", { name: libraryStrings.reactions.liked })
        .getAttribute("aria-pressed"),
    ).toBe("true");
  });

  it("expands and closes a long synopsis without changing its source text or link", async () => {
    const readStyle = window.getComputedStyle;
    const styleSpy = vi.spyOn(window, "getComputedStyle").mockImplementation((...args) => {
      const style = readStyle(...args);
      style.lineHeight = "24px";
      return style;
    });
    const heightSpy = vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(300);
    const cached = {
      ...providerCacheRecord({ commercialFresh: true, metadataFresh: true }),
      itemCaption:
        "旅のはじまり。\n仲間との出会い。\n最初の冒険。\n思いがけない再会。\n次の目的地へ。\n物語は続く。",
    };
    testState.status = { state: "ready", mode: "indexeddb", warning: null };
    testState.getProviderCache.mockResolvedValue(cached);

    try {
      renderDetail();
      await waitFor(() => {
        expect(document.getElementById("work-synopsis-content")?.textContent).toBe(
          cached.itemCaption,
        );
      });
      // Caption rendering precedes the effect that measures overflow and reveals the control.
      const button = await screen.findByRole("button", {
        name: workDetailStrings.synopsis.readMore,
      });
      const paragraph = document.getElementById(button.getAttribute("aria-controls")!);
      expect(button.getAttribute("aria-expanded")).toBe("false");
      expect(paragraph?.textContent).toBe(cached.itemCaption);
      fireEvent.click(button);
      expect(button.getAttribute("aria-expanded")).toBe("true");
      expect(button.textContent).toBe(workDetailStrings.synopsis.readLess);
      fireEvent.click(button);
      expect(button.getAttribute("aria-expanded")).toBe("false");
      expect(paragraph?.textContent).toBe(cached.itemCaption);
      expect(
        screen
          .getByRole("link", {
            name: workDetailStrings.metadata.sourceOpen(workDetailStrings.synopsis.source.rakuten),
          })
          .getAttribute("href"),
      ).toBe(cached.itemUrl);
    } finally {
      styleSpy.mockRestore();
      heightSpy.mockRestore();
    }
  });

  it("keeps the stored publisher synopsis ahead of Rakuten text and links the same author work", async () => {
    const workId = "work-9b42e9cda7743bba0f9b";
    const volume = catalog.volumes.find(
      (volume) => volume.id === catalog.representativeVolumeByWorkId[workId],
    )!;
    testState.status = { state: "ready", mode: "indexeddb", warning: null };
    testState.saveProviderCache.mockImplementation(async (record: ProviderCacheRecord) => record);
    testState.requestRakutenBook.mockResolvedValue({
      title: "回転銀河（1）",
      author: "海野つなみ",
      publisherName: "講談社",
      isbn: volume.isbn,
      salesDate: "2003年08月08日頃",
      itemPrice: 440,
      reviewAverage: 0,
      reviewCount: 0,
      availability: 1,
      itemUrl: "https://books.rakuten.co.jp/rb/1585697/",
      itemCaption: "楽天から届いた別の紹介です。",
    });
    renderDetail(workId);

    expect(await screen.findByText("2003年08月08日頃")).toBeTruthy();
    expect(screen.getByText(volume.metadata!.itemCaption!)).toBeTruthy();
    expect(screen.queryByText("楽天から届いた別の紹介です。")).toBeNull();
    expect(screen.getByText("208ページ")).toBeTruthy();
    expect(
      screen
        .getByRole("link", {
          name: workDetailStrings.metadata.sourceOpen(workDetailStrings.synopsis.source.publisher),
        })
        .getAttribute("href"),
    ).toBe(volume.metadata!.sourceUrl);
    expect(
      screen
        .getByRole("link", { name: workDetailStrings.sameAuthor.open("逃げるは恥だが役に立つ") })
        .getAttribute("href"),
    ).toBe("/works/the-full-time-wife-escapist");
    expect(testState.saveProviderCache).toHaveBeenCalledWith(
      expect.objectContaining({
        isbn: volume.isbn,
        publisherName: "講談社",
        itemCaption: "楽天から届いた別の紹介です。",
      }),
    );
  });

  it("applies B entry only to a resolved valid catalog detail", () => {
    const resolved = renderDetail();

    expect(
      resolved.container
        .querySelector("main[data-work-detail-id]")
        ?.classList.contains("page-entry-b"),
    ).toBe(true);

    resolved.unmount();
    const missing = renderDetail("missing-work");
    expect(missing.container.querySelector("main")?.classList.contains("page-entry-b")).toBe(false);
  });

  it("grants a fresh B owner when the resolved catalog work identity changes", () => {
    const nextWork = catalog.works.find((work) => work.id !== target.id)!;
    const view = renderDetail();
    const firstMain = view.container.querySelector("main[data-work-detail-id]")!;
    finishPageEntry(firstMain);
    expect(firstMain.classList.contains("page-entry-b")).toBe(false);

    view.rerender(
      <CatalogProvider catalog={catalog}>
        <WorkDetailFlow workId={nextWork.id} />
      </CatalogProvider>,
    );

    const nextMain = view.container.querySelector("main[data-work-detail-id]")!;
    expect(nextMain).not.toBe(firstMain);
    expect(nextMain.getAttribute("data-work-detail-id")).toBe(nextWork.id);
    expect(nextMain.classList.contains("page-entry-b")).toBe(true);
  });

  it("gates all record mutations until authoritative userWorks are ready", () => {
    testState.userWorks = undefined;
    renderDetail();

    expect(screen.queryByRole("group", { name: workDetailStrings.state.heading })).toBeNull();
    expect(screen.getByText(workDetailStrings.state.loading)).toBeTruthy();
    expect(testState.saveUserWork).not.toHaveBeenCalled();
    expect(testState.removeMinimalPlannedUserWork).not.toHaveBeenCalled();
    expect(testState.removeUserWorkIfUnchanged).not.toHaveBeenCalled();
  });

  it("clears the record when the selected state is tapped again and restores it once", async () => {
    const record: UserWorkRecord = {
      workId: target.id,
      readingState: "completed",
      reaction: "liked",
      progress: { volume: 3 },
      updatedAt: "2026-08-14T00:00:00.000Z",
    };
    testState.userWorks = [record];
    renderDetail();
    const completed = screen.getByRole("button", {
      name: workDetailStrings.state.options.completed,
    });
    expect(completed.getAttribute("aria-pressed")).toBe("true");

    await act(async () => {
      fireEvent.click(completed);
    });
    expect(testState.removeUserWorkIfUnchanged).toHaveBeenCalledWith(target.id, record.updatedAt);
    expect(testState.saveUserWork).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        workDetailStrings.state.recordCleared(workDetailStrings.state.options.completed),
      ),
    ).toBeTruthy();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: workDetailStrings.state.undo }));
    });
    const restored = testState.addUserWorkIfAbsent.mock.calls[0]![0];
    expect(restored).toMatchObject({
      workId: target.id,
      readingState: "completed",
      reaction: "liked",
      progress: { volume: 3 },
    });
    expect(restored.updatedAt).not.toBe(record.updatedAt);
    expect(screen.getByText(workDetailStrings.state.recordRestored)).toBeTruthy();
    expect(screen.queryByRole("button", { name: workDetailStrings.state.undo })).toBeNull();
  });

  it("keeps a record changed elsewhere instead of clearing it, and offers no undo", async () => {
    testState.userWorks = [
      { workId: target.id, readingState: "hidden", updatedAt: "2026-08-14T00:00:00.000Z" },
    ];
    testState.removeUserWorkIfUnchanged.mockResolvedValue("preserved-conflict");
    renderDetail();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: workDetailStrings.state.options.hidden }));
    });

    expect(screen.getByText(workDetailStrings.state.plannedPreservedConflict)).toBeTruthy();
    expect(screen.queryByRole("button", { name: workDetailStrings.state.undo })).toBeNull();
  });

  it("clears a planned record with progress through the conditional removal", async () => {
    testState.userWorks = [
      {
        workId: target.id,
        readingState: "planned",
        progress: { volume: 2 },
        updatedAt: "2026-08-14T00:00:00.000Z",
      },
    ];
    renderDetail();

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: workDetailStrings.state.options.planned }),
      );
    });

    expect(testState.removeMinimalPlannedUserWork).not.toHaveBeenCalled();
    expect(testState.removeUserWorkIfUnchanged).toHaveBeenCalledWith(
      target.id,
      "2026-08-14T00:00:00.000Z",
    );
    expect(screen.getByRole("button", { name: workDetailStrings.state.undo })).toBeTruthy();
  });

  it("removes dropped-only reasons when changing away from dropped", async () => {
    testState.userWorks = [
      {
        workId: target.id,
        readingState: "dropped",
        droppedReasons: ["tooSlow"],
        updatedAt: "2026-08-14T00:00:00.000Z",
      },
    ];
    renderDetail();

    fireEvent.click(
      screen.getByRole("button", { name: workDetailStrings.state.options.completed }),
    );

    await waitFor(() => expect(testState.saveUserWork).toHaveBeenCalledTimes(1));
    const saved = testState.saveUserWork.mock.calls[0]![0];
    expect(saved.readingState).toBe("completed");
    expect(saved).not.toHaveProperty("droppedReasons");
  });

  it("uses a synchronous mutation fence for repeated planned actions", async () => {
    let resolveSave: ((record: UserWorkRecord) => void) | undefined;
    testState.saveUserWork.mockImplementation(
      (record) =>
        new Promise((resolve) => {
          resolveSave = () => resolve(record);
        }),
    );
    renderDetail();
    const planned = screen.getByRole("button", {
      name: workDetailStrings.state.options.planned,
    });

    fireEvent.click(planned);
    fireEvent.click(planned);
    expect(testState.saveUserWork).toHaveBeenCalledTimes(1);
    resolveSave?.(testState.saveUserWork.mock.calls[0]![0]);
    expect(await screen.findByText(workDetailStrings.state.plannedSaved)).toBeTruthy();
  });

  it("persists and authoritatively removes a minimal planned record", async () => {
    const view = renderDetail();
    fireEvent.click(screen.getByRole("button", { name: workDetailStrings.state.options.planned }));
    await waitFor(() => expect(testState.saveUserWork).toHaveBeenCalledTimes(1));
    const plannedRecord = testState.saveUserWork.mock.calls[0]![0];
    expect(plannedRecord).toMatchObject({ workId: target.id, readingState: "planned" });

    testState.userWorks = [plannedRecord];
    view.rerender(
      <CatalogProvider catalog={catalog}>
        <WorkDetailFlow workId={target.id} />
      </CatalogProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: workDetailStrings.state.options.planned }));
    await waitFor(() =>
      expect(testState.removeMinimalPlannedUserWork).toHaveBeenCalledWith(target.id),
    );
    expect(screen.getByText(workDetailStrings.state.plannedRemoved)).toBeTruthy();
  });

  it("preserves a newer meaningful record instead of claiming a stale planned removal", async () => {
    testState.userWorks = [
      {
        workId: target.id,
        readingState: "planned",
        updatedAt: "2026-08-14T00:00:00.000Z",
      },
    ];
    testState.removeMinimalPlannedUserWork.mockResolvedValue("preserved-conflict");
    renderDetail();

    fireEvent.click(screen.getByRole("button", { name: workDetailStrings.state.options.planned }));

    expect(await screen.findByText(workDetailStrings.state.plannedPreservedConflict)).toBeTruthy();
    expect(screen.queryByText(workDetailStrings.state.plannedRemoved)).toBeNull();
    expect(testState.removeMinimalPlannedUserWork).toHaveBeenCalledWith(target.id);
  });

  it("reports an already-absent stale planned record without claiming this action removed it", async () => {
    testState.userWorks = [
      {
        workId: target.id,
        readingState: "planned",
        updatedAt: "2026-08-14T00:00:00.000Z",
      },
    ];
    testState.removeMinimalPlannedUserWork.mockResolvedValue("already-absent");
    renderDetail();

    fireEvent.click(screen.getByRole("button", { name: workDetailStrings.state.options.planned }));

    expect(await screen.findByText(workDetailStrings.state.plannedAlreadyAbsent)).toBeTruthy();
    expect(screen.queryByText(workDetailStrings.state.plannedRemoved)).toBeNull();
  });

  it("omits compatibility without a profile and keeps the grounded provider failure fallback", async () => {
    testState.status = { state: "ready", mode: "indexeddb", warning: null };
    renderDetail();

    expect(
      screen.queryByRole("heading", { name: workDetailStrings.compatibility.heading }),
    ).toBeNull();
    const fallback = await screen.findByRole<HTMLAnchorElement>("link", {
      name: workDetailStrings.provider.searchNewTab,
    });
    expect(fallback.getAttribute("href")).toBe(buildRakutenBooksSearchUrl(target.title));
    expect(
      await screen.findByRole("button", { name: workDetailStrings.provider.retry }),
    ).toBeTruthy();
    expect(screen.queryByText(workDetailStrings.provider.unavailable)).toBeNull();
    expect(screen.queryByRole("heading", { name: workDetailStrings.synopsis.heading })).toBeNull();
    expect(screen.queryByText(workDetailStrings.synopsis.unavailable)).toBeNull();
  });

  it("keeps library-only records and metadata without using retained factors for detail recommendations", async () => {
    testState.status = { state: "ready", mode: "indexeddb", warning: null };
    const record: UserWorkRecord = {
      workId: target.id,
      readingState: "completed",
      reaction: "favorite",
      updatedAt: "2026-08-14T00:00:00.000Z",
    };
    testState.userWorks = [record];
    const view = renderDetail();
    await screen.findByRole("button", { name: workDetailStrings.provider.retry });
    expect(view.container.querySelectorAll('a[href^="/works/"]').length).toBeGreaterThan(0);
    expect(
      view.container.querySelector("#work-factors-heading")?.parentElement?.querySelector("li"),
    ).not.toBeNull();

    const libraryCatalog = {
      ...catalog,
      works: catalog.works.map((work) =>
        work.id === target.id
          ? {
              ...work,
              eligibility: {
                onboardingEligible: false,
                recommendationEligible: false,
                libraryOnly: true,
              },
            }
          : work,
      ),
    };
    view.rerender(
      <CatalogProvider catalog={libraryCatalog}>
        <WorkDetailFlow workId={target.id} />
      </CatalogProvider>,
    );

    expect(screen.getByRole("heading", { name: target.title })).toBeTruthy();
    expect(
      screen
        .getByRole("button", { name: workDetailStrings.state.options.completed })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    expect(screen.queryByRole("heading", { name: workDetailStrings.factors.heading })).toBeNull();
    expect(screen.queryByText(workDetailStrings.factors.empty)).toBeNull();
    expect(view.container.querySelectorAll('a[href^="/works/"]')).toHaveLength(0);
    expect(testState.userWorks).toEqual([record]);
    expect(testState.saveUserWork).not.toHaveBeenCalled();
    expect(libraryCatalog.works.find((work) => work.id === target.id)?.axes).toEqual(target.axes);
    expect(libraryCatalog.works.find((work) => work.id === target.id)?.themes).toEqual(
      target.themes,
    );
  });

  it("keeps fresh metadata but hides expired commercial data after refresh failure", async () => {
    testState.status = { state: "ready", mode: "indexeddb", warning: null };
    const cached = providerCacheRecord({ commercialFresh: false, metadataFresh: true });
    testState.getProviderCache.mockResolvedValue(cached);

    renderDetail();

    expect(await screen.findByText(cached.itemCaption!)).toBeTruthy();
    const cover = screen.getByRole<HTMLImageElement>("img", {
      name: coverStrings.alt(target.title),
    });
    expect(cover.getAttribute("src")).toContain("thumbnail.image.rakuten.co.jp/book.jpg");
    const directLink = screen.getByRole<HTMLAnchorElement>("link", {
      name: workDetailStrings.provider.openNewTab,
    });
    expect(directLink.getAttribute("href")).toBe(cached.affiliateUrl);
    await screen.findByRole("button", { name: workDetailStrings.provider.retry });
    expect(screen.queryByText(workDetailStrings.provider.price(cached.itemPrice!))).toBeNull();
    expect(
      screen.queryByText(workDetailStrings.provider.availability[cached.availability!]),
    ).toBeNull();
  });

  it("uses only the stale item URL after metadata expiry and refresh failure", async () => {
    testState.status = { state: "ready", mode: "indexeddb", warning: null };
    const cached = providerCacheRecord({ commercialFresh: false, metadataFresh: false });
    testState.getProviderCache.mockResolvedValue(cached);

    const view = renderDetail();

    await screen.findByRole("button", { name: workDetailStrings.provider.retry });
    expect(screen.queryByRole("heading", { name: workDetailStrings.synopsis.heading })).toBeNull();
    expect(screen.queryByText(workDetailStrings.synopsis.unavailable)).toBeNull();
    expect(view.container.innerHTML).not.toContain(cached.imageUrl);
    expect(view.container.textContent).not.toContain(String(cached.reviewAverage));
    expect(view.container.textContent).not.toContain(String(cached.reviewCount));
    expect(screen.queryByText(workDetailStrings.provider.affiliate)).toBeNull();
    const staleLink = screen.getByRole<HTMLAnchorElement>("link", {
      name: workDetailStrings.provider.openNewTab,
    });
    expect(staleLink.getAttribute("href")).toBe(cached.itemUrl);
  });

  it("expires visible cache fields without reload and does not auto-retry after failure", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-14T10:00:00.000Z"));
    testState.status = { state: "ready", mode: "indexeddb", warning: null };
    const cached = providerCacheRecord({
      commercialFresh: true,
      metadataFresh: true,
      commercialExpiresInMs: 1_000,
      metadataExpiresInMs: 2_000,
    });
    testState.getProviderCache.mockResolvedValue(cached);

    const view = renderDetail();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    const heroRequestCount = () =>
      testState.requestRakutenBook.mock.calls.filter(([isbn]) => isbn === cached.isbn).length;
    expect(screen.getByText(workDetailStrings.provider.price(cached.itemPrice!))).toBeTruthy();
    expect(screen.getByText(cached.itemCaption!)).toBeTruthy();
    expect(heroRequestCount()).toBe(0);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_000);
    });
    expect(screen.queryByText(workDetailStrings.provider.price(cached.itemPrice!))).toBeNull();
    expect(screen.getByText(cached.itemCaption!)).toBeTruthy();
    expect(heroRequestCount()).toBe(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_000);
    });
    expect(screen.queryByRole("heading", { name: workDetailStrings.synopsis.heading })).toBeNull();
    expect(screen.queryByText(workDetailStrings.synopsis.unavailable)).toBeNull();
    expect(view.container.innerHTML).not.toContain(cached.imageUrl);
    expect(heroRequestCount()).toBe(1);
    expect(
      screen
        .getByRole<HTMLAnchorElement>("link", {
          name: workDetailStrings.provider.openNewTab,
        })
        .getAttribute("href"),
    ).toBe(cached.itemUrl);
  });

  it("renders grounded compatibility and a separate evidence section with no empty slots", async () => {
    testState.userWorks = catalog.works.slice(0, 5).map((work, index) => ({
      workId: work.id,
      readingState: "completed" as const,
      reaction: index === 0 ? ("favorite" as const) : ("liked" as const),
      updatedAt: "2026-08-14T00:00:00.000Z",
    }));
    const recommendation = scoreWorkCompatibility(
      {
        catalog,
        records: testState.userWorks,
        adjustments: testState.adjustments,
        policies: testState.policies,
        context: recommendationContext,
      },
      target.id,
    );
    expect(recommendation).not.toBeNull();
    const expected = generateTasteExplanation({
      contributions: recommendation!.contributions,
      confidenceLevel: recommendation!.confidenceLevel,
      lexicon: explanationLexicon,
      resolveTitle: (workId) => catalog.works.find((work) => work.id === workId)?.title,
    });
    const anchorWorkId = expected.anchors[0]!.workId;
    const anchorIsbn = catalog.volumes.find(
      (volume) => volume.id === catalog.representativeVolumeByWorkId[anchorWorkId],
    )!.isbn;
    const anchorCache = {
      ...providerCacheRecord({ commercialFresh: true, metadataFresh: true }),
      workId: anchorWorkId,
      isbn: anchorIsbn,
    };
    testState.getProviderCache.mockImplementation(async (isbn) =>
      isbn === anchorIsbn ? anchorCache : null,
    );

    renderDetail();

    const heading = screen.getByRole("heading", { name: workDetailStrings.compatibility.heading });
    const summary = heading.closest("section")!;
    const leadReason = expected.positiveReasons[0]!;
    expect(summary.querySelector("p")?.textContent).toBe(leadReason.text);
    const leadAnchorTitle = leadReason.anchorWorkIds
      .map((workId) => catalog.works.find((work) => work.id === workId)?.title)
      .find(Boolean);
    if (leadReason.source === "similarity" && leadAnchorTitle !== undefined) {
      expect(summary.querySelector("strong")?.textContent).toBe(leadAnchorTitle);
    }
    expect(
      screen.queryByRole("heading", { name: workDetailStrings.compatibility.reasons }),
    ).toBeNull();
    expected.positiveReasons.slice(1).forEach((reason) => {
      const cluster = explanationClusterFor(reason.factorId);
      const label =
        cluster === undefined
          ? explanationLexicon.factorLabels[reason.factorId]
          : explanationLexicon.clusterLabels[cluster];
      expect(summary.textContent).toContain(
        reason.axisPreferenceDirection === "lower" ? reason.text : (label ?? reason.text),
      );
    });
    if (expected.caution !== undefined)
      expect(summary.textContent).toContain(expected.caution.text);
    expect(
      screen.queryByText(workDetailStrings.compatibility.confidence, { exact: false }),
    ).toBeNull();
    const evidence = screen.getByRole("region", { name: workDetailStrings.compatibility.anchors });
    expect(summary.contains(evidence)).toBe(false);
    expect(
      within(evidence).getByText(workDetailStrings.compatibility.anchorsDescription),
    ).toBeTruthy();
    const links = within(evidence).getAllByRole("link");
    expect(links).toHaveLength(expected.anchors.length);
    expect(within(evidence).getAllByRole("listitem")).toHaveLength(expected.anchors.length);
    for (const anchor of expected.anchors) {
      const link = links.find(
        (candidate) => candidate.getAttribute("href") === `/works/${anchor.workId}`,
      );
      expect(link).toBeDefined();
      expect(link?.textContent).toContain(anchor.title);
    }
    expect(within(evidence).queryByText(mediaStrings.evidencePlaceholder)).toBeNull();
    expect(
      within(evidence).getAllByText(workDetailStrings.compatibility.primaryAnchor),
    ).toHaveLength(1);
    expect(links[0]?.textContent).toContain(workDetailStrings.compatibility.primaryAnchor);
    for (const link of links.slice(1)) {
      expect(link.textContent).toContain(workDetailStrings.compatibility.supportingAnchor);
    }
    const anchorLink = links.find((link) => link.getAttribute("href") === `/works/${anchorWorkId}`);
    await waitFor(() => {
      expect(anchorLink?.querySelector("img")?.getAttribute("src")).toContain(
        "thumbnail.image.rakuten.co.jp/book.jpg",
      );
    });
    expect(
      within(evidence).queryByRole("button", { name: workDetailStrings.compatibility.allAnchors }),
    ).toBeNull();
    expect(evidence.querySelector("[data-ranking-position]")).toBeNull();
  });
});
