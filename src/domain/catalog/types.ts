import type {
  ART_AXIS_IDS,
  AXIS_IDS,
  DEMOGRAPHICS,
  EDITION_KINDS,
  FACTOR_SOURCE_TYPES,
  GENRE_TAGS,
  NARRATIVE_AXIS_IDS,
  THEME_TAGS,
  TONE_AXIS_IDS,
  WORK_STATUSES,
} from "./constants";

export type GenreTag = (typeof GENRE_TAGS)[number];
export type ThemeTag = (typeof THEME_TAGS)[number];
export type AxisId = (typeof AXIS_IDS)[number];
export type NarrativeAxisId = (typeof NARRATIVE_AXIS_IDS)[number];
export type ToneAxisId = (typeof TONE_AXIS_IDS)[number];
export type ArtAxisId = (typeof ART_AXIS_IDS)[number];
export type Demographic = (typeof DEMOGRAPHICS)[number];
export type WorkStatus = (typeof WORK_STATUSES)[number];
export type EditionKind = (typeof EDITION_KINDS)[number];
export type FactorSourceType = (typeof FACTOR_SOURCE_TYPES)[number];
export type ScaleValue = 0 | 1 | 2 | 3 | 4;

export type AxisFactor =
  | { state: "known"; value: ScaleValue; confidence: number }
  | { state: "unknown" }
  | { state: "notApplicable" };

export type WorkAxes = Record<AxisId, AxisFactor>;

export type ThemeFactor = {
  id: ThemeTag;
  centrality: 1 | 2;
  confidence: number;
};

export type CatalogEligibility = {
  onboardingEligible: boolean;
  recommendationEligible: boolean;
  libraryOnly: boolean;
};

export type WorkEvidence = {
  metadataConfidence: number;
  groupingConfidence: number;
  sourceAgreement: number;
  annotationReviewedAt?: string;
};

export type Work = {
  id: string;
  title: string;
  titleKana?: string;
  aliases: string[];
  creators: string[];
  publisher?: string;
  demographic?: Demographic;
  status: WorkStatus;
  firstPublishedYear?: number;
  genres: GenreTag[];
  themes: ThemeFactor[];
  axes: WorkAxes;
  factorScope: "entry_1_3_volumes";
  eligibility: CatalogEligibility;
  evidence: WorkEvidence;
};

export type Volume = {
  id: string;
  workId: string;
  volumeNumber?: number;
  isbn: string;
  releaseDate?: string;
  editionKind: EditionKind;
};

export type FactorEvidence = {
  sourceType: FactorSourceType;
  sourceUrl?: string;
  fetchedAt: string;
  extractorVersion?: string;
  reviewedByHuman: boolean;
  confidence: number;
};

export type CatalogV1 = {
  schemaVersion: 1;
  catalogVersion: string;
  factorDictionaryVersion: "v1";
  works: Work[];
  volumes: Volume[];
  representativeVolumeByWorkId: Record<string, string>;
};

export type CoverageGroup = "genre" | "theme" | "narrative" | "tone" | "art";

export type WorkCoverage = Record<CoverageGroup, number>;
