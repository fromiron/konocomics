// @vitest-environment jsdom

import {
  act,
  cleanup,
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { parseExternalWorkId, type ExternalWorkId } from "@/domain/catalog/external-work";
import { ExternalWorkDetailFlow } from "@/features/work-detail/external-work-detail-flow";
import type {
  ExternalWorkLookupResult,
  ExternalWorkRecord,
  PersistenceStatus,
} from "@/infrastructure/db";
import {
  coverStrings,
  workDetailStrings,
  libraryStrings,
  externalDetailStrings,
} from "@/lib/strings";

const testState = vi.hoisted(() => ({
  status: { state: "ready", mode: "indexeddb", warning: null } as PersistenceStatus,
  inspectExternalWork: vi.fn<(id: ExternalWorkId) => Promise<ExternalWorkLookupResult>>(),
  saveExternalUserRecord:
    vi.fn<
      (
        id: ExternalWorkId,
        expectedNormalizedKey: string,
        record: ExternalWorkRecord["record"],
      ) => Promise<ExternalWorkRecord>
    >(),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(window.location.search),
}));

vi.mock("@/infrastructure/db", () => ({
  usePersistence: () => ({
    inspectExternalWork: testState.inspectExternalWork,
    saveExternalUserRecord: testState.saveExternalUserRecord,
    status: testState.status,
  }),
}));

const EXTERNAL_ID = parseExternalWorkId(`ext:rakuten:v1:${"a".repeat(64)}`);
const SECOND_EXTERNAL_ID = parseExternalWorkId(`ext:rakuten:v1:${"b".repeat(64)}`);

function externalRecord(
  id: ExternalWorkId = EXTERNAL_ID,
  title = "カタログ外の作品",
): ExternalWorkRecord {
  return {
    id,
    normalizedKey: JSON.stringify([title, "外部作者"]),
    title,
    creators: ["外部作者"],
    isbnSamples: ["9784101010014"],
    coverUrl: "https://thumbnail.image.rakuten.co.jp/book.jpg?_ex=600x600",
    record: {
      workId: id,
      readingState: "planned",
      updatedAt: "2026-08-14T00:00:00.000Z",
    },
  };
}

function setSearch(search: string) {
  window.history.replaceState({}, "", `/works/external${search}`);
}

function detailSearch(id: ExternalWorkId) {
  return `?${new URLSearchParams({ workId: id }).toString()}`;
}

function finishPageEntry(element: Element) {
  const standardEvent = createEvent.animationEnd(element);
  Object.defineProperty(standardEvent, "animationName", { value: "page-entry-b-enter" });
  fireEvent(element, standardEvent);
  const prefixedEvent = new window.Event("webkitAnimationEnd", { bubbles: true });
  Object.defineProperty(prefixedEvent, "animationName", { value: "page-entry-b-enter" });
  fireEvent(element, prefixedEvent);
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((next) => {
    resolve = next;
  });
  return { promise, resolve };
}

beforeEach(() => {
  setSearch("");
  testState.status = { state: "ready", mode: "indexeddb", warning: null };
  testState.inspectExternalWork.mockReset();
  testState.saveExternalUserRecord.mockReset();
  testState.saveExternalUserRecord.mockImplementation(
    async (id, _expectedNormalizedKey, record) => ({
      ...externalRecord(id),
      record,
    }),
  );
  vi.stubGlobal("fetch", vi.fn());
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("ExternalWorkDetailFlow", () => {
  it.each([
    ["missing", ""],
    ["empty", "?workId="],
    ["malformed", "?workId=external"],
    [
      "duplicate",
      `?workId=${encodeURIComponent(EXTERNAL_ID)}&workId=${encodeURIComponent(EXTERNAL_ID)}`,
    ],
  ])("rejects a %s workId before any storage or provider lookup", async (_case, search) => {
    setSearch(search);
    render(<ExternalWorkDetailFlow />);

    expect(
      await screen.findByRole("heading", { name: externalDetailStrings.malformed.title }),
    ).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: externalDetailStrings.malformed.library })
        .getAttribute("href"),
    ).toBe("/library");
    expect(testState.inspectExternalWork).not.toHaveBeenCalled();
    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(document.querySelector("main")?.getAttribute("data-external-detail-state")).toBe(
      "invalid",
    );
    expect(document.querySelector("main")?.classList.contains("page-entry-b")).toBe(false);
  });

  it.each([
    ["missing", externalDetailStrings.missing.title],
    ["corrupt", externalDetailStrings.corrupt.title],
    ["unavailable", externalDetailStrings.unavailable.title],
  ] as const)(
    "renders the %s local lookup result without provider recovery",
    async (kind, title) => {
      setSearch(detailSearch(EXTERNAL_ID));
      testState.inspectExternalWork.mockResolvedValue({ kind });
      render(<ExternalWorkDetailFlow />);

      expect(await screen.findByRole("heading", { name: title })).toBeTruthy();
      expect(testState.inspectExternalWork).toHaveBeenCalledTimes(1);
      expect(testState.inspectExternalWork).toHaveBeenCalledWith(EXTERNAL_ID);
      expect(globalThis.fetch).not.toHaveBeenCalled();
      expect(screen.queryByText("カタログ外の作品")).toBeNull();
      expect(document.querySelector("main")?.getAttribute("data-external-detail-state")).toBe(kind);
    },
  );

  it("maps a rejected local lookup to the unavailable state without provider recovery", async () => {
    setSearch(detailSearch(EXTERNAL_ID));
    testState.inspectExternalWork.mockRejectedValue(new Error("storage unavailable"));
    render(<ExternalWorkDetailFlow />);

    expect(
      await screen.findByRole("heading", { name: externalDetailStrings.unavailable.title }),
    ).toBeTruthy();
    expect(testState.inspectExternalWork).toHaveBeenCalledWith(EXTERNAL_ID);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("renders only stored bibliography and saves an authoritative reading record", async () => {
    const record = externalRecord();
    setSearch(detailSearch(record.id));
    testState.inspectExternalWork.mockResolvedValue({ kind: "found", record });
    render(<ExternalWorkDetailFlow />);

    expect(await screen.findByRole("heading", { level: 1, name: record.title })).toBeTruthy();
    expect(screen.getByText(coverStrings.creatorLine(record.creators))).toBeTruthy();
    expect(screen.getByText("9784101010014")).toBeTruthy();
    expect(screen.getByText(externalDetailStrings.badge)).toBeTruthy();
    expect(screen.getByText(externalDetailStrings.exclusion)).toBeTruthy();
    expect(screen.getByRole("img", { name: coverStrings.alt(record.title) })).toBeTruthy();
    expect(screen.queryByText(workDetailStrings.compatibility.heading)).toBeNull();
    expect(screen.queryByText(workDetailStrings.factors.heading)).toBeNull();
    expect(screen.queryByText(workDetailStrings.provider.heading)).toBeNull();
    expect(document.querySelector("main")?.getAttribute("data-external-work-detail")).toBe(
      record.id,
    );
    expect(document.querySelector("main")?.classList.contains("page-entry-b")).toBe(true);

    fireEvent.change(screen.getAllByRole<HTMLSelectElement>("combobox")[0]!, {
      target: { value: "completed" },
    });
    fireEvent.click(screen.getByRole("button", { name: libraryStrings.editor.save }));

    await waitFor(() => expect(testState.saveExternalUserRecord).toHaveBeenCalledTimes(1));
    expect(testState.saveExternalUserRecord).toHaveBeenCalledWith(
      record.id,
      record.normalizedKey,
      expect.objectContaining({ workId: record.id, readingState: "completed" }),
    );
    expect(await screen.findByText(externalDetailStrings.state.saved)).toBeTruthy();
  });

  it("uses a synchronous fence so repeated submits cannot enqueue duplicate writes", async () => {
    const record = externalRecord();
    const save = deferred<ExternalWorkRecord>();
    setSearch(detailSearch(record.id));
    testState.inspectExternalWork.mockResolvedValue({ kind: "found", record });
    testState.saveExternalUserRecord.mockReturnValue(save.promise);
    render(<ExternalWorkDetailFlow />);

    await screen.findByRole("heading", { level: 1, name: record.title });
    const form = screen.getByRole("button", { name: libraryStrings.editor.save }).closest("form")!;
    fireEvent.submit(form);
    fireEvent.submit(form);

    expect(testState.saveExternalUserRecord).toHaveBeenCalledTimes(1);
    await act(async () => {
      save.resolve(record);
      await save.promise;
    });
    expect(await screen.findByText(externalDetailStrings.state.saved)).toBeTruthy();
  });

  it("reports a failed write without claiming that the reading record was saved", async () => {
    const record = externalRecord();
    setSearch(detailSearch(record.id));
    testState.inspectExternalWork.mockResolvedValue({ kind: "found", record });
    testState.saveExternalUserRecord.mockRejectedValue(new Error("write failed"));
    render(<ExternalWorkDetailFlow />);

    await screen.findByRole("heading", { level: 1, name: record.title });
    fireEvent.click(screen.getByRole("button", { name: libraryStrings.editor.save }));

    expect((await screen.findByRole("alert")).textContent).toBe(externalDetailStrings.state.error);
    expect(screen.queryByText(externalDetailStrings.state.saved)).toBeNull();
    expect(
      screen.getByRole<HTMLButtonElement>("button", { name: libraryStrings.editor.save }).disabled,
    ).toBe(false);
  });

  it("discards a stale lookup when query navigation selects another external work", async () => {
    const first = externalRecord(EXTERNAL_ID, "先に開いた作品");
    const second = externalRecord(SECOND_EXTERNAL_ID, "次に開いた作品");
    const firstLookup = deferred<ExternalWorkLookupResult>();
    setSearch(detailSearch(first.id));
    testState.inspectExternalWork.mockImplementation((id) =>
      id === first.id ? firstLookup.promise : Promise.resolve({ kind: "found", record: second }),
    );
    const view = render(<ExternalWorkDetailFlow />);
    await waitFor(() => expect(testState.inspectExternalWork).toHaveBeenCalledWith(first.id));

    setSearch(detailSearch(second.id));
    view.rerender(<ExternalWorkDetailFlow />);
    expect(await screen.findByRole("heading", { level: 1, name: second.title })).toBeTruthy();

    await act(async () => {
      firstLookup.resolve({ kind: "found", record: first });
      await firstLookup.promise;
    });
    expect(screen.getByRole("heading", { level: 1, name: second.title })).toBeTruthy();
    expect(screen.queryByRole("heading", { level: 1, name: first.title })).toBeNull();
    expect(testState.inspectExternalWork).toHaveBeenCalledTimes(2);
  });

  it("does not remount or replay entry motion for an unrelated query change on the same work", async () => {
    const record = externalRecord();
    setSearch(detailSearch(record.id));
    testState.inspectExternalWork.mockResolvedValue({ kind: "found", record });
    const view = render(<ExternalWorkDetailFlow />);

    await screen.findByRole("heading", { level: 1, name: record.title });
    const firstMain = document.querySelector("main");
    finishPageEntry(firstMain!);
    expect(firstMain?.classList.contains("page-entry-b")).toBe(false);

    setSearch(`?view=full&${new URLSearchParams({ workId: record.id }).toString()}`);
    view.rerender(<ExternalWorkDetailFlow />);

    expect(document.querySelector("main")).toBe(firstMain);
    expect(document.querySelector("main")?.classList.contains("page-entry-b")).toBe(false);
    expect(testState.inspectExternalWork).toHaveBeenCalledTimes(1);
  });
});
