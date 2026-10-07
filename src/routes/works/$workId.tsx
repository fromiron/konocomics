import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { BundledCatalogProvider } from "@/features/catalog/bundled-catalog-provider";
import { WorkDetailFlow } from "@/features/work-detail/work-detail-flow";
import { loadWorkDetailMetadata } from "@/features/work-detail/work-metadata";
import { emptySearchSchema } from "@/lib/route-search";
import { workDetailStrings } from "@/lib/strings";
import { siteOrigin } from "@/lib/site-metadata";

export const Route = createFileRoute("/works/$workId")({
  validateSearch: (search) => emptySearchSchema.parse(search),
  loader: async ({ params }) => {
    const metadata = await loadWorkDetailMetadata(params.workId);
    if (metadata === null) {
      throw notFound();
    }
    return { workId: params.workId, metadata };
  },
  head: ({ loaderData }) => {
    const metadata = loaderData?.metadata;
    if (loaderData === undefined || metadata === null || metadata === undefined) {
      return { meta: [{ title: workDetailStrings.metadataTitle }] };
    }
    const canonicalUrl = new URL("/works/" + encodeURIComponent(loaderData.workId), siteOrigin)
      .href;
    return {
      links: [{ rel: "canonical", href: canonicalUrl }],
      meta: [
        { property: "og:url", content: canonicalUrl },
        { title: metadata.title },
        { name: "robots", content: "index,follow" },
        { name: "description", content: metadata.description },
        { property: "og:title", content: metadata.title },
        { property: "og:description", content: metadata.description },
        { name: "twitter:title", content: metadata.title },
        { name: "twitter:description", content: metadata.description },
      ],
    };
  },
  notFoundComponent: WorkDetailNotFound,
  component: WorkDetailPage,
});

function WorkDetailNotFound() {
  return (
    <main className="work-detail-not-found mx-auto grid min-h-[calc(100dvh-var(--layout-mobile-navigation-clearance))] w-full max-w-[var(--layout-width-reading)] content-center justify-items-start gap-[var(--space-4)] p-[var(--layout-page-padding)]">
      <h1>{workDetailStrings.notFound.title}</h1>
      <p>{workDetailStrings.notFound.description}</p>
      <Link
        className="interactive-press inline-flex min-h-[var(--control-min-size)] items-center font-bold text-accent-ink underline underline-offset-[var(--space-content-tight)] transition-transform duration-[var(--motion-duration-press)] active:scale-[0.97] motion-reduce:active:scale-100"
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
