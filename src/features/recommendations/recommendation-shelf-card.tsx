import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { DiscoveryCard } from "@/components/media/discovery-card";
import { ExpandPanel } from "@/components/media/expand-panel";
import {
  EXPAND_CARD_IDENTITY_LINK_CLASSNAME,
  EXPAND_CARD_SURFACE_CLASSNAME,
  ExpandCardPreviewSlot,
  ExpandShelfCard,
  QuickPreviewControl,
} from "@/components/media/expand-shelf-card";
import { ExpandableMediaCard } from "@/components/media/expandable-media-card";
import { LeadReasonText } from "@/components/media/lead-reason-text";
import { RankingCardBody, rankingCardLinkLabel } from "@/components/media/ranking-card";
import { StateActionRow } from "@/components/media/state-action-row";
import type { Work } from "@/domain/catalog/types";
import { generateTasteExplanation } from "@/domain/explanation/generate";
import type { TasteRecommendationExplanation } from "@/domain/explanation/types";
import type { RecommendationPlanEntry } from "@/domain/recommendation/types";
import { explanationLexicon, recommendationStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

type RecommendationShelfCardProps = Readonly<{
  busy: boolean;
  entry: RecommendationPlanEntry;
  explanation?: TasteRecommendationExplanation;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  work: Work;
  coverUrl?: string | null;
  itemCaption?: string;
  priority?: boolean;
  resolveTitle: (workId: string) => string | undefined;
  planned: boolean;
  onCompleted: () => void;
  onHidden: () => void;
  onPlanned: () => void;
  onDismissForToday?: () => void;
  onPreview: () => void;
  onCoverVisible?: () => void;
}> &
  (
    | Readonly<{
        variant: "anchor" | "factor" | "discovery";
        rank?: never;
        metadata?: never;
        metadataAccessibleLabel?: never;
      }>
    | Readonly<{
        /** Ranks 11-20: the ranking card at rest, opening the same panel as the lens cards. */
        variant: "ranking";
        rank: number;
        metadata?: ReactNode;
        metadataAccessibleLabel?: string;
      }>
  );

/** DOM id of a ranks 11-20 card; the same work can also have a lens shelf card. */
export function rankingShelfCardId(workId: string) {
  return `recommendation-ranking-work-${workId}`;
}

export function RecommendationShelfCard({
  busy,
  coverUrl,
  entry,
  explanation: suppliedExplanation,
  expanded = false,
  itemCaption,
  metadata,
  metadataAccessibleLabel,
  onCompleted,
  onExpandedChange,
  onCoverVisible,
  onDismissForToday,
  onHidden,
  onPlanned,
  onPreview,
  planned,
  priority = false,
  rank,
  resolveTitle,
  variant,
  work,
}: RecommendationShelfCardProps) {
  const explanation =
    suppliedExplanation ??
    generateTasteExplanation({
      contributions: entry.contributions,
      confidenceLevel: entry.confidenceLevel,
      lexicon: explanationLexicon,
      resolveTitle,
    });
  const leadSentence = explanation.positiveReasons[0];
  const leadReason = leadSentence?.text ?? recommendationStrings.reasonUnavailable;
  const anchorTitle =
    leadSentence?.source === "similarity"
      ? leadSentence.anchorWorkIds
          .map(resolveTitle)
          .find((title) => title !== undefined && title !== "")
      : undefined;
  const anchorIndex = anchorTitle === undefined ? -1 : leadReason.indexOf(anchorTitle);
  const compact = variant === "discovery";
  // Where the card cannot expand, Quick Preview is the way to the same reason and actions.
  const previewControl = (
    <QuickPreviewControl
      className={compact ? "mt-auto self-start" : undefined}
      onClick={onPreview}
      title={work.title}
    />
  );
  if (compact) {
    return (
      <DiscoveryCard
        action={previewControl}
        coverUrl={coverUrl}
        creators={work.creators}
        id={`recommendation-shelf-work-${work.id}`}
        marker="discovery"
        onCoverVisible={onCoverVisible}
        priority={priority}
        reason={leadReason}
        title={work.title}
        workId={work.id}
      />
    );
  }

  const cardProps = {
    "data-lead-anchor-work-ids": leadSentence?.anchorWorkIds.join(" "),
    "data-recommendation-shelf-card": variant,
    expanded,
    onExpandedChange: (next: boolean) => onExpandedChange?.(next),
    panel: (
      <ExpandPanel
        actions={
          <StateActionRow
            busy={busy}
            className="shrink-0 flex-wrap sm:justify-start"
            dismissForTodayLabel={recommendationStrings.mood.dismissLabel(work.title)}
            onCompleted={onCompleted}
            onDismissForToday={onDismissForToday}
            onHidden={onHidden}
            onPlanned={onPlanned}
            planned={planned}
          />
        }
        caption={itemCaption}
        reason={
          <LeadReasonText
            anchorIndex={anchorIndex}
            anchorTitle={anchorTitle}
            strongClassName="font-bold text-text-strong"
            text={leadReason}
          />
        }
        reasonData={{ "data-contribution-summary": JSON.stringify(leadSentence ?? null) }}
      />
    ),
  };

  if (variant === "ranking") {
    // The list item only holds the place in the ordered list; the article owns the width, so
    // it can widen and push its neighbours along.
    return (
      <li
        className="shrink-0 snap-start"
        data-ranking-kind="personalized-ranking"
        data-ranking-position={rank}
      >
        <ExpandableMediaCard
          {...cardProps}
          className={cn(EXPAND_CARD_SURFACE_CLASSNAME, "h-full w-44")}
          id={rankingShelfCardId(work.id)}
        >
          <div className="p-[var(--space-3)]">
            <Link
              aria-label={rankingCardLinkLabel({
                metadataAccessibleLabel,
                position: rank,
                rankingKind: "personalized-ranking",
                title: work.title,
              })}
              className={cn(
                EXPAND_CARD_IDENTITY_LINK_CLASSNAME,
                "ranking-card-link relative grid content-start gap-[var(--space-2)]",
              )}
              params={{ workId: work.id }}
              preload={false}
              to="/works/$workId"
            >
              <RankingCardBody
                coverUrl={coverUrl}
                creators={work.creators}
                metadata={metadata}
                onCoverVisible={onCoverVisible}
                position={rank}
                priority={priority}
                title={work.title}
                variant="ranking"
              />
            </Link>
            <ExpandCardPreviewSlot>{previewControl}</ExpandCardPreviewSlot>
          </div>
        </ExpandableMediaCard>
      </li>
    );
  }

  return (
    <ExpandShelfCard
      {...cardProps}
      coverUrl={coverUrl}
      creators={work.creators}
      id={`recommendation-shelf-work-${work.id}`}
      onCoverVisible={onCoverVisible}
      preview={previewControl}
      priority={priority}
      title={work.title}
      workId={work.id}
    />
  );
}
