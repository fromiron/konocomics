// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { MediaShelf } from "@/components/media/media-shelf";

afterEach(cleanup);

describe("MediaShelf", () => {
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
  });
});
