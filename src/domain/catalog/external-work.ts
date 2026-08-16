import { normalizeExternalCreatorV1, normalizeExternalTitleV1 } from "./normalize";

export const EXTERNAL_WORK_ID_V1_PATTERN = /^ext:rakuten:v1:[0-9a-f]{64}$/u;
export const EXTERNAL_WORK_ID_V1_NAMESPACE = "konocomics-external-work-id-v1";
export const EXTERNAL_WORK_PROVIDER_V1 = "rakuten";
export const EXTERNAL_WORK_DETAIL_PATH = "/works/external";

export type ExternalWorkId = `ext:rakuten:v1:${string}`;
export type ExternalWorkIdentityV1 = Readonly<{
  id: ExternalWorkId;
  normalizedKey: string;
}>;
export type ExternalWorkSha256Hex = (utf8Text: string) => string | Promise<string>;
export type ExternalWorkDetailQueryResult =
  { kind: "valid"; id: ExternalWorkId } | { kind: "invalid" };
export type ExternalWorkNormalizedKeyV1 = readonly [string, string];

export function parseExternalWorkId(value: unknown): ExternalWorkId {
  if (typeof value !== "string" || !EXTERNAL_WORK_ID_V1_PATTERN.test(value)) {
    throw new TypeError("External work id must use the supported Rakuten v1 namespace");
  }
  return value as ExternalWorkId;
}

export function isExternalWorkId(value: unknown): value is ExternalWorkId {
  return typeof value === "string" && EXTERNAL_WORK_ID_V1_PATTERN.test(value);
}

export function createExternalWorkNormalizedKeyV1(title: string, primaryCreator: string): string {
  return JSON.stringify([
    normalizeExternalTitleV1(title),
    normalizeExternalCreatorV1(primaryCreator),
  ]);
}

export function parseExternalWorkNormalizedKeyV1(value: unknown): ExternalWorkNormalizedKeyV1 {
  if (typeof value !== "string") {
    throw new TypeError("External work normalized key must be canonical JSON text");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new TypeError("External work normalized key must be canonical JSON text");
  }
  if (
    !Array.isArray(parsed) ||
    parsed.length !== 2 ||
    typeof parsed[0] !== "string" ||
    typeof parsed[1] !== "string"
  ) {
    throw new TypeError("External work normalized key must contain title and primary creator");
  }
  const canonical: ExternalWorkNormalizedKeyV1 = [
    normalizeExternalTitleV1(parsed[0]),
    normalizeExternalCreatorV1(parsed[1]),
  ];
  if (
    canonical[0] !== parsed[0] ||
    canonical[1] !== parsed[1] ||
    JSON.stringify(canonical) !== value
  ) {
    throw new TypeError("External work normalized key is not canonical v1 JSON");
  }
  return canonical;
}

export async function deriveExternalWorkIdFromNormalizedKeyV1(
  normalizedKey: string,
  sha256Hex: ExternalWorkSha256Hex,
): Promise<ExternalWorkId> {
  parseExternalWorkNormalizedKeyV1(normalizedKey);
  const digestInput = `${EXTERNAL_WORK_ID_V1_NAMESPACE}\0${EXTERNAL_WORK_PROVIDER_V1}\0${normalizedKey}`;
  const digest = await sha256Hex(digestInput);
  if (!/^[0-9a-f]{64}$/u.test(digest)) {
    throw new TypeError("External work SHA-256 must be 64 lowercase hexadecimal characters");
  }
  return parseExternalWorkId(`ext:rakuten:v1:${digest}`);
}

export async function deriveExternalWorkIdentityV1(
  title: string,
  primaryCreator: string,
  sha256Hex: ExternalWorkSha256Hex,
): Promise<ExternalWorkIdentityV1> {
  const normalizedKey = createExternalWorkNormalizedKeyV1(title, primaryCreator);
  return {
    id: await deriveExternalWorkIdFromNormalizedKeyV1(normalizedKey, sha256Hex),
    normalizedKey,
  };
}

export function createExternalWorkDetailHref(id: ExternalWorkId): string {
  const query = new URLSearchParams({ workId: parseExternalWorkId(id) });
  return `${EXTERNAL_WORK_DETAIL_PATH}?${query.toString()}`;
}

export function parseExternalWorkDetailQuery(
  searchParams: URLSearchParams,
): ExternalWorkDetailQueryResult {
  const workIds = searchParams.getAll("workId");
  if (workIds.length !== 1 || !isExternalWorkId(workIds[0])) {
    return { kind: "invalid" };
  }
  return { kind: "valid", id: workIds[0] };
}
