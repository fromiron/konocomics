/**
 * The accent themes a visitor can pick (04 §2.1, 2026-11-11 user decision). This list is the one
 * source of the allowed ids: the pre-paint script, the stylesheet's theme blocks and the selector
 * all read it. Colour values live only in the `globals.css` theme blocks.
 */
export const accentThemeIds = ["butter", "kinaka", "lime", "ice", "paper", "amber"] as const;

export type AccentThemeId = (typeof accentThemeIds)[number];

/** The default accent: carried by `:root`, so the document needs no attribute for it. */
export const defaultAccentThemeId: AccentThemeId = "butter";

/** The attribute that selects a theme block on `<html>` (and on each swatch in the selector). */
export const accentThemeAttribute = "data-accent";
