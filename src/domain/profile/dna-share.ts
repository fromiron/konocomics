import { AXIS_IDS, GENRE_TAGS, THEME_TAGS } from "../catalog/constants";
import { catalogIdSchema } from "../catalog/schema";
import type { AxisId, GenreTag, ThemeTag } from "../catalog/types";
import { rankDnaWheelAxes, type MangaDnaSummary } from "./dna-summary";

export const DNA_SHARE_LINK_VERSION = "1";
export const DNA_SHARE_TOP_LIMIT = 3;
export const DNA_SHARE_MAX_EVIDENCE = 3;
export const DNA_SHARE_MAX_NAMED_WORKS = 30;
export const DNA_SHARE_MAX_RECOMMENDATIONS = 4;
const DNA_SHARE_MAX_ANALYZED_WORKS = 9999;

/**
 * Frozen v1 Axis codes: the 2026-10-01 `AXIS_IDS` order mapped to `0-9a-g`. Shared links keep
 * this table forever; a new Axis order needs a new link version.
 */
const V1_AXIS_CODES: readonly AxisId[] = [
  "progression",
  "problemSolving",
  "strategy",
  "pacing",
  "mysteryReveal",
  "worldBuilding",
  "characterArcWeight",
  "relationshipStructure",
  "comedy",
  "darkness",
  "mentalStress",
  "romance",
  "emotionalWarmth",
  "artRealism",
  "artDensity",
  "visualSoftness",
  "motionImpact",
];
const CODE_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
const REASON_FACTOR_IDS = new Set<string>([...AXIS_IDS, ...GENRE_TAGS, ...THEME_TAGS]);

export type DnaShareLevel = 0 | 1 | 2 | 3 | 4;
export type DnaShareReasonFactorId = AxisId | GenreTag | ThemeTag;

export type DnaShareLinkAxis = Readonly<{ axisId: AxisId; level: DnaShareLevel }>;
export type DnaShareLinkRecommendation = Readonly<{
  workId: string;
  /** The factor of the engine's lead similarity reason; absent when there was none. */
  reasonFactorId?: DnaShareReasonFactorId;
}>;

export type DnaShareLink = Readonly<{
  /** The DNA wheel's known Axes in wheel order, at most 8. */
  axes: readonly DnaShareLinkAxis[];
  /** Wheel positions that carry a rank badge, rank order. */
  topPositions: readonly number[];
  /** Analysed works the sharer chose to name, top-Axis evidence first. */
  workIds: readonly string[];
  /** Named evidence works behind each top position, aligned with `topPositions`. */
  evidence: readonly (readonly string[])[];
  /** Distinct analysed works, named or not. */
  analyzedWorkCount: number;
  recommendations: readonly DnaShareLinkRecommendation[];
}>;

/** The qualitative band index of a 0–4 preference, matching the Manga DNA level labels. */
export function dnaShareLevel(value: number): DnaShareLevel {
  if (value < 0.5) return 0;
  if (value < 1.5) return 1;
  if (value < 2.5) return 2;
  if (value < 3.5) return 3;
  return 4;
}

function isReasonFactorId(value: string): value is DnaShareReasonFactorId {
  return REASON_FACTOR_IDS.has(value);
}

function isCatalogId(value: string) {
  return catalogIdSchema.safeParse(value).success;
}

/** Every analysed work, with the evidence behind the top wheel Axes first. */
export function dnaShareWorkCandidates(summary: Pick<MangaDnaSummary, "analyzedWorkIds" | "axes">) {
  const analyzed = new Set(summary.analyzedWorkIds);
  return [
    ...new Set([
      ...rankDnaWheelAxes(summary.axes)
        .slice(0, DNA_SHARE_TOP_LIMIT)
        .flatMap((axis) => axis.anchorWorkIds)
        .filter((workId) => analyzed.has(workId)),
      ...summary.analyzedWorkIds,
    ]),
  ];
}

/**
 * Projects a Manga DNA summary onto a share link. The Axes are exactly the DNA wheel's, at their
 * qualitative level. Naming fewer works changes which titles the link carries, never the analysed
 * work count. Returns null when the wheel has nothing to show.
 */
export function buildDnaShareLink(input: {
  summary: Pick<MangaDnaSummary, "analyzedWorkIds" | "axes">;
  publicWorkIds: ReadonlySet<string>;
  recommendations: readonly DnaShareLinkRecommendation[];
}): DnaShareLink | null {
  const { summary, publicWorkIds } = input;
  const wheel = rankDnaWheelAxes(summary.axes);
  const analyzedWorkCount = new Set(summary.analyzedWorkIds).size;
  if (wheel.length === 0 || analyzedWorkCount === 0) return null;
  const top = wheel.slice(0, DNA_SHARE_TOP_LIMIT);
  const workIds = dnaShareWorkCandidates(summary)
    .filter((workId) => publicWorkIds.has(workId) && isCatalogId(workId))
    .slice(0, DNA_SHARE_MAX_NAMED_WORKS);
  const named = new Set(workIds);
  const seenRecommendations = new Set<string>();
  return {
    axes: wheel.map((axis) => ({ axisId: axis.factorId, level: dnaShareLevel(axis.value) })),
    topPositions: top.map((_, index) => index),
    workIds,
    evidence: top.map((axis) =>
      axis.anchorWorkIds.filter((workId) => named.has(workId)).slice(0, DNA_SHARE_MAX_EVIDENCE),
    ),
    analyzedWorkCount: Math.min(analyzedWorkCount, DNA_SHARE_MAX_ANALYZED_WORKS),
    recommendations: input.recommendations
      .filter((recommendation) => {
        if (!isCatalogId(recommendation.workId)) return false;
        if (seenRecommendations.has(recommendation.workId)) return false;
        seenRecommendations.add(recommendation.workId);
        return true;
      })
      .slice(0, DNA_SHARE_MAX_RECOMMENDATIONS),
  };
}

/** The `/share` query of a link (without `?`). Every value is URL-safe as written. */
export function formatDnaShareLinkSearch(link: DnaShareLink) {
  const parts: [string, string][] = [
    ["v", DNA_SHARE_LINK_VERSION],
    ["dna", link.axes.map((axis) => String(axis.level)).join("")],
    [
      "ax",
      link.axes.map((axis) => CODE_ALPHABET[V1_AXIS_CODES.indexOf(axis.axisId)] ?? "").join(""),
    ],
    ["top", link.topPositions.join("")],
  ];
  if (link.workIds.length > 0) parts.push(["w", link.workIds.join(",")]);
  if (link.evidence.some((group) => group.length > 0)) {
    parts.push([
      "e",
      link.evidence
        .map((group) =>
          group.map((workId) => CODE_ALPHABET[link.workIds.indexOf(workId)] ?? "").join(""),
        )
        .join(","),
    ]);
  }
  if (link.analyzedWorkCount !== link.workIds.length) {
    parts.push(["n", String(link.analyzedWorkCount)]);
  }
  if (link.recommendations.length > 0) {
    parts.push([
      "r",
      link.recommendations
        .map((recommendation) =>
          recommendation.reasonFactorId === undefined
            ? recommendation.workId
            : `${recommendation.workId}:${recommendation.reasonFactorId}`,
        )
        .join(","),
    ]);
  }
  return parts.map(([key, value]) => `${key}=${value}`).join("&");
}

function distinct(values: readonly string[]) {
  return new Set(values).size === values.length;
}

/**
 * Strictly reads a `/share` query. Any malformed or inconsistent value rejects the whole link;
 * well-formed ids that the current Catalog no longer knows are left for the caller to skip.
 */
export function parseDnaShareLink(search: string): DnaShareLink | null {
  const params = new URLSearchParams(search);
  const read = (key: string): string | undefined | null => {
    const values = params.getAll(key);
    if (values.length === 0) return undefined;
    return values.length === 1 ? (values[0] ?? null) : null;
  };
  const version = read("v");
  const dna = read("dna");
  const axisCodes = read("ax");
  const top = read("top");
  const works = read("w");
  const evidenceCodes = read("e");
  const count = read("n");
  const recommendationValues = read("r");
  if (
    version !== DNA_SHARE_LINK_VERSION ||
    typeof dna !== "string" ||
    typeof axisCodes !== "string" ||
    typeof top !== "string" ||
    works === null ||
    evidenceCodes === null ||
    count === null ||
    recommendationValues === null
  ) {
    return null;
  }

  if (!/^[0-4]{1,8}$/u.test(dna) || axisCodes.length !== dna.length) return null;
  const axes: DnaShareLinkAxis[] = [];
  for (const [index, code] of [...axisCodes].entries()) {
    const axisId = V1_AXIS_CODES[CODE_ALPHABET.indexOf(code)];
    if (axisId === undefined) return null;
    axes.push({ axisId, level: Number(dna[index]) as DnaShareLevel });
  }
  if (!distinct(axes.map((axis) => axis.axisId))) return null;

  if (!new RegExp(`^[0-7]{1,${String(DNA_SHARE_TOP_LIMIT)}}$`, "u").test(top)) return null;
  const topPositions = [...top].map(Number);
  if (!distinct(top.split("")) || topPositions.some((position) => position >= axes.length)) {
    return null;
  }

  const workIds = works === undefined ? [] : works.split(",");
  if (
    workIds.length > DNA_SHARE_MAX_NAMED_WORKS ||
    !workIds.every(isCatalogId) ||
    !distinct(workIds)
  ) {
    return null;
  }

  let evidence: string[][] = topPositions.map(() => []);
  if (evidenceCodes !== undefined) {
    const groups = evidenceCodes.split(",");
    if (groups.length !== topPositions.length) return null;
    const parsedGroups: string[][] = [];
    for (const group of groups) {
      if (group.length > DNA_SHARE_MAX_EVIDENCE || !distinct(group.split(""))) return null;
      const groupWorkIds: string[] = [];
      for (const code of group) {
        const workId = workIds[CODE_ALPHABET.indexOf(code)];
        if (workId === undefined) return null;
        groupWorkIds.push(workId);
      }
      parsedGroups.push(groupWorkIds);
    }
    evidence = parsedGroups;
  }

  let analyzedWorkCount = workIds.length;
  if (count !== undefined) {
    if (!/^[1-9]\d{0,3}$/u.test(count) || Number(count) < workIds.length) return null;
    analyzedWorkCount = Number(count);
  }
  if (analyzedWorkCount === 0) return null;

  const recommendations: DnaShareLinkRecommendation[] = [];
  if (recommendationValues !== undefined) {
    const entries = recommendationValues.split(",");
    if (entries.length > DNA_SHARE_MAX_RECOMMENDATIONS) return null;
    for (const entry of entries) {
      const [workId = "", reasonFactorId, ...rest] = entry.split(":");
      if (rest.length > 0 || !isCatalogId(workId)) return null;
      if (reasonFactorId === undefined) {
        recommendations.push({ workId });
      } else if (isReasonFactorId(reasonFactorId)) {
        recommendations.push({ workId, reasonFactorId });
      } else {
        return null;
      }
    }
    if (!distinct(recommendations.map((recommendation) => recommendation.workId))) return null;
  }

  return { axes, topPositions, workIds, evidence, analyzedWorkCount, recommendations };
}
