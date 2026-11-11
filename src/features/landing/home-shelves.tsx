"use client";

import { lazy, Suspense, useId, useState } from "react";

import { ExpandPanel, PanelReason } from "@/components/media/expand-panel";
import { ExpandShelfCard, QuickPreviewControl } from "@/components/media/expand-shelf-card";
import { LeadReasonText } from "@/components/media/lead-reason-text";
import { MediaShelf } from "@/components/media/media-shelf";
import { RankingCard } from "@/components/media/ranking-card";
import { RankingShelf } from "@/components/media/ranking-shelf";
import { EXPAND_SHELF_TRACK_CLASSNAME, useExpandShelf } from "@/components/media/use-expand-shelf";
import { WorkDetailLink } from "@/components/media/work-detail-link";
import {
  landingStrings,
  mediaStrings,
  onboardingStrings,
  recommendationStrings,
} from "@/lib/strings";
import { cn } from "@/lib/utils";

import type { LandingSample, LandingWork } from "./landing-types";
import type { SampleReason } from "./sample-reason";

// Loaded on first use, as on the recommendations page.
const QuickPreviewDialog = lazy(async () => {
  const module = await import("@/components/media/quick-preview-dialog");
  return { default: module.QuickPreviewDialog };
});

type ShelfProps = Readonly<{
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverVisible(workId: string): void;
}>;

type SampleShelfProps = ShelfProps &
  Readonly<{ sample: LandingSample; reasons: ReadonlyMap<string, SampleReason> }>;

function SampleReasonText({ reason }: Readonly<{ reason: SampleReason | undefined }>) {
  return (
    <LeadReasonText
      anchorIndex={reason?.anchorIndex ?? -1}
      anchorTitle={reason?.anchorTitle}
      strongClassName="font-bold text-text-strong"
      text={reason?.text ?? recommendationStrings.reasonUnavailable}
    />
  );
}

/**
 * One liked-work lens of the sample, as expand cards. The title names the liked work, and every
 * card's lead reason names it too; the panel opens the reason in a paper bubble. Where cards cannot
 * expand, Quick Preview shows the same reason. Its open state is local: no URL, no storage.
 */
export function HomeSampleLens({ coverUrls, onCoverVisible, reasons, sample }: SampleShelfProps) {
  const expandShelf = useExpandShelf();
  const reasonHeadingId = useId();
  const [preview, setPreview] = useState<{ workId: string; opener: HTMLElement } | null>(null);
  const anchorTitle =
    sample.anchorWorks.find((anchor) => anchor.id === sample.lens.anchorWorkId)?.title ?? "";
  const previewItem =
    preview === null ? undefined : sample.lens.items.find(({ work }) => work.id === preview.workId);

  return (
    <div {...expandShelf.boundaryProps}>
      <MediaShelf
        compactHeading
        controlsPlacement="overlay"
        onPageChange={expandShelf.close}
        title={recommendationStrings.lensShelves.anchor.title(anchorTitle)}
        trackClassName={cn("!pb-[var(--space-1)]", EXPAND_SHELF_TRACK_CLASSNAME)}
      >
        {sample.lens.items.map(({ caption, work }) => (
          <ExpandShelfCard
            {...expandShelf.cardProps(work.id)}
            coverUrl={coverUrls.get(work.id)}
            creators={work.creators}
            data-landing-sample-work-id={work.id}
            key={work.id}
            onCoverVisible={() => onCoverVisible(work.id)}
            panel={
              <ExpandPanel
                actions={<WorkDetailLink title={work.title} workId={work.id} />}
                caption={caption}
                reason={<SampleReasonText reason={reasons.get(work.id)} />}
              />
            }
            preview={
              <QuickPreviewControl
                onClick={(event) => setPreview({ workId: work.id, opener: event.currentTarget })}
                title={work.title}
              />
            }
            title={work.title}
            workId={work.id}
          />
        ))}
      </MediaShelf>
      {preview !== null && previewItem !== undefined ? (
        <Suspense fallback={null}>
          <QuickPreviewDialog
            actions={<WorkDetailLink title={previewItem.work.title} workId={previewItem.work.id} />}
            coverUrl={coverUrls.get(previewItem.work.id)}
            description={landingStrings.sample.quickPreviewDescription}
            finalFocusTarget={() => (preview.opener.isConnected ? preview.opener : null)}
            onCoverVisible={() => onCoverVisible(previewItem.work.id)}
            onOpenChange={(open) => {
              if (!open) setPreview(null);
            }}
            open
            opener={preview.opener}
            work={previewItem.work}
          >
            <section aria-labelledby={reasonHeadingId}>
              <h3 id={reasonHeadingId}>{recommendationStrings.reasonHeading}</h3>
              <PanelReason>
                <SampleReasonText reason={reasons.get(previewItem.work.id)} />
              </PanelReason>
              {previewItem.caption === undefined ? null : (
                <p className="text-[length:var(--text-caption-size)] leading-[var(--line-height-body)] text-text-muted">
                  {previewItem.caption}
                </p>
              )}
            </section>
          </QuickPreviewDialog>
        </Suspense>
      ) : null}
    </div>
  );
}

/** The editorial Top 10: a first pick for newcomers, not a ranking of the visitor's taste. */
export function HomeEditorialRanking({
  coverUrls,
  onCoverVisible,
  works,
}: ShelfProps & Readonly<{ works: readonly LandingWork[] }>) {
  return (
    <RankingShelf
      compactHeading
      controlsPlacement="overlay"
      description={landingStrings.ranking.description}
      rankingKind="editorial-ranking"
      title={landingStrings.ranking.title}
      trackClassName="items-start"
    >
      {works.map((work, index) => {
        const genreLabels = work.genres.map((genre) => onboardingStrings.step1.genreLabels[genre]);
        return (
          <RankingCard
            coverUrl={coverUrls.get(work.id)}
            creators={work.creators}
            key={work.id}
            metadata={mediaStrings.catalogMetadata.compact(
              genreLabels[0],
              Math.max(0, genreLabels.length - 1),
            )}
            metadataAccessibleLabel={mediaStrings.catalogMetadata.accessible(
              genreLabels,
              recommendationStrings.workStatus[work.status],
            )}
            onCoverVisible={() => onCoverVisible(work.id)}
            position={index + 1}
            rankingKind="editorial-ranking"
            title={work.title}
            workId={work.id}
          />
        );
      })}
    </RankingShelf>
  );
}
