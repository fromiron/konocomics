// @vitest-environment jsdom

import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LandingLogoReveal } from "@/features/landing/landing-logo-reveal";
import { coreStrings } from "@/lib/strings";

const motionModuleState = vi.hoisted(() => ({ loadCount: 0 }));

vi.mock("@/features/landing/landing-logo-reveal-motion", () => {
  motionModuleState.loadCount += 1;
  throw new Error("motion chunk failed");
});

const originalFontsDescriptor = Object.getOwnPropertyDescriptor(document, "fonts");

function createDeferred() {
  let resolve: (value: unknown) => void = () => undefined;
  const promise = new Promise<unknown>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

function revealRoot() {
  const root = document.querySelector(".landing-logo-reveal");
  if (!(root instanceof HTMLElement)) throw new Error("Landing logo reveal root was not rendered");
  return root;
}

beforeEach(() => {
  motionModuleState.loadCount = 0;
  window.sessionStorage.clear();
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
  }));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  if (originalFontsDescriptor === undefined) {
    Reflect.deleteProperty(document, "fonts");
  } else {
    Object.defineProperty(document, "fonts", originalFontsDescriptor);
  }
});

describe("LandingLogoReveal motion chunk failure", () => {
  it("does not request Motion before fonts settle and fails closed to the static equivalent", async () => {
    const fonts = createDeferred();
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: { ready: fonts.promise },
    });

    render(<LandingLogoReveal />);

    expect(window.sessionStorage.getItem("logoRevealed")).toBe("1");
    expect(revealRoot().dataset.phase).toBe("waiting-fonts");
    expect(motionModuleState.loadCount).toBe(0);

    await act(async () => {
      fonts.resolve({});
      await vi.dynamicImportSettled();
    });

    await waitFor(() => expect(revealRoot().dataset.phase).toBe("complete"));
    expect(revealRoot().dataset.motion).toBe("static");
    expect(screen.getByLabelText(coreStrings.appName)).toBeTruthy();
    expect(motionModuleState.loadCount).toBe(1);
  });
});
