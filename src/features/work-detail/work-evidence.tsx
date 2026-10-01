"use client";

import { Link } from "@tanstack/react-router";
import { CoverImage } from "@/components/cover/CoverImage";
import { Button } from "@/components/design-system/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/design-system/dialog";
import { workDetailStrings } from "@/lib/strings";
import type { WorkEvidence } from "./work-detail-data";

type EvidenceProps = Readonly<{
  evidence: readonly WorkEvidence[];
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverVisible(workId: string): void;
}>;

function EvidenceCard({
  item,
  index,
  coverUrl,
  onCoverVisible,
}: Readonly<{
  item: WorkEvidence;
  index: number;
  coverUrl: string | null | undefined;
  onCoverVisible(workId: string): void;
}>) {
  const strings = workDetailStrings.compatibility;
  const primary = index === 0;
  return (
    <Link
      className={`flex h-full min-w-0 items-start gap-[var(--space-3)] rounded-[var(--radius-card)] border p-[var(--space-4)] hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${primary ? "border-accent/40 bg-accent/5" : "border-line bg-surface-1"}`}
      data-evidence-role={primary ? "primary" : "supporting"}
      params={{ workId: item.work.id }}
      preload={false}
      to="/works/$workId"
    >
      <CoverImage
        className="w-[var(--space-12)] shrink-0"
        coverUrl={coverUrl}
        creators={item.work.creators}
        decorative
        onVisible={() => onCoverVisible(item.work.id)}
        requestedSize={200}
        title={item.work.title}
      />
      <span className="grid min-w-0 gap-[var(--space-2)]">
        <span
          className={`w-fit rounded-[var(--radius-pill)] border px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--font-size-12)] font-bold ${primary ? "border-accent bg-accent text-on-accent" : "border-line text-text-muted"}`}
        >
          {primary ? strings.primaryAnchor : strings.supportingAnchor}
        </span>
        <span className="font-bold [overflow-wrap:anywhere] text-text-strong">
          {item.work.title}
        </span>
        <span className="text-[length:var(--text-caption-size)] leading-[var(--line-height-body)] text-text-muted">
          {item.reasons[0] ?? strings.consensusSupport}
        </span>
      </span>
    </Link>
  );
}

export function WorkEvidenceSection({ evidence, coverUrls, onCoverVisible }: EvidenceProps) {
  if (evidence.length === 0) return null;
  const strings = workDetailStrings.compatibility;
  const card = (item: WorkEvidence, index: number) => (
    <EvidenceCard
      coverUrl={coverUrls.get(item.work.id)}
      index={index}
      item={item}
      onCoverVisible={onCoverVisible}
    />
  );
  return (
    <section aria-labelledby="work-evidence-heading" className="grid gap-[var(--space-4)]">
      <div className="grid gap-[var(--space-1)]">
        <h2
          className="text-[length:var(--text-subheading-size)] font-bold text-text-strong"
          id="work-evidence-heading"
        >
          {strings.anchors}
        </h2>
        <p className="text-[length:var(--font-size-14)] text-text-muted">
          {strings.anchorsDescription}
        </p>
      </div>
      <ul
        className={`m-0 grid list-none gap-[var(--space-3)] p-0 sm:grid-cols-2 ${evidence.length === 3 ? "lg:grid-cols-3" : ""}`}
        data-evidence-count={evidence.length}
      >
        {evidence.slice(0, 3).map((item, index) => (
          <li key={item.work.id}>{card(item, index)}</li>
        ))}
        {evidence.length > 3 ? (
          <li>
            <Dialog>
              <DialogTrigger
                render={
                  <Button
                    className="grid h-full w-full gap-[var(--space-1)] border-dashed py-[var(--space-5)]"
                    variant="outline"
                  />
                }
              >
                <span aria-hidden="true" className="text-[length:var(--font-size-24)]">
                  {strings.moreAnchors(evidence.length - 3)}
                </span>
                <span>{strings.allAnchors}</span>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{strings.anchors}</DialogTitle>
                  <DialogDescription>{strings.anchorCount(evidence.length)}</DialogDescription>
                </DialogHeader>
                <ol className="m-0 grid list-none gap-[var(--space-3)] p-0">
                  {evidence.map((item, index) => (
                    <li
                      className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-[var(--space-2)]"
                      key={item.work.id}
                    >
                      <span
                        aria-hidden="true"
                        className="pt-[var(--space-4)] text-[length:var(--text-caption-size)] tabular-nums text-text-muted"
                      >
                        {index + 1}
                      </span>
                      {card(item, index)}
                    </li>
                  ))}
                </ol>
              </DialogContent>
            </Dialog>
          </li>
        ) : null}
      </ul>
    </section>
  );
}
