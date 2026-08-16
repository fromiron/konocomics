"use client";

import { type ReactNode, useEffect, useState } from "react";

import { catalogV1Schema } from "@/domain/catalog/schema";
import type { CatalogV1 } from "@/domain/catalog/types";
import { catalogAssetUrl } from "@/lib/catalog-asset";
import { catalogStrings } from "@/lib/strings";

import { catalogMatchesIdentity } from "./catalog-identity";
import { CatalogProvider, useCatalogIdentity } from "./catalog-provider";

type CatalogLoadState =
  | Readonly<{ kind: "loading"; requestKey: string }>
  | Readonly<{ kind: "ready"; requestKey: string; catalog: CatalogV1 }>
  | Readonly<{ kind: "error"; requestKey: string }>;

type StaticAssetCatalogProviderProps = Readonly<{
  children: ReactNode;
}>;

export function StaticAssetCatalogProvider({ children }: StaticAssetCatalogProviderProps) {
  const identity = useCatalogIdentity();
  const [attempt, setAttempt] = useState(0);
  const requestKey = `${identity.catalogVersion}\0${identity.workIds.join("\0")}\0${String(attempt)}`;
  const [state, setState] = useState<CatalogLoadState>({
    kind: "loading",
    requestKey,
  });
  const requestCache = attempt === 0 ? "force-cache" : "reload";

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    void fetch(catalogAssetUrl(identity.catalogVersion), {
      cache: requestCache,
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Catalog asset request failed");
        const result = catalogV1Schema.safeParse(await response.json());
        if (!result.success || !catalogMatchesIdentity(result.data, identity)) {
          throw new Error("Catalog asset identity mismatch");
        }
        if (active) setState({ kind: "ready", requestKey, catalog: result.data });
      })
      .catch(() => {
        if (active) setState({ kind: "error", requestKey });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [identity, requestCache, requestKey]);

  if (state.requestKey !== requestKey || state.kind === "loading") {
    return (
      <main
        className="recommendations-page recommendations-page--loading"
        data-catalog-state="loading"
      >
        <p aria-live="polite">{catalogStrings.loading}</p>
      </main>
    );
  }

  if (state.kind === "error") {
    return (
      <main className="catalog-failure" data-catalog-state="error">
        <h1>{catalogStrings.loadError}</h1>
        <button onClick={() => setAttempt((current) => current + 1)} type="button">
          {catalogStrings.retry}
        </button>
      </main>
    );
  }

  return <CatalogProvider catalog={state.catalog}>{children}</CatalogProvider>;
}
