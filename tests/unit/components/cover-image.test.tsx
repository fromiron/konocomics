// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CoverImage } from "@/components/cover/CoverImage";
import { HeroBackdrop } from "@/components/media/hero-backdrop";

afterEach(cleanup);

describe("CoverImage accessibility contract", () => {
  it("keeps the hero backdrop on the 200px fallback and removes a broken fallback", () => {
    const { container } = render(
      <HeroBackdrop coverUrl="https://example.com/cover.jpg?_ex=600x600">
        <span>content</span>
      </HeroBackdrop>,
    );
    const backdrop = () =>
      container.querySelector<HTMLImageElement>(
        '[data-slot="hero-backdrop"] > img[aria-hidden="true"]',
      );

    expect(backdrop()?.dataset.coverSource).toContain("_ex=600x600");
    fireEvent.error(backdrop()!);
    expect(backdrop()?.dataset.coverSource).toContain("_ex=200x200");
    fireEvent.error(backdrop()!);
    expect(backdrop()).toBeNull();
  });

  it("keeps informative covers named by default", () => {
    const { container } = render(
      <CoverImage coverUrl="https://example.com/cover.jpg" creators={["作者"]} title="作品" />,
    );

    expect(container.querySelector("img")?.getAttribute("alt")).toBe("作品 表紙");

    cleanup();
    render(<CoverImage creators={["作者"]} title="作品" />);
    expect(screen.getByRole("img", { name: "作品の表紙画像はありません。作者 作者" })).toBeTruthy();
  });

  it("keeps the standard cover root valid inside native buttons", () => {
    const actual = render(
      <button type="button">
        <CoverImage coverUrl="https://example.com/cover.jpg" creators={["作者"]} title="作品" />
      </button>,
    );
    expect(actual.container.querySelector(".cover-image")?.tagName).toBe("SPAN");
    actual.unmount();

    const placeholder = render(
      <button type="button">
        <CoverImage creators={["作者"]} title="作品" />
      </button>,
    );
    expect(placeholder.container.querySelector(".cover-image--placeholder")?.tagName).toBe("SPAN");
  });

  it("uses eager high-priority loading only for the explicit LCP cover", () => {
    const priority = render(
      <CoverImage
        coverUrl="https://example.com/priority.jpg"
        creators={["作者"]}
        priority
        title="先頭"
      />,
    );
    const priorityImage = priority.container.querySelector("img");
    expect(priorityImage?.getAttribute("loading")).toBe("eager");
    expect(priorityImage?.getAttribute("fetchpriority")).toBe("high");
    expect(priorityImage?.getAttribute("decoding")).toBe("sync");
    priority.unmount();

    const deferred = render(
      <CoverImage coverUrl="https://example.com/deferred.jpg" creators={["作者"]} title="二番目" />,
    );
    const deferredImage = deferred.container.querySelector("img");
    expect(deferredImage?.getAttribute("loading")).toBe("lazy");
    expect(deferredImage?.getAttribute("fetchpriority")).toBe("auto");
    expect(deferredImage?.getAttribute("decoding")).toBe("async");
  });

  it("keeps the real image paintable above its skeleton before load settles", () => {
    const { container } = render(
      <CoverImage coverUrl="https://example.com/cover.jpg" creators={["作者"]} title="作品" />,
    );
    const image = container.querySelector<HTMLImageElement>(".cover-image__image");
    const skeleton = container.querySelector(".cover-image__skeleton");

    expect(image?.dataset.loaded).toBe("false");
    expect(skeleton).toBeTruthy();
    expect(skeleton?.nextElementSibling).toBe(image);
    expect(image?.hidden).toBe(false);
    expect(image?.getAttribute("aria-hidden")).toBeNull();
  });

  it("removes the skeleton and reports settlement exactly once after a successful load", () => {
    const onSettled = vi.fn();
    const { container } = render(
      <CoverImage
        coverUrl="https://example.com/cover.jpg"
        creators={["作者"]}
        onSettled={onSettled}
        title="作品"
      />,
    );
    const image = container.querySelector<HTMLImageElement>(".cover-image__image");
    if (image === null) throw new Error("Expected the cover image");

    expect(onSettled).not.toHaveBeenCalled();
    fireEvent.load(image);
    expect(image.dataset.loaded).toBe("true");
    expect(container.querySelector(".cover-image__skeleton")).toBeNull();
    expect(onSettled).toHaveBeenCalledOnce();

    fireEvent.load(image);
    expect(onSettled).toHaveBeenCalledOnce();
  });

  it("waits through the 400 to 200 fallback and releases a terminal placeholder failure", () => {
    const fallbackSettled = vi.fn();
    const fallback = render(
      <CoverImage
        coverUrl="https://example.com/fallback.jpg"
        creators={["作者"]}
        onSettled={fallbackSettled}
        requestedSize={400}
        title="フォールバック"
      />,
    );
    const fallbackImage = fallback.container.querySelector<HTMLImageElement>(".cover-image__image");
    if (fallbackImage === null) throw new Error("Expected the fallback cover image");

    fireEvent.error(fallbackImage);
    expect(fallbackImage.src).toContain("_ex=200x200");
    expect(fallbackSettled).not.toHaveBeenCalled();
    fireEvent.load(fallbackImage);
    expect(fallbackSettled).toHaveBeenCalledOnce();
    fallback.unmount();

    const terminalSettled = vi.fn();
    const terminal = render(
      <CoverImage
        coverUrl="https://example.com/terminal.jpg"
        creators={["作者"]}
        onSettled={terminalSettled}
        requestedSize={400}
        title="終端"
      />,
    );
    const terminalImage = terminal.container.querySelector<HTMLImageElement>(".cover-image__image");
    if (terminalImage === null) throw new Error("Expected the terminal cover image");

    fireEvent.error(terminalImage);
    expect(terminalSettled).not.toHaveBeenCalled();
    fireEvent.error(terminalImage);
    expect(terminal.container.querySelector(".cover-image--placeholder")).toBeTruthy();
    expect(terminalSettled).toHaveBeenCalledOnce();
  });

  it("removes decorative images and placeholders from the accessibility tree", () => {
    const actual = render(
      <CoverImage
        coverUrl="https://example.com/cover.jpg"
        creators={["作者"]}
        decorative
        title="作品"
      />,
    );
    expect(actual.container.querySelector("img")?.getAttribute("alt")).toBe("");
    actual.unmount();

    const placeholder = render(<CoverImage creators={["作者"]} decorative title="作品" />);
    const element = placeholder.container.querySelector(".cover-image--placeholder");
    expect(element?.getAttribute("aria-hidden")).toBe("true");
    expect(element?.hasAttribute("aria-label")).toBe(false);
    expect(element?.hasAttribute("role")).toBe(false);
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("keeps hero blur and foreground on the same source through the 600 to 200 fallback", () => {
    const { container } = render(
      <CoverImage
        coverUrl="https://example.com/cover.jpg?foo=bar&_ex=400x400"
        creators={["作者"]}
        requestedSize={600}
        title="作品"
        variant="hero"
      />,
    );

    const informative = screen.getByRole<HTMLImageElement>("img", { name: "作品 表紙" });
    const decorative = container.querySelector<HTMLImageElement>("img[aria-hidden='true']");
    const paperOverlay = container.querySelector(".cover-image__hero-paper[aria-hidden='true']");
    expect(informative.getAttribute("src")).toContain("_ex=600x600");
    expect(decorative?.getAttribute("src")).toBe(informative.getAttribute("src"));
    expect(paperOverlay).toBeTruthy();

    fireEvent.error(informative);

    expect(informative.getAttribute("src")).toContain("_ex=200x200");
    expect(decorative?.getAttribute("src")).toBe(informative.getAttribute("src"));
  });
});
