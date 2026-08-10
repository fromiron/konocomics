import { describe, expect, it } from "vitest";

import {
  calculateGroupingScore,
  classifyGroupingScore,
  evaluateGroupingCandidate,
} from "@/domain/catalog/grouping";

describe("catalog grouping", () => {
  it("uses the documented signal weights without redistribution", () => {
    expect(
      calculateGroupingScore({
        seriesNameMatch: 1,
        normalizedTitleMatch: 1,
        authorMatch: 0.5,
        publisherMatch: 1,
        volumeSequenceMatch: 0,
      }),
    ).toBeCloseTo(0.825);
  });

  it("classifies both documented boundaries", () => {
    expect(classifyGroupingScore(0.9)).toBe("automaticCandidate");
    expect(classifyGroupingScore(0.7)).toBe("manualReview");
    expect(classifyGroupingScore(0.699)).toBe("separateWork");
  });

  it("derives all documented signals from raw volume metadata", () => {
    expect(
      evaluateGroupingCandidate(
        {
          title: "ダンジョン飯 1巻",
          seriesName: "ダンジョン飯",
          creators: ["九井 諒子"],
          publisher: "KADOKAWA",
          volumeNumber: 1,
        },
        {
          title: "ダンジョン飯 2",
          seriesName: "ダンジョン飯",
          creators: ["九井　諒子"],
          publisher: "ＫＡＤＯＫＡＷＡ",
          volumeNumber: 2,
        },
      ),
    ).toEqual({
      signals: {
        seriesNameMatch: 1,
        normalizedTitleMatch: 1,
        authorMatch: 1,
        publisherMatch: 1,
        volumeSequenceMatch: 1,
      },
      score: 1,
      decision: "automaticCandidate",
    });
  });

  it("does not invent matches when optional provider fields are absent", () => {
    const result = evaluateGroupingCandidate(
      { title: "MONSTER 1", creators: ["浦沢直樹"] },
      { title: "MONSTER 2", creators: ["別作者"] },
    );
    expect(result.signals.seriesNameMatch).toBe(0);
    expect(result.signals.publisherMatch).toBe(0);
    expect(result.decision).toBe("separateWork");
  });
});
