// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/data/generated/catalog-v1.json", () => ({ default: {} }));

import { BundledCatalogProvider } from "@/features/catalog/bundled-catalog-provider";
import { CatalogIdentityProvider, useCatalogIdentity } from "@/features/catalog/catalog-provider";

afterEach(cleanup);

describe("CatalogProvider", () => {
  it("exposes only the supplied current Catalog identity", () => {
    const identity = { catalogVersion: "v1-test", workIds: ["work-one", "work-two"] } as const;

    function IdentityProbe() {
      const current = useCatalogIdentity();
      return <p>{`${current.catalogVersion}:${current.workIds.join(",")}`}</p>;
    }

    render(
      <CatalogIdentityProvider identity={identity}>
        <IdentityProbe />
      </CatalogIdentityProvider>,
    );

    expect(screen.getByText("v1-test:work-one,work-two")).toBeTruthy();
  });

  it("renders only the fatal error when catalog loading fails", () => {
    render(
      <CatalogIdentityProvider identity={{ catalogVersion: "v1-test", workIds: [] }}>
        <BundledCatalogProvider>
          <p>rest of app</p>
        </BundledCatalogProvider>
      </CatalogIdentityProvider>,
    );

    expect(screen.getByRole("heading", { name: "カタログを読み込めませんでした" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "再試行" })).toBeTruthy();
    expect(screen.queryByText("rest of app")).toBeNull();
  });
});
