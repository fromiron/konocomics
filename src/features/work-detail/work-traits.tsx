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

/** Below this many confirmed axes the profile is too sparse to read at a glance. */
const MIN_KNOWN_AXES = 3;

/**
 * The work's axis profile as read-only meters, optionally overlaid with the viewer's Manga DNA.
 * Unconfirmed axes are named as such and never drawn as zero.
 */
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
  const knownCount = TRAIT_GROUPS.flatMap(([, ids]) => ids).filter(
    (id) => work.axes[id].state === "known",
  ).length;
  const readable = knownCount >= MIN_KNOWN_AXES;

  return (
    <section aria-labelledby="work-traits-heading" className="grid gap-[var(--space-4)]">
      <div className="flex flex-wrap items-end justify-between gap-x-[var(--space-6)] gap-y-[var(--space-2)]">
        <div className="grid gap-[var(--space-1)]">
          <h2
            className="text-[length:var(--text-subheading-size)] leading-snug font-bold text-text-strong"
            id="work-traits-heading"
          >
            {strings.heading}
          </h2>
          <p className="text-[length:var(--font-size-14)] text-text-muted">{strings.description}</p>
        </div>
        {readable && tasteById.size > 0 ? (
          <p
            aria-hidden="true"
            className="flex items-center gap-x-[var(--space-4)] text-[length:var(--text-caption-size)] text-text-muted"
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
        ) : null}
      </div>
      {!readable ? (
        <p className="text-text-muted">{strings.pending}</p>
      ) : (
        <div className="grid gap-x-[var(--space-8)] gap-y-[var(--space-6)] md:grid-cols-3">
          {TRAIT_GROUPS.map(([group, ids]) => {
            const groupKnown = ids.some((id) => work.axes[id].state === "known");
            return (
              <section
                aria-labelledby={`work-traits-${group}`}
                className="grid content-start gap-[var(--space-3)]"
                key={group}
              >
                <h3
                  className="text-[length:var(--font-size-16)] text-text-strong"
                  id={`work-traits-${group}`}
                >
                  {strings.groups[group]}
                </h3>
                {groupKnown ? (
                  <ul className="m-0 grid list-none gap-[var(--space-3)] p-0">
                    {ids.map((id) => {
                      const factor = work.axes[id];
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
                                    label: strings.tasteReference(
                                      tasteStrings.factorValue(tasteValue),
                                    ),
                                    value: tasteValue,
                                  }
                            }
                            revealReady
                            state={factor.state === "known" ? "known" : "unknown"}
                            unknownLabel={
                              factor.state === "notApplicable"
                                ? strings.notApplicable
                                : strings.unknown
                            }
                            value={factor.state === "known" ? factor.value : null}
                          />
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-[length:var(--font-size-14)] text-text-muted">
                    {strings.groupUnknown}
                  </p>
                )}
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}
