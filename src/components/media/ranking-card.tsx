import { Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import type { ReactNode } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { RankCrown, rankMedalFor } from "@/components/media/rank-crown";
import { mediaStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

type EvidencePlaceholderProps = Readonly<{
  variant: "evidence-placeholder";
  className?: string;
}>;

type RankingCardProps = Readonly<{
  workId: string;
  title: string;
  creators: readonly string[];
  coverUrl?: string | null;
  metadata?: ReactNode;
  metadataAccessibleLabel?: string;
  priority?: boolean;
  onCoverVisible?: () => void;
  className?: string;
}> &
  (
    | Readonly<{
        variant?: "ranking";
        rankingKind: "editorial-ranking" | "personalized-ranking";
        position: number;
      }>
    | Readonly<{ variant: "evidence" | "unranked"; rankingKind?: never; position?: never }>
  );

export function RankingCard(props: RankingCardProps | EvidencePlaceholderProps) {
  if (props.variant === "evidence-placeholder") {
    return (
      <li
        aria-hidden="true"
        className={cn(
          "grid min-w-0 place-items-center rounded-[var(--radius-media-card)] bg-surface-1/40 p-[var(--space-2)] text-text-muted",
          props.className,
        )}
      >
        <span className="grid aspect-[30/43] w-full content-center justify-items-center gap-[var(--space-2)] text-center text-[length:var(--text-caption-size)] font-medium">
          <BookOpen aria-hidden="true" className="size-[var(--space-6)]" strokeWidth={1.5} />
          <span>{mediaStrings.evidencePlaceholder}</span>
        </span>
      </li>
    );
  }

  const {
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
    variant = "ranking",
    workId,
  } = props;
  const isEvidence = variant === "evidence";
  const isEditorialRanking = rankingKind === "editorial-ranking";
  // Gold, silver, and bronze mark only the personalized top three (04 §2.5).
  const medal = isEvidence ? undefined : rankMedalFor(position);
  const positionLabel =
    position === undefined
      ? undefined
      : isEditorialRanking
        ? mediaStrings.editorialRank(position)
        : mediaStrings.rank(position);
  const linkLabel = [positionLabel, mediaStrings.openDetails(title), metadataAccessibleLabel]
    .filter(Boolean)
    .join(" · ");

  return (
    <li
      className={cn(
        "min-w-0",
        !isEvidence && ["shrink-0 snap-start", isEditorialRanking ? "w-24 sm:w-28" : "w-44"],
        className,
      )}
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
        <article className="h-full min-w-0">
          <Link
            aria-label={linkLabel}
            className={cn(
              "ranking-card-link group/ranking relative grid h-full min-h-[var(--control-min-size)] content-start gap-[var(--space-2)] rounded-[var(--radius-media-card)] transition-colors duration-[var(--motion-duration-value)] ease-[var(--motion-ease-direct)] focus-visible:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-2",
              isEvidence ? "bg-surface-1 p-[var(--space-2)]" : "bg-transparent p-[var(--space-3)]",
            )}
            params={{ workId }}
            preload={false}
            to="/works/$workId"
          >
            <span className="relative block">
              <CoverImage
                className="w-full shadow-[var(--shadow-cover-featured)]"
                coverUrl={coverUrl}
                creators={creators}
                fit={isEvidence ? "contain" : "cover"}
                onVisible={onCoverVisible}
                priority={priority && position === 1}
                requestedSize={400}
                title={title}
              />
              {position === undefined ? null : (
                <span
                  aria-hidden="true"
                  className="ranking-badge pointer-events-none absolute right-[var(--space-2)] bottom-[var(--space-2)] grid size-[var(--space-12)] place-items-center rounded-full bg-accent font-display text-[length:var(--font-size-16)] leading-none font-black text-on-accent shadow-[var(--shadow-floating-action)] tabular-nums"
                  data-medal={medal}
                  data-ranking-badge-position="true"
                >
                  {position}
                  {medal === undefined ? null : <RankCrown medal={medal} />}
                </span>
              )}
            </span>
            <span className="grid min-w-0 gap-[var(--space-content-tight)]">
              <span
                className={cn(
                  "ranking-card-title leading-snug text-text-strong [overflow-wrap:anywhere]",
                  isEvidence
                    ? "line-clamp-3 text-[length:var(--font-size-14)] font-bold"
                    : "line-clamp-2 min-h-[2lh] text-[length:var(--font-size-16)] font-medium",
                )}
              >
                {title}
              </span>
              {metadata === undefined ? null : (
                <span
                  className={cn(
                    "ranking-card-meta leading-snug text-text-muted",
                    isEvidence
                      ? "order-first text-[length:var(--text-caption-size)]"
                      : "line-clamp-2 text-[length:var(--font-size-14)]",
                  )}
                  data-ranking-label={variant === "ranking" ? "true" : undefined}
                >
                  {metadata}
                </span>
              )}
            </span>
          </Link>
        </article>
      )}
    </li>
  );
}
