import { describe, expect, it } from "vitest";

import catalogJson from "@/data/generated/catalog-v1.json";
import contextJson from "@/data/generated/recommendation-context-v1.json";
import { catalogV1Schema } from "@/domain/catalog/schema";
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
import { parseRecommendationContext } from "@/domain/recommendation/context-schema";
import { scoreWorkCompatibility } from "@/domain/recommendation/rank";
import { explanationLexicon, frozenExperimentExplanationLexicon } from "@/lib/strings";

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
  it.each([
    ["jujutsu-kaisen", "attack-on-titan", "visualSoftness", 0],
    ["hunter-x-hunter", "dungeon-meshi", "artRealism", 2],
    ["naruto", "dungeon-meshi", "artRealism", 2],
  ] as const)(
    "describes the matched degree for %s without inventing a preference",
    (workId, anchorId, axis, value) => {
      const catalog = catalogV1Schema.parse(catalogJson);
      const context = parseRecommendationContext(contextJson);
      const works = new Map(catalog.works.map((work) => [work.id, work]));
      expect(works.get(workId)?.axes[axis]).toMatchObject({ state: "known", value });
      expect(works.get(anchorId)?.axes[axis]).toMatchObject({ state: "known", value });
      const recommendation = scoreWorkCompatibility(
        {
          catalog,
          context,
          records: [
            "attack-on-titan",
            "dungeon-meshi",
            "frieren",
            "fullmetal-alchemist",
            "death-note",
          ].map((id) => ({
            workId: id,
            readingState: "completed" as const,
            reaction: "liked" as const,
            updatedAt: "2026-10-01T00:00:00.000Z",
          })),
          adjustments: { axes: {}, themes: {} },
          policies: {
            preferCompleted: false,
            preferHidden: false,
            preferVerified: false,
            excludeIncomplete: false,
          },
        },
        workId,
      );
      if (recommendation === null) throw new Error("Expected a scored catalog work");
      expect(recommendation.bestAnchorId).toBe(anchorId);
      const input = { ...recommendation, lexicon: explanationLexicon };
      const explanation = generateTasteExplanation({
        ...input,
        resolveTitle: (id) => works.get(id)?.title,
      });
      const reason = explanation.positiveReasons.find((entry) => entry.factorId === axis);
      expect(reason?.text).toBe(
        `『${works.get(anchorId)?.title}』と「${explanationLexicon.factorLabels[axis]}」の度合いが近い作品です。`,
      );
      expect(reason?.value).toBeGreaterThan(0);
      const withoutTitle = generateTasteExplanation({ ...input, resolveTitle: () => undefined });
      expect(withoutTitle.positiveReasons.find((entry) => entry.factorId === axis)?.text).toBe(
        `「${explanationLexicon.factorLabels[axis]}」の度合いが、好みの作品と近いと判定されています。`,
      );
    },
  );

  it("adds only applied consensus supporters after rendered anchors without changing reasons", () => {
    const primary = tasteContribution({ anchorWorkIds: ["primary"] });
    const consensus = tasteContribution({
      source: "consensus",
      group: "overall",
      factorId: "consensus",
      value: 0.03,
      anchorWorkIds: ["support-a", "support-b"],
      explainable: false,
    });
    const input = {
      confidenceLevel: "high" as const,
      lexicon: explanationLexicon,
      resolveTitle: titleResolver({
        primary: "主な作品",
        "support-a": "支えた作品A",
        "support-b": "支えた作品B",
        unused: "使われなかった作品",
      }),
    };
    const original = generateTasteExplanation({ ...input, contributions: [primary] });
    const contributions = [primary, consensus];
    const result = generateTasteExplanation({ ...input, contributions });

    expect(result.anchors.map(({ workId }) => workId)).toEqual([
      "primary",
      "support-a",
      "support-b",
    ]);
    expect(result.positiveReasons).toEqual(original.positiveReasons);
    expect(result.caution).toEqual(original.caution);
    expect(
      generateTasteExplanation({ ...input, contributions: [...contributions].reverse() }),
    ).toEqual(result);
    for (const excluded of [
      { ...consensus, value: 0 },
      { ...consensus, value: -0.01 },
      { ...consensus, source: "penalty" as const },
    ]) {
      expect(
        generateTasteExplanation({ ...input, contributions: [primary, excluded] }).anchors,
      ).toEqual(original.anchors);
    }
    expect(
      generateTasteExplanation({
        ...input,
        contributions: [
          primary,
          {
            ...consensus,
            anchorWorkIds: ["missing", "primary", "support-a", "support-b", "unused"],
          },
        ],
      }).anchors,
    ).toEqual(result.anchors);
  });

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
      lexicon: explanationLexicon,
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
      "『好きな作品』と「ギャグ・コメディ」の度合いが近い作品です。",
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
      lexicon: explanationLexicon,
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
      text: "ただし「頭脳で解決する展開」の傾向は、『比較作品』と異なります。",
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
      ...explanationLexicon,
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
    expect(result.positiveReasons[0]?.text).toBe("DNAで好みに設定した「冒険」が描かれる作品です。");
    expect(result.caution?.factorId).toBe("darkness");
    expect(result.caution?.text).toBe("ただし「物語の重さ」の傾向は、好みの作品と異なります。");
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
      lexicon: explanationLexicon,
      resolveTitle: () => undefined,
    });

    expect(result.positiveReasons).toEqual([
      {
        kind: "positive",
        text: "「ギャグ・コメディ」が控えめな点が、DNAで設定した好みに合います。",
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
      lexicon: explanationLexicon,
      resolveTitle: () => undefined,
    });

    expect(result.positiveReasons).toEqual([]);
    expect(result.anchors).toEqual([]);
  });

  it("interpolates original template tokens once without interpreting injected tokens", () => {
    const lexicon: ExplanationLexicon = {
      ...explanationLexicon,
      factorLabels: { adventure: "{anchorTitle}" },
      templates: {
        ...explanationLexicon.templates,
        positiveThemeWithAnchor: "『{anchorTitle}』と「{factorLabel}」",
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

  it("words each reason by its source, factor family, and already named liked work", () => {
    const contributions = [
      tasteContribution({ group: "genre", factorId: "fantasy", value: 0.09 }),
      tasteContribution({ group: "theme", factorId: "revenge", value: 0.08 }),
      tasteContribution({ group: "narrative", factorId: "worldBuilding", value: 0.07 }),
    ];
    const resolveTitle = titleResolver({ "anchor-a": "作品A" });

    const result = generateTasteExplanation({
      contributions,
      confidenceLevel: "normal",
      lexicon: explanationLexicon,
      resolveTitle,
    });

    expect(result.positiveReasons.map(({ text }) => text)).toEqual([
      "『作品A』と同じ「ファンタジー」の作品です。",
      "「復讐」も『作品A』と共通しています。",
      "「世界観の作り込み」の度合いも『作品A』と近い作品です。",
    ]);
  });

  it("names the liked work in full for each reason that cites a different work", () => {
    const result = generateTasteExplanation({
      contributions: [
        tasteContribution({ group: "theme", factorId: "revenge", value: 0.08 }),
        tasteContribution({
          source: "adjustment",
          group: "narrative",
          factorId: "pacing",
          value: 0.05,
          anchorWorkIds: [],
          axisPreferenceDirection: "higher",
        }),
      ],
      confidenceLevel: "normal",
      lexicon: explanationLexicon,
      resolveTitle: titleResolver({ "anchor-a": "作品A" }),
    });

    expect(result.positiveReasons.map(({ text }) => text)).toEqual([
      "『作品A』と同じく「復讐」が描かれます。",
      "DNAで好みに設定した「テンポの速さ」がしっかりある作品です。",
    ]);
  });

  it("changes only wording between the product and frozen experiment copy", () => {
    const contributions = [
      tasteContribution({ group: "genre", factorId: "fantasy", value: 0.09 }),
      tasteContribution({ group: "theme", factorId: "revenge", value: 0.08 }),
      tasteContribution({
        source: "adjustment",
        group: "tone",
        factorId: "comedy",
        value: 0.06,
        anchorWorkIds: [],
        axisPreferenceDirection: "lower",
      }),
      tasteContribution({ group: "tone", factorId: "darkness", value: -0.2 }),
    ];
    const input = {
      contributions,
      confidenceLevel: "normal" as const,
      resolveTitle: titleResolver({ "anchor-a": "作品A" }),
    };
    const withoutText = (sentences: readonly TasteExplanationSentence[]) =>
      sentences.map((sentence) => ({ ...sentence, text: "" }));

    const product = generateTasteExplanation({ ...input, lexicon: explanationLexicon });
    const frozen = generateTasteExplanation({
      ...input,
      lexicon: frozenExperimentExplanationLexicon,
    });

    expect(withoutText(product.positiveReasons)).toEqual(withoutText(frozen.positiveReasons));
    expect(product.anchors).toEqual(frozen.anchors);
    expect(frozen.positiveReasons.map(({ text }) => text)).toEqual([
      "『作品A』で好きだった「ファンタジー」に近い作品です。",
      "『作品A』で好きだった「復讐」に近い作品です。",
    ]);
    expect(product.caution?.factorId).toBe(frozen.caution?.factorId);
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
        lexicon: explanationLexicon,
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
      lexicon: explanationLexicon,
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
      ...explanationLexicon,
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
      lexicon: explanationLexicon,
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
      lexicon: explanationLexicon,
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
      lexicon: explanationLexicon,
      resolveTitle: () => undefined,
    });

    expect(result.reason?.text).toBe("刊行の蓄積を順位に反映しています。");
    expect(
      generateBaselineExplanation({
        contributions: [{ ...maturity, explainable: false }],
        bestAnchorId: null,
        lexicon: explanationLexicon,
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
      lexicon: explanationLexicon,
      resolveTitle: titleResolver({ "unrendered-anchor": "未表示作品" }),
    });

    expect(result.reason?.source).toBe("market");
    expect(result.anchors).toEqual([]);
  });
});
