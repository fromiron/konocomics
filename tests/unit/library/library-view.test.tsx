// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import catalogJson from "@/data/generated/catalog-v1.json";
import type { ExternalWorkId } from "@/domain/catalog/external-work";
import { catalogV1Schema } from "@/domain/catalog/schema";
import type { UserWorkRecord } from "@/domain/profile/types";
import { LibraryView } from "@/features/library/library-view";
import type { ExternalWorkRecord } from "@/infrastructure/db";
import { libraryStrings } from "@/lib/strings";

const catalog = catalogV1Schema.parse(catalogJson);
const target = catalog.works[0]!;
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
  externalWorks?: ExternalWorkRecord[];
  userWorks?: UserWorkRecord[];
}) {
  const saveUserWork = vi.fn<(record: UserWorkRecord) => Promise<void>>().mockResolvedValue();
  const saveExternalUserRecord = vi
    .fn<
      (id: ExternalWorkId, expectedNormalizedKey: string, record: UserWorkRecord) => Promise<void>
    >()
    .mockResolvedValue();
  const externalHref = (id: string) =>
    `/works/external?${new URLSearchParams({ workId: id }).toString()}`;
  render(
    <LibraryView
      addCatalogWork={vi.fn().mockResolvedValue("added")}
      addExternalWork={vi.fn().mockResolvedValue("added")}
      catalog={catalog}
      externalHref={externalHref}
      externalWorks={options?.externalWorks ?? [externalRecord]}
      saveExternalUserRecord={saveExternalUserRecord}
      saveUserWork={saveUserWork}
      storageDegraded={false}
      userWorks={options?.userWorks ?? [catalogRecord]}
    />,
  );
  return { saveExternalUserRecord, saveUserWork };
}

afterEach(cleanup);

describe("LibraryView", () => {
  it("renders the five state tabs and discloses external rows and exclusion in detail", () => {
    renderLibrary();
    expect(screen.getAllByRole("tab")).toHaveLength(5);
    expect(
      screen.getByRole("tab", { name: libraryStrings.tabs.planned }).getAttribute("aria-selected"),
    ).toBe("true");

    fireEvent.click(
      screen.getByRole("button", { name: libraryStrings.openRecord(externalRecord.title) }),
    );
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
        externalHref={(id) => `/works/external?${new URLSearchParams({ workId: id }).toString()}`}
        externalWorks={[]}
        saveExternalUserRecord={vi.fn().mockResolvedValue(undefined)}
        saveUserWork={saveUserWork}
        storageDegraded={false}
        userWorks={[catalogRecord]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: libraryStrings.openRecord(target.title) }));
    fireEvent.change(screen.getAllByRole<HTMLSelectElement>("combobox")[0]!, {
      target: { value: "completed" },
    });
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
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.keyDown(dialog, { key: "Escape" });

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(opener);
    expect(document.body.style.overflow).toBe("");
  });

  it("shows the contracted overall and per-tab empty states", () => {
    renderLibrary({ externalWorks: [], userWorks: [] });
    expect(screen.getByText(libraryStrings.overallEmpty.description)).toBeTruthy();

    cleanup();
    renderLibrary({ externalWorks: [], userWorks: [catalogRecord] });
    fireEvent.click(screen.getByRole("tab", { name: libraryStrings.tabs.completed }));
    expect(screen.getByText(libraryStrings.tabEmpty.completed)).toBeTruthy();
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
    fireEvent.change(screen.getAllByRole<HTMLSelectElement>("combobox")[0]!, {
      target: { value: "completed" },
    });
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
});
