"use client";

import { useSyncExternalStore } from "react";

import type { RecommendationMood } from "@/domain/recommendation/mood";

/**
 * The route owns the mood URL; this memory store keeps today's per-mood set-asides.
 * The optional local mood also supports standalone consumers. Reload, Import, full deletion
 * and Catalog changes clear the set-asides. Nothing is written to IndexedDB or Export.
 */
export type MoodSessionState = Readonly<{
  mood: RecommendationMood | null;
  dismissedByMood: Readonly<Partial<Record<RecommendationMood, readonly string[]>>>;
  catalogVersion: string | null;
}>;

const EMPTY_STATE: MoodSessionState = { mood: null, dismissedByMood: {}, catalogVersion: null };

let state: MoodSessionState = EMPTY_STATE;
const listeners = new Set<() => void>();

function commit(next: MoodSessionState) {
  state = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function snapshot() {
  return state;
}

function serverSnapshot() {
  return EMPTY_STATE;
}

export function resetMoodSession() {
  if (state !== EMPTY_STATE) commit(EMPTY_STATE);
}

export function selectMood(mood: RecommendationMood | null, catalogVersion: string) {
  const scoped = state.catalogVersion === catalogVersion ? state : EMPTY_STATE;
  commit({ ...scoped, mood, catalogVersion });
}

export function dismissForMood(mood: RecommendationMood, workId: string, catalogVersion: string) {
  const scoped = state.catalogVersion === catalogVersion ? state : EMPTY_STATE;
  const current = scoped.dismissedByMood[mood] ?? [];
  if (current.includes(workId)) return;
  commit({
    ...scoped,
    catalogVersion,
    dismissedByMood: { ...scoped.dismissedByMood, [mood]: [...current, workId] },
  });
}

/** The session as seen by the given Catalog; another Catalog's session reads as empty. */
export function useMoodSession(catalogVersion: string): MoodSessionState {
  const current = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return current.catalogVersion === catalogVersion ? current : EMPTY_STATE;
}
