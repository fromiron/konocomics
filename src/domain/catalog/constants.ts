export const GENRE_TAGS = [
  "action",
  "fantasy",
  "historical",
  "scienceFiction",
  "mystery",
  "sports",
  "comedy",
  "horror",
  "sliceOfLife",
  "romance",
] as const;

export const THEME_TAGS = [
  "adventure",
  "combat",
  "martialArts",
  "war",
  "politics",
  "survival",
  "investigation",
  "dungeon",
  "crafting",
  "cooking",
  "territoryManagement",
  "tournament",
  "revenge",
  "timeTravel",
  "reincarnation",
  "school",
  "workplace",
  "sportsCompetition",
  "foundFamily",
  "historicalReconstruction",
  "postApocalypse",
  "exploration",
] as const;

export const NARRATIVE_AXIS_IDS = [
  "progression",
  "problemSolving",
  "strategy",
  "pacing",
  "mysteryReveal",
  "worldBuilding",
] as const;

export const TONE_AXIS_IDS = [
  "characterArcWeight",
  "relationshipStructure",
  "comedy",
  "darkness",
  "mentalStress",
  "romance",
  "emotionalWarmth",
] as const;

export const ART_AXIS_IDS = ["artRealism", "artDensity", "visualSoftness", "motionImpact"] as const;

export const AXIS_IDS = [...NARRATIVE_AXIS_IDS, ...TONE_AXIS_IDS, ...ART_AXIS_IDS] as const;

export const DEMOGRAPHICS = [
  "shonen",
  "seinen",
  "shojo",
  "josei",
  "children",
  "general",
  "unknown",
] as const;

export const WORK_STATUSES = ["ongoing", "completed", "hiatus", "unknown"] as const;

export const EDITION_KINDS = [
  "standard",
  "digital",
  "bunko",
  "complete",
  "limited",
  "set",
  "unknown",
] as const;

export const FACTOR_SOURCE_TYPES = ["rakuten", "publisher", "manual", "model"] as const;

export const COVERAGE_GROUPS = ["genre", "theme", "narrative", "tone", "art"] as const;

export const PROMOTION_REQUIRED_COVERAGE_GROUPS = ["genre", "theme", "narrative", "tone"] as const;

export const COVERAGE_THRESHOLDS = {
  genre: 0.8,
  theme: 0.6,
  narrative: 0.6,
  tone: 0.6,
  art: 0.3,
} as const;
