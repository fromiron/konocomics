// @vitest-environment jsdom

import { act, cleanup, render, screen } from "@testing-library/react";
import type { HTMLAttributes, ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

const motionState = vi.hoisted(() => ({ calls: [] as Record<string, unknown>[], inView: false }));

vi.mock("motion/react", async () => {
  const React = await import("react");
  return {
    useInView: () => motionState.inView,
    m: {
      span: (props: Record<string, unknown>) => {
        const {
          animate,
          children,
          initial,
          onAnimationComplete,
          transition,
          viewport,
          whileInView,
          ...domProps
        } = props;
        motionState.calls.push({
          animate,
          initial,
          onAnimationComplete,
          transition,
          viewport,
          whileInView,
        });
        return React.createElement(
          "span",
          domProps as HTMLAttributes<HTMLSpanElement>,
          children as ReactNode,
        );
      },
    },
  };
});

import { FactorBar } from "@/features/taste/factor-bar";

afterEach(() => {
  cleanup();
  motionState.calls = [];
  motionState.inView = false;
});

describe("FactorBar", () => {
  it("exposes the exact engine value with a qualitative label and keeps zero distinct from unknown", () => {
    const { container } = render(
      <>
        <FactorBar
          animateReveal={false}
          label="戦略的な展開"
          revealReady={false}
          state="known"
          value={0}
        />
        <FactorBar
          animateReveal={false}
          label="迫力・スピード感"
          revealReady={false}
          state="unknown"
          value={null}
        />
      </>,
    );

    const known = screen.getByRole("meter", { name: "戦略的な展開" });
    const unknown = screen.getByRole("group", { name: "迫力・スピード感: まだ分析中" });
    expect(known?.getAttribute("aria-valuenow")).toBe("0");
    expect(known?.getAttribute("aria-valuetext")).toBe("ごく控えめ");
    expect(known.textContent).toContain("ごく控えめ");
    expect(screen.getAllByRole("meter")).toHaveLength(1);
    expect(unknown?.hasAttribute("aria-valuenow")).toBe(false);
    expect(unknown?.hasAttribute("aria-valuetext")).toBe(false);
    expect(container.querySelectorAll(".taste-factor-bar__fill")).toHaveLength(1);
    expect(container.querySelectorAll(".taste-factor-bar__track--unknown")).toHaveLength(1);
  });

  it.each([
    [0.49, "ごく控えめ"],
    [0.5, "控えめ"],
    [1.49, "控えめ"],
    [1.5, "ほどほど"],
    [2.49, "ほどほど"],
    [2.5, "強め"],
    [3.49, "強め"],
    [3.5, "とても強め"],
  ])("maps %s to the agreed qualitative band %s", (value, expectedLabel) => {
    render(
      <FactorBar
        animateReveal={false}
        label="戦略的な展開"
        revealReady={false}
        state="known"
        value={value}
      />,
    );

    const meter = screen.getByRole("meter", { name: "戦略的な展開" });
    expect(meter.getAttribute("aria-valuetext")).toBe(expectedLabel);
    expect(meter.textContent).toContain(expectedLabel);
  });

  it("waits for the page gate, uses only section-local stagger, then hands updates to CSS", () => {
    const view = render(
      <FactorBar
        animateReveal
        label="戦略的な展開"
        revealDelay={0.12}
        revealReady={false}
        state="known"
        value={1}
      />,
    );

    expect(motionState.calls).toHaveLength(0);
    expect(view.container.querySelector("[data-reveal-ready='false']")).toBeTruthy();

    motionState.inView = true;
    view.rerender(
      <FactorBar
        animateReveal
        label="戦略的な展開"
        revealDelay={0.12}
        revealReady
        state="known"
        value={1}
      />,
    );
    expect(motionState.calls.at(-1)?.transition).toEqual({
      delay: 0.12,
      duration: 0.4,
      ease: "easeOut",
    });
    expect(motionState.calls.at(-1)?.initial).toEqual({ scaleX: 0 });
    expect(motionState.calls.at(-1)?.animate).toEqual({ scaleX: 0.25 });

    const complete = motionState.calls.at(-1)?.onAnimationComplete;
    expect(complete).toBeTypeOf("function");
    if (typeof complete !== "function") throw new Error("missing completion callback");
    act(() => complete());

    view.rerender(
      <FactorBar
        animateReveal
        label="戦略的な展開"
        revealDelay={0.12}
        revealReady
        state="known"
        value={3}
      />,
    );
    const fill = view.container.querySelector<HTMLElement>(".taste-factor-bar__fill");
    expect(fill?.classList.contains("taste-factor-bar__fill--reveal")).toBe(false);
    expect(fill?.style.transform).toBe("scaleX(0.75)");
  });
});
