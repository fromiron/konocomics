// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useCallback, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Work } from "@/domain/catalog/types";
import { createWorkSearch, findExcludedSearchMatches } from "@/features/onboarding/search";
import { WorkSearchInput, type WorkSearchState } from "@/features/onboarding/work-search-input";
import { createTestWork } from "../../helpers/catalog";

const dungeonMeshi: Work = {
  ...createTestWork({ id: "dungeon-meshi" }),
  title: "ダンジョン飯",
  titleKana: "ダンジョンメシ",
};
const otherWork: Work = {
  ...createTestWork({ id: "other-work" }),
  title: "別の作品",
  titleKana: "ベツノサクヒン",
};

function SearchHarness() {
  const [state, setState] = useState<WorkSearchState>({ query: "", results: [] });
  const handleSearchStateChange = useCallback((next: WorkSearchState) => setState(next), []);

  return (
    <>
      <WorkSearchInput
        label="作品を検索"
        onSearchStateChange={handleSearchStateChange}
        placeholder="タイトルを入力"
        works={[dungeonMeshi, otherWork]}
      />
      <output aria-live="polite">
        {state.results.map((work) => (
          <span key={work.id}>{work.title}</span>
        ))}
      </output>
    </>
  );
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("onboarding work search", () => {
  it("normalizes hiragana queries against katakana title data", () => {
    const search = createWorkSearch([dungeonMeshi, otherWork]);

    expect(search.search("だんじょんめし").map((work) => work.id)).toEqual(["dungeon-meshi"]);
  });

  it.each(["ダンジョン飯 完全版", "ダンジョン飯 電子版 1巻"])(
    "shares title edition and volume normalization for %s",
    (query) => {
      const search = createWorkSearch([dungeonMeshi, otherWork]);

      expect(search.search(query).map((work) => work.id)).toEqual(["dungeon-meshi"]);
    },
  );

  it("debounces the input and publishes matching works", async () => {
    vi.useFakeTimers();
    render(<SearchHarness />);

    fireEvent.change(screen.getByRole("searchbox", { name: "作品を検索" }), {
      target: { value: "だんじょんめし" },
    });
    expect(screen.queryByText("ダンジョン飯")).toBeNull();

    await act(async () => vi.advanceTimersByTime(300));

    expect(screen.getByText("ダンジョン飯")).toBeTruthy();
    expect(screen.queryByText("別の作品")).toBeNull();
  });
});

function UrlBackedSearchHarness({ onUrlWrite }: Readonly<{ onUrlWrite: (query: string) => void }>) {
  const [urlQuery, setUrlQuery] = useState<string | undefined>(undefined);
  const handleSearchStateChange = useCallback(() => undefined, []);

  return (
    <>
      <WorkSearchInput
        label="作品を検索"
        onQueryChange={(query) => {
          onUrlWrite(query);
          // Router search updates land after the input event, and the route
          // schema trims the stored value.
          window.setTimeout(() => {
            const trimmed = query.trim();
            setUrlQuery(trimmed.length > 0 ? trimmed : undefined);
          }, 20);
        }}
        onSearchStateChange={handleSearchStateChange}
        placeholder="タイトルを入力"
        query={urlQuery ?? ""}
        works={[dungeonMeshi, otherWork]}
      />
      <button onClick={() => setUrlQuery("だんじょん")} type="button">
        戻る
      </button>
    </>
  );
}

describe("onboarding search input bound to the URL", () => {
  it("keeps typed text, including a trailing space, while the URL catches up", async () => {
    vi.useFakeTimers();
    render(<UrlBackedSearchHarness onUrlWrite={() => undefined} />);
    const input = screen.getByRole<HTMLInputElement>("searchbox", { name: "作品を検索" });

    fireEvent.change(input, { target: { value: "ONE" } });
    expect(input.value).toBe("ONE");
    fireEvent.change(input, { target: { value: "ONE " } });
    expect(input.value).toBe("ONE ");
    await act(async () => vi.advanceTimersByTime(50));

    expect(input.value).toBe("ONE ");
  });

  it("does not write the URL until an IME composition is committed", async () => {
    vi.useFakeTimers();
    const writes: string[] = [];
    render(<UrlBackedSearchHarness onUrlWrite={(query) => writes.push(query)} />);
    const input = screen.getByRole<HTMLInputElement>("searchbox", { name: "作品を検索" });

    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: "しん" } });
    fireEvent.change(input, { target: { value: "進撃" } });
    expect(input.value).toBe("進撃");
    expect(writes).toEqual([]);
    fireEvent.compositionEnd(input);
    await act(async () => vi.advanceTimersByTime(50));

    expect(writes).toEqual(["進撃"]);
    expect(input.value).toBe("進撃");
  });

  it("ignores stale URL echoes but follows external URL changes", async () => {
    vi.useFakeTimers();
    render(<UrlBackedSearchHarness onUrlWrite={() => undefined} />);
    const input = screen.getByRole<HTMLInputElement>("searchbox", { name: "作品を検索" });

    fireEvent.change(input, { target: { value: "だ" } });
    fireEvent.change(input, { target: { value: "だん" } });
    await act(async () => vi.advanceTimersByTime(50));
    expect(input.value).toBe("だん");

    fireEvent.click(screen.getByRole("button", { name: "戻る" }));
    expect(input.value).toBe("だんじょん");
  });
});

describe("excluded onboarding search matches", () => {
  const libraryOnly: Work = {
    ...createTestWork({
      id: "library-only",
      eligibility: { onboardingEligible: false, recommendationEligible: false, libraryOnly: true },
    }),
    title: "ダンジョンの外",
  };

  it("explains registered and not-yet-analyzable matches without reporting selectable works", () => {
    const catalogSearch = createWorkSearch([dungeonMeshi, libraryOnly, otherWork]);

    const matches = findExcludedSearchMatches({
      catalogSearch,
      query: "だんじょん",
      registeredWorkIds: new Set(["dungeon-meshi"]),
      selectableWorkIds: new Set(["other-work"]),
    });

    expect(new Map(matches.map(({ work, reason }) => [work.id, reason]))).toEqual(
      new Map([
        ["dungeon-meshi", "registered"],
        ["library-only", "notAnalyzable"],
      ]),
    );
    expect(
      findExcludedSearchMatches({
        catalogSearch,
        query: "だんじょん",
        registeredWorkIds: new Set(),
        selectableWorkIds: new Set(["dungeon-meshi", "library-only"]),
      }),
    ).toEqual([]);
  });
});
