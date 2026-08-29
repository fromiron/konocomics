"use client";

import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { coverSourceForSize } from "@/components/cover/CoverImage";
import { usePageEntryMotion } from "@/components/motion/use-page-entry-motion";
import { parseExternalWorkDetailQuery } from "@/domain/catalog/external-work";
import { LibraryRecordEditor } from "@/features/library/record-editor";
import { WorkDetailShell } from "@/features/work-detail/work-detail-shell";
import {
  type ExternalWorkLookupResult,
  type ExternalWorkRecord,
  usePersistence,
} from "@/infrastructure/db";
import {
  navigationStrings,
  coverStrings,
  workDetailStrings,
  externalDetailStrings,
} from "@/lib/strings";

type ExternalDetailState =
  | Readonly<{ kind: "loading" }>
  | Readonly<{ kind: "missing" }>
  | Readonly<{ kind: "corrupt" }>
  | Readonly<{ kind: "unavailable" }>
  | Readonly<{ kind: "found"; record: ExternalWorkRecord }>;

const isbnListFormatter = new Intl.ListFormat("ja-JP");

function stateFromLookup(result: ExternalWorkLookupResult): ExternalDetailState {
  return result.kind === "found" ? { kind: "found", record: result.record } : result;
}

function ExternalDetailMessage({
  kind,
}: Readonly<{ kind: "invalid" | "missing" | "corrupt" | "unavailable" }>) {
  const copy =
    kind === "invalid"
      ? externalDetailStrings.malformed
      : kind === "missing"
        ? externalDetailStrings.missing
        : kind === "corrupt"
          ? externalDetailStrings.corrupt
          : externalDetailStrings.unavailable;

  return (
    <>
      <main
        className="mx-auto grid min-h-[calc(100dvh-var(--layout-mobile-navigation-clearance))] w-full max-w-[var(--layout-width-reading)] content-center justify-items-start gap-[var(--space-4)] p-[var(--layout-page-padding)]"
        data-external-detail-state={kind}
      >
        <p aria-atomic="true" aria-live="polite" className="sr-only">
          {navigationStrings.routeAnnouncement(copy.title)}
        </p>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
        <Link
          className="inline-flex min-h-[var(--control-min-size)] items-center font-bold text-accent underline underline-offset-[var(--space-content-tight)] transition-transform duration-[var(--motion-duration-press)] active:scale-[0.97] motion-reduce:transition-none"
          to="/library"
        >
          {copy.library}
        </Link>
      </main>
    </>
  );
}

function ExternalDetailLoading() {
  return (
    <>
      <main
        className="mx-auto grid min-h-dvh w-full max-w-[var(--layout-width-detail)] px-[var(--layout-page-padding)] pt-[var(--layout-page-block-start)] pb-[calc(var(--layout-mobile-navigation-clearance)+var(--space-8))] md:pb-[var(--space-section-large)]"
        data-external-detail-state="loading"
      >
        <header className="grid gap-[var(--space-content-loose)]">
          <h1>{externalDetailStrings.title}</h1>
          <p aria-live="polite">{externalDetailStrings.loading}</p>
        </header>
      </main>
    </>
  );
}

function ExternalDetailRecord({
  busy,
  message,
  onSave,
  record,
  storageDegraded,
}: Readonly<{
  busy: boolean;
  message: Readonly<{ kind: "status" | "error"; text: string }> | undefined;
  onSave(record: ExternalWorkRecord["record"]): Promise<void>;
  record: ExternalWorkRecord;
  storageDegraded: boolean;
}>) {
  const pageEntryMotion = usePageEntryMotion({ enabled: true, identity: record.id });
  const heroCoverUrl =
    record.coverUrl === undefined ? null : coverSourceForSize(record.coverUrl, 600);

  return (
    <>
      <main
        className={`mx-auto min-h-dvh w-full pb-[var(--space-section-large)]${pageEntryMotion.active ? " page-entry-b motion-safe:animate-[page-entry-b-enter_var(--motion-duration-page)_var(--motion-ease-direct)_both]" : ""}`}
        data-external-detail-state="found"
        data-external-work-detail={record.id}
        key={record.id}
        onAnimationEnd={pageEntryMotion.onAnimationEnd}
      >
        <p aria-atomic="true" aria-live="polite" className="sr-only">
          {navigationStrings.routeAnnouncement(record.title)}
        </p>
        <WorkDetailShell
          coverUrl={heroCoverUrl}
          creators={record.creators}
          kind="external"
          title={record.title}
        >
          <header className="grid gap-[var(--space-content-loose)]">
            <span className="inline-flex min-h-6 w-fit items-center rounded-[var(--radius-pill)] border border-line px-[var(--space-content)] py-0.5 text-[length:var(--text-caption-size)] font-bold text-text-muted">
              {externalDetailStrings.badge}
            </span>
            <h1 className="[overflow-wrap:anywhere] text-[length:var(--text-page-title-size)] leading-[var(--line-height-heading)] text-text-strong">
              {record.title}
            </h1>
            <p className="font-medium text-text-muted">
              {record.creators.length === 0
                ? externalDetailStrings.metadata.unknownCreator
                : coverStrings.creatorLine(record.creators)}
            </p>
            <dl className="m-0 flex flex-wrap gap-x-[var(--space-6)] gap-y-[var(--space-3)] p-0 [&>div]:grid [&>div]:gap-[var(--space-content-tight)] [&_dd]:m-0 [&_dd]:font-bold [&_dd]:text-text-strong [&_dt]:text-[length:var(--text-caption-size)] [&_dt]:font-medium [&_dt]:text-text-muted">
              <div>
                <dt>{externalDetailStrings.metadata.isbn}</dt>
                <dd>{isbnListFormatter.format(record.isbnSamples)}</dd>
              </div>
            </dl>
            <p className="border-l-[length:var(--space-content-tight)] border-line bg-canvas p-[var(--space-3)] text-[length:var(--text-caption-size)] text-text-muted">
              {externalDetailStrings.exclusion}
            </p>
          </header>

          {storageDegraded ? (
            <p
              className="border-l-[length:var(--space-content-tight)] border-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)]"
              role="status"
            >
              {workDetailStrings.storageWarning}
            </p>
          ) : null}

          <section
            aria-labelledby="external-work-state-heading"
            className="grid gap-[var(--space-4)]"
          >
            <h2
              className="text-[length:var(--font-size-16)] font-bold text-text-strong"
              id="external-work-state-heading"
            >
              {workDetailStrings.state.heading}
            </h2>
            <LibraryRecordEditor
              busy={busy}
              key={`${record.id}:${record.record.updatedAt}`}
              onSave={onSave}
              record={record.record}
            />
            <p
              aria-live="polite"
              className="min-h-6 text-[length:var(--text-caption-size)] text-text-muted [&[role=alert]]:border-l-[length:var(--space-content-tight)] [&[role=alert]]:border-warn [&[role=alert]]:px-[var(--space-3)] [&[role=alert]]:py-[var(--space-content)] [&[role=alert]]:text-text-strong"
              role={message?.kind === "error" ? "alert" : "status"}
            >
              {message?.text}
            </p>
          </section>
        </WorkDetailShell>
      </main>
    </>
  );
}

function ExternalWorkDetailQuery({ queryString }: Readonly<{ queryString: string }>) {
  const query = parseExternalWorkDetailQuery(new URLSearchParams(queryString));
  const externalId = query.kind === "valid" ? query.id : null;
  const { inspectExternalWork, saveExternalUserRecord, status } = usePersistence();
  const [detail, setDetail] = useState<ExternalDetailState>({ kind: "loading" });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<
    Readonly<{ kind: "status" | "error"; text: string }> | undefined
  >();
  const saveInFlight = useRef(false);

  useEffect(() => {
    if (externalId === null) return;

    let active = true;
    void inspectExternalWork(externalId)
      .then((result) => {
        if (active) setDetail(stateFromLookup(result));
      })
      .catch(() => {
        if (active) setDetail({ kind: "unavailable" });
      });

    return () => {
      active = false;
    };
  }, [externalId, inspectExternalWork]);

  const saveRecord = async (nextRecord: ExternalWorkRecord["record"]) => {
    if (detail.kind !== "found" || busy || saveInFlight.current) return;
    const current = detail.record;
    saveInFlight.current = true;
    setBusy(true);
    setMessage(undefined);
    try {
      const saved = await saveExternalUserRecord(current.id, current.normalizedKey, {
        ...nextRecord,
        workId: current.id,
      });
      setDetail((latest) =>
        latest.kind === "found" && latest.record.id === saved.id
          ? { kind: "found", record: saved }
          : latest,
      );
      setMessage({ kind: "status", text: externalDetailStrings.state.saved });
    } catch {
      setMessage({ kind: "error", text: externalDetailStrings.state.error });
    } finally {
      saveInFlight.current = false;
      setBusy(false);
    }
  };

  if (query.kind === "invalid") return <ExternalDetailMessage kind="invalid" />;
  if (detail.kind === "loading") return <ExternalDetailLoading />;
  if (detail.kind !== "found") return <ExternalDetailMessage kind={detail.kind} />;

  return (
    <ExternalDetailRecord
      busy={busy}
      message={message}
      onSave={saveRecord}
      record={detail.record}
      storageDegraded={status.state === "degraded"}
    />
  );
}

export function ExternalWorkDetailFlow({ workId = null }: Readonly<{ workId?: string | null }>) {
  const serializedSearchParams = workId === null ? "" : new URLSearchParams({ workId }).toString();
  const query = parseExternalWorkDetailQuery(new URLSearchParams(serializedSearchParams));
  const queryKey = query.kind === "valid" ? `valid:${query.id}` : "invalid";

  return <ExternalWorkDetailQuery key={queryKey} queryString={serializedSearchParams} />;
}
