import type { CatalogV1 } from "@/domain/catalog/types";
import type { CurrentCatalogIdentity } from "@/infrastructure/db";

import { catalogMatchesIdentity } from "./catalog-identity";

let catalog: CatalogV1 | null = null;

export function getValidatedSessionCatalog(identity: CurrentCatalogIdentity): CatalogV1 | null {
  return catalog !== null && catalogMatchesIdentity(catalog, identity) ? catalog : null;
}

export function setValidatedSessionCatalog(nextCatalog: CatalogV1): void {
  catalog = nextCatalog;
}

export function clearValidatedSessionCatalog(): void {
  catalog = null;
}
