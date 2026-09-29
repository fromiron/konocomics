import type { ReadingState } from "./types";

/** The four product reading states: a 「読みたい」 bookmark plus three read outcomes. */
export const READING_STATES = [
  "planned",
  "completed",
  "dropped",
  "hidden",
] as const satisfies readonly ReadingState[];

/**
 * States accepted on input. `reading` came from records, exports and URLs written before
 * the four-state model and always normalizes to `completed`, keeping its progress.
 */
export const LEGACY_READING_STATES = [...READING_STATES, "reading"] as const;

export type LegacyReadingState = (typeof LEGACY_READING_STATES)[number];

export function normalizeReadingState(state: LegacyReadingState): ReadingState {
  return state === "reading" ? "completed" : state;
}
