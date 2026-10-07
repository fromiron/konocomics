import { createFileRoute, useElementScrollRestoration, useRouter } from "@tanstack/react-router";
import { Suspense, useCallback, useState } from "react";

import { StaticAssetCatalogProvider } from "@/features/catalog/static-asset-catalog-provider";
import { RecommendationsFlow } from "@/features/recommendations/recommendations-flow";
import { recommendationsSearchSchema } from "@/lib/route-search";
import { recommendationStrings } from "@/lib/strings";

export const Route = createFileRoute("/recommendations")({
  ssr: false,
  validateSearch: (search) => recommendationsSearchSchema.parse(search),
  head: () => ({ meta: [{ title: recommendationStrings.metadataTitle }] }),
  component: RecommendationsPage,
});

function RecommendationsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const isHistoryTraversal = useRouter().options.context?.navigation.isHistoryTraversal ?? false;
  const scrollEntry = useElementScrollRestoration({ getElement: () => window });
  const [initialScroll] = useState(scrollEntry);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  return (
    <div
      style={
        !ready && initialScroll !== undefined
          ? { minHeight: `calc(100dvh + ${String(initialScroll.scrollY)}px)` }
          : undefined
      }
    >
      <Suspense
        fallback={
          <main className="recommendations-page recommendations-page--loading">
            <p aria-live="polite">{recommendationStrings.loading}</p>
          </main>
        }
      >
        <StaticAssetCatalogProvider>
          {(context) => (
            <RecommendationsFlow
              context={context}
              onReady={onReady}
              restoreShelfFromUrl={!isHistoryTraversal}
              genre={search.genre}
              onGenreChange={(genre) => {
                void navigate({
                  resetScroll: false,
                  search: (current) => ({ ...current, genre }),
                });
              }}
              onPreviewClose={() => {
                void navigate({
                  replace: true,
                  resetScroll: false,
                  search: (current) => ({ ...current, preview: undefined }),
                });
              }}
              onPreviewOpen={(preview) => {
                void navigate({
                  resetScroll: false,
                  search: (current) => ({ ...current, preview }),
                });
              }}
              onShelfChange={(shelf) => {
                void navigate({
                  resetScroll: false,
                  search: (current) => ({ ...current, shelf }),
                });
              }}
              previewWorkId={search.preview}
              shelf={search.shelf}
            />
          )}
        </StaticAssetCatalogProvider>
      </Suspense>
    </div>
  );
}
