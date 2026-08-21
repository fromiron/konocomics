import { Link } from "@tanstack/react-router";
import { CircleIcon, CrownIcon } from "lucide-react";
import type { ReactNode } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { mediaStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

const rankNumeralTypography =
  "font-display text-[length:var(--font-size-32)] leading-none font-black drop-shadow-[0_2px_3px_var(--canvas)] tabular-nums";

type RankingCardProps = Readonly<{
  rankingKind: "editorial-ranking" | "personalized-ranking";
  position: number;
  workId: string;
  title: string;
  creators: readonly string[];
  coverUrl?: string | null;
  metadata?: ReactNode;
  priority?: boolean;
  onCoverSettled?: () => void;
  className?: string;
}>;

export function RankingCard({
  className,
  coverUrl,
  creators,
  metadata,
  onCoverSettled,
  position,
  priority = false,
  rankingKind,
  title,
  workId,
}: RankingCardProps) {
  const isFirst = position === 1;
  const isEditorialRanking = rankingKind === "editorial-ranking";
  const positionLabel = isEditorialRanking
    ? mediaStrings.editorialRank(position)
    : mediaStrings.rank(position);

  return (
    <li
      className={cn(
        "shrink-0 snap-start",
        isEditorialRanking ? "w-24" : "w-[calc(var(--control-min-size)*1.75)]",
        className,
      )}
      data-ranking-kind={rankingKind}
      data-ranking-position={position}
    >
      <article>
        <Link
          aria-label={`${positionLabel} · ${mediaStrings.openDetails(title)}`}
          className={cn(
            "group/ranking relative block min-h-[var(--control-min-size)] overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-1 shadow-[var(--shadow-level-1)] focus-visible:border-line-accent",
            isEditorialRanking ? "aspect-[18/25]" : "aspect-[30/43]",
            !isEditorialRanking &&
              "transition-transform duration-[var(--motion-duration-feedback)] [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none",
            !isEditorialRanking && isFirst && "border-[var(--rank-highlight)]",
          )}
          params={{ workId }}
          preload={false}
          to="/works/$workId"
        >
          {coverUrl ? (
            <>
              <span aria-hidden="true">
                <CoverImage
                  className="pointer-events-none absolute inset-0 size-full rounded-none border-0 opacity-50 [&_.cover-image__image]:object-cover [&_.cover-image__placeholder-content]:hidden [&_.cover-image__skeleton]:hidden"
                  coverUrl={coverUrl}
                  creators={creators}
                  decorative
                  priority={priority && isFirst}
                  requestedSize={400}
                  title={title}
                />
              </span>
              <CoverImage
                className="absolute inset-0 size-full rounded-none border-0 bg-transparent"
                coverUrl={coverUrl}
                creators={creators}
                decorative
                onSettled={onCoverSettled}
                priority={priority && isFirst}
                requestedSize={400}
                title={title}
              />
            </>
          ) : (
            <>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--accent)_10%,transparent),transparent_58%),linear-gradient(to_bottom,transparent,color-mix(in_oklch,var(--surface-2)_62%,transparent))]"
              />
              <span
                aria-hidden="true"
                className="cover-image cover-image--placeholder pointer-events-none absolute inset-0 grid place-items-center border-0 bg-transparent p-[var(--space-3)]"
              >
                <span className="line-clamp-3 text-center text-[length:var(--font-size-12)] font-medium leading-[1.45] tracking-[0.04em] text-text-muted text-balance">
                  {title}
                </span>
              </span>
            </>
          )}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,var(--canvas)_0%,color-mix(in_oklch,var(--canvas)_92%,transparent)_38%,color-mix(in_oklch,var(--canvas)_42%,transparent)_68%,transparent_86%)]"
          />
          {isEditorialRanking ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-[var(--motion-duration-feedback)] ease-[var(--motion-ease-direct)] motion-reduce:transition-none"
              data-ranking-editorial-accessory="true"
            >
              <span
                className="ranking-card__first-swash absolute top-0 left-0"
                data-ranking-first-swash="true"
              />
              <span className="absolute top-0 left-0 inline-flex translate-y-px items-center gap-[3px] px-[var(--space-2)] pt-[var(--space-1)] leading-none font-bold text-[var(--rank-first-ink)]">
                <CrownIcon
                  aria-hidden="true"
                  className="size-4.5 shrink-0 fill-current"
                  strokeWidth={2}
                />
                <span className="grid gap-0 text-[10px] leading-[0.9] font-black tracking-[0.08em]">
                  <span>{mediaStrings.topTenBadge.top}</span>
                  <span className="tracking-normal">{mediaStrings.topTenBadge.ten}</span>
                </span>
              </span>
              <span
                className={cn(
                  "absolute top-[calc(var(--space-8)-var(--space-1))] left-2.5 text-[var(--rank-first-number)]",
                  rankNumeralTypography,
                )}
                data-ranking-editorial-accessory-position="true"
              >
                {position}
              </span>
            </span>
          ) : null}
          {!isEditorialRanking && isFirst ? (
            <span
              aria-hidden="true"
              className="absolute top-[var(--space-1)] left-[var(--space-1)] z-20 grid size-5 -rotate-12 place-items-center rounded-[var(--radius-control)] bg-[var(--rank-highlight)] text-[var(--on-rank-highlight)] shadow-[var(--shadow-level-1)]"
              data-ranking-personalized-crown="true"
            >
              <CrownIcon aria-hidden="true" className="size-3.5 fill-current" strokeWidth={2} />
            </span>
          ) : null}
          <span
            aria-hidden="true"
            className={cn(
              "absolute z-20",
              rankNumeralTypography,
              isEditorialRanking
                ? "top-[var(--space-2)] left-[var(--space-2)] text-text-strong transition-opacity duration-[var(--motion-duration-feedback)] ease-[var(--motion-ease-direct)] motion-reduce:transition-none"
                : isFirst
                  ? "top-[var(--space-7)] left-[var(--space-2)] text-[var(--rank-highlight)]"
                  : "top-[var(--space-2)] left-[var(--space-2)] text-text-strong",
            )}
            data-ranking-editorial-position={isEditorialRanking || undefined}
          >
            {position}
          </span>
          <div className="absolute inset-x-0 bottom-0 z-10 grid gap-[var(--space-content-tight)] p-[var(--space-2)]">
            <h3 className="line-clamp-2 text-[length:var(--font-size-14)] leading-tight font-bold text-text-strong [overflow-wrap:anywhere]">
              {title}
            </h3>
            {metadata === undefined ? null : (
              <span className="flex min-w-0 items-center gap-[var(--space-1)] text-[length:var(--text-caption-size)] leading-tight text-text-muted">
                <CircleIcon
                  aria-hidden="true"
                  className="size-2.5 shrink-0 fill-accent text-accent"
                />
                <span className="line-clamp-1 min-w-0">{metadata}</span>
              </span>
            )}
          </div>
        </Link>
      </article>
    </li>
  );
}
