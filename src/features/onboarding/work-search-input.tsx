"use client";

import { useEffect, useId, useMemo, useState } from "react";

import { Input } from "@/components/design-system/input";
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
  query: controlledQuery,
  debounceMs = 300,
}: WorkSearchInputProps) {
  const inputId = useId();
  const [localQuery, setLocalQuery] = useState("");
  const query = controlledQuery ?? localQuery;
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
        autoComplete="off"
        className="work-search__input min-h-12 w-full"
        id={inputId}
        onChange={(event) => {
          const nextQuery = event.currentTarget.value;
          if (controlledQuery === undefined) setLocalQuery(nextQuery);
          onQueryChange?.(nextQuery);
        }}
        placeholder={placeholder}
        type="search"
        value={query}
      />
    </div>
  );
}
