import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { MediaMetaLine } from "@/components/media/media-meta-line";
import { coverStrings, mediaStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

type MediaPosterCardProps = Readonly<{
  workId: string;
  title: string;
  creators: readonly string[];
  coverUrl?: string | null;
  badge?: ReactNode;
  metadata?: ReactNode;
  metadataAccessibleLabel?: string;
  presentation?: "standard" | "cover-overlay";
  priority?: boolean;
  className?: string;
}>;

export function MediaPosterCard({
  badge,
  className,
  coverUrl,
  creators,
  metadata,
  metadataAccessibleLabel,
  presentation = "standard",
  priority = false,
  title,
  workId,
}: MediaPosterCardProps) {
  if (presentation === "cover-overlay") {
    return (
      <article
        className={cn(
          "w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/2.4)] shrink-0 snap-start sm:w-38",
          className,
        )}
        data-card-presentation="cover-overlay"
      >
        <Link
          aria-label={
            metadataAccessibleLabel === undefined
              ? mediaStrings.openDetails(title)
              : `${mediaStrings.openDetails(title)} · ${metadataAccessibleLabel}`
          }
          className="group/card relative block min-h-[var(--control-min-size)] overflow-hidden rounded-[var(--radius-cover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          params={{ workId }}
          preload={false}
          to="/works/$workId"
        >
          <CoverImage
            className="rounded-none border-0 transition-transform duration-[var(--motion-duration-value)] ease-[var(--motion-ease-direct)] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/card:scale-[1.03] [&>img]:!object-cover [&>img]:!object-top"
            coverUrl={coverUrl}
            creators={creators}
            decorative
            priority={priority}
            requestedSize={400}
            title={title}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,var(--canvas)_0%,color-mix(in_oklch,var(--canvas)_92%,transparent)_30%,color-mix(in_oklch,var(--canvas)_45%,transparent)_52%,transparent_72%)]"
          />
          {badge === undefined ? null : (
            <span className="absolute top-[var(--space-2)] right-[var(--space-2)] z-10 rounded-[var(--radius-pill)] bg-surface-overlay px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--text-caption-size)] font-bold text-text-strong">
              {badge}
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 z-10 grid gap-[var(--space-content-tight)] p-[var(--space-2)]">
            <h3 className="line-clamp-2 text-[length:var(--font-size-14)] leading-tight text-text-strong [overflow-wrap:anywhere]">
              {title}
            </h3>
            <span className="line-clamp-1 text-[length:var(--text-caption-size)] leading-tight text-text-muted">
              {coverStrings.creatorLine(creators)}
            </span>
            {metadata === undefined ? null : <MediaMetaLine>{metadata}</MediaMetaLine>}
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/2.4)] shrink-0 snap-start sm:w-40",
        className,
      )}
    >
      <Link
        aria-label={
          metadataAccessibleLabel === undefined
            ? mediaStrings.openDetails(title)
            : `${mediaStrings.openDetails(title)} · ${metadataAccessibleLabel}`
        }
        className="group/card grid min-h-[var(--control-min-size)] gap-[var(--space-content)] rounded-[var(--radius-card)]"
        params={{ workId }}
        preload={false}
        to="/works/$workId"
      >
        <div className="relative">
          <CoverImage
            className="transition-transform duration-[var(--motion-duration-value)] ease-[var(--motion-ease-direct)] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/card:scale-[1.03]"
            coverUrl={coverUrl}
            creators={creators}
            priority={priority}
            requestedSize={400}
            title={title}
          />
          {badge === undefined ? null : (
            <span className="absolute right-[var(--space-2)] bottom-[var(--space-2)] rounded-[var(--radius-pill)] bg-surface-overlay px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--text-caption-size)] font-bold text-text-strong">
              {badge}
            </span>
          )}
        </div>
        <div className="grid gap-[var(--space-content-tight)]">
          <h3 className="line-clamp-2 text-[length:var(--font-size-14)] leading-tight [overflow-wrap:anywhere]">
            {title}
          </h3>
          <span className="line-clamp-1 text-[length:var(--text-caption-size)] text-text-muted">
            {coverStrings.creatorLine(creators)}
          </span>
          {metadata === undefined ? null : <MediaMetaLine>{metadata}</MediaMetaLine>}
        </div>
      </Link>
    </article>
  );
}
