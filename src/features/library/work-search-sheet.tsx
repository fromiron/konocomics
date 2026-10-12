"use client";

import { BookmarkIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { Button } from "@/components/design-system/button";
import { NativeSelect } from "@/components/design-system/native-select";
import { useUrlSyncedQuery } from "@/components/design-system/use-url-synced-query";
import { Input } from "@/components/design-system/input";
import { GENRE_TAGS } from "@/domain/catalog/constants";
import type { CatalogV1, Work, GenreTag } from "@/domain/catalog/types";
import { searchRakutenBooks, type RakutenBookItem } from "@/infrastructure/rakuten";
import { WORK_QUERY_MAX_LENGTH } from "@/lib/search-query";
import { libraryStrings, searchStrings, onboardingStrings } from "@/lib/strings";

import { catalogWorkForRakutenItem, createLibraryWorkSearch } from "./search";

type ProviderState =
  | Readonly<{ phase: "idle" }>
  | Readonly<{ phase: "loading" }>
  | Readonly<{ phase: "ready"; items: readonly RakutenBookItem[] }>
  | Readonly<{ phase: "error" }>;

export type LibraryAddState = "planned" | "reading" | "completed";

export type LibraryAddOutcome = "added" | "already-exists" | "preserved-unknown";

type WorkSearchSheetProps = Readonly<{
  catalog: CatalogV1;
  catalogCoverUrls?: ReadonlyMap<string, string | null>;
  onCatalogCoverVisible?(workId: string): void;
  onSearchResultsChange?(workIds: readonly string[]): void;
  emptyContent?: ReactNode;
  isCatalogAdded(workId: string): boolean;
  isExternalAdded(item: RakutenBookItem): boolean;
  onAddCatalog(work: Work, state: LibraryAddState): Promise<LibraryAddOutcome>;
  onAddExternal(item: RakutenBookItem, state: LibraryAddState): Promise<LibraryAddOutcome>;
}>;

export function WorkSearchSheet({
  catalog,
  catalogCoverUrls,
  onCatalogCoverVisible,
  onSearchResultsChange,
  emptyContent,
  isCatalogAdded,
  isExternalAdded,
  onAddCatalog,
  onAddExternal,
}: WorkSearchSheetProps) {
  const [genre, setGenre] = useState<GenreTag>();
  const genreWorks = useMemo(
    () =>
      genre === undefined
        ? catalog.works
        : catalog.works.filter((work) => work.genres.includes(genre)),
    [catalog.works, genre],
  );
  const search = useMemo(() => createLibraryWorkSearch(genreWorks), [genreWorks]);
  const { inputProps, searchQuery: query, clear } = useUrlSyncedQuery({ urlQuery: undefined });
  const [readingState, setReadingState] = useState<LibraryAddState>("planned");
  const [online, setOnline] = useState(() => navigator.onLine);
  const [provider, setProvider] = useState<ProviderState>({ phase: "idle" });
  const [busyKey, setBusyKey] = useState<string>();
  const [message, setMessage] = useState<
    Readonly<{ kind: "status" | "error"; text: string }> | undefined
  >();
  const addInFlight = useRef(false);
  const providerInFlight = useRef(false);
  const providerController = useRef<AbortController | undefined>(undefined);
  const providerRequestSequence = useRef(0);
  const localResults = useMemo(
    () =>
      query.trim().length === 0 && genre !== undefined
        ? genreWorks.slice(0, 20)
        : search.search(query),
    [query, search, genre, genreWorks],
  );
  const tooLong = inputProps.value.length > WORK_QUERY_MAX_LENGTH;
  const hasQuery = query.trim().length > 0;

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      providerController.current?.abort();
      providerRequestSequence.current += 1;
    };
  }, []);

  useEffect(() => {
    onSearchResultsChange?.(localResults.map((work) => work.id));
  }, [localResults, onSearchResultsChange]);
  useEffect(() => () => onSearchResultsChange?.([]), [onSearchResultsChange]);

  const runProviderSearch = async () => {
    if (
      !hasQuery ||
      tooLong ||
      inputProps.value !== query ||
      !online ||
      provider.phase === "loading" ||
      providerInFlight.current
    )
      return;
    providerInFlight.current = true;
    const requestSequence = providerRequestSequence.current + 1;
    providerRequestSequence.current = requestSequence;
    setProvider({ phase: "loading" });
    setMessage(undefined);
    try {
      const controller = new AbortController();
      providerController.current = controller;
      const items = await searchRakutenBooks(query, controller.signal);
      if (providerRequestSequence.current === requestSequence) {
        setProvider({ phase: "ready", items });
      }
    } catch {
      if (providerRequestSequence.current === requestSequence) {
        setProvider({ phase: "error" });
      }
    } finally {
      if (providerRequestSequence.current === requestSequence) {
        providerInFlight.current = false;
      }
    }
  };

  const addCatalog = async (work: Work) => {
    if (busyKey !== undefined || addInFlight.current || isCatalogAdded(work.id)) return;
    addInFlight.current = true;
    setBusyKey(`catalog:${work.id}`);
    setMessage(undefined);
    try {
      const result = await onAddCatalog(work, readingState);
      if (result === "preserved-unknown") {
        setMessage({ kind: "error", text: libraryStrings.search.addUnknown });
        return;
      }
      setMessage({
        kind: "status",
        text:
          result === "added"
            ? libraryStrings.search.addedAnnouncement(work.title, readingState)
            : libraryStrings.search.alreadyAddedAnnouncement(work.title),
      });
    } catch {
      setMessage({ kind: "error", text: libraryStrings.search.addError });
    } finally {
      addInFlight.current = false;
      setBusyKey(undefined);
    }
  };

  const addProviderItem = async (item: RakutenBookItem) => {
    const catalogMatch = catalogWorkForRakutenItem(catalog, item);
    const key = `rakuten:${item.isbn}`;
    const alreadyAdded =
      catalogMatch === undefined ? isExternalAdded(item) : isCatalogAdded(catalogMatch.id);
    if (busyKey !== undefined || addInFlight.current || alreadyAdded) return;
    addInFlight.current = true;
    setBusyKey(key);
    setMessage(undefined);
    try {
      const result =
        catalogMatch === undefined
          ? await onAddExternal(item, readingState)
          : await onAddCatalog(catalogMatch, readingState);
      if (result === "preserved-unknown") {
        setMessage({ kind: "error", text: libraryStrings.search.addUnknown });
        return;
      }
      setMessage({
        kind: "status",
        text:
          result === "added"
            ? libraryStrings.search.addedAnnouncement(
                catalogMatch?.title ?? item.title,
                readingState,
              )
            : libraryStrings.search.alreadyAddedAnnouncement(catalogMatch?.title ?? item.title),
      });
    } catch {
      setMessage({ kind: "error", text: libraryStrings.search.addError });
    } finally {
      addInFlight.current = false;
      setBusyKey(undefined);
    }
  };

  return (
    <div className="grid gap-[var(--space-4)]">
      <header className="mt-[calc(var(--control-min-size)*-1)] mb-[var(--space-5)] grid gap-[var(--space-content)] pr-[calc(var(--control-min-size)+var(--space-content))]">
        <h2 id="library-search-title">{libraryStrings.search.heading}</h2>
      </header>
      <label className="grid gap-[var(--space-content-tight)] font-bold text-text-strong">
        <span>{libraryStrings.search.label}</span>
        <Input
          {...inputProps}
          aria-describedby="library-search-hint"
          id="library-add-search"
          className="w-full"
          autoComplete="off"
          onChange={(event) => {
            providerRequestSequence.current += 1;
            providerInFlight.current = false;
            providerController.current?.abort();
            inputProps.onChange(event);
            setProvider({ phase: "idle" });
            setMessage(undefined);
          }}
          placeholder={libraryStrings.search.placeholder}
          type="search"
        />
      </label>

      <p
        id="library-search-hint"
        role={tooLong ? "status" : undefined}
        className="text-text-muted text-[length:var(--text-caption-size)]"
      >
        {tooLong ? searchStrings.tooLong : searchStrings.limitHint}
      </p>
      {query.normalize("NFKC").trim().toLowerCase() === "bl" ? (
        <p className="text-text-muted">{libraryStrings.search.genreClassificationHint}</p>
      ) : null}
      <div className="flex flex-wrap items-center gap-[var(--space-3)]">
        <label className="grid gap-[var(--space-content-tight)]">
          <span>{libraryStrings.search.readingState}</span>
          <NativeSelect
            value={readingState}
            disabled={busyKey !== undefined}
            onChange={(event) =>
              setReadingState(
                event.currentTarget.value === "completed" || event.currentTarget.value === "reading"
                  ? event.currentTarget.value
                  : "planned",
              )
            }
          >
            <option value="planned">{libraryStrings.tabs.planned}</option>
            <option value="reading">{libraryStrings.tabs.reading}</option>
            <option value="completed">{libraryStrings.tabs.completed}</option>
          </NativeSelect>
        </label>
        <label className="grid gap-[var(--space-content-tight)]">
          <span>{libraryStrings.search.genreHint}</span>
          <NativeSelect
            value={genre ?? "all"}
            onChange={(event) =>
              setGenre(GENRE_TAGS.find((value) => value === event.currentTarget.value))
            }
          >
            <option value="all">{onboardingStrings.step1.allGenres}</option>
            {GENRE_TAGS.map((value) => (
              <option key={value} value={value}>
                {onboardingStrings.step1.genreLabels[value]}
              </option>
            ))}
          </NativeSelect>
        </label>
        {inputProps.value.length > 0 ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              clear();
              providerController.current?.abort();
              providerRequestSequence.current += 1;
              providerInFlight.current = false;
              setProvider({ phase: "idle" });
              setMessage(undefined);
            }}
          >
            {libraryStrings.filteredEmpty.clearSearch}
          </Button>
        ) : null}
      </div>

      {(hasQuery || genre !== undefined) && !tooLong ? (
        <section
          aria-labelledby="library-local-search-heading"
          className="grid gap-[var(--space-4)] border-t border-line pt-[var(--space-5)]"
        >
          <h3 id="library-local-search-heading">{libraryStrings.search.localHeading}</h3>
          <p aria-live="polite" className="text-text-muted">
            {localResults.length === 0
              ? libraryStrings.search.noLocalResults
              : libraryStrings.search.localResults(localResults.length)}
          </p>
          {localResults.length > 0 ? (
            <ul className="m-0 grid list-none p-0">
              {localResults.map((work) => {
                const added = isCatalogAdded(work.id);
                const busy = busyKey === `catalog:${work.id}`;
                return (
                  <li
                    className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-[var(--space-3)] border-b border-line py-[var(--space-3)] md:grid-cols-[56px_minmax(0,1fr)_auto]"
                    key={work.id}
                  >
                    <div className="w-14">
                      <CoverImage
                        coverUrl={catalogCoverUrls?.get(work.id)}
                        creators={work.creators}
                        onVisible={() => onCatalogCoverVisible?.(work.id)}
                        requestedSize={400}
                        title={work.title}
                      />
                    </div>
                    <div className="grid min-w-0 gap-[var(--space-content-tight)]">
                      <h4 className="m-0 [overflow-wrap:anywhere] text-[length:var(--font-size-14)] leading-[var(--line-height-heading)] text-text-strong">
                        {work.title}
                      </h4>
                      <p className="text-text-muted">
                        {work.creators.join("・") || libraryStrings.unknownCreator}
                      </p>
                    </div>
                    <Button
                      className="col-span-full gap-[var(--space-2)] md:col-auto"
                      disabled={added || busyKey !== undefined}
                      onClick={() => void addCatalog(work)}
                      type="button"
                      variant="outline"
                    >
                      <BookmarkIcon
                        aria-hidden="true"
                        className={added ? "size-4 fill-current" : "size-4"}
                      />
                      {added
                        ? libraryStrings.search.added
                        : busy
                          ? libraryStrings.search.adding
                          : readingState === "reading"
                            ? libraryStrings.search.addReading
                            : readingState === "completed"
                              ? libraryStrings.search.addCompleted
                              : libraryStrings.search.add}
                    </Button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </section>
      ) : (
        <div className="work-search-empty">
          {emptyContent}
          <p className="text-text-muted">{libraryStrings.search.prompt}</p>
        </div>
      )}

      {hasQuery ? (
        <Button
          className="justify-self-start"
          disabled={
            provider.phase === "loading" ||
            busyKey !== undefined ||
            tooLong ||
            inputProps.value !== query ||
            !online
          }
          aria-busy={provider.phase === "loading"}
          aria-describedby={
            provider.phase === "error" || !online ? "library-provider-status" : undefined
          }
          onClick={() => void runProviderSearch()}
          type="button"
        >
          {provider.phase === "loading"
            ? libraryStrings.search.rakutenSearching
            : provider.phase === "error"
              ? libraryStrings.search.rakutenRetry
              : libraryStrings.search.rakutenExpand}
        </Button>
      ) : null}

      {provider.phase === "error" || !online ? (
        <p
          className="border-l-[length:var(--space-content-tight)] border-warn bg-canvas p-[var(--space-3)] text-text-strong"
          role="status"
          id="library-provider-status"
        >
          {online
            ? libraryStrings.search.providerUnavailable
            : libraryStrings.search.providerOffline}
        </p>
      ) : null}
      {provider.phase === "ready" ? (
        <section
          aria-labelledby="library-provider-search-heading"
          className="grid gap-[var(--space-4)] border-t border-line pt-[var(--space-5)]"
        >
          <h3 id="library-provider-search-heading">{libraryStrings.search.rakutenHeading}</h3>
          <p aria-live="polite" className="text-text-muted">
            {libraryStrings.search.rakutenResults(provider.items.length)}
          </p>
          {provider.items.length > 0 ? (
            <ul className="m-0 grid list-none p-0">
              {provider.items.map((item) => {
                const catalogMatch = catalogWorkForRakutenItem(catalog, item);
                const added =
                  catalogMatch === undefined
                    ? isExternalAdded(item)
                    : isCatalogAdded(catalogMatch.id);
                const busy = busyKey === `rakuten:${item.isbn}`;
                return (
                  <li
                    className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-[var(--space-3)] border-b border-line py-[var(--space-3)] md:grid-cols-[56px_minmax(0,1fr)_auto]"
                    key={item.isbn}
                  >
                    <div className="w-14">
                      <CoverImage
                        coverUrl={item.imageUrl}
                        creators={[item.author]}
                        requestedSize={200}
                        title={item.title}
                      />
                    </div>
                    <div className="grid min-w-0 gap-[var(--space-content-tight)]">
                      <h4 className="m-0 [overflow-wrap:anywhere] text-[length:var(--font-size-14)] leading-[var(--line-height-heading)] text-text-strong">
                        {catalogMatch?.title ?? item.title}
                      </h4>
                      <p className="text-text-muted">
                        {catalogMatch?.creators.join("・") ?? item.author}
                      </p>
                      <span className="inline-flex min-h-6 w-fit items-center rounded-[var(--radius-pill)] border border-line px-[var(--space-content)] py-0.5 text-[length:var(--text-caption-size)] font-bold text-text-muted">
                        {catalogMatch === undefined
                          ? libraryStrings.externalBadge
                          : libraryStrings.search.catalogMatch}
                      </span>
                    </div>
                    <Button
                      className="col-span-full gap-[var(--space-2)] md:col-auto"
                      disabled={added || busyKey !== undefined}
                      onClick={() => void addProviderItem(item)}
                      type="button"
                      variant="outline"
                    >
                      <BookmarkIcon
                        aria-hidden="true"
                        className={added ? "size-4 fill-current" : "size-4"}
                      />
                      {added
                        ? libraryStrings.search.added
                        : busy
                          ? libraryStrings.search.adding
                          : readingState === "reading"
                            ? libraryStrings.search.addReading
                            : readingState === "completed"
                              ? libraryStrings.search.addCompleted
                              : catalogMatch === undefined
                                ? libraryStrings.search.externalMatch
                                : libraryStrings.search.add}
                    </Button>
                  </li>
                );
              })}
            </ul>
          ) : null}
          <p className="text-[length:var(--text-caption-size)] text-text-muted">
            {libraryStrings.search.credit}
          </p>
        </section>
      ) : null}
      <p
        aria-live="polite"
        className="min-h-6 text-text-muted [&[role=alert]]:border-l-[length:var(--space-content-tight)] [&[role=alert]]:border-warn [&[role=alert]]:bg-canvas [&[role=alert]]:p-[var(--space-3)] [&[role=alert]]:text-text-strong"
        role={message?.kind === "error" ? "alert" : "status"}
      >
        {message?.text}
      </p>
    </div>
  );
}
