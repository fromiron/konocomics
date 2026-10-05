import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";
import { buttonClassName } from "@/components/design-system/button";
import { burstConfirmSparks } from "@/components/motion/confirm-spark";
import { usePointerEffect } from "@/components/motion/use-pointer-effects";
import { HeroUnderlay } from "@/features/home-hero/hero-underlay";
import {
  HomeHeroScene,
  sceneWindowStyle,
  useHeroScene,
} from "@/features/home-hero/home-hero-scene";
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

/**
 * The single landing action. `panel` makes it the hero's action panel itself: the text sits in
 * the panel and the link covers the whole panel, so the panel is the button.
 */
export function LandingCta({
  visitor = "new",
  appearance = "button",
}: Readonly<{ visitor?: LandingVisitorState; appearance?: "button" | "panel" }>) {
  const magnetRef = usePointerEffect<HTMLAnchorElement>("magnet");
  const panel = appearance === "panel";
  return (
    <Link
      className={panel ? "hh-cta" : cn(landingCtaClassName, "pointer-magnet")}
      data-landing-visitor={visitor}
      onClick={(event) => {
        // Keyboard activation has no pointer position, so the burst starts at the button.
        burstConfirmSparks(
          event.detail === 0 ? event.currentTarget : { x: event.clientX, y: event.clientY },
        );
      }}
      ref={panel ? undefined : magnetRef}
      preload={false}
      to={visitor === "profile" ? "/recommendations" : "/onboarding"}
    >
      {landingStrings.ctaByVisitor[visitor]}
      <ArrowRightIcon aria-hidden="true" className={panel ? "hh-cta__arrow" : "size-4"} />
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
 * The hero as one manga page under a magazine masthead, read the Japanese way from the top
 * right: the opening narration (the promise, set vertically), the large art panel, then the
 * scene's sound effect where the battle hand lands and, in the closing bottom-left corner where
 * a page turns, the action panel. Two tiers with their dividers at different places, the lower
 * one on a slant. On narrow screens the panels stack.
 */
export function HomeHero({
  recommendableWorkCount,
  sharedEntry = false,
  storageFree = false,
  visitor = "new",
}: HomeHeroProps) {
  const scene = useHeroScene(storageFree);
  const accent = landingStrings.taglineAccent;
  return (
    <div className="overflow-x-clip">
      <section aria-labelledby="landing-title" className="landing-hero">
        <HeroUnderlay sceneId={scene.id} />
        <div className="hh-spread">
          <div className="hh-page" data-paper={scene.paper} style={sceneWindowStyle(scene)}>
            <div className="hh-mast">
              <LandingLogoReveal staticPresentation={storageFree} />
            </div>
            {/* The opening narration (top right, read first): the promise, set vertically. */}
            <div className="hh-koma hh-koma--title">
              <div className="hh-koma__fill">
                <h1 className="hh-title" id="landing-title">
                  {landingStrings.taglinePhrases.map((phrase) => (
                    <span className="hh-title__phrase" key={phrase}>
                      {phrase.startsWith(accent) ? (
                        <>
                          <span className="hh-title__accent">{accent}</span>
                          {phrase.slice(accent.length)}
                        </>
                      ) : (
                        phrase
                      )}
                    </span>
                  ))}
                </h1>
              </div>
            </div>
            <HomeHeroScene scene={scene} storageFree={storageFree} />
            {/* The lower tier, divided at a different place than the upper one, on a slant. */}
            <div className="hh-tier">
              <div className="hh-koma hh-koma--action">
                <div className="hh-koma__fill">
                  {sharedEntry ? (
                    <p className="hh-cta__note font-bold">{landingStrings.sharedEntry}</p>
                  ) : null}
                  <LandingCta appearance="panel" visitor={visitor} />
                  {visitor === "new" ? null : (
                    <p className="hh-cta__note">{landingStrings.visitorNote[visitor]}</p>
                  )}
                  <p className="hh-cta__note">
                    {landingStrings.hero
                      .trust(workCountFormat.format(recommendableWorkCount))
                      .join(" · ")}
                  </p>
                </div>
              </div>
              {/* A panel holding only the scene's sound effect, where the hand lands (描き文字). */}
              <div aria-hidden="true" className="hh-koma hh-koma--effect">
                <div className="hh-koma__fill">
                  <span className="hh-effect">{landingStrings.hero.panelEffect[scene.id]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
