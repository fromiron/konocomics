import { mkdir, mkdtemp, readFile, rm, stat, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { ExperimentDataError, ExperimentUsageError } from "../../../scripts/experiment/errors";
import {
  assertDistinctOutputPath,
  assertDistinctOutputTarget,
  discoverDefaultProfilePaths,
  readBoundedJson,
  writeAtomicOutput,
} from "../../../scripts/experiment/io";

const temporaryDirectories: string[] = [];

async function temporaryDirectory() {
  const directory = await mkdtemp(join(tmpdir(), "konocomics-experiment-test-"));
  temporaryDirectories.push(directory);
  return directory;
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe("bounded experiment JSON input", () => {
  it("parses JSON at the exact byte limit", async () => {
    const directory = await temporaryDirectory();
    const path = join(directory, "input.json");
    const content = '{"ok":true}';
    await writeFile(path, content, "utf8");

    await expect(readBoundedJson(path, Buffer.byteLength(content))).resolves.toEqual({ ok: true });
  });

  it("rejects an oversized file and malformed JSON as data errors", async () => {
    const directory = await temporaryDirectory();
    const oversized = join(directory, "oversized.json");
    const malformed = join(directory, "malformed.json");
    await writeFile(oversized, "12345", "utf8");
    await writeFile(malformed, "{", "utf8");

    await expect(readBoundedJson(oversized, 4)).rejects.toBeInstanceOf(ExperimentDataError);
    await expect(readBoundedJson(malformed, 1)).rejects.toBeInstanceOf(ExperimentDataError);
  });

  it("rejects malformed UTF-8 instead of replacing invalid bytes", async () => {
    const directory = await temporaryDirectory();
    const path = join(directory, "invalid-utf8.json");
    await writeFile(
      path,
      Buffer.from([0x7b, 0x22, 0x78, 0x22, 0x3a, 0x22, 0xc3, 0x28, 0x22, 0x7d]),
    );

    await expect(readBoundedJson(path, 10)).rejects.toBeInstanceOf(ExperimentDataError);
  });

  it("rejects non-files and invalid caller limits", async () => {
    const directory = await temporaryDirectory();
    await expect(readBoundedJson(directory, 10)).rejects.toBeInstanceOf(ExperimentDataError);
    await expect(readBoundedJson("unused", -1)).rejects.toBeInstanceOf(ExperimentUsageError);
  });
});

describe("experiment profile discovery", () => {
  it("returns only default JSON files in deterministic code-unit order", async () => {
    const directory = await temporaryDirectory();
    const profileDirectory = join(directory, "data/fixtures/experiment-profiles");
    await mkdir(profileDirectory, { recursive: true });
    await writeFile(join(profileDirectory, "b.json"), "{}", "utf8");
    await writeFile(join(profileDirectory, "a.json"), "{}", "utf8");
    await writeFile(join(profileDirectory, "ignored.txt"), "{}", "utf8");
    await mkdir(join(profileDirectory, "nested.json"));

    await expect(discoverDefaultProfilePaths(directory)).resolves.toEqual([
      join(profileDirectory, "a.json"),
      join(profileDirectory, "b.json"),
    ]);
  });

  it("rejects a missing or empty default profile directory", async () => {
    const missing = await temporaryDirectory();
    await expect(discoverDefaultProfilePaths(missing)).rejects.toBeInstanceOf(ExperimentDataError);

    const empty = await temporaryDirectory();
    await mkdir(join(empty, "data/fixtures/experiment-profiles"), { recursive: true });
    await expect(discoverDefaultProfilePaths(empty)).rejects.toBeInstanceOf(ExperimentDataError);
  });
});

describe("atomic experiment output", () => {
  it("rejects resolved output and fixed-temp collisions with inputs", async () => {
    const directory = await temporaryDirectory();
    expect(() =>
      assertDistinctOutputPath("reports/result.md", ["reports/../reports/result.md"], directory),
    ).toThrow(ExperimentDataError);
    expect(() =>
      assertDistinctOutputPath("reports/result.md", ["reports/result.md.tmp"], directory),
    ).toThrow(ExperimentDataError);
    expect(assertDistinctOutputPath("-", ["-"], directory)).toBe("-");
  });

  it("writes through a fixed sibling temp and replaces the output", async () => {
    const directory = await temporaryDirectory();
    const output = join(directory, "reports/result.md");
    await writeAtomicOutput(output, "first");
    await writeAtomicOutput(output, "second");

    await expect(readFile(output, "utf8")).resolves.toBe("second");
    await expect(readFile(`${output}.tmp`, "utf8")).rejects.toBeDefined();
    expect((await stat(output)).mode & 0o777).toBe(0o600);
  });

  it("rejects a symlinked output parent that aliases an input target", async () => {
    const directory = await temporaryDirectory();
    const realDirectory = join(directory, "real");
    const aliasDirectory = join(directory, "alias");
    await mkdir(realDirectory);
    await symlink(realDirectory, aliasDirectory, "dir");
    const input = join(realDirectory, "catalog.json");
    const outputAlias = join(aliasDirectory, "catalog.json");
    await writeFile(input, "preserve input", { encoding: "utf8", mode: 0o600 });

    await expect(
      assertDistinctOutputTarget(outputAlias, [input], directory),
    ).rejects.toBeInstanceOf(ExperimentDataError);
    await expect(
      writeAtomicOutput(outputAlias, "replacement", {
        inputPaths: [input],
        workingDirectory: directory,
      }),
    ).rejects.toBeInstanceOf(ExperimentDataError);
    await expect(readFile(input, "utf8")).resolves.toBe("preserve input");
  });

  it("rejects an input symlink that aliases the output target", async () => {
    const directory = await temporaryDirectory();
    const output = join(directory, "catalog.json");
    const inputAlias = join(directory, "catalog-alias.json");
    await writeFile(output, "preserve input", { encoding: "utf8", mode: 0o600 });
    await symlink(output, inputAlias, "file");

    await expect(
      writeAtomicOutput(output, "replacement", {
        inputPaths: [inputAlias],
        workingDirectory: directory,
      }),
    ).rejects.toBeInstanceOf(ExperimentDataError);
    await expect(readFile(output, "utf8")).resolves.toBe("preserve input");
  });

  it("preserves existing output and temp files if the fixed temp is already occupied", async () => {
    const directory = await temporaryDirectory();
    const output = join(directory, "report.md");
    await writeFile(output, "preserve me", "utf8");
    await writeFile(`${output}.tmp`, "another writer", "utf8");

    await expect(writeAtomicOutput(output, "replacement")).rejects.toBeInstanceOf(
      ExperimentDataError,
    );
    await expect(readFile(output, "utf8")).resolves.toBe("preserve me");
    await expect(readFile(`${output}.tmp`, "utf8")).resolves.toBe("another writer");
  });

  it("resolves relative output paths against the injected working directory", async () => {
    const directory = await temporaryDirectory();
    await writeAtomicOutput("reports/result.md", "content", { workingDirectory: directory });
    await expect(readFile(resolve(directory, "reports/result.md"), "utf8")).resolves.toBe(
      "content",
    );
  });
});
