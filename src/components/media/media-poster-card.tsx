import { Link } from "@tanstack/react-router";
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
  priority?: boolean;
  className?: string;
}>;

export function MediaPosterCard({
  badge,
  className,
  coverUrl,
  creators,
  metadata,
  priority = false,
  title,
  workId,
}: MediaPosterCardProps) {
  return (
    <article className={cn("w-36 shrink-0 snap-start sm:w-40", className)}>
      <Link
        aria-label={mediaStrings.openDetails(title)}
        className="group/card grid min-h-[var(--control-min-size)] gap-[var(--space-content)] rounded-[var(--radius-card)]"
        params={{ workId }}
        preload={false}
        to="/works/$workId"
      >
        <div className="relative">
          <CoverImage
            className="shadow-[var(--shadow-level-1)] transition-transform duration-[var(--motion-duration-feedback)] group-hover/card:-translate-y-1 motion-reduce:transition-none"
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
          <h3 className="line-clamp-2">{title}</h3>
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
