import { coverSourceForSize } from "@/components/cover/CoverImage";

type CoverBackdropProps = Readonly<{
  coverUrl?: string | null;
  /** Data attributes for the image and scrim, so a caller's tests can find them. */
  imageData?: Readonly<Record<`data-${string}`, string | boolean>>;
  scrimData?: Readonly<Record<`data-${string}`, string | boolean>>;
}>;

/**
 * The same cover, blurred and dimmed behind a card, so each card takes the colour of its work
 * (the recommendations featured card language). Renders nothing without a cover; a failed image
 * hides itself and leaves the card surface.
 */
export function CoverBackdrop({ coverUrl, imageData, scrimData }: CoverBackdropProps) {
  const source = coverUrl?.trim() ? coverSourceForSize(coverUrl, 400) : "";
  if (source === "") return null;
  return (
    <>
      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full scale-110 object-cover opacity-75 blur-md saturate-125"
        decoding="async"
        draggable={false}
        key={source}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.hidden = true;
        }}
        src={source}
        {...imageData}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-hero-scrim"
        {...scrimData}
      />
    </>
  );
}
