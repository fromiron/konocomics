import { Link } from "@tanstack/react-router";

import { CoverImage } from "@/components/cover/CoverImage";
import { Button } from "@/components/design-system/button";
import type { CarouselLoopCopy } from "@/components/media/media-shelf";
import type { Work } from "@/domain/catalog/types";
import { generateTasteExplanation } from "@/domain/explanation/generate";
import type { RecommendationPlanEntry } from "@/domain/recommendation/types";
import { explanationLexicon, mediaStrings, recommendationStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

type RecommendationShelfCardProps = Readonly<{
  entry: RecommendationPlanEntry;
  work: Work;
  coverUrl?: string | null;
  priority?: boolean;
  volumeCount: number;
  variant: "anchor" | "discovery" | "completed";
  resolveTitle: (workId: string) => string | undefined;
  onPreview: () => void;
  "aria-hidden"?: boolean;
  "data-carousel-clone"?: "";
  "data-carousel-copy"?: CarouselLoopCopy;
  inert?: boolean;
}>;

export function RecommendationShelfCard({
  "aria-hidden": ariaHidden,
  coverUrl,
  "data-carousel-clone": carouselClone,
  "data-carousel-copy": carouselCopy,
  entry,
  inert,
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
  const widthClass =
    variant === "anchor"
      ? "w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/2.4)] max-w-44 sm:w-32 md:w-[calc((100%-var(--space-content-loose)*7)/8)] md:min-w-24 md:max-w-28"
      : variant === "discovery"
        ? "w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/1.8)] max-w-72 sm:w-64 md:w-[calc((100%-var(--space-content-loose)*4)/5)] md:min-w-[10.5rem]"
        : "w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/1.8)] max-w-72 sm:w-64 md:w-[calc((100%-var(--space-content-loose)*4)/5)] md:min-w-[10.5rem]";

  return (
    <article
      aria-hidden={ariaHidden}
      className={cn(
        "shrink-0 snap-start overflow-hidden rounded-[var(--radius-card)] border border-line/80 bg-surface-1 transition-colors duration-[var(--motion-duration-feedback)] hover:border-line-accent motion-reduce:transition-none",
        widthClass,
      )}
      data-carousel-clone={carouselClone}
      data-carousel-copy={carouselCopy}
      data-lead-anchor-work-ids={
        variant === "anchor" ? leadSentence?.anchorWorkIds.join(" ") : undefined
      }
      data-recommendation-shelf-card={variant}
      inert={inert}
    >
      <Link
        aria-label={mediaStrings.openDetails(work.title)}
        className={cn(
          "group/shelf-card grid min-h-[var(--control-min-size)] gap-[var(--space-2)] p-[var(--space-2)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring",
          variant === "anchor" && "relative !block !p-0",
          variant === "discovery" &&
            "md:grid-cols-[3.5rem_minmax(0,1fr)] md:gap-[var(--space-2)] md:p-[var(--space-2)]",
          variant === "completed" &&
            "md:grid-cols-[3.5rem_minmax(0,1fr)] md:gap-[var(--space-2)] md:p-[var(--space-2)]",
        )}
        params={{ workId: work.id }}
        preload={false}
        to="/works/$workId"
      >
        <CoverImage
          className={cn(
            "w-full overflow-hidden rounded-[var(--radius-cover)] border border-line/60",
            "aspect-[30/43]",
          )}
          coverUrl={coverUrl}
          creators={work.creators}
          priority={priority}
          requestedSize={400}
          title={work.title}
        />
        <div
          className={cn(
            "grid min-w-0 content-start gap-[var(--space-1)]",
            variant === "anchor" &&
              "absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-canvas via-canvas/85 to-transparent p-[var(--space-2)] pt-[var(--space-6)]",
          )}
        >
          <h3 className="line-clamp-2 text-[length:var(--font-size-14)] leading-tight font-bold text-text-strong transition-colors group-hover/shelf-card:text-accent">
            {work.title}
          </h3>
          {variant === "completed" ? (
            <p className="hidden text-[length:var(--text-caption-size)] font-medium text-text-muted md:line-clamp-1">
              {recommendationStrings.workStatus.completed}
              <span aria-hidden="true"> · </span>
              {recommendationStrings.volumeCount(volumeCount)}
            </p>
          ) : null}
          <p className="text-[length:var(--text-caption-size)] leading-tight font-bold text-accent">
            {explanationLexicon.confidenceLabels[entry.confidenceLevel]}
          </p>
          {variant === "discovery" ? (
            <p className="hidden border-l-2 border-accent/50 pl-[var(--space-2)] text-[length:var(--text-caption-size)] leading-[1.4] text-text-muted md:line-clamp-2">
              {leadReason}
            </p>
          ) : null}
        </div>
      </Link>
      <Button
        className="w-full min-h-[var(--control-min-size)] rounded-none border-x-0 border-b-0 md:hidden"
        onClick={onPreview}
        type="button"
        variant="outline"
      >
        <span className="line-clamp-1">{recommendationStrings.quickPreview.open(work.title)}</span>
      </Button>
    </article>
  );
}
