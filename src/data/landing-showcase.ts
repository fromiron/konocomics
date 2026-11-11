export const landingEditorialRankingIds = [
  "a-silent-voice",
  "akira",
  "attack-on-titan",
  "berserk",
  "blame",
  "blue-lock",
  "cardcaptor-sakura",
  "chainsaw-man",
  "chihayafuru",
  "death-note",
] as const;

/**
 * Fixed taste profile behind the home's sample shelves and hero speech balloon. The build ranks
 * it with the real engine, so the example reasons come only from its returned contributions.
 */
export const landingSampleProfile = [
  { workId: "monster", reaction: "favorite" },
  { workId: "promised-neverland", reaction: "liked" },
  { workId: "mushishi", reaction: "liked" },
  { workId: "made-in-abyss", reaction: "liked" },
  { workId: "tokyo-revengers", reaction: "liked" },
] as const;

/** How many of the sample's recommendations the home shows as stage cards. */
export const LANDING_STAGE_COUNT = 3;
/** The fewest cards the sample's expand shelf may have; the build fails below it. */
export const LANDING_LENS_MIN_ITEMS = 4;
