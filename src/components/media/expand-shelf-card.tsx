import { Link } from "@tanstack/react-router";
import { ScanSearchIcon } from "lucide-react";
import type { ComponentPropsWithoutRef, MouseEventHandler, ReactNode } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import {
  COVER_CARD_IDENTITY_LINK_CLASSNAME,
  COVER_CARD_SURFACE_CLASSNAME,
  COVER_CARD_TITLE_CLASSNAME,
} from "@/components/media/cover-card";
import { ExpandableMediaCard } from "@/components/media/expandable-media-card";
import { QuietTextAction } from "@/components/media/state-action-row";
import { mediaStrings, recommendationStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

// No border or shadow on the card: transparent at rest, `surface-2` on approach (04 §2.10).
export const EXPAND_CARD_SURFACE_CLASSNAME = `group/shelf-card overflow-hidden rounded-[var(--radius-media-card)] ${COVER_CARD_SURFACE_CLASSNAME} data-[expanded=true]:bg-surface-2`;
export const EXPAND_CARD_IDENTITY_LINK_CLASSNAME = COVER_CARD_IDENTITY_LINK_CLASSNAME;

/** The quiet control that opens Quick Preview for one work. */
export function QuickPreviewControl({
  className,
  onClick,
  title,
}: Readonly<{ className?: string; onClick: MouseEventHandler<HTMLButtonElement>; title: string }>) {
  return (
    <QuietTextAction
      aria-label={recommendationStrings.quickPreview.open(title)}
      className={cn("gap-[var(--space-1)] px-0 whitespace-nowrap", className)}
      onClick={onClick}
    >
      <ScanSearchIcon aria-hidden="true" className="size-4" />
      {recommendationStrings.quickPreview.openLabel}
    </QuietTextAction>
  );
}

/** Where the card cannot expand (touch, below `md`), its preview control takes the panel's place. */
export function ExpandCardPreviewSlot({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="fine-hover:hidden">{children}</div>;
}

type ExpandShelfCardProps = Omit<
  ComponentPropsWithoutRef<"article">,
  "children" | "className" | "title"
> &
  Readonly<{
    workId: string;
    title: string;
    creators: readonly string[];
    coverUrl?: string | null;
    onCoverVisible?: () => void;
    priority?: boolean;
    expanded: boolean;
    onExpandedChange: (expanded: boolean) => void;
    /** What the card opens beside its cover, usually an `ExpandPanel`. */
    panel: ReactNode;
    /** Shown under the title only where the card cannot expand, usually `QuickPreviewControl`. */
    preview?: ReactNode;
  }>;

/**
 * The shelf's expand card at rest: the cover and a two-line title as one link to the work, sized
 * for an eight-across shelf, opening `panel` on hover intent or keyboard focus (04 §2.10). Spread
 * `useExpandShelf().cardProps(key)` for `expanded` and `onExpandedChange`.
 */
export function ExpandShelfCard({
  coverUrl,
  creators,
  expanded,
  onCoverVisible,
  onExpandedChange,
  panel,
  preview,
  priority,
  title,
  workId,
  ...props
}: ExpandShelfCardProps) {
  return (
    <ExpandableMediaCard
      {...props}
      className={cn(
        EXPAND_CARD_SURFACE_CLASSNAME,
        "shrink-0 snap-start border border-transparent",
        "w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/2.4)] max-w-44 sm:w-32 md:w-[calc((100%-var(--space-content-loose)*7)/8)] md:min-w-28 md:max-w-32",
      )}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      panel={panel}
    >
      <div className="p-[var(--space-2)] md:py-[var(--space-3)]">
        <Link
          aria-label={mediaStrings.openDetails(title)}
          className={cn(EXPAND_CARD_IDENTITY_LINK_CLASSNAME, "relative !grid gap-[var(--space-2)]")}
          params={{ workId }}
          preload={false}
          to="/works/$workId"
        >
          <CoverImage
            className="aspect-[30/43] w-full overflow-hidden rounded-[var(--radius-cover)] border border-transparent bg-transparent"
            coverUrl={coverUrl}
            creators={creators}
            fit="cover-square"
            onVisible={onCoverVisible}
            priority={priority}
            requestedSize={400}
            title={title}
          />
          <h3 className={COVER_CARD_TITLE_CLASSNAME}>{title}</h3>
        </Link>
        {preview === undefined ? null : <ExpandCardPreviewSlot>{preview}</ExpandCardPreviewSlot>}
      </div>
    </ExpandableMediaCard>
  );
}
