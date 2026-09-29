import { describe, expect, it } from "vitest";

import {
  generateTasteExplanation,
  groupRecommendationLenses,
  RECOMMENDATION_LENS_CANDIDATE_LIMIT,
  RECOMMENDATION_LENS_MAX_ITEMS,
  type RecommendationLens,
  type TasteExplanationSentence,
} from "@/domain/explanation";
import type { GroupContribution } from "@/domain/recommendation/types";
import { explanationLexicon } from "@/lib/strings";

type Item = { workId: string; contributions: GroupContribution[] };

const titles: Readonly<Record<string, string>> = {
  "liked-a": "好きA",
  "liked-b": "好きB",
  "liked-c": "好きC",
};

function resolveTitle(workId: string) {
  return Object.prototype.hasOwnProperty.call(titles, workId) ? titles[workId] : undefined;
}

function item(
  workId: string,
  contribution: Partial<GroupContribution> & Pick<GroupContribution, "factorId">,
): Item {
  return {
    workId,
    contributions: [
      {
        source: "similarity",
        group: "theme",
        value: 0.2,
        anchorWorkIds: [],
        explainable: true,
        ...contribution,
      },
    ],
  };
}

function leadReasonOf(entry: Item): TasteExplanationSentence | undefined {
  return generateTasteExplanation({
    contributions: entry.contributions,
    confidenceLevel: "normal",
    lexicon: explanationLexicon,
    resolveTitle,
  }).positiveReasons[0];
}

function group(items: readonly Item[]) {
  return groupRecommendationLenses({
    items,
    leadReasonOf,
    lexicon: explanationLexicon,
    resolveTitle,
  });
}

function summary(lenses: readonly RecommendationLens<Item>[]) {
  return lenses.map((lens) => ({
    kind: lens.kind,
    subject: lens.kind === "anchor" ? lens.anchorTitle : lens.factorLabel,
    workIds: lens.items.map((entry) => entry.workId),
  }));
}

const likedBy = (anchor: string, count: number, prefix: string) =>
  Array.from({ length: count }, (_, index) =>
    item(`${prefix}-${String(index)}`, { factorId: "adventure", anchorWorkIds: [anchor] }),
  );

describe("groupRecommendationLenses", () => {
  it("groups by the liked work each lead reason names and keeps plan order", () => {
    const items = [
      ...likedBy("liked-a", 3, "a"),
      item("b-0", { factorId: "romance", anchorWorkIds: ["liked-b"] }),
      item("b-1", { factorId: "romance", anchorWorkIds: ["liked-b"] }),
      item("b-2", { factorId: "romance", anchorWorkIds: ["liked-b"] }),
    ];

    expect(summary(group(items))).toEqual([
      { kind: "anchor", subject: "好きA", workIds: ["a-0", "a-1", "a-2"] },
      { kind: "anchor", subject: "好きB", workIds: ["b-0", "b-1", "b-2"] },
    ]);
  });

  it("restates text that appears in every card's lead reason", () => {
    const items = [
      ...likedBy("liked-a", 4, "a"),
      item("f-0", { factorId: "problemSolving", anchorWorkIds: ["liked-c"] }),
      item("f-1", { factorId: "strategy", anchorWorkIds: ["liked-b"] }),
      item("f-2", {
        factorId: "mysteryReveal",
        source: "adjustment",
        group: "narrative",
        axisPreferenceDirection: "higher",
      }),
    ];

    const lenses = group(items);
    expect(lenses).toHaveLength(2);
    for (const lens of lenses) {
      const subject =
        lens.kind === "anchor" ? `『${lens.anchorTitle}』` : `「${lens.factorLabel}」`;
      for (const entry of lens.items) expect(leadReasonOf(entry)?.text).toContain(subject);
    }
    expect(lenses[1]).toMatchObject({
      kind: "factor",
      factorLabel: explanationLexicon.clusterLabels.tacticalThinking,
    });
  });

  it("drops groups under three items and caps anchor and factor lenses", () => {
    const items = [
      ...likedBy("liked-a", RECOMMENDATION_LENS_MAX_ITEMS + 2, "a"),
      ...likedBy("liked-b", 3, "b"),
      ...likedBy("liked-c", 3, "c"),
      item("solo", { factorId: "romance", anchorWorkIds: ["unknown-work"] }),
      item("romance-0", { factorId: "romance" }),
      item("romance-1", { factorId: "romance" }),
    ];

    const lenses = summary(group(items));
    expect(lenses.map(({ kind, subject }) => [kind, subject])).toEqual([
      ["anchor", "好きA"],
      ["anchor", "好きB"],
      ["factor", explanationLexicon.factorLabels.romance],
    ]);
    expect(lenses[0]?.workIds).toHaveLength(RECOMMENDATION_LENS_MAX_ITEMS);
    expect(lenses[2]?.workIds).toEqual(["solo", "romance-0", "romance-1"]);
    const shown = lenses.flatMap(({ workIds }) => workIds);
    expect(new Set(shown).size).toBe(shown.length);
  });

  it("keeps factor lenses from repeating a liked work or label already shown", () => {
    const items = [
      ...likedBy("liked-a", RECOMMENDATION_LENS_MAX_ITEMS + 3, "a"),
      item("a-romance-0", { factorId: "romance", anchorWorkIds: ["liked-a"] }),
      item("a-romance-1", { factorId: "romance", anchorWorkIds: ["liked-a"] }),
      item("a-romance-2", { factorId: "romance", anchorWorkIds: ["liked-a"] }),
      item("adventure-0", { factorId: "adventure" }),
      item("adventure-1", { factorId: "adventure" }),
      item("adventure-2", { factorId: "adventure" }),
    ];

    expect(summary(group(items))).toEqual([
      {
        kind: "anchor",
        subject: "好きA",
        workIds: likedBy("liked-a", RECOMMENDATION_LENS_MAX_ITEMS, "a").map(({ workId }) => workId),
      },
    ]);
  });

  it("only explains the top of the plan", () => {
    let explained = 0;
    const unexplained = Array.from({ length: RECOMMENDATION_LENS_CANDIDATE_LIMIT }, (_, index) =>
      item(`filler-${String(index)}`, { factorId: "adventure", explainable: false }),
    );
    const lenses = groupRecommendationLenses({
      items: [...unexplained, ...likedBy("liked-a", 3, "late")],
      leadReasonOf: (entry) => {
        explained += 1;
        return leadReasonOf(entry);
      },
      lexicon: explanationLexicon,
      resolveTitle,
    });

    expect(lenses).toEqual([]);
    expect(explained).toBe(RECOMMENDATION_LENS_CANDIDATE_LIMIT);
  });

  it("keeps lower-axis preference sentences out of factor lenses", () => {
    const lower = (workId: string) =>
      item(workId, {
        source: "adjustment",
        group: "narrative",
        factorId: "pacing",
        axisPreferenceDirection: "lower",
      });

    expect(group([lower("l-0"), lower("l-1"), lower("l-2")])).toEqual([]);
  });

  it("returns identical lenses for identical input", () => {
    const items = [...likedBy("liked-b", 3, "b"), ...likedBy("liked-a", 3, "a")];
    expect(summary(group(items))).toEqual(summary(group(items)));
    expect(summary(group(items))[0]?.subject).toBe("好きB");
  });
});
