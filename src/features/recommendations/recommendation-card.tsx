import { Link } from "@tanstack/react-router";
import { ScanSearchIcon } from "lucide-react";
import { useCallback } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { CoverBackdrop } from "@/components/media/cover-backdrop";
import { usePointerEffect } from "@/components/motion/use-pointer-effects";
import { ConfidenceLabel } from "@/components/media/recommendation-evidence";
import {
  CoverSaveToggle,
  QuietTextAction,
  RecommendationFeedbackActions,
} from "@/components/media/state-action-row";
import type { Work } from "@/domain/catalog/types";
import { generateTasteExplanation } from "@/domain/explanation/generate";
import type { TasteExplanationSentence } from "@/domain/explanation/types";
import type { RecommendationPlanEntry } from "@/domain/recommendation/types";
import { explanationLexicon, recommendationStrings } from "@/lib/strings";

type RecommendationCardProps = Readonly<{
  entry: RecommendationPlanEntry;
  work: Work;
  volumeCount: number;
  resolveTitle: (workId: string) => string | undefined;
  planned: boolean;
  busy: boolean;
  priority: boolean;
  coverUrl?: string | null;
  /** Absent on carousel clones, which never register as the canonical card. */
  articleRef?: (element: HTMLElement | null) => void;
  onPlanned: () => void;
  onCompleted: () => void;
  onHidden: () => void;
  onRemovalIntent: () => void;
  onDismissForToday?: () => void;
  onPreview?: () => void;
  onCoverVisible?: () => void;
}>;

function serializeContributionSummary(sentence: TasteExplanationSentence) {
  return JSON.stringify({
    text: sentence.text,
    source: sentence.source,
    group: sentence.group,
    factorId: sentence.factorId,
    value: sentence.value,
    anchorWorkIds: sentence.anchorWorkIds,
    ...(sentence.axisPreferenceDirection === undefined
      ? {}
      : { axisPreferenceDirection: sentence.axisPreferenceDirection }),
    ...(sentence.negativeReasonId === undefined
      ? {}
      : { negativeReasonId: sentence.negativeReasonId }),
  });
}

function explanationFor(
  entry: RecommendationPlanEntry,
  resolveTitle: (workId: string) => string | undefined,
) {
  return generateTasteExplanation({
    contributions: entry.contributions,
    confidenceLevel: entry.confidenceLevel,
    lexicon: explanationLexicon,
    resolveTitle,
  });
}

export function RecommendationCard({
  articleRef,
  busy,
  coverUrl,
  entry,
  onCompleted,
  onCoverVisible,
  onDismissForToday,
  onHidden,
  onPlanned,
  onPreview,
  onRemovalIntent,
  planned,
  priority,
  resolveTitle,
  volumeCount,
  work,
}: RecommendationCardProps) {
  const explanation = explanationFor(entry, resolveTitle);
  const leadReason = explanation.positiveReasons[0];
  // A soft light follows a fine pointer; the card never changes angle (04 §6 G).
  const attachGlare = usePointerEffect<HTMLElement>("light");
  const setArticle = useCallback(
    (element: HTMLElement | null) => {
      attachGlare(element);
      articleRef?.(element);
    },
    [articleRef, attachGlare],
  );

  return (
    <article
      className="recommendation-featured-card group/card relative isolate flex h-[22.25rem] w-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line/70 p-[var(--space-4)] focus-within:border-line-accent sm:h-[24.75rem] md:h-[28rem] md:p-[var(--space-5)]"
      data-personalized-recommendation-card={work.id}
      ref={setArticle}
      tabIndex={-1}
    >
      <span aria-hidden="true" className="pointer-glare" />
      <CoverBackdrop
        coverUrl={coverUrl}
        imageData={{ "data-recommendation-card-backdrop": true }}
        scrimData={{ "data-recommendation-card-scrim": true }}
      />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <h3 className="h-[3.25rem] shrink-0 line-clamp-2 text-[length:var(--font-size-20)] leading-[var(--line-height-heading)] font-bold text-text-strong">
          {work.title}
        </h3>
        <div className="recommendation-featured-card__meta flex min-w-0 shrink-0 flex-nowrap items-baseline gap-[var(--space-1)] overflow-hidden pt-[var(--space-1)] text-[length:var(--text-caption-size)] text-text-muted">
          <p className="min-w-0 truncate">
            {recommendationStrings.workStatus[work.status]}
            <span aria-hidden="true"> · </span>
            {recommendationStrings.volumeCount(volumeCount)}
          </p>
          <ConfidenceLabel
            className="shrink-0"
            label={explanation.confidence.label}
            prefix={recommendationStrings.confidenceHeading}
          />
        </div>
        <div className="recommendation-featured-card__stage flex min-h-0 flex-1 items-center justify-center py-[var(--space-3)] md:py-[var(--space-4)]">
          <Link
            aria-label={recommendationStrings.openDetails(work.title)}
            className="recommendation-featured-card__artwork block h-full max-h-full w-fit max-w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring"
            data-recommendation-select
            params={{ workId: work.id }}
            preload={false}
            to="/works/$workId"
          >
            <CoverImage
              className="h-full w-auto max-h-full max-w-full rounded-[var(--radius-cover)] border border-line/60 shadow-[var(--shadow-cover-featured)]"
              coverUrl={coverUrl}
              creators={work.creators}
              matchSourceAspectRatio
              onVisible={onCoverVisible}
              priority={priority}
              requestedSize={400}
              title={work.title}
            />
          </Link>
        </div>
        <p
          className="recommendation-featured-card__reason line-clamp-3 shrink-0 overflow-hidden text-[length:var(--font-size-12)] leading-[1.45] text-text md:text-[length:var(--font-size-14)]"
          data-contribution-summary={
            leadReason === undefined ? undefined : serializeContributionSummary(leadReason)
          }
          data-recommendation-evidence-summary={leadReason === undefined ? undefined : true}
        >
          {leadReason?.text ?? recommendationStrings.reasonUnavailable}
        </p>
        <div className="recommendation-featured-card__actions mt-[var(--space-2)] flex min-h-[var(--control-min-size)] min-w-0 shrink-0 flex-nowrap items-center gap-[var(--space-1)]">
          {onPreview === undefined ? null : (
            <QuietTextAction
              aria-label={recommendationStrings.quickPreview.open(work.title)}
              className="pointer-events-auto size-[var(--control-min-size)] shrink-0 justify-center px-0"
              onClick={onPreview}
              surface="cover"
            >
              <ScanSearchIcon aria-hidden="true" className="size-4" />
            </QuietTextAction>
          )}
          <CoverSaveToggle
            busy={busy}
            className="pointer-events-auto"
            onPlanned={onPlanned}
            planned={planned}
          />
          <RecommendationFeedbackActions
            busy={busy}
            className="pointer-events-auto ml-auto shrink-0"
            dismissForTodayLabel={recommendationStrings.mood.dismissLabel(work.title)}
            onCompleted={onCompleted}
            onDismissForToday={onDismissForToday}
            onHidden={onHidden}
            onRemovalIntent={onRemovalIntent}
            surface="cover"
          />
        </div>
      </div>
    </article>
  );
}
