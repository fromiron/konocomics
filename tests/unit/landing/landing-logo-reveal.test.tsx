// @vitest-environment jsdom

import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LandingLogoReveal } from "@/features/landing/landing-logo-reveal";
import { coreStrings, landingStrings } from "@/lib/strings";

type MotionPreferenceListener = (event: { matches: boolean }) => void;

const originalFontsDescriptor = Object.getOwnPropertyDescriptor(document, "fonts");
let motionPreferenceListener: MotionPreferenceListener | null = null;
let removeMotionPreferenceListener = vi.fn();

function setFontsReady(ready: Promise<unknown>) {
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: { ready },
  });
}

function setFontApiUnavailable() {
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: undefined,
  });
}

function stubMotionPreference(matches: boolean | undefined) {
  motionPreferenceListener = null;
  removeMotionPreferenceListener = vi.fn();
  vi.stubGlobal("matchMedia", () => ({
    matches,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addEventListener: (_type: string, listener: MotionPreferenceListener) => {
      motionPreferenceListener = listener;
    },
    removeEventListener: removeMotionPreferenceListener,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
  }));
}

function createDeferred() {
  let resolve: (value: unknown) => void = () => undefined;
  let reject: (reason: unknown) => void = () => undefined;
  const promise = new Promise<unknown>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, reject, resolve };
}

function revealRoot() {
  const root = document.querySelector(".landing-logo-reveal");
  if (!(root instanceof HTMLElement)) throw new Error("Landing logo reveal root was not rendered");
  return root;
}

async function settleMotionRenderer() {
  await act(async () => {
    await import("@/features/landing/landing-logo-reveal-motion");
    await vi.dynamicImportSettled();
  });
}

beforeEach(() => {
  window.sessionStorage.clear();
  setFontsReady(Promise.resolve({}));
  stubMotionPreference(false);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
  motionPreferenceListener = null;
  if (originalFontsDescriptor === undefined) {
    Reflect.deleteProperty(document, "fonts");
  } else {
    Object.defineProperty(document, "fonts", originalFontsDescriptor);
  }
});

describe("LandingLogoReveal", () => {
  it("encodes the font budget, exact signature timing, and hidden font-wait overlay", () => {
    const rootSource = readFileSync(resolve(process.cwd(), "src/routes/__root.tsx"), "utf8");
    const componentSource = readFileSync(
      resolve(process.cwd(), "src/features/landing/landing-logo-reveal.tsx"),
      "utf8",
    );
    const motionSource = readFileSync(
      resolve(process.cwd(), "src/features/landing/landing-logo-reveal-motion.tsx"),
      "utf8",
    );
    expect(rootSource).toContain('links: [{ rel: "stylesheet", href: globalStyles }]');
    expect(rootSource).not.toContain("fonts.googleapis.com");
    expect(rootSource).not.toContain('rel: "preload"');
    expect(componentSource).not.toContain('from "motion/react"');
    expect(componentSource).toContain('import("./landing-logo-reveal-motion")');
    expect(motionSource).toContain("animate={{ opacity: [0, 1, 0] }}");
    expect(motionSource).toContain("initial={{ opacity: 0 }}");
    expect(motionSource).toContain("duration: 0.9");
    expect(motionSource).toContain("times: [0, 4 / 9, 1]");
    expect(componentSource).toContain("group-data-[phase=waiting-fonts]/logo:opacity-0");
    expect(componentSource).toContain("landing-logo-reveal__monochrome");
    expect(componentSource).toContain("opacity-0");
  });

  it("keeps the final accessible wordmark and meaning caption present in every phase", () => {
    setFontsReady(new Promise(() => undefined));

    render(<LandingLogoReveal />);

    expect(screen.getByLabelText(coreStrings.appName)).toBeTruthy();
    expect(screen.getByText(landingStrings.logoCaption.japanese)).toBeTruthy();
    expect(screen.getByText("kono + mi = このみ")).toBeTruthy();
    expect(document.querySelectorAll(".landing-logo-reveal__base")).toHaveLength(1);
    expect(document.querySelectorAll(".landing-logo-reveal__monochrome")).toHaveLength(1);
    expect(revealRoot().dataset.motion).toBe("signature-a");
    expect(revealRoot().dataset.phase).toBe("waiting-fonts");
  });

  it("claims once before font access, then plays and settles on the exact marker", async () => {
    vi.useFakeTimers();
    const fonts = createDeferred();
    const events: string[] = [];
    const originalGetItem = Storage.prototype.getItem;
    const originalSetItem = Storage.prototype.setItem;

    vi.spyOn(Storage.prototype, "getItem").mockImplementation(function (this: Storage, key) {
      events.push(`get:${key}`);
      return originalGetItem.call(this, key);
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (this: Storage, key, value) {
      events.push(`set:${key}:${value}`);
      originalSetItem.call(this, key, value);
    });
    Object.defineProperty(document, "fonts", {
      configurable: true,
      get: () => {
        events.push("fonts");
        return { ready: fonts.promise };
      },
    });

    render(
      <StrictMode>
        <LandingLogoReveal />
      </StrictMode>,
    );

    expect(events.slice(0, 4)).toEqual([
      "get:logoRevealed",
      "set:logoRevealed:1",
      "get:logoRevealed",
      "fonts",
    ]);
    expect(events.filter((event) => event === "set:logoRevealed:1")).toHaveLength(1);
    expect(window.sessionStorage.getItem("logoRevealed")).toBe("1");
    expect(revealRoot().dataset.phase).toBe("waiting-fonts");

    await act(async () => {
      fonts.resolve({});
    });
    await settleMotionRenderer();
    expect(revealRoot().dataset.motion).toBe("signature-a");
    expect(revealRoot().dataset.phase).toBe("playing");

    act(() => vi.advanceTimersByTime(1_400));
    expect(revealRoot().dataset.motion).toBe("static");
    expect(revealRoot().dataset.phase).toBe("complete");
  });

  it("does not replay an already consumed or malformed marker", () => {
    const fontGetter = vi.fn(() => ({ ready: Promise.resolve({}) }));
    Object.defineProperty(document, "fonts", { configurable: true, get: fontGetter });

    for (const marker of ["1", "unexpected"]) {
      cleanup();
      window.sessionStorage.setItem("logoRevealed", marker);
      render(<LandingLogoReveal />);
      expect(revealRoot().dataset.motion).toBe("static");
      expect(revealRoot().dataset.phase).toBe("complete");
    }

    expect(fontGetter).not.toHaveBeenCalled();
  });

  it.each(["get", "set", "readback"] as const)(
    "fails closed when sessionStorage %s cannot verify the claim",
    (failure) => {
      const originalGetItem = Storage.prototype.getItem;
      if (failure === "get") {
        vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
          throw new Error("get failed");
        });
      } else if (failure === "set") {
        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
          throw new Error("set failed");
        });
      } else {
        vi.spyOn(Storage.prototype, "getItem")
          .mockImplementationOnce(function (this: Storage, key) {
            return originalGetItem.call(this, key);
          })
          .mockReturnValue(null);
      }

      render(<LandingLogoReveal />);

      expect(revealRoot().dataset.motion).toBe("static");
      expect(revealRoot().dataset.phase).toBe("complete");
    },
  );

  it.each([
    ["reduced", true],
    ["unresolved", undefined],
  ] as const)("consumes the marker but stays static for a %s preference", (_label, matches) => {
    const fontGetter = vi.fn(() => ({ ready: Promise.resolve({}) }));
    Object.defineProperty(document, "fonts", { configurable: true, get: fontGetter });
    stubMotionPreference(matches);

    render(<LandingLogoReveal />);

    expect(window.sessionStorage.getItem("logoRevealed")).toBe("1");
    expect(revealRoot().dataset.motion).toBe("static");
    expect(fontGetter).not.toHaveBeenCalled();
  });

  it("fails closed when the font API is missing or rejects", async () => {
    setFontApiUnavailable();
    const missingView = render(<LandingLogoReveal />);
    expect(revealRoot().dataset.motion).toBe("static");

    missingView.unmount();
    window.sessionStorage.clear();
    setFontsReady(Promise.reject(new Error("fonts failed")));
    render(<LandingLogoReveal />);

    await waitFor(() => expect(revealRoot().dataset.phase).toBe("complete"));
    expect(revealRoot().dataset.motion).toBe("static");
  });

  it("finishes permanently when reduced motion becomes requested", async () => {
    vi.useFakeTimers();
    render(<LandingLogoReveal />);
    await settleMotionRenderer();
    expect(revealRoot().dataset.phase).toBe("playing");

    act(() => motionPreferenceListener?.({ matches: true }));
    expect(revealRoot().dataset.phase).toBe("complete");

    act(() => motionPreferenceListener?.({ matches: false }));
    act(() => vi.advanceTimersByTime(2_000));
    expect(revealRoot().dataset.phase).toBe("complete");
  });

  it("finishes a same-mount signature when presentation switches to static", async () => {
    vi.useFakeTimers();
    const view = render(<LandingLogoReveal />);
    await settleMotionRenderer();
    expect(revealRoot().dataset.phase).toBe("playing");

    view.rerender(<LandingLogoReveal staticPresentation />);
    expect(revealRoot().dataset.motion).toBe("static");
    expect(revealRoot().dataset.phase).toBe("complete");

    act(() => vi.advanceTimersByTime(2_000));
    expect(revealRoot().dataset.phase).toBe("complete");
  });

  it.each(["pointerdown", "click", "keydown", "wheel", "scroll"])(
    "lets %s continue while it skips the active signature",
    async (eventType) => {
      vi.useFakeTimers();
      render(<LandingLogoReveal />);
      await settleMotionRenderer();
      expect(revealRoot().dataset.phase).toBe("playing");

      const event = new Event(eventType, { bubbles: true, cancelable: true });
      act(() => window.dispatchEvent(event));

      expect(event.defaultPrevented).toBe(false);
      expect(revealRoot().dataset.phase).toBe("complete");
    },
  );

  it("lets an input during the font wait skip the signature before it can start", async () => {
    vi.useFakeTimers();
    const fonts = createDeferred();
    setFontsReady(fonts.promise);
    render(<LandingLogoReveal />);

    act(() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" })));
    await act(async () => {
      fonts.resolve({});
      await Promise.resolve();
    });

    expect(revealRoot().dataset.phase).toBe("complete");
    act(() => vi.advanceTimersByTime(2_000));
    expect(revealRoot().dataset.phase).toBe("complete");
  });

  it("cleans window, media, timer, and pagehide work on completion and unmount", async () => {
    vi.useFakeTimers();
    const removeWindowListener = vi.spyOn(window, "removeEventListener");
    const view = render(<LandingLogoReveal />);
    await settleMotionRenderer();
    expect(revealRoot().dataset.phase).toBe("playing");

    act(() => window.dispatchEvent(new PageTransitionEvent("pagehide")));
    expect(revealRoot().dataset.phase).toBe("complete");
    expect(removeMotionPreferenceListener).toHaveBeenCalledWith("change", expect.any(Function));
    for (const eventType of ["pointerdown", "click", "keydown", "wheel", "scroll", "pagehide"]) {
      expect(removeWindowListener).toHaveBeenCalledWith(eventType, expect.any(Function), true);
    }

    view.unmount();
    act(() => vi.advanceTimersByTime(2_000));
  });

  it("removes active listeners when unmounted during the font wait", async () => {
    const fonts = createDeferred();
    setFontsReady(fonts.promise);
    const removeWindowListener = vi.spyOn(window, "removeEventListener");
    const view = render(<LandingLogoReveal />);

    view.unmount();
    expect(removeMotionPreferenceListener).toHaveBeenCalledWith("change", expect.any(Function));
    for (const eventType of ["pointerdown", "click", "keydown", "wheel", "scroll", "pagehide"]) {
      expect(removeWindowListener).toHaveBeenCalledWith(eventType, expect.any(Function), true);
    }

    await act(async () => {
      fonts.resolve({});
      await Promise.resolve();
    });
  });
});
