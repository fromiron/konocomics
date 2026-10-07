import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { mediaStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

export type DiscoveryCardProps = Readonly<{
  workId: string;
  title: string;
  creators: readonly string[];
  coverUrl?: string | null;
  reason: string;
  action: ReactNode;
  priority?: boolean;
  onCoverVisible?: () => void;
  id?: string;
  marker?: string;
}>;

/** Compact discovery presentation; its caller supplies the evidence and action. */
export function DiscoveryCard({
  action,
  coverUrl,
  creators,
  id,
  marker,
  onCoverVisible,
  priority = false,
  reason,
  title,
  workId,
}: DiscoveryCardProps) {
  const morphCover = Boolean(coverUrl?.trim());
  const identityLinkClassName =
    "min-h-[var(--control-min-size)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring";

  return (
    <article
      className="group/shelf-card shrink-0 snap-start overflow-hidden rounded-[var(--radius-media-card)] border border-transparent bg-transparent focus-within:bg-surface-2 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-2 transition-colors duration-[var(--motion-duration-value)] ease-[var(--motion-ease-direct)] motion-reduce:transition-none w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/1.8)] max-w-72 sm:w-64 md:w-[calc((100%-var(--space-content-loose)*4)/5)] md:min-w-60 grid grid-rows-[auto_minmax(0,1fr)] gap-[var(--space-2)] p-[var(--space-2)] md:grid-cols-[auto_minmax(0,1fr)] md:grid-rows-1 md:items-stretch md:py-[var(--space-3)]"
      data-recommendation-shelf-card={marker}
      id={id}
    >
      <Link
        aria-label={mediaStrings.openDetails(title)}
        className={cn(identityLinkClassName, "min-h-0 md:h-full md:w-auto md:aspect-[30/43]")}
        params={{ workId }}
        preload={false}
        to="/works/$workId"
      >
        <CoverImage
          className={cn(
            "aspect-[30/43] w-full overflow-hidden rounded-[var(--radius-cover)] border border-line/60 md:h-full md:w-full",
            morphCover &&
              "border-transparent [clip-path:inset(15.116279%_0_round_50%_/_34.883721%)] transition-[clip-path] duration-[var(--motion-duration-value)] ease-linear group-focus-within/shelf-card:[clip-path:inset(0_round_var(--radius-cover))] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/shelf-card:[clip-path:inset(0_round_var(--radius-cover))]",
          )}
          coverUrl={coverUrl}
          creators={creators}
          fit={morphCover ? "cover" : "contain"}
          matchSourceAspectRatio
          onVisible={onCoverVisible}
          priority={priority}
          requestedSize={400}
          title={title}
        />
      </Link>
      <div className="flex h-full min-h-0 min-w-0 flex-col gap-[var(--space-1)]">
        <Link
          className={cn(identityLinkClassName, "min-w-0")}
          params={{ workId }}
          preload={false}
          to="/works/$workId"
        >
          <h3 className="line-clamp-2 text-[length:var(--font-size-14)] leading-tight font-bold text-text-strong">
            {title}
          </h3>
        </Link>
        <p className="line-clamp-2 border-l-2 border-accent/50 pl-[var(--space-2)] text-[length:var(--text-caption-size)] leading-[1.4] text-text-muted">
          {reason}
        </p>
        {action}
      </div>
    </article>
  );
}
