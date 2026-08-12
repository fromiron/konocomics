import { describe, expect, it } from "vitest";

import { ExperimentUsageError } from "../../../scripts/experiment/errors";
import { DEFAULT_G2_PATHS, parseG2CliOptions } from "../../../scripts/g2/options";

describe("G2 aggregate CLI options", () => {
  it("uses the documented defaults", () => {
    expect(parseG2CliOptions([])).toEqual({
      resultPaths: [],
      catalogPath: DEFAULT_G2_PATHS.catalog,
      contextPath: DEFAULT_G2_PATHS.context,
      outputPath: DEFAULT_G2_PATHS.output,
      help: false,
    });
  });

  it("accepts repeatable results and scalar aliases", () => {
    expect(
      parseG2CliOptions([
        "-r",
        "first.json",
        "--result=second.json",
        "--catalog",
        "catalog.json",
        "--context=context.json",
        "-o",
        "report.md",
      ]),
    ).toEqual({
      resultPaths: ["first.json", "second.json"],
      catalogPath: "catalog.json",
      contextPath: "context.json",
      outputPath: "report.md",
      help: false,
    });
  });

  it.each([
    ["unknown", ["--unknown"]],
    ["positional", ["result.json"]],
    ["empty", ["--result="]],
    ["short equals", ["-r=result.json"]],
    ["duplicate catalog", ["--catalog", "a.json", "--catalog", "b.json"]],
    ["duplicate output", ["-o", "a.md", "--output", "b.md"]],
    ["duplicate help", ["-h", "--help"]],
  ])("rejects %s as usage error", (_label, arguments_) => {
    expect(() => parseG2CliOptions(arguments_)).toThrow(ExperimentUsageError);
  });
});
