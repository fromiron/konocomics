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
        <div className={cn("cover-image cover-image--hero", className)}>
          <div
            aria-hidden={decorative || undefined}
            aria-label={decorative ? undefined : coverStrings.placeholderLabel(title, creatorLine)}
            className="cover-image__hero-frame cover-image--placeholder"
            role={decorative ? undefined : "img"}
          >
            <span aria-hidden="true" className="cover-image__placeholder-content">
              <span aria-hidden="true" className="cover-image__screentone" />
              <span className="cover-image__placeholder-title">{title}</span>
              <span className="cover-image__placeholder-creator">{creatorLine}</span>
            </span>
          </div>
        </div>
      );
    }

    return (
      <div
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : coverStrings.placeholderLabel(title, creatorLine)}
        className={cn("cover-image cover-image--placeholder", className)}
        role={decorative ? undefined : "img"}
      >
        <span aria-hidden="true" className="cover-image__placeholder-content">
          <span aria-hidden="true" className="cover-image__screentone" />
          <span className="cover-image__placeholder-title">{title}</span>
          <span className="cover-image__placeholder-creator">{creatorLine}</span>
        </span>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className={cn("cover-image cover-image--hero", className)}>
        {/* The decorative and informative images intentionally share one current source. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          aria-hidden="true"
          className="cover-image__hero-blur"
          data-cover-source={currentSource}
          src={currentSource}
        />
        <span aria-hidden="true" className="cover-image__hero-paper" />
        <div className="cover-image__hero-frame">
          {loaded ? null : <span aria-hidden="true" className="cover-image__skeleton" />}
          {/* Provider URLs are dynamic, so next/image cannot safely enumerate their hosts. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={decorative ? "" : coverStrings.alt(title)}
            className="cover-image__image"
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
    <div className={cn("cover-image", className)}>
      {loaded ? null : <span aria-hidden="true" className="cover-image__skeleton" />}
      {/* Provider URLs are dynamic, so next/image cannot safely enumerate their hosts. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={decorative ? "" : coverStrings.alt(title)}
        className="cover-image__image"
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
  );
}
