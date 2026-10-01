import { describe, expect, it } from "vitest";

import {
  buildDnaShareLink,
  dnaShareLevel,
  dnaShareWorkCandidates,
  formatDnaShareLinkSearch,
  parseDnaShareLink,
} from "@/domain/profile/dna-share";
import { rankDnaWheelAxes, summarizeMangaDna } from "@/domain/profile/dna-summary";
import type { UserWorkRecord } from "@/domain/profile/types";
import { landingSearchSchema } from "@/lib/route-search";
import { createTestAxes, createTestWork } from "../../helpers/catalog";

const works = Array.from({ length: 7 }, (_, index) =>
  createTestWork({
    id: `work-${String(index + 1)}`,
    axes: createTestAxes({
      pacing: { state: "known", value: 4, confidence: 0.9 },
      darkness: { state: "known", value: ([0, 1, 2, 3] as const)[index % 4]!, confidence: 0.9 },
      romance: { state: "known", value: 0, confidence: 0.9 },
      comedy: { state: "unknown" },
    }),
  }),
);

function record(workId: string, reaction: UserWorkRecord["reaction"]): UserWorkRecord {
  return {
    workId,
    readingState: "completed",
    ...(reaction === undefined ? {} : { reaction }),
    updatedAt: "2026-09-01T00:00:00.000Z",
  };
}

function summaryOf(count: number) {
  return summarizeMangaDna(
    works,
    works.slice(0, count).map((work) => record(work.id, "liked")),
  );
}

describe("Manga DNA share link", () => {
  it("carries exactly the DNA wheel's Axes, order and qualitative levels", () => {
    const summary = summaryOf(5);
    const link = buildDnaShareLink({ summary, publicWorkIds: new Set(), recommendations: [] });
    const wheel = rankDnaWheelAxes(summary.axes);

    expect(link?.axes).toEqual(
      wheel.map((axis) => ({ axisId: axis.factorId, level: dnaShareLevel(axis.value) })),
    );
    expect(link?.axes).toHaveLength(8);
    expect(link?.axes.some((axis) => axis.axisId === "comedy")).toBe(false);
    expect(link?.topPositions).toEqual([0, 1, 2]);
  });

  it("maps values onto the same bands as the Manga DNA level labels", () => {
    expect([0, 0.49, 0.5, 1.49, 1.5, 2.49, 2.5, 3.49, 3.5, 4].map(dnaShareLevel)).toEqual([
      0, 0, 1, 1, 2, 2, 3, 3, 4, 4,
    ]);
  });

  it("counts the distinct analysed works, not the capped evidence lists", () => {
    const records = [
      ...works.slice(0, 6).map((work) => record(work.id, "liked")),
      record("work-1", "favorite"),
      record("work-7", "disliked"),
    ];
    const summary = summarizeMangaDna(works, records);

    const link = buildDnaShareLink({ summary, publicWorkIds: new Set(), recommendations: [] });

    expect(summary.analyzedWorkIds).toEqual(works.slice(0, 6).map((work) => work.id));
    expect(link?.workIds).toEqual([]);
    expect(link?.analyzedWorkCount).toBe(6);
  });

  it("names evidence first and keeps the analysed count when works are left out", () => {
    const summary = summaryOf(5);
    const candidates = dnaShareWorkCandidates(summary);
    const evidence = [
      ...new Set(
        rankDnaWheelAxes(summary.axes)
          .slice(0, 3)
          .flatMap((axis) => axis.anchorWorkIds),
      ),
    ];

    const allPublic = buildDnaShareLink({
      summary,
      publicWorkIds: new Set(candidates),
      recommendations: [],
    });
    const hidden = buildDnaShareLink({
      summary,
      publicWorkIds: new Set(candidates.slice(1)),
      recommendations: [],
    });

    expect(new Set(candidates)).toEqual(new Set(summary.analyzedWorkIds));
    expect(candidates.slice(0, evidence.length)).toEqual(evidence);
    expect(allPublic?.workIds).toEqual(candidates);
    expect(hidden?.workIds).not.toContain(candidates[0]);
    expect(hidden?.evidence.flat()).not.toContain(candidates[0]);
    expect(hidden?.analyzedWorkCount).toBe(5);
    expect(hidden?.axes).toEqual(allPublic?.axes);
  });

  it("round-trips through the URL query without changing a value", () => {
    const summary = summaryOf(5);
    const candidates = dnaShareWorkCandidates(summary);
    for (const publicWorkIds of [
      new Set(candidates),
      new Set(candidates.slice(2)),
      new Set<string>(),
    ]) {
      const link = buildDnaShareLink({
        summary,
        publicWorkIds,
        recommendations: [
          { workId: "fire-punch", reasonFactorId: "darkness" },
          { workId: "jujutsu-kaisen" },
          { workId: "fire-punch", reasonFactorId: "pacing" },
        ],
      });
      if (link === null) throw new Error("expected a link");
      const search = formatDnaShareLinkSearch(link);

      expect(search).toMatch(/^v=1&dna=[0-4]{8}&ax=[0-9a-g]{8}&top=012(&|$)/u);
      expect(search).not.toMatch(/%/u);
      expect(link.recommendations).toEqual([
        { workId: "fire-punch", reasonFactorId: "darkness" },
        { workId: "jujutsu-kaisen" },
      ]);
      expect(parseDnaShareLink(`?${search}`)).toEqual(link);
    }
  });

  it("refuses to build a link without a known wheel Axis", () => {
    expect(
      buildDnaShareLink({
        summary: { analyzedWorkIds: ["work-1"], axes: [] },
        publicWorkIds: new Set(),
        recommendations: [],
      }),
    ).toBe(null);
  });

  it("rejects malformed or inconsistent links as a whole", () => {
    const valid = "v=1&dna=443&ax=93a&top=012&w=akira,a-silent-voice&e=01,1,&r=fire-punch:darkness";
    expect(parseDnaShareLink(valid)).toEqual({
      axes: [
        { axisId: "darkness", level: 4 },
        { axisId: "pacing", level: 4 },
        { axisId: "mentalStress", level: 3 },
      ],
      topPositions: [0, 1, 2],
      workIds: ["akira", "a-silent-voice"],
      evidence: [["akira", "a-silent-voice"], ["a-silent-voice"], []],
      analyzedWorkCount: 2,
      recommendations: [{ workId: "fire-punch", reasonFactorId: "darkness" }],
    });

    for (const search of [
      "",
      "v=2&dna=443&ax=93a&top=012&w=akira",
      "v=1&dna=453&ax=93a&top=012&w=akira",
      "v=1&dna=443&ax=93&top=012&w=akira",
      "v=1&dna=443&ax=99a&top=012&w=akira",
      "v=1&dna=443&ax=93z&top=012&w=akira",
      "v=1&dna=443&ax=93a&top=013&w=akira",
      "v=1&dna=443&ax=93a&top=001&w=akira",
      "v=1&dna=443&ax=93a&top=012&w=akira,akira",
      "v=1&dna=443&ax=93a&top=012&w=Akira",
      "v=1&dna=443&ax=93a&top=012",
      "v=1&dna=443&ax=93a&top=012&w=akira&n=0",
      "v=1&dna=443&ax=93a&top=012&w=akira,a-silent-voice&n=1",
      "v=1&dna=443&ax=93a&top=012&w=akira&e=0,1,",
      "v=1&dna=443&ax=93a&top=012&w=akira&e=0,",
      "v=1&dna=443&ax=93a&top=012&w=akira&r=fire-punch:notAFactor",
      "v=1&dna=443&ax=93a&top=012&w=akira&r=a,b,c,d,e",
      "v=1&dna=443&ax=93a&top=012&w=akira&w=akira",
    ]) {
      expect(parseDnaShareLink(search), search).toBe(null);
    }
  });

  it("allows a link that names no work but still counts the analysis", () => {
    expect(parseDnaShareLink("v=1&dna=4&ax=9&top=0&n=6")).toMatchObject({
      workIds: [],
      evidence: [[]],
      analyzedWorkCount: 6,
    });
  });

  it("accepts only the fixed share entry marker on the landing", () => {
    expect(landingSearchSchema.parse({ landing: "1", via: "share-card" })).toEqual({
      landing: "1",
      via: "share-card",
    });
    expect(landingSearchSchema.parse({ via: "user-123" }).via).toBeUndefined();
  });
});
