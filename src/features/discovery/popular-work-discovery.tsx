"use client";

import { Link } from "@tanstack/react-router";
import { CheckIcon, XIcon } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { BookCover } from "@/components/cover/BookCover";
import { CoverImage } from "@/components/cover/CoverImage";
import { Button } from "@/components/design-system/button";
import { Dialog, DialogContent } from "@/components/design-system/dialog";
import { stripVolumeAndEditionTokens } from "@/domain/catalog/normalize";
import type { Work } from "@/domain/catalog/types";
import type { UserWorkRecord } from "@/domain/profile/types";
import { useCatalog } from "@/features/catalog/catalog-provider";
import { LibraryRecordEditor } from "@/features/library/record-editor";
import { catalogWorkForRakutenItem } from "@/features/library/search";
import {
  createPlannedExternalWorkRecord,
  usePersistence,
  type ExternalWorkRecord,
} from "@/infrastructure/db";
import { fetchPopularRakutenBooks, type RakutenBookItem } from "@/infrastructure/rakuten";
import { libraryStrings, popularWorkStrings, workDetailStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import { resolvePopularWork, selectPopularWork } from "./popular-works";

const DISMISSED_KEY = "konocomics:popular-discovery-dismissed";

function wasDismissed() {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

type Selection = Readonly<{
  item: RakutenBookItem;
  work?: Work;
  external?: ExternalWorkRecord;
  record: UserWorkRecord;
  mode: "preview" | "record";
}>;

export function PopularWorkDiscovery({ embedded = false }: Readonly<{ embedded?: boolean }>) {
  const catalog = useCatalog();
  const { userWorks, externalWorks, addUserWorkIfAbsent, addExternalWorkIfAbsent, status } =
    usePersistence();
  const [items, setItems] = useState<readonly RakutenBookItem[]>([]);
  const [dismissed, setDismissed] = useState(wasDismissed);
  const [resolved, setResolved] = useState<Readonly<{ isbn: string; item: RakutenBookItem }>>();
  const [selection, setSelection] = useState<Selection | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Readonly<{ error: boolean; text: string }>>();
  const inFlight = useRef(false);
  const opener = useRef<HTMLElement | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const detailHeading = useRef<HTMLHeadingElement>(null);
  const id = useId();
  const candidate = useMemo(
    () =>
      userWorks === undefined || externalWorks === undefined
        ? undefined
        : selectPopularWork(items, catalog, userWorks, externalWorks),
    [catalog, externalWorks, items, userWorks],
  );
  const item = resolved?.isbn === candidate?.isbn ? resolved?.item : undefined;

  useEffect(() => {
    if (dismissed) return;
    let active = true;
    void fetchPopularRakutenBooks()
      .then((next) => {
        if (active) setItems(next);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [dismissed]);

  useEffect(() => {
    if (candidate === undefined || dismissed) return;
    let active = true;
    void resolvePopularWork(candidate)
      .catch(() => candidate)
      .then((next) => {
        if (active) setResolved({ isbn: candidate.isbn, item: next });
      });
    return () => {
      active = false;
    };
  }, [candidate, dismissed]);

  useEffect(() => {
    if (!embedded) return;
    if (selection !== null) detailHeading.current?.focus({ preventScroll: true });
    else if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
  }, [embedded, selection]);

  const fallbackFocus = () =>
    embedded
      ? (heading.current
          ?.closest('[role="dialog"]')
          ?.querySelector<HTMLInputElement>('input[type="search"]') ?? null)
      : (document
          .getElementById("recommendation-shelf-discovery")
          ?.nextElementSibling?.querySelector<HTMLElement>("h2") ??
        document.querySelector<HTMLElement>("main h1"));

  const dismiss = () => {
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      /* Session memory still hides the prompt. */
    }
    setDismissed(true);
    setSelection(null);
    const target = fallbackFocus();
    if (target !== null) {
      if (/^H[1-6]$/u.test(target.tagName)) target.tabIndex = -1;
      target.focus({ preventScroll: true });
    }
  };

  const close = () => {
    if (inFlight.current) return;
    setSelection(null);
    setMessage(undefined);
  };

  const open = async (mode: Selection["mode"], source: HTMLElement) => {
    if (item === undefined || inFlight.current) return;
    opener.current = source;
    inFlight.current = true;
    setBusy(true);
    setMessage(undefined);
    try {
      const work = catalogWorkForRakutenItem(catalog, item);
      const updatedAt = new Date().toISOString();
      let external: ExternalWorkRecord | undefined;
      let record: UserWorkRecord;
      if (work === undefined) {
        external = await createPlannedExternalWorkRecord(item, updatedAt);
        record = external.record;
      } else {
        record = { workId: work.id, readingState: "planned", updatedAt };
      }
      setSelection({
        item,
        work,
        external,
        mode,
        record: { ...record, readingState: mode === "record" ? "completed" : "planned" },
      });
    } catch {
      setMessage({ error: true, text: libraryStrings.search.addError });
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };

  const save = async (record: UserWorkRecord) => {
    if (selection === null || inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setMessage(undefined);
    try {
      const result =
        selection.external === undefined
          ? await addUserWorkIfAbsent(record)
          : await addExternalWorkIfAbsent({ ...selection.external, record });
      if (result.kind === "preserved-unknown") {
        setMessage({ error: true, text: libraryStrings.search.addUnknown });
      } else {
        dismiss();
        setMessage({
          error: false,
          text:
            result.kind === "added" ? libraryStrings.editor.saved : popularWorkStrings.alreadyAdded,
        });
      }
    } catch {
      setMessage({ error: true, text: libraryStrings.editor.error });
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };

  const selectedTitle =
    selection?.work?.title ??
    (selection === null ? "" : stripVolumeAndEditionTokens(selection.item.title));
  const detail =
    selection === null ? null : (
      <div className="grid gap-[var(--space-4)]" data-popular-detail={selection.mode}>
        {embedded ? (
          <Button className="justify-self-start" disabled={busy} onClick={close} variant="ghost">
            {popularWorkStrings.back}
          </Button>
        ) : null}
        <div className="grid grid-cols-[calc(var(--control-min-size)*2)_minmax(0,1fr)] items-start gap-[var(--space-4)] pr-[var(--space-6)]">
          <CoverImage
            coverUrl={selection.item.imageUrl}
            creators={[selection.item.author]}
            title={selectedTitle}
            matchSourceAspectRatio
            requestedSize={400}
          />
          <div className="grid min-w-0 gap-[var(--space-2)]">
            <h2
              id={`${id}-detail-title`}
              ref={detailHeading}
              tabIndex={-1}
              className="[overflow-wrap:anywhere]"
            >
              {selectedTitle}
            </h2>
            <p className="text-text-muted">{selection.item.author}</p>
            <p id={`${id}-detail-description`} className="text-text-muted">
              {selection.mode === "record"
                ? popularWorkStrings.recordPrompt
                : popularWorkStrings.independent}
            </p>
            {selection.work === undefined ? (
              <p className="text-[length:var(--text-caption-size)] text-text-muted">
                {libraryStrings.externalExclusion}
              </p>
            ) : null}
          </div>
        </div>
        {selection.mode === "record" ? (
          <LibraryRecordEditor busy={busy} isNewRecord onSave={save} record={selection.record} />
        ) : (
          <>
            <section className="grid gap-[var(--space-2)]">
              <h3>{workDetailStrings.synopsis.heading}</h3>
              <p className="whitespace-pre-line [overflow-wrap:anywhere]">
                {selection.item.itemCaption ?? workDetailStrings.synopsis.unavailable}
              </p>
              <p className="text-[length:var(--text-caption-size)] text-text-muted">
                {popularWorkStrings.listing(selection.item.title)}
              </p>
            </section>
            <div className="flex flex-wrap items-center gap-[var(--space-3)]">
              <Button disabled={busy} onClick={() => void save(selection.record)}>
                {libraryStrings.search.add}
              </Button>
              {selection.work === undefined ? null : (
                <Link
                  className="inline-flex min-h-[var(--control-min-size)] items-center text-accent underline"
                  params={{ workId: selection.work.id }}
                  to="/works/$workId"
                >
                  {libraryStrings.panel.catalogDetail}
                </Link>
              )}
              <a
                className="inline-flex min-h-[var(--control-min-size)] items-center text-accent underline"
                href={selection.item.affiliateUrl ?? selection.item.itemUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {popularWorkStrings.rakuten}
              </a>
            </div>
          </>
        )}
        {status.state === "degraded" ? (
          <p role="status" className="text-text-muted">
            {libraryStrings.storageWarning}
          </p>
        ) : null}
        {message?.error ? <p role="alert">{message.text}</p> : null}
      </div>
    );

  if ((dismissed || item === undefined) && selection === null && message === undefined) return null;
  const title =
    item === undefined
      ? ""
      : (catalogWorkForRakutenItem(catalog, item)?.title ??
        stripVolumeAndEditionTokens(item.title));
  return (
    <div
      className={cn("popular-work-discovery", !embedded && "mt-[var(--space-section)]")}
      data-popular-discovery={embedded ? "library" : "recommendations"}
    >
      {!dismissed && item !== undefined ? (
        <section
          className="popular-work-banner"
          aria-labelledby={`${id}-question`}
          hidden={embedded && selection !== null}
        >
          <Button
            className="popular-work-banner__cover active:scale-100"
            disabled={busy}
            onClick={(event) => void open("preview", event.currentTarget)}
            variant="ghost"
            aria-label={popularWorkStrings.preview(title)}
          >
            <BookCover
              coverUrl={item.imageUrl}
              creators={[item.author]}
              decorative
              requestedSize={400}
              title={title}
            />
          </Button>
          <div className="popular-work-banner__copy">
            <p className="popular-work-banner__source">{popularWorkStrings.source}</p>
            <h2
              className="popular-work-banner__question"
              id={`${id}-question`}
              ref={heading}
              tabIndex={-1}
            >
              <button
                className="popular-work-banner__title"
                disabled={busy}
                onClick={(event) => void open("preview", event.currentTarget)}
                type="button"
              >
                {popularWorkStrings.title(title)}
              </button>
              {popularWorkStrings.question}
            </h2>
          </div>
          <div className="popular-work-banner__answers">
            <Button
              className="popular-work-banner__answer"
              disabled={busy}
              onClick={(event) => void open("record", event.currentTarget)}
              variant="outline"
            >
              <CheckIcon aria-hidden="true" />
              {popularWorkStrings.read}
            </Button>
            <Button
              className="popular-work-banner__answer"
              disabled={busy}
              onClick={(event) => void open("preview", event.currentTarget)}
              variant="outline"
            >
              <XIcon aria-hidden="true" />
              {popularWorkStrings.unread}
            </Button>
          </div>
          <Button
            className="popular-work-banner__dismiss"
            aria-label={popularWorkStrings.dismiss}
            disabled={busy}
            onClick={dismiss}
            variant="ghost"
            size="icon"
          >
            <XIcon aria-hidden="true" />
          </Button>
        </section>
      ) : null}
      {embedded ? (
        detail
      ) : (
        <Dialog
          open={selection !== null}
          onOpenChange={(next) => {
            if (!next) close();
          }}
        >
          <DialogContent
            aria-labelledby={`${id}-detail-title`}
            aria-describedby={`${id}-detail-description`}
            className="sm:max-w-[var(--layout-width-reading)]"
            initialFocus={detailHeading}
            finalFocus={() => (opener.current?.isConnected ? opener.current : fallbackFocus())}
          >
            {detail}
          </DialogContent>
        </Dialog>
      )}
      {message !== undefined && (selection === null || !message.error) ? (
        <p
          className="mt-[var(--space-3)] text-text-muted"
          role={message.error ? "alert" : "status"}
        >
          {message.text}
        </p>
      ) : null}
    </div>
  );
}
