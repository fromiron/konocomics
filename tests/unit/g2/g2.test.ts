import { createHash } from "node:crypto";

import { describe, expect, it } from "vitest";

import type { CatalogV1, Work } from "@/domain/catalog/types";
import {
  aggregateG2Metrics,
  calculateG2ParticipantMetrics,
  createG2Experiment,
  createG2Result,
  g2ResultV1Schema,
  selectG2Holdout,
  serializeG2Result,
  validateG2ResultAgainstContext,
  type G2PostResponse,
  type G2PreResponse,
  type G2ResultV1,
} from "@/domain/g2";
import { experimentProfileV1Schema } from "@/domain/profile/experiment-schema";
import type { ExperimentProfileV1 } from "@/domain/profile/experiment-schema";
import type { RecommendationContext } from "@/domain/recommendation/types";
import { strings } from "@/lib/strings";
import { createTestAxes, createTestWork } from "../../helpers/catalog";

const sha256Hex = (value: string) => createHash("sha256").update(value, "utf8").digest("hex");

function profileRecord(workId: string, reaction: "favorite" | "liked" | "disliked" = "liked") {
  return {
    workId,
    readingState: "completed" as const,
    reaction,
    updatedAt: "2000-01-01T00:00:00.000Z",
  };
}

function profileWith(participantId = "participant-one", anchorCount = 7): ExperimentProfileV1 {
  return experimentProfileV1Schema.parse({
    format: "konocomics-experiment-profile",
    schemaVersion: 1,
    profileId: participantId,
    records: Array.from({ length: anchorCount }, (_, index) =>
      profileRecord(
        `anchor-${String.fromCharCode(97 + index)}`,
        index === 0 ? "favorite" : "liked",
      ),
    ),
    adjustments: { axes: {}, themes: {} },
    policies: {
      preferCompleted: false,
      preferHidden: false,
      preferVerified: false,
      excludeIncomplete: false,
    },
  });
}

function catalogWith(works: Work[], catalogVersion = "g2-catalog-v1"): CatalogV1 {
  return {
    schemaVersion: 1,
    catalogVersion,
    factorDictionaryVersion: "v1",
    works,
    volumes: [],
    representativeVolumeByWorkId: {},
  };
}

function contextFor(catalog: CatalogV1): RecommendationContext {
  return {
    constraintByWorkId: Object.fromEntries(
      catalog.works
        .filter((work) => work.eligibility.recommendationEligible)
        .map((work) => [
          work.id,
          {
            workId: work.id,
            catalogRole: "bridge" as const,
            volumeCount: 1,
          },
        ]),
    ),
    marketSnapshot: {
      catalogVersion: catalog.catalogVersion,
      catalogAverageRating: 3.5,
      byWorkId: Object.fromEntries(
        catalog.works.map((work) => [work.id, { workId: work.id, reviewCount: 0 }]),
      ),
    },
  };
}

function engineFixture(anchorCount = 7) {
  const anchors = Array.from({ length: anchorCount }, (_, index) =>
    createTestWork({
      id: `anchor-${String.fromCharCode(97 + index)}`,
      genres: index % 2 === 0 ? ["fantasy"] : ["mystery"],
      themes: [],
    }),
  );
  const candidates = Array.from({ length: 6 }, (_, index) =>
    createTestWork({
      id: `candidate-${String.fromCharCode(97 + index)}`,
      genres: index % 2 === 0 ? ["fantasy"] : ["mystery"],
      themes: [],
    }),
  );
  const catalog = catalogWith([...anchors, ...candidates]);
  return {
    catalog,
    context: contextFor(catalog),
    profile: profileWith("participant-one", anchorCount),
  };
}

function completeResponses(experiment: Awaited<ReturnType<typeof createG2Experiment>>) {
  const preResponses: G2PreResponse[] = experiment.distinctWorkIds.map((workId) => ({
    workId,
    familiarity: "unknown",
    wantToReadBefore: 4,
  }));
  const postResponses: G2PostResponse[] = (["A", "B"] as const).flatMap((slot) =>
    experiment.slots[slot].items.map((item) => ({
      slot,
      rank: item.rank,
      workId: item.workId,
      wantToReadAfter: 4,
      agreement: item.explanationAvailable ? 4 : null,
    })),
  );
  return { preResponses, postResponses };
}

describe("G2 deterministic input, holdout, and native lists", () => {
  it.each([
    [6, 1],
    [7, 2],
    [10, 2],
  ])("selects the exact SHA-256 holdout for %i anchors", async (anchorCount, holdoutCount) => {
    const profile = profileWith("participant-one", anchorCount);
    const result = await selectG2Holdout({
      participantId: profile.profileId,
      catalogVersion: "g2-catalog-v1",
      profile,
      sha256Hex,
    });
    const expected = profile.records
      .map((record) => ({
        workId: record.workId,
        digest: sha256Hex(
          `konocomics-g2-holdout-v1\0g2-catalog-v1\0participant-one\0${record.workId}`,
        ),
      }))
      .sort((left, right) =>
        left.digest === right.digest
          ? left.workId < right.workId
            ? -1
            : left.workId > right.workId
              ? 1
              : 0
          : left.digest < right.digest
            ? -1
            : 1,
      )
      .slice(0, holdoutCount)
      .map(({ workId }) => workId);

    expect(result.holdoutWorkIds).toEqual(expected);
    expect(result.postHoldoutProfile.records).toHaveLength(anchorCount - holdoutCount);
    expect(result.postHoldoutProfile.records.map((record) => record.workId)).toEqual(
      [...result.postHoldoutProfile.records.map((record) => record.workId)].sort(),
    );
  });

  it("uses code-unit workId ties for holdout and both first-byte parities for A/B", async () => {
    const fixture = engineFixture();
    const tied = await selectG2Holdout({
      participantId: "participant-one",
      catalogVersion: fixture.catalog.catalogVersion,
      profile: { ...fixture.profile, records: [...fixture.profile.records].reverse() },
      sha256Hex: () => "0".repeat(64),
    });
    expect(tied.holdoutWorkIds).toEqual(["anchor-a", "anchor-b"]);

    for (const [slotByte, tasteSlot] of [
      ["00", "A"],
      ["01", "B"],
    ] as const) {
      const experiment = await createG2Experiment({
        ...fixture,
        participantId: "participant-one",
        sha256Hex: (value) =>
          value.startsWith("konocomics-g2-slot-v1\0")
            ? `${slotByte}${"0".repeat(62)}`
            : sha256Hex(value),
        lexicon: strings.explanation,
      });
      expect(experiment.slots[tasteSlot].engine).toBe("taste");
      expect(experiment.slots[tasteSlot === "A" ? "B" : "A"].engine).toBe("baseline");
    }
  });

  it("is record-order invariant and preserves each engine's native list and slot parity", async () => {
    const fixture = engineFixture();
    fixture.profile = experimentProfileV1Schema.parse({
      ...fixture.profile,
      adjustments: {
        axes: { strategy: "auto", pacing: "auto" },
        themes: { war: "auto", combat: "auto" },
      },
    });
    const reversed = { ...fixture.profile, records: [...fixture.profile.records].reverse() };
    const first = await createG2Experiment({
      ...fixture,
      participantId: "participant-one",
      sha256Hex,
      lexicon: strings.explanation,
    });
    const second = await createG2Experiment({
      ...fixture,
      profile: reversed,
      participantId: "participant-one",
      sha256Hex,
      lexicon: strings.explanation,
    });
    const slotDigest = sha256Hex("konocomics-g2-slot-v1\0g2-catalog-v1\0participant-one");
    const tasteSlot = Number.parseInt(slotDigest.slice(0, 2), 16) % 2 === 0 ? "A" : "B";

    expect(second).toEqual(first);
    expect(first.slots[tasteSlot]).toEqual(first.nativeLists.taste);
    expect(first.slots[tasteSlot === "A" ? "B" : "A"]).toEqual(first.nativeLists.baseline);
    for (const list of [first.nativeLists.taste, first.nativeLists.baseline]) {
      expect(list.items.map((item) => item.rank)).toEqual(
        list.items.map((_item, index) => index + 1),
      );
      expect(new Set(list.items.map((item) => item.workId)).size).toBe(list.items.length);
      expect(list.items.length).toBeLessThanOrEqual(10);
    }
    const tasteIds = new Set(first.nativeLists.taste.items.map((item) => item.workId));
    expect(first.nativeLists.baseline.items.some((item) => tasteIds.has(item.workId))).toBe(true);
  });

  it("rejects invalid identity, ineligible anchors, unrestorable holdouts, and bad hash adapters", async () => {
    const fixture = engineFixture(6);
    await expect(
      createG2Experiment({
        ...fixture,
        participantId: "different-participant",
        sha256Hex,
        lexicon: strings.explanation,
      }),
    ).rejects.toThrow(/profile id/i);

    const firstAnchor = fixture.catalog.works[0];
    if (firstAnchor === undefined) {
      throw new Error("Missing test anchor");
    }
    const ineligibleCatalog = catalogWith([
      {
        ...firstAnchor,
        eligibility: { ...firstAnchor.eligibility, recommendationEligible: false },
      },
      ...fixture.catalog.works.slice(1),
    ]);
    await expect(
      createG2Experiment({
        participantId: "participant-one",
        profile: fixture.profile,
        catalog: ineligibleCatalog,
        context: contextFor(ineligibleCatalog),
        sha256Hex,
        lexicon: strings.explanation,
      }),
    ).rejects.toThrow(/not recommendation eligible/i);

    const axisExcludedCatalog = catalogWith(
      fixture.catalog.works.map((work) =>
        work.id.startsWith("anchor-")
          ? {
              ...work,
              axes: createTestAxes({
                strategy: { state: "known", value: 4, confidence: 0.9 },
              }),
            }
          : work,
      ),
    );
    await expect(
      createG2Experiment({
        catalog: axisExcludedCatalog,
        context: contextFor(axisExcludedCatalog),
        profile: {
          ...fixture.profile,
          adjustments: { axes: { strategy: "exclude" }, themes: {} },
        },
        participantId: "participant-one",
        sha256Hex,
        lexicon: strings.explanation,
      }),
    ).rejects.toThrow(/cannot be restored/i);

    await expect(
      selectG2Holdout({
        participantId: "participant-one",
        catalogVersion: fixture.catalog.catalogVersion,
        profile: fixture.profile,
        sha256Hex: () => "ABC",
      }),
    ).rejects.toThrow(/lowercase hexadecimal/i);

    await expect(
      createG2Experiment({
        ...fixture,
        participantId: "participant-one",
        profile: {
          ...fixture.profile,
          records: [
            { ...fixture.profile.records[0], positiveReasons: ["private free text"] },
            ...fixture.profile.records.slice(1),
          ],
        },
        sha256Hex,
        lexicon: strings.explanation,
      }),
    ).rejects.toThrow(/free-text/i);
  });
});

describe("G2 strict result and cross-field validation", () => {
  it("builds canonical ordered JSON and rejects response cardinality or respondent drift", async () => {
    const fixture = engineFixture();
    fixture.profile = experimentProfileV1Schema.parse({
      ...fixture.profile,
      adjustments: {
        axes: { strategy: "auto", pacing: "auto" },
        themes: { war: "auto", combat: "auto" },
      },
    });
    const experiment = await createG2Experiment({
      ...fixture,
      participantId: "participant-one",
      sha256Hex,
      lexicon: strings.explanation,
    });
    const responses = completeResponses(experiment);
    const result = createG2Result({
      experiment,
      respondent: { kind: "syntheticPilot", label: "manual-round-trip" },
      ...responses,
      listPreference: "tie",
    });
    const serialized = serializeG2Result(result);

    expect(Object.keys(result)).toEqual([
      "format",
      "schemaVersion",
      "contractVersion",
      "participantId",
      "respondent",
      "catalogVersion",
      "factorDictionaryVersion",
      "baselineVersion",
      "profile",
      "holdoutWorkIds",
      "slots",
      "preResponses",
      "listPreference",
      "postResponses",
    ]);
    expect(serialized).toBe(`${JSON.stringify(result, null, 2)}\n`);
    expect(serializeG2Result(JSON.parse(serialized))).toBe(serialized);
    expect(
      serializeG2Result({
        ...result,
        profile: {
          ...result.profile,
          records: [...result.profile.records].reverse(),
          adjustments: {
            axes: Object.fromEntries(Object.entries(result.profile.adjustments.axes).reverse()),
            themes: Object.fromEntries(Object.entries(result.profile.adjustments.themes).reverse()),
          },
        },
      }),
    ).toBe(serialized);

    expect(
      g2ResultV1Schema.safeParse({ ...result, respondent: { kind: "human", email: "x@y.z" } })
        .success,
    ).toBe(false);
    expect(
      g2ResultV1Schema.safeParse({ ...result, preResponses: [...result.preResponses].reverse() })
        .success,
    ).toBe(false);
    const firstPost = result.postResponses[0];
    if (firstPost === undefined) {
      throw new Error("Missing test post response");
    }
    expect(
      g2ResultV1Schema.safeParse({
        ...result,
        postResponses: [{ ...firstPost, agreement: null }, ...result.postResponses.slice(1)],
      }).success,
    ).toBe(!result.slots[firstPost.slot].items[0]?.explanationAvailable);
  });

  it("recomputes every derived identity and rejects a self-consistent explanation flag tamper", async () => {
    const fixture = engineFixture();
    const experiment = await createG2Experiment({
      ...fixture,
      participantId: "participant-one",
      sha256Hex,
      lexicon: strings.explanation,
    });
    const responses = completeResponses(experiment);
    const result = createG2Result({
      experiment,
      respondent: { kind: "human" },
      ...responses,
      listPreference: "A",
    });
    await expect(
      validateG2ResultAgainstContext({
        result,
        catalog: fixture.catalog,
        context: fixture.context,
        sha256Hex,
        lexicon: strings.explanation,
      }),
    ).resolves.toEqual(result);

    const firstItem = result.slots.A.items[0];
    const firstPost = result.postResponses[0];
    if (firstItem === undefined || firstPost === undefined) {
      throw new Error("Missing G2 result fixture item");
    }
    const tampered: G2ResultV1 = {
      ...result,
      slots: {
        ...result.slots,
        A: {
          ...result.slots.A,
          items: [
            { ...firstItem, explanationAvailable: !firstItem.explanationAvailable },
            ...result.slots.A.items.slice(1),
          ],
        },
      },
      postResponses: [
        { ...firstPost, agreement: firstItem.explanationAvailable ? null : 4 },
        ...result.postResponses.slice(1),
      ],
    };
    expect(g2ResultV1Schema.safeParse(tampered).success).toBe(true);
    await expect(
      validateG2ResultAgainstContext({
        result: tampered,
        catalog: fixture.catalog,
        context: fixture.context,
        sha256Hex,
        lexicon: strings.explanation,
      }),
    ).rejects.toThrow(/derived fields/i);
  });
});

function metricCatalog() {
  const anchors = Array.from({ length: 6 }, (_, index) =>
    createTestWork({ id: `anchor-${String.fromCharCode(97 + index)}`, themes: [] }),
  );
  const safe = createTestWork({
    id: "candidate-safe",
    themes: [],
    axes: createTestAxes({ darkness: { state: "known", value: 2, confidence: 0.9 } }),
  });
  const leaky = createTestWork({
    id: "candidate-leaky",
    themes: [],
    axes: createTestAxes({ darkness: { state: "known", value: 4, confidence: 0.9 } }),
  });
  const negative = createTestWork({ id: "negative-dark", themes: [] });
  return catalogWith([...anchors, safe, leaky, negative], "metric-catalog-v1");
}

function metricResult(options: {
  participantId: string;
  preference: "A" | "B" | "tie";
  agreement: 1 | 2 | 3 | 4 | 5;
  respondent?: G2ResultV1["respondent"];
}): G2ResultV1 {
  const profile = experimentProfileV1Schema.parse({
    ...profileWith(options.participantId, 6),
    profileId: options.participantId,
    records: [
      ...profileWith(options.participantId, 6).records,
      {
        ...profileRecord("negative-dark", "disliked"),
        negativeReasons: ["tooDark"],
      },
    ],
  });
  return g2ResultV1Schema.parse({
    format: "konocomics-g2-result",
    schemaVersion: 1,
    contractVersion: "g2-v1",
    participantId: options.participantId,
    respondent: options.respondent ?? { kind: "human" },
    catalogVersion: "metric-catalog-v1",
    factorDictionaryVersion: "v1",
    baselineVersion: "v1",
    profile,
    holdoutWorkIds: ["anchor-f"],
    slots: {
      A: {
        engine: "taste",
        items: [{ rank: 1, workId: "candidate-safe", explanationAvailable: true }],
      },
      B: {
        engine: "baseline",
        items: [{ rank: 1, workId: "candidate-leaky", explanationAvailable: false }],
      },
    },
    preResponses: [
      { workId: "candidate-safe", familiarity: "unknown", wantToReadBefore: 4 },
      { workId: "candidate-leaky", familiarity: "unknown", wantToReadBefore: 3 },
    ],
    listPreference: options.preference,
    postResponses: [
      {
        slot: "A",
        rank: 1,
        workId: "candidate-safe",
        wantToReadAfter: 5,
        agreement: options.agreement,
      },
      {
        slot: "B",
        rank: 1,
        workId: "candidate-leaky",
        wantToReadAfter: 3,
        agreement: null,
      },
    ],
  });
}

describe("G2 occurrence metrics and human verdict", () => {
  it("uses integer micro counts, includes ties, counts missing explanations, and excludes pilots", () => {
    const catalog = metricCatalog();
    const humanResults = Array.from({ length: 10 }, (_, index) =>
      metricResult({
        participantId: `human-${String(index + 1)}`,
        preference: index < 6 ? "A" : index === 6 ? "tie" : "B",
        agreement: index < 7 ? 4 : 3,
      }),
    );
    const pilot = metricResult({
      participantId: "pilot-one",
      preference: "B",
      agreement: 1,
      respondent: { kind: "syntheticPilot", label: "manual-round-trip" },
    });
    const aggregate = aggregateG2Metrics([...humanResults.reverse(), pilot], catalog);

    expect(aggregate).toMatchObject({
      humanCount: 10,
      syntheticPilotCount: 1,
      preference: {
        tasteWinCount: 6,
        baselineWinCount: 3,
        tieCount: 1,
        tasteOrTieCount: 7,
      },
      engines: {
        taste: {
          unknownWantToRead: { numerator: 10, denominator: 10, rate: 1 },
          explanationAgreement: { numerator: 7, denominator: 10, rate: 0.7 },
          explanationLift: { sum: 10, denominator: 10, average: 1 },
          dislikedLeakage: { numerator: 0, denominator: 10, rate: 0 },
          holdoutRecall: { numerator: 0, denominator: 10, rate: 0 },
        },
        baseline: {
          unknownWantToRead: { numerator: 0, denominator: 10, rate: 0 },
          explanationAgreement: { numerator: 0, denominator: 10, rate: 0 },
          explanationLift: { sum: 0, denominator: 0, average: null },
          dislikedLeakage: { numerator: 10, denominator: 10, rate: 1 },
          holdoutRecall: { numerator: 0, denominator: 10, rate: 0 },
        },
      },
      criteria: {
        tasteOrTie: "PASS",
        unknownWantToRead: "PASS",
        tasteExplanationAgreement: "PASS",
        dislikedLeakage: "PASS",
        holdoutRecall: "PASS",
      },
      verdict: "GO",
    });
    expect(aggregate.participants.map((row) => row.participantId)).toEqual(
      [...aggregate.participants.map((row) => row.participantId)].sort(),
    );
  });

  it("returns INCOMPLETE outside exactly ten humans and rejects duplicate participant ids", () => {
    const catalog = metricCatalog();
    const nine = Array.from({ length: 9 }, (_, index) =>
      metricResult({ participantId: `nine-${String(index + 1)}`, preference: "A", agreement: 5 }),
    );
    const incomplete = aggregateG2Metrics(nine, catalog);
    expect(incomplete.verdict).toBe("INCOMPLETE");
    expect(new Set(Object.values(incomplete.criteria))).toEqual(new Set(["NOT_RUN"]));

    const duplicate = metricResult({ participantId: "duplicate", preference: "A", agreement: 5 });
    expect(() => aggregateG2Metrics([duplicate, duplicate], catalog)).toThrow(/duplicate/i);
  });

  it("counts a holdout hit per engine and preserves null rates for empty native lists", () => {
    const catalog = metricCatalog();
    const base = metricResult({ participantId: "recall-one", preference: "A", agreement: 5 });
    const holdoutHit = g2ResultV1Schema.parse({
      ...base,
      slots: {
        ...base.slots,
        A: {
          ...base.slots.A,
          items: [{ rank: 1, workId: "anchor-f", explanationAvailable: true }],
        },
      },
      preResponses: [
        { workId: "anchor-f", familiarity: "unknown", wantToReadBefore: 4 },
        base.preResponses[1],
      ],
      postResponses: [
        {
          slot: "A",
          rank: 1,
          workId: "anchor-f",
          wantToReadAfter: 5,
          agreement: 5,
        },
        base.postResponses[1],
      ],
    });
    const recall = calculateG2ParticipantMetrics(holdoutHit, catalog);
    expect(recall.engines.taste.holdoutRecall).toEqual({ numerator: 1, denominator: 1, rate: 1 });
    expect(recall.engines.baseline.holdoutRecall).toEqual({
      numerator: 0,
      denominator: 1,
      rate: 0,
    });

    const empty = g2ResultV1Schema.parse({
      ...base,
      slots: {
        A: { engine: "taste", items: [] },
        B: { engine: "baseline", items: [] },
      },
      preResponses: [],
      postResponses: [],
    });
    const emptyMetrics = calculateG2ParticipantMetrics(empty, catalog);
    for (const engine of ["taste", "baseline"] as const) {
      expect(emptyMetrics.engines[engine].unknownWantToRead.rate).toBeNull();
      expect(emptyMetrics.engines[engine].explanationAgreement.rate).toBeNull();
      expect(emptyMetrics.engines[engine].explanationLift.average).toBeNull();
      expect(emptyMetrics.engines[engine].dislikedLeakage.rate).toBeNull();
    }
  });
});
