"use client";

import { type ReactNode, useEffect, useState } from "react";

import { Button } from "@/components/design-system/button";
import recommendationContextAssetUrl from "@/data/generated/recommendation-context-v1.json?url";
import { catalogV1Schema } from "@/domain/catalog/schema";
import type { CatalogV1 } from "@/domain/catalog/types";
import { recommendationContextSchema } from "@/domain/recommendation/context-schema";
import type { RecommendationContext } from "@/domain/recommendation/types";
import { catalogAssetUrl } from "@/lib/catalog-asset";
import { catalogStrings } from "@/lib/strings";

import { catalogMatchesIdentity } from "./catalog-identity";
import { CatalogProvider, useCatalogIdentity } from "./catalog-provider";
import { getValidatedSessionCatalog, setValidatedSessionCatalog } from "./validated-catalog-cache";

type CatalogLoadState =
  | Readonly<{ kind: "loading"; requestKey: string }>
  | Readonly<{
      kind: "ready";
      requestKey: string;
      catalog: CatalogV1;
      context: RecommendationContext;
    }>
  | Readonly<{ kind: "error"; requestKey: string }>;

type StaticAssetCatalogProviderProps = Readonly<{
  children: (context: RecommendationContext) => ReactNode;
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
    const cachedCatalog =
      requestCache === "force-cache" ? getValidatedSessionCatalog(identity) : null;
    const catalogRequest =
      cachedCatalog === null
        ? fetch(catalogAssetUrl(identity.catalogVersion), {
            cache: requestCache,
            signal: controller.signal,
          }).then(async (response) => {
            if (!response.ok) throw new Error("Recommendation Catalog request failed");
            const result = catalogV1Schema.safeParse(await response.json());
            if (!result.success || !catalogMatchesIdentity(result.data, identity)) {
              throw new Error("Catalog asset identity mismatch");
            }
            return result.data;
          })
        : Promise.resolve(cachedCatalog);

    void Promise.all([
      catalogRequest,
      fetch(recommendationContextAssetUrl, {
        cache: requestCache,
        signal: controller.signal,
      }),
    ])
      .then(async ([catalog, contextResponse]) => {
        if (!contextResponse.ok) throw new Error("Recommendation context request failed");
        const contextResult = recommendationContextSchema.safeParse(await contextResponse.json());
        if (
          !contextResult.success ||
          contextResult.data.marketSnapshot.catalogVersion !== identity.catalogVersion
        ) {
          throw new Error("Catalog asset identity mismatch");
        }
        if (active) {
          setValidatedSessionCatalog(catalog);
          setState({
            kind: "ready",
            requestKey,
            catalog,
            context: contextResult.data,
          });
        }
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
        className="recommendations-page recommendations-page--loading mx-auto grid min-h-dvh w-full max-w-[var(--layout-width-media)] place-items-center px-[var(--layout-page-padding)] py-[var(--layout-page-block-start)] text-text-muted"
        data-catalog-state="loading"
      >
        <p aria-live="polite">{catalogStrings.loading}</p>
      </main>
    );
  }

  if (state.kind === "error") {
    return (
      <main
        className="catalog-failure grid min-h-dvh place-content-center justify-items-center gap-[var(--space-4)] px-[var(--layout-page-padding)] text-center"
        data-catalog-state="error"
      >
        <h1>{catalogStrings.loadError}</h1>
        <Button
          className="min-w-[120px]"
          onClick={() => setAttempt((current) => current + 1)}
          type="button"
        >
          {catalogStrings.retry}
        </Button>
      </main>
    );
  }

  return <CatalogProvider catalog={state.catalog}>{children(state.context)}</CatalogProvider>;
}
