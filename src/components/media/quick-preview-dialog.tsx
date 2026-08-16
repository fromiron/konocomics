import { Link } from "@tanstack/react-router";

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
}>;

export function QuickPreviewDialog({
  busy,
  coverUrl,
  explanation,
  onCompleted,
  onHidden,
  onOpenChange,
  onPlanned,
  open,
  planned,
  volumeCount,
  work,
}: QuickPreviewDialogProps) {
  if (explanation === null || work === null || volumeCount === null) return null;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="recommendation-quick-preview !top-auto bottom-0 !max-h-[calc(100dvh-var(--space-4))] w-full max-w-full -translate-x-1/2 translate-y-0 rounded-t-[var(--radius-card)] rounded-b-none !transition-none !animate-none data-open:!animate-none data-closed:!animate-none sm:max-w-full [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:!top-1/2 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:bottom-auto [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:w-[min(calc(100%-var(--space-8)),var(--layout-width-reading))] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:max-w-[var(--layout-width-reading)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:-translate-y-1/2 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:rounded-[var(--radius-card)]">
        <div className="grid grid-cols-[minmax(0,calc(var(--control-min-size)*2.5))_minmax(0,1fr)] gap-[var(--space-4)]">
          <CoverImage
            className="w-full"
            coverUrl={coverUrl}
            creators={work.creators}
            requestedSize={400}
            title={work.title}
          />
          <div className="grid min-w-0 content-start gap-[var(--space-3)] [&_section]:grid [&_section]:gap-[var(--space-content)]">
            <DialogHeader>
              <DialogTitle>{work.title}</DialogTitle>
              <DialogDescription>
                {recommendationStrings.quickPreview.description}
              </DialogDescription>
            </DialogHeader>
            <p className="text-[length:var(--text-caption-size)] text-text-muted">
              {recommendationStrings.workStatus[work.status]}
              <span aria-hidden="true"> · </span>
              {recommendationStrings.volumeCount(volumeCount)}
            </p>
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
        </div>
        <StateActionRow
          busy={busy}
          onCompleted={onCompleted}
          onHidden={onHidden}
          onPlanned={onPlanned}
          planned={planned}
        />
      </DialogContent>
    </Dialog>
  );
}
