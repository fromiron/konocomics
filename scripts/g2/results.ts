import { createHash } from "node:crypto";
import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { TextDecoder } from "node:util";

import {
  canonicalizeG2Result,
  validateG2ResultAgainstContext,
  type G2ResultV1,
} from "../../src/domain/g2";
import type { CatalogV1 } from "../../src/domain/catalog/types";
import type { ExplanationLexicon } from "../../src/domain/explanation";
import type { RecommendationContext } from "../../src/domain/recommendation/types";
import { ExperimentDataError } from "../experiment/errors";
import { canonicalPathIdentity, readStableBytes } from "../experiment/io";
import { DEFAULT_G2_PATHS } from "./options";

export const G2_RESULT_FILE_LIMIT = 1 * 1024 * 1024;

function compareCodeUnits(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

export async function discoverDefaultG2ResultPaths(workingDirectory: string): Promise<string[]> {
  const directory = resolve(workingDirectory, DEFAULT_G2_PATHS.resultsDirectory);
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    throw new ExperimentDataError("Unable to read the default G2 result directory", {
      cause: error,
    });
  }
  const paths = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => resolve(directory, entry.name))
    .sort(compareCodeUnits);
  if (paths.length === 0) {
    throw new ExperimentDataError("The default G2 result directory has no JSON files");
  }
  return paths;
}

export async function resolveG2ResultPaths(
  paths: readonly string[],
  workingDirectory: string,
): Promise<string[]> {
  return paths.length === 0
    ? discoverDefaultG2ResultPaths(workingDirectory)
    : paths.map((path) => resolve(workingDirectory, path));
}

export async function assertDistinctG2InputTargets(paths: readonly string[]) {
  const identities = await Promise.all(paths.map((path) => canonicalPathIdentity(path)));
  const canonicalPaths = new Set<string>();
  const inodeKeys = new Set<string>();
  for (const identity of identities) {
    if (canonicalPaths.has(identity.path)) {
      throw new ExperimentDataError("Duplicate G2 input path or identity");
    }
    canonicalPaths.add(identity.path);
    if (identity.inodeKey !== undefined) {
      if (inodeKeys.has(identity.inodeKey)) {
        throw new ExperimentDataError("Duplicate G2 input path or identity");
      }
      inodeKeys.add(identity.inodeKey);
    }
  }
}

function parseCanonicalResultBytes(bytes: Buffer, path: string): unknown {
  let text: string;
  let value: unknown;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    value = JSON.parse(text) as unknown;
  } catch (error) {
    throw new ExperimentDataError(`Invalid G2 result JSON: ${path}`, { cause: error });
  }
  let canonical: string;
  try {
    const validated = canonicalizeG2Result(value);
    canonical = `${JSON.stringify(validated, null, 2)}\n`;
  } catch (error) {
    throw new ExperimentDataError(`Invalid G2 result schema: ${path}`, { cause: error });
  }
  if (!bytes.equals(Buffer.from(canonical, "utf8"))) {
    throw new ExperimentDataError(`G2 result is not canonical JSON: ${path}`);
  }
  return value;
}

function sha256Hex(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export async function loadG2Results(options: {
  paths: readonly string[];
  catalog: CatalogV1;
  context: RecommendationContext;
  lexicon: ExplanationLexicon;
}): Promise<G2ResultV1[]> {
  await assertDistinctG2InputTargets(options.paths);
  const results = await Promise.all(
    options.paths.map(async (path) => {
      const bytes = await readStableBytes(path, G2_RESULT_FILE_LIMIT);
      const parsed = parseCanonicalResultBytes(bytes, path);
      try {
        return await validateG2ResultAgainstContext({
          result: parsed,
          catalog: options.catalog,
          context: options.context,
          lexicon: options.lexicon,
          sha256Hex,
        });
      } catch (error) {
        throw new ExperimentDataError(`G2 result does not match the frozen context: ${path}`, {
          cause: error,
        });
      }
    }),
  );
  return results.sort((left, right) => compareCodeUnits(left.participantId, right.participantId));
}
