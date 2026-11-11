import { Link } from "@tanstack/react-router";
import { useRef, type ReactNode } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/design-system/dialog";
import {
  ConfidenceLabel,
  KnownPublicationMeta,
  ReasonChips,
} from "@/components/media/recommendation-evidence";
import { StateActionRow } from "@/components/media/state-action-row";
import type { Work } from "@/domain/catalog/types";
import type { TasteRecommendationExplanation } from "@/domain/explanation/types";
import { recommendationStrings } from "@/lib/strings";

type QuickPreviewWork = Pick<Work, "id" | "title" | "creators" | "status">;

type QuickPreviewBaseProps = Readonly<{
  open: boolean;
  opener: HTMLElement | null;
  work: QuickPreviewWork | null;
  coverUrl?: string | null;
  onOpenChange: (open: boolean) => void;
  onCoverVisible?: () => void;
  /** Replaces the recommendations page's description under the title. */
  description?: ReactNode;
  /**
   * Where focus returns when the dialog closes. Without it, focus returns to the opener while it
   * still belongs to the work, else to the recommendations page heading.
   */
  finalFocusTarget?: () => HTMLElement | null;
}>;

/** The recommendations page: the work's reasons, confidence and detail link, then its reading state. */
type ReadingStatePreviewProps = Readonly<{
  explanation: TasteRecommendationExplanation | null;
  volumeCount: number | null;
  busy: boolean;
  planned: boolean;
  onPlanned: () => void;
  onCompleted: () => void;
  onHidden: () => void;
  onRemovalIntent: () => void;
  onDismissForToday?: () => void;
  /** Why the work meets the chosen mood, kept apart from the taste reasons. */
  moodLine?: string;
  children?: never;
  actions?: never;
}>;

/** A page without reading state supplies its own evidence and action row. */
type SlotPreviewProps = Readonly<{
  /** The evidence under the header, in place of the reasons, confidence and detail link. */
  children: ReactNode;
  /** The row at the bottom, in place of the reading-state actions. */
  actions: ReactNode;
  /** Shown after the publication status when known. */
  volumeCount?: number;
  explanation?: never;
  busy?: never;
  planned?: never;
  onPlanned?: never;
  onCompleted?: never;
  onHidden?: never;
  onRemovalIntent?: never;
  onDismissForToday?: never;
  moodLine?: never;
}>;

type QuickPreviewDialogProps = QuickPreviewBaseProps &
  (ReadingStatePreviewProps | SlotPreviewProps);

function recommendationFinalFocus(opener: HTMLElement | null, work: QuickPreviewWork) {
  const available = (element: HTMLElement | null) =>
    element?.isConnected === true &&
    !element.matches(":disabled, [aria-disabled='true']") &&
    element.closest("[inert], [data-carousel-clone]") === null;
  const belongsToWork = (element: HTMLElement | null) =>
    element !== null &&
    (element.closest<HTMLElement>("[data-recommendation-work-id]")?.dataset.recommendationWorkId ===
      work.id ||
      // A lens shelf card and a ranks 11-20 card can both open the same work.
      [`recommendation-shelf-work-${work.id}`, `recommendation-ranking-work-${work.id}`].some(
        (id) => document.getElementById(id)?.contains(element),
      ));
  const trigger =
    available(opener) && belongsToWork(opener)
      ? opener
      : [...document.querySelectorAll<HTMLButtonElement>("button[aria-label]")].find(
          (button) =>
            button.getAttribute("aria-label") ===
              recommendationStrings.quickPreview.open(work.title) &&
            !button.disabled &&
            available(button) &&
            belongsToWork(button),
        );
  // Featured actions are hidden until their card contains focus.
  trigger?.closest<HTMLElement>("article[tabindex]")?.focus({ preventScroll: true });
  return trigger ?? document.getElementById("recommendation-page-heading");
}

export function QuickPreviewDialog(props: QuickPreviewDialogProps) {
  const {
    coverUrl,
    description = recommendationStrings.quickPreview.description,
    finalFocusTarget,
    onCoverVisible,
    onOpenChange,
    open,
    opener,
    volumeCount,
    work,
  } = props;
  const titleRef = useRef<HTMLHeadingElement>(null);
  if (work === null) return null;

  let evidence: ReactNode;
  let actions: ReactNode;
  if (props.explanation === undefined) {
    evidence = props.children;
    actions = (
      <div className="col-span-full flex flex-wrap items-center justify-between border-t border-line pt-[var(--space-3)]">
        {props.actions}
      </div>
    );
  } else {
    const { explanation, moodLine } = props;
    if (explanation === null || volumeCount === null) return null;
    evidence = (
      <>
        {moodLine === undefined ? null : (
          <p
            className="w-fit rounded-[var(--radius-pill)] border border-accent/60 px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-caption-size)] font-bold text-accent-ink"
            data-recommendation-mood-match
          >
            {moodLine}
          </p>
        )}
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
          className="inline-flex min-h-[var(--control-min-size)] items-center justify-self-start font-bold text-accent-ink"
          params={{ workId: work.id }}
          preload={false}
          to="/works/$workId"
        >
          {recommendationStrings.quickPreview.details}
        </Link>
      </>
    );
    actions = (
      <StateActionRow
        busy={props.busy}
        className="col-span-full flex-row flex-wrap items-center justify-between border-t border-line pt-[var(--space-3)]"
        dismissForTodayLabel={recommendationStrings.mood.dismissLabel(work.title)}
        onCompleted={props.onCompleted}
        onDismissForToday={props.onDismissForToday}
        onHidden={props.onHidden}
        onPlanned={props.onPlanned}
        onRemovalIntent={props.onRemovalIntent}
        planned={props.planned}
      />
    );
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="recommendation-quick-preview !top-auto bottom-0 !max-h-[calc(100dvh-var(--space-4))] w-full max-w-full -translate-x-1/2 translate-y-0 grid-cols-[calc(var(--control-min-size)*1.5)_minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)_auto] gap-[var(--space-3)] overflow-hidden rounded-t-[var(--radius-card)] rounded-b-none pb-[calc(var(--space-4)+var(--layout-safe-area-bottom))] !transition-none !animate-none data-open:!animate-none data-closed:!animate-none sm:max-w-full fine-hover:!top-1/2 fine-hover:bottom-auto fine-hover:w-[min(calc(100%-var(--space-8)),var(--layout-width-reading))] fine-hover:max-w-[var(--layout-width-reading)] fine-hover:-translate-y-1/2 fine-hover:grid-cols-[calc(var(--control-min-size)*2.5)_minmax(0,1fr)] fine-hover:rounded-[var(--radius-card)] fine-hover:pb-[var(--space-4)]"
        finalFocus={() => {
          const target = finalFocusTarget?.() ?? recommendationFinalFocus(opener, work);
          target?.focus({ preventScroll: true });
          return false;
        }}
        initialFocus={titleRef}
      >
        <CoverImage
          className="w-full self-start fine-hover:row-span-2"
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
            <DialogDescription className="sr-only fine-hover:not-sr-only">
              {description}
            </DialogDescription>
          </DialogHeader>
          <KnownPublicationMeta
            className="text-[length:var(--text-caption-size)] text-text-muted"
            status={work.status}
            volumeCount={volumeCount}
          />
        </div>
        <div className="col-span-full grid min-h-0 min-w-0 content-start gap-[var(--space-3)] overflow-y-auto overscroll-contain fine-hover:col-span-1 fine-hover:col-start-2 [&_section]:grid [&_section]:gap-[var(--space-content)]">
          {evidence}
        </div>
        {actions}
      </DialogContent>
    </Dialog>
  );
}
