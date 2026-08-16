"use client";

import type { ComponentType, ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";

import { BrandWordmark } from "@/components/nav/brand-wordmark";
import { landingStrings } from "@/lib/strings";

const LOGO_REVEAL_MARKER = "logoRevealed";
const LOGO_REVEAL_MARKER_VALUE = "1";
const SIGNATURE_DURATION_MS = 1_400;

type LogoRevealPhase = "complete" | "waiting-fonts" | "playing";
type LogoRevealDecision = "undecided" | "claimed" | "settled";

type LandingLogoRevealProps = Readonly<{
  staticPresentation?: boolean;
}>;

type MotionRendererProps = Readonly<{
  caption: ReactNode;
}>;

function claimLogoReveal(): "claimed" | "consumed" | "unavailable" {
  try {
    const storage = window.sessionStorage;
    const currentMarker = storage.getItem(LOGO_REVEAL_MARKER);

    if (currentMarker !== null) {
      return currentMarker === LOGO_REVEAL_MARKER_VALUE ? "consumed" : "unavailable";
    }

    storage.setItem(LOGO_REVEAL_MARKER, LOGO_REVEAL_MARKER_VALUE);
    return storage.getItem(LOGO_REVEAL_MARKER) === LOGO_REVEAL_MARKER_VALUE
      ? "claimed"
      : "unavailable";
  } catch {
    return "unavailable";
  }
}

export function LandingLogoReveal({ staticPresentation = false }: LandingLogoRevealProps) {
  const [phase, setPhase] = useState<LogoRevealPhase>("complete");
  const [MotionRenderer, setMotionRenderer] = useState<ComponentType<MotionRendererProps> | null>(
    null,
  );
  const decisionRef = useRef<LogoRevealDecision>("undecided");
  const finishedRef = useRef(false);

  /* eslint-disable react-hooks/set-state-in-effect -- Phase A is a progressive enhancement that must claim and settle before first paint. */
  useLayoutEffect(() => {
    if (staticPresentation) {
      decisionRef.current = "settled";
      finishedRef.current = true;
      // A same-mount switch to the explicit static route must finish before paint.
      setPhase("complete");
      return;
    }

    if (decisionRef.current === "undecided") {
      const claim = claimLogoReveal();
      decisionRef.current = claim === "claimed" ? "claimed" : "settled";
      finishedRef.current = claim !== "claimed";
    }

    if (decisionRef.current !== "claimed" || finishedRef.current) {
      return;
    }

    let active = true;
    let signatureTimer: number | undefined;
    let mediaQuery: MediaQueryList | undefined;
    let listenersAttached = false;

    const removeListeners = () => {
      if (!listenersAttached) return;

      listenersAttached = false;
      for (const eventType of [
        "pointerdown",
        "click",
        "keydown",
        "wheel",
        "scroll",
        "pagehide",
      ] as const) {
        try {
          window.removeEventListener(eventType, finish, true);
        } catch {
          // A partial browser API failure must still leave the final static presentation.
        }
      }
      try {
        mediaQuery?.removeEventListener("change", handleMotionPreferenceChange);
      } catch {
        // The presentation has already settled; cleanup remains best effort.
      }
    };

    const finishSignature = () => {
      if (!active || finishedRef.current) return;

      finishedRef.current = true;
      decisionRef.current = "settled";
      if (signatureTimer !== undefined) {
        window.clearTimeout(signatureTimer);
        signatureTimer = undefined;
      }
      removeListeners();
      setPhase("complete");
    };

    function finish() {
      finishSignature();
    }

    function handleMotionPreferenceChange(event: MediaQueryListEvent) {
      if (event.matches) finishSignature();
    }

    try {
      if (typeof window.matchMedia !== "function") {
        finishSignature();
        return;
      }

      mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (
        mediaQuery.matches !== false ||
        typeof mediaQuery.addEventListener !== "function" ||
        typeof mediaQuery.removeEventListener !== "function"
      ) {
        finishSignature();
        return;
      }

      listenersAttached = true;
      window.addEventListener("pointerdown", finish, { capture: true, passive: true });
      window.addEventListener("click", finish, { capture: true, passive: true });
      window.addEventListener("keydown", finish, true);
      window.addEventListener("wheel", finish, { capture: true, passive: true });
      window.addEventListener("scroll", finish, { capture: true, passive: true });
      window.addEventListener("pagehide", finish, true);
      mediaQuery.addEventListener("change", handleMotionPreferenceChange);

      // This pre-paint enhancement prevents the final caption from flashing before phase A.
      setPhase("waiting-fonts");

      const fontsReady = document.fonts?.ready;
      if (fontsReady === undefined || typeof fontsReady.then !== "function") {
        finishSignature();
        return;
      }

      void fontsReady.then(
        async () => {
          if (!active || finishedRef.current) return;
          try {
            const motionModule = await import("./landing-logo-reveal-motion");
            if (!active || finishedRef.current) return;
            setMotionRenderer(() => motionModule.LandingLogoRevealMotion);
            setPhase("playing");
            signatureTimer = window.setTimeout(finishSignature, SIGNATURE_DURATION_MS);
          } catch {
            finishSignature();
          }
        },
        () => finishSignature(),
      );
    } catch {
      finishSignature();
    }

    return () => {
      active = false;
      if (signatureTimer !== undefined) window.clearTimeout(signatureTimer);
      removeListeners();
    };
  }, [staticPresentation]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const motion = phase === "complete" ? "static" : "signature-a";
  const caption = (
    <>
      <span lang="ja">{landingStrings.logoCaption.japanese}</span>
      <span>{landingStrings.logoCaption.equation}</span>
    </>
  );
  const staticLayers = (
    <>
      <span className="landing-logo-reveal__mark">
        <BrandWordmark className="landing-logo-reveal__base" />
        <span className="landing-logo-reveal__monochrome">
          <BrandWordmark decorative />
        </span>
      </span>
      <span className="landing-logo-reveal__caption">{caption}</span>
    </>
  );

  return (
    <div className="landing-logo-reveal" data-motion={motion} data-phase={phase}>
      {phase === "playing" && MotionRenderer !== null ? (
        <MotionRenderer caption={caption} />
      ) : (
        staticLayers
      )}
    </div>
  );
}
