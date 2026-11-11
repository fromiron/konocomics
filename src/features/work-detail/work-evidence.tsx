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
  /** `named`: the lead sentence already names the lone anchor, so its caption is left out. */
  captions?: "visible" | "named";
  evidence: readonly WorkEvidence[];
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverVisible(workId: string): void;
}>;

/** Evidence covers are small enough to sit beside the reason bubble: 56px, 72px from `md`. */
const EVIDENCE_COVER_WIDTH =
  "w-[calc(var(--space-12)+var(--space-2))] md:w-[calc(var(--space-12)+var(--space-6))]";

/**
 * One library work behind the recommendation: its cover and title, linking to its detail. The
 * title caption never breaks inside a word: it keeps whole words over at most two lines. When the
 * bubble's lead sentence already names the work in bold, the caption is left out and the cover's
 * own alt text is the link's only name, so nothing is read twice.
 */
function EvidenceCover({
  caption = true,
  item,
  coverUrl,
  onCoverVisible,
}: Readonly<{
  caption?: boolean;
  item: WorkEvidence;
  coverUrl: string | null | undefined;
  onCoverVisible(workId: string): void;
}>) {
  return (
    <Link
      className={`grid ${EVIDENCE_COVER_WIDTH} content-start gap-[var(--space-1)] rounded-[var(--radius-cover)] text-[length:var(--text-caption-size)] leading-snug text-text hover:text-text-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`}
      params={{ workId: item.work.id }}
      preload={false}
      to="/works/$workId"
    >
      <CoverImage
        className="w-full"
        coverUrl={coverUrl}
        creators={item.work.creators}
        decorative={caption}
        onVisible={() => onCoverVisible(item.work.id)}
        requestedSize={200}
        title={item.work.title}
      />
      {caption ? (
        <span className="line-clamp-2 text-ellipsis [word-break:keep-all]">{item.work.title}</span>
      ) : null}
    </Link>
  );
}

/** The full evidence list for 4+ real anchors: order, role and each work's own reason. */
function EvidenceDialog({ evidence, coverUrls, onCoverVisible }: EvidenceProps) {
  const strings = workDetailStrings.compatibility;
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            className={`grid aspect-[30/43] h-auto ${EVIDENCE_COVER_WIDTH} place-items-center rounded-[var(--radius-cover)]`}
            variant="outline"
          />
        }
      >
        <span aria-hidden="true" className="text-[length:var(--font-size-20)]">
          {strings.moreAnchors(evidence.length - 3)}
        </span>
        <span className="sr-only">{strings.allAnchors}</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{strings.anchors}</DialogTitle>
          <DialogDescription>{strings.anchorCount(evidence.length)}</DialogDescription>
        </DialogHeader>
        <ol className="m-0 grid list-none gap-[var(--space-4)] p-0">
          {evidence.map((item, index) => (
            <li
              className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-[var(--space-3)]"
              key={item.work.id}
            >
              <EvidenceCover
                coverUrl={coverUrls.get(item.work.id)}
                item={item}
                onCoverVisible={onCoverVisible}
              />
              <span className="grid gap-[var(--space-1)] text-[length:var(--font-size-14)]">
                <span className="text-[length:var(--text-caption-size)] text-text-muted tabular-nums">
                  {index + 1}. {index === 0 ? strings.primaryAnchor : strings.supportingAnchor}
                </span>
                <span>{item.reasons[0] ?? strings.consensusSupport}</span>
              </span>
            </li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  );
}

/**
 * The library works that carry this recommendation, strongest first. A single work sits beside
 * the reason bubble and several sit in a row above it; either way the bubble's tail points at the
 * first cover, so the reason reads as coming from them (03 §6). The bubble already holds the lead
 * sentence, so the covers repeat no reason and carry no role badges.
 */
export function WorkEvidenceList({
  captions = "visible",
  evidence,
  coverUrls,
  onCoverVisible,
}: EvidenceProps) {
  if (evidence.length === 0) return null;
  return (
    <ul
      aria-label={workDetailStrings.compatibility.anchors}
      className="m-0 flex list-none flex-wrap items-start gap-[var(--space-3)] p-0"
      data-evidence-count={evidence.length}
    >
      {evidence.slice(0, 3).map((item) => (
        <li key={item.work.id}>
          <EvidenceCover
            caption={captions === "visible"}
            coverUrl={coverUrls.get(item.work.id)}
            item={item}
            onCoverVisible={onCoverVisible}
          />
        </li>
      ))}
      {evidence.length > 3 ? (
        <li>
          <EvidenceDialog
            coverUrls={coverUrls}
            evidence={evidence}
            onCoverVisible={onCoverVisible}
          />
        </li>
      ) : null}
    </ul>
  );
}
