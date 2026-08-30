// @vitest-environment jsdom

import type { ReactNode } from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RecommendationMotionList } from "@/features/recommendations/recommendation-motion-list";

const motionState = vi.hoisted(() => ({
  itemProps: [] as Record<string, unknown>[],
  lazyProps: [] as Record<string, unknown>[],
  presenceProps: [] as Record<string, unknown>[],
}));

vi.mock("motion/react", () => ({
  AnimatePresence: ({ children, ...props }: { children: ReactNode } & Record<string, unknown>) => {
    motionState.presenceProps.push(props);
    return <>{children}</>;
  },
  LazyMotion: ({ children, ...props }: { children: ReactNode } & Record<string, unknown>) => {
    motionState.lazyProps.push(props);
    return <>{children}</>;
  },
  domMax: { featureSet: "domMax" },
  m: {
    li: ({ children, ...props }: { children: ReactNode } & Record<string, unknown>) => {
      motionState.itemProps.push(props);
      const workId = props["data-recommendation-work-id"];
      return (
        <li data-recommendation-work-id={typeof workId === "string" ? workId : undefined}>
          {children}
        </li>
      );
    },
  },
}));

beforeEach(() => {
  motionState.itemProps.length = 0;
  motionState.lazyProps.length = 0;
  motionState.presenceProps.length = 0;
});

afterEach(cleanup);

describe("RecommendationMotionList", () => {
  const canonicalItemProps = () =>
    motionState.itemProps.find((props) => props["data-carousel-copy"] === 1);

  it("pops the removed card from layout while scaling and fading it", () => {
    render(
      <RecommendationMotionList
        items={[{ workId: "work-1", animateIn: true, content: <article>Work</article> }]}
        reducedMotion={false}
        shortage={null}
      />,
    );

    const itemProps = canonicalItemProps();
    const itemClassName = itemProps?.className;
    expect(itemClassName).toContain("[contain:layout_paint]");
    expect(itemClassName).not.toContain("contain:size");
    expect(motionState.presenceProps[0]).toMatchObject({ initial: false, mode: "popLayout" });
    expect(itemProps?.exit).toEqual({ opacity: 0, scale: 0.92 });
    expect(itemProps?.exit).not.toHaveProperty("height");
  });

  it("uses local domMax layout motion only in the no-preference path", () => {
    render(
      <RecommendationMotionList
        items={[{ workId: "work-1", animateIn: true, content: <article>Work</article> }]}
        reducedMotion={false}
        shortage={null}
      />,
    );

    expect(motionState.lazyProps[0]).toMatchObject({
      features: { featureSet: "domMax" },
      strict: true,
    });
    expect(canonicalItemProps()).toMatchObject({
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.92 },
      initial: { opacity: 0, y: 8 },
      layout: "position",
    });
  });

  it("removes layout, travel, and height animation from the reduced path", () => {
    render(
      <RecommendationMotionList
        items={[{ workId: "work-1", animateIn: true, content: <article>Work</article> }]}
        reducedMotion
        shortage={null}
      />,
    );

    const itemProps = canonicalItemProps();
    expect(itemProps).toMatchObject({
      animate: { opacity: 1 },
      initial: false,
      layout: false,
      transition: { duration: 0 },
    });
    expect(itemProps?.exit).toBeUndefined();
    expect(
      JSON.stringify({
        animate: itemProps?.animate,
        exit: itemProps?.exit,
        initial: itemProps?.initial,
        transition: itemProps?.transition,
      }),
    ).not.toMatch(/height|scale|"y"/u);
  });

  it("keeps only the middle loop copy interactive while all copies share geometry motion", () => {
    render(
      <RecommendationMotionList
        items={[
          { workId: "work-1", animateIn: true, content: <article>Work 1</article> },
          { workId: "work-2", animateIn: false, content: <article>Work 2</article> },
        ]}
        reducedMotion={false}
        shortage={null}
      />,
    );

    const workCopies = motionState.itemProps.filter(
      (props) => props["data-recommendation-work-id"] === "work-1",
    );
    expect(workCopies).toHaveLength(3);
    expect(workCopies[0]).toMatchObject({
      "aria-hidden": true,
      "data-carousel-clone": "",
      "data-carousel-copy": 0,
      inert: true,
      exit: { opacity: 0, scale: 0.92 },
      layout: "position",
    });
    expect(workCopies[1]).toMatchObject({
      "data-carousel-copy": 1,
      layout: "position",
    });
    expect(workCopies[2]).toMatchObject({
      "aria-hidden": true,
      "data-carousel-clone": "",
      "data-carousel-copy": 2,
      inert: true,
      exit: { opacity: 0, scale: 0.92 },
      layout: "position",
    });
  });
});
