// @vitest-environment jsdom

import { act, cleanup, createEvent, fireEvent, render } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { usePageEntryMotion } from "@/components/motion/use-page-entry-motion";

type MotionPreferenceListener = (event: { matches: boolean }) => void;

const motionPreferenceListeners = new Set<MotionPreferenceListener>();

function stubMotionPreference(matches: boolean | undefined) {
  vi.stubGlobal("matchMedia", () => ({
    matches,
    addEventListener: (_type: string, listener: MotionPreferenceListener) => {
      motionPreferenceListeners.add(listener);
    },
    removeEventListener: (_type: string, listener: MotionPreferenceListener) => {
      motionPreferenceListeners.delete(listener);
    },
  }));
}

function emitMotionPreference(matches: boolean) {
  act(() => {
    for (const listener of motionPreferenceListeners) listener({ matches });
  });
}

function firePageEntryAnimationEnd(element: Element, animationName: string) {
  const standardEvent = createEvent.animationEnd(element);
  Object.defineProperty(standardEvent, "animationName", { value: animationName });
  fireEvent(element, standardEvent);
  const prefixedEvent = new window.Event("webkitAnimationEnd", { bubbles: true });
  Object.defineProperty(prefixedEvent, "animationName", { value: animationName });
  fireEvent(element, prefixedEvent);
}

function PageEntryHarness({
  enabled = true,
  identity = "page-a",
}: Readonly<{ enabled?: boolean; identity?: string }>) {
  const motion = usePageEntryMotion({ enabled, identity });
  return (
    <main
      className={motion.active ? "page-entry-b" : undefined}
      data-motion-active={motion.active ? "true" : "false"}
      onAnimationEnd={motion.onAnimationEnd}
    />
  );
}

beforeEach(() => {
  motionPreferenceListeners.clear();
  stubMotionPreference(false);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  motionPreferenceListeners.clear();
});

describe("usePageEntryMotion", () => {
  it.each(["reduced", "unresolved", "missing"] as const)(
    "fails closed before paint when motion preference is %s",
    (environment) => {
      if (environment === "missing") vi.stubGlobal("matchMedia", undefined);
      else stubMotionPreference(environment === "reduced" ? true : undefined);

      const { container } = render(<PageEntryHarness />);

      expect(container.querySelector("main")?.getAttribute("data-motion-active")).toBe("false");
      expect(motionPreferenceListeners.size).toBe(0);
    },
  );

  it("consumes only the exact B animation and never revives the same identity", () => {
    const view = render(
      <StrictMode>
        <PageEntryHarness />
      </StrictMode>,
    );
    const main = view.container.querySelector("main")!;
    expect(main.getAttribute("data-motion-active")).toBe("true");
    expect(motionPreferenceListeners.size).toBe(1);

    firePageEntryAnimationEnd(main, "some-other-animation");
    expect(main.getAttribute("data-motion-active")).toBe("true");
    firePageEntryAnimationEnd(main, "page-entry-b-enter");
    expect(main.getAttribute("data-motion-active")).toBe("false");

    view.rerender(<PageEntryHarness enabled={false} />);
    view.rerender(<PageEntryHarness />);
    emitMotionPreference(true);
    emitMotionPreference(false);
    expect(main.getAttribute("data-motion-active")).toBe("false");
  });

  it("consumes an active owner on runtime reduce and grants a fresh identity once", () => {
    const view = render(<PageEntryHarness />);
    expect(view.container.querySelector("main")?.getAttribute("data-motion-active")).toBe("true");

    emitMotionPreference(true);
    expect(view.container.querySelector("main")?.getAttribute("data-motion-active")).toBe("false");
    emitMotionPreference(false);
    expect(view.container.querySelector("main")?.getAttribute("data-motion-active")).toBe("false");

    stubMotionPreference(false);
    view.rerender(<PageEntryHarness identity="page-b" />);
    expect(view.container.querySelector("main")?.getAttribute("data-motion-active")).toBe("true");
  });

  it("does not grant delayed ownership when a disabled mount later becomes enabled", () => {
    const view = render(<PageEntryHarness enabled={false} />);
    expect(view.container.querySelector("main")?.getAttribute("data-motion-active")).toBe("false");

    view.rerender(<PageEntryHarness />);
    expect(view.container.querySelector("main")?.getAttribute("data-motion-active")).toBe("false");
  });
});
