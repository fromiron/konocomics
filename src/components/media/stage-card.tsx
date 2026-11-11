import { Link } from "@tanstack/react-router";
import { useCallback, type ComponentProps, type ReactNode } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { CoverBackdrop } from "@/components/media/cover-backdrop";
import { usePointerEffect } from "@/components/motion/use-pointer-effects";

type DataAttributes = Readonly<{ [key: `data-${string}`]: string | boolean | undefined }>;
type BackdropData = ComponentProps<typeof CoverBackdrop>["imageData"];

export type StageCardProps = Readonly<{
  workId: string;
  title: string;
  creators: readonly string[];
  coverUrl?: string | null;
  /** Accessible name of the cover link to the work's detail page. */
  coverLinkLabel: string;
  priority?: boolean;
  onCoverVisible?: () => void;
  /** One muted line under the title. */
  meta?: ReactNode;
  /** Up to two lines at rest (two are always reserved); up to three on hover or focus. */
  reason: ReactNode;
  /** The row that opens on hover or focus. */
  actions?: ReactNode;
  articleRef?: (element: HTMLElement | null) => void;
  /** Data attributes for the caller's own hooks on each part. */
  articleData?: DataAttributes;
  coverLinkData?: DataAttributes;
  reasonData?: DataAttributes;
  backdropData?: BackdropData;
  scrimData?: BackdropData;
}>;

/**
 * The stage card: a fixed frame that takes the colour of its own blurred cover, with the cover on
 * a stage in the middle. At rest it shows up to two lines of reason in a two-line slot, so every
 * card's cover is the same size; on hover or focus the reason grows to three lines and the action
 * row opens (`.stage-card` in globals.css). The caller supplies the evidence.
 */
export function StageCard({
  actions,
  articleData,
  articleRef,
  backdropData,
  coverLinkData,
  coverLinkLabel,
  coverUrl,
  creators,
  meta,
  onCoverVisible,
  priority = false,
  reason,
  reasonData,
  scrimData,
  title,
  workId,
}: StageCardProps) {
  // A soft light follows a fine pointer; the card never changes angle (04 §6 G).
  const attachGlare = usePointerEffect<HTMLElement>("light");
  const setArticle = useCallback(
    (element: HTMLElement | null) => {
      attachGlare(element);
      articleRef?.(element);
    },
    [articleRef, attachGlare],
  );

  return (
    <article
      className="stage-card group/card relative isolate flex h-[24.75rem] w-full flex-col overflow-hidden rounded-[var(--radius-media-card)] border border-line/70 p-[var(--space-4)] focus-within:border-line-accent md:h-[28rem] md:p-[var(--space-5)]"
      {...articleData}
      ref={setArticle}
      tabIndex={-1}
    >
      <span aria-hidden="true" className="pointer-glare" />
      <CoverBackdrop coverUrl={coverUrl} imageData={backdropData} scrimData={scrimData} />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <h3 className="h-[3.25rem] shrink-0 line-clamp-2 text-[length:var(--font-size-20)] leading-[var(--line-height-heading)] font-bold text-text-strong">
          {title}
        </h3>
        {meta === undefined ? null : (
          <div className="stage-card__meta flex min-w-0 shrink-0 flex-nowrap items-baseline gap-[var(--space-1)] overflow-hidden pt-[var(--space-1)] text-[length:var(--text-caption-size)] text-text-muted">
            {meta}
          </div>
        )}
        <div className="stage-card__stage flex min-h-0 flex-1 items-center justify-center py-[var(--space-3)] md:py-[var(--space-4)]">
          <Link
            aria-label={coverLinkLabel}
            className="stage-card__artwork block h-full max-h-full w-fit max-w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring"
            {...coverLinkData}
            params={{ workId }}
            preload={false}
            to="/works/$workId"
          >
            <CoverImage
              className="h-full w-auto max-h-full max-w-full rounded-[var(--radius-cover)] border border-line/60 shadow-[var(--shadow-cover-featured)]"
              coverUrl={coverUrl}
              creators={creators}
              matchSourceAspectRatio
              onVisible={onCoverVisible}
              priority={priority}
              requestedSize={400}
              title={title}
            />
          </Link>
        </div>
        <p
          className="stage-card__reason line-clamp-3 shrink-0 overflow-hidden text-[length:var(--font-size-12)] leading-[1.45] text-text md:text-[length:var(--font-size-14)]"
          {...reasonData}
        >
          {reason}
        </p>
        {actions === undefined ? null : (
          <div className="stage-card__actions mt-[var(--space-2)] flex min-h-[var(--control-min-size)] min-w-0 shrink-0 flex-nowrap items-center gap-[var(--space-1)]">
            {actions}
          </div>
        )}
      </div>
    </article>
  );
}
