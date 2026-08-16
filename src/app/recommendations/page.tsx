import type { Metadata } from "next";
import { Suspense } from "react";

import { RecommendationsFlow } from "@/features/recommendations/recommendations-flow";
import { recommendationStrings } from "@/lib/strings";

export const metadata: Metadata = {
  title: recommendationStrings.metadataTitle,
};

export default function RecommendationsPage() {
  return (
    <Suspense
      fallback={
        <main className="recommendations-page recommendations-page--loading">
          <p aria-live="polite">{recommendationStrings.loading}</p>
        </main>
      }
    >
      <RecommendationsFlow />
    </Suspense>
  );
}
