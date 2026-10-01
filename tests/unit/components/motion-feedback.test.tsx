// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const sparkState = vi.hoisted(() => ({ bursts: [] as unknown[] }));

vi.mock("@/components/motion/confirm-spark", () => ({
  burstConfirmSparks: (origin: unknown) => sparkState.bursts.push(origin),
}));

import { CoverSaveToggle } from "@/components/media/state-action-row";
import { useCountUp } from "@/components/motion/use-count-up";
import { usePointerEffect } from "@/components/motion/use-pointer-effects";

function stubMedia(matches: Readonly<Record<string, boolean>>) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: matches[query] ?? false,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
}

afterEach(() => {
  cleanup();
  sparkState.bursts = [];
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("save confirmation", () => {
  it("stamps and sparks only after the pressed save is confirmed, never on mount", () => {
    vi.useFakeTimers();
    const onPlanned = vi.fn();
    const view = render(<CoverSaveToggle busy={false} onPlanned={onPlanned} planned={false} />);
    const button = screen.getByRole("button");

    fireEvent.click(button);
    expect(onPlanned).toHaveBeenCalledTimes(1);
    expect(button.classList.contains("confirm-stamp")).toBe(false);
    expect(sparkState.bursts).toHaveLength(0);

    view.rerender(<CoverSaveToggle busy={false} onPlanned={onPlanned} planned />);
    expect(button.classList.contains("confirm-stamp")).toBe(true);
    expect(sparkState.bursts).toEqual([button]);

    act(() => vi.advanceTimersByTime(300));
    expect(button.classList.contains("confirm-stamp")).toBe(false);
  });

  it("stamps a copy that was not pressed without sparking, and ignores already saved works", () => {
    const view = render(<CoverSaveToggle busy={false} onPlanned={vi.fn()} planned={false} />);
    view.rerender(<CoverSaveToggle busy={false} onPlanned={vi.fn()} planned />);
    expect(sparkState.bursts).toHaveLength(0);

    cleanup();
    render(<CoverSaveToggle busy={false} onPlanned={vi.fn()} planned />);
    expect(screen.getByRole("button").classList.contains("confirm-stamp")).toBe(false);
  });
});

describe("pointer effects", () => {
  function Harness({ effect }: Readonly<{ effect: "light" | "magnet" }>) {
    const attach = usePointerEffect<HTMLDivElement>(effect);
    return <div data-testid="surface" ref={attach} />;
  }

  function move(element: HTMLElement) {
    const event = new Event("pointermove", { bubbles: true });
    Object.assign(event, { pointerType: "mouse", clientX: 10, clientY: 10 });
    fireEvent(element, event);
  }

  it("reacts to a fine hovering mouse and never writes an angle", () => {
    stubMedia({ "(hover: hover) and (pointer: fine)": true });
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    render(<Harness effect="light" />);
    const surface = screen.getByTestId("surface");
    surface.getBoundingClientRect = () => new DOMRect(0, 0, 100, 100);

    move(surface);

    expect(surface.dataset.pointerActive).toBe("");
    expect(surface.style.getPropertyValue("--light-x")).not.toBe("");
    expect(surface.getAttribute("style")).not.toMatch(/tilt|rotate/u);
  });

  it("stays still under reduced motion or a coarse pointer", () => {
    stubMedia({
      "(hover: hover) and (pointer: fine)": true,
      "(prefers-reduced-motion: reduce)": true,
    });
    render(<Harness effect="magnet" />);
    const surface = screen.getByTestId("surface");

    move(surface);

    expect(surface.dataset.pointerActive).toBeUndefined();
    expect(surface.style.getPropertyValue("--magnet-x")).toBe("");
  });
});

describe("count-up", () => {
  it("returns the final count at once when disabled", () => {
    const { result } = renderHook(() => useCountUp(7, false));
    expect(result.current).toBe(7);
  });
});
