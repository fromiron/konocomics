"use client";

import { createContext, type ReactNode, useContext } from "react";

import { Button } from "@/components/design-system/button";
import type { CatalogV1 } from "@/domain/catalog/types";
import type { CurrentCatalogIdentity } from "@/infrastructure/db";
import { catalogStrings } from "@/lib/strings";

const CatalogContext = createContext<CatalogV1 | null>(null);
const CatalogIdentityContext = createContext<CurrentCatalogIdentity | null>(null);

type CatalogProviderProps = Readonly<{
  catalog: CatalogV1;
  children: ReactNode;
}>;

type CatalogIdentityProviderProps = Readonly<{
  identity: CurrentCatalogIdentity | null;
  children: ReactNode;
}>;

export function CatalogFailure() {
  return (
    <main
      className="catalog-failure grid min-h-dvh place-content-center justify-items-center gap-[var(--space-4)] px-[var(--layout-page-padding)] text-center"
      data-catalog-state="error"
    >
      <h1>{catalogStrings.loadError}</h1>
      <Button className="min-w-[120px]" onClick={() => window.location.reload()} type="button">
        {catalogStrings.retry}
      </Button>
    </main>
  );
}

export function CatalogIdentityProvider({ identity, children }: CatalogIdentityProviderProps) {
  if (identity === null) return <CatalogFailure />;

  return <CatalogIdentityContext value={identity}>{children}</CatalogIdentityContext>;
}

export function CatalogProvider({ catalog, children }: CatalogProviderProps) {
  return <CatalogContext value={catalog}>{children}</CatalogContext>;
}

export function useCatalogIdentity(): CurrentCatalogIdentity {
  const identity = useContext(CatalogIdentityContext);
  if (identity === null) {
    throw new Error("useCatalogIdentity must be used within CatalogIdentityProvider");
  }
  return identity;
}

export function useCatalog(): CatalogV1 {
  const catalog = useContext(CatalogContext);
  if (catalog === null) {
    throw new Error("useCatalog must be used within CatalogProvider");
  }
  return catalog;
}
