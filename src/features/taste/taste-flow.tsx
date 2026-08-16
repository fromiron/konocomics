"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { usePageEntryMotion } from "@/components/motion/use-page-entry-motion";
import { NARRATIVE_AXIS_IDS, TONE_AXIS_IDS, ART_AXIS_IDS } from "@/domain/catalog/constants";
import type { AxisId, ThemeTag, Work } from "@/domain/catalog/types";
import type { ExplanationFactorId } from "@/domain/explanation";
import { hasCatalogBackedProfile } from "@/domain/profile/catalog-profile";
import {
  summarizeMangaDna,
  type DnaPreference,
  type DnaTopPreference,
} from "@/domain/profile/dna-summary";
import { calculateProfileConfidence, getConfidenceLevel } from "@/domain/profile/confidence";
import type {
  AdjustmentPreference,
  ProfileAdjustments,
  UserWorkRecord,
} from "@/domain/profile/types";
import { useCatalog } from "@/features/catalog/catalog-provider";
import {
  createRecommendationCoverTargets,
  useRecommendationCovers,
} from "@/features/recommendations/recommendation-cover-resolver";
import { usePersistence } from "@/infrastructure/db";
import { tasteStrings, explanationLexicon } from "@/lib/strings";

import { AdjustmentRadiogroup } from "./adjustment-radiogroup";
import { FactorBar } from "./factor-bar";

const DNA_REVEAL_MARKER = "konocomics:manga-dna-reveal:v1";
const EMPTY_RECORDS: readonly UserWorkRecord[] = [];
const EMPTY_ADJUSTMENTS: ProfileAdjustments = { axes: {}, themes: {} };
const NARRATIVE_IDS = new Set<AxisId>(NARRATIVE_AXIS_IDS);
const TONE_IDS = new Set<AxisId>(TONE_AXIS_IDS);
const ART_IDS = new Set<AxisId>(ART_AXIS_IDS);

type RevealExperience = Readonly<{
  entry: boolean;
  animate: boolean;
}>;

type RevealClaim = "claimed" | "consumed" | "unavailable";

function useLiveReducedMotion() {
  const initialPreference = useReducedMotion();
  const [livePreference, setLivePreference] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (typeof mediaQuery.addEventListener !== "function") return;
    const handleChange = (event: MediaQueryListEvent) => setLivePreference(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return livePreference ?? initialPreference;
}

function factorLabel(factorId: ExplanationFactorId) {
  return explanationLexicon.factorLabels[factorId];
}

function removeRevealParameter() {
  const url = new URL(window.location.href);
  url.searchParams.delete("reveal");
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
}

function claimDnaReveal(completionIdentity: string): RevealClaim {
  try {
    if (window.sessionStorage.getItem(DNA_REVEAL_MARKER) === completionIdentity) {
      return "consumed";
    }
    window.sessionStorage.setItem(DNA_REVEAL_MARKER, completionIdentity);
    return window.sessionStorage.getItem(DNA_REVEAL_MARKER) === completionIdentity
      ? "claimed"
      : "unavailable";
  } catch {
    return "unavailable";
  }
}

function positiveAnchorWorks(
  records: readonly UserWorkRecord[],
  worksById: ReadonlyMap<string, Work>,
) {
  const seen = new Set<string>();
  return records.flatMap((record): Work[] => {
    if (
      (record.reaction !== "favorite" && record.reaction !== "liked") ||
      seen.has(record.workId)
    ) {
      return [];
    }
    const work = worksById.get(record.workId);
    if (work === undefined) {
      return [];
    }
    seen.add(record.workId);
    return [work];
  });
}

function AnchorStrip({
  anchors,
  animateReveal,
  coverUrls,
  onCoverSettled,
}: Readonly<{
  anchors: Work[];
  animateReveal: boolean;
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverSettled(workId: string): void;
}>) {
  const content = (
    <>
      <h2 className="visually-hidden" id="taste-anchor-heading">
        {tasteStrings.anchorsHeading}
      </h2>
      <ul>
        {anchors.map((work) => (
          <li key={work.id}>
            <CoverImage
              className="taste-anchor-cover"
              coverUrl={coverUrls.get(work.id)}
              creators={work.creators}
              decorative
              onSettled={() => onCoverSettled(work.id)}
              requestedSize={200}
              title={work.title}
            />
            <span className="visually-hidden">{work.title}</span>
          </li>
        ))}
      </ul>
    </>
  );

  return animateReveal ? (
    <m.section
      animate={{ opacity: 1 }}
      aria-labelledby="taste-anchor-heading"
      className="taste-anchor-strip"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
    >
      {content}
    </m.section>
  ) : (
    <section aria-labelledby="taste-anchor-heading" className="taste-anchor-strip">
      {content}
    </section>
  );
}

type TopPreferenceCardProps = Readonly<{
  preference: DnaTopPreference;
  worksById: ReadonlyMap<string, Work>;
  index: number;
  animateReveal: boolean;
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverSettled(workId: string): void;
}>;

function TopPreferenceCard({
  preference,
  worksById,
  index,
  animateReveal,
  coverUrls,
  onCoverSettled,
}: TopPreferenceCardProps) {
  const evidenceWorks = preference.anchorWorkIds.flatMap((workId): Work[] => {
    const work = worksById.get(workId);
    return work === undefined ? [] : [work];
  });
  const label = factorLabel(preference.factorId);

  const content = (
    <>
      <h3 className={animateReveal ? "taste-top-card__label--reveal" : undefined}>{label}</h3>
      <ul aria-hidden="true">
        {evidenceWorks.map((work) => (
          <li key={work.id}>
            <CoverImage
              className="taste-evidence-cover"
              coverUrl={coverUrls.get(work.id)}
              creators={work.creators}
              decorative
              onSettled={() => onCoverSettled(work.id)}
              requestedSize={200}
              title={work.title}
            />
          </li>
        ))}
      </ul>
      <p>{tasteStrings.topPreferenceEvidence(evidenceWorks.map((work) => work.title))}</p>
    </>
  );

  return animateReveal ? (
    <m.article
      animate={{ opacity: 1, y: 0 }}
      className="taste-top-card surface-card"
      initial={{ opacity: 0, y: 8 }}
      transition={{ delay: 0.5 + index * 0.18, duration: 0.4, ease: [0.2, 0, 0, 1] }}
    >
      {content}
    </m.article>
  ) : (
    <article className="taste-top-card surface-card">{content}</article>
  );
}

type FactorGroupProps<FactorId extends ExplanationFactorId> = Readonly<{
  id: string;
  highlightPrefix?: "axis" | "theme";
  title: string;
  preferences: readonly DnaPreference<FactorId>[];
  animateReveal: boolean;
  factorRevealReady: boolean;
  adjustmentValues?: Partial<Record<FactorId, AdjustmentPreference>>;
  onAdjustment?: (factorId: FactorId, preference: AdjustmentPreference) => void;
  highlightedFactor: string | null;
}>;

function FactorGroup<FactorId extends ExplanationFactorId>({
  id,
  highlightPrefix,
  title,
  preferences,
  animateReveal,
  factorRevealReady,
  adjustmentValues,
  onAdjustment,
  highlightedFactor,
}: FactorGroupProps<FactorId>) {
  return (
    <section className="taste-factor-group surface-card" aria-labelledby={`taste-group-${id}`}>
      <h2 id={`taste-group-${id}`}>{title}</h2>
      <div className="taste-factor-group__rows">
        {preferences.map((preference, index) => {
          const label = factorLabel(preference.factorId);
          return (
            <div className="taste-factor-row" key={preference.factorId}>
              <FactorBar
                animateReveal={animateReveal}
                revealReady={factorRevealReady}
                highlighted={highlightedFactor === `${highlightPrefix}:${preference.factorId}`}
                label={label}
                revealDelay={index * 0.06}
                state={preference.state}
                value={preference.value}
              />
              {adjustmentValues === undefined || onAdjustment === undefined ? null : (
                <AdjustmentRadiogroup
                  factorId={`${id}-${preference.factorId}`}
                  factorLabel={label}
                  onChange={(value) => onAdjustment(preference.factorId, value)}
                  value={adjustmentValues[preference.factorId] ?? "auto"}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

type NegativeSummaryProps = Readonly<{
  records: readonly UserWorkRecord[];
  worksById: ReadonlyMap<string, Work>;
}>;

function NegativeSummary({ records, worksById }: NegativeSummaryProps) {
  const items = records.flatMap((record) => {
    const work = worksById.get(record.workId);
    if (
      work === undefined ||
      (record.reaction !== "disliked" && record.readingState !== "dropped")
    ) {
      return [];
    }
    return [{ record, work }];
  });

  return items.length === 0 ? null : (
    <section className="taste-negative-summary" aria-labelledby="taste-negative-heading">
      <h2 id="taste-negative-heading">{tasteStrings.negativeHeading}</h2>
      <ul>
        {items.map(({ record, work }) => (
          <li key={work.id}>
            <span>{work.title}</span>
            <span>
              {record.readingState === "dropped"
                ? tasteStrings.negativeDropped
                : tasteStrings.negativeDisliked}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TasteFlow() {
  const searchParams = useSearchParams();
  const reducedMotion = useLiveReducedMotion();
  const catalog = useCatalog();
  const {
    adjustments: storedAdjustments,
    getProviderCache,
    onboardingCompletedAt,
    saveProviderCache,
    saveProfileAdjustments,
    status,
    userWorks,
  } = usePersistence();
  const [revealExperience, setRevealExperience] = useState<RevealExperience | null>(null);
  const [factorRevealReady, setFactorRevealReady] = useState(false);
  const [localAdjustments, setLocalAdjustments] = useState<ProfileAdjustments | null>(null);
  const [highlightedFactor, setHighlightedFactor] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const highlightTimer = useRef<number | null>(null);
  const messageTimer = useRef<number | null>(null);
  const saveSequence = useRef(0);
  const revealDecision = useRef<RevealExperience | null>(null);
  const revealQueryConsumedRef = useRef(false);
  const [revealRequestedAtMount] = useState(() => searchParams.get("reveal") === "1");
  const revealRequestedAtMountRef = useRef(revealRequestedAtMount);
  const pageEntryMotion = usePageEntryMotion({
    enabled: !revealRequestedAtMount,
    identity: "taste",
  });
  const records = userWorks ?? EMPTY_RECORDS;
  const adjustments = localAdjustments ?? storedAdjustments ?? EMPTY_ADJUSTMENTS;
  const worksById = useMemo(
    () => new Map(catalog.works.map((work) => [work.id, work] as const)),
    [catalog.works],
  );
  const catalogRecords = useMemo(
    () => records.filter((record) => worksById.has(record.workId)),
    [records, worksById],
  );
  const hasProfile = useMemo(
    () => hasCatalogBackedProfile(userWorks, catalog.works),
    [catalog.works, userWorks],
  );
  const summary = useMemo(
    () => summarizeMangaDna(catalog.works, catalogRecords),
    [catalog.works, catalogRecords],
  );
  const anchors = useMemo(
    () => positiveAnchorWorks(catalogRecords, worksById),
    [catalogRecords, worksById],
  );
  const coverTargets = useMemo(
    () => createRecommendationCoverTargets(catalog, anchors.map((work) => work.id)),
    [anchors, catalog],
  );
  const { coverUrls, notifyCoverSettled } = useRecommendationCovers({
    targets: coverTargets,
    getProviderCache,
    saveProviderCache,
  });
  const coverTargetsByWorkId = useMemo(
    () => new Map(coverTargets.map((target) => [target.workId, target] as const)),
    [coverTargets],
  );
  const handleCoverSettled = useCallback(
    (workId: string) => {
      const target = coverTargetsByWorkId.get(workId);
      if (target !== undefined) notifyCoverSettled(target);
    },
    [coverTargetsByWorkId, notifyCoverSettled],
  );
  const confidenceLevel = getConfidenceLevel(calculateProfileConfidence(catalogRecords));
  const narrative = summary.axes.filter((preference) => NARRATIVE_IDS.has(preference.factorId));
  const tone = summary.axes.filter((preference) => TONE_IDS.has(preference.factorId));
  const art = summary.axes.filter((preference) => ART_IDS.has(preference.factorId));

  useEffect(() => {
    if (!revealRequestedAtMountRef.current || revealQueryConsumedRef.current) return;

    revealQueryConsumedRef.current = true;
    removeRevealParameter();
  }, []);

  useEffect(() => {
    let active = true;
    const commitRevealExperience = (experience: RevealExperience) => {
      window.queueMicrotask(() => {
        if (active) setRevealExperience(experience);
      });
    };

    if (onboardingCompletedAt === undefined) {
      return () => {
        active = false;
      };
    }

    if (revealDecision.current === null && !revealRequestedAtMountRef.current) {
      revealDecision.current = { entry: false, animate: false };
    } else if (revealDecision.current === null) {
      const completionIdentity = onboardingCompletedAt ?? "legacy-profile";
      const claim = claimDnaReveal(completionIdentity);
      revealDecision.current =
        claim === "consumed"
          ? { entry: false, animate: false }
          : {
              entry: true,
              animate: claim === "claimed" && reducedMotion === false,
            };
    }

    let decision = revealDecision.current;
    if (decision.animate && reducedMotion !== false) {
      decision = { ...decision, animate: false };
      revealDecision.current = decision;
    }
    commitRevealExperience(decision);

    return () => {
      active = false;
    };
  }, [onboardingCompletedAt, reducedMotion]);

  useEffect(() => {
    if (revealExperience?.animate !== true) {
      return;
    }

    const timer = window.setTimeout(() => setFactorRevealReady(true), 1200);
    return () => window.clearTimeout(timer);
  }, [revealExperience?.animate]);

  useEffect(
    () => () => {
      if (highlightTimer.current !== null) window.clearTimeout(highlightTimer.current);
      if (messageTimer.current !== null) window.clearTimeout(messageTimer.current);
    },
    [],
  );

  const updateAdjustment = useCallback(
    (kind: "axis" | "theme", factorId: AxisId | ThemeTag, preference: AdjustmentPreference) => {
      const before = localAdjustments ?? storedAdjustments ?? EMPTY_ADJUSTMENTS;
      const next: ProfileAdjustments =
        kind === "axis"
          ? { ...before, axes: { ...before.axes, [factorId]: preference } }
          : { ...before, themes: { ...before.themes, [factorId]: preference } };
      const sequence = saveSequence.current + 1;
      saveSequence.current = sequence;
      setLocalAdjustments(next);
      setErrorMessage("");
      setHighlightedFactor(`${kind}:${factorId}`);
      if (highlightTimer.current !== null) window.clearTimeout(highlightTimer.current);
      highlightTimer.current = window.setTimeout(() => setHighlightedFactor(null), 600);

      void saveProfileAdjustments(next).then(
        () => {
          if (saveSequence.current !== sequence) return;
          setMessage(tasteStrings.adjustmentSaved);
          if (messageTimer.current !== null) window.clearTimeout(messageTimer.current);
          messageTimer.current = window.setTimeout(() => setMessage(""), 2400);
        },
        () => {
          if (saveSequence.current !== sequence) return;
          setLocalAdjustments(before);
          setErrorMessage(tasteStrings.saveError);
        },
      );
    },
    [localAdjustments, saveProfileAdjustments, storedAdjustments],
  );

  if (
    status.state === "initializing" ||
    onboardingCompletedAt === undefined ||
    userWorks === undefined ||
    storedAdjustments === undefined ||
    hasProfile !== true ||
    revealExperience === null
  ) {
    return (
      <main className="taste-page taste-page--loading">
        <p aria-live="polite">{tasteStrings.loading}</p>
      </main>
    );
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <main
        className={`taste-page${
          revealExperience.entry
            ? " taste-page--with-action"
            : pageEntryMotion.active
              ? " page-entry-b"
              : ""
        }`}
        onAnimationEnd={pageEntryMotion.onAnimationEnd}
      >
        <header className="taste-header">
          <div>
            <h1 className="font-display">{tasteStrings.title}</h1>
            <p>
              {tasteStrings.confidence}: {tasteStrings.confidenceLabels[confidenceLevel]}
            </p>
          </div>
          <AnchorStrip
            anchors={anchors}
            animateReveal={revealExperience.animate}
            coverUrls={coverUrls}
            onCoverSettled={handleCoverSettled}
          />
        </header>

        {status.state === "degraded" ? (
          <p className="taste-alert" role="status">
            {tasteStrings.storageWarning}
          </p>
        ) : null}
        {errorMessage ? (
          <p className="taste-alert" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <section className="taste-top-summary screentone" aria-labelledby="taste-top-heading">
          <h2 id="taste-top-heading">{tasteStrings.topPreferencesHeading}</h2>
          {summary.topPreferences.length === 0 ? (
            <p>{tasteStrings.topPreferencePending}</p>
          ) : (
            <div className="taste-top-summary__grid">
              {summary.topPreferences.map((preference, index) => (
                <TopPreferenceCard
                  animateReveal={revealExperience.animate}
                  coverUrls={coverUrls}
                  index={index}
                  key={`${preference.kind}:${preference.factorId}`}
                  preference={preference}
                  onCoverSettled={handleCoverSettled}
                  worksById={worksById}
                />
              ))}
            </div>
          )}
        </section>

        <div className="taste-factor-grid">
          <FactorGroup
            adjustmentValues={adjustments.themes}
            animateReveal={revealExperience.animate}
            factorRevealReady={factorRevealReady}
            highlightedFactor={highlightedFactor}
            highlightPrefix="theme"
            id="theme"
            onAdjustment={(factorId, value) => updateAdjustment("theme", factorId, value)}
            preferences={summary.themes}
            title={tasteStrings.groups.theme}
          />
          <FactorGroup
            adjustmentValues={adjustments.axes}
            animateReveal={revealExperience.animate}
            factorRevealReady={factorRevealReady}
            highlightedFactor={highlightedFactor}
            highlightPrefix="axis"
            id="narrative"
            onAdjustment={(factorId, value) => updateAdjustment("axis", factorId, value)}
            preferences={narrative}
            title={tasteStrings.groups.narrative}
          />
          <FactorGroup
            adjustmentValues={adjustments.axes}
            animateReveal={revealExperience.animate}
            factorRevealReady={factorRevealReady}
            highlightedFactor={highlightedFactor}
            highlightPrefix="axis"
            id="tone"
            onAdjustment={(factorId, value) => updateAdjustment("axis", factorId, value)}
            preferences={tone}
            title={tasteStrings.groups.tone}
          />
          <FactorGroup
            adjustmentValues={adjustments.axes}
            animateReveal={revealExperience.animate}
            factorRevealReady={factorRevealReady}
            highlightedFactor={highlightedFactor}
            highlightPrefix="axis"
            id="art"
            onAdjustment={(factorId, value) => updateAdjustment("axis", factorId, value)}
            preferences={art}
            title={tasteStrings.groups.art}
          />
          <FactorGroup
            animateReveal={revealExperience.animate}
            factorRevealReady={factorRevealReady}
            highlightedFactor={highlightedFactor}
            id="genre"
            preferences={summary.genres}
            title={tasteStrings.groups.genre}
          />
        </div>

        <NegativeSummary records={catalogRecords} worksById={worksById} />
        <Link className="taste-add-link interactive-press" href="/onboarding">
          {tasteStrings.addWorks}
        </Link>
        {revealExperience.entry ? (
          <div className="taste-reveal-cta">
            <Link className="interactive-press" href="/recommendations" prefetch={false}>
              {tasteStrings.recommendations}
            </Link>
          </div>
        ) : null}
        <p aria-atomic="true" aria-live="polite" className="taste-snackbar">
          {message}
        </p>
      </main>
    </LazyMotion>
  );
}
