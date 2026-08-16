import type { Metadata } from "next";

import { BundledCatalogProvider } from "@/features/catalog/bundled-catalog-provider";
import { LibraryFlow } from "@/features/library/library-flow";
import { libraryStrings } from "@/lib/strings";

export const metadata: Metadata = {
  title: libraryStrings.metadataTitle,
};

export default function LibraryPage() {
  return (
    <BundledCatalogProvider>
      <LibraryFlow />
    </BundledCatalogProvider>
  );
}
