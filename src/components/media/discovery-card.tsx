import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import {
  COVER_CARD_IDENTITY_LINK_CLASSNAME,
  COVER_CARD_META_CLASSNAME,
  COVER_CARD_SURFACE_CLASSNAME,
  COVER_CARD_SURFACE_TRANSITION_CLASSNAME,
} from "@/components/media/cover-card";
import { mediaStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

type DataAttributes = Readonly<{ [key: `data-${string}`]: string | boolean | undefined }>;

export type DiscoveryCardProps = Readonly<{
  workId: string;
  title: string;
  creators: readonly string[];
  coverUrl?: string | null;
  /** Always visible. Omit it when the caller has no evidence: the card never makes one up. */
  reason?: string;
  /** One muted line under the title, such as the creators. */
  byline?: string;
  /** Under the text, beside the cover. */
  action?: ReactNode;
  /**
   * A full-width row under the cover and text, such as a `DiscoveryReason` and a store link's
   * disclosure, for lines that read better at the card's full width.
   */
  footer?: ReactNode;
  priority?: boolean;
  onCoverVisible?: () => void;
  id?: string;
  marker?: string;
  /** Data attributes for the caller's own hooks on the card. */
  articleData?: DataAttributes;
}>;

/** The morph card's reason with its accent rule, always visible (04 §2.10). */
export function DiscoveryReason({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <p className="border-l-2 border-accent/50 pl-[var(--space-2)] text-[length:var(--text-caption-size)] leading-[1.4] text-text-muted">
      {children}
    </p>
  );
}

/** Compact discovery presentation; its caller supplies the evidence and action. */
export function DiscoveryCard({
  action,
  articleData,
  byline,
  coverUrl,
  creators,
  footer,
  id,
  marker,
  onCoverVisible,
  priority = false,
  reason,
  title,
  workId,
}: DiscoveryCardProps) {
  const morphCover = Boolean(coverUrl?.trim());

  return (
    <article
      className={`group/shelf-card shrink-0 snap-start overflow-hidden rounded-[var(--radius-media-card)] border border-transparent ${COVER_CARD_SURFACE_CLASSNAME} ${COVER_CARD_SURFACE_TRANSITION_CLASSNAME} w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/1.8)] max-w-72 sm:w-64 md:w-[calc((100%-var(--space-content-loose)*4)/5)] md:min-w-60 grid grid-rows-[auto_minmax(0,1fr)] gap-[var(--space-2)] p-[var(--space-2)] md:grid-cols-[auto_minmax(0,1fr)] md:grid-rows-1 md:items-stretch md:py-[var(--space-3)]`}
      data-recommendation-shelf-card={marker}
      id={id}
      {...articleData}
    >
      {/* From `md` the cover has a fixed width, so the row grows with the text beside it and the
          text's action is never cut off; a width taken from the row height would feed back into
          the text's line breaks (03 §5). */}
      <Link
        aria-label={mediaStrings.openDetails(title)}
        className={cn(
          COVER_CARD_IDENTITY_LINK_CLASSNAME,
          "min-h-0 md:aspect-[30/43] md:w-[calc(var(--control-min-size)*2)] md:self-start",
        )}
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
          className={cn(COVER_CARD_IDENTITY_LINK_CLASSNAME, "min-w-0")}
          params={{ workId }}
          preload={false}
          to="/works/$workId"
        >
          <h3 className="line-clamp-2 text-[length:var(--font-size-14)] leading-tight font-bold text-text-strong">
            {title}
          </h3>
        </Link>
        {byline === undefined ? null : <p className={COVER_CARD_META_CLASSNAME}>{byline}</p>}
        {reason === undefined ? null : <DiscoveryReason>{reason}</DiscoveryReason>}
        {action}
      </div>
      {footer === undefined ? null : (
        <div className="grid gap-[var(--space-1)] md:col-span-2">{footer}</div>
      )}
    </article>
  );
}
