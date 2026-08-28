import { Link } from "@tanstack/react-router";
import { CheckIcon, XIcon } from "lucide-react";
import { type Ref } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { Button } from "@/components/design-system/button";
import { ExpandableMediaCard } from "@/components/media/expandable-media-card";
import { ConfidenceLabel } from "@/components/media/recommendation-evidence";
import { StateActionRow } from "@/components/media/state-action-row";
import type { Work } from "@/domain/catalog/types";
import { generateTasteExplanation } from "@/domain/explanation/generate";
import type {
  TasteExplanationSentence,
  TasteRecommendationExplanation,
} from "@/domain/explanation/types";
import type { RecommendationPlanEntry } from "@/domain/recommendation/types";
import { coverStrings, explanationLexicon, recommendationStrings } from "@/lib/strings";

type RecommendationCardProps = Readonly<{
  entry: RecommendationPlanEntry;
  work: Work;
  position: number;
  volumeCount: number;
  resolveTitle: (workId: string) => string | undefined;
  planned: boolean;
  expanded: boolean;
  selected: boolean;
  detailOpen: boolean;
  busy: boolean;
  priority: boolean;
  coverUrl?: string | null;
  articleRef: Ref<HTMLElement>;
  onSelect: () => void;
  onExpansionChange: (expanded: boolean) => void;
  onPlanned: () => void;
  onCompleted: () => void;
  onHidden: () => void;
  onRemovalIntent: () => void;
  onPreview?: () => void;
  onCoverSettled?: () => void;
}>;

type RecommendationDetailPanelProps = Readonly<{
  entry: RecommendationPlanEntry;
  work: Work;
  volumeCount: number;
  resolveTitle: (workId: string) => string | undefined;
  planned: boolean;
  busy: boolean;
  coverUrl?: string | null;
  onClose: () => void;
  onPlanned: () => void;
  onCompleted: () => void;
  onHidden: () => void;
  onRemovalIntent: () => void;
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

function RecommendationCardCopy({
  explanation,
  volumeCount,
  work,
}: Readonly<{
  explanation: TasteRecommendationExplanation;
  volumeCount: number;
  work: Work;
}>) {
  const leadReason = explanation.positiveReasons[0];
  return (
    <div
      className="recommendation-card__copy relative z-10 grid min-w-0 content-end gap-[var(--space-content-tight)] p-[var(--space-3)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:h-full [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:w-[70%] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:content-end [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:bg-gradient-to-r [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:from-canvas/85 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:via-canvas/60 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:to-transparent [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:w-[54%] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:content-center [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:p-[var(--space-4)]"
      data-expandable-position-axis="block"
      data-expandable-position-part
    >
      <p className="line-clamp-1 text-[length:var(--text-caption-size)] font-medium text-text-muted">
        {recommendationStrings.workStatus[work.status]}
        <span aria-hidden="true"> · </span>
        {recommendationStrings.volumeCount(volumeCount)}
      </p>
      <h3 className="line-clamp-2 text-[length:var(--font-size-14)] leading-tight font-bold text-text-strong [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:text-[length:var(--font-size-16)]">
        {work.title}
      </h3>
      <ConfidenceLabel
        className="max-w-full overflow-hidden px-[var(--space-2)] text-ellipsis"
        label={explanation.confidence.label}
        prefix={recommendationStrings.confidenceHeading}
      />
      {leadReason === undefined ? (
        <p className="hidden line-clamp-2 border-t border-line/70 pt-[var(--space-content-tight)] text-[length:var(--font-size-12)] leading-[1.45] text-text-muted [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:block">
          {recommendationStrings.reasonUnavailable}
        </p>
      ) : (
        <p
          className="hidden line-clamp-2 border-l-2 border-line pl-[var(--space-2)] text-[length:var(--font-size-12)] font-medium leading-[1.45] text-text-strong [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:block"
          data-contribution-summary={serializeContributionSummary(leadReason)}
          data-recommendation-evidence-summary
        >
          {leadReason.text}
        </p>
      )}
    </div>
  );
}

export function RecommendationCard({
  articleRef,
  busy,
  coverUrl,
  detailOpen,
  entry,
  expanded,
  onCompleted,
  onCoverSettled,
  onHidden,
  onExpansionChange,
  onPlanned,
  onPreview,
  onRemovalIntent,
  onSelect,
  planned,
  position,
  priority,
  resolveTitle,
  selected,
  volumeCount,
  work,
}: RecommendationCardProps) {
  const explanation = explanationFor(entry, resolveTitle);

  return (
    <ExpandableMediaCard
      articleRef={articleRef}
      expanded={expanded}
      initiallyExpanded={priority}
      onExpandedChange={(expanded) => {
        onExpansionChange(expanded);
        if (expanded) onSelect();
      }}
      onPreview={onPreview}
    >
      {({ onPreviewClick }) => (
        <div
          className="relative isolate h-full overflow-hidden bg-surface-1"
          data-personalized-recommendation-card={work.id}
          data-selected={selected ? "true" : "false"}
        >
          <Link
            aria-label={recommendationStrings.openDetails(work.title)}
            className="recommendation-card__identity relative grid w-full min-w-0 cursor-pointer overflow-hidden bg-cover-paper text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:h-[calc(100%-var(--control-min-size))] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:grid-cols-1"
            data-recommendation-select
            onClick={onPreviewClick}
            params={{ workId: work.id }}
            preload={false}
            to="/works/$workId"
          >
            <CoverImage
              className="recommendation-card__backdrop pointer-events-none absolute inset-0 hidden !h-full !max-h-none !rounded-none !border-0 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:grid [&_.cover-image__hero-blur]:opacity-70 [&_.cover-image__hero-frame]:hidden [&_.cover-image__hero-paper]:opacity-35"
              coverUrl={coverUrl}
              creators={work.creators}
              decorative
              requestedSize={400}
              title={work.title}
              variant="hero"
            />
            <span
              aria-label={recommendationStrings.showcase.rank(position)}
              className="absolute top-[var(--space-2)] left-[var(--space-2)] z-20 grid size-[var(--space-7)] place-items-center rounded-[var(--radius-cover)] bg-accent text-[length:var(--font-size-14)] font-black text-on-accent"
              role="img"
            >
              {position}
            </span>
            <span
              className="recommendation-card__cover-frame relative block aspect-[30/43] w-full overflow-hidden [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:absolute [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:inset-y-0 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:right-0 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:aspect-auto [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:w-[48%] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:w-[50%]"
              data-expandable-cover-frame
            >
              <CoverImage
                className="recommendation-card__cover !h-full !max-h-none w-full rounded-none border-0"
                coverUrl={coverUrl}
                creators={work.creators}
                onSettled={onCoverSettled}
                priority={priority}
                requestedSize={400}
                title={work.title}
              />
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/95 via-canvas/55 to-transparent [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:bg-gradient-to-r [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:from-canvas/75 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:via-canvas/20 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:to-transparent"
            />
            <RecommendationCardCopy
              explanation={explanation}
              volumeCount={volumeCount}
              work={work}
            />
          </Link>
          <Button
            aria-controls={
              selected && detailOpen ? "personalized-recommendation-detail" : undefined
            }
            aria-expanded={selected && detailOpen}
            aria-label={recommendationStrings.showcase.select(position, work.title)}
            className="absolute top-[var(--space-2)] left-[calc(var(--space-7)+var(--space-3))] z-30 hidden min-h-[var(--control-min-size)] border-0 bg-transparent px-0 text-[length:var(--text-caption-size)] font-bold text-accent hover:bg-transparent [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:inline-flex"
            data-recommendation-detail-trigger
            onClick={onSelect}
            type="button"
            variant="outline"
          >
            <span className="rounded-[var(--radius-cover)] border border-line-accent-subtle bg-accent-soft px-[var(--space-2)] py-[var(--space-1)]">
              {recommendationStrings.reasonHeading}
            </span>
          </Button>
          <StateActionRow
            busy={busy}
            className="relative z-20"
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

export function RecommendationDetailPanel({
  busy,
  coverUrl,
  entry,
  onClose,
  onCompleted,
  onHidden,
  onPlanned,
  onRemovalIntent,
  planned,
  resolveTitle,
  volumeCount,
  work,
}: RecommendationDetailPanelProps) {
  const explanation = explanationFor(entry, resolveTitle);
  const leadReason = explanation.positiveReasons[0];
  const reasons = explanation.positiveReasons.slice(1, 4);

  return (
    <section
      aria-labelledby="personalized-recommendation-detail-title"
      className="relative isolate hidden overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-1 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:block"
      data-personalized-recommendation-detail={work.id}
      id="personalized-recommendation-detail"
    >
      <div className="relative grid min-h-[calc(var(--control-min-size)*4.5)] grid-cols-[8rem_minmax(13rem,1.15fr)_minmax(13rem,1fr)]">
        <Button
          aria-label={recommendationStrings.showcase.close}
          className="absolute top-[var(--space-2)] right-[var(--space-2)] z-30 rounded-[var(--radius-pill)] border border-line bg-surface-1 hover:bg-surface-2"
          onClick={onClose}
          size="icon"
          type="button"
          variant="ghost"
        >
          <XIcon aria-hidden="true" className="size-4" />
        </Button>

        <div className="grid place-items-center border-r border-line/80 bg-surface-1 p-[var(--space-3)]">
          <CoverImage
            className="w-24 max-w-24 aspect-[30/43] overflow-hidden rounded-[var(--radius-cover)] border border-line"
            coverUrl={coverUrl}
            creators={work.creators}
            requestedSize={400}
            title={work.title}
          />
        </div>

        <div className="grid min-w-0 content-center gap-[var(--space-2)] border-r border-line/80 bg-surface-1 p-[var(--space-4)]">
          <p className="line-clamp-1 text-[length:var(--text-caption-size)] text-text-muted">
            {coverStrings.creatorLine(work.creators)}
            <span aria-hidden="true"> · </span>
            {recommendationStrings.workStatus[work.status]}
            <span aria-hidden="true"> · </span>
            {recommendationStrings.volumeCount(volumeCount)}
          </p>
          <Link
            className="w-fit text-[length:var(--font-size-22)] leading-tight font-black text-text-strong hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            id="personalized-recommendation-detail-title"
            params={{ workId: work.id }}
            preload={false}
            to="/works/$workId"
          >
            {work.title}
          </Link>
          <ConfidenceLabel
            label={explanation.confidence.label}
            prefix={recommendationStrings.confidenceHeading}
          />
          <p
            className="line-clamp-2 text-[length:var(--font-size-14)] leading-[1.5] font-medium text-text"
            data-contribution-summary={
              leadReason === undefined ? undefined : serializeContributionSummary(leadReason)
            }
          >
            {leadReason?.text ?? recommendationStrings.reasonUnavailable}
          </p>
          <StateActionRow
            busy={busy}
            className="!gap-[var(--space-content-tight)]"
            onCompleted={onCompleted}
            onHidden={onHidden}
            onPlanned={onPlanned}
            onRemovalIntent={onRemovalIntent}
            planned={planned}
          />
        </div>

        <div className="grid min-w-0 content-center gap-[var(--space-2)] bg-surface-1 p-[var(--space-4)] pr-[var(--space-8)]">
          <h3 className="text-[length:var(--font-size-14)] font-bold tracking-wide text-text-strong">
            {recommendationStrings.showcase.points}
          </h3>
          {reasons.length === 0 ? (
            <p className="text-[length:var(--font-size-14)] text-text-muted">
              {recommendationStrings.reasonUnavailable}
            </p>
          ) : (
            <ul className="m-0 grid list-none gap-[var(--space-content-tight)] p-0">
              {reasons.map((reason) => (
                <li
                  className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-[var(--space-2)] text-[length:var(--font-size-12)] leading-[1.45] text-text-strong"
                  data-contribution-summary={serializeContributionSummary(reason)}
                  data-recommendation-evidence-support
                  key={`${reason.source}:${reason.group}:${reason.factorId}`}
                >
                  <CheckIcon
                    aria-hidden="true"
                    className="mt-[var(--space-1)] size-3.5 shrink-0 text-text-muted"
                  />
                  <span className="line-clamp-2">{reason.text}</span>
                </li>
              ))}
            </ul>
          )}
          {explanation.caution === undefined ? null : (
            <div
              className="border-l-[length:var(--space-content-tight)] border-warn bg-surface-danger-soft px-[var(--space-3)] py-[var(--space-2)]"
              data-recommendation-evidence-caution
            >
              <h4 className="text-[length:var(--font-size-12)] font-bold text-warn">
                {recommendationStrings.cautionHeading}
              </h4>
              <p className="mt-[var(--space-1)] line-clamp-2 text-[length:var(--text-caption-size)] leading-[1.4] text-text">
                {explanation.caution.text}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
