import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { buttonClassName } from "@/components/design-system/button";
import { burstConfirmSparks } from "@/components/motion/confirm-spark";
import { usePointerEffect } from "@/components/motion/use-pointer-effects";
import { AccentControl } from "@/features/appearance/accent-control";
import { landingStrings, navigationStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import { HomeEvidenceStage } from "./home-evidence-stage";
import type { LandingSample } from "./landing-types";
import { LandingLogoReveal } from "./landing-logo-reveal";
import type { SampleReason } from "./sample-reason";

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

/** The single landing action: the accent button, with the magnet and confirm sparks (04 §6.2). */
export function LandingCta({
  className,
  visitor = "new",
}: Readonly<{ className?: string; visitor?: LandingVisitorState }>) {
  const magnetRef = usePointerEffect<HTMLAnchorElement>("magnet");
  return (
    <Link
      className={cn(landingCtaClassName, "pointer-magnet", className)}
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

/** Tagline phrases split into glyphs with one running index for the reveal stagger (04 §5.1). */
const taglinePhrases = (() => {
  const accentLength = [...landingStrings.taglineAccent].length;
  let index = 0;
  return landingStrings.taglinePhrases.map((phrase) => {
    const accented = phrase.startsWith(landingStrings.taglineAccent);
    return {
      phrase,
      glyphs: [...phrase].map((glyph, position) => ({
        glyph,
        index: index++,
        accent: accented && position < accentLength,
      })),
    };
  });
})();

/**
 * The tagline fits its column with the longest phrase on one line: one em per full-width glyph
 * plus half an em of headroom for tracking and fallback fonts.
 */
const taglineFontSize = `min(var(--text-hero-size), 100cqi / ${String(
  Math.max(...taglinePhrases.map(({ glyphs }) => glyphs.length)) + 0.5,
)})`;

function HeroTagline() {
  return (
    <h1
      className="landing-tagline leading-[var(--line-height-heading)] tracking-[-0.01em] text-text-strong"
      id="landing-title"
      style={{ fontSize: taglineFontSize }}
    >
      {/* The heading's name is the whole sentence; the glyphs only draw it, so the reveal can
          raise them one by one. Each phrase is one unbreakable unit: the tagline never wraps
          inside a phrase. */}
      <span className="sr-only">{landingStrings.tagline}</span>
      {taglinePhrases.map(({ glyphs, phrase }) => (
        <span aria-hidden="true" className="inline-block whitespace-nowrap" key={phrase}>
          {glyphs.map(({ accent, glyph, index }) => (
            <span
              className={cn("landing-tagline__char inline-block", accent && "text-accent-ink")}
              key={index}
              style={{ "--char-index": index } as CSSProperties}
            >
              {glyph}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

type HomeHeroProps = Readonly<{
  recommendableWorkCount: number;
  /** The sample taste the evidence stage shows, with its lead reasons by work ID. */
  sample: LandingSample;
  reasons: ReadonlyMap<string, SampleReason>;
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverVisible(workId: string): void;
  /** `?landing=1`: a write-free bypass, so the hero reads and writes no storage. */
  storageFree?: boolean;
  visitor?: LandingVisitorState;
  sharedEntry?: boolean;
}>;

/**
 * The hero, made of the product's own materials (03 §1 「근거 무대」): the wordmark, the tagline,
 * one sentence and the single action on the left; on the right the evidence stage, a sample taste
 * with the reason the engine gave and the cover it led to. On narrow screens it stacks as wordmark,
 * tagline, stage, then the action, and drops the sentence.
 */
export function HomeHero({
  coverUrls,
  onCoverVisible,
  reasons,
  recommendableWorkCount,
  sample,
  sharedEntry = false,
  storageFree = false,
  visitor = "new",
}: HomeHeroProps) {
  return (
    <section aria-labelledby="landing-title" className="landing-hero">
      {/* Home has no app header, so the accent selector shares the wordmark's row (03 §1). */}
      <div className="landing-hero__masthead">
        <Link
          aria-current="page"
          aria-label={navigationStrings.brandLinkLabel}
          className="landing-hero__brand inline-flex min-h-[var(--control-min-size)] w-fit items-center [--landing-logo-size:var(--font-size-32)]"
          preload={false}
          search={{ landing: "1" }}
          to="/"
        >
          <LandingLogoReveal staticPresentation={storageFree} />
        </Link>
        <AccentControl />
      </div>
      <div className="landing-hero__title">
        {sharedEntry ? (
          <p className="mb-[var(--space-2)] text-[length:var(--font-size-14)] font-bold text-text">
            {landingStrings.sharedEntry}
          </p>
        ) : null}
        <HeroTagline />
      </div>
      <p className="landing-hero__description text-[length:var(--text-body-size)] leading-[var(--line-height-body)] text-text [word-break:auto-phrase] [text-wrap:balance]">
        {landingStrings.hero.description}
      </p>
      <HomeEvidenceStage
        className="landing-hero__stage"
        coverUrls={coverUrls}
        onCoverVisible={onCoverVisible}
        reasons={reasons}
        sample={sample}
      />
      <div className="landing-hero__action grid justify-items-start gap-[var(--space-2)]">
        <LandingCta className="w-full justify-center sm:w-fit" visitor={visitor} />
        {visitor === "new" ? null : (
          <p className="text-[length:var(--text-caption-size)] leading-[1.5] text-text-muted">
            {landingStrings.visitorNote[visitor]}
          </p>
        )}
        <p className="text-[length:var(--text-caption-size)] leading-[1.5] text-text-muted [word-break:auto-phrase] [text-wrap:balance]">
          {landingStrings.hero.trust(workCountFormat.format(recommendableWorkCount)).join(" · ")}
        </p>
      </div>
    </section>
  );
}
