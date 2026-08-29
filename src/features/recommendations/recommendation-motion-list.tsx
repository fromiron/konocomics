"use client";

import { AnimatePresence, LazyMotion, domMax, m } from "motion/react";
import type { ReactNode } from "react";

import {
  carouselCloneProps,
  carouselLoopCopies,
  cloneCarouselTrailing,
  duplicateCarouselContent,
  shouldLoopCarousel,
} from "@/components/media/media-shelf";

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
  const copies = shouldLoopCarousel(items.length) ? carouselLoopCopies : ([1] as const);
  return (
    <LazyMotion features={domMax} strict>
      <AnimatePresence initial={false}>
        {copies.flatMap((copy) => [
          ...items.map((item) => (
            <m.li
              animate={copy === 1 && !reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1 }}
              className="basis-[var(--featured-card-basis)] shrink-0 snap-start overflow-visible [contain:layout_paint]"
              data-recommendation-work-id={item.workId}
              exit={copy === 1 && !reducedMotion ? { height: 0, opacity: 0 } : undefined}
              initial={
                copy === 1 && item.animateIn && !reducedMotion
                  ? {
                      opacity: 0,
                      y: 8,
                    }
                  : false
              }
              key={`${String(copy)}-${item.workId}`}
              layout={copy === 1 && !reducedMotion ? "position" : false}
              transition={
                reducedMotion || copy !== 1
                  ? { duration: 0 }
                  : {
                      height: { duration: 0.24, ease: "easeOut" },
                      opacity: { duration: item.animateIn ? 0.2 : 0.24, ease: "easeOut" },
                      y: { duration: 0.2, ease: "easeOut" },
                      layout: { duration: 0.24, ease: [0.2, 0, 0, 1] },
                    }
              }
              {...carouselCloneProps(copy)}
            >
              {duplicateCarouselContent(item.content, copy)}
            </m.li>
          )),
          cloneCarouselTrailing(shortage, copy),
        ])}
      </AnimatePresence>
    </LazyMotion>
  );
}
