// @vitest-environment jsdom

import { webcrypto } from "node:crypto";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import catalogJson from "@/data/generated/catalog-v1.json";
import { catalogV1Schema } from "@/domain/catalog/schema";
import { CatalogProvider } from "@/features/catalog/catalog-provider";
import { PopularWorkDiscovery } from "@/features/discovery/popular-work-discovery";
import { selectPopularWork } from "@/features/discovery/popular-works";
import { createPersistence, PersistenceProvider } from "@/infrastructure/db";
import { MemoryPersistenceBackend } from "@/infrastructure/db/memory-backend";
import type * as Rakuten from "@/infrastructure/rakuten";
import { libraryStrings, popularWorkStrings } from "@/lib/strings";

const provider = vi.hoisted(() => ({ popular: vi.fn(), search: vi.fn() }));
vi.mock("@/infrastructure/rakuten", async (importOriginal) => ({
  ...(await importOriginal<typeof Rakuten>()),
  fetchPopularRakutenBooks: provider.popular,
  searchRakutenBooks: provider.search,
}));
const catalog = catalogV1Schema.parse(catalogJson);
const work = catalog.works[0]!;
const volume = catalog.volumes.find((entry) => entry.workId === work.id)!;
const item: Rakuten.RakutenBookItem = {
  title: `${work.title} 1`,
  author: work.creators.join("/"),
  publisherName: "出版社",
  isbn: volume.isbn,
  itemPrice: 700,
  itemUrl: "https://books.rakuten.co.jp/rb/example/",
  itemCaption: "本の紹介文。",
  reviewAverage: 4,
  reviewCount: 10,
};

async function mount(embedded = false) {
  const persistence = createPersistence({
    primaryFactory: async () => new MemoryPersistenceBackend(),
  });
  const root = createRootRoute({
    component: () => (
      <CatalogProvider catalog={catalog}>
        <PersistenceProvider persistence={persistence}>
          <PopularWorkDiscovery embedded={embedded} />
        </PersistenceProvider>
      </CatalogProvider>
    ),
  });
  const router = createRouter({
    routeTree: root,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  render(<RouterProvider router={router} />);
  await screen.findByRole("button", { name: popularWorkStrings.unread });
  return persistence;
}

beforeEach(() => {
  vi.stubGlobal("crypto", webcrypto);
  sessionStorage.clear();
  provider.popular.mockResolvedValue([item]);
  provider.search.mockResolvedValue([item]);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("popular work discovery", () => {
  it("leaves an unread answer unrecorded and saves a separately confirmed reading state", async () => {
    const persistence = await mount();
    fireEvent.click(screen.getByRole("button", { name: popularWorkStrings.unread }));
    await screen.findByRole("dialog");
    expect(screen.getByText(item.itemCaption!)).toBeTruthy();
    expect(await persistence.getUserWorks()).toEqual([]);
    expect(await persistence.getExternalWorks()).toEqual([]);
    fireEvent.click(screen.getByRole("button", { name: "閉じる" }));
    fireEvent.click(screen.getByRole("button", { name: popularWorkStrings.read }));
    const state = await screen.findByRole("combobox", { name: libraryStrings.editor.readingState });
    expect(await persistence.getUserWorks()).toEqual([]);
    fireEvent.change(state, { target: { value: "reading" } });
    fireEvent.change(screen.getByRole("combobox", { name: libraryStrings.editor.reaction }), {
      target: { value: "liked" },
    });
    fireEvent.click(screen.getByRole("button", { name: libraryStrings.editor.save }));
    await screen.findByText(libraryStrings.editor.saved);
    expect(await persistence.getUserWorks()).toEqual([
      expect.objectContaining({ workId: work.id, readingState: "reading", reaction: "liked" }),
    ]);
    expect(await persistence.getExternalWorks()).toEqual([]);
  });

  it("previews an unsaved external work inside the add sheet and inserts only on explicit add", async () => {
    const external = {
      ...item,
      isbn: "9784101010014",
      title: "固有の新しい漫画 1",
      author: "固有作者",
    };
    provider.popular.mockResolvedValue([external]);
    provider.search.mockResolvedValue([external]);
    const persistence = await mount(true);
    fireEvent.click(screen.getByRole("button", { name: popularWorkStrings.unread }));
    await screen.findByText(libraryStrings.externalExclusion);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(await persistence.getExternalWorks()).toEqual([]);
    fireEvent.click(screen.getByRole("button", { name: popularWorkStrings.back }));
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: popularWorkStrings.unread }),
    );
    fireEvent.click(screen.getByRole("button", { name: popularWorkStrings.unread }));
    await screen.findByText(libraryStrings.externalExclusion);
    fireEvent.click(screen.getByRole("button", { name: libraryStrings.search.add }));
    await screen.findByText(libraryStrings.editor.saved);
    const saved = await persistence.getExternalWorks();
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({
      title: external.title,
      isbnSamples: [external.isbn],
      record: { readingState: "planned" },
    });
    expect(saved[0]!.record.reaction).toBeUndefined();
    expect(saved[0]!.id).toMatch(/^ext:rakuten:v1:[0-9a-f]{64}$/u);
    expect(await persistence.getUserWorks()).toEqual([]);
  });

  it("keeps the editor open when persistence cannot confirm the add", async () => {
    const persistence = await mount();
    vi.spyOn(persistence, "addUserWorkIfAbsent").mockResolvedValue({ kind: "preserved-unknown" });
    fireEvent.click(screen.getByRole("button", { name: popularWorkStrings.read }));
    fireEvent.click(await screen.findByRole("button", { name: libraryStrings.editor.save }));
    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toBe(libraryStrings.search.addUnknown),
    );
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.queryByText(libraryStrings.editor.saved)).toBeNull();
    expect(await persistence.getUserWorks()).toEqual([]);
  });

  it("excludes saved series across volumes without sorting the sales list by taste", () => {
    const next = { ...item, isbn: "9784101010014", title: "次の漫画 1" };
    expect(selectPopularWork([item, next], catalog, [], [])).toBe(item);
    expect(
      selectPopularWork(
        [{ ...item, title: `${work.title} 80`, isbn: "9784091380135" }, next],
        catalog,
        [{ workId: work.id, readingState: "hidden", updatedAt: "2026-09-11T00:00:00Z" }],
        [],
      ),
    ).toBe(next);
  });
});
