// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Snackbar, type SnackbarNotice } from "@/components/layout/snackbar";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Snackbar", () => {
  it("replaces its notice inside one live region and dismisses status notices on a timer", () => {
    const onDismiss = vi.fn();
    const first: SnackbarNotice = {
      id: 1,
      text: "「読んだ・普通」を保存しました。",
      tone: "status",
    };
    const view = render(<Snackbar notice={first} onDismiss={onDismiss} />);
    const region = screen.getByRole("status");

    view.rerender(
      <Snackbar
        notice={{ ...first, id: 2, text: "「読んだ・最高」を保存しました。" }}
        onDismiss={onDismiss}
      />,
    );
    expect(screen.getByRole("status")).toBe(region);
    expect(region.textContent).toBe("「読んだ・最高」を保存しました。");

    act(() => vi.advanceTimersByTime(5000));
    expect(onDismiss).toHaveBeenCalledWith(2);
    expect(onDismiss).not.toHaveBeenCalledWith(1);
  });

  it("keeps an action reachable while focused and keeps errors until replaced", () => {
    const onDismiss = vi.fn();
    const onAction = vi.fn();
    const view = render(
      <Snackbar
        notice={{
          id: 1,
          text: "「読んだ」を解除しました。",
          tone: "status",
          action: { label: "元に戻す", onAction },
        }}
        onDismiss={onDismiss}
      />,
    );
    const undo = screen.getByRole("button", { name: "元に戻す" });

    fireEvent.focus(undo);
    act(() => vi.advanceTimersByTime(20_000));
    expect(onDismiss).not.toHaveBeenCalled();
    fireEvent.click(undo);
    expect(onAction).toHaveBeenCalledTimes(1);

    view.rerender(
      <Snackbar
        notice={{ id: 2, text: "保存できませんでした。", tone: "error" }}
        onDismiss={onDismiss}
      />,
    );
    fireEvent.blur(undo);
    act(() => vi.advanceTimersByTime(20_000));
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
