import { useMemo } from "react";

import { generateTasteExplanation } from "@/domain/explanation";
import { explanationLexicon } from "@/lib/strings";

import type { LandingRecommendation, LandingSample } from "./landing-types";

/** A sample recommendation's lead reason and the anchor work it names, located in its text. */
export type SampleReason = Readonly<{
  text: string | undefined;
  /** The sample work the lead reason names, when it names one. */
  anchorWorkId: string | undefined;
  anchorTitle: string | undefined;
  anchorIndex: number;
}>;

/**
 * The lead reason of one sample recommendation, generated from its stored contributions with the
 * lead the build chose, as the recommendations page varies its leads. Only the sample's own works
 * can be named in it.
 */
export function sampleReasonOf(
  { confidenceLevel, contributions, preferredFactorId }: LandingRecommendation,
  resolveTitle: (workId: string) => string | undefined,
): SampleReason {
  const [lead] = generateTasteExplanation({
    contributions,
    confidenceLevel,
    lexicon: explanationLexicon,
    preferredFactorId,
    resolveTitle,
  }).positiveReasons;
  const anchorWorkId = lead?.anchorWorkIds.find((workId) => {
    const title = resolveTitle(workId);
    return title !== undefined && lead.text.includes(title);
  });
  const anchorTitle = anchorWorkId === undefined ? undefined : resolveTitle(anchorWorkId);
  return {
    text: lead?.text,
    anchorWorkId,
    anchorTitle,
    anchorIndex: anchorTitle === undefined ? -1 : (lead?.text.indexOf(anchorTitle) ?? -1),
  };
}

/** Lead reasons for every sample recommendation the home shows, by work ID. */
export function useSampleReasons({ anchorWorks, lens, stage }: LandingSample) {
  return useMemo(() => {
    const titles = new Map(anchorWorks.map((anchor) => [anchor.id, anchor.title] as const));
    const resolveTitle = (workId: string) => titles.get(workId);
    return new Map(
      [...stage, ...lens.items].map(
        (entry) => [entry.work.id, sampleReasonOf(entry, resolveTitle)] as const,
      ),
    );
  }, [anchorWorks, lens, stage]);
}
