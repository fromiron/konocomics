"use client";

import { AnimatePresence, domMax, LazyMotion, m, useReducedMotion } from "motion/react";
import { ChevronUpIcon, PlusIcon, XIcon } from "lucide-react";
import { type RefObject, useEffect, useId, useRef, useState } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { Button } from "@/components/design-system/button";
import type { Work } from "@/domain/catalog/types";
import type { PositiveOnboardingEntry } from "@/domain/profile/onboarding";
import { onboardingStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

/**
 * Shared shell of the onboarding action panel: a fixed bottom bar on mobile and a sticky
 * side panel on desktop. STEP 1 and STEP 2 use the same frame so the primary action never moves.
 * On mobile the bar is only as tall as its content (03 §2, 2026-11-11 one-row tray).
 */
export const ONBOARDING_PANEL_CLASS =
  "fixed inset-x-0 bottom-0 z-20 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] content-center gap-x-[var(--space-3)] gap-y-[var(--space-2)] border-t border-line bg-surface-1 p-[var(--space-3)] px-[max(var(--layout-page-padding),calc((100vw-var(--layout-width-onboarding))/2+var(--layout-page-padding)))] pb-[calc(var(--space-3)+var(--layout-safe-area-bottom))] md:sticky md:top-[calc(var(--desktop-navigation-height)+var(--space-5))] md:right-auto md:bottom-auto md:left-auto md:max-h-[calc(100dvh-var(--desktop-navigation-height)-var(--space-5)*2)] md:grid-cols-1 md:content-start md:gap-[var(--space-content-loose)] md:overflow-y-auto md:rounded-[var(--radius-card)] md:border-0 md:p-[var(--space-5)]";

const PANEL_CLEARANCE_PROPERTY = "--layout-onboarding-tray-clearance";

/**
 * While the panel is fixed to the bottom of the screen, it publishes its own height as the
 * onboarding clearance token (04 §2.4), so the page's scroll end and `scroll-padding-bottom` match
 * it exactly and no control can rest underneath. The sticky desktop panel needs no clearance.
 */
export function useOnboardingPanelClearance(panelRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const panel = panelRef.current;
    if (panel === null || typeof ResizeObserver === "undefined") {
      return;
    }
    const root = document.documentElement;
    const publish = () => {
      if (getComputedStyle(panel).position === "fixed") {
        const height = Math.ceil(panel.getBoundingClientRect().height);
        root.style.setProperty(PANEL_CLEARANCE_PROPERTY, `${String(height)}px`);
      } else {
        root.style.removeProperty(PANEL_CLEARANCE_PROPERTY);
      }
    };
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(panel);
    return () => {
      observer.disconnect();
      root.style.removeProperty(PANEL_CLEARANCE_PROPERTY);
    };
  }, [panelRef]);
}

export type SelectedTrayClarity = Readonly<{
  label: string;
  levelLabel: string;
  hint?: string;
  /** Profile confidence in 0..1. Drawn as a fill only; never rendered as a number. */
  value: number;
  /** Stage index (0 = empty … CLARITY_STAGE_MAX) exposed to assistive tech instead of `value`. */
  stage: number;
}>;

export const CLARITY_STAGE_MAX = 3;

export type SelectedTrayGuide = Readonly<{
  title: string;
  steps: readonly string[];
}>;

/** 「DNAの鮮明さ」: a stage label and a fill only; the underlying value is never shown. */
export function ClarityMeter({
  className = "col-span-full",
  clarity,
}: Readonly<{ className?: string; clarity: SelectedTrayClarity }>) {
  const labelId = useId();

  return (
    <div className={cn("onboarding-clarity grid gap-[var(--space-1)]", className)}>
      <div className="hidden items-baseline justify-between gap-[var(--space-3)] text-[length:var(--text-caption-size)] md:flex">
        <span className="text-text-muted" id={labelId}>
          {clarity.label}
        </span>
        <span className="font-bold text-accent-ink">{clarity.levelLabel}</span>
      </div>
      <div
        aria-labelledby={labelId}
        aria-valuemax={CLARITY_STAGE_MAX}
        aria-valuemin={0}
        aria-valuenow={clarity.stage}
        aria-valuetext={
          clarity.hint === undefined ? clarity.levelLabel : `${clarity.levelLabel}。${clarity.hint}`
        }
        className="h-[var(--space-1)] overflow-hidden rounded-[var(--radius-pill)] bg-surface-3 md:h-[var(--space-2)]"
        role="meter"
      >
        <span
          className="block h-full rounded-[var(--radius-pill)] bg-accent transition-[width] duration-[var(--motion-duration-value)] motion-reduce:transition-none"
          style={{ width: `${String(Math.min(Math.max(clarity.value, 0), 1) * 100)}%` }}
        />
      </div>
      {clarity.hint === undefined ? null : (
        <p className="hidden text-[length:var(--text-caption-size)] text-text-muted md:block">
          {clarity.hint}
        </p>
      )}
    </div>
  );
}

type SelectedTrayProps = Readonly<{
  selections: readonly PositiveOnboardingEntry[];
  worksById: ReadonlyMap<string, Work>;
  label: string;
  emptyLabel: string;
  removeLabel: string;
  continueLabel: string;
  remainingLabel?: string;
  countLabel?: string;
  coverUrls?: ReadonlyMap<string, string | null>;
  onCoverVisible?: (workId: string) => void;
  onRemove: (workId: string) => void;
  onContinue: () => void;
  disabled: boolean;
  limitActive: boolean;
  shakeKey: number;
  clarity?: SelectedTrayClarity;
  guide?: SelectedTrayGuide;
  continueHint?: string;
  clearLabel?: string;
  onClear?: () => void;
}>;

export function SelectedTray({
  selections,
  worksById,
  label,
  emptyLabel,
  removeLabel,
  continueLabel,
  remainingLabel,
  countLabel,
  coverUrls,
  onCoverVisible,
  onRemove,
  onContinue,
  disabled,
  limitActive,
  shakeKey,
  clarity,
  guide,
  continueHint,
  clearLabel,
  onClear,
}: SelectedTrayProps) {
  const remainingId = useId();
  const worksId = useId();
  const reducedMotion = useReducedMotion();
  const allowMotion = reducedMotion === false;
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  const trayRef = useRef<HTMLElement>(null);
  const pendingFocus = useRef<Readonly<{ workId: string }> | "tray" | null>(null);
  // Mobile only: the selected thumbnails fold behind the count until it is pressed.
  const [worksOpen, setWorksOpen] = useState(false);
  const showWorks = worksOpen && selections.length > 0;
  useOnboardingPanelClearance(trayRef);

  useEffect(() => {
    const target = pendingFocus.current;
    if (target === null) {
      return;
    }
    pendingFocus.current = null;
    if (target === "tray") {
      trayRef.current?.focus();
      return;
    }
    itemRefs.current.get(target.workId)?.focus();
  }, [selections]);

  const removeSelection = (workId: string) => {
    const visibleWorkIds = selections.flatMap((selection) =>
      worksById.has(selection.workId) ? [selection.workId] : [],
    );
    const index = visibleWorkIds.indexOf(workId);
    const nextWorkId = visibleWorkIds[index + 1] ?? visibleWorkIds[index - 1];
    pendingFocus.current = nextWorkId === undefined ? "tray" : { workId: nextWorkId };
    onRemove(workId);
  };

  // Below `md` the compact cell also says what the reader needs next. While works are still
  // missing, the button's own description line ("あと N 作品") moves under the count; once the
  // minimum is met, the line under the count says how clear the DNA already is (sight-only: the
  // meter keeps its own value text).
  const compactStatus = remainingLabel ? undefined : clarity?.levelLabel;

  return (
    <LazyMotion features={domMax}>
      <aside
        aria-label={label}
        className={cn(
          "selected-tray",
          ONBOARDING_PANEL_CLASS,
          limitActive &&
            "border-2 border-warn motion-reduce:animate-none motion-reduce:transform-none",
          limitActive &&
            (shakeKey % 2 === 0
              ? "selected-tray--limit-0 motion-safe:animate-[selected-tray-limit-0_240ms_linear]"
              : "selected-tray--limit-1 motion-safe:animate-[selected-tray-limit-1_240ms_linear]"),
        )}
        data-limit-active={limitActive ? "true" : undefined}
        data-works-open={showWorks ? "true" : undefined}
        ref={trayRef}
        tabIndex={-1}
      >
        <div className="selected-tray__heading col-span-full flex items-baseline justify-between gap-[var(--space-4)] max-md:contents">
          <strong className="text-text-strong max-md:sr-only">{label}</strong>
          {countLabel === undefined ? null : (
            <span className="text-[length:var(--text-caption-size)] font-bold text-accent-ink max-md:col-start-1 max-md:row-start-1 max-md:self-start max-md:pe-[var(--space-6)] max-md:leading-[var(--space-4)]">
              {countLabel}
              {compactStatus === undefined ? null : (
                <span aria-hidden="true" className="block font-medium text-text-muted md:hidden">
                  {compactStatus}
                </span>
              )}
            </span>
          )}
        </div>
        {selections.length === 0 ? null : (
          <button
            aria-controls={worksId}
            aria-expanded={showWorks}
            aria-label={onboardingStrings.step1.showSelected}
            className="selected-tray__works-toggle z-10 col-start-1 row-start-1 flex min-h-[var(--control-min-size)] items-start justify-end rounded-[var(--radius-control)] bg-transparent p-0 text-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:hidden"
            onClick={() => setWorksOpen((open) => !open)}
            type="button"
          >
            <ChevronUpIcon
              aria-hidden="true"
              className={cn(
                "size-4 transition-transform duration-[var(--motion-duration-value)] motion-reduce:transition-none",
                showWorks && "rotate-180",
              )}
            />
          </button>
        )}
        {clarity === undefined ? null : (
          <ClarityMeter
            className="col-span-full max-md:pointer-events-none max-md:col-span-1 max-md:col-start-1 max-md:row-start-1 max-md:self-end"
            clarity={clarity}
          />
        )}
        {guide === undefined || selections.length > 0 ? null : (
          <div className="selected-tray__guide col-span-full hidden border-t border-line pt-[var(--space-4)] text-[length:var(--text-caption-size)] leading-[1.8] text-text-muted md:block">
            <strong className="text-text-strong">{guide.title}</strong>
            <ol className="m-0 mt-[var(--space-1)] list-decimal ps-[var(--space-5)]">
              {guide.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
        <div
          className={cn(
            "selected-tray__works col-span-full flex min-h-[calc(var(--space-7)*2)] min-w-0 flex-auto items-center gap-[var(--space-content)] overflow-x-auto [scrollbar-width:none] md:min-h-[calc(var(--space-8)*2+var(--space-1))] pt-[var(--space-1)] md:flex-wrap md:overflow-visible [&::-webkit-scrollbar]:hidden",
            "max-md:row-start-2",
            !showWorks && "max-md:hidden",
            selections.length === 0 && "overflow-x-hidden",
            selections.length === 0 && guide !== undefined && "md:hidden",
          )}
          id={worksId}
        >
          {selections.length === 0 ? (
            <p className="whitespace-normal text-text-muted">{emptyLabel}</p>
          ) : null}
          <AnimatePresence initial={false}>
            {selections.map((selection) => {
              const work = worksById.get(selection.workId);
              if (work === undefined) {
                return null;
              }

              return (
                <m.button
                  animate={{ opacity: 1, scale: 1 }}
                  aria-label={`${work.title} — ${removeLabel}`}
                  className="selected-tray__item relative min-h-[60px] w-12 min-w-12 overflow-visible rounded-[var(--radius-cover)] border-0 bg-transparent p-0"
                  exit={{ opacity: allowMotion ? 0 : 1, scale: allowMotion ? 0.92 : 1 }}
                  initial={{ opacity: allowMotion ? 0 : 1, scale: allowMotion ? 0.92 : 1 }}
                  key={work.id}
                  layout={allowMotion}
                  onClick={() => removeSelection(work.id)}
                  ref={(node) => {
                    if (node === null) {
                      itemRefs.current.delete(work.id);
                    } else {
                      itemRefs.current.set(work.id, node);
                    }
                  }}
                  transition={
                    allowMotion
                      ? {
                          layout: { damping: 32, stiffness: 350, type: "spring" },
                          opacity: { duration: 0.2 },
                          scale: { duration: 0.2 },
                        }
                      : { duration: 0 }
                  }
                  type="button"
                >
                  <CoverImage
                    coverUrl={coverUrls?.get(work.id)}
                    creators={work.creators}
                    onVisible={() => onCoverVisible?.(work.id)}
                    requestedSize={200}
                    title={work.title}
                  />
                  <span
                    aria-hidden="true"
                    className="selected-tray__remove absolute -top-1 -right-1 grid size-7 place-items-center rounded-full border-0 bg-surface-3 font-bold text-text-strong [&>svg]:size-4"
                  >
                    <XIcon />
                  </span>
                </m.button>
              );
            })}
          </AnimatePresence>
          {selections.length > 0 && selections.length < 10 ? (
            <span
              aria-hidden="true"
              className="selected-tray__empty-slot grid min-h-[60px] w-12 min-w-12 place-items-center rounded-[var(--radius-cover)] bg-surface-2 text-text-muted [&>svg]:size-4"
            >
              <PlusIcon />
            </span>
          ) : null}
        </div>
        <div className="grid content-center gap-[var(--space-content-tight)] max-md:contents">
          {remainingLabel ? (
            <p
              className="text-center text-[length:var(--text-caption-size)] text-text-muted max-md:col-start-1 max-md:row-start-1 max-md:self-start max-md:pt-[var(--space-4)] max-md:pe-[var(--space-6)] max-md:text-start max-md:leading-[var(--space-4)]"
              id={remainingId}
            >
              {remainingLabel}
            </p>
          ) : null}
          <Button
            aria-describedby={remainingLabel ? remainingId : undefined}
            className="selected-tray__continue min-w-32 max-md:col-start-2 max-md:row-start-1 max-md:self-center md:w-full md:min-w-0"
            disabled={disabled || selections.length === 0}
            onClick={onContinue}
            type="button"
          >
            {continueLabel}
          </Button>
          {continueHint === undefined ? null : (
            <p className="selected-tray__continue-hint hidden text-center text-[length:var(--text-caption-size)] text-text-muted md:block">
              {continueHint}
            </p>
          )}
          {onClear === undefined || clearLabel === undefined || selections.length === 0 ? null : (
            <button
              className="selected-tray__clear hidden min-h-[var(--control-min-size)] justify-self-center bg-transparent px-[var(--space-2)] text-[length:var(--text-caption-size)] text-text-muted underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50 md:block [@media(hover:hover)_and_(pointer:fine)]:hover:text-warn"
              disabled={disabled}
              onClick={() => {
                pendingFocus.current = "tray";
                onClear();
              }}
              type="button"
            >
              {clearLabel}
            </button>
          )}
        </div>
      </aside>
    </LazyMotion>
  );
}
