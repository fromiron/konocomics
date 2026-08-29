import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { mediaStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

type RankingCardProps = Readonly<{
  rankingKind: "editorial-ranking" | "personalized-ranking";
  position: number;
  workId: string;
  title: string;
  creators: readonly string[];
  coverUrl?: string | null;
  metadata?: ReactNode;
  metadataAccessibleLabel?: string;
  priority?: boolean;
  onCoverSettled?: () => void;
  className?: string;
}>;

export function RankingCard({
  className,
  coverUrl,
  creators,
  metadata,
  metadataAccessibleLabel,
  onCoverSettled,
  position,
  priority = false,
  rankingKind,
  title,
  workId,
}: RankingCardProps) {
  const isEditorialRanking = rankingKind === "editorial-ranking";
  const positionLabel = isEditorialRanking
    ? mediaStrings.editorialRank(position)
    : mediaStrings.rank(position);

  return (
    <li
      className={cn(
        "shrink-0 snap-start",
        isEditorialRanking ? "w-24 sm:w-28" : "w-[calc(var(--control-min-size)*1.75)]",
        className,
      )}
      data-ranking-kind={rankingKind}
      data-ranking-position={position}
    >
      <article className="grid min-w-0 content-start gap-[var(--space-2)]">
        <Link
          aria-label={
            metadataAccessibleLabel === undefined
              ? `${positionLabel} · ${mediaStrings.openDetails(title)}`
              : `${positionLabel} · ${mediaStrings.openDetails(title)} · ${metadataAccessibleLabel}`
          }
          className="group/ranking relative block min-h-[var(--control-min-size)] overflow-hidden rounded-[var(--radius-cover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          params={{ workId }}
          preload={false}
          to="/works/$workId"
        >
          <CoverImage
            className="w-full transition-transform duration-[var(--motion-duration-value)] ease-[var(--motion-ease-direct)] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/ranking:scale-[1.03]"
            coverUrl={coverUrl}
            creators={creators}
            onSettled={onCoverSettled}
            priority={priority && position === 1}
            requestedSize={400}
            title={title}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(to_top,color-mix(in_oklch,var(--canvas)_82%,transparent),transparent)]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[var(--space-1)] left-[var(--space-2)] font-display text-[length:var(--font-size-32)] leading-none font-black text-text-strong tabular-nums [text-shadow:0_2px_10px_color-mix(in_oklch,var(--canvas)_80%,transparent)]"
            data-ranking-editorial-position={isEditorialRanking || undefined}
          >
            {position}
          </span>
        </Link>
        <div className="grid min-w-0 content-start gap-[var(--space-content-tight)]">
          <h3 className="line-clamp-2 text-[length:var(--font-size-14)] leading-snug font-bold text-text-strong [overflow-wrap:anywhere]">
            {title}
          </h3>
          {metadata === undefined ? null : (
            <p className="line-clamp-1 text-[length:var(--text-caption-size)] leading-tight text-text-muted">
              {metadata}
            </p>
          )}
        </div>
      </article>
    </li>
  );
}
