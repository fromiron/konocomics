// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { WorkShelf } from "@/features/onboarding/work-shelf";
import { createTestWork } from "../../helpers/catalog";

const motionState = vi.hoisted(() => ({ reduced: false }));

vi.mock("motion/react", () => ({
  useReducedMotion: () => motionState.reduced,
}));

const works = ["1", "2", "3"].map((id) => ({
  ...createTestWork({ id: `work-${id}` }),
  title: `作品${id}`,
}));

const labels = {
  select: "好きに追加",
  remove: "選択を解除",
  selected: "好き",
  favorite: "大好き",
  markFavorite: "大好きにする",
  markLiked: "好きに戻す",
};

beforeEach(() => {
  motionState.reduced = false;
  Object.defineProperty(Element.prototype, "scrollIntoView", {
    configurable: true,
    value: vi.fn(),
  });
});

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(Element.prototype, "scrollIntoView");
});

function renderShelf() {
  render(
    <WorkShelf
      labels={labels}
      nextLabel="次の作品"
      onToggleFavorite={vi.fn()}
      onToggleSelection={vi.fn()}
      previousLabel="前の作品"
      selectionsByWorkId={new Map()}
      title="棚"
      works={works}
    />,
  );

  return works.map((work) => screen.getByRole("button", { name: `${work.title} — 好きに追加` }));
}

describe("WorkShelf roving focus", () => {
  it("removes selection scale and hover travel when reduced motion is requested", () => {
    const globalStyles = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");

    expect(globalStyles).toContain(`.anchor-card__selection:hover .anchor-card__cover,
  .anchor-card[data-selected] .anchor-card__cover {
    animation: none !important;
    transform: none;
  }`);
  });

  it("syncs on focus and moves from the event card index with nearest scrolling", () => {
    const [first, second, third] = renderShelf();

    expect(first?.tabIndex).toBe(0);
    expect(second?.tabIndex).toBe(-1);
    act(() => third?.focus());
    expect(third?.tabIndex).toBe(0);
    expect(first?.tabIndex).toBe(-1);

    fireEvent.keyDown(second!, { key: "ArrowRight" });

    expect(document.activeElement).toBe(third);
    expect(third?.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  });

  it("uses non-animated scrolling when reduced motion is requested", () => {
    motionState.reduced = true;
    const [first, second] = renderShelf();

    fireEvent.keyDown(first!, { key: "ArrowRight" });

    expect(document.activeElement).toBe(second);
    expect(second?.scrollIntoView).toHaveBeenCalledWith({
      behavior: "auto",
      block: "nearest",
      inline: "nearest",
    });
  });
});
