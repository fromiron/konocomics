// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useCallback, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Work } from "@/domain/catalog/types";
import { createWorkSearch } from "@/features/onboarding/search";
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
