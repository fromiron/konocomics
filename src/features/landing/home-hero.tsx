import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";
import { buttonClassName } from "@/components/design-system/button";
import { burstConfirmSparks } from "@/components/motion/confirm-spark";
import { usePointerEffect } from "@/components/motion/use-pointer-effects";
import { AXIS_IDS } from "@/domain/catalog/constants";
import { HomeHeroScene } from "@/features/home-hero/home-hero-scene";
import { landingStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import { LandingLogoReveal } from "./landing-logo-reveal";

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
  /** `?landing=1`: a write-free bypass, so the hero reads and writes no storage. */
  storageFree?: boolean;
  visitor?: LandingVisitorState;
  sharedEntry?: boolean;
}>;

/**
 * Hero as a magazine spread: brand masthead, a living manga page with the title set vertically
 * beside it (horizontally on narrow screens), and the copy and single action underneath. It
 * fills at least the first screen, centred, so nothing below shows before the reader scrolls.
 */
export function HomeHero({
  recommendableWorkCount,
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
        <HomeHeroScene
          brand={<LandingLogoReveal staticPresentation={storageFree} />}
          storageFree={storageFree}
          title={
            <h1 className="hh-title" id="landing-title">
              {/* Phrases never break inside; on wide screens each phrase is one column. */}
              {landingStrings.taglinePhrases.map((phrase) => (
                <span className="hh-title__phrase" key={phrase}>
                  {phrase}
                </span>
              ))}
            </h1>
          }
        >
          <div className="hh-foot">
            <div className="grid content-start gap-[var(--space-2)]">
              {sharedEntry ? (
                <p className="text-[length:var(--text-caption-size)] font-bold text-accent-ink">
                  {landingStrings.sharedEntry}
                </p>
              ) : null}
              <p className="max-w-[34rem] text-[length:var(--text-body-size)] leading-[var(--line-height-body)] text-text-muted [word-break:auto-phrase]">
                {landingStrings.description(AXIS_IDS.length)}
              </p>
            </div>
            <div className="hh-foot__action">
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
        </HomeHeroScene>
      </section>
    </div>
  );
}
