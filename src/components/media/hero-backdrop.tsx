"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import { coverSourceForSize } from "@/components/cover/CoverImage";
import { cn } from "@/lib/utils";

type HeroBackdropProps = Readonly<{
  coverUrl?: string | null;
  children: ReactNode;
  className?: string;
  priority?: boolean;
}>;

export function HeroBackdrop({
  children,
  className,
  coverUrl,
  priority = false,
}: HeroBackdropProps) {
  const source = coverUrl?.trim() ?? "";
  const fallbackSource = source === "" ? "" : coverSourceForSize(source, 200);
  const [failure, setFailure] = useState<{
    source: string;
    stage: "requested" | "fallback";
  } | null>(null);
  const failureStage = failure !== null && failure.source === source ? failure.stage : null;
  const currentSource = failureStage === "requested" ? fallbackSource : source;
  const showImage =
    currentSource !== "" &&
    failureStage !== "fallback" &&
    !(failureStage === "requested" && source === fallbackSource);

  return (
    <div
      className={cn("relative isolate overflow-hidden bg-canvas", className)}
      data-slot="hero-backdrop"
    >
      {showImage ? (
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-y-0 right-0 h-full w-[82%] scale-110 object-cover object-center opacity-60 blur-lg saturate-[0.9]"
          data-cover-source={currentSource}
          decoding="async"
          draggable={false}
          fetchPriority={priority ? "high" : "auto"}
          loading={priority ? "eager" : "lazy"}
          onError={() => {
            setFailure({
              source,
              stage: failureStage === "requested" ? "fallback" : "requested",
            });
          }}
          src={currentSource}
        />
      ) : null}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,var(--canvas)_0%,color-mix(in_oklch,var(--canvas)_92%,transparent)_36%,color-mix(in_oklch,var(--canvas)_46%,transparent)_74%,color-mix(in_oklch,var(--canvas)_62%,transparent)_100%)]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,var(--canvas)_2%,transparent_40%)]"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
