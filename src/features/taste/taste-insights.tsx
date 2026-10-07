import { Link } from "@tanstack/react-router";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/design-system/button";

import { CoverImage } from "@/components/cover/CoverImage";
import type { Work } from "@/domain/catalog/types";
import { mediaStrings, tasteStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

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
  loading = false,
  failed = false,
  onRetry,
  after,
  before,
  className,
  coverUrls,
  onCoverVisible,
  worksById,
}: Readonly<{
  loading?: boolean;
  failed?: boolean;
  onRetry?: () => void;
  after: readonly string[] | null;
  before: readonly string[] | null;
  className?: string;
  worksById: ReadonlyMap<string, Work>;
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverVisible(workId: string): void;
}>) {
  const [unchangedExpanded, setUnchangedExpanded] = useState(false);
  const available = !failed && before !== null && after !== null;
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
      {loading ? <p aria-live="polite">{tasteStrings.previewLoading}</p> : null}
      {available && before.length === 0 && after.length === 0 ? (
        <p className="text-text-muted">{tasteStrings.previewEmpty}</p>
      ) : available ? (
        <div className="taste-recommendation-preview__body grid gap-[var(--space-3)]">
          <div
            className={cn(
              "taste-recommendation-preview__note flex items-start gap-[var(--space-3)]",
              unchanged &&
                "rounded-[var(--radius-card)] border border-accent/25 bg-accent/5 p-[var(--space-4)]",
            )}
          >
            {unchanged ? (
              <span
                aria-hidden="true"
                className="mt-[var(--space-2)] size-2 shrink-0 rounded-full bg-accent"
              />
            ) : null}
            <div className="grid gap-[var(--space-1)]">
              <p
                aria-atomic="true"
                aria-live="polite"
                className="taste-recommendation-preview__status text-[length:var(--font-size-14)] text-text"
              >
                {unchanged ? tasteStrings.previewUnchanged : tasteStrings.previewChanged}
              </p>
              {unchanged ? (
                <p className="text-[length:var(--text-caption-size)] text-text-muted">
                  {tasteStrings.previewUnchangedHint}
                </p>
              ) : null}
            </div>
          </div>
          {unchanged ? (
            <Button
              aria-controls="taste-recommendation-preview-lists"
              aria-expanded={unchangedExpanded}
              className="w-fit gap-[var(--space-2)] px-0 text-accent-ink"
              onClick={() => setUnchangedExpanded((open) => !open)}
              type="button"
              variant="ghost"
            >
              {unchangedExpanded ? tasteStrings.previewCollapse : tasteStrings.previewExpand}
              <ChevronDownIcon
                aria-hidden="true"
                className={cn(
                  "size-4 transition-transform duration-[var(--motion-duration-feedback)] motion-reduce:transition-none",
                  unchangedExpanded && "rotate-180",
                )}
              />
            </Button>
          ) : null}
          <div
            className="taste-recommendation-preview__columns grid grid-cols-1 items-start gap-[var(--space-6)] md:grid-cols-2"
            hidden={unchanged && !unchangedExpanded}
            id="taste-recommendation-preview-lists"
          >
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
        </div>
      ) : loading ? null : (
        <div>
          <p role="status">{tasteStrings.previewUnavailable}</p>
          {onRetry === undefined ? null : (
            <Button onClick={onRetry}>{tasteStrings.previewRetry}</Button>
          )}
        </div>
      )}
    </section>
  );
}
