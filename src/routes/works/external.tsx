import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

import { ExternalWorkDetailFlow } from "@/features/work-detail/external-work-detail-flow";
import { externalWorkSearchSchema } from "@/lib/route-search";
import { externalDetailStrings } from "@/lib/strings";

export const Route = createFileRoute("/works/external")({
  ssr: false,
  validateSearch: (search) => externalWorkSearchSchema.parse(search),
  head: () => ({ meta: [{ title: externalDetailStrings.metadataTitle }] }),
  component: ExternalWorkDetailPage,
});

function ExternalWorkDetailFallback() {
  return (
    <main className="work-detail-page" data-external-detail-state="loading">
      <header className="work-detail-header">
        <h1>{externalDetailStrings.title}</h1>
        <p aria-live="polite">{externalDetailStrings.loading}</p>
      </header>
    </main>
  );
}

function ExternalWorkDetailPage() {
  const { workId } = Route.useSearch();

  return (
    <Suspense fallback={<ExternalWorkDetailFallback />}>
      <ExternalWorkDetailFlow workId={workId ?? null} />
    </Suspense>
  );
}
