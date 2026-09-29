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
 * Fixed taste profile behind the landing 「例」 card and DNA panel. The build ranks it with the
 * real engine, so the example reasons come only from its returned contributions.
 */
export const landingSampleProfile = [
  { workId: "monster", reaction: "favorite" },
  { workId: "promised-neverland", reaction: "liked" },
  { workId: "mushishi", reaction: "liked" },
  { workId: "made-in-abyss", reaction: "liked" },
  { workId: "tokyo-revengers", reaction: "liked" },
] as const;
