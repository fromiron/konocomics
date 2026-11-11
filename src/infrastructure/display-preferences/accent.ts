import { useSyncExternalStore } from "react";
import { z } from "zod";

import {
  type AccentThemeId,
  accentThemeAttribute,
  accentThemeIds,
  defaultAccentThemeId,
} from "@/lib/accent-theme";

/**
 * The accent choice is a display preference of this browser (05 §6): one `localStorage` key,
 * outside Dexie and never part of Export/Import. The document carries the applied choice as
 * `<html data-accent>`; the default has no attribute, like the prerendered HTML.
 */
export const accentStorageKey = "konocomics:accent";

const storedAccentSchema = z.enum(accentThemeIds);

/** A stored value as an accent id: a missing or unknown value is the default. */
export function parseStoredAccent(value: unknown): AccentThemeId {
  const parsed = storedAccentSchema.safeParse(value);
  return parsed.success ? parsed.data : defaultAccentThemeId;
}

/** The stored choice, or the default when nothing valid is stored or storage is unavailable. */
export function readAccentPreference(): AccentThemeId {
  try {
    return parseStoredAccent(window.localStorage.getItem(accentStorageKey));
  } catch {
    return defaultAccentThemeId;
  }
}

/**
 * Runs in the document head before first paint, so a reload never flashes the default. It mirrors
 * `parseStoredAccent`: only a known id other than the default sets the attribute. The router runs
 * head scripts again on client navigation; it acts only while the document is first parsed, so
 * from then on the page's own store alone decides the attribute.
 */
export const accentBootScript = `(function(){try{if(document.readyState!=="loading")return;var a=localStorage.getItem(${JSON.stringify(
  accentStorageKey,
)});if(${JSON.stringify(
  accentThemeIds.filter((id) => id !== defaultAccentThemeId),
)}.indexOf(a)>=0)document.documentElement.setAttribute(${JSON.stringify(
  accentThemeAttribute,
)},a)}catch(e){}})()`;

function applyToDocument(id: AccentThemeId) {
  const root = document.documentElement;
  if (id === defaultAccentThemeId) root.removeAttribute(accentThemeAttribute);
  else root.setAttribute(accentThemeAttribute, id);
}

function documentAccent(): AccentThemeId {
  return parseStoredAccent(document.documentElement.getAttribute(accentThemeAttribute));
}

const listeners = new Set<() => void>();
/** Whether this page has settled the document against storage (or made a choice of its own). */
let settled = false;

function notify() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  // The head script applied the stored choice; re-apply it once per page in case anything replaced
  // the document's attributes since (for example a client re-render after a hydration error).
  if (!settled) {
    settled = true;
    const stored = readAccentPreference();
    if (stored !== documentAccent()) applyToDocument(stored);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function serverAccent(): AccentThemeId {
  return defaultAccentThemeId;
}

/**
 * Applies a choice at once and stores it. A storage failure (private mode, quota, blocked site
 * data) still leaves the choice applied for this page.
 */
export function setAccentPreference(id: AccentThemeId) {
  settled = true;
  applyToDocument(id);
  try {
    window.localStorage.setItem(accentStorageKey, id);
  } catch {
    /* Display preference only: the page keeps the applied choice. */
  }
  notify();
}

/** Forgets the stored choice and returns the document to the default (settings 「すべて削除」). */
export function clearAccentPreference() {
  settled = true;
  try {
    window.localStorage.removeItem(accentStorageKey);
  } catch {
    /* Nothing stored that this page can reach. */
  }
  applyToDocument(defaultAccentThemeId);
  notify();
}

/** The applied accent. Server and hydration render the default, then the document's choice. */
export function useAccentPreference(): AccentThemeId {
  return useSyncExternalStore(subscribe, documentAccent, serverAccent);
}
