import { cn } from "@/lib/utils";

const STAGE_FRAME_COUNT = 4;
const SHELF_COVER_COUNT = 8;

/** One screentone block (04 §2.5); the pulse runs only while loading. */
function Tone({ className }: Readonly<{ className: string }>) {
  return (
    <span
      className={cn("skeleton-tone block rounded-[var(--radius-cover)]", className)}
      data-reduced-motion="fade"
    />
  );
}

/** A stage card's frame at the real card's size, with its title, meta, cover and reason slots. */
function StageFrame() {
  return (
    <li
      className="flex h-[24.75rem] shrink-0 basis-[var(--featured-card-basis)] flex-col rounded-[var(--radius-media-card)] border border-line/70 bg-surface-1 p-[var(--space-4)] md:h-[28rem] md:p-[var(--space-5)]"
      data-recommendation-skeleton-frame
    >
      <Tone className="h-[var(--space-5)] w-2/3" />
      <Tone className="mt-[var(--space-3)] h-[var(--space-3)] w-1/2" />
      <div className="flex min-h-0 flex-1 items-center justify-center py-[var(--space-4)]">
        <Tone className="aspect-[30/43] h-full max-w-full" />
      </div>
      <Tone className="h-[var(--space-3)] w-full" />
    </li>
  );
}

/** A shelf heading and its cover slots at the width of the real shelf cards. */
function ShelfRow() {
  return (
    <div className="mt-[var(--space-shelf-group)] grid gap-[var(--space-3)]">
      <Tone className="h-[var(--space-5)] w-[calc(var(--control-min-size)*4)]" />
      <ul className="m-0 flex list-none gap-[var(--space-content-loose)] overflow-hidden p-0">
        {Array.from({ length: SHELF_COVER_COUNT }, (_, index) => (
          <li
            className="grid w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/2.4)] max-w-44 shrink-0 gap-[var(--space-2)] p-[var(--space-2)] sm:w-32 md:w-[calc((100%-var(--space-content-loose)*7)/8)] md:min-w-28 md:max-w-32"
            data-recommendation-skeleton-cover
            key={index}
          >
            <Tone className="aspect-[30/43] w-full" />
            <Tone className="h-[var(--space-3)] w-3/4" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Loading placeholders in the shape of the real page: stage card frames for the featured shelf,
 * then the cover slots of the next shelf (03 §5). The status line is for assistive technology;
 * the silhouettes say the same thing on screen.
 */
export function RecommendationsSkeleton({ status }: Readonly<{ status: string }>) {
  return (
    <div className="recommendations-skeleton min-w-0">
      <p className="sr-only" role="status">
        {status}
      </p>
      <div aria-hidden="true">
        <ul className="m-0 flex list-none gap-[var(--space-3)] overflow-hidden p-0 [--featured-card-basis:17rem] sm:[--featured-card-basis:19rem] fine-hover:[--featured-card-basis:21.5rem]">
          {Array.from({ length: STAGE_FRAME_COUNT }, (_, index) => (
            <StageFrame key={index} />
          ))}
        </ul>
        <ShelfRow />
      </div>
    </div>
  );
}

/** The whole page before records or the Catalog are ready: header and toolbar slots, then shelves. */
export function RecommendationsLoadingPage({ status }: Readonly<{ status: string }>) {
  return (
    <main
      className="mx-auto min-h-dvh w-full max-w-[var(--layout-width-media)] overflow-hidden bg-canvas px-[var(--layout-page-padding)] pt-[var(--layout-page-block-start)]"
      data-recommendations-loading
    >
      <div aria-hidden="true" className="mb-[var(--space-6)] grid gap-[var(--space-3)]">
        <Tone className="h-[var(--space-8)] w-[calc(var(--control-min-size)*6)] max-w-full" />
        <Tone className="h-[var(--space-4)] w-full max-w-[var(--layout-width-form)]" />
        <div className="flex gap-[var(--space-2)] overflow-hidden">
          {Array.from({ length: 4 }, (_, index) => (
            <Tone
              className="h-[var(--control-min-size)] w-[calc(var(--control-min-size)*3)] shrink-0 rounded-[var(--radius-pill)]"
              key={index}
            />
          ))}
        </div>
        <Tone className="mt-[var(--space-3)] h-[var(--space-5)] w-[calc(var(--control-min-size)*5)] max-w-full" />
      </div>
      <RecommendationsSkeleton status={status} />
    </main>
  );
}
