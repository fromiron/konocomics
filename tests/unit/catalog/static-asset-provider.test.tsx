// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createTestCatalog, createTestWork } from "../../helpers/catalog";
import { catalogIdentityFromCatalog } from "@/features/catalog/catalog-identity";
import { CatalogIdentityProvider, useCatalog } from "@/features/catalog/catalog-provider";
import { StaticAssetCatalogProvider } from "@/features/catalog/static-asset-catalog-provider";
import { catalogAssetUrl } from "@/lib/catalog-asset";
import { catalogStrings } from "@/lib/strings";

const catalog = createTestCatalog();
const identity = catalogIdentityFromCatalog(catalog);

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
        <CatalogProbe />
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
    fetchMock.mockResolvedValue(responseWith(catalog));

    render(<CatalogBoundary />);

    expect(screen.getByText(catalogStrings.loading)).toBeTruthy();
    expect(await screen.findByText("v1-test:test-work")).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledWith(catalogAssetUrl(identity.catalogVersion), {
      cache: "force-cache",
      signal: expect.any(AbortSignal),
    });
  });

  it("shows a truthful error and retries the same asset without reloading the page", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(responseWith({}, false))
      .mockResolvedValueOnce(responseWith(catalog));

    render(<CatalogBoundary />);

    expect(await screen.findByRole("heading", { name: catalogStrings.loadError })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: catalogStrings.retry }));
    expect(screen.getByText(catalogStrings.loading)).toBeTruthy();
    expect(await screen.findByText("v1-test:test-work")).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(1, catalogAssetUrl(identity.catalogVersion), {
      cache: "force-cache",
      signal: expect.any(AbortSignal),
    });
    expect(fetchMock).toHaveBeenNthCalledWith(2, catalogAssetUrl(identity.catalogVersion), {
      cache: "reload",
      signal: expect.any(AbortSignal),
    });
  });

  it("rejects a schema-valid asset whose version does not match the root identity", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(
      responseWith({
        ...catalog,
        catalogVersion: "v1-other",
      }),
    );

    render(<CatalogBoundary />);

    expect(await screen.findByRole("heading", { name: catalogStrings.loadError })).toBeTruthy();
    expect(screen.queryByText("v1-other:test-work")).toBeNull();
  });

  it("rejects an asset whose recommendation-profile identity does not match", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(responseWith(catalog));

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
    fetchMock.mockResolvedValue(response);

    render(<CatalogBoundary />);

    expect(await screen.findByRole("heading", { name: catalogStrings.loadError })).toBeTruthy();
    expect(screen.queryByText(/v1-test:/u)).toBeNull();
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
    fetchMock
      .mockImplementationOnce((_input, init) => {
        firstSignal = init?.signal ?? undefined;
        return firstResponse;
      })
      .mockResolvedValueOnce(responseWith(nextCatalog));

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
