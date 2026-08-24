import * as z from "zod/v4";

import type { OnboardingDraft } from "@/domain/profile/onboarding";
import type {
  ProfileAdjustments,
  RecommendationPolicies,
  UserWorkRecord,
} from "@/domain/profile/types";

import { DATABASE_SCHEMA_VERSION } from "./database";
import { hasValidExternalWorkIdentity } from "./external-work";
import type { ExternalWorkRecord } from "./records";
import {
  createDefaultRecommendationPolicies,
  createEmptyProfileAdjustments,
  parseExternalWorks,
  parseOnboardingCompletedAt,
  parseOnboardingDraft,
  parseProfileAdjustments,
  parseRecommendationPolicies,
  parseUserWorks,
} from "./validation";

export const EXPORT_FORMAT = "konocomics-export" as const;
export const EXPORT_SCHEMA_VERSION = 1 as const;

export type CurrentCatalogIdentity = Readonly<{
  catalogVersion: string;
  workIds: readonly string[];
  profileWorkIds: readonly string[];
}>;

export type ExportProfileV1 = Readonly<{
  adjustments: ProfileAdjustments;
  policies: RecommendationPolicies;
  onboardingCompletedAt: string | null;
}>;

export type UserDataSnapshot = Readonly<{
  userWorks: UserWorkRecord[];
  externalWorks: ExternalWorkRecord[];
  profile: ExportProfileV1;
  onboardingDraft: OnboardingDraft | null;
}>;

export type RawUserDataSnapshot = Readonly<{
  userWorks: unknown;
  externalWorks: unknown;
  profile: Readonly<{
    adjustments: unknown | null;
    policies: unknown | null;
    onboardingCompletedAt: unknown | null;
  }>;
  onboardingDraft: unknown | null;
}>;

export type ExportFileV1 = Readonly<{
  format: typeof EXPORT_FORMAT;
  schemaVersion: typeof EXPORT_SCHEMA_VERSION;
  exportedAt: string;
  catalogVersion: string;
  userWorks: UserWorkRecord[];
  externalWorks: ExternalWorkRecord[];
  profile: ExportProfileV1;
  onboardingDraft: OnboardingDraft | null;
}>;

export type ImportedProfileState = "usable" | "add-recovery" | "first-run";

export type ImportPreviewV1 = Readonly<{
  file: ExportFileV1;
  exportedAt: string;
  workCount: number;
  catalogVersion: string;
  catalogVersionMismatch: boolean;
  profileState: ImportedProfileState;
}>;

export type RuntimeMetaV2 = Readonly<{
  schemaVersion: typeof DATABASE_SCHEMA_VERSION;
  catalogVersion: string;
}>;

export type DataStoreCounts = Readonly<{
  userWorks: number;
  externalWorks: number;
  profile: number;
  onboardingDraft: number;
  recommendationCache: number;
  providerCache: number;
}>;

export type DataMutationReadback = Readonly<{
  counts: DataStoreCounts;
  meta: RuntimeMetaV2;
}>;

export type DataMutationResult =
  | Readonly<{
      kind: "applied";
      mode: "indexeddb" | "session-only";
      readback: DataMutationReadback;
    }>
  | Readonly<{
      kind: "indeterminate";
      operation: "replace" | "delete";
      recovery: "reload";
    }>;

export type DataTransferErrorCode =
  | "invalid-json"
  | "invalid-format"
  | "unsupported-schema-version"
  | "unsupported-external-identity-version"
  | "external-identity-invalid"
  | "incompatible-profile-state";

type DataTransferErrorOptions = Readonly<{
  receivedVersion?: number;
  details?: string;
  cause?: unknown;
}>;

export class DataTransferError extends Error {
  readonly code: DataTransferErrorCode;
  readonly receivedVersion: number | null;
  readonly details: string | null;

  constructor(
    code: DataTransferErrorCode,
    message: string,
    options: DataTransferErrorOptions = {},
  ) {
    super(message, { cause: options.cause });
    this.name = "DataTransferError";
    this.code = code;
    this.receivedVersion = options.receivedVersion ?? null;
    this.details = options.details ?? null;
  }
}

export class DataSnapshotUnavailableError extends Error {
  readonly recovery = "reload" as const;

  constructor(options: Readonly<{ cause?: unknown }> = {}) {
    super("The persistent data snapshot could not be read authoritatively", {
      cause: options.cause,
    });
    this.name = "DataSnapshotUnavailableError";
  }
}

const timestampSchema = z.iso.datetime({ offset: true });

const currentCatalogIdentitySchema = z
  .strictObject({
    catalogVersion: z.string().trim().min(1),
    workIds: z.array(z.string().min(1)),
    profileWorkIds: z.array(z.string().min(1)),
  })
  .superRefine((catalog, context) => {
    const workIds = new Set<string>();
    for (const [field, values] of [
      ["workIds", catalog.workIds],
      ["profileWorkIds", catalog.profileWorkIds],
    ] as const) {
      const seen = new Set<string>();
      values.forEach((workId, index) => {
        if (seen.has(workId)) {
          context.addIssue({
            code: "custom",
            path: [field, index],
            message: `Current catalog ${field} must be unique`,
          });
        }
        seen.add(workId);
        if (field === "workIds") workIds.add(workId);
      });
    }
    catalog.profileWorkIds.forEach((workId, index) => {
      if (!workIds.has(workId)) {
        context.addIssue({
          code: "custom",
          path: ["profileWorkIds", index],
          message: "Profile work id must belong to the current catalog",
        });
      }
    });
  });

const exportEnvelopeV1Schema = z.strictObject({
  format: z.literal(EXPORT_FORMAT),
  schemaVersion: z.literal(EXPORT_SCHEMA_VERSION),
  exportedAt: timestampSchema,
  catalogVersion: z.string().trim().min(1),
  userWorks: z.unknown(),
  externalWorks: z.unknown(),
  profile: z.strictObject({
    adjustments: z.unknown(),
    policies: z.unknown(),
    onboardingCompletedAt: z.unknown().nullable(),
  }),
  onboardingDraft: z.unknown().nullable(),
});

function issueDetails(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues
      .map((issue) => `${issue.path.join(".") || "file"}: ${issue.message}`)
      .join("; ");
  }
  return error instanceof Error ? error.message : "Unknown validation error";
}

function rawObject(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function rejectUnsupportedVersions(value: unknown): void {
  const envelope = rawObject(value);
  if (envelope === null) return;

  const schemaVersion = envelope.schemaVersion;
  if (typeof schemaVersion === "number" && Number.isInteger(schemaVersion) && schemaVersion > 1) {
    throw new DataTransferError(
      "unsupported-schema-version",
      `Export schema v${String(schemaVersion)} is newer than supported v1`,
      { receivedVersion: schemaVersion },
    );
  }

  if (!Array.isArray(envelope.externalWorks)) return;
  for (const value of envelope.externalWorks) {
    const record = rawObject(value);
    const id = record?.id;
    if (typeof id !== "string") continue;
    const match = /^ext:rakuten:v(\d+):/u.exec(id);
    if (match === null) continue;
    const identityVersion = Number(match[1]);
    if (Number.isSafeInteger(identityVersion) && identityVersion > 1) {
      throw new DataTransferError(
        "unsupported-external-identity-version",
        `External identity v${String(identityVersion)} is newer than supported v1`,
        { receivedVersion: identityVersion },
      );
    }
  }
}

export function parseCurrentCatalogIdentity(value: CurrentCatalogIdentity): CurrentCatalogIdentity {
  const parsed = currentCatalogIdentitySchema.parse({
    catalogVersion: value.catalogVersion,
    workIds: [...value.workIds],
    profileWorkIds: [...value.profileWorkIds],
  });
  return {
    catalogVersion: parsed.catalogVersion,
    workIds: parsed.workIds,
    profileWorkIds: parsed.profileWorkIds,
  };
}

export function runtimeMetaV2(catalogVersion: string): RuntimeMetaV2 {
  return {
    schemaVersion: DATABASE_SCHEMA_VERSION,
    catalogVersion: z.string().trim().min(1).parse(catalogVersion),
  };
}

export function parseUserDataSnapshot(value: RawUserDataSnapshot): UserDataSnapshot {
  return {
    userWorks: parseUserWorks(value.userWorks),
    externalWorks: parseExternalWorks(value.externalWorks),
    profile: {
      adjustments:
        value.profile.adjustments === null
          ? createEmptyProfileAdjustments()
          : parseProfileAdjustments(value.profile.adjustments),
      policies:
        value.profile.policies === null
          ? createDefaultRecommendationPolicies()
          : parseRecommendationPolicies(value.profile.policies),
      onboardingCompletedAt: parseOnboardingCompletedAt(value.profile.onboardingCompletedAt),
    },
    onboardingDraft:
      value.onboardingDraft === null ? null : parseOnboardingDraft(value.onboardingDraft),
  };
}

async function assertExternalIdentities(
  externalWorks: readonly ExternalWorkRecord[],
): Promise<void> {
  const valid = await Promise.all(
    externalWorks.map((record) => hasValidExternalWorkIdentity(record)),
  );
  const invalidIndex = valid.findIndex((value) => !value);
  if (invalidIndex >= 0) {
    const record = externalWorks[invalidIndex];
    throw new DataTransferError(
      "external-identity-invalid",
      "An external work identity does not match its canonical key and digest",
      { details: record?.id ?? `externalWorks.${String(invalidIndex)}` },
    );
  }
}

export async function validateUserDataSnapshot(
  value: RawUserDataSnapshot,
): Promise<UserDataSnapshot> {
  let snapshot: UserDataSnapshot;
  try {
    snapshot = parseUserDataSnapshot(value);
  } catch (error) {
    throw new DataTransferError("invalid-format", "The data snapshot is invalid", {
      cause: error,
      details: issueDetails(error),
    });
  }
  await assertExternalIdentities(snapshot.externalWorks);
  return snapshot;
}

function parseExportEnvelope(value: unknown): ExportFileV1 {
  rejectUnsupportedVersions(value);

  let envelope: z.infer<typeof exportEnvelopeV1Schema>;
  try {
    envelope = exportEnvelopeV1Schema.parse(value);
  } catch (error) {
    throw new DataTransferError("invalid-format", "The export file format is invalid", {
      cause: error,
      details: issueDetails(error),
    });
  }

  let userWorks: UserWorkRecord[];
  let externalWorks: ExternalWorkRecord[];
  let profile: ExportProfileV1;
  let onboardingDraft: OnboardingDraft | null;
  try {
    userWorks = parseUserWorks(envelope.userWorks);
    profile = {
      adjustments: parseProfileAdjustments(envelope.profile.adjustments),
      policies: parseRecommendationPolicies(envelope.profile.policies),
      onboardingCompletedAt: parseOnboardingCompletedAt(envelope.profile.onboardingCompletedAt),
    };
    onboardingDraft =
      envelope.onboardingDraft === null ? null : parseOnboardingDraft(envelope.onboardingDraft);
  } catch (error) {
    throw new DataTransferError("invalid-format", "The export file data is invalid", {
      cause: error,
      details: issueDetails(error),
    });
  }

  try {
    externalWorks = parseExternalWorks(envelope.externalWorks);
  } catch (error) {
    throw new DataTransferError(
      "external-identity-invalid",
      "The export contains an invalid external work",
      { cause: error, details: issueDetails(error) },
    );
  }

  return {
    format: EXPORT_FORMAT,
    schemaVersion: EXPORT_SCHEMA_VERSION,
    exportedAt: envelope.exportedAt,
    catalogVersion: envelope.catalogVersion,
    userWorks,
    externalWorks,
    profile,
    onboardingDraft,
  };
}

export function resolveImportedProfileState(
  snapshot: Pick<UserDataSnapshot, "userWorks" | "profile">,
  currentCatalog: CurrentCatalogIdentity,
): ImportedProfileState {
  const catalog = parseCurrentCatalogIdentity(currentCatalog);
  const currentWorkIds = new Set(catalog.profileWorkIds);
  const positiveWorkIds = new Set<string>();
  for (const record of snapshot.userWorks) {
    if (
      currentWorkIds.has(record.workId) &&
      (record.reaction === "favorite" || record.reaction === "liked")
    ) {
      positiveWorkIds.add(record.workId);
      if (positiveWorkIds.size >= 5) return "usable";
    }
  }
  return snapshot.profile.onboardingCompletedAt === null ? "first-run" : "add-recovery";
}

function assertCompatibleDraft(
  snapshot: UserDataSnapshot,
  profileState: ImportedProfileState,
): void {
  const draft = snapshot.onboardingDraft;
  if (draft === null) return;
  const expectedMode = profileState === "first-run" ? "firstRun" : "add";
  if (draft.mode !== expectedMode) {
    throw new DataTransferError(
      "incompatible-profile-state",
      `The onboarding draft mode ${draft.mode} is incompatible with ${profileState}`,
      { details: `expected ${expectedMode}` },
    );
  }
  if (draft.mode === "add") {
    const importedWorkIds = new Set(snapshot.userWorks.map((record) => record.workId));
    const overlap = draft.positiveEntries.find((entry) => importedWorkIds.has(entry.workId));
    if (overlap !== undefined) {
      throw new DataTransferError(
        "incompatible-profile-state",
        "An add-mode draft cannot contain an already imported user work",
        { details: overlap.workId },
      );
    }
  }
}

export async function inspectExportFileV1(
  value: unknown,
  currentCatalog: CurrentCatalogIdentity,
): Promise<ImportPreviewV1> {
  const catalog = parseCurrentCatalogIdentity(currentCatalog);
  const file = parseExportEnvelope(value);
  await assertExternalIdentities(file.externalWorks);
  const snapshot = exportFileToSnapshot(file);
  const profileState = resolveImportedProfileState(snapshot, catalog);
  assertCompatibleDraft(snapshot, profileState);
  return {
    file,
    exportedAt: file.exportedAt,
    workCount: file.userWorks.length + file.externalWorks.length,
    catalogVersion: file.catalogVersion,
    catalogVersionMismatch: file.catalogVersion !== catalog.catalogVersion,
    profileState,
  };
}

export async function inspectExportJsonV1(
  jsonText: string,
  currentCatalog: CurrentCatalogIdentity,
): Promise<ImportPreviewV1> {
  let value: unknown;
  try {
    value = JSON.parse(z.string().parse(jsonText));
  } catch (error) {
    throw new DataTransferError("invalid-json", "The import file is not valid JSON", {
      cause: error,
      details: issueDetails(error),
    });
  }
  return inspectExportFileV1(value, currentCatalog);
}

export async function createExportFileV1(
  snapshotValue: RawUserDataSnapshot,
  exportedAt: string,
  catalogVersion: string,
): Promise<ExportFileV1> {
  const snapshot = await validateUserDataSnapshot(snapshotValue);
  return {
    format: EXPORT_FORMAT,
    schemaVersion: EXPORT_SCHEMA_VERSION,
    exportedAt: timestampSchema.parse(exportedAt),
    catalogVersion: z.string().trim().min(1).parse(catalogVersion),
    userWorks: snapshot.userWorks,
    externalWorks: snapshot.externalWorks,
    profile: snapshot.profile,
    onboardingDraft: snapshot.onboardingDraft,
  };
}

export function exportFileToSnapshot(file: ExportFileV1): UserDataSnapshot {
  return {
    userWorks: file.userWorks,
    externalWorks: file.externalWorks,
    profile: file.profile,
    onboardingDraft: file.onboardingDraft,
  };
}

export function serializeExportFileV1(file: ExportFileV1): string {
  return `${JSON.stringify(file, null, 2)}\n`;
}

export function exportFilenameV1(exportedAt: string): string {
  const date = timestampSchema.parse(exportedAt).slice(0, 10).replaceAll("-", "");
  return `konocomics-export-${date}.json`;
}
