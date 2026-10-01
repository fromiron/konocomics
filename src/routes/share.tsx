import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { Suspense } from "react";

import { BundledCatalogProvider } from "@/features/catalog/bundled-catalog-provider";
import { DnaSharePage } from "@/features/share/dna-share-page";
import { emptySearchSchema } from "@/lib/route-search";
import { dnaSharePageStrings } from "@/lib/strings";

export const Route = createFileRoute("/share")({
  ssr: false,
  // The share link is read raw by its strict codec; router search parsing would coerce values.
  validateSearch: (search) => emptySearchSchema.parse(search),
  head: () => ({ meta: [{ title: dnaSharePageStrings.metadataTitle }] }),
  component: SharePage,
});

function ShareFallback() {
  return (
    <main
      className="mx-auto grid w-full max-w-[var(--layout-width-library)] px-[var(--layout-page-padding)] pt-[var(--layout-page-block-start)] text-text-muted"
      data-share-state="loading"
    >
      <p aria-live="polite">{dnaSharePageStrings.loading}</p>
    </main>
  );
}

function SharePage() {
  const search = useRouterState({ select: (state) => state.location.searchStr });

  return (
    <BundledCatalogProvider>
      <Suspense fallback={<ShareFallback />}>
        <DnaSharePage search={search} />
      </Suspense>
    </BundledCatalogProvider>
  );
}
