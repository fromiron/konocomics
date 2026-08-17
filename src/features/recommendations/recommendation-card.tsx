import { Link } from "@tanstack/react-router";
import { CheckIcon } from "lucide-react";
import { type Ref } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { Button } from "@/components/design-system/button";
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
  const hasExpandedReasons = remainingReasons.length > 0 || explanation.caution !== undefined;
  const hasPreviewDisclosure = hasExpandedReasons && onPreview !== undefined;
  const visibleExpandedReasons =
    explanation.caution === undefined ? remainingReasons : remainingReasons.slice(0, 1);
  return (
    <ExpandableMediaCard articleRef={articleRef} onPreview={onPreview}>
      {({ onPreviewClick }) => (
        <div className="relative isolate flex overflow-hidden [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:h-full [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:block">
          <div
            className="relative flex flex-col [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:absolute [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:inset-x-0 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:top-0 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:bottom-[var(--control-min-size)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:right-auto [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:grid [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:w-[calc((var(--control-min-size)*8)-2px)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:grid-cols-[calc(var(--featured-card-basis)-2px)_minmax(0,1fr)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:grid-rows-1 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expansion-side=left]/card:right-0 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expansion-side=left]/card:left-auto [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expansion-side=left]/card:grid-cols-[minmax(0,1fr)_calc(var(--featured-card-basis)-2px)]"
            data-expandable-content-canvas
          >
            <Link
              aria-label={recommendationStrings.openDetails(work.title)}
              className="recommendation-card__identity group/identity relative z-10 grid min-h-[var(--control-min-size)] grid-cols-[minmax(0,1fr)] content-start gap-[var(--space-content-tight)] p-[var(--space-content-tight)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:shrink-0 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:col-start-1 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:row-start-1 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:h-full [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expansion-side=left]/card:col-start-2"
              data-recommendation-identity-rail
              onClick={onPreviewClick}
              params={{ workId: work.id }}
              preload={false}
              to="/works/$workId"
            >
              <div
                className="relative z-10 overflow-hidden rounded-[var(--radius-cover)] bg-surface-2 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:w-[var(--recommendation-cover-width)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:justify-self-center"
                data-expandable-cover-frame
              >
                <CoverImage
                  className="recommendation-card__cover relative z-10 w-full aspect-[30/43] transition-transform duration-[var(--motion-duration-feedback)] ease-[var(--motion-ease-direct)] motion-reduce:transform-none motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:group-hover/identity:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:group-hover/identity:shadow-[var(--shadow-raised)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:w-[var(--recommendation-cover-width)]"
                  coverUrl={coverUrl}
                  creators={work.creators}
                  onSettled={onCoverSettled}
                  priority={priority}
                  requestedSize={400}
                  title={work.title}
                />
              </div>
              <div
                className="relative z-0 min-w-0"
                data-expandable-position-axis="block"
                data-expandable-position-part
              >
                <h2 className="line-clamp-1 break-words text-[length:var(--font-size-16)] leading-tight">
                  {work.title}
                </h2>
                <p className="mt-[var(--space-content-tight)] line-clamp-1 text-[length:var(--text-caption-size)] text-text-muted">
                  {recommendationStrings.workStatus[work.status]}
                  <span aria-hidden="true"> · </span>
                  {recommendationStrings.volumeCount(volumeCount)}
                  <span
                    className="hidden [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:inline"
                    data-expandable-reveal
                  >
                    <span aria-hidden="true"> · </span>
                    {coverStrings.creatorLine(work.creators)}
                  </span>
                </p>
                <ConfidenceLabel
                  className="mt-[var(--space-content-tight)] max-w-full overflow-hidden px-[var(--space-2)] text-ellipsis"
                  label={explanation.confidence.label}
                  prefix={recommendationStrings.confidenceHeading}
                />
                {leadReason === undefined ? (
                  <p className="mt-[var(--space-content-tight)] line-clamp-1 border-t border-line pt-[var(--space-content-tight)] text-[length:var(--text-caption-size)] text-text-muted [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:line-clamp-2">
                    {recommendationStrings.reasonUnavailable}
                  </p>
                ) : (
                  <section
                    aria-label={recommendationStrings.reasonHeading}
                    className="mt-[var(--space-content-tight)] border-t border-line pt-[var(--space-content-tight)]"
                  >
                    <p
                      className="line-clamp-1 text-[length:var(--font-size-14)] leading-[1.45] font-bold text-text-strong [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:line-clamp-3"
                      data-contribution-summary={serializeContributionSummary(leadReason)}
                    >
                      {leadReason.text}
                    </p>
                  </section>
                )}
              </div>
            </Link>

            {hasExpandedReasons ? (
              <section
                aria-label={recommendationStrings.reasonHeading}
                className="relative z-10 hidden min-h-0 overflow-hidden border-l border-line px-[var(--space-3)] py-[var(--space-2)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:col-start-2 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:row-start-1 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:flex [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:h-full [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:flex-col [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expansion-side=left]/card:col-start-1 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expansion-side=left]/card:border-r [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expansion-side=left]/card:border-l-0"
                data-expandable-reveal
                data-recommendation-evidence-summary
              >
                <div
                  className="flex min-h-[var(--space-5)] shrink-0 items-center"
                  data-recommendation-evidence-header
                >
                  <h3 className="text-[length:var(--font-size-14)] leading-tight font-bold tracking-wide text-accent">
                    {recommendationStrings.reasonHeading}
                  </h3>
                </div>
                <div
                  className="flex min-h-0 flex-1 flex-col justify-center gap-[var(--space-2)]"
                  data-recommendation-evidence-body
                >
                  {visibleExpandedReasons.length === 0 ? null : (
                    <ul className="m-0 grid min-h-0 list-none content-start gap-[var(--space-2)] overflow-hidden p-0">
                      {visibleExpandedReasons.map((reason) => (
                        <li
                          className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-[var(--space-content-tight)] text-[length:var(--font-size-14)] leading-[1.45] text-text-strong"
                          data-recommendation-evidence-support
                          key={`${reason.source}:${reason.group}:${reason.factorId}`}
                        >
                          <CheckIcon
                            aria-hidden="true"
                            className="mt-[var(--space-1)] size-3 shrink-0 text-accent"
                          />
                          <span className="line-clamp-2">{reason.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {explanation.caution === undefined ? null : (
                    <div
                      className="shrink-0 border-l-[length:var(--space-content-tight)] border-warn bg-surface-danger-soft px-[var(--space-2)] py-[var(--space-2)]"
                      data-recommendation-evidence-caution
                    >
                      <h4 className="text-[length:var(--font-size-12)] font-bold leading-tight">
                        {recommendationStrings.cautionHeading}
                      </h4>
                      <p className="mt-[var(--space-1)] line-clamp-2 text-[length:var(--font-size-14)] leading-[1.45] text-text-strong">
                        {explanation.caution.text}
                      </p>
                    </div>
                  )}
                </div>
                {hasPreviewDisclosure ? (
                  <div className="shrink-0 border-t border-line">
                    <Button
                      className="w-full shrink-0 justify-start rounded-none px-0 text-text-muted"
                      data-recommendation-evidence-disclosure
                      onClick={onPreview}
                      type="button"
                      variant="ghost"
                    >
                      <span className="text-[length:var(--font-size-12)] leading-tight font-bold">
                        {recommendationStrings.moreReasons}
                      </span>
                    </Button>
                  </div>
                ) : null}
              </section>
            ) : null}
          </div>

          <StateActionRow
            busy={busy}
            className="absolute inset-x-0 bottom-0 z-20 hidden [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:grid"
            compact
            onCompleted={onCompleted}
            onHidden={onHidden}
            onPlanned={onPlanned}
            onRemovalIntent={onRemovalIntent}
            planned={planned}
          />
        </div>
      )}
    </ExpandableMediaCard>
  );
}
