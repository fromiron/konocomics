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
        "group/showcase-card relative isolate w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/2.4)] shrink-0 snap-start transition-[width,border-color,box-shadow] duration-[var(--motion-duration-value)] ease-[var(--motion-ease-direct)] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:hover:z-10",
        featured ? "z-[1] md:w-[min(86vw,20rem)]" : "md:w-[min(74vw,14rem)]",
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
        className={cn(
          "group/showcase relative isolate block h-full min-h-[var(--control-min-size)] overflow-hidden rounded-[var(--radius-card)] border bg-surface-1 transition-[border-color,box-shadow] duration-[var(--motion-duration-feedback)] aspect-[4/3] focus-visible:border-line-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 motion-reduce:transition-none md:h-[13.5rem] md:aspect-auto",
          featured
            ? "border-accent shadow-[0_8px_28px_color-mix(in_oklch,var(--accent)_18%,transparent),var(--shadow-raised)]"
            : "border-line/70 [@media(hover:hover)_and_(pointer:fine)]:hover:border-line-accent [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_6px_20px_color-mix(in_oklch,var(--line)_38%,transparent)]",
        )}
        params={{ workId }}
        preload={false}
        to="/works/$workId"
      >
        {coverUrl ? (
          <span aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-[inherit]">
            <CoverImage
              className="pointer-events-none absolute inset-0 !aspect-auto !rounded-none !border-0 scale-[1.14] opacity-[0.55] blur-[16px] saturate-[0.9] brightness-[0.96] [&>img]:!object-cover [&_.cover-image__placeholder-content]:hidden [&_.cover-image__skeleton]:hidden will-change-[filter,transform] motion-reduce:blur-none motion-reduce:transform-none"
              coverUrl={coverUrl}
              creators={creators}
              decorative
              priority={priority}
              requestedSize={400}
              title={title}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_62%_54%_at_76%_14%,color-mix(in_oklch,var(--accent)_14%,transparent),transparent_62%),linear-gradient(170deg,color-mix(in_oklch,var(--canvas)_10%,transparent)_0%,color-mix(in_oklch,var(--canvas)_22%,transparent)_100%)] opacity-60"
            />
            <CoverImage
              className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-[var(--space-3)] inline-flex h-[88%] w-auto !aspect-auto origin-center !overflow-visible !rounded-none !border-0 !bg-transparent rotate-[4deg] [&>img]:!static [&>img]:!inset-auto [&>img]:!h-full [&>img]:!w-auto [&>img]:!rounded-[var(--radius-cover)] [&>img]:!object-contain [&>img]:drop-shadow-[0_4px_12px_color-mix(in_oklch,var(--text-strong)_16%,transparent)]"
              coverUrl={coverUrl}
              creators={creators}
              decorative
              priority={priority}
              requestedSize={400}
              title={title}
            />
          </span>
        ) : (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_68%_56%_at_78%_14%,color-mix(in_oklch,var(--accent)_12%,transparent),transparent_58%),linear-gradient(170deg,color-mix(in_oklch,var(--surface-2)_92%,var(--surface-1))_0%,var(--surface-1)_62%,color-mix(in_oklch,var(--surface-2)_70%,transparent)_100%)]"
          />
        )}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_oklch,var(--canvas)_92%,transparent)_0%,color-mix(in_oklch,var(--canvas)_86%,transparent)_24%,color-mix(in_oklch,var(--canvas)_28%,transparent)_62%,transparent_84%)] opacity-[0.98]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--canvas)_62%,transparent)_0%,color-mix(in_oklch,var(--canvas)_18%,transparent)_46%,transparent_78%)] opacity-90"
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] border opacity-0 transition-opacity duration-[var(--motion-duration-feedback)]",
            featured
              ? "border-accent/0"
              : "border-transparent group-hover/showcase:border-line-accent/30",
          )}
        />
        {ordinal === undefined ? null : (
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-[var(--space-2)] left-[var(--space-2)] z-10 inline-flex size-7 items-center justify-center rounded-[var(--radius-cover)] bg-accent font-display text-[length:var(--font-size-14)] leading-none font-bold text-on-accent shadow-[0_2px_10px_color-mix(in_oklch,var(--accent)_28%,transparent)] ring-1 ring-white/10 md:size-8 md:text-[length:var(--font-size-16)]",
              featured ? "ring-accent-hover" : "ring-white/0 group-hover/showcase:ring-white/10",
            )}
          >
            {ordinal}
          </span>
        )}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-10 grid gap-[var(--space-content-tight)] p-[var(--space-3)]",
            featured
              ? "max-w-[78%] md:max-w-[66%] md:p-[var(--space-4)]"
              : "max-w-[82%] md:max-w-[72%]",
          )}
        >
          <h3
            className={cn(
              "line-clamp-2 leading-tight font-bold text-text-strong [overflow-wrap:anywhere] text-balance",
              featured
                ? "text-[length:var(--font-size-16)] md:text-[length:var(--text-subheading-size)]"
                : "text-[length:var(--font-size-15)] md:text-[length:var(--font-size-16)]",
            )}
          >
            {title}
          </h3>
          <p className="line-clamp-1 text-[length:var(--text-caption-size)] leading-tight tracking-wide text-text-muted/90">
            {coverStrings.creatorLine(creators)}
          </p>
          {metadata === undefined ? null : (
            <div className="inline-flex max-w-full items-center gap-[var(--space-content-tight)] text-[length:var(--text-caption-size)] leading-tight">
              <span
                className="inline-flex size-[3px] shrink-0 rounded-full bg-accent/70"
                aria-hidden="true"
              />
              <span className="line-clamp-1 min-w-0 font-medium tracking-wide text-text/90">
                {metadata}
              </span>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
