import type { CatalogV1 } from "@/domain/catalog/types";
import type { CurrentCatalogIdentity } from "@/infrastructure/db";

export function catalogIdentityFromCatalog(catalog: CatalogV1): CurrentCatalogIdentity {
  return {
    catalogVersion: catalog.catalogVersion,
    workIds: catalog.works.map((work) => work.id),
    profileWorkIds: catalog.works
      .filter((work) => work.eligibility.recommendationEligible)
      .map((work) => work.id),
  };
}

export function catalogMatchesIdentity(
  catalog: CatalogV1,
  identity: CurrentCatalogIdentity,
): boolean {
  if (
    catalog.catalogVersion !== identity.catalogVersion ||
    catalog.works.length !== identity.workIds.length
  ) {
    return false;
  }

  return (
    catalog.works.every((work, index) => work.id === identity.workIds[index]) &&
    catalog.works
      .filter((work) => work.eligibility.recommendationEligible)
      .every((work, index) => work.id === identity.profileWorkIds[index]) &&
    catalog.works.filter((work) => work.eligibility.recommendationEligible).length ===
      identity.profileWorkIds.length
  );
}
