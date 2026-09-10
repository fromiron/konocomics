import { Link } from "@tanstack/react-router";
import { CrownIcon } from "lucide-react";
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
  onCoverVisible?: () => void;
  className?: string;
}>;

export function RankingCard({
  className,
  coverUrl,
  creators,
  metadata,
  metadataAccessibleLabel,
  onCoverVisible,
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
  const linkLabel =
    metadataAccessibleLabel === undefined
      ? `${positionLabel} · ${mediaStrings.openDetails(title)}`
      : `${positionLabel} · ${mediaStrings.openDetails(title)} · ${metadataAccessibleLabel}`;

  return (
    <li
      className={cn("shrink-0 snap-start", isEditorialRanking ? "w-24 sm:w-28" : "w-44", className)}
      data-ranking-kind={rankingKind}
      data-ranking-position={position}
    >
      {isEditorialRanking ? (
        <article className="grid min-w-0 content-start gap-[var(--space-2)]">
          <Link
            aria-label={linkLabel}
            className="group/ranking relative block min-h-[var(--control-min-size)] overflow-hidden rounded-[var(--radius-cover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            params={{ workId }}
            preload={false}
            to="/works/$workId"
          >
            <CoverImage
              className="w-full transition-transform duration-[var(--motion-duration-value)] ease-[var(--motion-ease-direct)] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/ranking:scale-[1.03]"
              coverUrl={coverUrl}
              creators={creators}
              onVisible={onCoverVisible}
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
              data-ranking-editorial-position="true"
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
      ) : (
        <article className="min-w-0">
          <Link
            aria-label={linkLabel}
            className="ranking-card-link group/ranking relative grid min-h-[var(--control-min-size)] gap-[var(--space-2)] rounded-[var(--radius-card)] bg-transparent p-[var(--space-3)] transition-colors duration-[var(--motion-duration-value)] ease-[var(--motion-ease-direct)] focus-visible:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-2"
            params={{ workId }}
            preload={false}
            to="/works/$workId"
          >
            <span className="relative block">
              <CoverImage
                className="w-full shadow-[var(--shadow-cover-featured)]"
                coverUrl={coverUrl}
                creators={creators}
                fit="cover"
                onVisible={onCoverVisible}
                priority={priority && position === 1}
                requestedSize={400}
                title={title}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-[var(--space-2)] bottom-[var(--space-2)] grid size-[var(--space-12)] place-items-center rounded-full bg-accent font-display text-[length:var(--font-size-16)] leading-none font-black text-on-accent opacity-0 shadow-[var(--shadow-floating-action)] transition-[transform,opacity] duration-[var(--motion-duration-floating-action)] ease-[var(--motion-ease-direct)] [transform:translateY(var(--space-2))] tabular-nums group-focus-visible/ranking:opacity-100 group-focus-visible/ranking:[transform:translateY(0)] motion-reduce:transition-none motion-reduce:[transform:translateY(0)] [@media(hover:hover)_and_(pointer:fine)]:group-hover/ranking:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover/ranking:[transform:translateY(0)]"
                data-ranking-hover-position="true"
              >
                {position}
                {position === 1 ? (
                  <CrownIcon
                    aria-hidden="true"
                    className="ranking-crown"
                    fill="currentColor"
                    stroke="var(--canvas)"
                    strokeWidth={1.5}
                  />
                ) : null}
              </span>
            </span>
            <span className="grid min-w-0 gap-[var(--space-content-tight)]">
              <span className="line-clamp-2 text-[length:var(--font-size-16)] leading-snug font-medium text-text-strong [overflow-wrap:anywhere]">
                {title}
              </span>
              <span
                className="line-clamp-2 text-[length:var(--font-size-14)] leading-snug text-text-muted"
                data-ranking-label="true"
              >
                {metadata}
              </span>
            </span>
          </Link>
        </article>
      )}
    </li>
  );
}
