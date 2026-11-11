"use client";

import { Link } from "@tanstack/react-router";
import { useId, useState } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { ChoiceChipRadio, ChoiceChipRadioGroup } from "@/components/design-system/choice-chip";
import { CoverBackdrop } from "@/components/media/cover-backdrop";
import { LeadReasonText } from "@/components/media/lead-reason-text";
import { ReasonBubble } from "@/components/media/reason-bubble";
import { landingStrings, mediaStrings, recommendationStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import type { LandingSample } from "./landing-types";
import type { SampleReason } from "./sample-reason";

type HomeEvidenceStageProps = Readonly<{
  sample: LandingSample;
  reasons: ReadonlyMap<string, SampleReason>;
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverVisible(workId: string): void;
  className?: string;
}>;

/**
 * The hero's evidence stage (03 §1): the sample taste's five works, the reason the engine gave in
 * a paper bubble, and the recommended work's cover, read in the order of the work detail's
 * 「あなたとの相性」. A radio group switches between the sample's top three recommendations; every
 * scene stays mounted in one grid cell so the switch is a cross-fade (`.hero-stage__layer`) and
 * the stage never changes size. The selection is local state only: no URL, no storage.
 */
export function HomeEvidenceStage({
  className,
  coverUrls,
  onCoverVisible,
  reasons,
  sample,
}: HomeEvidenceStageProps) {
  const labelId = useId();
  const [selectedWorkId, setSelectedWorkId] = useState(sample.stage[0].work.id);
  const selectedIndex = Math.max(
    0,
    sample.stage.findIndex(({ work }) => work.id === selectedWorkId),
  );
  // Only the sample work the current lead reason names is marked; without one, none is.
  const namedAnchorId = reasons.get(selectedWorkId)?.anchorWorkId;

  return (
    <figure
      aria-labelledby={labelId}
      className={cn(
        // `clip`, not `hidden`: the scaled backdrop overflows the frame, and a scroll container
        // would let focusing a radio scroll the stage's contents out of place.
        "hero-stage relative isolate overflow-clip rounded-[var(--radius-card)] border border-line/70",
        className,
      )}
    >
      {/* The selected cover, blurred, tints the stage; each backdrop fades with its scene. */}
      <div aria-hidden="true" className="absolute inset-0">
        {sample.stage.map(({ work }) => (
          <div
            className="hero-stage__layer absolute inset-0"
            data-selected={work.id === selectedWorkId || undefined}
            key={work.id}
          >
            <CoverBackdrop coverUrl={coverUrls.get(work.id)} />
          </div>
        ))}
      </div>
      <div className="hero-stage__body">
        <div className="grid gap-[var(--space-2)]">
          <p
            className="text-[length:var(--text-caption-size)] leading-[1.4] text-text-muted"
            id={labelId}
          >
            {landingStrings.hero.stageLabel}
          </p>
          <ul className="flex gap-[var(--space-2)] lg:gap-[var(--space-3)]">
            {sample.anchorWorks.map((anchor) => {
              const named = anchor.id === namedAnchorId;
              return (
                <li
                  className="hero-stage__anchor"
                  data-landing-anchor-work-id={anchor.id}
                  data-muted={(namedAnchorId !== undefined && !named) || undefined}
                  data-named={named || undefined}
                  key={anchor.id}
                >
                  {/* The stage is always on the first screen: its covers are never lazy (04 §4.1). */}
                  <CoverImage
                    coverUrl={coverUrls.get(anchor.id)}
                    creators={anchor.creators}
                    onVisible={() => onCoverVisible(anchor.id)}
                    priority
                    requestedSize={200}
                    title={anchor.title}
                  />
                </li>
              );
            })}
          </ul>
        </div>
        <div className="hero-stage__scenes">
          {sample.stage.map(({ work }, index) => {
            const selected = work.id === selectedWorkId;
            const reason = reasons.get(work.id);
            return (
              // The bubble sits left of the cover, so its side tail points right, at the cover.
              <div
                aria-hidden={selected ? undefined : true}
                className="hero-stage__layer hero-stage__scene-layer"
                data-expansion-side="left"
                data-landing-stage-work-id={work.id}
                data-selected={selected || undefined}
                inert={!selected}
                key={work.id}
              >
                <div className="hero-stage__scene">
                  <ReasonBubble className="hero-stage__bubble" tail="side">
                    <p className="hero-stage__reason text-text">
                      <LeadReasonText
                        anchorIndex={reason?.anchorIndex ?? -1}
                        anchorTitle={reason?.anchorTitle}
                        strongClassName="font-bold text-text-strong"
                        text={reason?.text ?? recommendationStrings.reasonUnavailable}
                      />
                    </p>
                  </ReasonBubble>
                  <Link
                    aria-label={mediaStrings.openDetails(work.title)}
                    className="hero-stage__cover block w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                    params={{ workId: work.id }}
                    preload={false}
                    to="/works/$workId"
                  >
                    <CoverImage
                      className="shadow-[var(--shadow-cover-featured)]"
                      coverUrl={coverUrls.get(work.id)}
                      creators={work.creators}
                      eager
                      matchSourceAspectRatio
                      onVisible={() => onCoverVisible(work.id)}
                      priority={index === 0}
                      requestedSize={400}
                      title={work.title}
                    />
                  </Link>
                  <div className="hero-stage__meta grid min-w-0 gap-[var(--space-1)]">
                    <p className="line-clamp-2 text-[length:var(--font-size-16)] leading-[var(--line-height-heading)] font-bold text-text-strong lg:text-[length:var(--font-size-20)]">
                      {work.title}
                    </p>
                    <p className="truncate text-[length:var(--text-caption-size)] leading-[1.4] text-text-muted">
                      {work.creators.join("・")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-[var(--space-3)]">
          <ChoiceChipRadioGroup<string>
            aria-label={landingStrings.hero.stageSelectorLabel}
            className="w-auto flex-nowrap gap-[var(--space-1)]"
            onValueChange={(workId) => setSelectedWorkId(workId)}
            value={selectedWorkId}
          >
            {sample.stage.map(({ work }) => (
              <ChoiceChipRadio<string>
                aria-label={work.title}
                chipClassName="hero-stage__pick rounded-[var(--radius-cover-selection)] border-0 bg-transparent p-[2px] opacity-60 peer-data-checked:bg-accent peer-data-checked:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover/choice:opacity-100"
                key={work.id}
                value={work.id}
              >
                <CoverImage
                  className="w-[var(--hero-stage-pick-width)]"
                  coverUrl={coverUrls.get(work.id)}
                  creators={work.creators}
                  decorative
                  eager
                  onVisible={() => onCoverVisible(work.id)}
                  requestedSize={200}
                  title={work.title}
                />
              </ChoiceChipRadio>
            ))}
          </ChoiceChipRadioGroup>
          {/* The radios already tell assistive technology their position. */}
          <p
            aria-hidden="true"
            className="text-[length:var(--text-caption-size)] text-text-muted [font-feature-settings:'tnum']"
          >
            {landingStrings.hero.stagePosition(selectedIndex + 1, sample.stage.length)}
          </p>
        </div>
      </div>
    </figure>
  );
}
