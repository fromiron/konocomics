import type { UserWorkRecord } from "./types";

type CatalogWorkIdentity = Readonly<{ id: string }>;

export function hasCatalogBackedProfile(
  records: readonly UserWorkRecord[] | undefined,
  catalogWorks: readonly CatalogWorkIdentity[],
): boolean | undefined {
  return hasCatalogBackedProfileById(
    records,
    catalogWorks.map((work) => work.id),
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
