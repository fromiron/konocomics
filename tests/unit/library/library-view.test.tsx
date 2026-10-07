// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import recommendationContextJson from "@/data/generated/recommendation-context-v1.json";
import { recommendationContextSchema } from "@/domain/recommendation/context-schema";
import catalogJson from "@/data/generated/catalog-v1.json";
import type { ExternalWorkId } from "@/domain/catalog/external-work";
import { catalogV1Schema } from "@/domain/catalog/schema";
import type { ReadingState, UserWorkRecord } from "@/domain/profile/types";
import { LibraryView } from "@/features/library/library-view";
import type { ExternalWorkRecord } from "@/infrastructure/db";
import { libraryStrings } from "@/lib/strings";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    className,
    params,
    search,
    to,
  }: {
    children: ReactNode;
    className?: string;
    params?: { workId: string };
    search?: { workId?: string; section?: string };
    to: string;
  }) => {
    const path = params === undefined ? to : to.replace("$workId", params.workId);
    const query = search === undefined ? "" : `?${new URLSearchParams(search).toString()}`;
    return (
      <a className={className} href={`${path}${query}`}>
        {children}
      </a>
    );
  },
}));

const catalog = catalogV1Schema.parse(catalogJson);
const context = recommendationContextSchema.parse(recommendationContextJson);
const target = catalog.works[0]!;
const readingTarget = catalog.works.find(
  (work) => work.id !== target.id && catalog.volumes.some((volume) => volume.workId === work.id),
)!;
const completedTarget = catalog.works.find(
  (work) => work.id !== target.id && work.id !== readingTarget.id,
)!;
const externalId =
  "ext:rakuten:v1:0000000000000000000000000000000000000000000000000000000000000000";
const catalogRecord: UserWorkRecord = {
  workId: target.id,
  readingState: "planned",
  reaction: "liked",
  updatedAt: "2026-08-14T00:00:00.000Z",
};
const catalogMissingRecord: UserWorkRecord = {
  workId: "removed-from-current-catalog",
  readingState: "planned",
  reaction: "liked",
  updatedAt: "2026-08-12T00:00:00.000Z",
};
const externalRecord: ExternalWorkRecord = {
  id: externalId,
  normalizedKey: "external work::作者",
  title: "カタログ外の作品",
  creators: ["外部作者"],
  isbnSamples: ["9784101010014"],
  coverUrl: "https://thumbnail.image.rakuten.co.jp/book.jpg?_ex=600x600",
  record: {
    workId: externalId,
    readingState: "planned",
    updatedAt: "2026-08-13T00:00:00.000Z",
  },
};

function renderLibrary(options?: {
  activeState?: ReadingState | null;
  favoriteOnly?: boolean;
  page?: number;
  query?: string;
  view?: "grid" | "list";
  externalWorks?: ExternalWorkRecord[];
  showFooter?: boolean;
  sort?: "updated" | "title" | "rating";
  userWorks?: UserWorkRecord[];
}) {
  const saveUserWork = vi.fn<(record: UserWorkRecord) => Promise<void>>().mockResolvedValue();
  const saveExternalUserRecord = vi
    .fn<
      (id: ExternalWorkId, expectedNormalizedKey: string, record: UserWorkRecord) => Promise<void>
    >()
    .mockResolvedValue();
  render(
    <LibraryView
      activeState={options?.activeState}
      favoriteOnly={options?.favoriteOnly}
      page={options?.page}
      query={options?.query}
      view={options?.view}
      addCatalogWork={vi.fn().mockResolvedValue("added")}
      addExternalWork={vi.fn().mockResolvedValue("added")}
      catalog={catalog}
      externalWorks={options?.externalWorks ?? [externalRecord]}
      saveExternalUserRecord={saveExternalUserRecord}
      saveUserWork={saveUserWork}
      showFooter={options?.showFooter}
      sort={options?.sort}
      storageDegraded={false}
      userWorks={options?.userWorks ?? [catalogRecord]}
    />,
  );
  return { saveExternalUserRecord, saveUserWork };
}

afterEach(cleanup);

/** Picks one option in a record-editor choice group (読書状態 or 感想). */
function choose(group: string, option: string) {
  fireEvent.click(
    within(screen.getByRole("radiogroup", { name: group })).getByRole("radio", { name: option }),
  );
}

describe("LibraryView", () => {
  it("finds saved kana and alias matches without broadening the active filters", () => {
    const hunter = catalog.works.find((work) => work.id === "hunter-x-hunter")!;
    renderLibrary({
      query: "ﾊﾝﾀｰ",
      favoriteOnly: true,
      activeState: "dropped",
      externalWorks: [],
      userWorks: [
        { ...catalogRecord, workId: hunter.id, readingState: "dropped", reaction: "favorite" },
      ],
    });
    expect(
      screen.getByRole("button", { name: libraryStrings.openRecord(hunter.title) }),
    ).toBeTruthy();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "はんたー" } });
    expect(
      screen.getByRole("button", { name: libraryStrings.openRecord(hunter.title) }),
    ).toBeTruthy();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "zzzzzz" } });
    expect(
      screen.queryByRole("button", { name: libraryStrings.openRecord(hunter.title) }),
    ).toBeNull();
  });

  it("uses known released volumes and keeps a list status out of the cover", () => {
    renderLibrary({
      view: "list",
      externalWorks: [],
      userWorks: [
        {
          ...catalogRecord,
          workId: "hunter-x-hunter",
          readingState: "dropped",
          reaction: "favorite",
          progress: { volume: 12 },
        },
      ],
    });
    const total = context.constraintByWorkId["hunter-x-hunter"]!.volumeCount;
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("max")).toBe(String(total));
    expect(bar.getAttribute("value")).toBe("12");
    expect(screen.queryByText("100%")).toBeNull();
    expect(document.querySelector(".library-card__stamp")).toBeNull();
    const row = document.querySelector("[data-work-id=hunter-x-hunter]")!;
    expect(row.textContent).toContain(libraryStrings.tabs.dropped);
    expect(
      within(row.parentElement!).getByRole("button").getAttribute("aria-describedby"),
    ).toBeTruthy();
  });

  it("does not turn an unknown total or progress beyond known volumes into a percentage", () => {
    renderLibrary({
      externalWorks: [
        {
          ...externalRecord,
          record: { ...externalRecord.record, readingState: "completed", progress: { volume: 12 } },
        },
      ],
      userWorks: [
        {
          ...catalogRecord,
          workId: "hunter-x-hunter",
          readingState: "dropped",
          progress: { volume: 999 },
        },
      ],
    });
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.getByText(libraryStrings.progress(999, undefined))).toBeTruthy();
    expect(screen.getByText(libraryStrings.progress(12, undefined))).toBeTruthy();
  });

  it("does not normalize a page using an uncommitted URL query, including IME composition", () => {
    const onQueryChange = vi.fn();
    const onPageChange = vi.fn();
    const records = catalog.works
      .slice(0, 25)
      .map((work) => ({ ...catalogRecord, workId: work.id }));
    render(
      <LibraryView
        catalog={catalog}
        externalWorks={[]}
        userWorks={records}
        page={2}
        query=""
        onQueryChange={onQueryChange}
        onPageChange={onPageChange}
        addCatalogWork={vi.fn()}
        addExternalWork={vi.fn()}
        saveExternalUserRecord={vi.fn()}
        saveUserWork={vi.fn()}
        storageDegraded={false}
      />,
    );
    const input = screen.getByRole("searchbox");
    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: "存在しない検索" } });
    expect(onQueryChange).not.toHaveBeenCalled();
    expect(onPageChange).not.toHaveBeenCalled();
    fireEvent.compositionEnd(input);
    expect(onQueryChange).toHaveBeenCalledWith("存在しない検索");
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("sorts by rating, then by recency, and summarizes the collection in the header", () => {
    const [first, second, third] = catalog.works;
    if (first === undefined || second === undefined || third === undefined) {
      throw new Error("Expected three catalog works");
    }
    renderLibrary({
      externalWorks: [],
      sort: "rating",
      userWorks: [
        {
          workId: first.id,
          readingState: "completed",
          reaction: "liked",
          updatedAt: "2026-08-14T00:00:03.000Z",
        },
        {
          workId: second.id,
          readingState: "completed",
          reaction: "favorite",
          updatedAt: "2026-08-14T00:00:01.000Z",
        },
        { workId: third.id, readingState: "planned", updatedAt: "2026-08-14T00:00:02.000Z" },
      ],
    });

    expect(
      [...document.querySelectorAll("#library-results article")].map((article) =>
        article.getAttribute("data-work-id"),
      ),
    ).toEqual([second.id, first.id, third.id]);
    expect(screen.getByText(libraryStrings.basis(3, 1))).toBeTruthy();
    expect(screen.getByRole("option", { name: libraryStrings.toolbar.sortRating })).toBeTruthy();
    expect(document.querySelector("#library-results")?.textContent).not.toContain("記録を編集");
  });

  it("paginates after filtering and keeps global counts with a bounded last page", () => {
    const records: UserWorkRecord[] = catalog.works.slice(0, 50).map((work, index) => ({
      workId: work.id,
      readingState: index < 26 ? "completed" : "planned",
      updatedAt: new Date(Date.UTC(2026, 8, 1, 0, 0, index)).toISOString(),
    }));
    renderLibrary({ activeState: "completed", page: 2, userWorks: records, externalWorks: [] });

    expect(
      screen.getByRole("tab", { name: libraryStrings.tabWithCount("すべて", 50) }),
    ).toBeTruthy();
    expect(screen.getByText(libraryStrings.pagination.resultRange(25, 26, 26))).toBeTruthy();
    expect(
      [...document.querySelectorAll("[data-work-id]")].map((row) =>
        row.getAttribute("data-work-id"),
      ),
    ).toEqual([records[1]!.workId, records[0]!.workId]);
    expect(
      screen.getByRole<HTMLButtonElement>("button", { name: libraryStrings.pagination.next })
        .disabled,
    ).toBe(true);
  });

  it("leaves the footer and mobile-navigation clearance to the app shell", () => {
    renderLibrary({ externalWorks: [], showFooter: true });

    const main = screen.getByRole("main");

    expect(main.className).toContain("flex-1");
    expect(main.className).not.toContain("layout-mobile-navigation-clearance");
    expect(document.querySelector("footer")).toBeNull();
  });

  it.each(["grid", "list"] as const)(
    "shows each record once in updated order in the %s collection",
    (view) => {
      const readingRecord: UserWorkRecord = {
        workId: readingTarget.id,
        readingState: "completed",
        progress: { volume: 1, chapter: 4 },
        updatedAt: "2026-08-15T00:00:00.000Z",
      };
      const completedRecord: UserWorkRecord = {
        workId: completedTarget.id,
        readingState: "completed",
        updatedAt: "2026-08-13T00:00:00.000Z",
      };

      renderLibrary({
        activeState: null,
        view,
        externalWorks: [],
        userWorks: [{ ...catalogRecord, reaction: "favorite" }, readingRecord, completedRecord],
      });

      expect(
        [...document.querySelectorAll("[data-library-row-kind]")].map((row) =>
          row.getAttribute("data-work-id"),
        ),
      ).toEqual([readingRecord.workId, catalogRecord.workId, completedRecord.workId]);
      expect(screen.getAllByRole("button", { name: /の記録を編集$/u })).toHaveLength(3);
      expect(
        screen
          .getByRole("progressbar", { name: libraryStrings.editor.progress })
          .getAttribute("aria-valuetext"),
      ).toBe(
        [
          libraryStrings.progress(1, 4),
          libraryStrings.progressAgainstKnownVolumes(
            1,
            context.constraintByWorkId[readingTarget.id]!.volumeCount,
            Math.round(100 / context.constraintByWorkId[readingTarget.id]!.volumeCount),
          ),
        ].join("・"),
      );
    },
  );

  it("renders all five state tabs on the controlled overview path and discloses external rows and exclusion in detail", () => {
    renderLibrary({ activeState: null });
    expect(screen.getByRole("tablist", { name: libraryStrings.tablistLabel })).toBeTruthy();
    expect(screen.getAllByRole("tab")).toHaveLength(5);
    expect(
      screen.getByRole("tab", { name: libraryStrings.tabWithCount(libraryStrings.tabsAll, 2) }),
    ).toBeTruthy();
    expect(
      screen.getByRole("tab", {
        name: libraryStrings.tabWithCount(libraryStrings.tabs.planned, 2),
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("tab", {
        name: libraryStrings.tabWithCount(libraryStrings.tabs.completed, 0),
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("tab", {
        name: libraryStrings.tabWithCount(libraryStrings.tabs.dropped, 0),
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("tab", {
        name: libraryStrings.tabWithCount(libraryStrings.tabs.hidden, 0),
      }),
    ).toBeTruthy();
    expect(screen.getByRole("group", { name: libraryStrings.toolbar.viewLabel })).toBeTruthy();
    expect(
      screen
        .getByRole("tab", { name: libraryStrings.tabWithCount(libraryStrings.tabsAll, 2) })
        .getAttribute("aria-selected"),
    ).toBe("true");

    const [externalRecordButton] = screen.getAllByRole("button", {
      name: libraryStrings.openRecord(externalRecord.title),
    });
    if (externalRecordButton === undefined) throw new Error("Missing external record button");
    fireEvent.click(externalRecordButton);
    expect(screen.getByRole("dialog", { name: externalRecord.title })).toBeTruthy();
    expect(screen.getAllByText(libraryStrings.externalBadge).length).toBeGreaterThan(0);
    expect(screen.getByText(libraryStrings.externalExclusion)).toBeTruthy();
    expect(
      screen.getByRole("link", { name: libraryStrings.panel.externalDetail }).getAttribute("href"),
    ).toBe(`/works/external?${new URLSearchParams({ workId: externalRecord.id }).toString()}`);
  });

  it("saves deliberate Catalog edits and reports success only after the save resolves", async () => {
    let release: (() => void) | undefined;
    const savePromise = new Promise<void>((resolve) => {
      release = resolve;
    });
    const saveUserWork = vi
      .fn<(record: UserWorkRecord) => Promise<void>>()
      .mockReturnValue(savePromise);
    render(
      <LibraryView
        addCatalogWork={vi.fn().mockResolvedValue("added")}
        addExternalWork={vi.fn().mockResolvedValue("added")}
        catalog={catalog}
        externalWorks={[]}
        saveExternalUserRecord={vi.fn().mockResolvedValue(undefined)}
        saveUserWork={saveUserWork}
        storageDegraded={false}
        userWorks={[catalogRecord]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: libraryStrings.openRecord(target.title) }));
    choose(libraryStrings.editor.readingState, libraryStrings.tabs.completed);
    fireEvent.click(screen.getByRole("button", { name: libraryStrings.editor.save }));

    expect(saveUserWork).toHaveBeenCalledWith(
      expect.objectContaining({ workId: target.id, readingState: "completed" }),
    );
    expect(screen.queryByText(libraryStrings.editor.saved)).toBeNull();
    release?.();
    await waitFor(() => expect(screen.getByText(libraryStrings.editor.saved)).toBeTruthy());
  });

  it("traps panel dismissal and restores focus to the row opener", async () => {
    renderLibrary({ externalWorks: [] });
    const opener = screen.getByRole("button", { name: libraryStrings.openRecord(target.title) });
    opener.focus();
    fireEvent.click(opener);
    const dialog = screen.getByRole("dialog", { name: target.title });
    await waitFor(() => expect(document.body.style.overflowY).toBe("hidden"));
    fireEvent.keyDown(dialog, { key: "Escape" });

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(opener);
    await waitFor(() => expect(document.body.style.overflowY).toBe(""));
  });

  it("shows the contracted overall and per-tab empty states", () => {
    renderLibrary({ externalWorks: [], userWorks: [] });
    expect(screen.getByText(libraryStrings.overallEmpty.description)).toBeTruthy();
    expect(screen.getAllByRole("button", { name: libraryStrings.addWork }).length).toBeGreaterThan(
      0,
    );
    expect(
      document
        .querySelector('img[src="/media/library-empty-shelf.png"]')
        ?.getAttribute("aria-hidden"),
    ).toBe("true");
    expect(document.querySelector('img[src="/media/library-data-portability.png"]')).toBeNull();
    expect(screen.queryByRole("link", { name: libraryStrings.tools.openSettings })).toBeNull();

    cleanup();
    renderLibrary({ externalWorks: [], userWorks: [catalogRecord] });
    fireEvent.click(
      screen.getByRole("tab", {
        name: libraryStrings.tabWithCount(libraryStrings.tabs.completed, 0),
      }),
    );
    expect(screen.getByText(libraryStrings.tabEmpty.completed)).toBeTruthy();
    expect(document.querySelector('img[src="/media/library-empty-shelf.png"]')).toBeNull();
  });

  it("shows an image-free backup summary that opens settings data", () => {
    renderLibrary({ externalWorks: [], userWorks: [catalogRecord] });

    const heading = screen.getByRole("heading", { name: libraryStrings.tools.heading });
    expect(screen.getByText(libraryStrings.tools.description(1))).toBeTruthy();
    expect(
      screen.getByRole("link", { name: libraryStrings.tools.openSettings }).getAttribute("href"),
    ).toBe("/settings?section=data");
    expect(heading.closest("section")?.querySelector("img")).toBeNull();
    expect(document.querySelector('img[src="/media/library-empty-shelf.png"]')).toBeNull();
  });

  it("keeps an imported current-Catalog-missing record visible and editable without fake details", async () => {
    const { saveUserWork } = renderLibrary({
      externalWorks: [],
      userWorks: [catalogMissingRecord],
    });

    const row = document.querySelector(
      '[data-library-row-kind="catalog-missing"][data-work-id="removed-from-current-catalog"]',
    );
    expect(row).not.toBeNull();
    expect(screen.getByText(libraryStrings.catalogMissing.badge)).toBeTruthy();
    expect(
      screen.getByText(libraryStrings.catalogMissing.workId(catalogMissingRecord.workId)),
    ).toBeTruthy();
    expect(screen.getByText(libraryStrings.catalogMissing.coverUnavailable)).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", {
        name: libraryStrings.catalogMissing.openRecord(catalogMissingRecord.workId),
      }),
    );
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText(libraryStrings.catalogMissing.description)).toBeTruthy();
    choose(libraryStrings.editor.readingState, libraryStrings.tabs.completed);
    fireEvent.click(screen.getByRole("button", { name: libraryStrings.editor.save }));

    await waitFor(() =>
      expect(saveUserWork).toHaveBeenCalledWith(
        expect.objectContaining({
          workId: catalogMissingRecord.workId,
          readingState: "completed",
        }),
      ),
    );
  });
  it("distinguishes empty search results from an empty library while retaining registered counts", () => {
    renderLibrary({ activeState: "completed", query: "zzzz", externalWorks: [] });
    expect(screen.getByText(libraryStrings.filteredEmpty.search("zzzz"))).toBeTruthy();
    expect(screen.getByText(libraryStrings.toolbar.resultCount(0))).toBeTruthy();
    expect(
      screen.getByRole("tab", { name: libraryStrings.tabWithCount(libraryStrings.tabsAll, 1) }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: libraryStrings.filteredEmpty.clearSearch }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: libraryStrings.filteredEmpty.clearFilters }),
    ).toBeTruthy();
    expect(screen.queryByText(libraryStrings.tabEmpty.completed)).toBeNull();
    expect(screen.queryByRole("link", { name: libraryStrings.tools.openSettings })).toBeNull();
  });

  it("combines favorite with state and search without repeating the selected state on each card", () => {
    renderLibrary({
      activeState: "planned",
      favoriteOnly: true,
      query: target.title,
      externalWorks: [],
      userWorks: [
        { ...catalogRecord, reaction: "favorite" },
        {
          workId: readingTarget.id,
          readingState: "completed",
          reaction: "favorite",
          updatedAt: catalogRecord.updatedAt,
        },
      ],
    });
    const rows = document.querySelectorAll("[data-library-row-kind]");
    expect(rows).toHaveLength(1);
    expect(rows[0]?.getAttribute("data-work-id")).toBe(target.id);
    expect(rows[0]?.querySelector("button")?.textContent).not.toContain(
      libraryStrings.tabs.planned,
    );
    expect(screen.getByText(libraryStrings.toolbar.resultCount(1))).toBeTruthy();
  });
});
