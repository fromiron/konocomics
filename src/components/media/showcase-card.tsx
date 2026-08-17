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
}>;

export function ShowcaseCard({
  className,
  coverUrl,
  creators,
  featured = false,
  metadata,
  ordinal,
  priority = false,
  title,
  workId,
}: ShowcaseCardProps) {
  return (
    <article
      className={cn(
        "w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/2.4)] shrink-0 snap-start",
        featured ? "md:w-[min(86vw,20rem)]" : "md:w-[min(74vw,14rem)]",
        className,
      )}
      data-card-presentation="showcase"
      data-featured={featured ? "true" : undefined}
    >
      <Link
        aria-label={mediaStrings.openDetails(title)}
        className={cn(
          "group/showcase relative block h-full min-h-[var(--control-min-size)] overflow-hidden rounded-[var(--radius-card)] border bg-surface-1 transition-[transform,border-color,box-shadow] duration-[var(--motion-duration-feedback)] aspect-[4/3] focus-visible:border-line-accent [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none md:h-[13.5rem] md:aspect-auto",
          featured
            ? "border-accent shadow-[var(--shadow-raised)]"
            : "border-line [@media(hover:hover)_and_(pointer:fine)]:hover:border-line-accent",
        )}
        params={{ workId }}
        preload={false}
        to="/works/$workId"
      >
        <span aria-hidden="true">
          <CoverImage
            className="pointer-events-none absolute inset-0 size-full rounded-none border-0 opacity-70 [&_.cover-image__image]:object-cover [&_.cover-image__placeholder-content]:hidden [&_.cover-image__skeleton]:hidden"
            coverUrl={coverUrl}
            creators={creators}
            decorative
            priority={priority}
            requestedSize={featured ? 600 : 400}
            title={title}
          />
          <CoverImage
            className={cn(
              "pointer-events-none absolute top-0 right-0 h-full w-[64%] rounded-none border-0 bg-transparent opacity-95 [mask-image:linear-gradient(to_left,black_72%,transparent_100%)]",
              featured ? "md:w-[62%]" : "md:w-[58%]",
            )}
            coverUrl={coverUrl}
            creators={creators}
            decorative
            priority={priority}
            requestedSize={featured ? 600 : 400}
            title={title}
          />
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,var(--canvas)_0%,color-mix(in_oklch,var(--canvas)_82%,transparent)_32%,color-mix(in_oklch,var(--canvas)_30%,transparent)_60%,transparent_85%)]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--canvas)_55%,transparent)_0%,color-mix(in_oklch,var(--canvas)_20%,transparent)_48%,transparent_80%)]"
        />
        {ordinal === undefined ? null : (
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-[var(--space-2)] left-[var(--space-2)] z-10 inline-flex size-7 items-center justify-center rounded-[var(--radius-cover)] bg-accent font-display text-[length:var(--font-size-14)] leading-none font-bold text-on-accent shadow-[var(--shadow-level-1)] md:size-8 md:text-[length:var(--font-size-16)]",
              featured && "ring-1 ring-accent-hover",
            )}
          >
            {ordinal}
          </span>
        )}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-10 grid max-w-[82%] gap-[var(--space-content-tight)] p-[var(--space-3)] md:max-w-[72%]",
            featured && "md:max-w-[66%] md:p-[var(--space-4)]",
          )}
        >
          <h3 className="line-clamp-2 text-[length:var(--font-size-16)] leading-tight font-bold text-text-strong [overflow-wrap:anywhere] md:text-[length:var(--text-subheading-size)]">
            {title}
          </h3>
          <p className="line-clamp-1 text-[length:var(--text-caption-size)] leading-tight text-text-muted">
            {coverStrings.creatorLine(creators)}
          </p>
          {metadata === undefined ? null : (
            <div className="line-clamp-1 text-[length:var(--text-caption-size)] leading-tight text-text">
              {metadata}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
