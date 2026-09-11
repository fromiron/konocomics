import { Link } from "@tanstack/react-router";
import { useRef } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/design-system/dialog";
import { ConfidenceLabel, ReasonChips } from "@/components/media/recommendation-evidence";
import { StateActionRow } from "@/components/media/state-action-row";
import type { Work } from "@/domain/catalog/types";
import type { TasteRecommendationExplanation } from "@/domain/explanation/types";
import { recommendationStrings } from "@/lib/strings";

type QuickPreviewDialogProps = Readonly<{
  open: boolean;
  opener: HTMLElement | null;
  explanation: TasteRecommendationExplanation | null;
  work: Work | null;
  volumeCount: number | null;
  coverUrl?: string | null;
  busy: boolean;
  planned: boolean;
  onOpenChange: (open: boolean) => void;
  onPlanned: () => void;
  onCompleted: () => void;
  onHidden: () => void;
  onRemovalIntent: () => void;
  onCoverVisible?: () => void;
}>;

export function QuickPreviewDialog({
  busy,
  coverUrl,
  explanation,
  opener,
  onCompleted,
  onCoverVisible,
  onHidden,
  onOpenChange,
  onPlanned,
  onRemovalIntent,
  open,
  planned,
  volumeCount,
  work,
}: QuickPreviewDialogProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  if (explanation === null || work === null || volumeCount === null) return null;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="recommendation-quick-preview !top-auto bottom-0 !max-h-[calc(100dvh-var(--space-4))] w-full max-w-full -translate-x-1/2 translate-y-0 grid-cols-[calc(var(--control-min-size)*1.5)_minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)_auto] gap-[var(--space-3)] overflow-hidden rounded-t-[var(--radius-card)] rounded-b-none pb-[calc(var(--space-4)+var(--layout-safe-area-bottom))] !transition-none !animate-none data-open:!animate-none data-closed:!animate-none sm:max-w-full [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:!top-1/2 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:bottom-auto [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:w-[min(calc(100%-var(--space-8)),var(--layout-width-reading))] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:max-w-[var(--layout-width-reading)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:-translate-y-1/2 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:grid-cols-[calc(var(--control-min-size)*2.5)_minmax(0,1fr)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:rounded-[var(--radius-card)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:pb-[var(--space-4)]"
        finalFocus={() => (opener?.isConnected === true ? opener : null)}
        initialFocus={titleRef}
      >
        <CoverImage
          className="w-full self-start [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:row-span-2"
          coverUrl={coverUrl}
          creators={work.creators}
          key={work.id}
          matchSourceAspectRatio
          onVisible={onCoverVisible}
          requestedSize={400}
          title={work.title}
        />
        <div className="grid min-w-0 content-start gap-[var(--space-2)] pr-[var(--control-min-size)]">
          <DialogHeader>
            <DialogTitle
              className="leading-[var(--line-height-heading)] font-bold [overflow-wrap:anywhere]"
              ref={titleRef}
              tabIndex={-1}
            >
              {work.title}
            </DialogTitle>
            <DialogDescription className="sr-only [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:not-sr-only">
              {recommendationStrings.quickPreview.description}
            </DialogDescription>
          </DialogHeader>
          <p className="text-[length:var(--text-caption-size)] text-text-muted">
            {recommendationStrings.workStatus[work.status]}
            <span aria-hidden="true"> · </span>
            {recommendationStrings.volumeCount(volumeCount)}
          </p>
        </div>
        <div className="col-span-full grid min-h-0 min-w-0 content-start gap-[var(--space-3)] overflow-y-auto overscroll-contain [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:col-span-1 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:col-start-2 [&_section]:grid [&_section]:gap-[var(--space-content)]">
          <section aria-labelledby="quick-preview-reasons">
            <h3 id="quick-preview-reasons">{recommendationStrings.reasonHeading}</h3>
            <ReasonChips
              caution={explanation.caution}
              cautionLabel={recommendationStrings.cautionHeading}
              emptyText={recommendationStrings.reasonUnavailable}
              reasons={explanation.positiveReasons}
            />
          </section>
          <ConfidenceLabel
            label={explanation.confidence.label}
            prefix={recommendationStrings.confidenceHeading}
          />
          <Link
            className="inline-flex min-h-[var(--control-min-size)] items-center justify-self-start font-bold text-accent"
            params={{ workId: work.id }}
            preload={false}
            to="/works/$workId"
          >
            {recommendationStrings.quickPreview.details}
          </Link>
        </div>
        <StateActionRow
          busy={busy}
          className="col-span-full flex-row flex-wrap items-center justify-between border-t border-line pt-[var(--space-3)]"
          onCompleted={onCompleted}
          onHidden={onHidden}
          onPlanned={onPlanned}
          onRemovalIntent={onRemovalIntent}
          planned={planned}
        />
      </DialogContent>
    </Dialog>
  );
}
