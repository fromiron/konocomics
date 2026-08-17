"use client";

import { AnimatePresence, LazyMotion, domMax, m } from "motion/react";
import type { ReactNode } from "react";

export type RecommendationMotionItem = Readonly<{
  workId: string;
  animateIn: boolean;
  content: ReactNode;
}>;

export type RecommendationMotionListProps = Readonly<{
  items: readonly RecommendationMotionItem[];
  reducedMotion: boolean;
  shortage: ReactNode;
}>;

export function RecommendationMotionList({
  items,
  reducedMotion,
  shortage,
}: RecommendationMotionListProps) {
  return (
    <LazyMotion features={domMax} strict>
      <>
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <m.li
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              className="basis-[var(--featured-card-basis)] shrink-0 snap-start overflow-visible [contain:layout_paint] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:h-[var(--recommendation-card-height)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:has-[article[data-expanded]]:basis-[calc(var(--control-min-size)*8)]"
              data-recommendation-work-id={item.workId}
              exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
              initial={
                item.animateIn && !reducedMotion
                  ? {
                      opacity: 0,
                      y: 8,
                    }
                  : false
              }
              key={item.workId}
              layout={reducedMotion ? false : "position"}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : {
                      height: { duration: 0.24, ease: "easeOut" },
                      opacity: { duration: item.animateIn ? 0.2 : 0.24, ease: "easeOut" },
                      y: { duration: 0.2, ease: "easeOut" },
                      layout: { duration: 0.24, ease: [0.2, 0, 0, 1] },
                    }
              }
            >
              {item.content}
            </m.li>
          ))}
        </AnimatePresence>
        {shortage}
      </>
    </LazyMotion>
  );
}
