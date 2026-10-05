// @vitest-environment jsdom

import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { CatalogV1 } from "@/domain/catalog/types";
import type { OnboardingDraft } from "@/domain/profile/onboarding";
import type { UserWorkRecord } from "@/domain/profile/types";
import { entrySource } from "@/features/landing/entry-source";
import { LandingFlow } from "@/features/landing/landing-flow";
import type { LandingSample } from "@/features/landing/landing-types";
import { coreStrings, landingStrings } from "@/lib/strings";
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

const works = Array.from({ length: 6 }, (_, index) =>
  createTestWork({ id: `landing-${String(index + 1)}` }),
);
const baseCatalog = createTestCatalog(works[0]);

const toLandingWork = (work: (typeof works)[number]) => ({
  id: work.id,
  title: work.title,
  creators: work.creators,
  genres: work.genres,
  status: work.status,
});

const sample: LandingSample = {
  anchorWorks: works.slice(0, 2).map(toLandingWork),
  recommendation: {
    work: toLandingWork(works[5]!),
    confidenceLevel: "normal",
    contributions: [
      {
        source: "similarity",
        group: "narrative",
        factorId: "mysteryReveal",
        value: 0.4,
        anchorWorkIds: [works[0]!.id],
        explainable: true,
      },
    ],
  },
  axes: [
    { axisId: "mysteryReveal", value: 3.8 },
    { axisId: "darkness", value: 3.4 },
  ],
};

function renderLanding(showIntroduction = false, via?: "share-card") {
  return render(
    <LandingFlow
      discoveryWorks={works.slice(4, 5).map(toLandingWork)}
      editorialRankingWorks={works.slice(0, 4)}
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

    // The example is labelled as one and explains itself only from its contributions, both as
    // the hero page's last panel and as the story's third scene.
    const examples = screen
      .getAllByText(landingStrings.sample.caption([works[0]!.title, works[1]!.title]))
      .map((caption) => caption.closest("figure"));
    expect(examples).toHaveLength(2);
    for (const example of examples) {
      expect(example).toBeTruthy();
      if (example === null) return;
      expect(
        within(example).getByRole("link", { name: landingStrings.sample.detail(works[5]!.title) }),
      ).toBeTruthy();
      expect(
        within(example).getAllByText(works[0]!.title, { selector: "strong" }),
      ).not.toHaveLength(0);
      expect(within(example).queryByText(/位/u)).toBeNull();
    }
    expect(
      screen.getAllByRole("meter").map((meter) => meter.getAttribute("aria-valuenow")),
    ).toEqual(["3.8", "3.4"]);
    const editorialRanking = screen.getByRole("list", { name: landingStrings.ranking.title });
    expect(within(editorialRanking).getAllByRole("link", { name: /^おすすめ\d+位/u })).toHaveLength(
      4,
    );
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
