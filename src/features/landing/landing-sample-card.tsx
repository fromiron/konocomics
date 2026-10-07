import { Link } from "@tanstack/react-router";
import { useMemo, type CSSProperties } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { ReasonBubble } from "@/components/media/reason-bubble";
import { usePointerEffect } from "@/components/motion/use-pointer-effects";
import { generateTasteExplanation } from "@/domain/explanation";
import { explanationFactorLabel } from "@/lib/explanation-labels";
import { explanationLexicon, landingStrings } from "@/lib/strings";

import type { LandingSample } from "./landing-types";

type LandingSampleRecommendationProps = Readonly<{
  sample: LandingSample;
  coverUrl: string | null | undefined;
  onCoverVisible(): void;
  animateReason?: boolean;
}>;

/**
 * The example's lead reason and the other reasons' factor labels, generated from the stored
 * contributions exactly as on the recommendations page. `anchorTitle` is the anchor work the
 * lead reason names, located in its text so it can be set in bold.
 */
export function useSampleReason({ anchorWorks, recommendation }: LandingSample) {
  return useMemo(() => {
    const titles = new Map(anchorWorks.map((anchor) => [anchor.id, anchor.title] as const));
    const explanation = generateTasteExplanation({
      contributions: recommendation.contributions,
      confidenceLevel: recommendation.confidenceLevel,
      lexicon: explanationLexicon,
      resolveTitle: (workId) => titles.get(workId),
    });
    const [lead, ...rest] = explanation.positiveReasons;
    const anchorTitle =
      lead === undefined
        ? undefined
        : lead.anchorWorkIds
            .map((workId) => titles.get(workId))
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
    return { lead, anchorTitle, anchorIndex, otherLabels };
  }, [anchorWorks, recommendation]);
}

/** The lead reason as plain text, with the anchor work it names in bold. */
export function LeadReasonText({
  text,
  anchorTitle,
  anchorIndex,
  strongClassName,
}: Readonly<{
  text: string;
  anchorTitle: string | undefined;
  anchorIndex: number;
  strongClassName: string;
}>) {
  if (anchorTitle === undefined || anchorIndex < 0) return text;
  return (
    <>
      {text.slice(0, anchorIndex)}
      <strong className={strongClassName}>{anchorTitle}</strong>
      {text.slice(anchorIndex + anchorTitle.length)}
    </>
  );
}

/**
 * One real engine result for a fixed sample profile, shown as the last panel of the example
 * strip. Every reason is generated from the stored contributions, exactly as on the
 * recommendations page.
 */
export function LandingSampleRecommendation({
  coverUrl,
  onCoverVisible,
  sample,
  animateReason = false,
}: LandingSampleRecommendationProps) {
  const work = sample.recommendation.work;
  const glareRef = usePointerEffect<HTMLDivElement>("light");
  const { lead, anchorTitle, anchorIndex, otherLabels } = useSampleReason(sample);
  const characters =
    lead === undefined
      ? []
      : Array.from(new Intl.Segmenter("ja", { granularity: "grapheme" }).segment(lead.text));

  return (
    <div
      className="relative grid grid-cols-[7rem_minmax(0,1fr)] items-start gap-x-[var(--space-4)] gap-y-[var(--space-4)]"
      data-slot="landing-sample"
      ref={glareRef}
    >
      <span aria-hidden="true" className="pointer-glare" />
      <CoverImage
        className="w-[7rem]"
        coverUrl={coverUrl}
        creators={work.creators}
        onVisible={onCoverVisible}
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
      {/* The reason spans the panel under the cover, so a narrow panel never squeezes it. */}
      <div className="col-span-2 grid min-w-0 content-start gap-[var(--space-3)]">
        {lead === undefined ? null : (
          <ReasonBubble paperGrain>
            <p className="text-[length:var(--font-size-14)] leading-[var(--line-height-body)] text-text [word-break:auto-phrase]">
              <span className={animateReason ? "sr-only" : undefined}>
                <LeadReasonText
                  anchorIndex={anchorIndex}
                  anchorTitle={anchorTitle}
                  strongClassName="font-bold text-text-strong"
                  text={lead.text}
                />
              </span>
              {animateReason ? (
                <span
                  aria-hidden="true"
                  className="landing-typed-reason"
                  style={
                    {
                      "--type-step": `${Math.min(32, 1100 / Math.max(1, characters.length))}ms`,
                    } as CSSProperties
                  }
                >
                  {characters.map(({ segment, index }, order) => (
                    <span
                      className={
                        anchorTitle !== undefined &&
                        index >= anchorIndex &&
                        index < anchorIndex + anchorTitle.length
                          ? "font-bold text-text-strong"
                          : undefined
                      }
                      key={index}
                      style={{ "--type-index": order } as CSSProperties}
                    >
                      {segment}
                    </span>
                  ))}
                </span>
              ) : null}
            </p>
          </ReasonBubble>
        )}
        {otherLabels.length === 0 ? null : (
          <p className="text-[length:var(--text-caption-size)] text-text-muted">
            {otherLabels.join(" · ")}
          </p>
        )}
      </div>
    </div>
  );
}
