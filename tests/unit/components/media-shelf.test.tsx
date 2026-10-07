// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MediaShelf } from "@/components/media/media-shelf";

afterEach(cleanup);

describe("MediaShelf", () => {
  it.each([0, 1])("does not duplicate a shelf with %i cards", (count) => {
    const { container } = render(
      <MediaShelf controlsPlacement="overlay" title="Small shelf">
        {Array.from({ length: count }, (_, index) => (
          <article key={index}>Card</article>
        ))}
      </MediaShelf>,
    );
    expect(container.querySelectorAll("article")).toHaveLength(count);
    expect(container.querySelector("[data-carousel-clone]")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("moves focus between adjacent cards with the arrow keys", () => {
    render(
      <MediaShelf title="Shelf">
        <article>
          <button type="button">First</button>
        </article>
        <article>
          <button type="button">Second</button>
        </article>
      </MediaShelf>,
    );

    const first = screen.getByRole("button", { name: "First" });
    const second = screen.getByRole("button", { name: "Second" });
    first.focus();

    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(document.activeElement).toBe(second);

    fireEvent.keyDown(second, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(first);

    fireEvent.keyDown(first, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(first);
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(document.activeElement).toBe(second);
    fireEvent.keyDown(second, { key: "ArrowRight" });
    expect(document.activeElement).toBe(second);
  });

  it("reports the first card on the next visible page", () => {
    const onPageChange = vi.fn();
    const { container } = render(
      <MediaShelf
        controlsPlacement="overlay"
        enableLoop={false}
        onPageChange={onPageChange}
        title="Shelf"
      >
        <article>First</article>
        <article>Second</article>
      </MediaShelf>,
    );
    const track = container.querySelector<HTMLElement>("[data-media-shelf-track]");
    expect(track).not.toBeNull();
    if (track === null) return;

    Object.defineProperties(track, {
      clientWidth: { configurable: true, value: 100 },
      scrollLeft: { configurable: true, value: 0, writable: true },
      scrollWidth: { configurable: true, value: 200 },
      scrollBy: {
        configurable: true,
        value: ({ left }: ScrollToOptions) => {
          track.scrollLeft += left ?? 0;
        },
      },
    });
    Array.from(track.children).forEach((child, index) => {
      Object.defineProperties(child, {
        offsetLeft: { configurable: true, value: index * 100 },
        offsetWidth: { configurable: true, value: 100 },
      });
    });

    fireEvent.scroll(track);
    const previous = screen.getByRole<HTMLButtonElement>("button", { name: /前へ/ });
    const next = screen.getByRole<HTMLButtonElement>("button", { name: /次へ/ });
    const startFade = container.querySelector(".media-shelf-edge-fade--start");
    const endFade = container.querySelector(".media-shelf-edge-fade--end");
    expect(container.querySelector(".media-shelf-overlay")).not.toBeNull();
    expect(previous.disabled).toBe(true);
    expect(next.disabled).toBe(false);
    expect(startFade?.classList.contains("hidden")).toBe(true);
    expect(endFade?.classList.contains("hidden")).toBe(false);

    fireEvent.click(next);
    fireEvent.scroll(track);

    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(previous.disabled).toBe(false);
    expect(next.disabled).toBe(true);
    expect(startFade?.classList.contains("hidden")).toBe(false);
    expect(endFade?.classList.contains("hidden")).toBe(true);
  });

  it.each([2, 3, 5])(
    "hides %i fitting cards’ loop copies and re-evaluates after resize",
    (count) => {
      let resize: (() => void) | undefined;
      vi.stubGlobal(
        "ResizeObserver",
        class {
          constructor(callback: () => void) {
            resize = callback;
          }
          observe() {}
          disconnect() {}
        },
      );
      const view = render(
        <MediaShelf controlsPlacement="overlay" title="Responsive shelf">
          {Array.from({ length: count }, (_, index) => (
            <article key={index}>
              <button>{`Card ${index}`}</button>
            </article>
          ))}
        </MediaShelf>,
      );
      const track = view.container.querySelector<HTMLElement>("[data-media-shelf-track]")!;
      let width = count * 100 + 100;
      Object.defineProperties(track, {
        clientWidth: { configurable: true, get: () => width },
        scrollWidth: {
          configurable: true,
          get: () =>
            Array.from(track.children).filter((e) => e instanceof HTMLElement && !e.hidden).length *
            100,
        },
      });
      for (const child of Array.from(track.children)) {
        Object.defineProperties(child, {
          offsetLeft: {
            configurable: true,
            get: () =>
              child instanceof HTMLElement && child.hidden
                ? 0
                : Array.from(track.children)
                    .filter((e) => e instanceof HTMLElement && !e.hidden)
                    .indexOf(child) * 100,
          },
          offsetWidth: { configurable: true, value: 100 },
        });
      }
      try {
        act(() => resize?.());
        expect(
          Array.from(track.querySelectorAll<HTMLElement>("[data-carousel-clone]")).every(
            (e) => e.hidden,
          ),
        ).toBe(true);
        expect(screen.queryByRole("button", { name: /次へ/ })).toBeNull();
        expect(screen.getAllByRole("button")).toHaveLength(count);

        width = 150;
        act(() => resize?.());
        expect(
          Array.from(track.querySelectorAll<HTMLElement>("[data-carousel-clone]")).every(
            (e) => !e.hidden,
          ),
        ).toBe(true);
        expect(track.scrollLeft).toBe(count * 100);
        expect(screen.getByRole<HTMLButtonElement>("button", { name: /次へ/ }).disabled).toBe(
          false,
        );

        track.scrollLeft = count * 100 + (count - 1) * 100;
        fireEvent.scroll(track);
        const firstOriginal = track.querySelector<HTMLElement>("[data-carousel-copy='1']")!;
        expect(firstOriginal.style.translate).toBe(`${count * 100}px`);
        expect(
          Array.from(track.querySelectorAll<HTMLElement>("[data-carousel-clone]")).every(
            (e) => e.style.visibility === "hidden" && e.hasAttribute("inert"),
          ),
        ).toBe(true);
        const firstButton = firstOriginal.querySelector("button")!;
        firstButton.focus();
        fireEvent.keyDown(firstButton, { key: "ArrowRight" });
        expect(document.activeElement?.textContent).toBe("Card 1");

        width = count * 100 + 100;
        act(() => resize?.());
        expect(track.scrollLeft).toBe(0);
        expect(screen.queryByRole("button", { name: /次へ/ })).toBeNull();
      } finally {
        vi.unstubAllGlobals();
      }
    },
  );

  it("preserves the canonical offset when loop items change", () => {
    const offsetLeftDescriptor = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "offsetLeft",
    );
    Object.defineProperty(HTMLElement.prototype, "offsetLeft", {
      configurable: true,
      get: function (this: HTMLElement) {
        const parent = this.parentElement;
        return parent === null ? 0 : Array.from(parent.children).indexOf(this) * 100;
      },
    });

    const shelf = (ids: readonly string[]) => (
      <MediaShelf controlsPlacement="overlay" title="Loop shelf">
        {ids.map((id) => (
          <article key={id}>{id}</article>
        ))}
      </MediaShelf>
    );

    try {
      const view = render(shelf(["a", "b", "c"]));
      const track = view.container.querySelector<HTMLElement>("[data-media-shelf-track]");
      expect(track).not.toBeNull();
      if (track === null) return;

      expect(track.scrollLeft).toBe(300);
      track.scrollLeft = 420;

      view.rerender(shelf(["a", "c", "d"]));
      expect(track.scrollLeft).toBe(420);

      view.rerender(shelf(["a", "c"]));
      expect(track.scrollLeft).toBe(320);
    } finally {
      if (offsetLeftDescriptor === undefined) {
        Reflect.deleteProperty(HTMLElement.prototype, "offsetLeft");
      } else {
        Object.defineProperty(HTMLElement.prototype, "offsetLeft", offsetLeftDescriptor);
      }
    }
  });
});
