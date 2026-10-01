import { FactorBar } from "@/components/media/factor-bar";
import { ART_AXIS_IDS, NARRATIVE_AXIS_IDS, TONE_AXIS_IDS } from "@/domain/catalog/constants";
import type { AxisId, Work } from "@/domain/catalog/types";
import type { MangaDnaSummary } from "@/domain/profile/dna-summary";
import { explanationLexicon, tasteStrings, workDetailStrings } from "@/lib/strings";

const TRAIT_GROUPS = [
  ["narrative", NARRATIVE_AXIS_IDS],
  ["tone", TONE_AXIS_IDS],
  ["art", ART_AXIS_IDS],
] as const satisfies readonly (readonly [string, readonly AxisId[]])[];

/** Only confirmed values are shown; omitting an unknown axis never turns it into zero. */
export function WorkTraits({
  tasteAxes,
  work,
}: Readonly<{
  tasteAxes: MangaDnaSummary["axes"] | null;
  work: Work;
}>) {
  const strings = workDetailStrings.traits;
  const tasteById = new Map(
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
  const hasComparison = groups.some(({ ids }) => ids.some((id) => tasteById.has(id)));
  const columns =
    groups.length === 3 ? "md:grid-cols-3" : groups.length === 2 ? "md:grid-cols-2" : "";
  return (
    <section aria-labelledby="work-traits-heading" className="grid gap-[var(--space-4)]">
      <div className="flex flex-wrap items-end justify-between gap-[var(--space-3)]">
        <div className="grid gap-[var(--space-1)]">
          <h2
            className="text-[length:var(--text-subheading-size)] font-bold text-text-strong"
            id="work-traits-heading"
          >
            {strings.heading}
          </h2>
          <p className="text-[length:var(--font-size-14)] text-text-muted">{strings.description}</p>
        </div>
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
      <div
        className={`grid gap-[var(--space-6)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-5)] ${columns}`}
      >
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
                      label={explanationLexicon.factorLabels[id]}
                      reference={
                        tasteValue === undefined
                          ? undefined
                          : {
                              label: strings.tasteReference(tasteStrings.factorValue(tasteValue)),
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
    </section>
  );
}
