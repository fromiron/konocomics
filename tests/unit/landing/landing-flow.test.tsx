// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { CatalogV1 } from "@/domain/catalog/types";
import type { UserWorkRecord } from "@/domain/profile/types";
import { LandingFlow } from "@/features/landing/landing-flow";
import { coreStrings, landingStrings } from "@/lib/strings";
import { createTestCatalog, createTestWork } from "../../helpers/catalog";

const testState = vi.hoisted(() => ({
  catalog: null as unknown as CatalogV1,
  replace: vi.fn(),
  searchParams: new URLSearchParams(),
  userWorks: undefined as UserWorkRecord[] | undefined,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: testState.replace }),
  useSearchParams: () => testState.searchParams,
}));

vi.mock("@/features/catalog/catalog-provider", () => ({
  useCatalogIdentity: () => ({
    catalogVersion: testState.catalog.catalogVersion,
    workIds: testState.catalog.works.map((work) => work.id),
  }),
}));

vi.mock("@/infrastructure/db", () => ({
  usePersistence: () => ({ userWorks: testState.userWorks }),
}));

const works = Array.from({ length: 6 }, (_, index) =>
  createTestWork({ id: `landing-${String(index + 1)}` }),
);
const baseCatalog = createTestCatalog(works[0]);

function renderLanding() {
  return render(<LandingFlow heroWorks={works.slice(0, 4)} />);
}

beforeEach(() => {
  window.sessionStorage.clear();
  testState.catalog = { ...baseCatalog, works };
  testState.replace.mockReset();
  testState.searchParams = new URLSearchParams();
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
    expect(testState.replace).not.toHaveBeenCalled();
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
    await waitFor(() => expect(testState.replace).toHaveBeenCalledWith("/recommendations"));
  });

  it("renders the introduction for a first visit", () => {
    testState.userWorks = [];

    renderLanding();

    expect(screen.getByRole("heading", { level: 1, name: landingStrings.tagline })).toBeTruthy();
    expect(screen.getByRole("link", { name: landingStrings.cta }).getAttribute("href")).toBe(
      "/onboarding",
    );
    expect(
      screen.getByRole("link", { name: landingStrings.footer.settings }).getAttribute("href"),
    ).toBe("/settings");
    expect(testState.replace).not.toHaveBeenCalled();
  });

  it("uses only the exact landing=1 flag as a write-free redirect bypass", () => {
    testState.userWorks = works.slice(0, 5).map((work) => ({
      workId: work.id,
      readingState: "completed" as const,
      reaction: "liked" as const,
      updatedAt: "2026-08-14T00:00:00.000Z",
    }));
    testState.searchParams = new URLSearchParams("landing=1");
    window.sessionStorage.setItem("logoRevealed", "sentinel");
    const getItem = vi.spyOn(Storage.prototype, "getItem");
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    renderLanding();

    expect(screen.getByRole("link", { name: landingStrings.cta })).toBeTruthy();
    expect(testState.replace).not.toHaveBeenCalled();
    expect(getItem).not.toHaveBeenCalled();
    expect(setItem).not.toHaveBeenCalled();
    getItem.mockRestore();
    expect(window.sessionStorage.getItem("logoRevealed")).toBe("sentinel");
  });
});
