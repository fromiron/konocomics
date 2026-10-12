"use client";

import {
  type ChangeEvent,
  type CompositionEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { WORK_QUERY_MAX_LENGTH } from "@/lib/search-query";

export const URL_QUERY_MAX_LENGTH = WORK_QUERY_MAX_LENGTH;

function comparable(value: string | undefined) {
  return (value ?? "").trim();
}

/**
 * Keeps a text input's value local while mirroring it into a URL search param.
 *
 * Binding an input directly to router search state rolls the DOM value back
 * for a frame on every keystroke (router updates are asynchronous), which
 * breaks Japanese IME composition, and schema trimming deletes a trailing
 * space as soon as it is typed. The draft stays authoritative for the input;
 * URL writes are skipped while an IME composition is open; and only URL
 * changes this hook did not emit itself (back/forward, a mode switch that
 * clears the query) replace the draft.
 */
export function useUrlSyncedQuery({
  urlQuery,
  onUrlQueryChange,
}: Readonly<{
  urlQuery: string | undefined;
  onUrlQueryChange?: (query: string) => void;
}>) {
  const [draft, setDraft] = useState(urlQuery ?? "");
  const [searchQuery, setSearchQuery] = useState(draft);
  const draftRef = useRef(draft);
  const composingRef = useRef(false);
  const pendingRef = useRef<string[]>([]);

  const updateDraft = useCallback((next: string) => {
    draftRef.current = next;
    setDraft(next);
  }, []);

  useEffect(() => {
    const incoming = comparable(urlQuery);
    const pending = pendingRef.current;
    const echoIndex = pending.indexOf(incoming);
    if (echoIndex !== -1) {
      pendingRef.current = pending.slice(echoIndex + 1);
      return;
    }
    pendingRef.current = [];
    if (incoming !== comparable(draftRef.current)) {
      updateDraft(urlQuery ?? "");
      setSearchQuery(urlQuery ?? "");
    }
  }, [updateDraft, urlQuery]);

  const emit = useCallback(
    (value: string) => {
      if (onUrlQueryChange === undefined || value.length > URL_QUERY_MAX_LENGTH) return;
      const emitted = comparable(value);
      const pending = pendingRef.current;
      if (pending.at(-1) !== emitted) pendingRef.current = [...pending, emitted];
      onUrlQueryChange(value);
    },
    [onUrlQueryChange],
  );

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const next = event.currentTarget.value;
      updateDraft(next);
      const nativeEvent = event.nativeEvent;
      const composing =
        composingRef.current || (nativeEvent instanceof InputEvent && nativeEvent.isComposing);
      if (!composing) {
        setSearchQuery(next);
        emit(next);
      }
    },
    [emit, updateDraft],
  );

  const onCompositionStart = useCallback(() => {
    composingRef.current = true;
  }, []);

  const onCompositionEnd = useCallback(
    (event: CompositionEvent<HTMLInputElement>) => {
      composingRef.current = false;
      const next = event.currentTarget.value;
      updateDraft(next);
      setSearchQuery(next);
      emit(next);
    },
    [emit, updateDraft],
  );

  const clear = useCallback(() => {
    updateDraft("");
    setSearchQuery("");
    emit("");
  }, [emit, updateDraft]);

  return {
    value: draft,
    searchQuery,
    clear,
    inputProps: {
      maxLength: URL_QUERY_MAX_LENGTH,
      onChange,
      onCompositionEnd,
      onCompositionStart,
      value: draft,
    },
  } as const;
}
