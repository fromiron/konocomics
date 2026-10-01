import { workDetailStrings } from "@/lib/strings";

export type WorkDetailMetadata = Readonly<{ title: string; description: string }>;

/**
 * Per-work document metadata for `/works/$workId`. The full Catalog is loaded lazily so the
 * route's critical chunk stays on the small identity projection; the chunk is the same one
 * BundledCatalogProvider already needs to render the page.
 */
export async function loadWorkDetailMetadata(workId: string): Promise<WorkDetailMetadata | null> {
  const { default: catalog } = await import("@/data/generated/catalog-v1.json");
  const work = catalog.works.find((candidate) => candidate.id === workId);
  if (work === undefined) return null;
  return {
    title: workDetailStrings.workMetadataTitle(work.title),
    description: workDetailStrings.workMetadataDescription(
      work.title,
      work.creators,
      work.publisher,
    ),
  };
}
