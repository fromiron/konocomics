// @vitest-environment jsdom

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  accentBootScript,
  accentStorageKey,
  clearAccentPreference,
  parseStoredAccent,
  readAccentPreference,
  setAccentPreference,
} from "@/infrastructure/display-preferences";
import { accentThemeIds, defaultAccentThemeId } from "@/lib/accent-theme";

const root = () => document.documentElement;

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  root().removeAttribute("data-accent");
});

describe("stored accent parsing", () => {
  it("accepts exactly the six accent ids", () => {
    expect(accentThemeIds).toEqual(["butter", "kinaka", "lime", "ice", "paper", "amber"]);
    for (const id of accentThemeIds) expect(parseStoredAccent(id)).toBe(id);
  });

  it("falls back to butter for anything missing or unknown", () => {
    expect(defaultAccentThemeId).toBe("butter");
    for (const value of [null, undefined, "", "Butter", "red", " lime", 1, {}, ["ice"]]) {
      expect(parseStoredAccent(value)).toBe("butter");
    }
  });

  it("reads the stored choice, and the default when storage holds nothing valid", () => {
    expect(readAccentPreference()).toBe("butter");
    localStorage.setItem(accentStorageKey, "ice");
    expect(readAccentPreference()).toBe("ice");
    localStorage.setItem(accentStorageKey, "neon");
    expect(readAccentPreference()).toBe("butter");
  });

  it("reads the default when storage is unavailable", () => {
    localStorage.setItem(accentStorageKey, "lime");
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });
    expect(readAccentPreference()).toBe("butter");
  });
});

describe("applying and storing a choice", () => {
  it("applies a choice at once and stores it under one key", () => {
    setAccentPreference("kinaka");
    expect(root().getAttribute("data-accent")).toBe("kinaka");
    expect(localStorage.getItem(accentStorageKey)).toBe("kinaka");
    expect(localStorage.length).toBe(1);

    // The default needs no attribute, like the prerendered document.
    setAccentPreference("butter");
    expect(root().hasAttribute("data-accent")).toBe(false);
    expect(localStorage.getItem(accentStorageKey)).toBe("butter");
  });

  it("keeps the choice applied when storage refuses the write", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("full", "QuotaExceededError");
    });
    expect(() => setAccentPreference("paper")).not.toThrow();
    expect(root().getAttribute("data-accent")).toBe("paper");
  });

  it("clears the stored choice and returns the document to the default", () => {
    setAccentPreference("amber");
    clearAccentPreference();
    expect(localStorage.getItem(accentStorageKey)).toBeNull();
    expect(root().hasAttribute("data-accent")).toBe(false);
  });
});

describe("pre-paint script", () => {
  const run = () => new Function(accentBootScript)();
  const parsing = () => vi.spyOn(document, "readyState", "get").mockReturnValue("loading");

  it("applies a stored accent other than the default", () => {
    parsing();
    localStorage.setItem(accentStorageKey, "lime");
    run();
    expect(root().getAttribute("data-accent")).toBe("lime");
  });

  it("does nothing once the document has been parsed, as on a client navigation", () => {
    localStorage.setItem(accentStorageKey, "lime");
    run();
    expect(root().hasAttribute("data-accent")).toBe(false);
  });

  it("leaves the default, unknown values and unavailable storage without an attribute", () => {
    parsing();
    for (const value of ["butter", "neon", "<img>"]) {
      localStorage.setItem(accentStorageKey, value);
      run();
      expect(root().hasAttribute("data-accent")).toBe(false);
    }
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });
    expect(run).not.toThrow();
    expect(root().hasAttribute("data-accent")).toBe(false);
  });
});

describe("theme blocks in globals.css", () => {
  const css = readFileSync(resolve(process.cwd(), "src/styles/globals.css"), "utf8");
  const block = (selector: string) => {
    const start = css.indexOf(`${selector} {`);
    return start < 0 ? null : css.slice(start, css.indexOf("}", start));
  };

  it("defines --accent and --on-accent for every id, butter on the root", () => {
    expect(block(':root,\n[data-accent="butter"]')).toContain("--accent: oklch(0.91 0.12 98)");
    for (const id of accentThemeIds) {
      const declarations = block(`[data-accent="${id}"]`);
      expect(declarations, id).not.toBeNull();
      expect(declarations).toMatch(/--accent: oklch\(/);
      expect(declarations).toMatch(/--on-accent: oklch\(/);
    }
  });

  it("sets the accent only inside the theme blocks", () => {
    const accentDeclarations = css.match(/--accent:\s/g) ?? [];
    expect(accentDeclarations).toHaveLength(accentThemeIds.length);
  });
});
