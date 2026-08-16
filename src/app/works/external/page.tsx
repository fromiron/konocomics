import type { Metadata } from "next";
import { Suspense } from "react";

import { ExternalWorkDetailFlow } from "@/features/work-detail/external-work-detail-flow";
import { externalDetailStrings } from "@/lib/strings";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: externalDetailStrings.metadataTitle,
};

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

export default function ExternalWorkDetailPage() {
  return (
    <Suspense fallback={<ExternalWorkDetailFallback />}>
      <ExternalWorkDetailFlow />
    </Suspense>
  );
}
