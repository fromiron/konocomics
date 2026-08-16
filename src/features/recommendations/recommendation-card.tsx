import { Link } from "@tanstack/react-router";
import { type Ref } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { ExpandableMediaCard } from "@/components/media/expandable-media-card";
import { ConfidenceLabel } from "@/components/media/recommendation-evidence";
import { StateActionRow } from "@/components/media/state-action-row";
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
  const explanation = generateTasteExplanation({
    contributions: entry.contributions,
    confidenceLevel: entry.confidenceLevel,
    lexicon: explanationLexicon,
    resolveTitle,
  });
  const leadReason = explanation.positiveReasons[0];
  const remainingReasons = explanation.positiveReasons.slice(1, 3);
  return (
    <ExpandableMediaCard articleRef={articleRef} onPreview={onPreview}>
      {({ expanded, onDetailsToggle, onPreviewClick }) => (
        <>
          <Link
            aria-label={recommendationStrings.openDetails(work.title)}
            className="recommendation-card__identity group/identity grid min-h-[var(--control-min-size)] grid-cols-[minmax(0,1fr)] gap-[var(--space-content)] p-[var(--space-content)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:grid-cols-[var(--recommendation-cover-width)_minmax(0,1fr)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:gap-[var(--space-4)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:p-[var(--space-4)]"
            onClick={onPreviewClick}
            params={{ workId: work.id }}
            preload={false}
            to="/works/$workId"
          >
            <CoverImage
              className="recommendation-card__cover w-full aspect-[30/43] transition-transform duration-[var(--motion-duration-feedback)] ease-[var(--motion-ease-direct)] motion-reduce:transform-none motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/identity:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:group-hover/identity:shadow-[var(--shadow-raised)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:w-[var(--recommendation-cover-width)]"
              coverUrl={coverUrl}
              creators={work.creators}
              onSettled={onCoverSettled}
              priority={priority}
              requestedSize={400}
              title={work.title}
            />
            <div className="min-w-0">
              <h2 className="line-clamp-2 break-words [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:line-clamp-none">
                {work.title}
              </h2>
              <p className="mt-[var(--space-content-tight)] line-clamp-1 text-[length:var(--text-caption-size)] text-text-muted [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:line-clamp-none">
                {coverStrings.creatorLine(work.creators)}
              </p>
              <p className="mt-[var(--space-content-tight)] line-clamp-1 text-[length:var(--text-caption-size)] text-text-muted [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:line-clamp-none">
                {recommendationStrings.workStatus[work.status]}
                <span aria-hidden="true"> · </span>
                {recommendationStrings.volumeCount(volumeCount)}
              </p>
              {leadReason === undefined ? (
                <p className="mt-[var(--space-content)] line-clamp-2 border-t border-line pt-[var(--space-content)] text-[length:var(--text-caption-size)] text-text-muted [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:line-clamp-none">
                  {recommendationStrings.reasonUnavailable}
                </p>
              ) : (
                <section
                  aria-label={recommendationStrings.reasonHeading}
                  className="mt-[var(--space-content)] line-clamp-2 border-t border-line pt-[var(--space-content)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:line-clamp-none"
                >
                  <p
                    className="font-bold leading-[1.55] text-text-strong"
                    data-contribution-summary={serializeContributionSummary(leadReason)}
                  >
                    {leadReason.text}
                  </p>
                </section>
              )}
            </div>
          </Link>

          <details
            className="hidden border-t border-line [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:block"
            onToggle={onDetailsToggle}
            open={expanded}
          >
            <summary
              className="flex min-h-[var(--control-min-size)] cursor-pointer items-center px-[var(--space-4)] font-bold text-accent"
              onClick={onPreviewClick}
            >
              {recommendationStrings.moreReasons}
            </summary>
            <div className="grid gap-[var(--space-3)] px-[var(--space-4)] pb-[var(--space-4)]">
              {remainingReasons.length === 0 ? null : (
                <ul className="m-0 grid gap-[var(--space-content)] pl-[var(--space-5)]">
                  {remainingReasons.map((reason) => (
                    <li key={`${reason.source}:${reason.group}:${reason.factorId}`}>
                      {reason.text}
                    </li>
                  ))}
                </ul>
              )}
              {explanation.caution === undefined ? null : (
                <div className="border-l-[length:var(--space-content-tight)] border-warn bg-surface-danger-soft p-[var(--space-3)]">
                  <h3 className="mb-[var(--space-content-tight)] text-[length:var(--font-size-14)]">
                    {recommendationStrings.cautionHeading}
                  </h3>
                  <p>{explanation.caution.text}</p>
                </div>
              )}
              <ConfidenceLabel
                label={explanation.confidence.label}
                prefix={recommendationStrings.confidenceHeading}
              />
            </div>
          </details>

          <StateActionRow
            busy={busy}
            className="hidden [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:grid"
            compact
            onCompleted={onCompleted}
            onHidden={onHidden}
            onPlanned={onPlanned}
            onRemovalIntent={onRemovalIntent}
            planned={planned}
          />
        </>
      )}
    </ExpandableMediaCard>
  );
}
