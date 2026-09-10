import { Link } from "@tanstack/react-router";
import { ScanSearchIcon } from "lucide-react";

import { CoverImage } from "@/components/cover/CoverImage";
import { ExpandableMediaCard } from "@/components/media/expandable-media-card";
import { QuietTextAction } from "@/components/media/state-action-row";
import type { Work } from "@/domain/catalog/types";
import { generateTasteExplanation } from "@/domain/explanation/generate";
import type { RecommendationPlanEntry } from "@/domain/recommendation/types";
import { explanationLexicon, mediaStrings, recommendationStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

type RecommendationShelfCardProps = Readonly<{
  entry: RecommendationPlanEntry;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  work: Work;
  coverUrl?: string | null;
  priority?: boolean;
  volumeCount: number;
  variant: "anchor" | "discovery" | "completed";
  resolveTitle: (workId: string) => string | undefined;
  onPreview: () => void;
  onCoverVisible?: () => void;
}>;

export function RecommendationShelfCard({
  coverUrl,
  entry,
  expanded = false,
  onExpandedChange,
  onCoverVisible,
  onPreview,
  priority = false,
  resolveTitle,
  variant,
  volumeCount,
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
  const confidenceLabel = explanationLexicon.confidenceLabels[entry.confidenceLevel];
  const compact = variant !== "anchor";
  const morphDiscoveryCover = variant === "discovery" && Boolean(coverUrl?.trim());
  const widthClass =
    variant === "anchor"
      ? "w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/2.4)] max-w-44 sm:w-32 md:w-[calc((100%-var(--space-content-loose)*7)/8)] md:min-w-24 md:max-w-28"
      : "w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/1.8)] max-w-72 sm:w-64 md:w-[calc((100%-var(--space-content-loose)*4)/5)] md:min-w-60";
  const previewControl = (
    <QuietTextAction
      aria-label={recommendationStrings.quickPreview.open(work.title)}
      className={cn("gap-[var(--space-1)] whitespace-nowrap", compact && "mt-auto self-start px-0")}
      onClick={onPreview}
    >
      <ScanSearchIcon aria-hidden="true" className="size-4" />
      {recommendationStrings.quickPreview.openLabel}
    </QuietTextAction>
  );
  const identityLinkClassName =
    "min-h-[var(--control-min-size)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring";
  const titleClassName = cn(
    "line-clamp-2 text-[length:var(--font-size-14)] leading-tight font-bold text-text-strong",
    variant === "anchor" &&
      "group-focus-within/shelf-card:text-accent [@media(hover:hover)_and_(pointer:fine)]:group-hover/shelf-card:text-accent",
  );

  const cardClassName = cn(
    "group/shelf-card shrink-0 snap-start overflow-hidden rounded-[var(--radius-card)] border",
    variant === "anchor"
      ? "border-line/80 bg-surface-1 focus-within:border-line-accent"
      : "border-transparent bg-transparent transition-colors duration-[var(--motion-duration-value)] ease-[var(--motion-ease-direct)] focus-within:bg-surface-2 motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-2",
    widthClass,
    compact &&
      "grid grid-rows-[auto_minmax(0,1fr)] gap-[var(--space-2)] p-[var(--space-2)] md:grid-cols-[auto_minmax(0,1fr)] md:grid-rows-1 md:items-stretch md:py-[var(--space-3)]",
  );
  const content = (
    <>
      <Link
        aria-label={mediaStrings.openDetails(work.title)}
        className={cn(
          identityLinkClassName,
          compact && "min-h-0 md:h-full md:w-auto md:aspect-[30/43]",
          variant === "anchor" && "relative !block",
        )}
        params={{ workId: work.id }}
        preload={false}
        to="/works/$workId"
      >
        <CoverImage
          className={cn(
            "aspect-[30/43] w-full overflow-hidden rounded-[var(--radius-cover)] border border-line/60",
            compact && "md:h-full md:w-full",
            morphDiscoveryCover &&
              "border-transparent [clip-path:inset(15.116279%_0_round_50%_/_34.883721%)] transition-[clip-path] duration-[var(--motion-duration-value)] ease-linear group-focus-within/shelf-card:[clip-path:inset(0_round_var(--radius-cover))] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/shelf-card:[clip-path:inset(0_round_var(--radius-cover))]",
          )}
          coverUrl={coverUrl}
          creators={work.creators}
          fit={morphDiscoveryCover ? "cover" : "contain"}
          matchSourceAspectRatio
          onVisible={onCoverVisible}
          priority={priority}
          requestedSize={400}
          title={work.title}
        />
        {compact ? null : (
          <div className="absolute inset-x-0 bottom-0 z-10 grid gap-[var(--space-1)] bg-gradient-to-t from-canvas via-canvas/85 to-transparent p-[var(--space-2)] pt-[var(--space-6)]">
            <h3 className={titleClassName}>{work.title}</h3>
            <p className="text-[length:var(--text-caption-size)] leading-tight font-bold text-accent">
              {confidenceLabel}
            </p>
          </div>
        )}
      </Link>
      {compact ? (
        <div className="flex h-full min-h-0 min-w-0 flex-col gap-[var(--space-1)]">
          <Link
            className={cn(identityLinkClassName, "min-w-0")}
            params={{ workId: work.id }}
            preload={false}
            to="/works/$workId"
          >
            <h3 className={titleClassName}>{work.title}</h3>
          </Link>
          {variant === "completed" ? (
            <p className="hidden text-[length:var(--text-caption-size)] font-medium text-text-muted md:line-clamp-1">
              {recommendationStrings.workStatus.completed}
              <span aria-hidden="true"> · </span>
              {recommendationStrings.volumeCount(volumeCount)}
            </p>
          ) : null}
          {variant === "completed" ? (
            <p className="text-[length:var(--text-caption-size)] leading-tight font-bold text-accent">
              {confidenceLabel}
            </p>
          ) : null}
          {variant === "discovery" ? (
            <p className="hidden border-l-2 border-accent/50 pl-[var(--space-2)] text-[length:var(--text-caption-size)] leading-[1.4] text-text-muted md:line-clamp-2">
              {leadReason}
            </p>
          ) : null}
          {previewControl}
        </div>
      ) : (
        previewControl
      )}
    </>
  );

  return variant === "anchor" ? (
    <ExpandableMediaCard
      className={cardClassName}
      data-lead-anchor-work-ids={leadSentence?.anchorWorkIds.join(" ")}
      data-recommendation-shelf-card={variant}
      expanded={expanded}
      onExpandedChange={(next) => onExpandedChange?.(next)}
      panel={
        <div className="flex min-h-full flex-col justify-center gap-[var(--space-3)]">
          <h4 className="text-[length:var(--text-caption-size)] font-medium text-text-muted">
            {recommendationStrings.shelves.anchor.connectionHeading}
          </h4>
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
        </div>
      }
    >
      {content}
    </ExpandableMediaCard>
  ) : (
    <article className={cardClassName} data-recommendation-shelf-card={variant}>
      {content}
    </article>
  );
}
