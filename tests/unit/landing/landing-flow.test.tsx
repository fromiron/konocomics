// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { CatalogV1 } from "@/domain/catalog/types";
import { generateTasteExplanation } from "@/domain/explanation";
import type { ExplanationFactorId } from "@/domain/explanation/types";
import type { OnboardingDraft } from "@/domain/profile/onboarding";
import type { UserWorkRecord } from "@/domain/profile/types";
import { entrySource } from "@/features/landing/entry-source";
import { LandingFlow } from "@/features/landing/landing-flow";
import type { LandingRecommendation, LandingSample } from "@/features/landing/landing-types";
import {
  coreStrings,
  explanationLexicon,
  landingStrings,
  mediaStrings,
  recommendationStrings,
} from "@/lib/strings";
import { createTestCatalog, createTestWork } from "../../helpers/catalog";

const testState = vi.hoisted(() => ({
  catalog: null as unknown as CatalogV1,
  navigate: vi.fn(),
  userWorks: undefined as UserWorkRecord[] | undefined,
  onboardingDraft: null as OnboardingDraft | null | undefined,
  onboardingCompletedAt: null as string | null | undefined,
}));

vi.mock("@/features/catalog/personal-catalog-provider", async () => {
  const { hasCatalogBackedProfile } = await import("@/domain/profile/catalog-profile");
  return {
    usePersonalProfile: () => ({
      error: false,
      hasProfile: hasCatalogBackedProfile(
        testState.userWorks === undefined ? undefined : [...testState.userWorks],
        testState.catalog.works,
      ),
    }),
  };
});

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    className,
    "aria-label": ariaLabel,
    to,
  }: {
    children: ReactNode;
    className?: string;
    "aria-label"?: string;
    to: string;
  }) => (
    <a aria-label={ariaLabel} className={className} href={to}>
      {children}
    </a>
  ),
  useNavigate: () => testState.navigate,
}));

vi.mock("@/features/catalog/catalog-provider", () => ({
  useCatalogIdentity: () => ({
    catalogVersion: testState.catalog.catalogVersion,
    workIds: testState.catalog.works.map((work) => work.id),
    profileWorkIds: testState.catalog.works
      .filter((work) => work.eligibility.recommendationEligible)
      .map((work) => work.id),
  }),
}));

vi.mock("@/infrastructure/db", () => ({
  usePersistence: () => ({
    onboardingCompletedAt: testState.onboardingCompletedAt,
    onboardingDraft: testState.onboardingDraft,
    userWorks: testState.userWorks,
  }),
}));

const works = Array.from({ length: 13 }, (_, index) => ({
  ...createTestWork({ id: `landing-${String(index + 1)}` }),
  title: `作品${String(index + 1)}`,
}));
const baseCatalog = createTestCatalog(works[0]);

const toLandingWork = (work: (typeof works)[number]) => ({
  id: work.id,
  title: work.title,
  creators: work.creators,
  genres: work.genres,
  status: work.status,
});

/** A recommendation whose one reason is its similarity to `anchor` on `factorId`. */
const recommendation = (
  work: (typeof works)[number],
  anchor: (typeof works)[number],
  factorId: ExplanationFactorId,
  group: "genre" | "narrative" | "tone",
): LandingRecommendation => ({
  work: toLandingWork(work),
  confidenceLevel: "normal",
  contributions: [
    {
      source: "similarity",
      group,
      factorId,
      value: 0.4,
      anchorWorkIds: [anchor.id],
      explainable: true,
    },
  ],
  preferredFactorId: factorId,
});

const anchor = works[0]!;
const sample: LandingSample = {
  anchorWorks: works.slice(0, 2).map(toLandingWork),
  stage: [
    recommendation(works[2]!, anchor, "mysteryReveal", "narrative"),
    recommendation(works[3]!, works[1]!, "horror", "genre"),
    recommendation(works[4]!, anchor, "darkness", "tone"),
  ],
  lens: {
    anchorWorkId: anchor.id,
    items: [
      recommendation(works[5]!, anchor, "mysteryReveal", "narrative"),
      {
        ...recommendation(works[6]!, anchor, "horror", "genre"),
        caption: "出版社による作品紹介です。",
      },
      recommendation(works[7]!, anchor, "darkness", "tone"),
      recommendation(works[8]!, anchor, "mysteryReveal", "narrative"),
    ],
  },
};

/** The lead reason the engine's contributions give, exactly as the recommendations page says it. */
function leadReason({ confidenceLevel, contributions, preferredFactorId }: LandingRecommendation) {
  const titles = new Map(sample.anchorWorks.map((work) => [work.id, work.title] as const));
  return generateTasteExplanation({
    contributions,
    confidenceLevel,
    lexicon: explanationLexicon,
    preferredFactorId,
    resolveTitle: (workId) => titles.get(workId),
  }).positiveReasons[0]?.text;
}

function renderLanding(showIntroduction = false, via?: "share-card") {
  return render(
    <LandingFlow
      editorialRankingWorks={works.slice(9, 13)}
      entrySource={via}
      recommendableWorkCount={2410}
      sample={sample}
      showIntroduction={showIntroduction}
    />,
  );
}

function likedRecords(count: number) {
  return works.slice(0, count).map((work) => ({
    workId: work.id,
    readingState: "completed" as const,
    reaction: "liked" as const,
    updatedAt: "2026-08-14T00:00:00.000Z",
  }));
}

beforeEach(() => {
  window.sessionStorage.clear();
  testState.catalog = { ...baseCatalog, works };
  testState.navigate.mockReset();
  testState.userWorks = undefined;
  testState.onboardingDraft = null;
  testState.onboardingCompletedAt = null;
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("LandingFlow profile routing", () => {
  it("shows only the static wordmark while profile state is unresolved", () => {
    renderLanding();

    expect(screen.getByLabelText(coreStrings.appName)).toBeTruthy();
    expect(screen.queryByRole("heading", { name: landingStrings.tagline })).toBeNull();
    expect(screen.queryByRole("link", { name: landingStrings.cta })).toBeNull();
    expect(testState.navigate).not.toHaveBeenCalled();
  });

  it("redirects a current-catalog five-work profile without flashing introduction content", async () => {
    testState.userWorks = works.slice(0, 5).map((work) => ({
      workId: work.id,
      readingState: "completed" as const,
      reaction: "liked" as const,
      updatedAt: "2026-08-14T00:00:00.000Z",
    }));

    renderLanding();

    expect(screen.getByLabelText(coreStrings.appName)).toBeTruthy();
    expect(screen.queryByRole("heading", { name: landingStrings.tagline })).toBeNull();
    await waitFor(() =>
      expect(testState.navigate).toHaveBeenCalledWith({ to: "/recommendations", replace: true }),
    );
  });

  it("renders the introduction for a first visit", () => {
    testState.userWorks = [];

    renderLanding();

    expect(screen.getByRole("heading", { level: 1, name: landingStrings.tagline })).toBeTruthy();
    // The same single action opens the page and closes it.
    expect(
      screen
        .getAllByRole("link", { name: landingStrings.cta })
        .map((link) => link.getAttribute("href")),
    ).toEqual(["/onboarding", "/onboarding"]);
    expect(
      screen.getByText("登録なし · 2,410作品から提案 · データはこの端末だけに保存"),
    ).toBeTruthy();

    expect(testState.navigate).not.toHaveBeenCalled();
  });

  it("says the selected sample's lead reason in the hero bubble, as content", () => {
    testState.userWorks = [];

    renderLanding();

    const [first] = sample.stage;
    const stage = screen.getByRole("figure", { name: landingStrings.hero.stageLabel });
    const cover = within(stage).getByRole("link");
    expect(cover.getAttribute("aria-label")).toBe(mediaStrings.openDetails(first.work.title));
    // The sentence is the reason the engine's contributions give, not decoration, and it is in
    // the accessibility tree with the scene it belongs to.
    const scene = cover.closest("[data-landing-stage-work-id]");
    const reason = scene?.querySelector("strong")?.closest("p");
    expect(reason?.textContent).toBe(leadReason(first));
    expect(reason?.querySelector("strong")?.textContent).toBe(anchor.title);
    expect(reason?.closest("[aria-hidden='true']")).toBeNull();
    // An example with no rank numbers.
    expect(within(stage).queryByText(/位/u)).toBeNull();
  });

  it("switches the stage's cover, bubble, title and named anchor together", async () => {
    testState.userWorks = [];
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    renderLanding(true);

    const stage = screen.getByRole("figure", { name: landingStrings.hero.stageLabel });
    const options = within(stage).getAllByRole("radio");
    expect(
      within(stage).getByRole("radiogroup", { name: landingStrings.hero.stageSelectorLabel }),
    ).toBeTruthy();
    expect(options.map((option) => option.getAttribute("aria-label"))).toEqual(
      sample.stage.map(({ work }) => work.title),
    );

    /** The one scene in the accessibility tree, with the sample works the stage marks. */
    const shown = () => {
      const [cover, ...others] = within(stage).getAllByRole("link");
      expect(others).toHaveLength(0);
      const scene = cover?.closest<HTMLElement>("[data-landing-stage-work-id]");
      if (scene === null || scene === undefined) throw new Error("The stage shows no scene");
      return {
        cover: cover?.getAttribute("aria-label"),
        reason: scene.querySelector("strong")?.closest("p")?.textContent,
        title: within(scene).getByText(/^作品\d+$/u, { selector: "p" }).textContent,
        named: [...stage.querySelectorAll("[data-named]")].map((anchorItem) =>
          anchorItem.getAttribute("data-landing-anchor-work-id"),
        ),
        checked: options.find((option) => option.getAttribute("aria-checked") === "true"),
      };
    };
    const expected = (index: number) => {
      const entry = sample.stage[index]!;
      return {
        cover: mediaStrings.openDetails(entry.work.title),
        reason: leadReason(entry),
        title: entry.work.title,
        named: [entry.contributions[0]!.anchorWorkIds[0]],
        checked: options[index],
      };
    };

    // Only the sample work the lead reason names is marked.
    expect(shown()).toEqual(expected(0));
    expect(stage.querySelectorAll("[data-muted]")).toHaveLength(sample.anchorWorks.length - 1);

    fireEvent.click(options[1]!);
    expect(shown()).toEqual(expected(1));
    expect(shown().named).toEqual([works[1]!.id]);

    // Arrow keys move the selection, as in any radio group.
    act(() => options[1]!.focus());
    fireEvent.keyDown(options[1]!, { key: "ArrowRight" });
    await waitFor(() => expect(shown()).toEqual(expected(2)));
    expect(document.activeElement).toBe(options[2]);
    fireEvent.keyDown(options[2]!, { key: "ArrowLeft" });
    await waitFor(() => expect(shown()).toEqual(expected(1)));

    // The selection is local: no URL, no storage.
    expect(testState.navigate).not.toHaveBeenCalled();
    expect(setItem).not.toHaveBeenCalled();
  });

  it("shows the hero, then the lens shelf, the Top 10 and the closing action", () => {
    testState.userWorks = [];

    renderLanding();

    const lensTitle = recommendationStrings.lensShelves.anchor.title(anchor.title);
    // Page headings in document order (card titles inside the shelves are h3).
    const [title, ...sections] = screen
      .getAllByRole("heading")
      .filter((heading) => heading.tagName === "H1" || heading.tagName === "H2");
    expect(title).toBe(screen.getByRole("heading", { level: 1, name: landingStrings.tagline }));
    expect(sections.map((heading) => [heading.tagName, heading.textContent])).toEqual([
      ["H2", lensTitle],
      ["H2", landingStrings.ranking.title],
      ["H2", landingStrings.closing.title],
    ]);
    // The evidence stage is in the hero, and its works are not shown again below it.
    const stage = screen.getByRole("figure", { name: landingStrings.hero.stageLabel });
    expect(stage.closest("section")?.querySelector("h1")).toBe(title);
    const stageWorkIds = sample.stage.map(({ work }) => work.id);
    const shownBelow = [...document.querySelectorAll("[data-landing-sample-work-id]")].map((card) =>
      card.getAttribute("data-landing-sample-work-id"),
    );
    expect(shownBelow.length).toBeGreaterThan(0);
    expect(shownBelow.filter((workId) => stageWorkIds.includes(workId ?? ""))).toEqual([]);

    // Expand cards: the liked work in the shelf title is in every card's lead reason.
    const lens = screen.getByRole("heading", { level: 2, name: lensTitle }).closest("section");
    expect(lens).toBeTruthy();
    if (lens === null) return;
    const lensCards = [...lens.querySelectorAll("article")];
    expect(lensCards).toHaveLength(sample.lens.items.length);
    lensCards.forEach((card, index) => {
      const entry = sample.lens.items[index]!;
      const reason = card.querySelector("[data-expandable-panel] p");
      expect(reason?.textContent).toBe(leadReason(entry));
      expect(reason?.textContent).toContain(anchor.title);
      expect(reason?.querySelector("strong")?.textContent).toBe(anchor.title);
    });
    // A caption only where the bundled data carries one.
    expect(within(lens).getAllByText("出版社による作品紹介です。", { exact: true })).toHaveLength(
      1,
    );

    const editorialRanking = screen.getByRole("list", { name: landingStrings.ranking.title });
    expect(within(editorialRanking).getAllByRole("link", { name: /^おすすめ\d+位/u })).toHaveLength(
      4,
    );
    expect(screen.getAllByText(/個人向けの順位ではありません/u)).toHaveLength(1);

    // The home's one action is the CTA: sample cards only lead to work details.
    const actionNames = screen
      .queryAllByRole("button", { hidden: true })
      .map((button) => button.getAttribute("aria-label") ?? button.textContent);
    for (const action of Object.values(recommendationStrings.actions)) {
      expect(actionNames).not.toContain(action);
    }
    const sampleLinks = [stage, lens].flatMap((shelf) =>
      within(shelf).getAllByRole("link", { hidden: true }),
    );
    expect(sampleLinks.every((link) => link.getAttribute("href") === "/works/$workId")).toBe(true);
  });

  it("opens a lens card's reason in Quick Preview with no reading state and no writes", async () => {
    testState.userWorks = [];
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    // The storage-free entry, so any write would come from Quick Preview itself.
    renderLanding(true);

    const item = sample.lens.items[1]!;
    const opener = screen.getByRole("button", {
      name: recommendationStrings.quickPreview.open(item.work.title),
    });
    fireEvent.click(opener);

    const dialog = await screen.findByRole("dialog", { name: item.work.title });
    expect(within(dialog).getByText(landingStrings.sample.quickPreviewDescription)).toBeTruthy();
    const reason = within(dialog).getByText(anchor.title, { selector: "strong" }).closest("p");
    expect(reason?.textContent).toBe(leadReason(item));
    expect(within(dialog).getByText("出版社による作品紹介です。")).toBeTruthy();
    expect(
      within(dialog)
        .getAllByRole("link")
        .map((link) => link.getAttribute("aria-label")),
    ).toEqual([mediaStrings.openDetails(item.work.title)]);
    const buttonNames = within(dialog)
      .getAllByRole("button")
      .map((button) => button.getAttribute("aria-label") ?? button.textContent);
    for (const action of Object.values(recommendationStrings.actions)) {
      expect(buttonNames).not.toContain(action);
    }
    expect(setItem).not.toHaveBeenCalled();
    expect(testState.navigate).not.toHaveBeenCalled();
  });

  it("uses only the exact landing=1 flag as a write-free redirect bypass", () => {
    testState.userWorks = works.slice(0, 5).map((work) => ({
      workId: work.id,
      readingState: "completed" as const,
      reaction: "liked" as const,
      updatedAt: "2026-08-14T00:00:00.000Z",
    }));
    window.sessionStorage.setItem("logoRevealed", "sentinel");
    const getItem = vi.spyOn(Storage.prototype, "getItem");
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    renderLanding(true);

    expect(
      screen
        .getAllByRole("link", { name: landingStrings.ctaByVisitor.profile })
        .map((link) => link.getAttribute("href")),
    ).toEqual(["/recommendations", "/recommendations"]);
    expect(testState.navigate).not.toHaveBeenCalled();
    expect(getItem).not.toHaveBeenCalled();
    expect(setItem).not.toHaveBeenCalled();
    getItem.mockRestore();
    expect(window.sessionStorage.getItem("logoRevealed")).toBe("sentinel");
  });

  it("resumes an interrupted onboarding draft without changing it", () => {
    testState.userWorks = [];
    testState.onboardingDraft = {
      id: "current",
      mode: "firstRun",
      step: 1,
      positiveEntries: [{ workId: works[0]!.id, reaction: "liked" }],
      negativeEntries: [],
      updatedAt: "2026-08-14T00:00:00.000Z",
    };

    renderLanding(true, "share-card");

    expect(
      screen
        .getAllByRole("link", { name: landingStrings.ctaByVisitor.resume })
        .map((link) => link.getAttribute("href")),
    ).toEqual(["/onboarding", "/onboarding"]);
    expect(screen.getByText(landingStrings.visitorNote.resume)).toBeTruthy();
    expect(testState.navigate).not.toHaveBeenCalled();
  });

  it("keeps the recovery path for a completed profile below five current works", () => {
    testState.userWorks = likedRecords(3);
    testState.onboardingCompletedAt = "2026-08-14T00:00:00.000Z";

    renderLanding(true, "share-card");

    expect(
      screen
        .getAllByRole("link", { name: landingStrings.ctaByVisitor.recovery })
        .map((link) => link.getAttribute("href")),
    ).toEqual(["/onboarding", "/onboarding"]);
  });

  it("marks a share-card entry in memory only and greets a new visitor", () => {
    testState.userWorks = [];
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    renderLanding(true, "share-card");

    expect(screen.getByText(landingStrings.sharedEntry)).toBeTruthy();
    expect(screen.getAllByRole("link", { name: landingStrings.ctaByVisitor.new })).toHaveLength(2);
    expect(entrySource()).toBe("share-card");
    expect(document.documentElement.dataset.entrySource).toBe("share-card");
    expect(setItem).not.toHaveBeenCalled();
  });
});
