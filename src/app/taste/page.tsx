import type { Metadata } from "next";
import { Suspense } from "react";

import { BundledCatalogProvider } from "@/features/catalog/bundled-catalog-provider";
import { TasteFlow } from "@/features/taste/taste-flow";
import { tasteStrings } from "@/lib/strings";

export const metadata: Metadata = {
  title: tasteStrings.metadataTitle,
};

export default function TastePage() {
  return (
    <BundledCatalogProvider>
      <Suspense
        fallback={
          <main className="taste-page taste-page--loading">
            <p aria-live="polite">{tasteStrings.loading}</p>
          </main>
        }
      >
        <TasteFlow />
      </Suspense>
    </BundledCatalogProvider>
  );
}
