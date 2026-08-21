// @vitest-environment jsdom

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ReactNode } from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RecommendationMotionList } from "@/features/recommendations/recommendation-motion-list";

const motionState = vi.hoisted(() => ({
  itemProps: [] as Record<string, unknown>[],
  lazyProps: [] as Record<string, unknown>[],
}));

vi.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
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
});

afterEach(cleanup);

describe("RecommendationMotionList", () => {
  it("contains the only permitted height-collapse owner without size containment", () => {
    render(
      <RecommendationMotionList
        items={[{ workId: "work-1", animateIn: true, content: <article>Work</article> }]}
        reducedMotion={false}
        shortage={null}
      />,
    );

    const itemClassName = motionState.itemProps[0]?.className;
    expect(itemClassName).toContain("[contain:layout_paint]");
    expect(itemClassName).not.toContain("contain:size");

    const cardSource = readFileSync(
      resolve(process.cwd(), "src/features/recommendations/recommendation-card.tsx"),
      "utf8",
    );
    expect(cardSource).toContain("<ExpandableMediaCard");
    const expandableCardSource = readFileSync(
      resolve(process.cwd(), "src/components/media/expandable-media-card.tsx"),
      "utf8",
    );
    expect(expandableCardSource).toContain("prefersReducedMotion()");
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
    expect(motionState.itemProps[0]).toMatchObject({
      animate: { opacity: 1, y: 0 },
      exit: { height: 0, opacity: 0 },
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

    const itemProps = motionState.itemProps[0];
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
    ).not.toMatch(/height|"y"/u);
  });
});
