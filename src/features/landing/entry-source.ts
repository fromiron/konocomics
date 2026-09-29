import type { EntrySource } from "@/lib/route-search";

/**
 * The entry path of this tab's app run, kept in memory only. A reload re-reads the path from the
 * landing URL; anywhere else it is unknown (`undefined`). Nothing is persisted or exported.
 */
let currentEntrySource: EntrySource | undefined;

export function recordEntrySource(source: EntrySource) {
  currentEntrySource = source;
  if (typeof document !== "undefined") document.documentElement.dataset.entrySource = source;
}

export function entrySource(): EntrySource | undefined {
  return currentEntrySource;
}

/** The fixed public link a Manga DNA card points to. */
export function shareEntryUrl(origin: string) {
  const url = new URL("/", origin);
  url.searchParams.set("landing", "1");
  url.searchParams.set("via", "share-card");
  return url.toString();
}
