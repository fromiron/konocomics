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
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((item) => (
          <m.li
            animate={!reducedMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 1 }}
            className="basis-[var(--featured-card-basis)] shrink-0 snap-start overflow-visible [contain:layout_paint]"
            data-recommendation-work-id={item.workId}
            exit={!reducedMotion ? { opacity: 0, scale: 0.92 } : undefined}
            initial={
              item.animateIn && !reducedMotion
                ? {
                    opacity: 0,
                    y: 8,
                  }
                : false
            }
            key={item.workId}
            layout={!reducedMotion ? "position" : false}
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    layout: { damping: 32, stiffness: 350, type: "spring" },
                    opacity: { duration: item.animateIn ? 0.2 : 0.24, ease: "easeOut" },
                    scale: { duration: 0.24, ease: [0.2, 0, 0, 1] },
                    y: { duration: 0.2, ease: "easeOut" },
                  }
            }
          >
            {item.content}
          </m.li>
        ))}
        {shortage}
      </AnimatePresence>
    </LazyMotion>
  );
}
