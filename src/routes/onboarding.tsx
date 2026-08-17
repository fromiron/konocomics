import { createFileRoute } from "@tanstack/react-router";

import { BundledCatalogProvider } from "@/features/catalog/bundled-catalog-provider";
import { OnboardingFlow } from "@/features/onboarding/onboarding-flow";
import { onboardingSearchSchema } from "@/lib/route-search";
import { onboardingStrings } from "@/lib/strings";

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  validateSearch: (search) => onboardingSearchSchema.parse(search),
  head: () => ({ meta: [{ title: onboardingStrings.metadataTitle }] }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <BundledCatalogProvider>
      <OnboardingFlow
        genre={search.genre}
        onGenreChange={(genre) => {
          void navigate({ search: { ...search, genre } });
        }}
        onQueryChange={(query) => {
          void navigate({
            replace: true,
            search: { ...search, q: query.trim().length > 0 ? query : undefined },
          });
        }}
        onShelfChange={(shelf) => {
          void navigate({ search: { ...search, shelf } });
        }}
        query={search.q ?? ""}
        shelf={search.shelf}
      />
    </BundledCatalogProvider>
  );
}
