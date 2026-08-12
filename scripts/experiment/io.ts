import { constants } from "node:fs";
import { mkdir, open, readdir, realpath, rename, stat, unlink } from "node:fs/promises";
import type { FileHandle } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { TextDecoder } from "node:util";

import { ExperimentDataError, ExperimentUsageError } from "./errors";
import { DEFAULT_EXPERIMENT_PATHS } from "./options";

export const EXPERIMENT_FILE_LIMITS = {
  profile: 1 * 1024 * 1024,
  catalog: 16 * 1024 * 1024,
  context: 16 * 1024 * 1024,
} as const;

function compareCodeUnits(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

export type CanonicalPathIdentity = {
  path: string;
  inodeKey?: string;
};

export async function canonicalPathIdentity(path: string): Promise<CanonicalPathIdentity> {
  const resolvedPath = resolve(path);
  try {
    const canonicalPath = await realpath(resolvedPath);
    const metadata = await stat(canonicalPath);
    return {
      path: canonicalPath,
      inodeKey: `${String(metadata.dev)}:${String(metadata.ino)}`,
    };
  } catch (error) {
    if (!isMissingPathError(error)) {
      throw new ExperimentDataError("Unable to resolve an experiment path", { cause: error });
    }
  }

  const parent = dirname(resolvedPath);
  if (parent === resolvedPath) {
    throw new ExperimentDataError("Unable to resolve an experiment path");
  }
  const canonicalParent = await canonicalPathIdentity(parent);
  return { path: resolve(canonicalParent.path, basename(resolvedPath)) };
}

export async function discoverDefaultProfilePaths(workingDirectory: string): Promise<string[]> {
  const profilesDirectory = resolve(workingDirectory, DEFAULT_EXPERIMENT_PATHS.profilesDirectory);
  let entries;
  try {
    entries = await readdir(profilesDirectory, { withFileTypes: true });
  } catch (error) {
    throw new ExperimentDataError("Unable to read the default experiment profile directory", {
      cause: error,
    });
  }

  const paths = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => resolve(profilesDirectory, entry.name))
    .sort(compareCodeUnits);
  if (paths.length === 0) {
    throw new ExperimentDataError("The default experiment profile directory has no JSON files");
  }
  return paths;
}

export async function readStableBytes(path: string, maximumBytes: number): Promise<Buffer> {
  let file: FileHandle | undefined;
  try {
    file = await open(path, constants.O_RDONLY | constants.O_NONBLOCK);
    const metadata = await file.stat();
    if (!metadata.isFile()) {
      throw new ExperimentDataError("Experiment input must be a regular file");
    }
    if (metadata.size > maximumBytes) {
      throw new ExperimentDataError(
        `Experiment input exceeds the ${String(maximumBytes)} byte limit`,
      );
    }

    const content = Buffer.alloc(metadata.size);
    let offset = 0;
    while (offset < content.length) {
      const { bytesRead } = await file.read(content, offset, content.length - offset, offset);
      if (bytesRead === 0) {
        throw new ExperimentDataError("Experiment input changed while it was being read");
      }
      offset += bytesRead;
    }

    const trailingByte = Buffer.alloc(1);
    const { bytesRead: trailingBytesRead } = await file.read(
      trailingByte,
      0,
      trailingByte.length,
      content.length,
    );
    if (trailingBytesRead !== 0) {
      throw new ExperimentDataError("Experiment input changed while it was being read");
    }
    return content;
  } catch (error) {
    if (error instanceof ExperimentDataError) {
      throw error;
    }
    throw new ExperimentDataError("Unable to read experiment input", { cause: error });
  } finally {
    await file?.close();
  }
}

export async function readBoundedJson(path: string, maximumBytes: number): Promise<unknown> {
  if (!Number.isSafeInteger(maximumBytes) || maximumBytes < 0) {
    throw new ExperimentUsageError("maximumBytes must be a non-negative safe integer");
  }
  const content = await readStableBytes(path, maximumBytes);
  try {
    const json = new TextDecoder("utf-8", { fatal: true }).decode(content);
    return JSON.parse(json) as unknown;
  } catch (error) {
    throw new ExperimentDataError("Experiment input is not valid JSON", { cause: error });
  }
}

export function assertDistinctOutputPath(
  outputPath: string,
  inputPaths: readonly string[],
  workingDirectory: string,
): string {
  if (outputPath === "-") {
    return outputPath;
  }

  const resolvedOutput = resolve(workingDirectory, outputPath);
  const temporaryOutput = `${resolvedOutput}.tmp`;
  const resolvedInputs = new Set(inputPaths.map((path) => resolve(workingDirectory, path)));
  if (resolvedInputs.has(resolvedOutput)) {
    throw new ExperimentDataError("The output path must differ from every input path");
  }
  if (resolvedInputs.has(temporaryOutput)) {
    throw new ExperimentDataError("The fixed output temp path must differ from every input path");
  }
  return resolvedOutput;
}

export async function assertDistinctOutputTarget(
  outputPath: string,
  inputPaths: readonly string[],
  workingDirectory: string,
): Promise<string> {
  const resolvedOutput = assertDistinctOutputPath(outputPath, inputPaths, workingDirectory);
  if (resolvedOutput === "-") {
    return resolvedOutput;
  }

  const inputIdentities = await Promise.all(
    inputPaths.map((path) => canonicalPathIdentity(resolve(workingDirectory, path))),
  );
  const inputCanonicalPaths = new Set(inputIdentities.map((identity) => identity.path));
  const inputInodeKeys = new Set(
    inputIdentities.flatMap((identity) =>
      identity.inodeKey === undefined ? [] : [identity.inodeKey],
    ),
  );
  for (const candidatePath of [resolvedOutput, `${resolvedOutput}.tmp`]) {
    const candidate = await canonicalPathIdentity(candidatePath);
    if (
      inputCanonicalPaths.has(candidate.path) ||
      (candidate.inodeKey !== undefined && inputInodeKeys.has(candidate.inodeKey))
    ) {
      throw new ExperimentDataError(
        "The output and fixed temp targets must differ from every input target",
      );
    }
  }
  return resolvedOutput;
}

export type AtomicOutputOptions = {
  inputPaths?: readonly string[];
  workingDirectory?: string;
};

export async function writeAtomicOutput(
  outputPath: string,
  content: string,
  options: AtomicOutputOptions = {},
): Promise<void> {
  const workingDirectory = options.workingDirectory ?? process.cwd();
  const resolvedOutput = await assertDistinctOutputTarget(
    outputPath,
    options.inputPaths ?? [],
    workingDirectory,
  );
  if (resolvedOutput === "-") {
    throw new ExperimentUsageError("Atomic file output cannot target stdout");
  }

  const temporaryOutput = `${resolvedOutput}.tmp`;
  let temporaryFile: FileHandle | undefined;
  let temporaryCreated = false;
  try {
    await mkdir(dirname(resolvedOutput), { recursive: true });
    temporaryFile = await open(temporaryOutput, "wx", 0o600);
    temporaryCreated = true;
    await temporaryFile.writeFile(content, "utf8");
    await temporaryFile.close();
    temporaryFile = undefined;
    await assertDistinctOutputTarget(resolvedOutput, options.inputPaths ?? [], workingDirectory);
    await rename(temporaryOutput, resolvedOutput);
  } catch (error) {
    try {
      await temporaryFile?.close();
    } catch {
      // Cleanup below still attempts to remove the private sibling temp.
    }
    if (temporaryCreated) {
      try {
        await unlink(temporaryOutput);
      } catch {
        // A failed rename may already have moved or removed the temp file.
      }
    }
    throw new ExperimentDataError("Unable to write experiment output atomically", { cause: error });
  }
}
