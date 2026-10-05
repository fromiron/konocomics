"use client";

import { LazyMotion, domAnimation, m } from "motion/react";

import { BrandWordmark } from "@/components/nav/brand-wordmark";

export function LandingLogoRevealMotion() {
  return (
    <LazyMotion features={domAnimation} strict>
      <span className="relative inline-flex text-[length:var(--font-size-28)]">
        <BrandWordmark className="landing-logo-reveal__base relative z-0" />
        <m.span
          animate={{ opacity: [0, 1, 0] }}
          className="landing-logo-reveal__monochrome pointer-events-none absolute inset-0 z-[1] opacity-0"
          initial={{ opacity: 0 }}
          transition={{
            duration: 0.9,
            ease: [0.2, 0, 0, 1],
            times: [0, 4 / 9, 1],
          }}
        >
          <BrandWordmark className="[&>span]:!text-text" decorative />
        </m.span>
      </span>
    </LazyMotion>
  );
}
