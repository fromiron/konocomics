import { Link } from "@tanstack/react-router";
import { useMemo } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { generateTasteExplanation } from "@/domain/explanation";
import { explanationFactorLabel } from "@/lib/explanation-labels";
import { explanationLexicon, landingStrings } from "@/lib/strings";

import type { LandingSample } from "./landing-types";

const CAPTION_ANCHOR_COUNT = 2;

type LandingSampleCardProps = Readonly<{
  sample: LandingSample;
  coverUrl: string | null | undefined;
  onCoverVisible(): void;
}>;

/**
 * One real engine result for a fixed sample profile, labelled as an example. Every reason is
 * generated from the stored contributions, exactly as on the recommendations page.
 */
export function LandingSampleCard({ coverUrl, onCoverVisible, sample }: LandingSampleCardProps) {
  const { anchorWorks, recommendation } = sample;
  const work = recommendation.work;
  const explanation = useMemo(() => {
    const titles = new Map(anchorWorks.map((anchor) => [anchor.id, anchor.title] as const));
    return generateTasteExplanation({
      contributions: recommendation.contributions,
      confidenceLevel: recommendation.confidenceLevel,
      lexicon: explanationLexicon,
      resolveTitle: (workId) => titles.get(workId),
    });
  }, [anchorWorks, recommendation]);

  const [lead, ...rest] = explanation.positiveReasons;
  const anchorTitle =
    lead === undefined
      ? undefined
      : lead.anchorWorkIds
          .map((workId) => anchorWorks.find((anchor) => anchor.id === workId)?.title)
          .find((title) => title !== undefined && lead.text.includes(title));
  const anchorIndex = anchorTitle === undefined ? -1 : (lead?.text.indexOf(anchorTitle) ?? -1);
  const leadLabel = lead === undefined ? undefined : explanationFactorLabel(lead.factorId);
  const otherLabels = [
    ...new Set(
      rest.flatMap((reason) => {
        const label = explanationFactorLabel(reason.factorId);
        return label === undefined || label === leadLabel ? [] : [label];
      }),
    ),
  ];

  return (
    <figure className="m-0 grid w-full max-w-[34rem] gap-[var(--space-3)] justify-self-center md:justify-self-end">
      <figcaption className="text-[length:var(--text-caption-size)] text-text-muted">
        {landingStrings.sample.caption(
          anchorWorks.slice(0, CAPTION_ANCHOR_COUNT).map((anchor) => anchor.title),
        )}
      </figcaption>
      <div
        className="grid grid-cols-[minmax(6.5rem,8rem)_minmax(0,1fr)] sm:grid-cols-[11rem_minmax(0,1fr)] sm:grid-rows-[auto_1fr] items-start gap-x-[var(--space-5)] gap-y-[var(--space-4)] rounded-[var(--radius-card)] border border-line bg-surface-1/90 p-[var(--space-5)] shadow-[var(--shadow-raised)]"
        data-slot="landing-sample"
      >
        <CoverImage
          className="sm:row-span-2 sm:w-[11rem]"
          coverUrl={coverUrl}
          creators={work.creators}
          onVisible={onCoverVisible}
          priority
          requestedSize={400}
          title={work.title}
        />
        <div className="grid min-w-0 content-start gap-[var(--space-content-tight)]">
          <p className="text-[length:var(--text-caption-size)] font-bold text-text-muted">
            {landingStrings.sample.label}
          </p>
          <Link
            aria-label={landingStrings.sample.detail(work.title)}
            className="w-fit rounded-[var(--radius-control)] text-[length:var(--text-subheading-size)] leading-tight font-bold text-text-strong underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            params={{ workId: work.id }}
            preload={false}
            to="/works/$workId"
          >
            {work.title}
          </Link>
          <p className="text-[length:var(--text-caption-size)] text-text-muted">
            {work.creators.join("・")}
          </p>
        </div>
        {/* On phones the reason spans the card instead of wrapping beside the cover. */}
        <div className="col-span-2 grid min-w-0 content-start gap-[var(--space-3)] sm:col-span-1 sm:col-start-2">
          {lead === undefined ? null : (
            <p className="text-[length:var(--font-size-14)] leading-[var(--line-height-body)] text-text [word-break:auto-phrase]">
              {anchorTitle === undefined || anchorIndex < 0 ? (
                lead.text
              ) : (
                <>
                  {lead.text.slice(0, anchorIndex)}
                  <strong className="font-bold text-text-strong">{anchorTitle}</strong>
                  {lead.text.slice(anchorIndex + anchorTitle.length)}
                </>
              )}
            </p>
          )}
          {otherLabels.length === 0 ? null : (
            <p className="text-[length:var(--text-caption-size)] text-text-muted">
              {otherLabels.join(" · ")}
            </p>
          )}
        </div>
      </div>
    </figure>
  );
}
