import { Link } from "@tanstack/react-router";

import { CoverImage } from "@/components/cover/CoverImage";
import type { Work } from "@/domain/catalog/types";
import type { MangaDnaSummary } from "@/domain/profile/dna-summary";
import { explanationLexicon, mediaStrings, tasteStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import { FactorBar } from "./factor-bar";

const AXES_OVERVIEW_LIMIT = 8;

export function DnaAxesOverview({
  animateReveal,
  axes,
  revealReady,
}: Readonly<
  Pick<MangaDnaSummary, "axes"> & {
    animateReveal: boolean;
    revealReady: boolean;
  }
>) {
  const confirmedAxes = axes
    .flatMap((axis) =>
      axis.state === "known" && axis.value !== null
        ? [{ factorId: axis.factorId, value: axis.value }]
        : [],
    )
    .sort(
      (left, right) =>
        right.value - left.value ||
        (left.factorId < right.factorId ? -1 : left.factorId > right.factorId ? 1 : 0),
    )
    .slice(0, AXES_OVERVIEW_LIMIT);

  return (
    <section
      aria-labelledby="taste-axes-heading"
      className="taste-axes grid content-start gap-[var(--space-3)]"
    >
      <h2
        className="text-[length:var(--text-subheading-size)] text-text-strong"
        id="taste-axes-heading"
      >
        {tasteStrings.axesHeading}
      </h2>
      {confirmedAxes.length === 0 ? (
        <p className="text-text-muted">{tasteStrings.axesPending}</p>
      ) : (
        <ul className="m-0 grid list-none grid-cols-1 gap-x-[var(--space-6)] gap-y-[var(--space-3)] p-0 sm:grid-cols-2">
          {confirmedAxes.map((axis, index) => (
            <li className="min-w-0" key={axis.factorId}>
              <FactorBar
                animateReveal={animateReveal}
                label={explanationLexicon.factorLabels[axis.factorId]}
                revealDelay={index * 0.06}
                revealReady={revealReady}
                state="known"
                value={axis.value}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function WorkPreviewList({
  coverUrls,
  ids,
  label,
  onCoverVisible,
  worksById,
}: Readonly<{
  ids: readonly string[];
  label: string;
  worksById: ReadonlyMap<string, Work>;
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverVisible(workId: string): void;
}>) {
  return (
    <section
      aria-label={label}
      className="taste-recommendation-preview__list grid min-w-0 content-start gap-[var(--space-content)]"
    >
      <h3 className="border-b border-line/70 pb-[var(--space-content-tight)] text-[length:var(--font-size-14)] text-text-strong">
        {label}
      </h3>
      {ids.length === 0 ? (
        <p className="text-text-muted">{tasteStrings.previewEmpty}</p>
      ) : (
        <ol className="m-0 grid list-none grid-cols-2 gap-[var(--space-content)] p-0 min-[360px]:grid-cols-4">
          {ids.map((workId) => {
            const work = worksById.get(workId);
            return (
              <li className="min-w-0" key={workId}>
                {work === undefined ? (
                  <p className="text-[length:var(--text-caption-size)] text-text-muted">
                    {tasteStrings.previewWorkUnavailable}
                  </p>
                ) : (
                  <Link
                    aria-label={mediaStrings.openDetails(work.title)}
                    className="group/preview grid min-h-[var(--control-min-size)] gap-[var(--space-content-tight)] rounded-[var(--radius-cover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    params={{ workId }}
                    preload={false}
                    to="/works/$workId"
                  >
                    <CoverImage
                      className="w-full"
                      coverUrl={coverUrls.get(workId)}
                      creators={work.creators}
                      decorative
                      onVisible={() => onCoverVisible(workId)}
                      requestedSize={200}
                      title={work.title}
                    />
                    <strong className="line-clamp-2 text-[length:var(--font-size-12)] leading-tight text-text-strong">
                      {work.title}
                    </strong>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

export function RecommendationDiffPreview({
  after,
  before,
  className,
  coverUrls,
  onCoverVisible,
  worksById,
}: Readonly<{
  after: readonly string[] | null;
  before: readonly string[] | null;
  className?: string;
  worksById: ReadonlyMap<string, Work>;
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverVisible(workId: string): void;
}>) {
  const available = before !== null && after !== null;
  const unchanged =
    available &&
    before.length === after.length &&
    before.every((workId, index) => workId === after[index]);

  return (
    <section
      aria-labelledby="taste-recommendation-preview-heading"
      className={cn("taste-recommendation-preview grid gap-[var(--space-3)]", className)}
    >
      <div className="grid gap-[var(--space-content-tight)]">
        <h2
          className="text-[length:var(--text-subheading-size)] text-text-strong"
          id="taste-recommendation-preview-heading"
        >
          {tasteStrings.previewHeading}
        </h2>
        <p className="text-[length:var(--font-size-12)] text-text-muted">
          {tasteStrings.previewDescription}
        </p>
      </div>
      {available && before.length === 0 && after.length === 0 ? (
        <p className="text-text-muted">{tasteStrings.previewEmpty}</p>
      ) : available ? (
        <div className="taste-recommendation-preview__body grid gap-[var(--space-content)]">
          <div className="taste-recommendation-preview__columns grid grid-cols-1 items-start gap-[var(--space-content-loose)] md:grid-cols-2">
            {unchanged ? null : (
              <WorkPreviewList
                coverUrls={coverUrls}
                ids={before}
                key="baseline"
                label={tasteStrings.previewBefore}
                onCoverVisible={onCoverVisible}
                worksById={worksById}
              />
            )}
            <WorkPreviewList
              coverUrls={coverUrls}
              ids={after}
              key="current"
              label={tasteStrings.previewAfter}
              onCoverVisible={onCoverVisible}
              worksById={worksById}
            />
          </div>
          <p
            aria-atomic="true"
            aria-live="polite"
            className="taste-recommendation-preview__status text-[length:var(--font-size-12)] font-bold text-text-muted"
          >
            {unchanged ? tasteStrings.previewUnchanged : tasteStrings.previewChanged}
          </p>
        </div>
      ) : (
        <p>{tasteStrings.previewUnavailable}</p>
      )}
    </section>
  );
}
