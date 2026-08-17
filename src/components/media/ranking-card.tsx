import { Link } from "@tanstack/react-router";
import { CircleIcon, CrownIcon } from "lucide-react";
import type { ReactNode } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { mediaStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

type RankingCardProps = Readonly<{
  position: number;
  workId: string;
  title: string;
  creators: readonly string[];
  coverUrl?: string | null;
  metadata?: ReactNode;
  presentation?: "standard" | "landing-top-ten";
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
  presentation = "standard",
  priority = false,
  title,
  workId,
}: RankingCardProps) {
  const isFirst = position === 1;
  const isLandingTopTen = presentation === "landing-top-ten";

  return (
    <li
      className={cn(
        "shrink-0 snap-start",
        isLandingTopTen ? (isFirst ? "w-28" : "w-20") : "w-24 sm:w-28",
        className,
      )}
      data-card-presentation={presentation}
    >
      <article>
        <Link
          aria-label={`${mediaStrings.rank(position)} · ${mediaStrings.openDetails(title)}`}
          className={cn(
            "group/ranking relative block min-h-[var(--control-min-size)] overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-1 shadow-[var(--shadow-level-1)] transition-transform duration-[var(--motion-duration-feedback)] focus-visible:border-line-accent [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none",
            isLandingTopTen ? (isFirst ? "aspect-[6/7]" : "aspect-[3/5]") : "aspect-[30/43]",
            isFirst && "border-[var(--rank-highlight)]",
          )}
          params={{ workId }}
          preload={false}
          to="/works/$workId"
        >
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
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,var(--canvas)_0%,color-mix(in_oklch,var(--canvas)_92%,transparent)_38%,color-mix(in_oklch,var(--canvas)_42%,transparent)_68%,transparent_86%)]"
          />
          {isFirst ? (
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 z-10 inline-flex items-center gap-[var(--space-1)] rounded-br-[var(--radius-card)] bg-[var(--rank-highlight)] px-[var(--space-2)] py-[var(--space-1)] leading-none font-bold text-[var(--on-rank-highlight)] shadow-[var(--shadow-level-1)]"
            >
              <CrownIcon
                aria-hidden="true"
                className={cn("shrink-0 fill-current", isLandingTopTen ? "size-3.5" : "size-4")}
                strokeWidth={2.5}
              />
              <span
                className={cn(
                  "grid gap-0 tracking-[0.08em]",
                  isLandingTopTen
                    ? "text-[10px] leading-none font-black"
                    : "text-[length:var(--text-caption-size)]",
                )}
              >
                <span>{mediaStrings.topTenBadge.top}</span>
                <span className="tracking-normal">{mediaStrings.topTenBadge.ten}</span>
              </span>
            </span>
          ) : null}
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-[var(--space-2)] z-10 font-display leading-none font-black text-text-strong drop-shadow-[0_2px_3px_var(--canvas)] tabular-nums",
              isLandingTopTen && isFirst
                ? "top-[var(--space-8)] text-[length:var(--font-size-40)] text-[var(--rank-highlight)]"
                : isFirst
                  ? "top-[var(--space-8)] text-[length:var(--font-size-32)] text-[var(--rank-highlight)]"
                  : "top-[var(--space-2)] text-[length:var(--font-size-32)]",
            )}
          >
            {position}
          </span>
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 z-10 grid gap-[var(--space-content-tight)]",
              isLandingTopTen && isFirst ? "p-[var(--space-3)]" : "p-[var(--space-2)]",
            )}
          >
            <h3
              className={cn(
                "line-clamp-2 leading-tight font-bold text-text-strong [overflow-wrap:anywhere]",
                isLandingTopTen && isFirst
                  ? "text-[length:var(--font-size-16)]"
                  : "text-[length:var(--font-size-14)]",
              )}
            >
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
