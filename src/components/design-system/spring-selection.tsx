"use client";

import { LayoutGroup, LazyMotion, domMax, m } from "motion/react";
import { useId, type ReactNode } from "react";

import { useLiveReducedMotion } from "@/components/motion/use-live-reduced-motion";

export const controlSpring = { type: "spring", stiffness: 350, damping: 24 } as const;

/** Each control group owns its own indicator; labels and hit targets never move. */
export function SpringSelectionGroup({ children }: Readonly<{ children: ReactNode }>) {
  const id = useId();
  return (
    <LazyMotion features={domMax} strict>
      <LayoutGroup id={id}>{children}</LayoutGroup>
    </LazyMotion>
  );
}

export function SpringSelectionIndicator({ slot }: Readonly<{ slot: string }>) {
  const reducedMotion = useLiveReducedMotion() !== false;
  return (
    <m.span
      aria-hidden="true"
      className="segmented-control__indicator pointer-events-none absolute inset-0 -z-10 rounded-[var(--radius-control)] bg-accent"
      data-slot={slot}
      initial={false}
      key={reducedMotion ? "still" : "spring"}
      layoutId={reducedMotion ? undefined : "selection"}
      transition={controlSpring}
    />
  );
}
