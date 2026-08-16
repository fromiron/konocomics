"use client";

import { useEffect, useId, useMemo, useState } from "react";

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
  debounceMs?: number;
}>;

export function WorkSearchInput({
  works,
  label,
  placeholder,
  onSearchStateChange,
  debounceMs = 300,
}: WorkSearchInputProps) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const search = useMemo(() => createWorkSearch(works), [works]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onSearchStateChange({ query, results: search.search(query) });
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [debounceMs, onSearchStateChange, query, search]);

  return (
    <div className="work-search">
      <label className="work-search__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        autoComplete="off"
        className="work-search__input"
        id={inputId}
        onChange={(event) => setQuery(event.currentTarget.value)}
        placeholder={placeholder}
        type="search"
        value={query}
      />
    </div>
  );
}
