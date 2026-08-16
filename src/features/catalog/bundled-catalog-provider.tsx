"use client";

import type { ReactNode } from "react";

import catalogJson from "@/data/generated/catalog-v1.json";
import { catalogV1Schema } from "@/domain/catalog/schema";

import { catalogMatchesIdentity } from "./catalog-identity";
import { CatalogFailure, CatalogProvider, useCatalogIdentity } from "./catalog-provider";

const catalogResult = catalogV1Schema.safeParse(catalogJson);

type BundledCatalogProviderProps = Readonly<{
  children: ReactNode;
}>;

export function BundledCatalogProvider({ children }: BundledCatalogProviderProps) {
  const identity = useCatalogIdentity();
  if (!catalogResult.success || !catalogMatchesIdentity(catalogResult.data, identity)) {
    return <CatalogFailure />;
  }

  return <CatalogProvider catalog={catalogResult.data}>{children}</CatalogProvider>;
}
