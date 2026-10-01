import { Link } from "@tanstack/react-router";
import { ScanSearchIcon } from "lucide-react";

import { CoverImage } from "@/components/cover/CoverImage";
import { DiscoveryCard } from "@/components/media/discovery-card";
import { ReasonBubble } from "@/components/media/reason-bubble";
import { ExpandableMediaCard } from "@/components/media/expandable-media-card";
import { QuietTextAction, StateActionRow } from "@/components/media/state-action-row";
import type { Work } from "@/domain/catalog/types";
import { generateTasteExplanation } from "@/domain/explanation/generate";
import type { RecommendationPlanEntry } from "@/domain/recommendation/types";
import { explanationLexicon, mediaStrings, recommendationStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

type RecommendationShelfCardProps = Readonly<{
  busy: boolean;
  entry: RecommendationPlanEntry;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  work: Work;
  coverUrl?: string | null;
  itemCaption?: string;
  priority?: boolean;
  variant: "anchor" | "factor" | "discovery";
  resolveTitle: (workId: string) => string | undefined;
  planned: boolean;
  onCompleted: () => void;
  onHidden: () => void;
  onPlanned: () => void;
  onDismissForToday?: () => void;
  onPreview: () => void;
  onCoverVisible?: () => void;
}>;

export function RecommendationShelfCard({
  busy,
  coverUrl,
  entry,
  expanded = false,
  itemCaption,
  onCompleted,
  onExpandedChange,
  onCoverVisible,
  onDismissForToday,
  onHidden,
  onPlanned,
  onPreview,
  planned,
  priority = false,
  resolveTitle,
  variant,
  work,
}: RecommendationShelfCardProps) {
  const explanation = generateTasteExplanation({
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
  const anchorMention = anchorTitle ?? "";
  const anchorMentionIndex = anchorMention === "" ? -1 : leadReason.indexOf(anchorMention);
  const compact = variant === "discovery";
  const previewControl = (
    <QuietTextAction
      aria-label={recommendationStrings.quickPreview.open(work.title)}
      className={cn("gap-[var(--space-1)] px-0 whitespace-nowrap", compact && "mt-auto self-start")}
      onClick={onPreview}
    >
      <ScanSearchIcon aria-hidden="true" className="size-4" />
      {recommendationStrings.quickPreview.openLabel}
    </QuietTextAction>
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

  const identityLinkClassName =
    "min-h-[var(--control-min-size)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring";
  const titleClassName =
    "line-clamp-2 text-[length:var(--font-size-14)] leading-tight font-bold text-text-strong min-h-[2.5em]";

  const cardClassName = cn(
    "group/shelf-card shrink-0 snap-start overflow-hidden rounded-[var(--radius-card)] border border-transparent bg-transparent focus-within:bg-surface-2 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-2",
    "data-[expanded=true]:bg-surface-2",
    "w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/2.4)] max-w-44 sm:w-32 md:w-[calc((100%-var(--space-content-loose)*7)/8)] md:min-w-28 md:max-w-32",
  );
  const content = (
    <>
      <Link
        aria-label={mediaStrings.openDetails(work.title)}
        className={cn(identityLinkClassName, "relative !grid gap-[var(--space-2)]")}
        params={{ workId: work.id }}
        preload={false}
        to="/works/$workId"
      >
        <CoverImage
          className="aspect-[30/43] w-full overflow-hidden rounded-[var(--radius-cover)] border border-transparent bg-transparent"
          coverUrl={coverUrl}
          creators={work.creators}
          fit="cover-square"
          onVisible={onCoverVisible}
          priority={priority}
          requestedSize={400}
          title={work.title}
        />
        <h3 className={titleClassName}>{work.title}</h3>
      </Link>
      <div className="[@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:hidden">
        {previewControl}
      </div>
    </>
  );

  return (
    <ExpandableMediaCard
      className={cardClassName}
      data-lead-anchor-work-ids={leadSentence?.anchorWorkIds.join(" ")}
      data-recommendation-shelf-card={variant}
      expanded={expanded}
      id={`recommendation-shelf-work-${work.id}`}
      onExpandedChange={(next) => onExpandedChange?.(next)}
      panel={
        <div className="flex h-full flex-col gap-[var(--space-2)]">
          <div className="grid min-h-0 flex-1 content-start gap-[var(--space-2)] overflow-y-auto overscroll-contain">
            <ReasonBubble tail="side">
              <p
                className="text-[length:var(--font-size-14)] leading-[var(--line-height-body)] text-text"
                data-contribution-summary={JSON.stringify(leadSentence ?? null)}
              >
                {anchorMentionIndex < 0 ? (
                  leadReason
                ) : (
                  <>
                    {leadReason.slice(0, anchorMentionIndex)}
                    <strong className="font-bold text-text-strong">{anchorMention}</strong>
                    {leadReason.slice(anchorMentionIndex + anchorMention.length)}
                  </>
                )}
              </p>
            </ReasonBubble>
            {itemCaption ? (
              <p className="line-clamp-3 text-[length:var(--text-caption-size)] leading-[var(--line-height-body)] text-text-muted">
                {itemCaption}
              </p>
            ) : null}
          </div>
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
        </div>
      }
    >
      <div className="p-[var(--space-2)] md:py-[var(--space-3)]">{content}</div>
    </ExpandableMediaCard>
  );
}
