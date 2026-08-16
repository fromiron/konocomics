"use client";

import { useMemo, useRef, useState } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import type { CatalogV1, Work } from "@/domain/catalog/types";
import { searchRakutenBooks, type RakutenBookItem } from "@/infrastructure/rakuten";
import { libraryStrings } from "@/lib/strings";

import { catalogWorkForRakutenItem, createLibraryWorkSearch } from "./search";

type ProviderState =
  | Readonly<{ phase: "idle" }>
  | Readonly<{ phase: "loading" }>
  | Readonly<{ phase: "ready"; items: readonly RakutenBookItem[] }>
  | Readonly<{ phase: "error" }>;

export type LibraryAddOutcome = "added" | "already-exists" | "preserved-unknown";

type WorkSearchSheetProps = Readonly<{
  catalog: CatalogV1;
  isCatalogAdded(workId: string): boolean;
  isExternalAdded(item: RakutenBookItem): boolean;
  onAddCatalog(work: Work): Promise<LibraryAddOutcome>;
  onAddExternal(item: RakutenBookItem): Promise<LibraryAddOutcome>;
}>;

export function WorkSearchSheet({
  catalog,
  isCatalogAdded,
  isExternalAdded,
  onAddCatalog,
  onAddExternal,
}: WorkSearchSheetProps) {
  const search = useMemo(() => createLibraryWorkSearch(catalog.works), [catalog.works]);
  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState<ProviderState>({ phase: "idle" });
  const [busyKey, setBusyKey] = useState<string>();
  const [message, setMessage] = useState<
    Readonly<{ kind: "status" | "error"; text: string }> | undefined
  >();
  const addInFlight = useRef(false);
  const providerInFlight = useRef(false);
  const providerRequestSequence = useRef(0);
  const localResults = useMemo(() => search.search(query), [query, search]);
  const hasQuery = query.trim().length > 0;

  const runProviderSearch = async () => {
    if (!hasQuery || provider.phase === "loading" || providerInFlight.current) return;
    providerInFlight.current = true;
    const requestSequence = providerRequestSequence.current + 1;
    providerRequestSequence.current = requestSequence;
    setProvider({ phase: "loading" });
    setMessage(undefined);
    try {
      const items = await searchRakutenBooks(query);
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
      const result = await onAddCatalog(work);
      if (result === "preserved-unknown") {
        setMessage({ kind: "error", text: libraryStrings.search.addUnknown });
        return;
      }
      setMessage({
        kind: "status",
        text:
          result === "added"
            ? libraryStrings.search.addedAnnouncement(work.title)
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
        catalogMatch === undefined ? await onAddExternal(item) : await onAddCatalog(catalogMatch);
      if (result === "preserved-unknown") {
        setMessage({ kind: "error", text: libraryStrings.search.addUnknown });
        return;
      }
      setMessage({
        kind: "status",
        text:
          result === "added"
            ? libraryStrings.search.addedAnnouncement(catalogMatch?.title ?? item.title)
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
    <div className="library-search-sheet">
      <header className="library-panel__header">
        <h2 id="library-search-title">{libraryStrings.search.heading}</h2>
      </header>
      <label className="library-search-sheet__query">
        <span>{libraryStrings.search.label}</span>
        <input
          autoComplete="off"
          onChange={(event) => {
            providerRequestSequence.current += 1;
            providerInFlight.current = false;
            setQuery(event.currentTarget.value);
            setProvider({ phase: "idle" });
            setMessage(undefined);
          }}
          placeholder={libraryStrings.search.placeholder}
          type="search"
          value={query}
        />
      </label>

      {hasQuery ? (
        <section aria-labelledby="library-local-search-heading" className="library-search-section">
          <h3 id="library-local-search-heading">{libraryStrings.search.localHeading}</h3>
          <p aria-live="polite" className="library-search-section__summary">
            {localResults.length === 0
              ? libraryStrings.search.noLocalResults
              : libraryStrings.search.localResults(localResults.length)}
          </p>
          {localResults.length > 0 ? (
            <ul className="library-search-results">
              {localResults.map((work) => {
                const added = isCatalogAdded(work.id);
                const busy = busyKey === `catalog:${work.id}`;
                return (
                  <li className="library-search-result" key={work.id}>
                    <div className="library-search-result__cover">
                      <CoverImage creators={work.creators} requestedSize={200} title={work.title} />
                    </div>
                    <div className="library-search-result__identity">
                      <h4>{work.title}</h4>
                      <p>{work.creators.join("・") || libraryStrings.unknownCreator}</p>
                    </div>
                    <button
                      className="interactive-press"
                      disabled={added || busyKey !== undefined}
                      onClick={() => void addCatalog(work)}
                      type="button"
                    >
                      {added
                        ? libraryStrings.search.added
                        : busy
                          ? libraryStrings.search.adding
                          : libraryStrings.search.add}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </section>
      ) : (
        <p className="library-search-sheet__prompt">{libraryStrings.search.prompt}</p>
      )}

      {hasQuery ? (
        <button
          className="library-search-sheet__rakuten interactive-press"
          disabled={provider.phase === "loading" || busyKey !== undefined}
          onClick={() => void runProviderSearch()}
          type="button"
        >
          {provider.phase === "loading"
            ? libraryStrings.search.rakutenSearching
            : libraryStrings.search.rakutenExpand}
        </button>
      ) : null}

      {provider.phase === "error" ? (
        <p className="library-search-sheet__provider-error" role="status">
          {libraryStrings.search.providerUnavailable}
        </p>
      ) : null}
      {provider.phase === "ready" ? (
        <section
          aria-labelledby="library-provider-search-heading"
          className="library-search-section"
        >
          <h3 id="library-provider-search-heading">{libraryStrings.search.rakutenHeading}</h3>
          <p aria-live="polite" className="library-search-section__summary">
            {libraryStrings.search.rakutenResults(provider.items.length)}
          </p>
          {provider.items.length > 0 ? (
            <ul className="library-search-results">
              {provider.items.map((item) => {
                const catalogMatch = catalogWorkForRakutenItem(catalog, item);
                const added =
                  catalogMatch === undefined
                    ? isExternalAdded(item)
                    : isCatalogAdded(catalogMatch.id);
                const busy = busyKey === `rakuten:${item.isbn}`;
                return (
                  <li className="library-search-result" key={item.isbn}>
                    <div className="library-search-result__cover">
                      <CoverImage
                        coverUrl={item.imageUrl}
                        creators={[item.author]}
                        requestedSize={200}
                        title={item.title}
                      />
                    </div>
                    <div className="library-search-result__identity">
                      <h4>{catalogMatch?.title ?? item.title}</h4>
                      <p>{catalogMatch?.creators.join("・") ?? item.author}</p>
                      <span className="library-search-result__match">
                        {catalogMatch === undefined
                          ? libraryStrings.externalBadge
                          : libraryStrings.search.catalogMatch}
                      </span>
                    </div>
                    <button
                      className="interactive-press"
                      disabled={added || busyKey !== undefined}
                      onClick={() => void addProviderItem(item)}
                      type="button"
                    >
                      {added
                        ? libraryStrings.search.added
                        : busy
                          ? libraryStrings.search.adding
                          : catalogMatch === undefined
                            ? libraryStrings.search.externalMatch
                            : libraryStrings.search.add}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
          <p className="library-search-sheet__credit">{libraryStrings.search.credit}</p>
        </section>
      ) : null}
      <p
        aria-live="polite"
        className="library-search-sheet__message"
        role={message?.kind === "error" ? "alert" : "status"}
      >
        {message?.text}
      </p>
    </div>
  );
}
