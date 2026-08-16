import type { Metadata } from "next";
import { notFound } from "next/navigation";

import catalogJson from "@/data/generated/catalog-v1.json";
import { BundledCatalogProvider } from "@/features/catalog/bundled-catalog-provider";
import { WorkDetailFlow } from "@/features/work-detail/work-detail-flow";
import { workDetailStrings } from "@/lib/strings";

export const dynamic = "force-static";
export const dynamicParams = false;

export const metadata: Metadata = {
  title: workDetailStrings.metadataTitle,
};

export function generateStaticParams() {
  return catalogJson.works.map((work) => ({ workId: work.id }));
}

export default async function WorkDetailPage({
  params,
}: Readonly<{ params: Promise<{ workId: string }> }>) {
  const { workId } = await params;
  if (!catalogJson.works.some((work) => work.id === workId)) {
    notFound();
  }

  return (
    <BundledCatalogProvider>
      <WorkDetailFlow workId={workId} />
    </BundledCatalogProvider>
  );
}
