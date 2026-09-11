import { createFileRoute } from "@tanstack/react-router";

import { BundledCatalogProvider } from "@/features/catalog/bundled-catalog-provider";
import { LibraryFlow } from "@/features/library/library-flow";
import { librarySearchSchema } from "@/lib/route-search";
import { libraryStrings } from "@/lib/strings";

export const Route = createFileRoute("/library")({
  ssr: false,
  validateSearch: (search) => librarySearchSchema.parse(search),
  head: () => ({ meta: [{ title: libraryStrings.metadataTitle }] }),
  component: LibraryPage,
});

function LibraryPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <BundledCatalogProvider>
      <LibraryFlow
        activeState={search.state ?? null}
        favoriteOnly={search.favorite === "1"}
        page={search.page ?? 1}
        query={search.q}
        sort={search.sort ?? "updated"}
        view={search.view ?? "grid"}
        onActiveStateChange={(state) => {
          void navigate({
            resetScroll: false,
            search: { ...search, state: state ?? undefined, page: undefined },
          });
        }}
        onFavoriteOnlyChange={(favoriteOnly) => {
          void navigate({
            resetScroll: false,
            search: { ...search, favorite: favoriteOnly ? "1" : undefined, page: undefined },
          });
        }}
        onClearFilters={() => {
          void navigate({
            resetScroll: false,
            search: { ...search, state: undefined, favorite: undefined, page: undefined },
          });
        }}
        onQueryChange={(query) => {
          void navigate({
            replace: true,
            resetScroll: false,
            search: { ...search, q: query.trim() === "" ? undefined : query, page: undefined },
          });
        }}
        onSortChange={(sort) => {
          void navigate({ resetScroll: false, search: { ...search, sort, page: undefined } });
        }}
        onPageChange={(page, replace = false) => {
          void navigate({
            replace,
            resetScroll: false,
            search: { ...search, page: page === 1 ? undefined : page },
          });
        }}
        onViewChange={(view) => {
          void navigate({ resetScroll: false, search: { ...search, view } });
        }}
      />
    </BundledCatalogProvider>
  );
}
