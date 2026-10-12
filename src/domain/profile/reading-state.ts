import type { ReadingState } from "./types";

/** Preserve reading progress separately from completed records. */
export const READING_STATES = [
  "planned",
  "reading",
  "completed",
  "dropped",
  "hidden",
] as const satisfies readonly ReadingState[];

export const LEGACY_READING_STATES = READING_STATES;

export type LegacyReadingState = (typeof LEGACY_READING_STATES)[number];

export function normalizeReadingState(state: LegacyReadingState): ReadingState {
  return state;
}
