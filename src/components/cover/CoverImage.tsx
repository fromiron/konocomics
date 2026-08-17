"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { coverStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

export type CoverImageSize = 200 | 400 | 600;

export type CoverImageProps = Readonly<{
  title: string;
  creators: readonly string[];
  coverUrl?: string | null;
  requestedSize?: CoverImageSize;
  priority?: boolean;
  className?: string;
  decorative?: boolean;
  variant?: "standard" | "hero";
  onSettled?: () => void;
}>;

type FailureState = Readonly<{
  primarySource: string;
  stage: "requested" | "fallback";
}>;

export function coverSourceForSize(source: string, size: CoverImageSize) {
  if (/^(?:blob|data):/iu.test(source)) {
    return source;
  }

  const hashIndex = source.indexOf("#");
  const base = hashIndex === -1 ? source : source.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : source.slice(hashIndex);
  const sizeValue = `${size}x${size}`;
  const sizedBase = /([?&])_ex=[^&#]*/u.test(base)
    ? base.replace(/([?&])_ex=[^&#]*/u, `$1_ex=${sizeValue}`)
    : `${base}${base.includes("?") ? "&" : "?"}_ex=${sizeValue}`;

  return `${sizedBase}${hash}`;
}

export function CoverImage({
  title,
  creators,
  coverUrl,
  requestedSize = 400,
  priority = false,
  className,
  decorative = false,
  variant = "standard",
  onSettled,
}: CoverImageProps) {
  const normalizedCoverUrl = coverUrl?.trim() ?? "";
  const requestedSource = normalizedCoverUrl
    ? coverSourceForSize(normalizedCoverUrl, requestedSize)
    : "";
  const fallbackSource = normalizedCoverUrl ? coverSourceForSize(normalizedCoverUrl, 200) : "";
  const [failure, setFailure] = useState<FailureState | null>(null);
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const settledSourceRef = useRef<string | null>(null);
  const failureStage = failure?.primarySource === requestedSource ? failure.stage : null;
  const requestedAndFallbackMatch = requestedSource === fallbackSource;
  const showPlaceholder =
    !requestedSource ||
    failureStage === "fallback" ||
    (failureStage === "requested" && requestedAndFallbackMatch);
  const currentSource = failureStage === "requested" ? fallbackSource : requestedSource;
  const loaded = loadedSource === currentSource;
  const creatorLine = coverStrings.creatorLine(creators);
  const notifySettled = useCallback(() => {
    if (onSettled === undefined || settledSourceRef.current === requestedSource) return;
    settledSourceRef.current = requestedSource;
    onSettled();
  }, [onSettled, requestedSource]);

  useEffect(() => {
    if (showPlaceholder || loaded) notifySettled();
  }, [loaded, notifySettled, showPlaceholder]);

  if (showPlaceholder) {
    if (variant === "hero") {
      return (
        <div
          className={cn(
            "cover-image cover-image--hero relative isolate grid h-[40vh] max-h-[40vh] w-full place-items-center overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-1",
            className,
          )}
        >
          <div
            aria-hidden={decorative || undefined}
            aria-label={decorative ? undefined : coverStrings.placeholderLabel(title, creatorLine)}
            className="cover-image__hero-frame cover-image--placeholder relative z-10 h-[calc(100%-var(--space-8))] w-auto max-w-[calc(100%-var(--space-8))] overflow-hidden rounded-[var(--radius-cover)] border border-line bg-surface-1 text-text-muted shadow-[var(--shadow-raised)] aspect-[30/43]"
            role={decorative ? undefined : "img"}
          >
            <span
              aria-hidden="true"
              className="cover-image__placeholder-content absolute inset-0 grid place-items-center"
            >
              <span
                aria-hidden="true"
                className="cover-image__screentone absolute top-0 right-0 h-[30%] w-[42%] bg-[radial-gradient(color-mix(in_oklch,var(--text-strong)_8%,transparent)_1px,transparent_1px)] [background-size:12px_12px]"
              />
              <span className="cover-image__placeholder-title relative z-10 line-clamp-2 w-[72%] text-center text-[length:var(--font-size-14)] leading-[1.55] font-medium tracking-[0.06em] text-balance text-text-muted">
                {title}
              </span>
              <span className="cover-image__placeholder-creator absolute right-[var(--space-3)] bottom-[var(--space-3)] left-[var(--space-3)] z-10 truncate text-[length:var(--text-caption-size)] leading-[1.4]">
                {creatorLine}
              </span>
            </span>
          </div>
        </div>
      );
    }

    return (
      <span
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : coverStrings.placeholderLabel(title, creatorLine)}
        className={cn(
          "cover-image cover-image--placeholder relative isolate block w-full overflow-hidden rounded-[var(--radius-cover)] border border-line bg-surface-1 text-text-muted aspect-[30/43]",
          className,
        )}
        role={decorative ? undefined : "img"}
      >
        <span
          aria-hidden="true"
          className="cover-image__placeholder-content absolute inset-0 grid place-items-center"
        >
          <span
            aria-hidden="true"
            className="cover-image__screentone absolute top-0 right-0 h-[30%] w-[42%] bg-[radial-gradient(color-mix(in_oklch,var(--text-strong)_8%,transparent)_1px,transparent_1px)] [background-size:12px_12px]"
          />
          <span className="cover-image__placeholder-title relative z-10 line-clamp-2 w-[72%] text-center text-[length:var(--font-size-14)] leading-[1.55] font-medium tracking-[0.06em] text-balance text-text-muted">
            {title}
          </span>
          <span className="cover-image__placeholder-creator absolute right-[var(--space-3)] bottom-[var(--space-3)] left-[var(--space-3)] z-10 truncate text-[length:var(--text-caption-size)] leading-[1.4]">
            {creatorLine}
          </span>
        </span>
      </span>
    );
  }

  if (variant === "hero") {
    return (
      <div
        className={cn(
          "cover-image cover-image--hero relative isolate grid h-[40vh] max-h-[40vh] w-full place-items-center overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-1",
          className,
        )}
      >
        {/* The decorative and informative images intentionally share one current source. */}
        <img
          alt=""
          aria-hidden="true"
          className="cover-image__hero-blur pointer-events-none absolute inset-0 size-full scale-125 object-cover opacity-30 blur-[var(--space-12)]"
          data-cover-source={currentSource}
          src={currentSource}
        />
        <span
          aria-hidden="true"
          className="cover-image__hero-paper pointer-events-none absolute inset-0 z-0 bg-cover-paper"
        />
        <div className="cover-image__hero-frame relative z-10 h-[calc(100%-var(--space-8))] w-auto max-w-[calc(100%-var(--space-8))] overflow-hidden rounded-[var(--radius-cover)] border border-line bg-surface-1 shadow-[var(--shadow-raised)] aspect-[30/43]">
          {loaded ? null : (
            <span
              aria-hidden="true"
              className="cover-image__skeleton absolute inset-0 bg-line motion-safe:[animation:cover-skeleton-pulse_1.2s_ease-in-out_infinite_alternate] motion-reduce:opacity-65"
            />
          )}
          <img
            alt={decorative ? "" : coverStrings.alt(title)}
            className="cover-image__image absolute inset-0 size-full object-contain"
            data-cover-source={currentSource}
            data-loaded={loaded ? "true" : "false"}
            decoding={priority ? "sync" : "async"}
            draggable={false}
            fetchPriority={priority ? "high" : "auto"}
            height={Math.round((requestedSize * 43) / 30)}
            loading={priority ? "eager" : "lazy"}
            onError={() => {
              setFailure({
                primarySource: requestedSource,
                stage: failureStage === "requested" ? "fallback" : "requested",
              });
            }}
            onLoad={() => {
              setLoadedSource(currentSource);
            }}
            src={currentSource}
            width={requestedSize}
          />
        </div>
      </div>
    );
  }

  return (
    <span
      className={cn(
        "cover-image relative isolate block w-full overflow-hidden rounded-[var(--radius-cover)] border border-line bg-surface-1 aspect-[30/43]",
        className,
      )}
    >
      {loaded ? null : (
        <span
          aria-hidden="true"
          className="cover-image__skeleton absolute inset-0 bg-line motion-safe:[animation:cover-skeleton-pulse_1.2s_ease-in-out_infinite_alternate] motion-reduce:opacity-65"
        />
      )}
      <img
        alt={decorative ? "" : coverStrings.alt(title)}
        className="cover-image__image absolute inset-0 size-full object-contain"
        data-loaded={loaded ? "true" : "false"}
        decoding={priority ? "sync" : "async"}
        draggable={false}
        fetchPriority={priority ? "high" : "auto"}
        height={Math.round((requestedSize * 43) / 30)}
        loading={priority ? "eager" : "lazy"}
        onError={() => {
          setFailure({
            primarySource: requestedSource,
            stage: failureStage === "requested" ? "fallback" : "requested",
          });
        }}
        onLoad={() => {
          setLoadedSource(currentSource);
        }}
        src={currentSource}
        width={requestedSize}
      />
    </span>
  );
}
