import { describe, expect, it } from "vitest";

import { onboardingDraftSchema, type OnboardingDraft } from "@/domain/profile/onboarding";
import type { UserWorkRecord } from "@/domain/profile/types";
import {
  createExportFileV1,
  DataTransferError,
  exportFilenameV1,
  inspectExportFileV1,
  inspectExportJsonV1,
  parseCurrentCatalogIdentity,
  serializeExportFileV1,
  type CurrentCatalogIdentity,
  type ExportFileV1,
  type RawUserDataSnapshot,
} from "@/infrastructure/db/export-v1";
import type { ExternalWorkRecord } from "@/infrastructure/db/records";

const EXPORTED_AT = "2026-08-14T12:34:56+09:00";
const COMPLETED_AT = "2026-08-13T09:00:00+09:00";
const EXTERNAL_ID =
  "ext:rakuten:v1:ebbfe45c6734e41f113df7284b2e63fbdef2d285229e699a5109e835a26b88b6" as const;
const CURRENT_CATALOG: CurrentCatalogIdentity = {
  catalogVersion: "catalog-current",
  workIds: ["one", "two", "three", "four", "five", "six"],
  profileWorkIds: ["one", "two", "three", "four", "five"],
};

function externalRecord(): ExternalWorkRecord {
  return {
    id: EXTERNAL_ID,
    normalizedKey: '["きんぐだむ","原 泰久"]',
    title: "キングダム 1",
    creators: ["原 泰久"],
    isbnSamples: ["9784091855312"],
    record: {
      workId: EXTERNAL_ID,
      readingState: "reading",
      progress: { volume: 3 },
      updatedAt: EXPORTED_AT,
    },
  };
}

function firstRunDraft(): OnboardingDraft {
  return onboardingDraftSchema.parse({
    id: "current",
    mode: "firstRun",
    step: 1,
    positiveEntries: [{ workId: "one", reaction: "favorite" }],
    negativeEntries: [],
    updatedAt: EXPORTED_AT,
  });
}

function addDraft(): OnboardingDraft {
  return onboardingDraftSchema.parse({
    id: "current",
    mode: "add",
    step: 1,
    positiveEntries: [{ workId: "six", reaction: "liked" }],
    negativeEntries: [],
    updatedAt: EXPORTED_AT,
  });
}

function positiveRecords(count: number): UserWorkRecord[] {
  return CURRENT_CATALOG.workIds.slice(0, count).map((workId, index) => ({
    workId,
    readingState: "completed",
    reaction: index === 0 ? "favorite" : "liked",
    updatedAt: EXPORTED_AT,
  }));
}

function rawSnapshot(overrides: Partial<RawUserDataSnapshot> = {}): RawUserDataSnapshot {
  return {
    userWorks: [],
    externalWorks: [externalRecord()],
    profile: {
      adjustments: { axes: { pacing: "like" }, themes: {} },
      policies: {
        preferCompleted: true,
        preferHidden: false,
        preferVerified: true,
        excludeIncomplete: true,
      },
      onboardingCompletedAt: null,
    },
    onboardingDraft: firstRunDraft(),
    ...overrides,
  };
}

async function exportFile(overrides: Partial<RawUserDataSnapshot> = {}): Promise<ExportFileV1> {
  return createExportFileV1(rawSnapshot(overrides), EXPORTED_AT, "catalog-exported");
}

describe("Export v1 file contract", () => {
  it("rejects duplicate or out-of-catalog profile identity entries", () => {
    expect(() =>
      parseCurrentCatalogIdentity({
        ...CURRENT_CATALOG,
        workIds: ["one", "one"],
      }),
    ).toThrow();
    expect(() =>
      parseCurrentCatalogIdentity({
        ...CURRENT_CATALOG,
        profileWorkIds: ["missing"],
      }),
    ).toThrow();
  });

  it("exports a pre-profile draft with a required null marker and preserves every policy", async () => {
    const file = await exportFile();

    expect(file.profile).toEqual({
      adjustments: { axes: { pacing: "like" }, themes: {} },
      policies: {
        preferCompleted: true,
        preferHidden: false,
        preferVerified: true,
        excludeIncomplete: true,
      },
      onboardingCompletedAt: null,
    });
    expect(file.onboardingDraft).toEqual(firstRunDraft());
    expect(file.externalWorks).toEqual([externalRecord()]);
    expect(serializeExportFileV1(file)).toBe(`${JSON.stringify(file, null, 2)}\n`);
    expect(exportFilenameV1(EXPORTED_AT)).toBe("konocomics-export-20260814.json");

    const preview = await inspectExportJsonV1(serializeExportFileV1(file), CURRENT_CATALOG);
    expect(preview).toMatchObject({
      exportedAt: EXPORTED_AT,
      workCount: 1,
      catalogVersion: "catalog-exported",
      catalogVersionMismatch: true,
      profileState: "first-run",
    });
    expect(preview.file).toEqual(file);
  });

  it("resolves current-catalog compatibility independently from the legacy marker", async () => {
    const usableWithoutMarker = await exportFile({
      userWorks: positiveRecords(5),
      onboardingDraft: addDraft(),
    });
    await expect(inspectExportFileV1(usableWithoutMarker, CURRENT_CATALOG)).resolves.toMatchObject({
      profileState: "usable",
    });

    const recovery = await exportFile({
      userWorks: positiveRecords(3),
      profile: {
        adjustments: { axes: {}, themes: {} },
        policies: {
          preferCompleted: false,
          preferHidden: false,
          preferVerified: false,
          excludeIncomplete: false,
        },
        onboardingCompletedAt: COMPLETED_AT,
      },
      onboardingDraft: addDraft(),
    });
    await expect(inspectExportFileV1(recovery, CURRENT_CATALOG)).resolves.toMatchObject({
      profileState: "add-recovery",
    });

    const incompatible = { ...usableWithoutMarker, onboardingDraft: firstRunDraft() };
    await expect(inspectExportFileV1(incompatible, CURRENT_CATALOG)).rejects.toMatchObject({
      code: "incompatible-profile-state",
    });

    const overlappingAddDraft = {
      ...usableWithoutMarker,
      onboardingDraft: {
        ...addDraft(),
        positiveEntries: [{ workId: "one", reaction: "liked" as const }],
      },
    };
    await expect(inspectExportFileV1(overlappingAddDraft, CURRENT_CATALOG)).rejects.toMatchObject({
      code: "incompatible-profile-state",
      details: "one",
    });

    const onlyFourCurrentAnchors = await exportFile({
      userWorks: [
        ...positiveRecords(4),
        {
          workId: "outside-current-catalog",
          readingState: "completed",
          reaction: "liked",
          updatedAt: EXPORTED_AT,
        },
      ],
      onboardingDraft: null,
    });
    await expect(
      inspectExportFileV1(onlyFourCurrentAnchors, CURRENT_CATALOG),
    ).resolves.toMatchObject({
      profileState: "first-run",
    });

    const libraryOnlyFifthAnchor = await exportFile({
      userWorks: positiveRecords(4).concat({
        workId: "six",
        readingState: "completed",
        reaction: "favorite",
        updatedAt: EXPORTED_AT,
      }),
      onboardingDraft: null,
    });
    await expect(
      inspectExportFileV1(libraryOnlyFifthAnchor, CURRENT_CATALOG),
    ).resolves.toMatchObject({ profileState: "first-run" });
  });

  it("reuses the strict draft schema for duplicate and positive-negative overlap rejection", async () => {
    const file = await exportFile();
    const duplicateDraft = {
      ...firstRunDraft(),
      positiveEntries: [
        { workId: "one", reaction: "favorite" as const },
        { workId: "one", reaction: "liked" as const },
      ],
    };
    await expect(
      inspectExportFileV1({ ...file, onboardingDraft: duplicateDraft }, CURRENT_CATALOG),
    ).rejects.toMatchObject({ code: "invalid-format" });

    const overlapDraft = {
      ...firstRunDraft(),
      positiveEntries: [{ workId: "one", reaction: "favorite" as const }],
      negativeEntries: [{ workId: "one", disposition: "disliked" as const, reasons: [] }],
    };
    await expect(
      inspectExportFileV1({ ...file, onboardingDraft: overlapDraft }, CURRENT_CATALOG),
    ).rejects.toMatchObject({ code: "invalid-format" });
  });

  it("preserves current-catalog-outside records and reports only a catalog warning", async () => {
    const outsideRecord: UserWorkRecord = {
      workId: "removed-from-current-catalog",
      readingState: "completed",
      reaction: "favorite",
      updatedAt: EXPORTED_AT,
    };
    const file = await exportFile({ userWorks: [outsideRecord] });

    const preview = await inspectExportFileV1(file, CURRENT_CATALOG);
    expect(preview.catalogVersionMismatch).toBe(true);
    expect(preview.file.userWorks).toEqual([outsideRecord]);
    expect(preview.profileState).toBe("first-run");
  });

  it("rejects malformed JSON and newer file or identity versions with stable diagnostics", async () => {
    await expect(inspectExportJsonV1("{", CURRENT_CATALOG)).rejects.toMatchObject({
      code: "invalid-json",
      receivedVersion: null,
    });

    const file = await exportFile();
    await expect(
      inspectExportFileV1({ ...file, schemaVersion: 2 }, CURRENT_CATALOG),
    ).rejects.toMatchObject({
      code: "unsupported-schema-version",
      receivedVersion: 2,
    });

    const v2Id = `ext:rakuten:v2:${"a".repeat(64)}`;
    await expect(
      inspectExportFileV1(
        {
          ...file,
          externalWorks: [
            {
              ...file.externalWorks[0],
              id: v2Id,
              record: { ...file.externalWorks[0]!.record, workId: v2Id },
            },
          ],
        },
        CURRENT_CATALOG,
      ),
    ).rejects.toMatchObject({
      code: "unsupported-external-identity-version",
      receivedVersion: 2,
    });
  });

  it.each([
    [
      "digest mismatch",
      (file: ExportFileV1) => ({
        ...file,
        externalWorks: [
          {
            ...file.externalWorks[0],
            id: `ext:rakuten:v1:${"a".repeat(64)}`,
            record: {
              ...file.externalWorks[0]!.record,
              workId: `ext:rakuten:v1:${"a".repeat(64)}`,
            },
          },
        ],
      }),
    ],
    [
      "duplicate identity",
      (file: ExportFileV1) => ({
        ...file,
        externalWorks: [file.externalWorks[0], file.externalWorks[0]],
      }),
    ],
    [
      "invalid ISBN",
      (file: ExportFileV1) => ({
        ...file,
        externalWorks: [{ ...file.externalWorks[0], isbnSamples: ["invalid"] }],
      }),
    ],
  ])("rejects one %s before replacement", async (_label, mutate) => {
    const file = await exportFile();
    await expect(inspectExportFileV1(mutate(file), CURRENT_CATALOG)).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof DataTransferError && error.code === "external-identity-invalid",
    );
  });

  it("refuses to export a corrupt raw external row instead of silently dropping it", async () => {
    const corrupt = { ...externalRecord(), normalizedKey: '["べつ","作者"]' };
    await expect(exportFile({ externalWorks: [corrupt] })).rejects.toBeInstanceOf(
      DataTransferError,
    );
  });
});
