import { describe, expect, it } from "vitest";

import {
  explanationClusterFor,
  generateBaselineExplanation,
  generateTasteExplanation,
} from "@/domain/explanation";
import type {
  BaselineExplanationSentence,
  ExplanationLexicon,
  TasteExplanationSentence,
} from "@/domain/explanation";
import type { BaselineContribution, GroupContribution } from "@/domain/recommendation/types";
import { strings } from "@/lib/strings";

function tasteContribution(overrides: Partial<GroupContribution> = {}): GroupContribution {
  return {
    source: "similarity",
    group: "narrative",
    factorId: "problemSolving",
    value: 0.1,
    anchorWorkIds: ["anchor-a"],
    explainable: true,
    ...overrides,
  };
}

function baselineContribution(overrides: Partial<BaselineContribution> = {}): BaselineContribution {
  return {
    source: "genre",
    group: "genre",
    factorId: "fantasy",
    value: 0.1,
    anchorWorkIds: ["anchor-a"],
    explainable: true,
    ...overrides,
  };
}

function titleResolver(titles: Readonly<Record<string, string>>) {
  return (workId: string) =>
    Object.prototype.hasOwnProperty.call(titles, workId) ? titles[workId] : undefined;
}

function tasteIdentityExists(
  sentence: TasteExplanationSentence,
  contributions: readonly GroupContribution[],
) {
  return contributions.some(
    (entry) =>
      entry.source === sentence.source &&
      entry.group === sentence.group &&
      entry.factorId === sentence.factorId &&
      entry.value === sentence.value &&
      entry.axisPreferenceDirection === sentence.axisPreferenceDirection &&
      entry.negativeReasonId === sentence.negativeReasonId &&
      entry.anchorWorkIds.length === sentence.anchorWorkIds.length &&
      entry.anchorWorkIds.every((workId, index) => workId === sentence.anchorWorkIds[index]),
  );
}

function baselineIdentityExists(
  sentence: BaselineExplanationSentence,
  contributions: readonly BaselineContribution[],
) {
  return contributions.some(
    (entry) =>
      entry.source === sentence.source &&
      entry.group === sentence.group &&
      entry.factorId === sentence.factorId &&
      entry.value === sentence.value &&
      entry.anchorWorkIds.length === sentence.anchorWorkIds.length &&
      entry.anchorWorkIds.every((workId, index) => workId === sentence.anchorWorkIds[index]),
  );
}

describe("Taste explanations", () => {
  it("drops the global caution after a stronger positive wins its group without backfilling", () => {
    const contributions = [
      tasteContribution({
        group: "tone",
        factorId: "comedy",
        value: 1,
        anchorWorkIds: ["positive-anchor"],
      }),
      tasteContribution({
        group: "tone",
        factorId: "darkness",
        value: -0.9,
        anchorWorkIds: ["global-caution"],
      }),
      tasteContribution({
        group: "narrative",
        factorId: "pacing",
        value: -0.8,
        anchorWorkIds: ["must-not-backfill"],
      }),
      tasteContribution({
        source: "adjustment",
        group: "theme",
        factorId: "adventure",
        value: 0.7,
        anchorWorkIds: ["not-a-similarity-anchor"],
      }),
      tasteContribution({
        group: "genre",
        factorId: "fantasy",
        value: 0.6,
        anchorWorkIds: ["unresolved-anchor"],
      }),
      tasteContribution({
        group: "art",
        factorId: "motionImpact",
        value: 0.5,
      }),
      tasteContribution({
        source: "penalty",
        group: "overall",
        factorId: "tooSlow",
        value: -2,
        negativeReasonId: "tooSlow",
      }),
      tasteContribution({
        source: "penalty",
        group: "theme",
        factorId: "combat",
        value: -3,
        anchorWorkIds: ["supported-penalty-is-not-caution"],
      }),
    ];

    const result = generateTasteExplanation({
      contributions,
      confidenceLevel: "high",
      lexicon: strings.explanation,
      resolveTitle: titleResolver({ "positive-anchor": "好きな作品" }),
    });

    expect(result.positiveReasons.map(({ factorId }) => factorId)).toEqual([
      "comedy",
      "adventure",
      "fantasy",
    ]);
    expect(result.caution).toBeUndefined();
    expect(result.anchors).toEqual([{ workId: "positive-anchor", title: "好きな作品" }]);
    expect(result.positiveReasons[0]?.text).toBe(
      "『好きな作品』で好きだった「ギャグ・コメディ」に近い作品です。",
    );
  });

  it("lets a stronger caution win the combined group and cluster budget", () => {
    const contributions = [
      tasteContribution({
        factorId: "problemSolving",
        value: -1,
        anchorWorkIds: ["missing-caution", "caution-anchor"],
      }),
      tasteContribution({ factorId: "strategy", value: 0.9 }),
      tasteContribution({ factorId: "pacing", value: 0.8 }),
      tasteContribution({
        group: "theme",
        factorId: "adventure",
        value: 0.7,
        anchorWorkIds: ["positive-a", "missing-positive"],
      }),
      tasteContribution({
        group: "genre",
        factorId: "fantasy",
        value: 0.6,
        anchorWorkIds: ["positive-a", "positive-b"],
      }),
      tasteContribution({
        source: "adjustment",
        group: "art",
        factorId: "motionImpact",
        value: 0.5,
        anchorWorkIds: ["not-a-rendered-anchor"],
        axisPreferenceDirection: "higher",
      }),
      tasteContribution({
        group: "tone",
        factorId: "darkness",
        value: -0.95,
        anchorWorkIds: ["second-negative"],
      }),
    ];
    const input = {
      contributions,
      confidenceLevel: "high" as const,
      lexicon: strings.explanation,
      resolveTitle: titleResolver({
        "positive-a": "冒険作品",
        "positive-b": "幻想作品",
        "caution-anchor": "比較作品",
        "not-a-rendered-anchor": "無関係",
        "second-negative": "次点",
      }),
    };

    const result = generateTasteExplanation(input);
    const sentences = [
      ...result.positiveReasons,
      ...(result.caution === undefined ? [] : [result.caution]),
    ];

    expect(result.positiveReasons.map(({ factorId }) => factorId)).toEqual([
      "adventure",
      "fantasy",
      "motionImpact",
    ]);
    expect(result.caution).toEqual({
      kind: "caution",
      text: "ただし「頭脳で解決する展開」は、『比較作品』で好きだった傾向と少し異なります。",
      source: "similarity",
      group: "narrative",
      factorId: "problemSolving",
      value: -1,
      anchorWorkIds: ["missing-caution", "caution-anchor"],
    });
    expect(result.anchors).toEqual([
      { workId: "positive-a", title: "冒険作品" },
      { workId: "positive-b", title: "幻想作品" },
      { workId: "caution-anchor", title: "比較作品" },
    ]);
    expect(new Set(sentences.map(({ group }) => group)).size).toBe(sentences.length);
    const clusters = sentences.flatMap(({ factorId }) => {
      const clusterId = explanationClusterFor(factorId);
      return clusterId === undefined ? [] : [clusterId];
    });
    expect(new Set(clusters).size).toBe(clusters.length);
    expect(sentences.every((sentence) => tasteIdentityExists(sentence, contributions))).toBe(true);
    expect(
      generateTasteExplanation({ ...input, contributions: [...contributions].reverse() }),
    ).toEqual(result);
  });

  it("uses only lexicon-supported Axis, Genre, or Theme factors", () => {
    const lexicon: ExplanationLexicon = {
      ...strings.explanation,
      factorLabels: { darkness: "ダークな世界観", adventure: "冒険" },
    };
    const result = generateTasteExplanation({
      contributions: [
        tasteContribution({ factorId: "futureFactor", value: 2 }),
        tasteContribution({ factorId: "tooSlow", value: 1.5 }),
        tasteContribution({ factorId: "pacing", value: -1.2 }),
        tasteContribution({ group: "tone", factorId: "darkness", value: -1 }),
        tasteContribution({
          source: "adjustment",
          group: "theme",
          factorId: "adventure",
          value: 0.8,
        }),
      ],
      confidenceLevel: "normal",
      lexicon,
      resolveTitle: () => undefined,
    });

    expect(result.positiveReasons.map(({ factorId }) => factorId)).toEqual(["adventure"]);
    expect(result.positiveReasons[0]?.text).toBe("「冒険」があなたの好みに合う作品です。");
    expect(result.caution?.factorId).toBe("darkness");
    expect(result.caution?.text).toBe("ただし「物語の重さ」は、あなたの好みと少し異なります。");
  });

  it("states that a low Axis matches an explicit lower preference", () => {
    const contributions = [
      tasteContribution({
        source: "adjustment",
        group: "tone",
        factorId: "comedy",
        value: 0.06,
        anchorWorkIds: [],
        axisPreferenceDirection: "lower",
      }),
    ];

    const result = generateTasteExplanation({
      contributions,
      confidenceLevel: "normal",
      lexicon: strings.explanation,
      resolveTitle: () => undefined,
    });

    expect(result.positiveReasons).toEqual([
      {
        kind: "positive",
        text: "「ギャグ・コメディ」が控えめな点が、あなたの好みに合う作品です。",
        source: "adjustment",
        group: "tone",
        factorId: "comedy",
        value: 0.06,
        anchorWorkIds: [],
        axisPreferenceDirection: "lower",
      },
    ]);
    expect(tasteIdentityExists(result.positiveReasons[0]!, contributions)).toBe(true);
  });

  it("fails closed when an Axis adjustment loses its preference direction", () => {
    const result = generateTasteExplanation({
      contributions: [
        tasteContribution({
          source: "adjustment",
          group: "tone",
          factorId: "comedy",
          value: 0.06,
          anchorWorkIds: [],
        }),
      ],
      confidenceLevel: "normal",
      lexicon: strings.explanation,
      resolveTitle: () => undefined,
    });

    expect(result.positiveReasons).toEqual([]);
    expect(result.anchors).toEqual([]);
  });

  it("interpolates original template tokens once without interpreting injected tokens", () => {
    const lexicon: ExplanationLexicon = {
      ...strings.explanation,
      factorLabels: { adventure: "{anchorTitle}" },
      templates: {
        ...strings.explanation.templates,
        positiveWithAnchor: "『{anchorTitle}』と「{factorLabel}」",
      },
    };

    const result = generateTasteExplanation({
      contributions: [
        tasteContribution({
          group: "theme",
          factorId: "adventure",
          anchorWorkIds: ["anchor-token"],
        }),
      ],
      confidenceLevel: "normal",
      lexicon,
      resolveTitle: () => "{factorLabel}",
    });

    expect(result.positiveReasons[0]?.text).toBe("『{factorLabel}』と「{anchorTitle}」");
  });

  it.each([
    ["high", "高い"],
    ["normal", "ふつう"],
    ["low", "低め(データ収集中)"],
  ] as const)("renders the injected Taste confidence level %s", (confidenceLevel, label) => {
    expect(
      generateTasteExplanation({
        contributions: [],
        confidenceLevel,
        lexicon: strings.explanation,
        resolveTitle: () => undefined,
      }).confidence,
    ).toEqual({ level: confidenceLevel, label });
  });
});

describe("Baseline explanations", () => {
  it("selects one reason by value then stable source identity", () => {
    const contributions = [
      baselineContribution({
        source: "maturity",
        group: "overall",
        factorId: "maturity",
        value: 0.1,
        anchorWorkIds: [],
      }),
      baselineContribution({
        source: "market",
        group: "overall",
        factorId: "bayesianRating",
        value: 0.1,
        anchorWorkIds: [],
      }),
      baselineContribution({ value: 0.09 }),
      baselineContribution({
        source: "market",
        group: "overall",
        factorId: "bayesianRating",
        value: 0.5,
        anchorWorkIds: [],
        explainable: false,
      }),
    ];
    const input = {
      contributions,
      bestAnchorId: "anchor-a",
      lexicon: strings.explanation,
      resolveTitle: titleResolver({ "anchor-a": "基準作品" }),
    };

    const result = generateBaselineExplanation(input);

    expect(result).toEqual({
      reason: {
        kind: "baseline",
        text: "第1巻のレビュー情報を順位に反映しています。",
        source: "market",
        group: "overall",
        factorId: "bayesianRating",
        value: 0.1,
        anchorWorkIds: [],
      },
      anchors: [],
    });
    expect(
      result.reason === undefined || baselineIdentityExists(result.reason, contributions),
    ).toBe(true);
    expect(
      generateBaselineExplanation({ ...input, contributions: [...contributions].reverse() }),
    ).toEqual(result);
    expect(result).not.toHaveProperty("confidence");
    expect(result).not.toHaveProperty("caution");
  });

  it("does not replace the selected top signal when its injected copy is missing", () => {
    const lexicon: ExplanationLexicon = {
      ...strings.explanation,
      factorLabels: {},
    };
    const result = generateBaselineExplanation({
      contributions: [
        baselineContribution({ value: 0.2 }),
        baselineContribution({
          source: "market",
          group: "overall",
          factorId: "bayesianRating",
          value: 0.1,
          anchorWorkIds: [],
        }),
      ],
      bestAnchorId: "anchor-a",
      lexicon,
      resolveTitle: titleResolver({ "anchor-a": "基準作品" }),
    });

    expect(result).toEqual({ anchors: [] });
  });

  it("renders the exact Genre template and title-backed anchors from the rendered reason only", () => {
    const contributions = [
      baselineContribution({
        value: 0.12,
        anchorWorkIds: ["anchor-b", "missing", "anchor-a"],
      }),
      baselineContribution({
        source: "market",
        group: "overall",
        factorId: "bayesianRating",
        value: 0.1,
        anchorWorkIds: [],
      }),
    ];
    const result = generateBaselineExplanation({
      contributions,
      bestAnchorId: "anchor-b",
      lexicon: strings.explanation,
      resolveTitle: titleResolver({ "anchor-a": "作品A", "anchor-b": "作品B" }),
    });

    expect(result.reason).toEqual({
      kind: "baseline",
      text: "『作品B』と「ファンタジー」が共通しています。",
      source: "genre",
      group: "genre",
      factorId: "fantasy",
      value: 0.12,
      anchorWorkIds: ["anchor-b", "missing", "anchor-a"],
    });
    expect(result.anchors).toEqual([
      { workId: "anchor-b", title: "作品B" },
      { workId: "anchor-a", title: "作品A" },
    ]);
  });

  it("uses the exact Genre fallback when the best anchor title cannot be resolved", () => {
    const result = generateBaselineExplanation({
      contributions: [baselineContribution()],
      bestAnchorId: "anchor-a",
      lexicon: strings.explanation,
      resolveTitle: () => undefined,
    });

    expect(result.reason?.text).toBe("「ファンタジー」のジャンル一致を順位に反映しています。");
    expect(result.anchors).toEqual([]);
  });

  it("uses the exact maturity template and omits non-explainable reasons", () => {
    const maturity = baselineContribution({
      source: "maturity",
      group: "overall",
      factorId: "maturity",
      anchorWorkIds: [],
    });
    const result = generateBaselineExplanation({
      contributions: [maturity],
      bestAnchorId: null,
      lexicon: strings.explanation,
      resolveTitle: () => undefined,
    });

    expect(result.reason?.text).toBe("刊行の蓄積を順位に反映しています。");
    expect(
      generateBaselineExplanation({
        contributions: [{ ...maturity, explainable: false }],
        bestAnchorId: null,
        lexicon: strings.explanation,
        resolveTitle: () => undefined,
      }),
    ).toEqual({ anchors: [] });
  });

  it("does not expose anchors from an unrendered Genre contribution", () => {
    const result = generateBaselineExplanation({
      contributions: [
        baselineContribution({
          source: "market",
          group: "overall",
          factorId: "bayesianRating",
          value: 0.3,
          anchorWorkIds: [],
        }),
        baselineContribution({ value: 0.2, anchorWorkIds: ["unrendered-anchor"] }),
      ],
      bestAnchorId: "unrendered-anchor",
      lexicon: strings.explanation,
      resolveTitle: titleResolver({ "unrendered-anchor": "未表示作品" }),
    });

    expect(result.reason?.source).toBe("market");
    expect(result.anchors).toEqual([]);
  });
});
