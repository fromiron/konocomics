// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
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
      onToggleFavorite={vi.fn()}
      onToggleSelection={vi.fn()}
      selectionsByWorkId={new Map()}
      title="棚"
      works={works}
    />,
  );

  return works.map((work) => screen.getByRole("button", { name: `${work.title} — 好きに追加` }));
}

describe("WorkShelf roving focus", () => {
  it("keeps the contract widths and layers remote-cover identity inside the cover surface", () => {
    render(
      <WorkShelf
        coverUrls={new Map(works.map((work) => [work.id, `https://example.com/${work.id}.jpg`]))}
        labels={labels}
        onToggleFavorite={vi.fn()}
        onToggleSelection={vi.fn()}
        selectionsByWorkId={new Map()}
        title="棚"
        works={works}
      />,
    );

    const firstCard = screen.getByRole("button", { name: "作品1 — 好きに追加" }).closest("article");
    const firstCover = firstCard?.querySelector(".anchor-card__cover");

    expect(firstCard?.classList.contains("w-[104px]")).toBe(true);
    expect(firstCard?.classList.contains("md:w-32")).toBe(true);
    expect(
      firstCover?.querySelector(".anchor-card__identity .anchor-card__title")?.textContent,
    ).toBe("作品1");
    expect(firstCover?.querySelector(".anchor-card__add")).not.toBeNull();
  });

  it("removes selection scale and hover travel when reduced motion is requested", () => {
    renderShelf();
    const cover = document.querySelector(".anchor-card__cover");

    expect(cover?.classList.contains("motion-reduce:transform-none")).toBe(true);
    expect(cover?.classList.contains("motion-reduce:transition-none")).toBe(true);
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
