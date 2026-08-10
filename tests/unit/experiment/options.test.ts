import { describe, expect, it } from "vitest";

import {
  DEFAULT_EXPERIMENT_PATHS,
  parseExperimentCliOptions,
} from "../../../scripts/experiment/options";
import {
  ExperimentDataError,
  ExperimentUsageError,
  experimentExitCode,
} from "../../../scripts/experiment/errors";

describe("experiment CLI options", () => {
  it("uses the documented defaults", () => {
    expect(parseExperimentCliOptions([])).toEqual({
      profilePaths: [],
      catalogPath: DEFAULT_EXPERIMENT_PATHS.catalog,
      contextPath: DEFAULT_EXPERIMENT_PATHS.context,
      outputPath: DEFAULT_EXPERIMENT_PATHS.output,
      help: false,
    });
  });

  it("accepts repeatable profile flags, aliases, and long equals values", () => {
    expect(
      parseExperimentCliOptions([
        "-p",
        "first.json",
        "--profile=second.json",
        "--catalog",
        "catalog.json",
        "--context=context.json",
        "-o",
        "report.md",
        "-h",
      ]),
    ).toEqual({
      profilePaths: ["first.json", "second.json"],
      catalogPath: "catalog.json",
      contextPath: "context.json",
      outputPath: "report.md",
      help: true,
    });
  });

  it.each([
    [["--unknown"], "unknown flag"],
    [["positional.json"], "positional argument"],
    [["--catalog"], "missing value"],
    [["--catalog", "--context", "context.json"], "another flag instead of a value"],
    [["--profile="], "empty inline value"],
    [["-p=profile.json"], "unsupported short equals form"],
    [["--catalog", "a.json", "--catalog", "b.json"], "duplicate long scalar"],
    [["-o", "a.md", "--output", "b.md"], "duplicate aliased scalar"],
    [["-h", "--help"], "duplicate help"],
  ])("rejects %s as usage error (%s)", (arguments_) => {
    expect(() => parseExperimentCliOptions(arguments_)).toThrow(ExperimentUsageError);
  });

  it("maps usage to exit 2 and every data/runtime failure to exit 1", () => {
    expect(experimentExitCode(new ExperimentUsageError("bad options"))).toBe(2);
    expect(experimentExitCode(new ExperimentDataError("bad data"))).toBe(1);
    expect(experimentExitCode(new Error("runtime"))).toBe(1);
  });
});
