// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createTestCatalog, createTestWork } from "../../helpers/catalog";
import recommendationContextJson from "@/data/generated/recommendation-context-v1.json";
import recommendationContextAssetUrl from "@/data/generated/recommendation-context-v1.json?url";
import { catalogIdentityFromCatalog } from "@/features/catalog/catalog-identity";
import { CatalogIdentityProvider, useCatalog } from "@/features/catalog/catalog-provider";
import { StaticAssetCatalogProvider } from "@/features/catalog/static-asset-catalog-provider";
import { catalogAssetUrl } from "@/lib/catalog-asset";
import { catalogStrings } from "@/lib/strings";

const catalog = createTestCatalog();
const identity = catalogIdentityFromCatalog(catalog);

function recommendationContextFor(catalogVersion = identity.catalogVersion) {
  return {
    ...recommendationContextJson,
    marketSnapshot: { ...recommendationContextJson.marketSnapshot, catalogVersion },
  };
}

function responseWith(value: unknown, ok = true): Response {
  return new Response(JSON.stringify(value), {
    status: ok ? 200 : 503,
    headers: { "Content-Type": "application/json" },
  });
}

function CatalogProbe() {
  const current = useCatalog();
  return <p>{`${current.catalogVersion}:${current.works.map((work) => work.id).join(",")}`}</p>;
}

function CatalogBoundary({
  currentIdentity = identity,
}: Readonly<{ currentIdentity?: typeof identity }>) {
  return (
    <CatalogIdentityProvider identity={currentIdentity}>
      <StaticAssetCatalogProvider>
        {(context) => (
          <>
            <CatalogProbe />
            <p data-testid="recommendation-context-version">
              {context.marketSnapshot.catalogVersion}
            </p>
          </>
        )}
      </StaticAssetCatalogProvider>
    </CatalogIdentityProvider>
  );
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("StaticAssetCatalogProvider", () => {
  it("loads the exact versioned asset, validates it, and exposes the full Catalog", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockImplementation((input) =>
      Promise.resolve(
        String(input) === recommendationContextAssetUrl
          ? responseWith(recommendationContextFor())
          : responseWith(catalog),
      ),
    );

    render(<CatalogBoundary />);

    expect(screen.getByText(catalogStrings.loading)).toBeTruthy();
    expect(await screen.findByText("v1-test:test-work")).toBeTruthy();
    expect(screen.getByTestId("recommendation-context-version").textContent).toBe("v1-test");
    expect(fetchMock).toHaveBeenCalledWith(catalogAssetUrl(identity.catalogVersion), {
      cache: "force-cache",
      signal: expect.any(AbortSignal),
    });
    expect(fetchMock).toHaveBeenCalledWith(recommendationContextAssetUrl, {
      cache: "force-cache",
      signal: expect.any(AbortSignal),
    });
  });

  it("shows a truthful error and retries the same asset without reloading the page", async () => {
    const fetchMock = vi.mocked(fetch);
    let catalogAttempt = 0;
    fetchMock.mockImplementation((input) => {
      if (String(input) === recommendationContextAssetUrl) {
        return Promise.resolve(responseWith(recommendationContextFor()));
      }
      catalogAttempt += 1;
      return Promise.resolve(
        catalogAttempt === 1 ? responseWith({}, false) : responseWith(catalog),
      );
    });

    render(<CatalogBoundary />);

    expect(await screen.findByRole("heading", { name: catalogStrings.loadError })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: catalogStrings.retry }));
    expect(screen.getByText(catalogStrings.loading)).toBeTruthy();
    expect(await screen.findByText("v1-test:test-work")).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(fetchMock).toHaveBeenNthCalledWith(1, catalogAssetUrl(identity.catalogVersion), {
      cache: "force-cache",
      signal: expect.any(AbortSignal),
    });
    expect(fetchMock).toHaveBeenNthCalledWith(3, catalogAssetUrl(identity.catalogVersion), {
      cache: "reload",
      signal: expect.any(AbortSignal),
    });
  });

  it("rejects a schema-valid asset whose version does not match the root identity", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockImplementation((input) =>
      Promise.resolve(
        String(input) === recommendationContextAssetUrl
          ? responseWith(recommendationContextFor())
          : responseWith({ ...catalog, catalogVersion: "v1-other" }),
      ),
    );

    render(<CatalogBoundary />);

    expect(await screen.findByRole("heading", { name: catalogStrings.loadError })).toBeTruthy();
    expect(screen.queryByText("v1-other:test-work")).toBeNull();
  });

  it("rejects an asset whose recommendation-profile identity does not match", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockImplementation((input) =>
      Promise.resolve(
        String(input) === recommendationContextAssetUrl
          ? responseWith(recommendationContextFor())
          : responseWith(catalog),
      ),
    );

    render(<CatalogBoundary currentIdentity={{ ...identity, profileWorkIds: [] }} />);

    expect(await screen.findByRole("heading", { name: catalogStrings.loadError })).toBeTruthy();
    expect(screen.queryByText("v1-test:test-work")).toBeNull();
  });

  it.each([
    [
      "invalid JSON",
      new Response("{", {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ],
    ["a strict-schema violation", responseWith({ ...catalog, unexpected: true })],
    [
      "a mismatched work id set",
      responseWith(createTestCatalog(createTestWork({ id: "other-work" }))),
    ],
  ])("rejects %s without exposing children", async (_label, response) => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockImplementation((input) =>
      Promise.resolve(
        String(input) === recommendationContextAssetUrl
          ? responseWith(recommendationContextFor())
          : response,
      ),
    );

    render(<CatalogBoundary />);

    expect(await screen.findByRole("heading", { name: catalogStrings.loadError })).toBeTruthy();
    expect(screen.queryByText(/v1-test:/u)).toBeNull();
  });

  it.each([
    ["a strict-schema violation", responseWith({ ...recommendationContextFor(), extra: true })],
    ["a Catalog version mismatch", responseWith(recommendationContextFor("v1-other"))],
  ])("rejects recommendation context with %s", async (_label, response) => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockImplementation((input) =>
      Promise.resolve(
        String(input) === recommendationContextAssetUrl ? response : responseWith(catalog),
      ),
    );

    render(<CatalogBoundary />);

    expect(await screen.findByRole("heading", { name: catalogStrings.loadError })).toBeTruthy();
    expect(screen.queryByText("v1-test:test-work")).toBeNull();
  });

  it("aborts the superseded request and ignores its late completion", async () => {
    const nextCatalog = {
      ...createTestCatalog(createTestWork({ id: "next-work" })),
      catalogVersion: "v1-next",
    };
    const nextIdentity = catalogIdentityFromCatalog(nextCatalog);
    let firstSignal: AbortSignal | undefined;
    let resolveFirst: ((response: Response) => void) | undefined;
    const firstResponse = new Promise<Response>((resolve) => {
      resolveFirst = resolve;
    });
    const fetchMock = vi.mocked(fetch);
    let catalogAttempt = 0;
    let contextAttempt = 0;
    fetchMock.mockImplementation((input, init) => {
      if (String(input) === recommendationContextAssetUrl) {
        contextAttempt += 1;
        return Promise.resolve(
          responseWith(
            recommendationContextFor(
              contextAttempt === 1 ? identity.catalogVersion : nextIdentity.catalogVersion,
            ),
          ),
        );
      }
      catalogAttempt += 1;
      if (catalogAttempt === 1) {
        firstSignal = init?.signal ?? undefined;
        return firstResponse;
      }
      return Promise.resolve(responseWith(nextCatalog));
    });

    const view = render(<CatalogBoundary />);
    view.rerender(<CatalogBoundary currentIdentity={nextIdentity} />);

    await waitFor(() => expect(firstSignal?.aborted).toBe(true));
    expect(await screen.findByText("v1-next:next-work")).toBeTruthy();

    await act(async () => {
      resolveFirst?.(responseWith(catalog));
      await firstResponse;
    });
    expect(screen.getByText("v1-next:next-work")).toBeTruthy();
    expect(screen.queryByText("v1-test:test-work")).toBeNull();
  });
});
