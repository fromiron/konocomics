// @vitest-environment jsdom

import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useEntryOnce } from "@/components/motion/use-entry-once";

type Callback = (entries: { isIntersecting: boolean }[]) => void;

let observers: { callback: Callback; disconnect: ReturnType<typeof vi.fn> }[] = [];
let reducedMotion = false;

function Probe({ top }: Readonly<{ top: number }>) {
  const ref = useEntryOnce<HTMLDivElement>();
  return (
    <div
      data-testid="probe"
      ref={(element) => {
        if (element !== null) {
          element.getBoundingClientRect = () =>
            ({ top, bottom: top + 100, left: 0, right: 100, width: 100, height: 100 }) as DOMRect;
        }
        ref(element);
      }}
    />
  );
}

beforeEach(() => {
  observers = [];
  reducedMotion = false;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      disconnect = vi.fn();
      constructor(callback: Callback) {
        observers.push({ callback, disconnect: this.disconnect });
      }
      observe() {}
    },
  );
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query.includes("reduce") && reducedMotion,
  }));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("useEntryOnce", () => {
  it("arms an element below the fold and plays it once when it comes into view", () => {
    const { getByTestId } = render(<Probe top={2000} />);
    const probe = getByTestId("probe");
    expect(probe.getAttribute("data-entry")).toBe("armed");

    act(() => observers[0]!.callback([{ isIntersecting: false }]));
    expect(probe.getAttribute("data-entry")).toBe("armed");
    act(() => observers[0]!.callback([{ isIntersecting: true }]));
    expect(probe.getAttribute("data-entry")).toBe("play");
    expect(observers[0]!.disconnect).toHaveBeenCalled();
  });

  it("leaves an element already in view in its final state", () => {
    const { getByTestId } = render(<Probe top={100} />);
    expect(getByTestId("probe").hasAttribute("data-entry")).toBe(false);
    expect(observers).toHaveLength(0);
  });

  it("never arms with reduced motion", () => {
    reducedMotion = true;
    const { getByTestId } = render(<Probe top={2000} />);
    expect(getByTestId("probe").hasAttribute("data-entry")).toBe(false);
  });

  it("does not leave content hidden when unmounted before it plays", () => {
    const { getByTestId, unmount } = render(<Probe top={2000} />);
    const probe = getByTestId("probe");
    unmount();
    expect(probe.hasAttribute("data-entry")).toBe(false);
  });
});
