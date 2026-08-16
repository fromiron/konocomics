"use client";

import { AnimatePresence, domMax, LazyMotion, m, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import type { Work } from "@/domain/catalog/types";
import type { PositiveOnboardingEntry } from "@/domain/profile/onboarding";

type SelectedTrayProps = Readonly<{
  selections: readonly PositiveOnboardingEntry[];
  worksById: ReadonlyMap<string, Work>;
  label: string;
  emptyLabel: string;
  removeLabel: string;
  continueLabel: string;
  onRemove: (workId: string) => void;
  onContinue: () => void;
  disabled: boolean;
  limitActive: boolean;
  shakeKey: number;
}>;

export function SelectedTray({
  selections,
  worksById,
  label,
  emptyLabel,
  removeLabel,
  continueLabel,
  onRemove,
  onContinue,
  disabled,
  limitActive,
  shakeKey,
}: SelectedTrayProps) {
  const reducedMotion = useReducedMotion();
  const allowMotion = reducedMotion === false;
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  const trayRef = useRef<HTMLElement>(null);
  const pendingFocus = useRef<Readonly<{ workId: string }> | "tray" | null>(null);

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

  return (
    <LazyMotion features={domMax}>
      <aside
        aria-label={label}
        className={`selected-tray${
          limitActive ? ` selected-tray--limit-${String(shakeKey % 2)}` : ""
        }`}
        data-limit-active={limitActive ? "true" : undefined}
        ref={trayRef}
        tabIndex={-1}
      >
        <div className="selected-tray__works">
          {selections.length === 0 ? <p>{emptyLabel}</p> : null}
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
                  className="selected-tray__item"
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
                  <CoverImage creators={work.creators} requestedSize={200} title={work.title} />
                  <span aria-hidden="true" className="selected-tray__remove">
                    ×
                  </span>
                </m.button>
              );
            })}
          </AnimatePresence>
        </div>
        <button
          className="selected-tray__continue"
          disabled={disabled}
          onClick={onContinue}
          type="button"
        >
          {continueLabel}
        </button>
      </aside>
    </LazyMotion>
  );
}
