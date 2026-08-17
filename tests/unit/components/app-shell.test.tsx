// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import type * as ReactDomModule from "react-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { UserWorkRecord } from "@/domain/profile/types";
import { AppShell } from "@/components/nav/app-shell";
import { catalogIdentityFromCatalog } from "@/features/catalog/catalog-identity";
import { CatalogIdentityProvider } from "@/features/catalog/catalog-provider";
import { catalogStrings, navigationStrings } from "@/lib/strings";
import { createTestCatalog, createTestWork } from "../../helpers/catalog";

const testState = vi.hoisted(() => ({
  pathname: "/recommendations",
  navigate: vi.fn(),
  preload: vi.fn(),
  userWorks: undefined as readonly UserWorkRecord[] | undefined,
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, className, to }: { children: ReactNode; className?: string; to: string }) => (
    <a className={className} href={to}>
      {children}
    </a>
  ),
  useNavigate: () => testState.navigate,
  useRouterState: ({
    select,
  }: {
    select: (state: { location: { pathname: string } }) => unknown;
  }) => select({ location: { pathname: testState.pathname } }),
}));

vi.mock("@/infrastructure/db", () => ({
  usePersistence: () => ({ userWorks: testState.userWorks }),
}));

vi.mock("react-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof ReactDomModule>();
  return { ...actual, preload: testState.preload };
});

const works = Array.from({ length: 5 }, (_, index) =>
  createTestWork({ id: `shell-work-${String(index + 1)}` }),
);
const isbns = [
  "9784091855312",
  "9784091380135",
  "9784047260764",
  "9784065114698",
  "9784065180624",
] as const;
const catalog = {
  ...createTestCatalog(works[0]),
  works,
  volumes: works.map((work, index) => {
    const isbn = isbns[index];
    if (isbn === undefined) throw new Error("Missing AppShell test ISBN");
    return {
      id: `${work.id}-v1`,
      workId: work.id,
      volumeNumber: 1,
      isbn,
      releaseDate: "2020-01-01",
      editionKind: "standard" as const,
    };
  }),
  representativeVolumeByWorkId: Object.fromEntries(works.map((work) => [work.id, `${work.id}-v1`])),
};
const identity = catalogIdentityFromCatalog(catalog);
const profile = works.map((work): UserWorkRecord => ({
  workId: work.id,
  readingState: "completed",
  reaction: "liked",
  updatedAt: "2026-08-15T00:00:00.000Z",
}));

function responseWith(value: unknown, ok = true): Response {
  return new Response(JSON.stringify(value), {
    status: ok ? 200 : 503,
    headers: { "Content-Type": "application/json" },
  });
}

function renderShell() {
  return render(
    <CatalogIdentityProvider identity={identity}>
      <AppShell>
        <p>recommendations-flow</p>
      </AppShell>
    </CatalogIdentityProvider>,
  );
}

function expectFatalOnlyDom() {
  expect(screen.queryByText(navigationStrings.skipLink)).toBeNull();
  expect(
    screen.queryByText(
      navigationStrings.routeAnnouncement(navigationStrings.items.recommendations),
    ),
  ).toBeNull();
  expect(screen.queryByRole("navigation", { name: navigationStrings.desktopLabel })).toBeNull();
  expect(screen.queryByRole("navigation", { name: navigationStrings.mobileLabel })).toBeNull();
  expect(screen.queryByText("recommendations-flow")).toBeNull();
}

beforeEach(() => {
  testState.pathname = "/recommendations";
  testState.navigate.mockReset();
  testState.preload.mockReset();
  testState.userWorks = undefined;
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("AppShell recommendation Catalog boundary", () => {
  it("redirects first-run state without rendering the protected shell", async () => {
    testState.userWorks = [];

    renderShell();

    expect(screen.getByText(navigationStrings.profileLoading)).toBeTruthy();
    expectFatalOnlyDom();
    await waitFor(() =>
      expect(testState.navigate).toHaveBeenCalledWith({ to: "/onboarding", replace: true }),
    );
  });

  it("hides the complete shell on load/failure and restores it only after a successful retry", async () => {
    testState.userWorks = profile;
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(responseWith({}, false))
      .mockResolvedValueOnce(responseWith(catalog));

    renderShell();

    expect(await screen.findByText(catalogStrings.loading)).toBeTruthy();
    expectFatalOnlyDom();
    expect(await screen.findByRole("heading", { name: catalogStrings.loadError })).toBeTruthy();
    expectFatalOnlyDom();

    fireEvent.click(screen.getByRole("button", { name: catalogStrings.retry }));
    expect(screen.getByText(catalogStrings.loading)).toBeTruthy();
    expectFatalOnlyDom();

    expect(await screen.findByText("recommendations-flow")).toBeTruthy();
    expect(screen.getByText(navigationStrings.skipLink)).toBeTruthy();
    expect(
      screen.getByText(
        navigationStrings.routeAnnouncement(navigationStrings.items.recommendations),
      ),
    ).toBeTruthy();
    expect(screen.getByRole("navigation", { name: navigationStrings.desktopLabel })).toBeTruthy();
    expect(screen.getByRole("navigation", { name: navigationStrings.mobileLabel })).toBeTruthy();
  });
});
