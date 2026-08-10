import { describe, expect, it } from "vitest";

import {
  createExperimentProfileV1Schema,
  experimentProfileV1Schema,
} from "@/domain/profile/experiment-schema";
import { createTestCatalog, createTestWork } from "../../helpers/catalog";
import type { CatalogV1 } from "@/domain/catalog/types";

type ProfileRecordInput = {
  workId: string;
  readingState: string;
  reaction?: string;
  progress?: Record<string, unknown>;
  positiveReasons?: string[];
  negativeReasons?: string[];
  droppedReasons?: string[];
  updatedAt: string;
  [key: string]: unknown;
};

type ProfileInput = {
  format: string;
  schemaVersion: number;
  profileId: string;
  records: ProfileRecordInput[];
  adjustments: {
    axes: Record<string, string>;
    themes: Record<string, string>;
  };
  policies: {
    preferCompleted: boolean;
    preferHidden: boolean;
    preferVerified: boolean;
    excludeIncomplete: boolean;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

function validProfile(): ProfileInput {
  return {
    format: "konocomics-experiment-profile",
    schemaVersion: 1,
    profileId: "valid-profile",
    records: ["anchor-a", "anchor-b", "anchor-c", "anchor-d", "anchor-e"].map((workId, index) => ({
      workId,
      readingState: "completed",
      reaction: index === 0 ? "favorite" : "liked",
      updatedAt: "2000-01-01T00:00:00.000Z",
    })),
    adjustments: { axes: {}, themes: {} },
    policies: {
      preferCompleted: false,
      preferHidden: false,
      preferVerified: false,
      excludeIncomplete: false,
    },
  };
}

function recordAt(profile: ProfileInput, index: number): ProfileRecordInput {
  const record = profile.records[index];
  if (record === undefined) {
    throw new Error(`Missing test record at index ${String(index)}`);
  }
  return record;
}

function catalogForProfile(): CatalogV1 {
  return {
    ...createTestCatalog(),
    works: ["anchor-a", "anchor-b", "anchor-c", "anchor-d", "anchor-e"].map((id) =>
      createTestWork({ id }),
    ),
    volumes: [],
    representativeVolumeByWorkId: {},
  };
}

describe("experiment profile v1 schema", () => {
  it("accepts the strict v1 wrapper and binds every record to the catalog", () => {
    const profile = validProfile();
    expect(createExperimentProfileV1Schema(catalogForProfile()).parse(profile)).toEqual(profile);
  });

  it.each([
    ["empty", ""],
    ["uppercase", "Invalid-profile"],
    ["double hyphen", "invalid--profile"],
    ["leading hyphen", "-invalid"],
    ["trailing hyphen", "invalid-"],
    ["too long", `a${"-a".repeat(32)}`],
  ])("rejects a %s profileId", (_label, profileId) => {
    expect(experimentProfileV1Schema.safeParse({ ...validProfile(), profileId }).success).toBe(
      false,
    );
  });

  it("requires an offset-bearing ISO timestamp", () => {
    const profile = validProfile();
    profile.records[0] = {
      ...recordAt(profile, 0),
      updatedAt: "2000-01-01T00:00:00",
    };
    expect(experimentProfileV1Schema.safeParse(profile).success).toBe(false);
  });

  it("rejects unknown wrapper, record, progress, adjustment, and policy keys", () => {
    const wrapper = { ...validProfile(), extra: true };
    expect(experimentProfileV1Schema.safeParse(wrapper).success).toBe(false);

    const record = validProfile();
    record.records[0] = { ...recordAt(record, 0), extra: true };
    expect(experimentProfileV1Schema.safeParse(record).success).toBe(false);

    const progress = validProfile();
    progress.records[0] = { ...recordAt(progress, 0), progress: { volume: 1, extra: true } };
    expect(experimentProfileV1Schema.safeParse(progress).success).toBe(false);

    const adjustment = validProfile();
    adjustment.adjustments.axes = { unknownAxis: "like" };
    expect(experimentProfileV1Schema.safeParse(adjustment).success).toBe(false);

    const policy = validProfile();
    expect(
      experimentProfileV1Schema.safeParse({
        ...policy,
        policies: { ...policy.policies, extra: false },
      }).success,
    ).toBe(false);
  });

  it("requires every policy to be explicitly false", () => {
    const profile = validProfile();
    expect(
      experimentProfileV1Schema.safeParse({
        ...profile,
        policies: { ...profile.policies, preferCompleted: true },
      }).success,
    ).toBe(false);
    const incompletePolicies = {
      preferCompleted: false,
      preferVerified: false,
      excludeIncomplete: false,
    };
    expect(
      experimentProfileV1Schema.safeParse({ ...profile, policies: incompletePolicies }).success,
    ).toBe(false);
  });

  it("accepts only bounded slug-shaped external reasons", () => {
    const profile = validProfile();
    profile.records.push({
      workId: "negative",
      readingState: "completed",
      reaction: "disliked",
      negativeReasons: ["external:no-time"],
      updatedAt: "2000-01-01T00:00:00.000Z",
    });
    expect(experimentProfileV1Schema.safeParse(profile).success).toBe(true);

    for (const reason of [
      "external:",
      "external:NoTime",
      "external:no_time",
      `external:${"a".repeat(56)}`,
    ]) {
      profile.records[5] = { ...recordAt(profile, 5), negativeReasons: [reason] };
      expect(experimentProfileV1Schema.safeParse(profile).success).toBe(false);
    }
  });

  it("rejects duplicate work ids and duplicates in every reason array", () => {
    const duplicateWork = validProfile();
    duplicateWork.records[1] = { ...recordAt(duplicateWork, 1), workId: "anchor-a" };
    expect(experimentProfileV1Schema.safeParse(duplicateWork).success).toBe(false);

    const duplicateReasons = validProfile();
    duplicateReasons.records[0] = {
      ...recordAt(duplicateReasons, 0),
      positiveReasons: ["specific", "specific"],
    };
    expect(experimentProfileV1Schema.safeParse(duplicateReasons).success).toBe(false);

    const duplicateNegative = validProfile();
    duplicateNegative.records.push({
      workId: "negative",
      readingState: "dropped",
      reaction: "disliked",
      negativeReasons: ["tooDark", "tooDark"],
      droppedReasons: ["tooSlow", "tooSlow"],
      updatedAt: "2000-01-01T00:00:00.000Z",
    });
    expect(experimentProfileV1Schema.safeParse(duplicateNegative).success).toBe(false);
  });

  it("does not echo free-text reasons in validation diagnostics", () => {
    const profile = validProfile();
    profile.records[0] = {
      ...recordAt(profile, 0),
      positiveReasons: ["private participant note", "private participant note"],
    };
    const result = experimentProfileV1Schema.safeParse(profile);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(JSON.stringify(result.error.issues)).not.toContain("private participant note");
    }
  });

  it("keeps negative and dropped reasons disjoint and vagueDislike solitary", () => {
    const intersection = validProfile();
    intersection.records.push({
      workId: "negative",
      readingState: "dropped",
      reaction: "disliked",
      negativeReasons: ["tooDark"],
      droppedReasons: ["tooDark"],
      updatedAt: "2000-01-01T00:00:00.000Z",
    });
    expect(experimentProfileV1Schema.safeParse(intersection).success).toBe(false);

    const vagueMixture = validProfile();
    vagueMixture.records.push({
      workId: "negative",
      readingState: "dropped",
      reaction: "disliked",
      negativeReasons: ["vagueDislike"],
      droppedReasons: ["external:no-time"],
      updatedAt: "2000-01-01T00:00:00.000Z",
    });
    expect(experimentProfileV1Schema.safeParse(vagueMixture).success).toBe(false);
  });

  it("allows negativeReasons only for disliked and droppedReasons only for dropped", () => {
    const wrongReaction = validProfile();
    wrongReaction.records[0] = {
      ...recordAt(wrongReaction, 0),
      negativeReasons: ["tooDark"],
    };
    expect(experimentProfileV1Schema.safeParse(wrongReaction).success).toBe(false);

    const wrongState = validProfile();
    wrongState.records[0] = {
      ...recordAt(wrongState, 0),
      droppedReasons: ["tooSlow"],
    };
    expect(experimentProfileV1Schema.safeParse(wrongState).success).toBe(false);
  });

  it("requires 5-10 positive anchors and allows at most 3 negative sources", () => {
    const tooFew = validProfile();
    tooFew.records.pop();
    expect(experimentProfileV1Schema.safeParse(tooFew).success).toBe(false);

    const tooMany = validProfile();
    for (let index = 6; index <= 11; index += 1) {
      tooMany.records.push({
        workId: `anchor-${String(index)}`,
        readingState: "completed",
        reaction: "liked",
        updatedAt: "2000-01-01T00:00:00.000Z",
      });
    }
    expect(experimentProfileV1Schema.safeParse(tooMany).success).toBe(false);

    const negativeSources = validProfile();
    for (let index = 1; index <= 4; index += 1) {
      negativeSources.records.push({
        workId: `negative-${String(index)}`,
        readingState: "completed",
        reaction: "disliked",
        updatedAt: "2000-01-01T00:00:00.000Z",
      });
    }
    expect(experimentProfileV1Schema.safeParse(negativeSources).success).toBe(false);
  });

  it("rejects a record whose work id is absent from the catalog", () => {
    const profile = validProfile();
    profile.records[0] = { ...recordAt(profile, 0), workId: "not-in-catalog" };
    expect(createExperimentProfileV1Schema(catalogForProfile()).safeParse(profile).success).toBe(
      false,
    );
  });
});
