import { Link } from "@tanstack/react-router";
import { BookOpenIcon } from "lucide-react";
import type { ReactNode } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { coverStrings, mediaStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

type MediaPosterCardProps = Readonly<{
  workId: string;
  title: string;
  creators: readonly string[];
  coverUrl?: string | null;
  badge?: ReactNode;
  metadata?: ReactNode;
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
  presentation = "standard",
  priority = false,
  title,
  workId,
}: MediaPosterCardProps) {
  if (presentation === "cover-overlay") {
    return (
      <article
        className={cn(
          "w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/2.4)] shrink-0 snap-start sm:w-40",
          className,
        )}
        data-card-presentation="cover-overlay"
      >
        <Link
          aria-label={mediaStrings.openDetails(title)}
          className="group/card relative block min-h-[var(--control-min-size)] overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-1 transition-[transform,border-color,box-shadow] duration-[var(--motion-duration-feedback)] focus-visible:border-line-accent [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:hover:border-line-accent [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[var(--shadow-raised)] motion-reduce:transform-none motion-reduce:transition-none"
          params={{ workId }}
          preload={false}
          to="/works/$workId"
        >
          <CoverImage
            className="rounded-none border-0"
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
            <span className="absolute top-[var(--space-2)] right-[var(--space-2)] z-10 rounded-[var(--radius-pill)] border border-line bg-surface-overlay px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--text-caption-size)] font-bold text-text-strong shadow-[var(--shadow-level-1)]">
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
            {metadata === undefined ? null : (
              <span className="flex min-w-0 items-center gap-[var(--space-1)] text-[length:var(--text-caption-size)] leading-tight text-accent">
                <BookOpenIcon aria-hidden="true" className="size-3 shrink-0" />
                <span className="line-clamp-1 min-w-0">{metadata}</span>
              </span>
            )}
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
        aria-label={mediaStrings.openDetails(title)}
        className="group/card grid min-h-[var(--control-min-size)] gap-[var(--space-content)] rounded-[var(--radius-card)]"
        params={{ workId }}
        preload={false}
        to="/works/$workId"
      >
        <div className="relative">
          <CoverImage
            className="transition-[transform,box-shadow] duration-[var(--motion-duration-feedback)] [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:group-hover/card:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:group-hover/card:shadow-[var(--shadow-raised)] motion-reduce:transform-none motion-reduce:transition-none"
            coverUrl={coverUrl}
            creators={creators}
            priority={priority}
            requestedSize={400}
            title={title}
          />
          {badge === undefined ? null : (
            <span className="absolute right-[var(--space-2)] bottom-[var(--space-2)] rounded-[var(--radius-pill)] bg-surface-1 px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--text-caption-size)] font-bold text-text-strong shadow-[var(--shadow-level-1)]">
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
          {metadata === undefined ? null : (
            <span className="text-[length:var(--text-caption-size)] text-text-muted">
              {metadata}
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}
