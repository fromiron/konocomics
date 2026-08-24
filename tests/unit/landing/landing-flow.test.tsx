// @vitest-environment jsdom

import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { CatalogV1 } from "@/domain/catalog/types";
import type { UserWorkRecord } from "@/domain/profile/types";
import { LandingFlow } from "@/features/landing/landing-flow";
import { coreStrings, landingStrings } from "@/lib/strings";
import { createTestCatalog, createTestWork } from "../../helpers/catalog";

const testState = vi.hoisted(() => ({
  catalog: null as unknown as CatalogV1,
  navigate: vi.fn(),
  userWorks: undefined as UserWorkRecord[] | undefined,
}));

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
  usePersistence: () => ({ userWorks: testState.userWorks }),
}));

const works = Array.from({ length: 6 }, (_, index) =>
  createTestWork({ id: `landing-${String(index + 1)}` }),
);
const baseCatalog = createTestCatalog(works[0]);

function renderLanding(showIntroduction = false) {
  return render(
    <LandingFlow
      editorialRankingWorks={works.slice(0, 4)}
      heroWorks={works.slice(0, 4)}
      showIntroduction={showIntroduction}
    />,
  );
}

beforeEach(() => {
  window.sessionStorage.clear();
  testState.catalog = { ...baseCatalog, works };
  testState.navigate.mockReset();
  testState.userWorks = undefined;
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
    expect(screen.getByRole("link", { name: landingStrings.cta }).getAttribute("href")).toBe(
      "/onboarding",
    );
    const editorialRanking = screen.getByRole("list", { name: landingStrings.ranking.title });
    expect(within(editorialRanking).getAllByRole("link", { name: /^おすすめ\d+位/u })).toHaveLength(
      4,
    );
    expect(
      screen.getByRole("link", { name: landingStrings.footer.settings }).getAttribute("href"),
    ).toBe("/settings");
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

    expect(screen.getByRole("link", { name: landingStrings.cta })).toBeTruthy();
    expect(testState.navigate).not.toHaveBeenCalled();
    expect(getItem).not.toHaveBeenCalled();
    expect(setItem).not.toHaveBeenCalled();
    getItem.mockRestore();
    expect(window.sessionStorage.getItem("logoRevealed")).toBe("sentinel");
  });
});
