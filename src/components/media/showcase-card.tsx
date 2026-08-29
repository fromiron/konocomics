import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { coverStrings, mediaStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

type ShowcaseCardProps = Readonly<{
  workId: string;
  title: string;
  creators: readonly string[];
  coverUrl?: string | null;
  metadata?: ReactNode;
  ordinal?: number;
  featured?: boolean;
  priority?: boolean;
  className?: string;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  onPointerCancel?: () => void;
  onFocus?: () => void;
}>;

export function ShowcaseCard({
  className,
  coverUrl,
  creators,
  featured = false,
  metadata,
  onFocus,
  onPointerCancel,
  onPointerEnter,
  onPointerLeave,
  ordinal,
  priority = false,
  title,
  workId,
}: ShowcaseCardProps) {
  return (
    <article
      className={cn(
        "group/showcase-card relative isolate w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/2.6)] shrink-0 snap-start",
        featured ? "md:w-56" : "md:w-44",
        className,
      )}
      data-card-presentation="showcase"
      data-featured={featured ? "true" : undefined}
      onFocus={onFocus}
      onPointerCancel={onPointerCancel}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <Link
        aria-label={mediaStrings.openDetails(title)}
        className="group/showcase relative isolate block min-h-[var(--control-min-size)] overflow-hidden rounded-[var(--radius-cover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        params={{ workId }}
        preload={false}
        to="/works/$workId"
      >
        <CoverImage
          className="w-full transition-transform duration-[var(--motion-duration-value)] ease-[var(--motion-ease-direct)] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/showcase:scale-[1.03]"
          coverUrl={coverUrl}
          creators={creators}
          priority={priority}
          requestedSize={400}
          title={title}
        />
        {ordinal === undefined ? null : (
          <span
            aria-hidden="true"
            className="absolute top-[var(--space-2)] left-[var(--space-2)] font-display text-[length:var(--font-size-20)] leading-none font-bold text-text-strong [text-shadow:0_1px_8px_color-mix(in_oklch,var(--canvas)_72%,transparent)]"
          >
            {ordinal}
          </span>
        )}
      </Link>
      <div className="mt-[var(--space-2)] grid min-w-0 content-start gap-[var(--space-content-tight)]">
        <h3
          className={cn(
            "line-clamp-2 leading-snug font-bold text-text-strong [overflow-wrap:anywhere]",
            featured ? "text-[length:var(--font-size-16)]" : "text-[length:var(--font-size-14)]",
          )}
        >
          {title}
        </h3>
        <p className="line-clamp-1 text-[length:var(--text-caption-size)] leading-tight text-text-muted">
          {coverStrings.creatorLine(creators)}
        </p>
        {metadata === undefined ? null : (
          <p className="line-clamp-1 text-[length:var(--text-caption-size)] leading-tight text-text-muted">
            {metadata}
          </p>
        )}
      </div>
    </article>
  );
}
