import {
  deriveExternalWorkIdFromNormalizedKeyV1,
  deriveExternalWorkIdentityV1,
  type ExternalWorkIdentityV1,
} from "@/domain/catalog/external-work";
import { isbnIdentityKey } from "@/domain/catalog/normalize";
import type { RakutenBookItem } from "@/infrastructure/rakuten";

import type { ExternalWorkRecord } from "./records";
import { parseExternalWork } from "./validation";

export class ExternalWorkIdentityConflictError extends Error {
  constructor(readonly id: string) {
    super(`External work identity collision: ${id}`);
    this.name = "ExternalWorkIdentityConflictError";
  }
}

export class ExternalWorkCorruptRecordError extends Error {
  constructor(readonly id: string | null) {
    super(`External work record is corrupt${id === null ? "" : `: ${id}`}`);
    this.name = "ExternalWorkCorruptRecordError";
  }
}

export class ExternalWorkNotFoundError extends Error {
  constructor(readonly id: string) {
    super(`External work no longer exists: ${id}`);
    this.name = "ExternalWorkNotFoundError";
  }
}

export async function sha256Utf8Hex(value: string): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function createExternalWorkIdentity(
  title: string,
  primaryCreator: string,
): Promise<ExternalWorkIdentityV1> {
  return deriveExternalWorkIdentityV1(title, primaryCreator, sha256Utf8Hex);
}

export async function createPlannedExternalWorkRecord(
  item: RakutenBookItem,
  updatedAt: string,
): Promise<ExternalWorkRecord> {
  const identity = await createExternalWorkIdentity(item.title, item.author);
  return parseExternalWork({
    ...identity,
    title: item.title,
    creators: [item.author],
    isbnSamples: [item.isbn],
    ...(item.imageUrl === undefined ? {} : { coverUrl: item.imageUrl }),
    record: {
      workId: identity.id,
      readingState: "planned",
      updatedAt,
    },
  });
}

export async function hasValidExternalWorkIdentity(record: ExternalWorkRecord): Promise<boolean> {
  try {
    return (
      (await deriveExternalWorkIdFromNormalizedKeyV1(record.normalizedKey, sha256Utf8Hex)) ===
      record.id
    );
  } catch {
    return false;
  }
}

export function mergeExternalWorkOnInsert(
  existing: ExternalWorkRecord,
  incoming: ExternalWorkRecord,
): ExternalWorkRecord {
  if (existing.id !== incoming.id || existing.normalizedKey !== incoming.normalizedKey) {
    throw new ExternalWorkIdentityConflictError(incoming.id);
  }
  const isbnSamples: string[] = [];
  const seen = new Set<string>();
  for (const isbn of [...existing.isbnSamples, ...incoming.isbnSamples]) {
    const canonicalIsbn = isbnIdentityKey(isbn);
    if (!seen.has(canonicalIsbn)) {
      isbnSamples.push(canonicalIsbn);
      seen.add(canonicalIsbn);
    }
  }
  return isbnSamples.length === existing.isbnSamples.length &&
    isbnSamples.every((isbn, index) => isbn === existing.isbnSamples[index])
    ? existing
    : { ...existing, isbnSamples };
}
