import { ChevronDownIcon } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/components/design-system/button";
import { FactorBar } from "@/components/media/factor-bar";
import { ART_AXIS_IDS, NARRATIVE_AXIS_IDS, TONE_AXIS_IDS } from "@/domain/catalog/constants";
import type { AxisId, Work } from "@/domain/catalog/types";
import type { MangaDnaSummary } from "@/domain/profile/dna-summary";
import { type OverlapLevel, workTasteOverlap } from "@/domain/profile/work-taste-overlap";
import { explanationLexicon, tasteStrings, workDetailStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

const TRAIT_GROUPS = [
  ["narrative", NARRATIVE_AXIS_IDS],
  ["tone", TONE_AXIS_IDS],
  ["art", ART_AXIS_IDS],
] as const satisfies readonly (readonly [string, readonly AxisId[]])[];

const LEVELS: readonly OverlapLevel[] = [0, 1, 2, 3, 4];

/** Five quiet steps beside the level word; the word carries the meaning for assistive tech. */
function OverlapSteps({ level }: Readonly<{ level: OverlapLevel }>) {
  return (
    <span aria-hidden="true" className="flex gap-[var(--space-1)] pb-[var(--space-1)]">
      {LEVELS.map((step) => (
        <span
          className={cn(
            "block h-1.5 w-[var(--space-5)] rounded-full",
            step <= level ? "bg-accent" : "bg-surface-3",
          )}
          key={step}
        />
      ))}
    </span>
  );
}

/**
 * 「この作品の傾向」: a one-glance summary, then the full per-axis bars on demand. With a Manga DNA,
 * the summary is a qualitative overlap level and the axes behind it; without one, the work's own
 * strongest traits. Only confirmed values are shown; an unknown axis never turns into zero.
 */
export function WorkTraits({
  tasteAxes,
  tasteReady,
  work,
}: Readonly<{
  tasteAxes: MangaDnaSummary["axes"] | null;
  /** False while saved records load, so a profile-less summary never flashes before the real one. */
  tasteReady: boolean;
  work: Work;
}>) {
  const strings = workDetailStrings.traits;
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  const tasteById = new Map<AxisId, number>(
    (tasteAxes ?? []).flatMap((preference) =>
      preference.state === "known" && preference.value !== null
        ? [[preference.factorId, preference.value] as const]
        : [],
    ),
  );
  const groups = TRAIT_GROUPS.flatMap(([group, ids]) => {
    const known = ids.filter((id) => work.axes[id].state === "known");
    return known.length === 0 ? [] : [{ group, ids: known }];
  });
  if (groups.length === 0) return null;

  const label = (axisId: AxisId) => explanationLexicon.factorLabels[axisId];
  const overlap = workTasteOverlap(work, tasteById);
  const standout = groups
    .flatMap(({ ids }) => ids)
    .flatMap((axisId) => {
      const factor = work.axes[axisId];
      return factor.state === "known" && factor.value >= 4 ? [axisId] : [];
    })
    .slice(0, 3);
  const hasComparison = groups.some(({ ids }) => ids.some((id) => tasteById.has(id)));
  const columns =
    groups.length === 3 ? "md:grid-cols-3" : groups.length === 2 ? "md:grid-cols-2" : "";

  return (
    <section aria-labelledby="work-traits-heading" className="grid gap-[var(--space-4)]">
      <h2
        className="text-[length:var(--text-subheading-size)] font-bold text-text-strong"
        id="work-traits-heading"
      >
        {strings.heading}
      </h2>
      <div className="grid gap-[var(--space-4)] rounded-[var(--radius-card)] bg-surface-1 p-[var(--space-5)] md:p-[var(--space-6)]">
        {!tasteReady ? null : overlap === null ? (
          standout.length === 0 ? null : (
            <div className="grid gap-[var(--space-2)]">
              <p className="text-[length:var(--text-caption-size)] text-text-muted">
                {strings.standout.caption}
              </p>
              <p className="text-[length:var(--font-size-16)] leading-[var(--line-height-body)] text-text-strong">
                {strings.standout.strong(standout.map(label))}
              </p>
            </div>
          )
        ) : (
          <div className="grid gap-[var(--space-2)]">
            <p className="text-[length:var(--text-caption-size)] text-text-muted">
              {strings.overlap.caption}
            </p>
            <div className="flex flex-wrap items-end gap-x-[var(--space-5)] gap-y-[var(--space-2)]">
              <p className="font-display text-[length:var(--font-size-28)] leading-none font-bold text-text-strong">
                {strings.overlap.levels[overlap.level]}
              </p>
              <OverlapSteps level={overlap.level} />
            </div>
            <div className="grid gap-[var(--space-1)] pt-[var(--space-1)] text-[length:var(--font-size-14)] leading-[var(--line-height-body)]">
              {overlap.closeAxes.length === 0 ? null : (
                <p className="text-text">{strings.overlap.close(overlap.closeAxes.map(label))}</p>
              )}
              {overlap.apart === null ? null : (
                <p className="text-text-muted">
                  {strings.overlap.apart(label(overlap.apart.axisId), overlap.apart.direction)}
                </p>
              )}
              <p className="text-[length:var(--text-caption-size)] text-text-muted">
                {strings.overlap.basis(overlap.sharedAxisCount)}
              </p>
            </div>
          </div>
        )}
        <Button
          aria-controls={detailsId}
          aria-expanded={expanded}
          className="w-fit gap-[var(--space-2)] px-[var(--space-3)]"
          onClick={() => setExpanded((current) => !current)}
          type="button"
          variant="ghost"
        >
          {expanded ? strings.collapse : strings.expand}
          <ChevronDownIcon
            aria-hidden="true"
            className={cn(
              "size-4 transition-transform duration-[var(--motion-duration-feedback)] motion-reduce:transition-none",
              expanded && "rotate-180",
            )}
          />
        </Button>
        <div className="grid gap-[var(--space-4)]" hidden={!expanded} id={detailsId}>
          <div className="flex flex-wrap items-end justify-between gap-[var(--space-3)]">
            <p className="text-[length:var(--font-size-14)] text-text-muted">
              {strings.description}
            </p>
            {!hasComparison ? null : (
              <p
                aria-hidden="true"
                className="flex items-center gap-[var(--space-4)] text-[length:var(--text-caption-size)] text-text-muted"
              >
                <span className="inline-flex items-center gap-[var(--space-2)]">
                  <span className="block h-1.5 w-4 rounded-full bg-accent" />
                  {strings.legendWork}
                </span>
                <span className="inline-flex items-center gap-[var(--space-2)]">
                  <span className="block h-3 w-0.5 rounded-full bg-text-strong" />
                  {strings.legendTaste}
                </span>
              </p>
            )}
          </div>
          <div className={`grid gap-[var(--space-6)] ${columns}`}>
            {groups.map(({ group, ids }) => (
              <section
                aria-labelledby={`work-traits-${group}`}
                className="grid content-start gap-[var(--space-3)]"
                key={group}
              >
                <h3
                  className="text-[length:var(--font-size-16)] font-bold text-text-strong"
                  id={`work-traits-${group}`}
                >
                  {strings.groups[group]}
                </h3>
                <ul className="m-0 grid list-none gap-[var(--space-3)] p-0">
                  {ids.map((id) => {
                    const factor = work.axes[id];
                    if (factor.state !== "known") return null;
                    const tasteValue = tasteById.get(id);
                    return (
                      <li key={id}>
                        <FactorBar
                          animateReveal={false}
                          label={label(id)}
                          reference={
                            tasteValue === undefined
                              ? undefined
                              : {
                                  label: strings.tasteReference(
                                    tasteStrings.factorValue(tasteValue),
                                  ),
                                  value: tasteValue,
                                }
                          }
                          revealReady
                          state="known"
                          value={factor.value}
                        />
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
