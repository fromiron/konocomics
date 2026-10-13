import type { CatalogV1 } from "./types";

/**
 * The series length the Catalog can vouch for, or 0 when unknown. When the real series length is
 * unknown, authoring records the highest Catalog volume number (at least 1) instead, so a count
 * that does not exceed the Catalog's own volumes says nothing about the series and must not be
 * shown as one (03 §6: an unconfirmed count is never presented as 1 volume). Ranking keeps using
 * the recorded count; this only decides what is displayed as a series fact.
 */
export function confirmedSeriesVolumeCounts(
  catalog: Pick<CatalogV1, "volumes">,
  recordedCountOf: (workId: string) => number | undefined,
  workIds: Iterable<string>,
): Map<string, number> {
  const highestCatalogVolume = new Map<string, number>();
  for (const volume of catalog.volumes) {
    const number = volume.volumeNumber ?? 1;
    highestCatalogVolume.set(
      volume.workId,
      Math.max(number, highestCatalogVolume.get(volume.workId) ?? 1),
    );
  }
  const counts = new Map<string, number>();
  for (const workId of workIds) {
    const recorded = recordedCountOf(workId) ?? 0;
    counts.set(workId, recorded > (highestCatalogVolume.get(workId) ?? 1) ? recorded : 0);
  }
  return counts;
}
