import type { UserWorkRecord } from "./types";

type CatalogWorkIdentity = Readonly<{
  id: string;
  eligibility: Readonly<{ recommendationEligible: boolean }>;
}>;

export function recommendationProfileRecords(
  records: readonly UserWorkRecord[],
  catalogWorks: readonly CatalogWorkIdentity[],
) {
  const eligibleWorkIds = new Set(
    catalogWorks.filter((work) => work.eligibility.recommendationEligible).map((work) => work.id),
  );
  return records.filter((record) => eligibleWorkIds.has(record.workId));
}

export function hasCatalogBackedProfile(
  records: readonly UserWorkRecord[] | undefined,
  catalogWorks: readonly CatalogWorkIdentity[],
): boolean | undefined {
  return hasCatalogBackedProfileById(
    records,
    catalogWorks.filter((work) => work.eligibility.recommendationEligible).map((work) => work.id),
  );
}

export function hasCatalogBackedProfileById(
  records: readonly UserWorkRecord[] | undefined,
  catalogWorkIds: readonly string[],
): boolean | undefined {
  if (records === undefined) {
    return undefined;
  }

  const currentWorkIds = new Set(catalogWorkIds);
  const positiveWorkIds = new Set<string>();
  for (const record of records) {
    if (
      currentWorkIds.has(record.workId) &&
      (record.reaction === "favorite" || record.reaction === "liked")
    ) {
      positiveWorkIds.add(record.workId);
      if (positiveWorkIds.size >= 5) {
        return true;
      }
    }
  }

  return false;
}
