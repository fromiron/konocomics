import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";
import { buttonClassName } from "@/components/design-system/button";
import { burstConfirmSparks } from "@/components/motion/confirm-spark";
import { usePointerEffect } from "@/components/motion/use-pointer-effects";
import { HomeHeroScene } from "@/features/home-hero/home-hero-scene";
import { landingStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import { HomeHeroResult } from "./home-hero-result";
import { LandingLogoReveal } from "./landing-logo-reveal";
import type { LandingSample } from "./landing-types";

const workCountFormat = new Intl.NumberFormat("ja-JP");
export const landingCtaClassName = buttonClassName({
  className:
    "gap-[var(--space-content)] px-[var(--space-6)] py-[var(--space-3)] text-[length:var(--font-size-16)] font-bold",
});

/**
 * Where the visitor stands, so the single landing action continues their own path: a new visitor
 * starts, an interrupted onboarding resumes its saved draft, a usable profile returns to its
 * recommendations, and a profile needing works keeps the existing recovery path.
 */
export type LandingVisitorState = "new" | "resume" | "profile" | "recovery";

export function LandingCta({ visitor = "new" }: Readonly<{ visitor?: LandingVisitorState }>) {
  const magnetRef = usePointerEffect<HTMLAnchorElement>("magnet");
  return (
    <Link
      className={cn(landingCtaClassName, "pointer-magnet")}
      data-landing-visitor={visitor}
      onClick={(event) => {
        // Keyboard activation has no pointer position, so the burst starts at the button.
        burstConfirmSparks(
          event.detail === 0 ? event.currentTarget : { x: event.clientX, y: event.clientY },
        );
      }}
      ref={magnetRef}
      preload={false}
      to={visitor === "profile" ? "/recommendations" : "/onboarding"}
    >
      {landingStrings.ctaByVisitor[visitor]}
      <ArrowRightIcon aria-hidden="true" className="size-4" />
    </Link>
  );
}

type HomeHeroProps = Readonly<{
  recommendableWorkCount: number;
  /** The example profile whose real recommendation fills the page's last panel. */
  sample: LandingSample;
  coverUrl: string | null | undefined;
  onCoverVisible(): void;
  /** `?landing=1`: a write-free bypass, so the hero reads and writes no storage. */
  storageFree?: boolean;
  visitor?: LandingVisitorState;
  sharedEntry?: boolean;
}>;

/**
 * Hero as a landing spread: the brand, the promise set large and the single action on the left;
 * on the right a living manga page whose last panel is a real example recommendation with its
 * reason. It fills at least the first screen, centred, so nothing below shows before the reader
 * scrolls.
 */
export function HomeHero({
  coverUrl,
  onCoverVisible,
  recommendableWorkCount,
  sample,
  sharedEntry = false,
  storageFree = false,
  visitor = "new",
}: HomeHeroProps) {
  return (
    <div className="overflow-x-clip">
      <section
        aria-labelledby="landing-title"
        className="landing-hero mx-auto grid min-h-svh w-full max-w-[var(--layout-width-hero)] content-center px-[var(--layout-page-padding)] pt-[var(--space-6)] pb-[var(--space-12)]"
      >
        <div className="hh-hero">
          <div className="hh-masthead">
            <LandingLogoReveal staticPresentation={storageFree} />
          </div>
          <div className="hh-copy">
            {sharedEntry ? (
              <p className="text-[length:var(--text-caption-size)] font-bold text-accent-ink">
                {landingStrings.sharedEntry}
              </p>
            ) : null}
            <h1 className="hh-title" id="landing-title">
              {/* Phrases never break inside; each phrase is one line where there is room. */}
              {landingStrings.taglinePhrases.map((phrase) => (
                <span className="hh-title__phrase" key={phrase}>
                  {phrase}
                </span>
              ))}
            </h1>
            <div className="hh-copy__action">
              <LandingCta visitor={visitor} />
              {visitor === "new" ? null : (
                <p className="text-[length:var(--text-caption-size)] text-text">
                  {landingStrings.visitorNote[visitor]}
                </p>
              )}
              <p className="text-[length:var(--text-caption-size)] text-text-muted">
                {landingStrings.hero
                  .trust(workCountFormat.format(recommendableWorkCount))
                  .join(" · ")}
              </p>
            </div>
          </div>
          <HomeHeroScene
            lastPanel={
              <HomeHeroResult coverUrl={coverUrl} onCoverVisible={onCoverVisible} sample={sample} />
            }
            storageFree={storageFree}
          />
        </div>
      </section>
    </div>
  );
}
