// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CoverImage } from "@/components/cover/CoverImage";
import { BookCover } from "@/components/cover/BookCover";
import { HeroBackdrop } from "@/components/media/hero-backdrop";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("CoverImage accessibility contract", () => {
  it("keeps the book base decorative and preserves the cover fallback inside a button", () => {
    const { container } = render(
      <button type="button">
        <BookCover coverUrl="https://example.com/cover.jpg" creators={["作者"]} title="作品" />
      </button>,
    );
    const cover = screen.getByRole("img", { name: "作品 表紙" });
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(container.querySelector(".book-cover__base")?.getAttribute("aria-hidden")).toBe("true");
    expect(cover.getAttribute("src")).toContain("_ex=400x400");
    fireEvent.error(cover);
    expect(cover.getAttribute("src")).toContain("_ex=200x200");
    fireEvent.error(cover);
    expect(screen.getByRole("img", { name: "作品の表紙画像はありません。作者 作者" })).toBeTruthy();
    expect(container.querySelector(".book-cover .cover-image")?.tagName).toBe("SPAN");
  });

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

  it.each([
    ["contain", 160, 160, "object-contain"],
    ["cover-square", 160, 160, "object-cover"],
    ["cover-square", 282, 400, "object-contain"],
  ] as const)("renders %s at %d x %d with %s", (fit, width, height, expectedFit) => {
    const { container } = render(
      <CoverImage
        coverUrl="https://example.com/cover.jpg"
        creators={["作者"]}
        fit={fit}
        title="作品"
      />,
    );
    const image = container.querySelector<HTMLImageElement>("img");
    if (image === null) throw new Error("Missing cover image");
    Object.defineProperties(image, {
      naturalWidth: { configurable: true, value: width },
      naturalHeight: { configurable: true, value: height },
    });
    fireEvent.load(image);
    expect(image.className).toContain(expectedFit);
    if (expectedFit === "object-cover") expect(image.className).toContain("object-center");
    expect(image.alt).toBe("作品 表紙");
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
    expect(priorityImage?.getAttribute("decoding")).toBe("async");
    priority.unmount();

    const deferred = render(
      <CoverImage coverUrl="https://example.com/deferred.jpg" creators={["作者"]} title="二番目" />,
    );
    const deferredImage = deferred.container.querySelector("img");
    expect(deferredImage?.getAttribute("loading")).toBe("lazy");
    expect(deferredImage?.getAttribute("fetchpriority")).toBe("auto");
    expect(deferredImage?.getAttribute("decoding")).toBe("async");
  });

  it("reports visibility once and falls back when observation is unavailable", () => {
    let observerCallback: IntersectionObserverCallback | undefined;
    const disconnect = vi.fn();
    const observe = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          observerCallback = callback;
        }

        disconnect = disconnect;
        observe = observe;
      },
    );
    const onVisible = vi.fn();
    const observed = render(
      <CoverImage creators={["作者"]} onVisible={onVisible} title="表示対象" />,
    );
    expect(observe).toHaveBeenCalledOnce();
    expect(onVisible).not.toHaveBeenCalled();

    observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as never);
    observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as never);
    expect(onVisible).toHaveBeenCalledOnce();
    expect(disconnect).toHaveBeenCalledOnce();
    observed.unmount();

    vi.stubGlobal("IntersectionObserver", undefined);
    const fallbackVisible = vi.fn();
    render(<CoverImage creators={["作者"]} onVisible={fallbackVisible} title="代替" />);
    expect(fallbackVisible).toHaveBeenCalledOnce();
  });

  it("keeps the real image paintable above its skeleton before load settles", () => {
    const { container } = render(
      <CoverImage coverUrl="https://example.com/cover.jpg" creators={["作者"]} title="作品" />,
    );
    const image = container.querySelector<HTMLImageElement>(".cover-image__image");
    const artwork = container.querySelector(".cover-image__artwork");
    const skeleton = container.querySelector(".cover-image__skeleton");

    expect(image?.dataset.loaded).toBe("false");
    expect(skeleton).toBeTruthy();
    expect(skeleton?.nextElementSibling).toBe(artwork);
    expect(artwork?.contains(image ?? null)).toBe(true);
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

  it("can match the frame to the source ratio without cropping", () => {
    const { container } = render(
      <CoverImage
        coverUrl="https://example.com/cover.jpg"
        creators={["作者"]}
        matchSourceAspectRatio
        title="作品"
      />,
    );
    const image = container.querySelector<HTMLImageElement>(".cover-image__image");
    const frame = container.querySelector<HTMLElement>(".cover-image");
    const artwork = container.querySelector<HTMLElement>(".cover-image__artwork");
    if (image === null || frame === null || artwork === null) {
      throw new Error("Expected the cover frame");
    }
    Object.defineProperties(image, {
      naturalHeight: { configurable: true, value: 250 },
      naturalWidth: { configurable: true, value: 160 },
    });

    fireEvent.load(image);

    expect(frame.style.aspectRatio).toBe("0.64 / 1");
    expect(artwork.style.aspectRatio).toBe("0.64 / 1");
    expect(artwork.style.height).toBe("100%");
    expect(artwork.style.width).toBe("auto");
    expect(artwork.className).toContain("overflow-hidden");
    expect(artwork.className).toContain("rounded-[var(--radius-cover)]");
    expect(image.className).toContain("object-contain");
    expect(image.className).toContain("rounded-[var(--radius-cover)]");
  });

  it("fits a wider source inside the fixed frame with a rounded source-sized box", () => {
    const { container } = render(
      <CoverImage coverUrl="https://example.com/wide.jpg" creators={["作者"]} title="作品" />,
    );
    const image = container.querySelector<HTMLImageElement>(".cover-image__image");
    const artwork = container.querySelector<HTMLElement>(".cover-image__artwork");
    if (image === null || artwork === null) throw new Error("Expected the cover artwork");
    Object.defineProperties(image, {
      naturalHeight: { configurable: true, value: 400 },
      naturalWidth: { configurable: true, value: 282 },
    });

    fireEvent.load(image);

    expect(artwork.style.aspectRatio).toBe("0.705 / 1");
    expect(artwork.style.height).toBe("auto");
    expect(artwork.style.width).toBe("100%");
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
