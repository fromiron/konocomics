import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import catalogIdentity from "@/data/generated/catalog-identity-v1.json";
import { BundledCatalogProvider } from "@/features/catalog/bundled-catalog-provider";
import { WorkDetailFlow } from "@/features/work-detail/work-detail-flow";
import { emptySearchSchema } from "@/lib/route-search";
import { workDetailStrings } from "@/lib/strings";

export const Route = createFileRoute("/works/$workId")({
  validateSearch: (search) => emptySearchSchema.parse(search),
  loader: ({ params }) => {
    if (!catalogIdentity.workIds.includes(params.workId)) {
      throw notFound();
    }
    return { workId: params.workId };
  },
  head: () => ({ meta: [{ title: workDetailStrings.metadataTitle }] }),
  notFoundComponent: WorkDetailNotFound,
  component: WorkDetailPage,
});

function WorkDetailNotFound() {
  return (
    <main className="work-detail-not-found mx-auto grid min-h-[calc(100dvh-var(--layout-mobile-navigation-clearance))] w-full max-w-[var(--layout-width-reading)] content-center justify-items-start gap-[var(--space-4)] p-[var(--layout-page-padding)]">
      <h1>{workDetailStrings.notFound.title}</h1>
      <p>{workDetailStrings.notFound.description}</p>
      <Link
        className="interactive-press inline-flex min-h-[var(--control-min-size)] items-center font-bold text-accent underline underline-offset-[var(--space-content-tight)] transition-transform duration-[var(--motion-duration-press)] active:scale-[0.97] motion-reduce:active:scale-100"
        to="/recommendations"
      >
        {workDetailStrings.notFound.recommendations}
      </Link>
    </main>
  );
}

function WorkDetailPage() {
  const { workId } = Route.useLoaderData();

  return (
    <BundledCatalogProvider>
      <WorkDetailFlow workId={workId} />
    </BundledCatalogProvider>
  );
}
