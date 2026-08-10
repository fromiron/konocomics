import { AXIS_IDS, GENRE_TAGS, THEME_TAGS } from "../catalog/constants";
import type { AxisId, GenreTag, ThemeTag, Work } from "../catalog/types";
import { roundScore } from "../recommendation/math";
import { REACTION_WEIGHTS } from "./constants";
import type { Reaction, UserWorkRecord } from "./types";

export type DnaPreferenceState = "known" | "unknown";
export type DnaPreference<FactorId extends string> = {
  factorId: FactorId;
  state: DnaPreferenceState;
  value: number | null;
  anchorWorkIds: string[];
};

export type DnaTopPreference = {
  kind: "axis" | "theme" | "genre";
  factorId: AxisId | ThemeTag | GenreTag;
  value: number;
  anchorWorkIds: string[];
};

export type MangaDnaSummary = {
  axes: DnaPreference<AxisId>[];
  themes: DnaPreference<ThemeTag>[];
  genres: DnaPreference<GenreTag>[];
  topPreferences: DnaTopPreference[];
};

type PositiveAnchor = {
  work: Work;
  weight: number;
};

type EvidenceCandidate = {
  workId: string;
  strength: number;
  weight: number;
};

const TOP_KIND_ORDER = { theme: 0, axis: 1, genre: 2 } as const;

function positiveReactionWeight(reaction: Reaction | undefined) {
  if (reaction !== "favorite" && reaction !== "liked") {
    return undefined;
  }
  return REACTION_WEIGHTS[reaction];
}

function positiveAnchors(works: readonly Work[], records: readonly UserWorkRecord[]) {
  const workById = new Map(works.map((work) => [work.id, work]));
  const weightByWorkId = new Map<string, number>();

  for (const record of records) {
    const weight = positiveReactionWeight(record.reaction);
    if (weight === undefined || !workById.has(record.workId)) {
      continue;
    }
    weightByWorkId.set(record.workId, Math.max(weightByWorkId.get(record.workId) ?? 0, weight));
  }

  return [...weightByWorkId.entries()]
    .sort(([leftId], [rightId]) => (leftId < rightId ? -1 : leftId > rightId ? 1 : 0))
    .flatMap(([workId, weight]): PositiveAnchor[] => {
      const work = workById.get(workId);
      return work === undefined ? [] : [{ work, weight }];
    });
}

function evidenceAnchorIds(candidates: readonly EvidenceCandidate[]) {
  return [...candidates]
    .filter((candidate) => candidate.strength > 0)
    .sort((left, right) => {
      if (left.strength !== right.strength) {
        return right.strength - left.strength;
      }
      if (left.weight !== right.weight) {
        return right.weight - left.weight;
      }
      return left.workId < right.workId ? -1 : left.workId > right.workId ? 1 : 0;
    })
    .slice(0, 3)
    .map((candidate) => candidate.workId);
}

function unknownPreference<FactorId extends string>(factorId: FactorId): DnaPreference<FactorId> {
  return { factorId, state: "unknown", value: null, anchorWorkIds: [] };
}

function summarizeAxis(anchors: readonly PositiveAnchor[], axisId: AxisId) {
  let numerator = 0;
  let denominator = 0;
  const evidence: EvidenceCandidate[] = [];

  for (const anchor of anchors) {
    const factor = anchor.work.axes[axisId];
    if (factor.state !== "known") {
      continue;
    }
    numerator += factor.value * anchor.weight;
    denominator += anchor.weight;
    evidence.push({
      workId: anchor.work.id,
      strength: factor.value * anchor.weight,
      weight: anchor.weight,
    });
  }

  if (denominator === 0) {
    return unknownPreference(axisId);
  }
  return {
    factorId: axisId,
    state: "known" as const,
    value: roundScore(numerator / denominator),
    anchorWorkIds: evidenceAnchorIds(evidence),
  };
}

function summarizeTheme(anchors: readonly PositiveAnchor[], themeId: ThemeTag) {
  const annotatedAnchors = anchors.filter((anchor) => anchor.work.themes.length > 0);
  if (annotatedAnchors.length === 0) {
    return unknownPreference(themeId);
  }

  let numerator = 0;
  let denominator = 0;
  const evidence: EvidenceCandidate[] = [];
  for (const anchor of annotatedAnchors) {
    const centrality = anchor.work.themes.find((theme) => theme.id === themeId)?.centrality ?? 0;
    const value = centrality * 2;
    numerator += value * anchor.weight;
    denominator += anchor.weight;
    evidence.push({
      workId: anchor.work.id,
      strength: value * anchor.weight,
      weight: anchor.weight,
    });
  }

  return {
    factorId: themeId,
    state: "known" as const,
    value: roundScore(numerator / denominator),
    anchorWorkIds: evidenceAnchorIds(evidence),
  };
}

function summarizeGenre(anchors: readonly PositiveAnchor[], genreId: GenreTag) {
  const annotatedAnchors = anchors.filter((anchor) => anchor.work.genres.length > 0);
  if (annotatedAnchors.length === 0) {
    return unknownPreference(genreId);
  }

  let numerator = 0;
  let denominator = 0;
  const evidence: EvidenceCandidate[] = [];
  for (const anchor of annotatedAnchors) {
    const value = anchor.work.genres.includes(genreId) ? 4 : 0;
    numerator += value * anchor.weight;
    denominator += anchor.weight;
    evidence.push({
      workId: anchor.work.id,
      strength: value * anchor.weight,
      weight: anchor.weight,
    });
  }

  return {
    factorId: genreId,
    state: "known" as const,
    value: roundScore(numerator / denominator),
    anchorWorkIds: evidenceAnchorIds(evidence),
  };
}

export function summarizeMangaDna(
  works: readonly Work[],
  records: readonly UserWorkRecord[],
): MangaDnaSummary {
  const anchors = positiveAnchors(works, records);
  const axes = AXIS_IDS.map((axisId) => summarizeAxis(anchors, axisId));
  const themes = THEME_TAGS.map((themeId) => summarizeTheme(anchors, themeId));
  const genres = GENRE_TAGS.map((genreId) => summarizeGenre(anchors, genreId));

  const topPreferences = [
    ...axes.map((preference) => ({ kind: "axis" as const, preference })),
    ...themes.map((preference) => ({ kind: "theme" as const, preference })),
    ...genres.map((preference) => ({ kind: "genre" as const, preference })),
  ]
    .flatMap(({ kind, preference }): DnaTopPreference[] =>
      preference.state === "known" &&
      preference.value !== null &&
      preference.value > 0 &&
      preference.anchorWorkIds.length > 0
        ? [
            {
              kind,
              factorId: preference.factorId,
              value: preference.value,
              anchorWorkIds: preference.anchorWorkIds,
            },
          ]
        : [],
    )
    .sort((left, right) => {
      if (left.value !== right.value) {
        return right.value - left.value;
      }
      if (TOP_KIND_ORDER[left.kind] !== TOP_KIND_ORDER[right.kind]) {
        return TOP_KIND_ORDER[left.kind] - TOP_KIND_ORDER[right.kind];
      }
      return left.factorId < right.factorId ? -1 : left.factorId > right.factorId ? 1 : 0;
    })
    .slice(0, 3);

  return { axes, themes, genres, topPreferences };
}
