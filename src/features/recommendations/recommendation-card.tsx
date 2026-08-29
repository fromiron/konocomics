import { Link } from "@tanstack/react-router";
import { type Ref } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { ConfidenceLabel } from "@/components/media/recommendation-evidence";
import {
  CoverSaveToggle,
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
  articleRef: Ref<HTMLElement>;
  onPlanned: () => void;
  onCompleted: () => void;
  onHidden: () => void;
  onRemovalIntent: () => void;
  onPreview?: () => void;
  onCoverSettled?: () => void;
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

function usesTouchPresentation() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: none), (pointer: coarse)").matches
  );
}

export function RecommendationCard({
  articleRef,
  busy,
  coverUrl,
  entry,
  onCompleted,
  onCoverSettled,
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

  return (
    <article
      className="recommendation-featured-card group/card relative flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line/70 bg-surface-1 transition-[border-color,box-shadow] duration-[var(--motion-duration-feedback)] hover:border-line-accent hover:shadow-[var(--shadow-level-1)] motion-reduce:transition-none"
      data-personalized-recommendation-card={work.id}
      ref={articleRef}
      tabIndex={-1}
    >
      <div className="relative">
        <Link
          aria-label={recommendationStrings.openDetails(work.title)}
          className="relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring"
          data-recommendation-select
          onClick={(event) => {
            if (onPreview === undefined || !usesTouchPresentation()) return;
            event.preventDefault();
            onPreview();
          }}
          params={{ workId: work.id }}
          preload={false}
          to="/works/$workId"
        >
          <CoverImage
            className="rounded-none border-0"
            coverUrl={coverUrl}
            creators={work.creators}
            onSettled={onCoverSettled}
            priority={priority}
            requestedSize={400}
            title={work.title}
          />
        </Link>
        <span
          aria-hidden="true"
          className="recommendation-featured-card__seam pointer-events-none absolute inset-x-0 bottom-0 z-[1]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 grid gap-[var(--space-content-tight)] px-[var(--space-3)] pt-[var(--space-8)] pb-[var(--space-2)]">
          <h3 className="line-clamp-2 text-[length:var(--font-size-20)] leading-tight font-bold text-text-strong">
            {work.title}
          </h3>
          <p className="line-clamp-1 text-[length:var(--text-caption-size)] text-text-muted">
            {recommendationStrings.workStatus[work.status]}
            <span aria-hidden="true"> · </span>
            {recommendationStrings.volumeCount(volumeCount)}
          </p>
          <p
            className="line-clamp-2 text-[length:var(--font-size-12)] leading-[1.45] text-text"
            data-contribution-summary={
              leadReason === undefined ? undefined : serializeContributionSummary(leadReason)
            }
            data-recommendation-evidence-summary={leadReason === undefined ? undefined : true}
          >
            {leadReason?.text ?? recommendationStrings.reasonUnavailable}
          </p>
          <ConfidenceLabel
            label={explanation.confidence.label}
            prefix={recommendationStrings.confidenceHeading}
          />
          <div className="flex items-end justify-between gap-[var(--space-2)]">
            <RecommendationFeedbackActions
              busy={busy}
              className="pointer-events-auto"
              onCompleted={onCompleted}
              onHidden={onHidden}
              onRemovalIntent={onRemovalIntent}
              surface="cover"
            />
            <CoverSaveToggle
              busy={busy}
              className="pointer-events-auto"
              onPlanned={onPlanned}
              planned={planned}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
