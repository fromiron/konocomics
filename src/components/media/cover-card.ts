/**
 * The common cover card parts of the shelf card grammar (04 §2.10). Every card that shows a cover
 * shares them: the shelf grades add their own geometry and motion, and the onboarding selection
 * cards keep their stamps.
 */

/** The face: no border or shadow, transparent at rest and `surface-2` on hover or focus. */
export const COVER_CARD_SURFACE_CLASSNAME =
  "bg-transparent focus-within:bg-surface-2 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-2";

/** The face's colour change, for cards whose own motion does not already set `transition`. */
export const COVER_CARD_SURFACE_TRANSITION_CLASSNAME =
  "transition-colors duration-[var(--motion-duration-value)] ease-[var(--motion-ease-direct)] motion-reduce:transition-none";

/** The card's identity link: the cover and title lead to the work's detail page. */
export const COVER_CARD_IDENTITY_LINK_CLASSNAME =
  "min-h-[var(--control-min-size)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring";

/** The title outside the cover: two lines, reserved so cards in a row keep one height. */
export const COVER_CARD_TITLE_CLASSNAME =
  "line-clamp-2 text-[length:var(--font-size-14)] leading-tight font-bold text-text-strong min-h-[2.5em]";

/** One muted line under the title, such as the creators. */
export const COVER_CARD_META_CLASSNAME =
  "line-clamp-1 text-[length:var(--text-caption-size)] text-text-muted";
