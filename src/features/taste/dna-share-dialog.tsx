"use client";

import { Link } from "@tanstack/react-router";
import { ExternalLinkIcon, LinkIcon, Share2Icon } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";

import { Button, buttonClassName } from "@/components/design-system/button";
import { ChoiceChipCheckbox } from "@/components/design-system/choice-chip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/design-system/dialog";
import type { Work } from "@/domain/catalog/types";
import { generateTasteExplanation } from "@/domain/explanation";
import {
  buildDnaShareLink,
  dnaShareWorkCandidates,
  formatDnaShareLinkSearch,
  type DnaShareLinkRecommendation,
} from "@/domain/profile/dna-share";
import type { MangaDnaSummary } from "@/domain/profile/dna-summary";
import type { RankedRecommendation } from "@/domain/recommendation/types";
import { explanationLexicon, tasteStrings } from "@/lib/strings";

const strings = tasteStrings.share;

type ShareSummary = Pick<MangaDnaSummary, "analyzedWorkIds" | "axes">;
type ShareRecommendationEntry = Pick<
  RankedRecommendation,
  "workId" | "contributions" | "confidenceLevel"
>;

function currentOrigin() {
  return typeof window === "undefined" ? "" : window.location.origin;
}

/**
 * Each recommendation keeps the factor of its first engine similarity reason, the same sentence
 * selection the recommendation cards use; without one, no reason chip is shared.
 */
function shareRecommendations(
  entries: readonly ShareRecommendationEntry[],
  worksById: ReadonlyMap<string, Work>,
): DnaShareLinkRecommendation[] {
  const resolveTitle = (workId: string) => worksById.get(workId)?.title;
  return entries.map((entry) => {
    const lead = generateTasteExplanation({
      contributions: entry.contributions,
      confidenceLevel: entry.confidenceLevel,
      lexicon: explanationLexicon,
      resolveTitle,
    }).positiveReasons.find(
      (sentence) =>
        sentence.source === "similarity" && sentence.axisPreferenceDirection !== "lower",
    );
    return lead === undefined
      ? { workId: entry.workId }
      : { workId: entry.workId, reasonFactorId: lead.factorId };
  });
}

export function DnaShareButton({
  ready = true,
  recommendations,
  summary,
  worksById,
}: Readonly<{
  recommendations: readonly ShareRecommendationEntry[];
  summary: ShareSummary;
  worksById: ReadonlyMap<string, Work>;
  ready?: boolean;
}>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="gap-[var(--space-2)] px-[var(--space-4)] font-bold"
        disabled={!ready}
        title={ready ? undefined : tasteStrings.previewLoading}
        onClick={() => setOpen(true)}
        type="button"
        variant="outline"
      >
        <Share2Icon aria-hidden="true" className="size-4" />
        {strings.open}
      </Button>
      <Dialog onOpenChange={setOpen} open={open}>
        {open && ready ? (
          <DnaShareDialogBody
            onClose={() => setOpen(false)}
            recommendations={recommendations}
            summary={summary}
            worksById={worksById}
          />
        ) : null}
      </Dialog>
    </>
  );
}

function DnaShareDialogBody({
  onClose,
  recommendations,
  summary,
  worksById,
}: Readonly<{
  onClose: () => void;
  recommendations: readonly ShareRecommendationEntry[];
  summary: ShareSummary;
  worksById: ReadonlyMap<string, Work>;
}>) {
  const titleId = useId();
  const descriptionId = useId();
  const previewHeadingId = useId();
  const linkInputId = useId();
  const candidateWorks = useMemo(
    () =>
      dnaShareWorkCandidates(summary).flatMap((workId): Work[] => {
        const work = worksById.get(workId);
        return work === undefined ? [] : [work];
      }),
    [summary, worksById],
  );
  const [publicWorkIds, setPublicWorkIds] = useState<ReadonlySet<string>>(
    () => new Set(candidateWorks.map((work) => work.id)),
  );
  const [status, setStatus] = useState("");
  const [copyFailed, setCopyFailed] = useState(false);
  const linkRecommendations = useMemo(
    () => shareRecommendations(recommendations, worksById),
    [recommendations, worksById],
  );
  const link = useMemo(
    () => buildDnaShareLink({ summary, publicWorkIds, recommendations: linkRecommendations }),
    [linkRecommendations, publicWorkIds, summary],
  );
  const shareUrl =
    link === null ? "" : `${currentOrigin()}/share?${formatDnaShareLinkSearch(link)}`;
  const canShareNatively =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyFailed(false);
      setStatus(strings.status.copied);
    } catch {
      setCopyFailed(true);
      setStatus(strings.status.copyFailed);
    }
  };

  useEffect(() => {
    if (!copyFailed) return;
    const input = document.getElementById(linkInputId);
    if (input instanceof HTMLInputElement) {
      input.focus();
      input.select();
    }
  }, [copyFailed, linkInputId]);

  const shareNatively = async () => {
    try {
      await navigator.share({ text: strings.shareText, url: shareUrl });
      // The share sheet finished; whether anything was posted is unknown, so it is not claimed.
      setStatus(strings.status.handedOff);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus(strings.status.shareFailed);
    }
  };

  return (
    <DialogContent
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      className="w-full max-w-[min(60rem,calc(100%-2rem))] p-0 sm:max-w-[min(60rem,calc(100%-2rem))]"
    >
      <div className="grid gap-[var(--space-5)] p-[var(--space-5)] md:p-[var(--space-7)]">
        <DialogHeader className="grid gap-[var(--space-1)] pe-[var(--space-8)]">
          <DialogTitle className="text-[length:var(--text-subheading-size)] font-bold" id={titleId}>
            {strings.title}
          </DialogTitle>
          <DialogDescription className="text-text-muted" id={descriptionId}>
            {strings.description}
          </DialogDescription>
        </DialogHeader>

        {link === null ? (
          <div className="grid justify-items-start gap-[var(--space-4)] rounded-[var(--radius-card)] border border-line bg-surface-2 p-[var(--space-5)]">
            <p className="text-text">{strings.empty}</p>
            <Link
              className="inline-flex min-h-[var(--control-min-size)] items-center font-bold text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              onClick={onClose}
              preload={false}
              to="/onboarding"
            >
              {strings.addWorks}
            </Link>
          </div>
        ) : (
          <div className="grid gap-[var(--space-6)] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start md:gap-[var(--space-8)]">
            <section
              aria-labelledby={previewHeadingId}
              className="grid gap-[var(--space-3)] rounded-[var(--radius-card)] border border-line bg-surface-2 p-[var(--space-5)]"
            >
              <h3
                className="text-[length:var(--text-caption-size)] font-bold text-text-muted"
                id={previewHeadingId}
              >
                {strings.previewHeading}
              </h3>
              <p className="taste-dna-statement">
                {link.topPositions.map((position, index) => {
                  const axis = link.axes[position];
                  return axis === undefined ? null : (
                    <span key={axis.axisId}>
                      {index === 0 ? null : (
                        <span className="px-[var(--space-2)] text-accent">×</span>
                      )}
                      {explanationLexicon.factorLabels[axis.axisId]}
                    </span>
                  );
                })}
              </p>
              <p className="text-[length:var(--font-size-14)] text-text-muted">
                {strings.previewBasis(link.analyzedWorkCount)}
              </p>
              {link.recommendations.length === 0 ? null : (
                <p className="text-[length:var(--font-size-14)] leading-[var(--line-height-body)] [overflow-wrap:anywhere] text-text">
                  {strings.previewRecommendations(
                    link.recommendations.flatMap((recommendation) => {
                      const title = worksById.get(recommendation.workId)?.title;
                      return title === undefined ? [] : [title];
                    }),
                  )}
                </p>
              )}
            </section>

            <div className="grid content-start gap-[var(--space-6)]">
              {candidateWorks.length === 0 ? null : (
                <fieldset className="m-0 grid min-w-0 gap-[var(--space-2)] border-0 p-0">
                  <legend className="mb-[var(--space-1)] p-0 font-bold text-text-strong">
                    {strings.worksLegend}
                  </legend>
                  <p className="text-[length:var(--text-caption-size)] leading-[var(--line-height-body)] text-text-muted">
                    {strings.worksHelp(link.analyzedWorkCount)}
                  </p>
                  <div className="flex flex-wrap gap-[var(--space-content)]">
                    {candidateWorks.map((work) => {
                      const checked = publicWorkIds.has(work.id);
                      return (
                        <ChoiceChipCheckbox
                          checked={checked}
                          chipClassName="max-w-[16rem] truncate"
                          key={work.id}
                          onCheckedChange={(nextChecked) => {
                            setCopyFailed(false);
                            setStatus("");
                            setPublicWorkIds((current) => {
                              const next = new Set(current);
                              if (nextChecked) next.add(work.id);
                              else next.delete(work.id);
                              return next;
                            });
                          }}
                          value={work.id}
                        >
                          {work.title}
                        </ChoiceChipCheckbox>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              <div className="grid gap-[var(--space-content)]">
                <Button
                  className="min-h-12 gap-[var(--space-2)] font-bold"
                  onClick={() => void copyLink()}
                  type="button"
                >
                  <LinkIcon aria-hidden="true" className="size-4" />
                  {strings.copy}
                </Button>
                <div className="flex flex-wrap gap-[var(--space-content)] [&>*]:flex-1">
                  <a
                    aria-label={strings.openPageNewTab}
                    className={buttonClassName({
                      className: "gap-[var(--space-2)] font-bold",
                      variant: "outline",
                    })}
                    href={shareUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <ExternalLinkIcon aria-hidden="true" className="size-4" />
                    {strings.openPage}
                  </a>
                  {canShareNatively ? (
                    <Button
                      className="gap-[var(--space-2)] font-bold"
                      onClick={() => void shareNatively()}
                      type="button"
                      variant="outline"
                    >
                      <Share2Icon aria-hidden="true" className="size-4" />
                      {strings.shareSheet}
                    </Button>
                  ) : null}
                </div>
                {copyFailed ? (
                  <div className="grid gap-[var(--space-1)]">
                    <label
                      className="text-[length:var(--text-caption-size)] font-bold text-text-muted"
                      htmlFor={linkInputId}
                    >
                      {strings.linkLabel}
                    </label>
                    <input
                      className="min-h-[var(--control-min-size)] w-full rounded-[var(--radius-control)] border border-line bg-surface-2 px-[var(--space-3)] text-[length:var(--font-size-14)] text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      id={linkInputId}
                      onFocus={(event) => event.currentTarget.select()}
                      readOnly
                      value={shareUrl}
                    />
                  </div>
                ) : null}
                <p
                  aria-atomic="true"
                  aria-live="polite"
                  className="min-h-[1.5em] text-[length:var(--font-size-14)] font-bold text-text"
                >
                  {status}
                </p>
              </div>

              <p className="border-t border-line pt-[var(--space-4)] text-[length:var(--text-caption-size)] leading-[var(--line-height-body)] text-text-muted">
                {strings.privacy}
              </p>
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  );
}
