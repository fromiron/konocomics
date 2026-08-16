import Link from "next/link";
import type { KeyboardEvent, Ref } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import type { Work } from "@/domain/catalog/types";
import { generateTasteExplanation } from "@/domain/explanation/generate";
import type { TasteExplanationSentence } from "@/domain/explanation/types";
import type { RecommendationPlanEntry } from "@/domain/recommendation/types";
import { coverStrings, recommendationStrings, explanationLexicon } from "@/lib/strings";

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

export function RecommendationCard({
  articleRef,
  busy,
  coverUrl,
  entry,
  onCompleted,
  onCoverSettled,
  onHidden,
  onPlanned,
  onRemovalIntent,
  planned,
  priority,
  resolveTitle,
  volumeCount,
  work,
}: RecommendationCardProps) {
  const explanation = generateTasteExplanation({
    contributions: entry.contributions,
    confidenceLevel: entry.confidenceLevel,
    lexicon: explanationLexicon,
    resolveTitle,
  });
  const leadReason = explanation.positiveReasons[0];
  const remainingReasons = explanation.positiveReasons.slice(1, 3);
  const prepareKeyboardRemoval = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!busy && (event.key === "Enter" || event.key === " ")) onRemovalIntent();
  };

  return (
    <article className="recommendation-card surface-card" ref={articleRef} tabIndex={-1}>
      <Link
        aria-label={recommendationStrings.openDetails(work.title)}
        className="recommendation-card__identity"
        href={`/works/${work.id}`}
        prefetch={false}
      >
        <CoverImage
          className="recommendation-card__cover"
          coverUrl={coverUrl}
          creators={work.creators}
          onSettled={onCoverSettled}
          priority={priority}
          requestedSize={400}
          title={work.title}
        />
        <div className="recommendation-card__copy">
          <h2>{work.title}</h2>
          <p className="recommendation-card__creator">{coverStrings.creatorLine(work.creators)}</p>
          <p className="recommendation-card__metadata">
            {recommendationStrings.workStatus[work.status]}
            <span aria-hidden="true"> · </span>
            {recommendationStrings.volumeCount(volumeCount)}
          </p>
          {leadReason === undefined ? (
            <p className="recommendation-card__reason-unavailable">
              {recommendationStrings.reasonUnavailable}
            </p>
          ) : (
            <section
              aria-label={recommendationStrings.reasonHeading}
              className="recommendation-card__reason"
            >
              <p data-contribution-summary={serializeContributionSummary(leadReason)}>
                {leadReason.text}
              </p>
            </section>
          )}
        </div>
      </Link>

      <details className="recommendation-card__details">
        <summary>{recommendationStrings.moreReasons}</summary>
        <div className="recommendation-card__details-content">
          {remainingReasons.length === 0 ? null : (
            <ul>
              {remainingReasons.map((reason) => (
                <li key={`${reason.source}:${reason.group}:${reason.factorId}`}>{reason.text}</li>
              ))}
            </ul>
          )}
          {explanation.caution === undefined ? null : (
            <div className="recommendation-card__caution">
              <h3>{recommendationStrings.cautionHeading}</h3>
              <p>{explanation.caution.text}</p>
            </div>
          )}
          <p className="recommendation-card__confidence">
            {recommendationStrings.confidenceHeading}: {explanation.confidence.label}
          </p>
        </div>
      </details>

      <div className="recommendation-card__actions">
        <button
          aria-pressed={planned}
          className="recommendation-card__primary interactive-press"
          disabled={busy}
          onClick={onPlanned}
          type="button"
        >
          <span>{recommendationStrings.actions.planned}</span>
          {planned ? (
            <span aria-hidden="true" className="recommendation-card__confirmation">
              {recommendationStrings.actions.plannedConfirmation}
            </span>
          ) : null}
        </button>
        <button
          className="interactive-press"
          data-recommendation-action="completed"
          disabled={busy}
          onClick={() => {
            onRemovalIntent();
            onCompleted();
          }}
          onKeyDown={prepareKeyboardRemoval}
          onPointerDown={busy ? undefined : onRemovalIntent}
          type="button"
        >
          {recommendationStrings.actions.completed}
        </button>
        <button
          className="interactive-press"
          data-recommendation-action="hidden"
          disabled={busy}
          onClick={() => {
            onRemovalIntent();
            onHidden();
          }}
          onKeyDown={prepareKeyboardRemoval}
          onPointerDown={busy ? undefined : onRemovalIntent}
          type="button"
        >
          {recommendationStrings.actions.hidden}
        </button>
      </div>
    </article>
  );
}
