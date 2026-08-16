"use client";

import { LazyMotion, domAnimation, m } from "motion/react";
import type { ReactNode } from "react";

import { BrandWordmark } from "@/components/nav/brand-wordmark";

type LandingLogoRevealMotionProps = Readonly<{
  caption: ReactNode;
}>;

export function LandingLogoRevealMotion({ caption }: LandingLogoRevealMotionProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      <span className="landing-logo-reveal__mark">
        <BrandWordmark className="landing-logo-reveal__base" />
        <m.span
          animate={{ opacity: [0, 1, 0] }}
          className="landing-logo-reveal__monochrome"
          initial={{ opacity: 0 }}
          transition={{
            duration: 0.9,
            ease: [0.2, 0, 0, 1],
            times: [0, 4 / 9, 1],
          }}
        >
          <BrandWordmark decorative />
        </m.span>
      </span>
      <m.span
        animate={{ opacity: 1, y: 0 }}
        className="landing-logo-reveal__caption"
        initial={{ opacity: 0, y: 8 }}
        transition={{ delay: 0.9, duration: 0.5, ease: [0.2, 0, 0, 1] }}
      >
        {caption}
      </m.span>
    </LazyMotion>
  );
}
