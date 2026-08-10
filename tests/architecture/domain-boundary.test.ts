import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

const eslint = new ESLint({ cwd: process.cwd() });

async function lintDomainSource(source: string) {
  const [result] = await eslint.lintText(source, {
    filePath: "src/domain/__architecture_check__.ts",
  });

  return result?.messages.map((message) => message.ruleId) ?? [];
}

describe("domain lint boundary", () => {
  it("rejects framework and upper-layer imports", async () => {
    const rules = await lintDomainSource(`
      import { useState } from "react";
      import { cn } from "@/lib/utils";
      export const value = [useState, cn];
    `);

    expect(rules).toContain("no-restricted-imports");
  });

  it("rejects relative imports that cross into an upper layer", async () => {
    const rules = await lintDomainSource(`
      import { cn } from "../lib/utils";
      export const value = cn("example");
    `);

    expect(rules).toContain("import/no-restricted-paths");
  });

  it("rejects ambient time, randomness, and I/O", async () => {
    const rules = await lintDomainSource(`
      import { readFile } from "node:fs/promises";
      export const value = [
        Date.now(),
        Math.random(),
        fetch("/api"),
        globalThis.fetch("/api"),
        process.env.SECRET,
        readFile("example"),
      ];
    `);

    expect(rules).toContain("no-restricted-globals");
    expect(rules).toContain("no-restricted-imports");
    expect(rules).toContain("no-restricted-syntax");
  });
});
