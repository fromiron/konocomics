import { Link } from "@tanstack/react-router";

import { CoverImage } from "@/components/cover/CoverImage";
import { Button } from "@/components/design-system/button";
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
}>;

export function RecommendationShelfCard({
  coverUrl,
  entry,
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
      ? "w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/2.4)] max-w-44 md:w-24 md:max-w-24"
      : variant === "discovery"
        ? "w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/2.4)] max-w-44 md:w-[calc((100%-var(--space-content-loose)*4)/5)] md:min-w-[13.5rem]"
        : "w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/2.4)] max-w-44 md:w-[calc((100%-var(--space-content-loose)*4)/5)] md:min-w-[13.5rem]";

  return (
    <article
      className={cn(
        "shrink-0 snap-start overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-1",
        widthClass,
      )}
      data-lead-anchor-work-ids={
        variant === "anchor" ? leadSentence?.anchorWorkIds.join(" ") : undefined
      }
      data-recommendation-shelf-card={variant}
    >
      <Link
        aria-label={mediaStrings.openDetails(work.title)}
        className={cn(
          "group/shelf-card grid min-h-[var(--control-min-size)] gap-[var(--space-content-tight)] p-[var(--space-content-tight)]",
          variant === "anchor" && "md:relative md:block md:p-0",
          variant === "discovery" &&
            "md:grid-cols-[5rem_minmax(0,1fr)] md:gap-[var(--space-2)] md:p-[var(--space-2)]",
          variant === "completed" &&
            "md:grid-cols-[5rem_minmax(0,1fr)] md:gap-[var(--space-2)] md:p-[var(--space-2)]",
        )}
        params={{ workId: work.id }}
        preload={false}
        to="/works/$workId"
      >
        <CoverImage
          className="w-full transition-transform duration-[var(--motion-duration-feedback)] motion-reduce:transform-none motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:group-hover/shelf-card:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:group-hover/shelf-card:shadow-[var(--shadow-raised)]"
          coverUrl={coverUrl}
          creators={work.creators}
          priority={priority}
          requestedSize={400}
          title={work.title}
        />
        <div
          className={cn(
            "grid min-w-0 content-start gap-[var(--space-content-tight)]",
            variant === "anchor" &&
              "md:absolute md:inset-x-0 md:bottom-0 md:bg-surface-overlay md:p-[var(--space-2)]",
          )}
        >
          <h3
            className={cn(
              "line-clamp-2 text-[length:var(--font-size-14)] leading-tight font-bold text-text-strong",
              variant === "anchor" && "md:line-clamp-1",
            )}
          >
            {work.title}
          </h3>
          {variant === "completed" ? (
            <p className="hidden line-clamp-1 text-[length:var(--text-caption-size)] text-text-muted md:block">
              {recommendationStrings.workStatus.completed}
              <span aria-hidden="true"> · </span>
              {recommendationStrings.volumeCount(volumeCount)}
            </p>
          ) : null}
          <p className="hidden text-[length:var(--text-caption-size)] leading-tight font-bold text-accent md:block">
            {explanationLexicon.confidenceLabels[entry.confidenceLevel]}
          </p>
          {variant === "discovery" ? (
            <p className="hidden line-clamp-2 border-t border-line pt-[var(--space-content-tight)] text-[length:var(--text-caption-size)] leading-[1.45] text-text md:block">
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
