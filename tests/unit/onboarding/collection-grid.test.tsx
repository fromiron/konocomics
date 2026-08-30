// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  COLLECTION_EXPANDED_LIMIT,
  COLLECTION_PANEL_ID,
  exclusiveOnboardingSearch,
  type OnboardingCollectionId,
} from "@/features/onboarding/onboarding-collections";
import { OnboardingCollectionGrid } from "@/features/onboarding/onboarding-step-one-sections";
import { onboardingStrings } from "@/lib/strings";
import { createTestWork } from "../../helpers/catalog";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const ANCHOR_LABELS = {
  select: onboardingStrings.step1.select,
  remove: onboardingStrings.step1.remove,
  selected: onboardingStrings.step1.selected,
  favorite: onboardingStrings.step1.favorite,
  markFavorite: onboardingStrings.step1.markFavorite,
  markLiked: onboardingStrings.step1.markLiked,
} as const;

function stubViewport(desktop: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: desktop && query.includes("min-width: 768px"),
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
}

function createCollectionWorks(
  collectionId: OnboardingCollectionId,
  count: number,
  genres: readonly ("horror" | "fantasy" | "action")[] = ["horror"],
) {
  return Array.from({ length: count }, (_, index) => ({
    ...createTestWork({
      id: `${collectionId}-${String(index + 1)}`,
      genres: [...genres],
    }),
    title: `${collectionId}作品${String(index + 1)}`,
  }));
}

const previewWorks = new Map<OnboardingCollectionId, ReturnType<typeof createTestWork>[]>([
  ["mysteries", createCollectionWorks("mysteries", 3)],
  ["worlds", createCollectionWorks("worlds", 3, ["fantasy"])],
]);

const coverUrls = new Map(
  [...previewWorks.values()]
    .flat()
    .map((work) => [work.id, `https://example.com/${work.id}.jpg`] as const),
);

function renderGrid({
  activeId,
  desktop = false,
  panelWorks = previewWorks.get("mysteries") ?? [],
  onSelect = vi.fn(),
  onToggleSelection = vi.fn(),
}: {
  activeId?: OnboardingCollectionId;
  desktop?: boolean;
  panelWorks?: ReturnType<typeof createTestWork>[];
  onSelect?: (id: OnboardingCollectionId | undefined) => void;
  onToggleSelection?: (workId: string) => void;
} = {}) {
  stubViewport(desktop);
  const allCovers = new Map(coverUrls);
  for (const work of panelWorks) {
    allCovers.set(work.id, `https://example.com/${work.id}.jpg`);
  }
  return {
    onSelect,
    onToggleSelection,
    ...render(
      <OnboardingCollectionGrid
        activeId={activeId}
        coverUrls={allCovers}
        labels={ANCHOR_LABELS}
        onCoverVisible={vi.fn()}
        onSelect={onSelect}
        onToggleFavorite={vi.fn()}
        onToggleSelection={onToggleSelection}
        panelWorks={panelWorks}
        previewWorks={previewWorks}
        selectionsByWorkId={new Map()}
      />,
    ),
  };
}

describe("exclusiveOnboardingSearch", () => {
  it("keeps a single discovery mode with q over valid shelf over genre", () => {
    expect(exclusiveOnboardingSearch({ q: "鋼", genre: "action", shelf: "mysteries" })).toEqual({
      q: "鋼",
    });
    expect(exclusiveOnboardingSearch({ genre: "action", shelf: "mysteries" })).toEqual({
      shelf: "mysteries",
    });
    expect(exclusiveOnboardingSearch({ genre: "action", shelf: "not-a-collection" })).toEqual({
      genre: "action",
    });
    expect(exclusiveOnboardingSearch({ q: "   ", genre: "fantasy" })).toEqual({
      genre: "fantasy",
    });
    expect(exclusiveOnboardingSearch({})).toEqual({});
  });
});

describe("OnboardingCollectionGrid", () => {
  it("uses compact disclosure triggers that open one named inline panel", () => {
    const { onSelect } = renderGrid();

    expect(
      screen.getByRole("heading", { name: onboardingStrings.step1.collectionsHeading }),
    ).toBeTruthy();
    const mysteries = screen.getByRole("button", { name: /謎と緊張を楽しむ/u });
    const worlds = screen.getByRole("button", { name: /別世界へ入り込む/u });
    expect(mysteries.getAttribute("type")).toBe("button");
    expect(mysteries.getAttribute("aria-expanded")).toBe("false");
    expect(mysteries.getAttribute("aria-controls")).toBeNull();
    expect(worlds.getAttribute("aria-controls")).toBeNull();
    expect(mysteries.getAttribute("aria-pressed")).toBeNull();
    expect(within(mysteries).queryByRole("button")).toBeNull();
    expect(within(mysteries).queryByText("この棚を見る")).toBeNull();
    expect(
      mysteries.querySelector(".onboarding-collection__covers")?.getAttribute("aria-hidden"),
    ).toBe("true");
    expect(screen.queryByRole("region", { name: "謎と緊張を楽しむ" })).toBeNull();

    fireEvent.click(mysteries);
    expect(onSelect).toHaveBeenCalledWith("mysteries");
  });

  it("closes on the same trigger and replaces the same region for another trigger", () => {
    const { onSelect, rerender } = renderGrid({
      activeId: "mysteries",
      panelWorks: createCollectionWorks("mysteries", 4),
    });

    const mysteries = screen.getByRole("button", { name: /謎と緊張を楽しむ/u });
    const worlds = screen.getByRole("button", { name: /別世界へ入り込む/u });
    expect(mysteries.getAttribute("aria-expanded")).toBe("true");
    expect(mysteries.getAttribute("aria-controls")).toBe(COLLECTION_PANEL_ID);
    expect(worlds.getAttribute("aria-expanded")).toBe("false");
    expect(worlds.getAttribute("aria-controls")).toBeNull();
    const panel = screen.getByRole("region", { name: "謎と緊張を楽しむ" });
    expect(panel.getAttribute("id")).toBe(COLLECTION_PANEL_ID);
    expect(within(panel).getByRole("heading", { name: "謎と緊張を楽しむ" })).toBeTruthy();
    expect(within(panel).getByRole("button", { name: "mysteries作品1 — 好きに追加" })).toBeTruthy();

    fireEvent.click(mysteries);
    expect(onSelect).toHaveBeenCalledWith(undefined);

    fireEvent.click(worlds);
    expect(onSelect).toHaveBeenCalledWith("worlds");

    rerender(
      <OnboardingCollectionGrid
        activeId="worlds"
        coverUrls={coverUrls}
        labels={ANCHOR_LABELS}
        onCoverVisible={vi.fn()}
        onSelect={onSelect}
        onToggleFavorite={vi.fn()}
        onToggleSelection={vi.fn()}
        panelWorks={createCollectionWorks("worlds", 2, ["fantasy"])}
        previewWorks={previewWorks}
        selectionsByWorkId={new Map()}
      />,
    );
    expect(screen.getByRole("region", { name: "別世界へ入り込む" }).getAttribute("id")).toBe(
      COLLECTION_PANEL_ID,
    );
    expect(screen.queryByRole("region", { name: "謎と緊張を楽しむ" })).toBeNull();
    expect(screen.queryByRole("button", { name: "mysteries作品1 — 好きに追加" })).toBeNull();
    expect(screen.getByRole("button", { name: "worlds作品1 — 好きに追加" })).toBeTruthy();
  });

  it("shows eight works on mobile, twelve on desktop, and expands once to at most 40", () => {
    const manyWorks = createCollectionWorks("mysteries", 45);
    renderGrid({
      activeId: "mysteries",
      panelWorks: manyWorks,
    });

    const panel = () => screen.getByRole("region", { name: "謎と緊張を楽しむ" });
    expect(within(panel()).getAllByRole("button", { name: /好きに追加/u })).toHaveLength(8);
    fireEvent.click(screen.getByRole("button", { name: onboardingStrings.step1.showMore }));
    expect(within(panel()).getAllByRole("button", { name: /好きに追加/u })).toHaveLength(
      COLLECTION_EXPANDED_LIMIT,
    );
    expect(screen.queryByRole("button", { name: onboardingStrings.step1.showMore })).toBeNull();
    const expandedStatus = within(panel()).getByRole("status");
    expect(expandedStatus.textContent).toBe(
      onboardingStrings.step1.collectionVisibleCount(COLLECTION_EXPANDED_LIMIT),
    );
    expect(document.activeElement).toBe(expandedStatus);
    expect(within(panel()).getAllByRole("button", { name: /好きに追加/u })[8]).not.toBe(
      document.activeElement,
    );
  });

  it("starts desktop preview at twelve works before the one-shot show more", () => {
    const manyWorks = createCollectionWorks("mysteries", 45);
    renderGrid({
      activeId: "mysteries",
      desktop: true,
      panelWorks: manyWorks,
    });

    const panel = screen.getByRole("region", { name: "謎と緊張を楽しむ" });
    expect(within(panel).getAllByRole("button", { name: /好きに追加/u })).toHaveLength(12);
    fireEvent.click(screen.getByRole("button", { name: onboardingStrings.step1.showMore }));
    expect(within(panel).getAllByRole("button", { name: /好きに追加/u })).toHaveLength(40);
    expect(screen.queryByRole("button", { name: onboardingStrings.step1.showMore })).toBeNull();
    const expandedStatus = within(panel).getByRole("status");
    expect(expandedStatus.textContent).toBe(onboardingStrings.step1.collectionVisibleCount(40));
    expect(document.activeElement).toBe(expandedStatus);
  });

  it("exposes a named empty state inside the open panel", () => {
    renderGrid({ activeId: "mysteries", panelWorks: [] });

    const panel = screen.getByRole("region", { name: "謎と緊張を楽しむ" });
    expect(within(panel).getByText(onboardingStrings.step1.collectionEmpty)).toBeTruthy();
    expect(screen.queryByRole("button", { name: onboardingStrings.step1.showMore })).toBeNull();
  });

  it("selects panel works through the existing cover card toggle", () => {
    const { onToggleSelection } = renderGrid({
      activeId: "mysteries",
      panelWorks: createCollectionWorks("mysteries", 2),
    });

    fireEvent.click(screen.getByRole("button", { name: "mysteries作品1 — 好きに追加" }));
    expect(onToggleSelection).toHaveBeenCalledWith("mysteries-1");
  });
});
