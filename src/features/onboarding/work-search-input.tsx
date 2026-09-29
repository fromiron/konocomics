"use client";

import { useEffect, useId, useMemo } from "react";

import { Input } from "@/components/design-system/input";
import { useUrlSyncedQuery } from "@/components/design-system/use-url-synced-query";
import type { Work } from "@/domain/catalog/types";

import { createWorkSearch } from "./search";

export type WorkSearchState = Readonly<{
  query: string;
  results: readonly Work[];
}>;

type WorkSearchInputProps = Readonly<{
  works: readonly Work[];
  label: string;
  placeholder: string;
  onSearchStateChange: (state: WorkSearchState) => void;
  onQueryChange?: (query: string) => void;
  query?: string;
  debounceMs?: number;
}>;

export function WorkSearchInput({
  works,
  label,
  placeholder,
  onQueryChange,
  onSearchStateChange,
  query: urlQuery,
  debounceMs = 300,
}: WorkSearchInputProps) {
  const inputId = useId();
  const { inputProps, value: query } = useUrlSyncedQuery({
    urlQuery,
    onUrlQueryChange: onQueryChange,
  });
  const search = useMemo(() => createWorkSearch(works), [works]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onSearchStateChange({ query, results: search.search(query) });
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [debounceMs, onSearchStateChange, query, search]);

  return (
    <div className="work-search mb-[var(--space-7)] grid max-w-[var(--layout-width-form)] gap-[var(--space-content)]">
      <label className="work-search__label font-bold text-text-strong" htmlFor={inputId}>
        {label}
      </label>
      <Input
        {...inputProps}
        autoComplete="off"
        className="work-search__input min-h-12 w-full"
        enterKeyHint="search"
        id={inputId}
        placeholder={placeholder}
        type="search"
      />
    </div>
  );
}
