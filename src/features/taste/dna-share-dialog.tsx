"use client";

import { Link } from "@tanstack/react-router";
import { DownloadIcon, LinkIcon, Share2Icon } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { Button } from "@/components/design-system/button";
import { ChoiceChipCheckbox } from "@/components/design-system/choice-chip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/design-system/dialog";
import type { Work } from "@/domain/catalog/types";
import type { ExplanationFactorId } from "@/domain/explanation";
import { buildDnaShareCard, dnaShareWorkCandidates } from "@/domain/profile/dna-share";
import type { MangaDnaSummary } from "@/domain/profile/dna-summary";
import { shareEntryUrl } from "@/features/landing/entry-source";
import { explanationLexicon, tasteStrings } from "@/lib/strings";

import {
  DNA_SHARE_IMAGE_HEIGHT,
  DNA_SHARE_IMAGE_WIDTH,
  type DnaShareImageText,
  renderDnaShareImage,
} from "./dna-share-image";

const strings = tasteStrings.share;
const IMAGE_FILE_NAME = "manga-dna.png";

type ShareSummary = Pick<MangaDnaSummary, "analyzedWorkIds" | "axes" | "topPreferences">;

type ImageState =
  | Readonly<{ phase: "idle" | "rendering" }>
  | Readonly<{ phase: "ready"; blob: Blob; url: string; key: string }>
  | Readonly<{ phase: "failed" }>;

function factorLabel(factorId: ExplanationFactorId) {
  return explanationLexicon.factorLabels[factorId];
}

function currentOrigin() {
  return typeof window === "undefined" ? "" : window.location.origin;
}

export function DnaShareButton({
  summary,
  worksById,
}: Readonly<{
  summary: ShareSummary;
  worksById: ReadonlyMap<string, Work>;
}>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="gap-[var(--space-2)] px-[var(--space-4)] font-bold"
        onClick={() => setOpen(true)}
        type="button"
        variant="outline"
      >
        <Share2Icon aria-hidden="true" className="size-4" />
        {strings.open}
      </Button>
      <Dialog onOpenChange={setOpen} open={open}>
        {open ? (
          <DnaShareDialogBody
            onClose={() => setOpen(false)}
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
  summary,
  worksById,
}: Readonly<{
  onClose: () => void;
  summary: ShareSummary;
  worksById: ReadonlyMap<string, Work>;
}>) {
  const titleId = useId();
  const descriptionId = useId();
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
  const [image, setImage] = useState<ImageState>({ phase: "idle" });
  const [status, setStatus] = useState("");
  const [copyFailed, setCopyFailed] = useState(false);
  const [renderAttempt, setRenderAttempt] = useState(0);
  const imageUrlRef = useRef<string | null>(null);
  const shareUrl = shareEntryUrl(currentOrigin());
  const card = useMemo(() => buildDnaShareCard(summary, publicWorkIds), [publicWorkIds, summary]);

  const imageText = useMemo((): DnaShareImageText | null => {
    if (card === null) return null;
    const namedTitles = card.namedWorkIds.flatMap((workId) => {
      const title = worksById.get(workId)?.title;
      return title === undefined ? [] : [title];
    });
    return {
      brand: strings.image.brand,
      kicker: strings.image.kicker,
      eyebrow: strings.image.eyebrow,
      preferences: card.preferences.map((preference) => ({
        label: factorLabel(preference.factorId),
        value: preference.value,
      })),
      analyzedCount: card.analyzedWorkCount,
      analyzedUnit: strings.image.analyzedUnit,
      works: {
        heading: strings.image.worksHeading,
        titles: namedTitles,
        moreLabel: strings.image.moreWorks,
      },
      ...(card.restrainedAxes.length === 0
        ? {}
        : {
            restrained: {
              heading: strings.image.restrainedHeading,
              rows: card.restrainedAxes.map((axis) => ({
                label: factorLabel(axis.axisId),
                value: axis.value,
              })),
            },
          }),
      footerLead: strings.image.footerLead,
      footerLink: new URL(shareUrl).host,
    };
  }, [card, shareUrl, worksById]);
  const imageKey = imageText === null ? "" : JSON.stringify([imageText, renderAttempt]);

  useEffect(() => {
    if (imageText === null) return;
    let active = true;
    // Rebuild only after edits settle, so toggling several works renders once.
    const timer = window.setTimeout(() => {
      setImage((current) => (current.phase === "ready" ? current : { phase: "rendering" }));
      renderDnaShareImage(imageText).then(
        (blob) => {
          if (!active) return;
          const url = URL.createObjectURL(blob);
          if (imageUrlRef.current !== null) URL.revokeObjectURL(imageUrlRef.current);
          imageUrlRef.current = url;
          setImage({ phase: "ready", blob, url, key: imageKey });
        },
        () => {
          if (active) setImage({ phase: "failed" });
        },
      );
    }, 120);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [imageKey, imageText]);

  useEffect(
    () => () => {
      if (imageUrlRef.current !== null) URL.revokeObjectURL(imageUrlRef.current);
    },
    [],
  );

  const imageCurrent = image.phase === "ready" && image.key === imageKey;
  const canShareNatively =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const saveImage = () => {
    if (image.phase !== "ready") return;
    const link = document.createElement("a");
    link.href = image.url;
    link.download = IMAGE_FILE_NAME;
    document.body.append(link);
    link.click();
    link.remove();
    setStatus(strings.status.saved);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${strings.shareText}\n${shareUrl}`);
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
    const file =
      image.phase === "ready"
        ? new File([image.blob], IMAGE_FILE_NAME, { type: "image/png" })
        : null;
    const withFile = file !== null && navigator.canShare?.({ files: [file] }) === true;
    try {
      await navigator.share(
        withFile
          ? { files: [file], text: strings.shareText, url: shareUrl }
          : { text: strings.shareText, url: shareUrl },
      );
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

        {card === null ? (
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
          <div className="grid gap-[var(--space-6)] md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-start md:gap-[var(--space-8)]">
            <figure className="m-0">
              <div
                aria-busy={!imageCurrent && image.phase !== "failed"}
                className="relative mx-auto w-full max-w-[26rem] overflow-hidden rounded-[var(--radius-card)] bg-surface-2 shadow-[var(--shadow-raised)]"
                style={{
                  aspectRatio: `${String(DNA_SHARE_IMAGE_WIDTH)} / ${String(DNA_SHARE_IMAGE_HEIGHT)}`,
                }}
              >
                {image.phase === "ready" ? (
                  <img
                    alt={strings.previewAlt}
                    className="block size-full object-contain transition-opacity duration-[var(--motion-duration-value)] motion-reduce:transition-none"
                    height={DNA_SHARE_IMAGE_HEIGHT}
                    src={image.url}
                    style={{ opacity: imageCurrent ? 1 : 0.55 }}
                    width={DNA_SHARE_IMAGE_WIDTH}
                  />
                ) : image.phase === "failed" ? (
                  <div className="grid size-full place-content-center justify-items-center gap-[var(--space-3)] p-[var(--space-5)] text-center">
                    <p className="text-text">{strings.renderFailed}</p>
                    <Button
                      onClick={() => {
                        setImage({ phase: "idle" });
                        setRenderAttempt((value) => value + 1);
                      }}
                      type="button"
                      variant="outline"
                    >
                      {strings.retry}
                    </Button>
                  </div>
                ) : (
                  <div
                    aria-hidden="true"
                    className="size-full animate-pulse bg-surface-3 motion-reduce:animate-none"
                  />
                )}
              </div>
              <figcaption className="sr-only">{strings.previewCaption}</figcaption>
            </figure>

            <div className="grid content-start gap-[var(--space-6)]">
              {candidateWorks.length === 0 ? null : (
                <fieldset className="m-0 grid min-w-0 gap-[var(--space-2)] border-0 p-0">
                  <legend className="mb-[var(--space-1)] p-0 font-bold text-text-strong">
                    {strings.worksLegend}
                  </legend>
                  <p className="text-[length:var(--text-caption-size)] leading-[var(--line-height-body)] text-text-muted">
                    {strings.worksHelp(card.analyzedWorkCount)}
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
                  disabled={!imageCurrent}
                  onClick={saveImage}
                  type="button"
                >
                  <DownloadIcon aria-hidden="true" className="size-4" />
                  {strings.save}
                </Button>
                <div className="flex flex-wrap gap-[var(--space-content)] [&>button]:flex-1">
                  <Button
                    className="gap-[var(--space-2)] font-bold"
                    onClick={() => void copyLink()}
                    type="button"
                    variant="outline"
                  >
                    <LinkIcon aria-hidden="true" className="size-4" />
                    {strings.copy}
                  </Button>
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
