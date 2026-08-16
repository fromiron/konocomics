// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import catalogJson from "@/data/generated/catalog-v1.json";
import { catalogV1Schema } from "@/domain/catalog/schema";
import type { Work } from "@/domain/catalog/types";
import { type LibraryAddOutcome, WorkSearchSheet } from "@/features/library/work-search-sheet";
import type { RakutenBookItem } from "@/infrastructure/rakuten";
import type * as RakutenExports from "@/infrastructure/rakuten";
import { libraryStrings } from "@/lib/strings";

const testState = vi.hoisted(() => ({
  searchRakutenBooks: vi.fn(),
}));

vi.mock("@/infrastructure/rakuten", async (importOriginal) => {
  const actual = await importOriginal<typeof RakutenExports>();
  return { ...actual, searchRakutenBooks: testState.searchRakutenBooks };
});

const catalog = catalogV1Schema.parse(catalogJson);
const target = catalog.works[0]!;
const volume = catalog.volumes.find((candidate) => candidate.workId === target.id)!;

function providerItem(overrides: Partial<RakutenBookItem> = {}): RakutenBookItem {
  return {
    title: "プロバイダー作品 1",
    author: "作者名",
    publisherName: "出版社",
    isbn: "9784101010014",
    itemPrice: 770,
    itemUrl: "https://books.rakuten.co.jp/rb/example/",
    imageUrl: "https://thumbnail.image.rakuten.co.jp/book.jpg?_ex=600x600",
    availability: 1,
    reviewAverage: 4,
    reviewCount: 2,
    ...overrides,
  };
}

function renderSearch(options?: {
  isCatalogAdded?: (workId: string) => boolean;
  isExternalAdded?: (item: RakutenBookItem) => boolean;
  onAddCatalog?: (work: Work) => Promise<LibraryAddOutcome>;
  onAddExternal?: (item: RakutenBookItem) => Promise<LibraryAddOutcome>;
}) {
  const onAddCatalog =
    options?.onAddCatalog ??
    vi.fn<(work: Work) => Promise<LibraryAddOutcome>>().mockResolvedValue("added");
  const onAddExternal =
    options?.onAddExternal ??
    vi.fn<(item: RakutenBookItem) => Promise<LibraryAddOutcome>>().mockResolvedValue("added");
  render(
    <WorkSearchSheet
      catalog={catalog}
      isCatalogAdded={options?.isCatalogAdded ?? (() => false)}
      isExternalAdded={options?.isExternalAdded ?? (() => false)}
      onAddCatalog={onAddCatalog}
      onAddExternal={onAddExternal}
    />,
  );
  return { onAddCatalog, onAddExternal };
}

beforeEach(() => {
  testState.searchRakutenBooks.mockReset();
});

afterEach(cleanup);

describe("WorkSearchSheet", () => {
  it("keeps local Fuse search primary and calls Rakuten only after explicit expansion", async () => {
    testState.searchRakutenBooks.mockRejectedValue(new Error("offline"));
    const { onAddCatalog } = renderSearch();
    fireEvent.change(screen.getByRole("searchbox", { name: libraryStrings.search.label }), {
      target: { value: target.title },
    });

    expect(testState.searchRakutenBooks).not.toHaveBeenCalled();
    const localResult = screen
      .getAllByRole("listitem")
      .find((item) => within(item).queryAllByText(target.title).length > 0)!;
    const addButton = within(localResult).getByRole("button", {
      name: libraryStrings.search.add,
    });
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    await waitFor(() => expect(onAddCatalog).toHaveBeenCalledWith(target));
    expect(onAddCatalog).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: libraryStrings.search.rakutenExpand }));
    await waitFor(() =>
      expect(screen.getByText(libraryStrings.search.providerUnavailable)).toBeTruthy(),
    );
    expect(screen.getAllByText(target.title).length).toBeGreaterThan(0);
  });

  it("maps an ISBN match to the Catalog and creates only mismatches as external entries", async () => {
    const matched = providerItem({ isbn: volume.isbn, title: `${target.title} 1` });
    const external = providerItem();
    testState.searchRakutenBooks.mockResolvedValue([matched, external]);
    const { onAddCatalog, onAddExternal } = renderSearch();
    fireEvent.change(screen.getByRole("searchbox", { name: libraryStrings.search.label }), {
      target: { value: "作品" },
    });
    fireEvent.click(screen.getByRole("button", { name: libraryStrings.search.rakutenExpand }));

    await waitFor(() =>
      expect(screen.getByText(libraryStrings.search.rakutenHeading)).toBeTruthy(),
    );
    const results = screen
      .getAllByRole("listitem")
      .filter(
        (item) =>
          within(item).queryByText(libraryStrings.search.catalogMatch) !== null ||
          within(item).queryByText(libraryStrings.externalBadge) !== null,
      );
    const matchedResult = results.find(
      (item) => within(item).queryByText(libraryStrings.search.catalogMatch) !== null,
    )!;
    const externalResult = results.find(
      (item) => within(item).queryByText(libraryStrings.externalBadge) !== null,
    )!;

    fireEvent.click(within(matchedResult).getByRole("button", { name: libraryStrings.search.add }));
    await waitFor(() => expect(onAddCatalog).toHaveBeenCalledWith(target));
    fireEvent.click(
      within(externalResult).getByRole("button", {
        name: libraryStrings.search.externalMatch,
      }),
    );
    await waitFor(() => expect(onAddExternal).toHaveBeenCalledWith(external));
  });

  it("does not claim success when an atomic add has an unknown result", async () => {
    const onAddCatalog = vi
      .fn<(work: Work) => Promise<LibraryAddOutcome>>()
      .mockResolvedValue("preserved-unknown");
    renderSearch({ onAddCatalog });
    fireEvent.change(screen.getByRole("searchbox", { name: libraryStrings.search.label }), {
      target: { value: target.title },
    });
    const localResult = screen
      .getAllByRole("listitem")
      .find((item) => within(item).queryAllByText(target.title).length > 0)!;
    fireEvent.click(within(localResult).getByRole("button", { name: libraryStrings.search.add }));

    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toContain(libraryStrings.search.addUnknown),
    );
    expect(screen.queryByText(libraryStrings.search.addedAnnouncement(target.title))).toBeNull();
  });
});
