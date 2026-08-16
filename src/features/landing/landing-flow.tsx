"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { BrandWordmark } from "@/components/nav/brand-wordmark";
import type { Work } from "@/domain/catalog/types";
import { hasCatalogBackedProfileById } from "@/domain/profile/catalog-profile";
import { useCatalogIdentity } from "@/features/catalog/catalog-provider";
import { usePersistence } from "@/infrastructure/db";
import { landingStrings } from "@/lib/strings";

import { LandingLogoReveal } from "./landing-logo-reveal";

const HERO_COVER_COUNT = 4;
type LandingHeroWork = Pick<Work, "id" | "title" | "creators">;

function LandingGuard() {
  return (
    <main className="landing-guard" data-landing-state="checking">
      <BrandWordmark className="landing-guard__wordmark" />
    </main>
  );
}

function CoverFan({
  works,
  variant,
}: Readonly<{ works: readonly LandingHeroWork[]; variant: "hero" | "step" }>) {
  return (
    <div aria-hidden="true" className={`landing-cover-fan landing-cover-fan--${variant}`}>
      {works.map((work, index) => (
        <CoverImage
          className="landing-cover-fan__cover"
          creators={work.creators}
          decorative
          key={work.id}
          priority={variant === "hero" && index === 0}
          requestedSize={variant === "hero" ? 400 : 200}
          title={work.title}
        />
      ))}
    </div>
  );
}

function DnaIllustration() {
  return (
    <div aria-hidden="true" className="landing-step-illustration landing-step-illustration--dna">
      <span>{landingStrings.illustration.dna}</span>
      <i />
      <i />
      <i />
    </div>
  );
}

function ReasonIllustration() {
  return (
    <div aria-hidden="true" className="landing-step-illustration landing-step-illustration--reason">
      <span>{landingStrings.illustration.reason}</span>
      <i />
      <i />
    </div>
  );
}

type LandingFlowProps = Readonly<{
  heroWorks: readonly LandingHeroWork[];
}>;

export function LandingFlow({ heroWorks }: LandingFlowProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catalogIdentity = useCatalogIdentity();
  const { userWorks } = usePersistence();
  const showIntroduction = searchParams.get("landing") === "1";
  const hasProfile = useMemo(
    () => hasCatalogBackedProfileById(userWorks, catalogIdentity.workIds),
    [catalogIdentity.workIds, userWorks],
  );

  useEffect(() => {
    if (!showIntroduction && hasProfile === true) {
      router.replace("/recommendations");
    }
  }, [hasProfile, router, showIntroduction]);

  if (!showIntroduction && hasProfile !== false) {
    return <LandingGuard />;
  }

  return (
    <main className="landing-page" data-landing-state="introduction">
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-hero__copy">
          <LandingLogoReveal staticPresentation={showIntroduction} />
          <h1 id="landing-title">{landingStrings.tagline}</h1>
          <div className="landing-hero__description">
            {landingStrings.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Link className="landing-hero__cta interactive-press" href="/onboarding" prefetch={false}>
            {landingStrings.cta}
          </Link>
        </div>
        <CoverFan variant="hero" works={heroWorks.slice(0, HERO_COVER_COUNT)} />
      </section>

      <section className="landing-steps" aria-labelledby="landing-steps-title">
        <h2 id="landing-steps-title">{landingStrings.stepsHeading}</h2>
        <ol>
          {landingStrings.steps.map((step, index) => (
            <li key={step.title}>
              <span className="landing-step__number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              {index === 0 ? <CoverFan variant="step" works={heroWorks.slice(0, 3)} /> : null}
              {index === 1 ? <DnaIllustration /> : null}
              {index === 2 ? <ReasonIllustration /> : null}
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <footer className="landing-footer">
        <p>{landingStrings.footer.credit}</p>
        <p>{landingStrings.footer.storage}</p>
        <Link className="landing-footer__settings" href="/settings" prefetch={false}>
          {landingStrings.footer.settings}
        </Link>
      </footer>
    </main>
  );
}
