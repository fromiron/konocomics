import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";

import { describe, expect, it } from "vitest";

import { runBaselineExperiment } from "../../../scripts/run-baseline-experiment";

const goldenPath = resolve("tests/fixtures/experiment/report-golden.md");
const execFileAsync = promisify(execFile);

async function run(arguments_: readonly string[]) {
  let stdout = "";
  let stderr = "";
  const exitCode = await runBaselineExperiment(arguments_, {
    workingDirectory: process.cwd(),
    writeStdout: (value) => {
      stdout += value;
    },
    writeStderr: (value) => {
      stderr += value;
    },
  });
  return { exitCode, stdout, stderr };
}

describe("baseline experiment runner", () => {
  it("writes only the deterministic Markdown report to stdout", async () => {
    const result = await run([]);
    expect(result).toEqual({
      exitCode: 0,
      stdout: await readFile(goldenPath, "utf8"),
      stderr: "",
    });
  });

  it("keeps the documented silent package-manager stdout byte-identical", async () => {
    const golden = await readFile(goldenPath, "utf8");
    const result = await execFileAsync("npm", ["run", "--silent", "experiment:baseline"], {
      cwd: process.cwd(),
      maxBuffer: 1024 * 1024,
    });

    expect(result.stdout).toBe(golden);
    expect(result.stderr).toBe("");
  });

  it("returns usage exit 2 for unknown flags", async () => {
    const result = await run(["--unknown"]);
    expect(result.exitCode).toBe(2);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Unknown option");
  });

  it("returns data exit 1 without partial stdout for missing input", async () => {
    const result = await run(["--profile", "missing-profile.json"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Unable to read experiment input");
  });

  it("prints help with success without reading data", async () => {
    const result = await run(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Usage: pnpm --silent experiment:baseline");
    expect(result.stderr).toBe("");
  });
});
