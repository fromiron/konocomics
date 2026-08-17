"use client";

import { useMemo, useRef, useState } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { Button } from "@/components/design-system/button";
import { Input } from "@/components/design-system/input";
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
    <div className="grid gap-[var(--space-4)]">
      <header className="mt-[calc(var(--control-min-size)*-1)] mb-[var(--space-5)] grid gap-[var(--space-content)] pr-[calc(var(--control-min-size)+var(--space-content))]">
        <h2 id="library-search-title">{libraryStrings.search.heading}</h2>
      </header>
      <label className="grid gap-[var(--space-content-tight)] font-bold text-text-strong">
        <span>{libraryStrings.search.label}</span>
        <Input
          className="w-full"
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
                      <CoverImage creators={work.creators} requestedSize={200} title={work.title} />
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
                      className="col-span-full md:col-auto"
                      disabled={added || busyKey !== undefined}
                      onClick={() => void addCatalog(work)}
                      type="button"
                      variant="outline"
                    >
                      {added
                        ? libraryStrings.search.added
                        : busy
                          ? libraryStrings.search.adding
                          : libraryStrings.search.add}
                    </Button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </section>
      ) : (
        <p className="text-text-muted">{libraryStrings.search.prompt}</p>
      )}

      {hasQuery ? (
        <Button
          className="justify-self-start"
          disabled={provider.phase === "loading" || busyKey !== undefined}
          onClick={() => void runProviderSearch()}
          type="button"
        >
          {provider.phase === "loading"
            ? libraryStrings.search.rakutenSearching
            : libraryStrings.search.rakutenExpand}
        </Button>
      ) : null}

      {provider.phase === "error" ? (
        <p
          className="border-l-[length:var(--space-content-tight)] border-warn bg-canvas p-[var(--space-3)] text-text-strong"
          role="status"
        >
          {libraryStrings.search.providerUnavailable}
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
                      className="col-span-full md:col-auto"
                      disabled={added || busyKey !== undefined}
                      onClick={() => void addProviderItem(item)}
                      type="button"
                      variant="outline"
                    >
                      {added
                        ? libraryStrings.search.added
                        : busy
                          ? libraryStrings.search.adding
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
