import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

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

  return (
    <Suspense
      fallback={
        <main className="recommendations-page recommendations-page--loading">
          <p aria-live="polite">{recommendationStrings.loading}</p>
        </main>
      }
    >
      <StaticAssetCatalogProvider>
        <RecommendationsFlow
          genre={search.genre}
          onGenreChange={(genre) => {
            void navigate({ search: (current) => ({ ...current, genre }) });
          }}
          onPreviewClose={() => {
            void navigate({
              replace: true,
              search: (current) => ({ ...current, preview: undefined }),
            });
          }}
          onPreviewOpen={(preview) => {
            void navigate({ search: (current) => ({ ...current, preview }) });
          }}
          onShelfChange={(shelf) => {
            void navigate({ search: (current) => ({ ...current, shelf }) });
          }}
          previewWorkId={search.preview}
          shelf={search.shelf}
        />
      </StaticAssetCatalogProvider>
    </Suspense>
  );
}
