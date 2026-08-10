import { resolve } from "node:path";

import type { CatalogV1 } from "../../src/domain/catalog/types";
import {
  createExperimentProfileV1Schema,
  type ExperimentProfileV1,
} from "../../src/domain/profile/experiment-schema";
import { ExperimentDataError } from "./errors";
import { discoverDefaultProfilePaths, EXPERIMENT_FILE_LIMITS, readBoundedJson } from "./io";

function compareCodeUnits(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function formatProfileIssues(issues: readonly { path: PropertyKey[]; message: string }[]) {
  return issues
    .map((issue) => `${issue.path.map(String).join(".") || "profile"}: ${issue.message}`)
    .join("\n");
}

export async function resolveExperimentProfilePaths(
  profilePaths: readonly string[],
  workingDirectory: string,
): Promise<string[]> {
  if (profilePaths.length === 0) {
    return discoverDefaultProfilePaths(workingDirectory);
  }
  return profilePaths.map((path) => resolve(workingDirectory, path));
}

export async function loadExperimentProfiles(
  profilePaths: readonly string[],
  catalog: CatalogV1,
): Promise<ExperimentProfileV1[]> {
  const schema = createExperimentProfileV1Schema(catalog);
  const profiles: ExperimentProfileV1[] = [];

  for (const path of profilePaths) {
    const input = await readBoundedJson(path, EXPERIMENT_FILE_LIMITS.profile);
    const result = schema.safeParse(input);
    if (!result.success) {
      throw new ExperimentDataError(
        `Invalid experiment profile\n${formatProfileIssues(result.error.issues)}`,
      );
    }
    profiles.push(result.data);
  }

  profiles.sort((left, right) => compareCodeUnits(left.profileId, right.profileId));
  for (let index = 1; index < profiles.length; index += 1) {
    const previous = profiles[index - 1];
    const current = profiles[index];
    if (
      previous !== undefined &&
      current !== undefined &&
      previous.profileId === current.profileId
    ) {
      throw new ExperimentDataError(`Duplicate experiment profile id: ${current.profileId}`);
    }
  }
  return profiles;
}
