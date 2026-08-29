import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

import { BundledCatalogProvider } from "@/features/catalog/bundled-catalog-provider";
import { TasteFlow } from "@/features/taste/taste-flow";
import { tasteSearchSchema } from "@/lib/route-search";
import { tasteStrings } from "@/lib/strings";

export const Route = createFileRoute("/taste")({
  ssr: false,
  validateSearch: (search) => tasteSearchSchema.parse(search),
  head: () => ({ meta: [{ title: tasteStrings.metadataTitle }] }),
  component: TastePage,
});

function TastePage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <BundledCatalogProvider>
      <Suspense
        fallback={
          <main className="taste-page taste-page--loading">
            <p aria-live="polite">{tasteStrings.loading}</p>
          </main>
        }
      >
        <TasteFlow
          group={search.group}
          mode={search.mode ?? "summary"}
          onGroupChange={(group) => {
            void navigate({ resetScroll: false, search: { ...search, group } });
          }}
          onModeChange={(mode) => {
            void navigate({ resetScroll: false, search: { ...search, mode } });
          }}
          onRevealConsumed={() => {
            void navigate({
              replace: true,
              resetScroll: false,
              search: { ...search, reveal: undefined },
            });
          }}
          reveal={search.reveal}
        />
      </Suspense>
    </BundledCatalogProvider>
  );
}
