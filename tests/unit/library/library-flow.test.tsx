// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import catalogJson from "@/data/generated/catalog-v1.json";
import { catalogV1Schema } from "@/domain/catalog/schema";
import type { CatalogV1 } from "@/domain/catalog/types";
import type { UserWorkRecord } from "@/domain/profile/types";
import { LibraryFlow } from "@/features/library/library-flow";
import type { AddIfAbsentResult, ExternalWorkRecord } from "@/infrastructure/db";
import type { RakutenBookItem } from "@/infrastructure/rakuten";
import type * as RakutenExports from "@/infrastructure/rakuten";
import { libraryStrings } from "@/lib/strings";

const testState = vi.hoisted(() => ({
  catalog: undefined as unknown as CatalogV1,
  userWorks: [] as UserWorkRecord[],
  externalWorks: [] as ExternalWorkRecord[],
  addUserWorkIfAbsent:
    vi.fn<(record: UserWorkRecord) => Promise<AddIfAbsentResult<UserWorkRecord>>>(),
  addExternalWorkIfAbsent:
    vi.fn<(record: ExternalWorkRecord) => Promise<AddIfAbsentResult<ExternalWorkRecord>>>(),
  saveUserWork: vi.fn(),
  saveExternalUserRecord: vi.fn(),
  createPlannedExternalWorkRecord:
    vi.fn<(item: RakutenBookItem, updatedAt: string) => Promise<ExternalWorkRecord>>(),
  searchRakutenBooks: vi.fn<(title: string) => Promise<RakutenBookItem[]>>(),
}));

vi.mock("@/features/catalog/catalog-provider", () => ({
  useCatalog: () => testState.catalog,
}));

vi.mock("@/infrastructure/db", () => ({
  createPlannedExternalWorkRecord: testState.createPlannedExternalWorkRecord,
  usePersistence: () => ({
    status: { state: "ready", mode: "indexeddb", warning: null },
    userWorks: testState.userWorks,
    externalWorks: testState.externalWorks,
    addUserWorkIfAbsent: testState.addUserWorkIfAbsent,
    addExternalWorkIfAbsent: testState.addExternalWorkIfAbsent,
    saveUserWork: testState.saveUserWork,
    saveExternalUserRecord: testState.saveExternalUserRecord,
  }),
}));

vi.mock("@/infrastructure/rakuten", async (importOriginal) => {
  const actual = await importOriginal<typeof RakutenExports>();
  return { ...actual, searchRakutenBooks: testState.searchRakutenBooks };
});

const catalog = catalogV1Schema.parse(catalogJson);
const target = catalog.works[0]!;
const externalId =
  "ext:rakuten:v1:1111111111111111111111111111111111111111111111111111111111111111";
const providerItem: RakutenBookItem = {
  title: "カタログにない固有作品",
  author: "固有作者",
  publisherName: "出版社",
  isbn: "9784101010014",
  itemPrice: 770,
  itemUrl: "https://books.rakuten.co.jp/rb/example/",
  availability: 1,
  reviewAverage: 4,
  reviewCount: 2,
};
const plannedExternal: ExternalWorkRecord = {
  id: externalId,
  normalizedKey: '["カタログにない固有作品","固有作者"]',
  title: providerItem.title,
  creators: [providerItem.author],
  isbnSamples: [providerItem.isbn],
  record: {
    workId: externalId,
    readingState: "planned",
    updatedAt: "2026-08-14T00:00:00.000Z",
  },
};

function openSearch() {
  fireEvent.click(screen.getAllByRole("button", { name: libraryStrings.addWork })[0]!);
}

beforeEach(() => {
  testState.catalog = catalog;
  testState.userWorks = [];
  testState.externalWorks = [];
  testState.addUserWorkIfAbsent.mockReset();
  testState.addExternalWorkIfAbsent.mockReset();
  testState.saveUserWork.mockReset();
  testState.saveExternalUserRecord.mockReset();
  testState.createPlannedExternalWorkRecord.mockReset();
  testState.searchRakutenBooks.mockReset();
});

afterEach(cleanup);

describe("LibraryFlow add boundary", () => {
  it("uses atomic insert-only persistence for a local Catalog result", async () => {
    testState.addUserWorkIfAbsent.mockImplementation(async (record) => ({
      kind: "added",
      record,
    }));
    render(<LibraryFlow />);
    openSearch();
    fireEvent.change(screen.getByRole("searchbox", { name: libraryStrings.search.label }), {
      target: { value: target.title },
    });
    const result = screen
      .getAllByRole("listitem")
      .find((item) => within(item).queryAllByText(target.title).length > 0)!;
    fireEvent.click(within(result).getByRole("button", { name: libraryStrings.search.add }));

    await waitFor(() => expect(testState.addUserWorkIfAbsent).toHaveBeenCalledTimes(1));
    expect(testState.addUserWorkIfAbsent).toHaveBeenCalledWith({
      workId: target.id,
      readingState: "planned",
      updatedAt: expect.any(String),
    });
    expect(testState.saveUserWork).not.toHaveBeenCalled();
  });

  it("uses the canonical async creator before atomically adding an ISBN mismatch", async () => {
    testState.searchRakutenBooks.mockResolvedValue([providerItem]);
    testState.createPlannedExternalWorkRecord.mockResolvedValue(plannedExternal);
    testState.addExternalWorkIfAbsent.mockResolvedValue({
      kind: "added",
      record: plannedExternal,
    });
    render(<LibraryFlow />);
    openSearch();
    fireEvent.change(screen.getByRole("searchbox", { name: libraryStrings.search.label }), {
      target: { value: providerItem.title },
    });
    fireEvent.click(screen.getByRole("button", { name: libraryStrings.search.rakutenExpand }));
    await waitFor(() => expect(screen.getByText(libraryStrings.externalBadge)).toBeTruthy());
    const providerResult = screen
      .getAllByRole("listitem")
      .find((item) => within(item).queryByText(libraryStrings.externalBadge) !== null)!;
    fireEvent.click(
      within(providerResult).getByRole("button", {
        name: libraryStrings.search.externalMatch,
      }),
    );

    await waitFor(() =>
      expect(testState.createPlannedExternalWorkRecord).toHaveBeenCalledWith(
        providerItem,
        expect.any(String),
      ),
    );
    expect(testState.addExternalWorkIfAbsent).toHaveBeenCalledWith(plannedExternal);
    expect(testState.saveExternalUserRecord).not.toHaveBeenCalled();
  });
});
