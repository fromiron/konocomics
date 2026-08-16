"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { usePageEntryMotion } from "@/components/motion/use-page-entry-motion";
import { parseExternalWorkDetailQuery } from "@/domain/catalog/external-work";
import { LibraryRecordEditor } from "@/features/library/record-editor";
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
    <main className="work-detail-not-found" data-external-detail-state={kind}>
      <p aria-atomic="true" aria-live="polite" className="visually-hidden">
        {navigationStrings.routeAnnouncement(copy.title)}
      </p>
      <h1>{copy.title}</h1>
      <p>{copy.description}</p>
      <Link className="interactive-press" href="/library">
        {copy.library}
      </Link>
    </main>
  );
}

function ExternalDetailLoading() {
  return (
    <main className="work-detail-page" data-external-detail-state="loading">
      <header className="work-detail-header">
        <h1>{externalDetailStrings.title}</h1>
        <p aria-live="polite">{externalDetailStrings.loading}</p>
      </header>
    </main>
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

  return (
    <main
      className={`work-detail-page${pageEntryMotion.active ? " page-entry-b" : ""}`}
      data-external-detail-state="found"
      data-external-work-detail={record.id}
      key={record.id}
      onAnimationEnd={pageEntryMotion.onAnimationEnd}
    >
      <p aria-atomic="true" aria-live="polite" className="visually-hidden">
        {navigationStrings.routeAnnouncement(record.title)}
      </p>
      <div className="work-detail-layout">
        <div className="work-detail-media" data-external-detail-cover>
          <CoverImage
            className="work-detail-cover"
            coverUrl={record.coverUrl}
            creators={record.creators}
            priority
            requestedSize={600}
            title={record.title}
            variant="hero"
          />
        </div>

        <div className="work-detail-content">
          <header className="work-detail-header">
            <span className="library-external-badge">{externalDetailStrings.badge}</span>
            <h1>{record.title}</h1>
            <p className="work-detail-header__creators">
              {record.creators.length === 0
                ? externalDetailStrings.metadata.unknownCreator
                : coverStrings.creatorLine(record.creators)}
            </p>
            <dl className="work-detail-metadata">
              <div>
                <dt>{externalDetailStrings.metadata.isbn}</dt>
                <dd>{isbnListFormatter.format(record.isbnSamples)}</dd>
              </div>
            </dl>
            <p className="library-external-note">{externalDetailStrings.exclusion}</p>
          </header>

          {storageDegraded ? (
            <p className="work-detail-alert" role="status">
              {workDetailStrings.storageWarning}
            </p>
          ) : null}

          <section
            aria-labelledby="external-work-state-heading"
            className="work-detail-state surface-card"
          >
            <h2 id="external-work-state-heading">{workDetailStrings.state.heading}</h2>
            <LibraryRecordEditor
              busy={busy}
              key={`${record.id}:${record.record.updatedAt}`}
              onSave={onSave}
              record={record.record}
            />
            <p
              aria-live="polite"
              className="work-detail-state__message"
              role={message?.kind === "error" ? "alert" : "status"}
            >
              {message?.text}
            </p>
          </section>
        </div>
      </div>
    </main>
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

export function ExternalWorkDetailFlow() {
  const searchParams = useSearchParams();
  const serializedSearchParams = searchParams.toString();
  const query = parseExternalWorkDetailQuery(new URLSearchParams(serializedSearchParams));
  const queryKey = query.kind === "valid" ? `valid:${query.id}` : "invalid";

  return <ExternalWorkDetailQuery key={queryKey} queryString={serializedSearchParams} />;
}
